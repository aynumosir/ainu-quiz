import type { CourseNode, Localized, Sentence, Vocab } from '$lib/content/types';
import { bundle, nodeContent } from '$lib/content';
import { vocabImage } from '$lib/content/images';
import type { MessageKey } from '$lib/i18n/messages';

/**
 * The lesson engine turns a node's vocab + sentences into a sequence of
 * exercises. Ainu is stored/checked in canonical Latin; components render it
 * in the active script via AinuText. Audio-only exercises are intentionally
 * omitted until the precompiled-audio pipeline lands.
 */

export type ExerciseKind = 'tiles' | 'choice' | 'fill' | 'match';

export interface Choice {
	/** Ainu option, rendered via AinuText. */
	latin?: string;
	/** Localized text option (a meaning). */
	text?: Localized;
	/** Picture option (URL) — rendered as an image card (tap-the-image). */
	image?: string;
	correct: boolean;
}

export interface Exercise {
	kind: ExerciseKind;
	instructionKey: MessageKey;
	/** Ainu prompt shown via AinuText (a sentence or word). */
	promptLatin?: string;
	/** Localized prompt (e.g. the meaning to translate INTO Ainu). */
	promptText?: Localized;
	/** Raw prompt string (e.g. a conversation cue that mixes scripts). */
	promptRaw?: string;
	/** Picture prompt (URL) shown big — "what is this?" (image → word). */
	promptImage?: string;
	/** choice / fill */
	choices?: Choice[];
	/** tiles: scrambled Latin tokens (answer tokens + distractors). */
	tiles?: string[];
	/** tiles / fill: the canonical Latin answer. */
	answer?: string;
	/** fill: the prompt sentence split around the blank: [before, after]. */
	blankParts?: [string, string];
	/** match: Ainu ↔ meaning pairs. */
	pairs?: { latin: string; text: Localized }[];
	/** spaced-repetition + mistakes tracking. */
	vocabIds?: string[];
	sentenceId?: string;
}

