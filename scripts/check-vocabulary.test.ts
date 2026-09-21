import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { bundle, flatNodes, unitContentFor } from '../src/lib/content';
import { dropsSections, dropsVocab } from '../src/lib/content/course-drops';
import { loc } from '../src/lib/content/types';
import { buildLesson, norm } from '../src/lib/lesson/exercise';

test('vocabulary introductions cover every assigned word with a scored meaning question', () => {
	for (const section of dropsSections) {
		for (const unit of section.units) {
			for (const node of unit.nodes.filter((node) => node.type === 'lesson')) {
				assert.ok(node.vocab!.length > 0 && node.vocab!.length <= 5, node.id);
				const exercises = buildLesson(node);
				const tested = exercises
					.filter((ex) => ex.instructionKey === 'ex.selectMeaning')
					.flatMap((ex) => ex.vocabIds!);
				assert.deepEqual(new Set(tested), new Set(node.vocab), node.id);
				assert.equal(tested.length, node.vocab!.length, node.id);
				assert.ok(exercises.length <= 8, node.id);
			}
		}
	}
});

test('vocabulary review stays bounded after pooling sibling lessons', () => {
	for (const section of dropsSections) {
		for (const unit of section.units) {
			const node = unit.nodes.find((node) => node.type === 'review')!;
			const sibling = unitContentFor(node.id);
			const exercises = buildLesson(node, {
				level: 2, unitVocab: sibling.vocab, unitSentences: sibling.sentences
			});
			const tested = exercises.filter((ex) => ex.instructionKey === 'ex.selectMeaning');
			assert.equal(tested.length, Math.min(5, node.vocab!.length), node.id);
			assert.ok(exercises.length <= 8, node.id);
		}
	}
});

test('each added word has an introduction and every course reference resolves uniquely', () => {
	const introIds = new Set(dropsSections.flatMap((s) => s.units.flatMap((u) =>
		u.nodes.filter((n) => n.type === 'lesson').flatMap((n) => n.vocab ?? [])
	)));
	for (const id of [...Object.keys(dropsVocab), 'v_e_yes']) assert.ok(introIds.has(id), id);
	const ids = flatNodes().map(({ node }) => node.id);
	assert.equal(new Set(ids).size, ids.length);
	for (const { node } of flatNodes()) {
		for (const id of node.vocab ?? []) assert.ok(bundle.vocab[id], `${node.id}: ${id}`);
	}
	assert.equal(bundle.vocab.v_matkaci_d, undefined);
	assert.equal(bundle.vocab.v_eramasu_d, undefined);
	assert.equal(bundle.vocab.v_onpekotope, undefined);
	assert.ok(introIds.has('v_matkaci'));
	assert.ok(introIds.has('v_eramasu'));
});

test('homonymous headwords never serve as false meaning choices', () => {
	const eWords = Object.values(bundle.vocab).filter((v) => v.latin === 'e');
	assert.ok(eWords.length >= 2);
	const exercises = buildLesson({
		id: 'homonyms', type: 'lesson', title: { ja: '', en: '' },
		vocab: eWords.map((v) => v.id)
	});
	for (const ex of exercises.filter((ex) => ex.instructionKey === 'ex.selectMeaning')) {
		const correct = bundle.vocab[ex.vocabIds![0]];
		const otherMeanings = eWords.filter((v) => v.id !== correct.id).map((v) => v.gloss);
		assert.equal(ex.choices!.length, 3);
		for (const choice of ex.choices!.filter((choice) => !choice.correct)) {
			for (const meaning of otherMeanings) {
				assert.notDeepEqual(choice.text, meaning);
			}
		}
	}
});

test('added words cannot introduce a synonymous wrong answer for an existing headword', () => {
	const original = Math.random;
	Math.random = () => 0.999;
	try {
		for (const { node } of flatNodes()) {
			for (const ex of buildLesson(node)) {
				if (ex.instructionKey !== 'ex.selectMeaning') continue;
				const equivalent = Object.values(bundle.vocab)
					.filter((v) => norm(v.latin) === norm(ex.promptLatin!));
				for (const choice of ex.choices!.filter((choice) => !choice.correct)) {
					for (const word of equivalent) {
						for (const lang of ['ja', 'en'] as const) {
							assert.notEqual(loc(choice.text, lang), loc(word.gloss, lang), word.id);
						}
					}
				}
			}
		}
	} finally {
		Math.random = original;
	}
});
