/** Check accent-sensitive course forms against the reviewed dictionary reference.
 * Run with `bun scripts/check-accents.ts`.
 *
 * Checks only listed forms in Ainu fields; unlisted forms and localized prose
 * are skipped. Personal forms have separate entries. The reference does not
 * independently validate dialect-specific accents. Source quotations retain
 * their original orthography; English “mean” must not become Ainu “méan”.
 */
import { bundle } from '../src/lib/content/index';
import reference from './data/ainu-accents.json';

const forms: Record<string, string[]> = reference.forms;
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function accentErrors(text: string): string[] {
	const errors: string[] = [];
	// Keep personal forms intact, including accented prefixes and suffixes.
	const tokens = text.normalize('NFC').match(/[A-Za-záéíóúÁÉÍÓÚ]+(?:['’=][A-Za-záéíóúÁÉÍÓÚ]+)*/g) ?? [];
	for (const token of tokens) {
		const accepted = forms[fold(token.replace(/’/g, "'"))];
		if (accepted && !accepted.includes(token.toLowerCase().replace(/’/g, "'"))) {
			errors.push(`${token} → ${accepted.join(' / ')}`);
		}
	}
	return errors;
}

export function checkAccents(): number {
	let errors = 0;
	let checked = 0;
	function check(text: string, label: string) {
		checked++;
		for (const error of accentErrors(text)) {
			console.error(`${label}: ${error}`);
			errors++;
		}
	}
	for (const v of Object.values(bundle.vocab)) check(v.latin, v.id);
	for (const s of Object.values(bundle.sentences)) {
		check(s.latin, s.id);
		if (s.blank) {
			check(s.blank.answer, `${s.id}.blank.answer`);
			s.blank.options.forEach((t) => check(t, `${s.id}.blank.options`));
		}
		if (s.convo) {
			if (typeof s.convo.prompt === 'string') check(s.convo.prompt, `${s.id}.convo.prompt`);
			s.convo.options.forEach((t) => check(t, `${s.id}.convo.options`));
		}
	}
	for (const story of Object.values(bundle.stories)) {
		story.lines.forEach((line) => {
			check(line.speaker, `${story.id}.speaker`);
			check(line.latin, `${story.id}.line`);
		});
		story.questions.forEach((q) => {
			check(q.answer, `${story.id}.answer`);
			q.options.forEach((t) => check(t, `${story.id}.options`));
		});
	}
	console.log(`Accent check: ${checked} Ainu strings, ${errors} errors.`);
	return errors;
}

if (import.meta.main) process.exitCode = checkAccents() ? 1 : 0;