export function norm(s: string): string {
	return (s || '')
		.toLowerCase()
		.replace(/[.,!?;:"'’“”]/g, '')
		// `=` marks a personal affix boundary (ku=rehe); spacing around it is not
		// meaningful, so "ku= rehe" and "ku=rehe" compare equal.
		.replace(/\s*=\s*/g, '=')
		.replace(/\s+/g, ' ')
		.trim();
}

export function tokenize(s: string): string[] {
	return s
		.replace(/[.?!,]/g, '')
		.split(/\s+/)
		.filter(Boolean);
}

function shuffle<T>(arr: T[]): T[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function pick<T>(arr: T[], n: number): T[] {
	return shuffle(arr).slice(0, n);
}

const ALL_SENTENCES = Object.values(bundle.sentences);
const ALL_VOCAB = Object.values(bundle.vocab);
const IMAGED_VOCAB = ALL_VOCAB.filter((v) => vocabImage(v.latin));

/** Key a meaning so two options never read identically. */
const meaningKey = (l: Localized) => (l.en || l.ja || '').toLowerCase().trim();

/**
 * Gather up to `n` distractor items, deduped by their display meaning. Prefer
 * the node's own pool (`local`) for relevance, then top up from the whole
 * course so a single-item node never yields a one-option exercise.
 */
function distractors<T extends { id: string }>(
	correct: T,
	local: T[],
	global: T[],
	keyOf: (t: T) => string,
	n = 2
): T[] {
	const seen = new Set([keyOf(correct)]);
	const out: T[] = [];
	for (const pool of [local, global]) {
		for (const o of shuffle(pool)) {
			if (o.id === correct.id || seen.has(keyOf(o))) continue;
			seen.add(keyOf(o));
			out.push(o);
			if (out.length >= n) return out;
		}
	}
	return out;
}

// ---- per-source exercise builders ----

function translateFromAinu(s: Sentence, others: Sentence[]): Exercise {
	const distract = distractors(s, others, ALL_SENTENCES, (o) => meaningKey(o.translation)).map(
		(o) => ({ text: o.translation, correct: false })
	);
	return {
		kind: 'choice',
		instructionKey: 'ex.translateFromAinu',
		promptLatin: s.latin,
		choices: shuffle([{ text: s.translation, correct: true }, ...distract]),
		sentenceId: s.id,
		vocabIds: s.vocab
	};
}

function translateToAinu(s: Sentence, vocabPool: Vocab[]): Exercise {
	const answerTokens = tokenize(s.latin);
	// Reject a distractor word if it's a component of (or contains) an answer
	// token — e.g. "ku=" or "rehe" against the answer token "ku=rehe" — so the
	// learner can't assemble a string that's effectively right but tile-mismatched.
	const conflicts = (w: string) =>
		answerTokens.some((tok) => tok !== w && (tok.includes(w) || w.includes(tok)));
	const usable = (w: string) => !answerTokens.includes(w) && !conflicts(w);
	const want = Math.min(2, Math.max(1, 4 - answerTokens.length) + 1);
	const localWords = vocabPool.map((v) => v.latin).filter(usable);
	const globalWords = ALL_VOCAB.map((v) => v.latin).filter(usable);
	const seen = new Set<string>();
	const extraTiles: string[] = [];
	for (const pool of [localWords, globalWords]) {
		for (const w of shuffle(pool)) {
			if (seen.has(w)) continue;
			seen.add(w);
			extraTiles.push(w);
			if (extraTiles.length >= want) break;
		}
		if (extraTiles.length >= want) break;
	}
	return {
		kind: 'tiles',
		instructionKey: 'ex.translateToAinu',
		promptText: s.translation,
		tiles: shuffle([...answerTokens, ...extraTiles]),
		answer: s.latin,
		sentenceId: s.id,
		vocabIds: s.vocab
	};
}

function selectMeaning(v: Vocab, others: Vocab[]): Exercise {
	const distract = distractors(v, others, ALL_VOCAB, (o) => meaningKey(o.gloss)).map((o) => ({
		text: o.gloss,
		correct: false
	}));
	return {
		kind: 'choice',
		instructionKey: 'ex.selectMeaning',
		promptLatin: v.latin,
		choices: shuffle([{ text: v.gloss, correct: true }, ...distract]),
		vocabIds: [v.id]
	};
}

function fillBlank(s: Sentence): Exercise | null {
	if (!s.blank) return null;
	const idx = s.latin.indexOf(s.blank.answer);
	if (idx < 0) return null;
	const before = s.latin.slice(0, idx);
	const after = s.latin.slice(idx + s.blank.answer.length);
	return {
		kind: 'fill',
		instructionKey: 'ex.fillBlank',
		promptText: s.translation,
		blankParts: [before, after],
		choices: shuffle(s.blank.options.map((o) => ({ latin: o, correct: o === s.blank!.answer }))),
		answer: s.blank.answer,
		sentenceId: s.id,
		vocabIds: s.vocab
	};
}

function conversation(s: Sentence): Exercise | null {
	if (!s.convo) return null;
	const choices = s.convo.options.map((o) => ({ latin: o, correct: norm(o) === norm(s.latin) }));
	// Safety net: a conversation is "pick the option equal to this sentence". If
	// NO option matches, there is no correct answer (e.g. a deictic "what is
	// this?" whose options are possible objects) — skip it rather than render an
	// unanswerable exercise.
	if (!choices.some((c) => c.correct)) return null;
	return {
		kind: 'choice',
		instructionKey: 'ex.conversation',
		promptRaw: s.convo.prompt,
		choices: shuffle(choices),
		sentenceId: s.id,
		vocabIds: s.vocab
	};
}

function matchPairs(vocab: Vocab[]): Exercise {
	const chosen = pick(vocab, Math.min(5, vocab.length));
	return {
		kind: 'match',
		instructionKey: 'ex.tapPairs',
		pairs: chosen.map((v) => ({ latin: v.latin, text: v.gloss })),
		vocabIds: chosen.map((v) => v.id)
	};
}

/** Tap-the-image: show the Ainu word, pick its picture out of four. */
function pickImage(target: Vocab, pool: Vocab[]): Exercise | null {
	const img = vocabImage(target.latin);
	if (!img) return null;
	const localImaged = pool.filter((o) => vocabImage(o.latin));
	const distract = distractors(target, localImaged, IMAGED_VOCAB, (o) => o.latin, 3);
	if (distract.length < 2) return null;
	return {
		kind: 'choice',
		instructionKey: 'ex.tapImage',
		promptLatin: target.latin,
		choices: shuffle([
			{ image: img, latin: target.latin, correct: true },
			...distract.map((o) => ({ image: vocabImage(o.latin)!, latin: o.latin, correct: false }))
		]),
		vocabIds: [target.id]
	};
}

/** What is this: show the picture, pick the Ainu word out of four. */
function whatIsThis(target: Vocab, pool: Vocab[]): Exercise | null {
	const img = vocabImage(target.latin);
	if (!img) return null;
	const distract = distractors(target, pool, IMAGED_VOCAB, (o) => o.latin, 3);
	if (distract.length < 2) return null;
	return {
		kind: 'choice',
		instructionKey: 'ex.whatIsThis',
		promptImage: img,
		choices: shuffle([
			{ latin: target.latin, correct: true },
			...distract.map((o) => ({ latin: o.latin, correct: false }))
		]),
		vocabIds: [target.id]
	};
}

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
	const seen = new Set<string>();
	return arr.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)));
}

