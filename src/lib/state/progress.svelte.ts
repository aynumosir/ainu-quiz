import { browser } from '$app/environment';
import { leagueForXp } from '$lib/state/league';

/**
 * Gamification + learning state for tu itak. Single source of truth, persisted
 * to localStorage. Pure state + primitives; per-node path states (locked/active/
 * done) are derived against the course in the path layer.
 */

const STORAGE_KEY = 'tu-itak:progress:v1';

/** Hearts you start each lesson attempt with. Per-lesson, not a global pool:
 *  running out fails only the current lesson (retry or spend gems to continue). */
export const LESSON_HEARTS = 3;
/** Gems to refill hearts and keep going. Kept attainable: a few lessons' worth (see GEMS_PER_LESSON). */
export const HEART_REFILL_GEMS = 50;
/** Gems earned for finishing a node (lessons reward more than reviews/stories). */
export const GEMS_PER_LESSON = 8;
export const GEMS_PER_REVIEW = 5;
/** XP awarded for finishing a fresh lesson node (review nodes give less). */
export const XP_PER_LESSON = 15;
export const XP_PER_REVIEW = 8;

export interface NodeProgress {
	/** Sub-levels completed (a node is "crowned" when level >= node.levels). */
	level: number;
	legendaryDone?: boolean;
}

export interface WordStat {
	/** 0..1 memory strength (spaced-repetition). */
	strength: number;
	seen: number;
	correct: number;
	lastSeen: number;
}

export interface MistakeItem {
	/** A sentence or a vocab item the learner got wrong, queued for review. */
	sentenceId?: string;
	vocabId?: string;
}

interface Persisted {
	xp: number;
	gems: number;
	streak: number;
	lastActiveDate: string | null;
	dailyGoal: number;
	todayXp: number;
	todayDate: string | null;
	weeklyXp: number;
	league: number;
	nodes: Record<string, NodeProgress>;
	words: Record<string, WordStat>;
	mistakes: MistakeItem[];
}

function todayStr(d = new Date()): string {
	return d.toISOString().slice(0, 10);
}

function defaults(): Persisted {
	return {
		xp: 0,
		gems: 60,
		streak: 0,
		lastActiveDate: null,
		dailyGoal: 20,
		todayXp: 0,
		todayDate: null,
		weeklyXp: 0,
		league: 0,
		nodes: {},
		words: {},
		mistakes: []
	};
}

/** Merge two snapshots to the MOST-ADVANCED state — never loses progress. */
function mergeProgress(a: Persisted, b: Persisted): Persisted {
	const mx = (x = 0, y = 0) => Math.max(x, y);
	const later = (a.todayDate ?? '') >= (b.todayDate ?? '');
	const nodes: Persisted['nodes'] = { ...a.nodes };
	for (const [id, n] of Object.entries(b.nodes ?? {})) {
		const e = nodes[id];
		nodes[id] = e
			? { level: mx(e.level, n.level), legendaryDone: !!(e.legendaryDone || n.legendaryDone) }
			: { ...n };
	}
	const words: Persisted['words'] = { ...a.words };
	for (const [id, w] of Object.entries(b.words ?? {})) {
		const e = words[id];
		words[id] = e
			? {
					strength: mx(e.strength, w.strength),
					seen: mx(e.seen, w.seen),
					correct: mx(e.correct, w.correct),
					lastSeen: mx(e.lastSeen, w.lastSeen)
				}
			: { ...w };
	}
	const mk = (m: MistakeItem) => m.sentenceId ?? m.vocabId ?? '';
	const mm = new Map<string, MistakeItem>();
	for (const m of [...(a.mistakes ?? []), ...(b.mistakes ?? [])]) if (mk(m)) mm.set(mk(m), m);
	return {
		xp: mx(a.xp, b.xp),
		gems: mx(a.gems, b.gems),
		streak: mx(a.streak, b.streak),
		lastActiveDate: (a.lastActiveDate ?? '') >= (b.lastActiveDate ?? '') ? a.lastActiveDate : b.lastActiveDate,
		dailyGoal: mx(a.dailyGoal, b.dailyGoal),
		todayDate: later ? a.todayDate : b.todayDate,
		todayXp: later ? a.todayXp : b.todayXp,
		weeklyXp: mx(a.weeklyXp, b.weeklyXp),
		league: mx(a.league, b.league),
		nodes,
		words,
		mistakes: [...mm.values()]
	};
}

