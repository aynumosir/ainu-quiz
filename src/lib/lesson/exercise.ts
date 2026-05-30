import type { CourseNode, Localized, Sentence, Vocab } from '$lib/content/types';
import { bundle, nodeContent } from '$lib/content';
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
	const want = Math.min(2, Math.max(1, 4 - answerTokens.length) + 1);
	const localWords = vocabPool.map((v) => v.latin).filter((w) => !answerTokens.includes(w));
	const globalWords = ALL_VOCAB.map((v) => v.latin).filter((w) => !answerTokens.includes(w));
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
	return {
		kind: 'choice',
		instructionKey: 'ex.conversation',
		promptRaw: s.convo.prompt,
		choices: shuffle(
			s.convo.options.map((o) => ({ latin: o, correct: norm(o) === norm(s.latin) }))
		),
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

/** Build the ordered exercise list for a node. */
export function buildLesson(node: CourseNode): Exercise[] {
	const { vocab, sentences } = nodeContent(node);
	const ex: Exercise[] = [];

	if (vocab.length >= 4) ex.push(matchPairs(vocab));

	const sentenceList = node.type === 'review' ? shuffle(sentences) : sentences;
	sentenceList.forEach((s, i) => {
		const late = i >= sentenceList.length - 2; // last items lean productive (harder)
		const candidates: (Exercise | null)[] = [];
		if (s.blank) candidates.push(fillBlank(s));
		if (s.convo) candidates.push(conversation(s));
		candidates.push(translateFromAinu(s, sentences));
		if (late || Math.random() < 0.5) candidates.push(translateToAinu(s, vocab));
		const valid = candidates.filter(Boolean) as Exercise[];
		ex.push(valid[Math.floor(Math.random() * valid.length)]);
	});

	// a couple of vocab meaning checks
	pick(vocab, Math.min(2, vocab.length)).forEach((v) => ex.push(selectMeaning(v, vocab)));

	// guarantee a productive closer
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
