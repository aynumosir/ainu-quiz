/**
 * Generate a vendored attestation + valency snapshot for scripts/check-content.ts,
 * so the content check can run in CI environments that don't have the sibling
 * ainu-morpheme-database checked out. For local use the check reads the sibling
 * DB directly and this snapshot is unnecessary.
 *
 *   bun scripts/gen-lexicon.ts            # writes scripts/data/ainu-lexicon.json
 *   AINU_MDB=/path/to/db bun scripts/gen-lexicon.ts
 *
 * The output is generated data — regenerate it; don't hand-edit.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

// MUST match check-content.ts fold() exactly: full combining-diacritic range +
// apostrophe, so the vendored snapshot and the linter normalize identically.
const fold = (s: string): string =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').toLowerCase();
const mdbRoot = process.env.AINU_MDB || `${import.meta.dir}/../../ainu-morpheme-database`;
const dbJson = `${mdbRoot}/morpheme_db/output/morpheme_database.json`;
if (!existsSync(dbJson)) {
	console.error(`morpheme DB not found at ${dbJson} — set $AINU_MDB to an ainu-morpheme-database checkout.`);
	process.exit(1);
}

const attested = new Set<string>();
for (const rel of [
	'data/corpus/output/ainu_corpora/token_frequency.tsv',
	'data/corpus/output/ainu_corpora/lemma_frequency.tsv'
]) {
	const p = `${mdbRoot}/${rel}`;
	if (!existsSync(p)) continue;
	for (const line of readFileSync(p, 'utf8').split('\n').slice(1)) {
		const f = line.split('\t')[0];
		if (f) attested.add(fold(f.replace(/=$/, '')));
	}
}
// folded lemma -> union of verb categories across homonyms + category_alt
const valencySets = new Map<string, Set<string>>();
for (const e of JSON.parse(readFileSync(dbJson, 'utf8')) as {
	lemma: string;
	allomorphs?: string[];
	category?: string;
	category_alt?: string[];
}[]) {
	if (e.lemma) attested.add(fold(e.lemma));
	for (const a of e.allomorphs ?? []) if (a) attested.add(fold(a));
	const key = fold(e.lemma);
	for (const c of [e.category, ...(e.category_alt ?? [])])
		if (c && /^v[tidc]?$/.test(c)) (valencySets.get(key) ?? valencySets.set(key, new Set()).get(key)!).add(c);
}
const valency: Record<string, string[]> = {};
for (const [k, set] of valencySets) valency[k] = [...set];

const outDir = `${import.meta.dir}/data`;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const out = `${outDir}/ainu-lexicon.json`;
writeFileSync(out, JSON.stringify({ attested: [...attested].filter(Boolean).sort(), valency }));
console.log(`wrote ${out} — ${attested.size} attested forms, ${Object.keys(valency).length} verb valency entries`);
