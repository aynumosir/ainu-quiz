import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { bundle, flatNodes, nodeById, unitContentFor } from '../src/lib/content';
import { loc, type CourseNode, type Localized, type Sentence } from '../src/lib/content/types';
import { buildLesson, checkExercise, type Exercise } from '../src/lib/lesson/exercise';

function withRandom<T>(random: () => number, run: () => T): T {
	const original = Math.random;
	Math.random = random;
	try {
		return run();
	} finally {
		Math.random = original;
	}
}

function assertUniqueMeanings(meanings: Localized[], context: string) {
	for (const lang of ['ja', 'en', 'zh'] as const) {
		const labels = meanings.map((meaning) => loc(meaning, lang).toLowerCase().trim());
		assert.equal(new Set(labels).size, labels.length, `${context}: duplicate ${lang} answers`);
	}
}

function assertChoices(ex: Exercise) {
	const choices = ex.choices!;
	assert.equal(choices.length, 3);
	assert.equal(choices.filter((choice) => choice.correct).length, 1);
	assertUniqueMeanings(choices.map((choice) => choice.text!), ex.promptLatin ?? ex.sentenceId!);
	choices.forEach((choice, selected) =>
		assert.equal(checkExercise(ex, { selected }), choice.correct)
	);
}

test('unit 25 causative suffixes have distinct answer choices in every locale', () => {
	withRandom(() => 0.999, () => {
		const exercises = buildLesson(nodeById('u25n1')!);
		const meanings = exercises.filter((ex) => ex.instructionKey === 'ex.selectMeaning');
		assert.deepEqual(meanings.map((ex) => ex.promptLatin), ['-re', '-e']);
		meanings.forEach(assertChoices);
	});
});

test('unit 25 matching keeps only one of the identical causative meanings', () => {
	withRandom(() => 0.999, () => {
		const match = buildLesson(nodeById('u25n1')!).find((ex) => ex.kind === 'match')!;
		assert.equal(match.pairs!.length, 3);
		assert.equal(match.vocabIds!.length, match.pairs!.length);
		assertUniqueMeanings(match.pairs!.map((pair) => pair.text), 'unit 25 matching');
	});
});

test('a pool of equivalent suffixes gets distinct distractors from the course', () => {
	withRandom(() => 0.999, () => {
		const node: CourseNode = {
			id: 'suffixes',
			type: 'lesson',
			title: { ja: '', en: '' },
			vocab: ['v_re_2', 'v_e_2']
		};
		const exercises = buildLesson(node);
		assert.equal(exercises.length, 2);
		exercises.forEach(assertChoices);
	});
});

test('sentence distractors reject collisions in Japanese, English, or fallback Chinese', () => {
	const meanings: Localized[] = [
		{ ja: '同じ訳', en: 'First translation' },
		{ ja: '同じ訳', en: 'Second translation' },
		{ ja: '別の訳', en: ' first translation ' },
		{ ja: '中国語の訳', en: 'Third translation', zh: 'First translation' }
	];
	const sentences: Sentence[] = meanings.map((translation, i) => ({
		id: `test-duplicate-meaning-${i}`,
		latin: `test ${i}.`,
		translation,
		evidence: []
	}));
	try {
		for (const sentence of sentences) bundle.sentences[sentence.id] = sentence;
		withRandom(() => 0, () => {
			const exercises = buildLesson({
				id: 'translations',
				type: 'lesson',
				title: { ja: '', en: '' },
				sentences: sentences.map((sentence) => sentence.id)
			});
			const choices = exercises.filter((ex) => ex.instructionKey === 'ex.translateFromAinu');
			assert.equal(choices.length, sentences.length);
			choices.forEach(assertChoices);
		});
	} finally {
		for (const sentence of sentences) delete bundle.sentences[sentence.id];
	}
});

test('intro and repeat lessons keep meanings unique across the course', () => {
	for (let seed = 1; seed <= 5; seed++) {
		let state = seed;
		withRandom(() => {
			state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
			return state / 0x100000000;
		}, () => {
			for (const { node } of flatNodes()) {
				const unit = unitContentFor(node.id);
				for (const level of [1, 2]) {
					for (const ex of buildLesson(node, {
						level, unitVocab: unit.vocab, unitSentences: unit.sentences
					})) {
						if (ex.choices?.every((choice) => choice.text)) assertChoices(ex);
						if (ex.pairs) {
							assert.ok(ex.pairs.length >= 2 && ex.pairs.length <= 5);
							assertUniqueMeanings(ex.pairs.map((pair) => pair.text), node.id);
							assert.equal(new Set(ex.pairs.map((pair) => pair.latin)).size, ex.pairs.length);
						}
					}
				}
			}
		});
	}
});
