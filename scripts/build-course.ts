/**
 * Merge the textbook-sequenced, MCP-verified unit files in src/lib/content/_gen/
 * (written by the ainu-curriculum-expand workflow) into a single
 * src/lib/content/course-generated.ts, deduping vocab by Ainu form against the
 * hand-curated course.ts and resolving all references. Re-run after the workflow:
 *     bun scripts/build-course.ts
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { bundle as base } from '../src/lib/content/course';

const ROOT = import.meta.dir + '/..';
const GEN = `${ROOT}/src/lib/content/_gen`;
const OUT = `${ROOT}/src/lib/content/course-generated.ts`;

// Cumulative: merge every _syllabus*.json (each expansion run adds one), then
// order sections/units by their numeric id so multiple runs stack correctly.
const syllFiles = readdirSync(GEN)
	.filter((f) => /^_syllabus.*\.json$/.test(f))
	.sort();
if (!syllFiles.length) {
	console.error(`No _syllabus*.json in ${GEN} — run the curriculum workflow first.`);
	process.exit(1);
}
const syllabus: { sections: any[]; units: any[] } = { sections: [], units: [] };
const seenSec = new Set<string>();
const seenUnit = new Set<string>();
for (const f of syllFiles) {
	try {
		const s = JSON.parse(readFileSync(`${GEN}/${f}`, 'utf8'));
		for (const sec of s.sections || []) if (!seenSec.has(sec.id)) { seenSec.add(sec.id); syllabus.sections.push(sec); }
		for (const u of s.units || []) if (!seenUnit.has(u.unitId)) { seenUnit.add(u.unitId); syllabus.units.push(u); }
	} catch (e) {
		console.warn('skip syllabus', f, '—', e instanceof Error ? e.message : e);
	}
}
const num = (s: string) => parseInt(String(s).replace(/\D/g, ''), 10) || 0;
syllabus.sections.sort((a, b) => num(a.id) - num(b.id));
syllabus.units.sort((a, b) => num(a.unitId) - num(b.unitId));

// load every unit file
const unitFiles: Record<string, any> = {};
for (const f of readdirSync(GEN)) {
	if (!f.endsWith('.json') || f === '_syllabus.json') continue;
	try {
		const u = JSON.parse(readFileSync(`${GEN}/${f}`, 'utf8'));
		if (u && u.unitId) unitFiles[u.unitId] = u;
	} catch (e) {
		console.warn('skip unreadable', f, '—', e instanceof Error ? e.message : e);
	}
}

// vocab id map (Ainu latin -> canonical id), seeded from the hand-curated bundle
const latinToId = new Map<string, string>();
for (const v of Object.values(base.vocab) as any[]) latinToId.set(v.latin, v.id);
const usedIds = new Set<string>(Object.keys(base.vocab));

function slugId(latin: string): string {
	let s = 'v_' + latin.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
	if (s === 'v_') s = 'v_x';
	let id = s;
	let i = 2;
	while (usedIds.has(id)) id = `${s}_${i++}`;
	return id;
}

const genVocab: Record<string, any> = {};
// pass 1 — assign ids for every NEW vocab declared across units (dedup by latin)
for (const u of Object.values(unitFiles)) {
	for (const v of u.vocab || []) {
		const latin = (v.latin || '').trim();
		if (!latin || latinToId.has(latin)) continue;
		const id = slugId(latin);
		usedIds.add(id);
		latinToId.set(latin, id);
		genVocab[id] = {
			id,
			latin,
			gloss: v.gloss,
			...(v.category ? { category: v.category } : {}),
			...(v.pos ? { pos: v.pos } : {}),
			...(v.note && v.note.ja ? { note: v.note } : {})
		};
	}
}

const resolveVocab = (latins?: string[]) =>
	(latins || []).map((l) => latinToId.get((l || '').trim())).filter(Boolean) as string[];

const genSentences: Record<string, any> = {};
const genStories: Record<string, any> = {};
const unitsById: Record<string, any> = {};

for (const u of Object.values(unitFiles)) {
	const sKey: Record<string, string> = {};
	for (const s of u.sentences || []) {
		const gid = `${u.unitId}_${s.key}`;
		sKey[s.key] = gid;
		genSentences[gid] = {
			id: gid,
			latin: s.latin,
			translation: s.translation,
			...(resolveVocab(s.vocab).length ? { vocab: resolveVocab(s.vocab) } : {}),
			...(s.blank && s.blank.answer ? { blank: s.blank } : {}),
			...(s.convo && s.convo.options ? { convo: s.convo } : {}),
			...(s.dialect ? { dialect: s.dialect } : {}),
			...(s.source ? { source: s.source } : {})
		};
	}
	const stKey: Record<string, string> = {};
	for (const st of u.stories || []) {
		const gid = `st_${u.unitId}_${st.key}`;
		stKey[st.key] = gid;
		genStories[gid] = { id: gid, title: st.title, lines: st.lines, questions: st.questions };
	}
	const nodes = (u.nodes || []).map((n: any) => ({
		id: n.id,
		type: n.type,
		title: n.title,
		...(n.levels ? { levels: n.levels } : {}),
		...(resolveVocab(n.vocab).length ? { vocab: resolveVocab(n.vocab) } : {}),
		...((n.sentences || []).map((k: string) => sKey[k]).filter(Boolean).length
			? { sentences: (n.sentences || []).map((k: string) => sKey[k]).filter(Boolean) }
			: {}),
		...(n.storyKey && stKey[n.storyKey] ? { storyId: stKey[n.storyKey] } : {}),
		...(n.legendary ? { legendary: true } : {})
	}));
	unitsById[u.unitId] = { id: u.unitId, label: u.label, title: u.title, accent: u.accent, nodes };
}

const sections = (syllabus.sections || [])
	.map((sec: any) => ({
		id: sec.id,
		title: sec.title,
		...(sec.cefr ? { cefr: sec.cefr } : {}),
		units: (syllabus.units || [])
			.filter((u: any) => u.sectionId === sec.id)
			.map((u: any) => unitsById[u.unitId])
			.filter(Boolean)
	}))
	.filter((s: any) => s.units.length);

const generated = { sections, vocab: genVocab, sentences: genSentences, stories: genStories };

const out = `// AUTO-GENERATED by scripts/build-course.ts — textbook-sequenced, MCP-verified
// units (see the curriculum workflow). Merged with the hand-curated course.ts in
// index.ts. Do not edit by hand; re-run: bun scripts/build-course.ts
import type { Section, Vocab, Sentence, Story } from './types';

export const generated: {
\tsections: Section[];
\tvocab: Record<string, Vocab>;
\tsentences: Record<string, Sentence>;
\tstories: Record<string, Story>;
} = ${JSON.stringify(generated, null, '\t')};
`;
writeFileSync(OUT, out);

console.log(`wrote ${OUT}`);
console.log(
	`sections=${sections.length} units=${Object.keys(unitsById).length} newVocab=${Object.keys(genVocab).length} sentences=${Object.keys(genSentences).length} stories=${Object.keys(genStories).length}`
);
const missing = (syllabus.units || []).filter((u: any) => !unitFiles[u.unitId]).map((u: any) => u.unitId);
if (missing.length) console.warn('MISSING unit files (workflow may have skipped):', missing.join(', '));