export interface LessonOpts {
	/** 1-based pass number being attempted. Later passes lean productive + mix. */
	level?: number;
	/** Other nodes' vocab in the same unit, mixed in on repeats for variety. */
	unitVocab?: Vocab[];
	/** Other nodes' sentences in the same unit, mixed in on repeats. */
	unitSentences?: Sentence[];
}

/**
 * Build the ordered exercise list for a node.
 *
 * The shape varies by `level` so a second pass is NOT a duplicate of the first
 * (Duolingo-style): the intro pass leans recognition (match, choose-meaning,
 * read-and-translate) on the node's own content; repeat passes lean production
 * (build-the-sentence, fill-the-blank) and mix in sibling-unit content for a
 * cumulative-review feel.
 */
export function buildLesson(node: CourseNode, opts: LessonOpts = {}): Exercise[] {
	const level = opts.level ?? 1;
	const productive = level >= 2 || node.type === 'review' || node.type === 'unitReview';
	const own = nodeContent(node);

	const vocab = productive
		? dedupeById([...own.vocab, ...(opts.unitVocab ?? [])])
		: own.vocab;
	const sentences = productive
		? dedupeById([...own.sentences, ...(opts.unitSentences ?? [])])
		: own.sentences;

	const ex: Exercise[] = [];

	// Warm-up recognition match — the intro opener. On productive passes only use
	// it as a fallback when there's little sentence material, so it isn't repeated.
	if (vocab.length >= 4 && (!productive || sentences.length < 2)) ex.push(matchPairs(vocab));

	// Picture exercises for any illustrated vocab in this node (great for intro):
	// alternate tap-the-image (word → picture) and what-is-this (picture → word).
	const imaged = vocab.filter((v) => vocabImage(v.latin));
	pick(imaged, Math.min(2, imaged.length)).forEach((v, i) => {
		const pic = (i % 2 === 0 ? pickImage : whatIsThis)(v, vocab);
		if (pic) ex.push(pic);
	});

	// Keep lessons bite-sized: stable order on the intro pass; shuffled + capped
	// on repeats (where the pool is widened to the whole unit).
	const ordered = productive ? shuffle(sentences).slice(0, 6) : sentences;
	ordered.forEach((s, i) => {
		const candidates: (Exercise | null)[] = [];
		if (productive) {
			if (s.blank) candidates.push(fillBlank(s));
			candidates.push(translateToAinu(s, vocab));
			if (s.convo) candidates.push(conversation(s));
			if (Math.random() < 0.3) candidates.push(translateFromAinu(s, sentences));
		} else {
			candidates.push(translateFromAinu(s, sentences));
			if (s.convo) candidates.push(conversation(s));
			if (s.blank && Math.random() < 0.5) candidates.push(fillBlank(s));
			if (i >= ordered.length - 1) candidates.push(translateToAinu(s, vocab)); // productive closer
		}
		const valid = candidates.filter(Boolean) as Exercise[];
		if (valid.length) ex.push(valid[Math.floor(Math.random() * valid.length)]);
	});

	// Vocab meaning checks — more while learning (intro), fewer on repeats.
	pick(vocab, productive ? Math.min(1, vocab.length) : Math.min(2, vocab.length)).forEach((v) =>
		ex.push(selectMeaning(v, vocab))
	);

	// Always end on a productive item.
	if (sentences.length) ex.push(translateToAinu(sentences[sentences.length - 1], vocab));

	return ex;
}

/** Check a built/selected answer. Returns whether correct. */
export function checkExercise(ex: Exercise, response: { selected?: number; built?: string }): boolean {
	if (ex.kind === 'tiles') {
		return norm(response.built ?? '') === norm(ex.answer ?? '');
	}
	if (ex.kind === 'choice' || ex.kind === 'fill') {
		return response.selected != null && !!ex.choices?.[response.selected]?.correct;
	}
	return false; // match handled internally by its component
}
