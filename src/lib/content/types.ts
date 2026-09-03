/**
 * Content model for tu itak.
 *
 * Ainu is always the TARGET language; every Ainu string is stored as canonical
 * Latin romanization (Katakana is derived on demand — see $lib/script/convert).
 * Learner-facing meaning is `Localized` (ja/en, zh later), independent of the
 * Ainu content. Content is data: hand-curated for the vertical slice and
 * machine-generated for breadth by the pipeline (glossary + corpus).
 */

export type LangCode = 'ja' | 'en' | 'zh';

/** A string in each learner UI language. ja + en required; zh optional. */
export interface Localized {
	ja: string;
	en: string;
	zh?: string;
}

/** A single vocabulary item. */
export interface Vocab {
	id: string;
	/** Canonical Ainu romanization — the source of truth. */
	latin: string;
	/** Meaning in the learner's language. */
	gloss: Localized;
	/** Glossary category this came from (food, colour, animal, …). */
	category?: string;
	/** Part of speech, e.g. "vt", "vi", "n", "adv". */
	pos?: string;
	/** Short usage note shown in hints / the "my words" list. */
	note?: Localized;
	/** Precompiled audio clip id (resolved by the audio layer). */
	audio?: string;
}

/** One piece of evidence for an Ainu form. */
export type Witness =
	| {
			/** Corpus locus, `collection/document#index` (resolvable in corpus.db). */
			pointer: string;
			/** How the locus supports the form:
			 *  attests — the locus contains the form itself;
			 *  base — the form was adapted from this locus;
			 *  parallel — same construction with different lexemes;
			 *  options — evidences an exercise distractor, not the form. */
			role: 'attests' | 'base' | 'parallel' | 'options';
			/** Annotation (author, collection, dialect of the witness). */
			note?: string;
	  }
	| {
			/** Print or offline reference: dictionary s.v., textbook lesson,
			 *  or a construction description with its parallels. */
			ref: string;
			note?: string;
	  };

/** An example sentence, with optional exercise scaffolding. */
export interface Sentence {
	id: string;
	/** Canonical Ainu sentence (may include `=` affix markers and spaces). */
	latin: string;
	translation: Localized;
	/** Vocab ids appearing here — drives spaced-repetition word tracking. */
	vocab?: string[];
	/** Fill-in-the-blank scaffold: which token is removed + distractor options. */
	blank?: { answer: string; options: string[] };
	/** Conversation scaffold: a prompt this sentence is the best reply to.
	 *  `prompt` may be a plain string (legacy) or Localized (ja/en) for bilingual cues. */
	convo?: { prompt: string | Localized; options: string[] };
	audio?: string;
	/** Provenance from the corpus (for attribution + dialect filtering). */
	dialect?: string;
	/** Evidence for the sentence, validated by scripts/check-evidence.ts. */
	evidence: Witness[];
}

export type NodeType = 'lesson' | 'review' | 'unitReview' | 'story' | 'practice';

/** One circle on the learning path. Modern Duolingo: one node = one bite-sized step. */
export interface CourseNode {
	id: string;
	type: NodeType;
	title: Localized;
	/** Optional icon override; otherwise derived from `type`. */
	icon?: string;
	/** Sub-levels to fully crown the node (progress arc); default 1. */
	levels?: number;
	/** Vocab taught/used in this node. */
	vocab?: string[];
	/** Sentences this node draws exercises from. */
	sentences?: string[];
	/** For type === 'story'. */
	storyId?: string;
	/** Offers the harder Legendary challenge once completed. */
	legendary?: boolean;
}

/** A thematic unit (a colored band on the path). */
export interface Unit {
	id: string;
	title: Localized;
	/** e.g. "Unit 1" — shown small above the title. */
	label?: Localized;
	/** Accent color token name (see unit-accents) or hex. */
	accent: string;
	/** Short learner-facing grammar tip shown in the unit guidebook. */
	grammar?: Localized;
	nodes: CourseNode[];
}

/** A CEFR-ish chapter grouping units. */
export interface Section {
	id: string;
	title: Localized;
	cefr?: string;
	units: Unit[];
}

export interface Course {
	id: string;
	target: 'ain';
	title: Localized;
	sections: Section[];
}

export interface StoryLine {
	speaker: string;
	latin: string;
	translation: Localized;
	audio?: string;
}

export interface Story {
	id: string;
	title: Localized;
	lines: StoryLine[];
	questions: { prompt: Localized; answer: string; options: string[] }[];
}

/** Everything the app needs to render and run the course. */
export interface ContentBundle {
	course: Course;
	vocab: Record<string, Vocab>;
	sentences: Record<string, Sentence>;
	stories: Record<string, Story>;
}

/** Resolve a Localized value for the active locale, falling back ja↔en. */
export function loc(value: Localized | undefined, lang: LangCode): string {
	if (!value) return '';
	return value[lang] ?? value.en ?? value.ja ?? '';
}
