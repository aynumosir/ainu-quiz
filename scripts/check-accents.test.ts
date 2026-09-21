import { describe, expect, test } from 'bun:test';
import { accentErrors } from './check-accents';
import { bundle } from '../src/lib/content';
import { PROMPT_EN } from '../src/lib/content/prompt-i18n';

describe('dictionary accent notation', () => {
	test('finds both missing exceptions and invented exceptions', () => {
		expect(accentErrors('hure éaykap únihi sékor')).toEqual([
			'hure → húre', 'éaykap → eaykap', 'únihi → unihi', 'sékor → sekor'
		]);
		expect(accentErrors('húre eaykap unihi sekor')).toEqual([]);
	});
	test('handles decomposed Unicode, capitalization and apostrophes', () => {
		expect(accentErrors("HÍOY’OY húre".normalize('NFD'))).toEqual([]);
		expect(accentErrors('ÉAYKAP'.normalize('NFD'))).toEqual(['ÉAYKAP → eaykap']);
	});
	test('keeps personal forms separate from bare headwords', () => {
		expect(accentErrors('míci ku=mici en=kasuy en=nure eci=núre a=eáykap')).toEqual([]);
		expect(accentErrors('ku=míci en=kásuy')).toEqual([
			'ku=míci → ku=mici', 'en=kásuy → en=kasuy'
		]);
	});
	test('distinguishes regular eaykap from contracted k=éaykap', () => {
		expect(accentErrors('eaykap k=éaykap')).toEqual([]);
		expect(accentErrors('éaykap k=eaykap')).toEqual([
			'éaykap → eaykap', 'k=eaykap → k=éaykap'
		]);
	});
	test('preserves homonyms and leaves unreviewed forms alone', () => {
		expect(accentErrors('sisam sísam sirsesek níkapiro')).toEqual([]);
	});
	test('accented conversation cues still resolve their English translation', () => {
		const prompt = bundle.sentences.u21_s5.convo!.prompt as string;
		expect(prompt).toContain('Húci');
		expect(PROMPT_EN[prompt]).toBe('Húci utar hemanta ki wa oka? (What are the grandmothers doing?)');
	});
	test('the feeding story uses ére for feed while accepting the numeral homonym ere', () => {
		expect(accentErrors('ére ere en=ere ku=ere')).toEqual([]);
		const options = bundle.stories.st_u28_st1.questions[1].options;
		expect(options).toContain('ére');
		expect(options).not.toContain('ere');
	});
});
