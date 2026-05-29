import { browser } from '$app/environment';

/**
 * Gamification + learning state for tu itak. Single source of truth, persisted
 * to localStorage. Pure state + primitives; per-node path states (locked/active/
 * done) are derived against the course in the path layer.
 */

const STORAGE_KEY = 'tu-itak:progress:v1';

export const MAX_HEARTS = 5;
/** One heart regenerates every 30 minutes (kinder than Duolingo's 5h). */
const HEART_REGEN_MS = 30 * 60 * 1000;
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
	hearts: number;
	heartsTs: number;
	unlimitedHearts: boolean;
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
		gems: 30,
		hearts: MAX_HEARTS,
		heartsTs: 0,
		unlimitedHearts: false,
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

class Progress {
	xp = $state(0);
	gems = $state(30);
	streak = $state(0);
	dailyGoal = $state(20);
	todayXp = $state(0);
	weeklyXp = $state(0);
	league = $state(0);
	unlimitedHearts = $state(false);

	// hearts are stored as a count + a timestamp; current value regenerates over time
	#hearts = $state(MAX_HEARTS);
	#heartsTs = $state(0);
	#lastActiveDate = $state<string | null>(null);
	#todayDate = $state<string | null>(null);

	nodes = $state<Record<string, NodeProgress>>({});
	words = $state<Record<string, WordStat>>({});
	mistakes = $state<MistakeItem[]>([]);

	constructor() {
		if (browser) this.#load();
	}

	#load() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const p: Persisted = raw ? { ...defaults(), ...JSON.parse(raw) } : defaults();
			this.xp = p.xp;
			this.gems = p.gems;
			this.#hearts = p.hearts;
			this.#heartsTs = p.heartsTs;
			this.unlimitedHearts = p.unlimitedHearts;
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
			this.#rollDay();
		} catch {
			/* corrupt — start fresh */
		}
	}

	#save() {
		if (!browser) return;
		const data: Persisted = {
			xp: this.xp,
			gems: this.gems,
			hearts: this.#hearts,
			heartsTs: this.#heartsTs,
			unlimitedHearts: this.unlimitedHearts,
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
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* ignore */
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

	// ---- hearts (with regeneration) ----

	get hearts(): number {
		if (this.unlimitedHearts) return MAX_HEARTS;
		if (this.#hearts >= MAX_HEARTS) return MAX_HEARTS;
		const elapsed = Date.now() - this.#heartsTs;
		const regen = this.#heartsTs > 0 ? Math.floor(elapsed / HEART_REGEN_MS) : 0;
		return Math.min(MAX_HEARTS, this.#hearts + regen);
	}

	/** ms until the next heart regenerates, or 0 if full. */
	get msToNextHeart(): number {
		if (this.unlimitedHearts || this.hearts >= MAX_HEARTS || this.#heartsTs === 0) return 0;
		const elapsed = Date.now() - this.#heartsTs;
		return HEART_REGEN_MS - (elapsed % HEART_REGEN_MS);
	}

	#reconcileHearts() {
		const cur = this.hearts;
		this.#hearts = cur;
		if (cur >= MAX_HEARTS) this.#heartsTs = 0;
	}

	loseHeart(): boolean {
		if (this.unlimitedHearts) return true;
		this.#reconcileHearts();
		if (this.#hearts === MAX_HEARTS) this.#heartsTs = Date.now();
		this.#hearts = Math.max(0, this.#hearts - 1);
		this.#save();
		return this.#hearts > 0;
	}

	refillHearts() {
		this.#hearts = MAX_HEARTS;
		this.#heartsTs = 0;
		this.#save();
	}

	refillWithGems(cost = 350): boolean {
		if (this.hearts >= MAX_HEARTS) return false;
		if (this.gems < cost) return false;
		this.gems -= cost;
		this.refillHearts();
		return true;
	}

	// ---- currency / xp / streak ----

	addXp(n: number) {
		this.#rollDay();
		this.xp += n;
		this.weeklyXp += n;
		this.todayXp += n;
		this.#save();
	}

	addGems(n: number) {
		this.gems = Math.max(0, this.gems + n);
		this.#save();
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
		this.#hearts = d.hearts;
		this.#heartsTs = d.heartsTs;
		this.unlimitedHearts = d.unlimitedHearts;
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
}

export const progress = new Progress();