/** Every progress-shaped localStorage value (current + any legacy keys). */
function collectLocalSnapshots(): Persisted[] {
	const out: Persisted[] = [];
	if (!browser) return out;
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (!k || !/progress/i.test(k)) continue;
		try {
			const p = JSON.parse(localStorage.getItem(k) || 'null');
			if (p && typeof p === 'object' && ('xp' in p || 'nodes' in p)) out.push({ ...defaults(), ...p });
		} catch {
			/* skip unparseable */
		}
	}
	return out;
}

class Progress {
	xp = $state(0);
	gems = $state(60);
	streak = $state(0);
	dailyGoal = $state(20);
	todayXp = $state(0);
	weeklyXp = $state(0);
	league = $state(0);

	#lastActiveDate = $state<string | null>(null);
	#todayDate = $state<string | null>(null);

	nodes = $state<Record<string, NodeProgress>>({});
	words = $state<Record<string, WordStat>>({});
	mistakes = $state<MistakeItem[]>([]);

	constructor() {
		if (browser) this.#load();
	}

	#synced = false;
	#pushTimer: ReturnType<typeof setTimeout> | null = null;

	#load() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			this.#apply(raw ? { ...defaults(), ...JSON.parse(raw) } : defaults());
		} catch {
			/* corrupt — start fresh */
		}
	}

	/** Load a Persisted snapshot into the live state. */
	#apply(p: Persisted) {
		this.xp = p.xp;
		this.gems = p.gems;
		this.streak = p.streak;
		this.#lastActiveDate = p.lastActiveDate;
		this.dailyGoal = p.dailyGoal;
		this.todayXp = p.todayXp;
		this.#todayDate = p.todayDate;
		this.weeklyXp = p.weeklyXp;
		this.league = p.league;
		this.nodes = p.nodes ?? {};
		this.words = p.words ?? {};
		this.mistakes = p.mistakes ?? [];
		this.league = leagueForXp(this.xp);
		this.#rollDay();
	}

	/** Current state as a Persisted snapshot. */
	snapshot(): Persisted {
		return {
			xp: this.xp,
			gems: this.gems,
			streak: this.streak,
			lastActiveDate: this.#lastActiveDate,
			dailyGoal: this.dailyGoal,
			todayXp: this.todayXp,
			todayDate: this.#todayDate,
			weeklyXp: this.weeklyXp,
			league: this.league,
			nodes: this.nodes,
			words: this.words,
			mistakes: this.mistakes
		};
	}

	#save() {
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snapshot()));
		} catch {
			/* ignore */
		}
		this.#schedulePush();
	}

	// ---- server sync (best-effort; offline-safe) ----

	/**
	 * Called once a session exists. Pulls the server snapshot, merges it with the
	 * in-memory state AND every (incl. legacy) localStorage progress store to the
	 * MOST-ADVANCED state, applies + persists that, then pushes it back. After
	 * this, every #save() debounce-pushes to the server.
	 */
	async enableSync() {
		if (!browser || this.#synced) return;
		try {
			const res = await fetch('/api/progress');
			if (!res.ok) return; // not signed in / backend off → stay local-only
			const server = { ...defaults(), ...(await res.json()) } as Persisted;
			const merged = [server, ...collectLocalSnapshots(), this.snapshot()].reduce(mergeProgress);
			this.#apply(merged);
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(this.snapshot()));
			} catch {
				/* ignore */
			}
			this.#synced = true;
			await this.#push();
		} catch {
			/* offline — keep working from localStorage */
		}
	}

	/** Re-run the pull+merge — call after sign-in/up/out, when the user id changes.
	 *  localStorage survives the auth change, so a guest's progress merges into the
	 *  account (and the account's existing progress merges back in). */
	async resync() {
		this.#synced = false;
		await this.enableSync();
	}

	#schedulePush() {
		if (!this.#synced || !browser) return;
		if (this.#pushTimer) clearTimeout(this.#pushTimer);
		this.#pushTimer = setTimeout(() => void this.#push(), 1500);
	}

	async #push() {
		try {
			await fetch('/api/progress', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(this.snapshot())
			});
		} catch {
			/* will retry on next change */
		}
	}

	/** Reset today's XP counter when the calendar day changes. */
	#rollDay() {
		const t = todayStr();
		if (this.#todayDate !== t) {
			this.#todayDate = t;
			this.todayXp = 0;
		}
	}

	// ---- currency / xp / streak ----

	addXp(n: number) {
		this.#rollDay();
		this.xp += n;
		this.weeklyXp += n;
		this.todayXp += n;
		this.league = leagueForXp(this.xp);
		this.#save();
	}

	addGems(n: number) {
		this.gems = Math.max(0, this.gems + n);
		this.#save();
	}

	/** Spend gems if affordable; returns whether the purchase went through. */
	spendGems(cost: number): boolean {
		if (this.gems < cost) return false;
		this.gems -= cost;
		this.#save();
		return true;
	}

	setDailyGoal(n: number) {
		this.dailyGoal = n;
		this.#save();
	}

	get dailyGoalMet(): boolean {
		return this.todayXp >= this.dailyGoal;
	}

	/** Call once when a study session is completed. Returns true if streak grew. */
	registerStudyDay(): boolean {
		this.#rollDay();
		const today = todayStr();
		if (this.#lastActiveDate === today) return false;
		const yesterday = todayStr(new Date(Date.now() - 86_400_000));
		this.streak = this.#lastActiveDate === yesterday ? this.streak + 1 : 1;
		this.#lastActiveDate = today;
		this.#save();
		return true;
	}

	// ---- nodes / crowns ----

	nodeLevel(id: string): number {
		return this.nodes[id]?.level ?? 0;
	}

	isCrowned(id: string, levels = 1): boolean {
		return this.nodeLevel(id) >= levels;
	}

	legendaryDone(id: string): boolean {
		return !!this.nodes[id]?.legendaryDone;
	}

	/** Record completing one level of a node. */
	completeNodeLevel(id: string, opts: { legendary?: boolean; levels?: number } = {}) {
		const cur = this.nodes[id] ?? { level: 0 };
		const max = opts.levels ?? 1;
		cur.level = Math.min(max, cur.level + 1);
		if (opts.legendary) cur.legendaryDone = true;
		this.nodes[id] = { ...cur };
		this.#save();
	}

	// ---- spaced repetition ----

	recordWordResult(vocabId: string, correct: boolean) {
		const st = this.words[vocabId] ?? { strength: 0.3, seen: 0, correct: 0, lastSeen: 0 };
		st.seen += 1;
		if (correct) {
			st.correct += 1;
			st.strength = Math.min(1, st.strength + 0.2);
		} else {
			st.strength = Math.max(0, st.strength - 0.3);
		}
		st.lastSeen = Date.now();
		this.words[vocabId] = { ...st };
		this.#save();
	}

	/** Vocab ids sorted weakest-first (unseen treated as mid-strength). */
	weakWords(candidateIds: string[], n = 10): string[] {
		return [...candidateIds]
			.sort((a, b) => (this.words[a]?.strength ?? 0.5) - (this.words[b]?.strength ?? 0.5))
			.slice(0, n);
	}

	// ---- mistakes queue ----

	addMistake(item: MistakeItem) {
		const key = item.sentenceId ?? item.vocabId;
		if (!key) return;
		if (!this.mistakes.some((m) => (m.sentenceId ?? m.vocabId) === key)) {
			this.mistakes = [...this.mistakes, item];
			this.#save();
		}
	}

	clearMistake(item: MistakeItem) {
		const key = item.sentenceId ?? item.vocabId;
		this.mistakes = this.mistakes.filter((m) => (m.sentenceId ?? m.vocabId) !== key);
		this.#save();
	}

	reset() {
		const d = defaults();
		this.xp = d.xp;
		this.gems = d.gems;
		this.streak = d.streak;
		this.#lastActiveDate = d.lastActiveDate;
		this.dailyGoal = d.dailyGoal;
		this.todayXp = d.todayXp;
		this.#todayDate = d.todayDate;
		this.weeklyXp = d.weeklyXp;
		this.league = d.league;
		this.nodes = {};
		this.words = {};
		this.mistakes = [];
		this.#save();
	}

	/** Wipe ALL local progress from this device (shared-device safety on sign-out):
	 *  reset in-memory state to defaults and remove every progress-shaped key from
	 *  localStorage (current + any legacy snapshots), and stop syncing. The next
	 *  guest then starts from a clean slate instead of inheriting the prior user. */
	wipe() {
		this.#synced = false;
		this.reset();
		if (!browser) return;
		for (let i = localStorage.length - 1; i >= 0; i--) {
			const k = localStorage.key(i);
			if (k && /progress/i.test(k)) localStorage.removeItem(k);
		}
	}
}

export const progress = new Progress();
