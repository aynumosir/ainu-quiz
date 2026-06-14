/**
 * Lint the Ainu course content for correctness the type system can't catch:
 *
 *   1. ATTESTATION (error) — every distinct Ainu word form used in a sentence or
 *      vocab entry must be attested (corpus / morpheme DB / dictionary allowlist).
 *      Catches typos and invented forms (this is the check that surfaced *eyaynu).
 *   2. VALENCY (error) — an unambiguous object clitic (en= / i= / un=) must not sit
 *      on a verb that is intransitive across every category we know for it. Verbs
 *      with a transitive sense (incl. category_alt, or on the LABILE allowlist) are
 *      exempt, since the morpheme DB collapses each lemma to one primary category.
 *   3. DUPLICATES (warning) — identical Ainu sentences reused under multiple ids.
 *
 * Reference data comes from the sibling ainu-morpheme-database (corpus frequency
 * tables + morpheme DB). Override its location with $AINU_MDB. If neither the
 * sibling DB nor a vendored scripts/data/ainu-lexicon.json is present, attestation
 * is skipped with a notice (valency + duplicates still run).
 *
 *   bun scripts/check-content.ts            # report; exits 1 on any error
 *   bun scripts/check-content.ts --strict   # also fail on warnings (duplicates)
 *
 * KNOWN LIMITS (by design): attestation is verbatim (accent-folded) — it does not
 * decompose solid compounds, so a well-formed compound absent from the corpus needs
 * a DICTIONARY_ALLOWLIST entry; and accent *placement* is intentionally not checked
 * here. Valency is a high-precision tripwire, not a full parser; lability the DB
 * can't express is handled via LABILE_ALLOWLIST.
 */
import { readFileSync, existsSync } from 'node:fs';
import { bundle } from '../src/lib/content/index';

const STRICT = process.argv.includes('--strict');

// ---------------------------------------------------------------- normalization
const PUNCT = /[.,!?;:"“”()「」『』]/g; // NB: apostrophe handled in fold(), not here
/** Drop display accents (non-lexical) AND the glottal apostrophe, canonicalizing
 *  both sides of every comparison. Strips the whole combining-diacritic range. */
const fold = (s: string): string =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').toLowerCase();

/** Leading personal clitics (X=), incl. pre-vocalic reduced k=/c=. Longest-first. */
const LEAD = ['eci', 'ku', 'ci', 'an', 'en', 'un', 'a', 'e', 'i', 'k', 'c'];

/**
 * Reduce a surface token to its bare lexical stem. Strips leading clitics, then a
 * trailing intransitive-subject suffix (=an/=as); a still-remaining '=' means an
 * UNRECOGNIZED clitic, so the token is returned intact (with '=') and will fail
 * attestation rather than being silently salvaged.
 */
function toStem(raw: string): string | null {
	let t = raw.replace(PUNCT, '').trim();
	if (!t) return null;
	let changed = true;
	while (changed) {
		changed = false;
		for (const c of LEAD) {
			if (t.toLowerCase().startsWith(c + '=')) {
				t = t.slice(c.length + 1);
				changed = true;
				break;
			}
		}
	}
	t = t.replace(/=(an|as)$/i, ''); // trailing 4th/1pl intransitive-subject suffix
	return t ? fold(t) : null; // any residual '=' stays in t → unattested → flagged
}

/** Shared cleaning so hasObjectClitic sees the same surface toStem does. */
const clean = (raw: string): string => raw.replace(PUNCT, '').replace(/['’]/g, '');
/** Unambiguous OBJECT clitics (en=/i=/un=); e= and a= are ambiguous and excluded. */
const hasObjectClitic = (raw: string): boolean => /(^|=)(en|i|un)=/i.test(clean(raw));

/** Canonicalize a free-form pos string to a valency code (or null). */
function canonPos(p: string): 'vi' | 'vt' | 'vd' | 'vc' | 'v' | null {
	const s = p.toLowerCase().trim();
	if (s === 'vd' || /ditransitive|複他動|三項/.test(s)) return 'vd';
	if (s === 'vi' || /intransitive|自動/.test(s)) return 'vi';
	if (s === 'vc') return 'vc';
	if (s === 'vt' || /transitive|他動/.test(s)) return 'vt'; // after vi/vd: 'intransitive'/'ditransitive' already matched
	if (s === 'v' || /(^|[^a-z])verb|動詞/.test(s)) return 'v';
	return null;
}

// ---------------------------------------------------------------------- lexicon
interface Lexicon {
	attested: Set<string>;
	valency: Map<string, Set<string>>; // folded lemma -> {vt,vi,vd,vc,...} (union over homonyms + category_alt)
	source: string;
}
interface MdbEntry { lemma: string; allomorphs?: string[]; category?: string; category_alt?: string[] }

function addCat(map: Map<string, Set<string>>, key: string, cat?: string | null): void {
	if (!cat) return;
	(map.get(key) ?? map.set(key, new Set()).get(key)!).add(cat);
}

function loadLexicon(): Lexicon | null {
	const mdbRoot = process.env.AINU_MDB || `${import.meta.dir}/../../ainu-morpheme-database`;
	const dbJson = `${mdbRoot}/morpheme_db/output/morpheme_database.json`;
	if (existsSync(dbJson)) {
		const attested = new Set<string>();
		const valency = new Map<string, Set<string>>();
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
		for (const e of JSON.parse(readFileSync(dbJson, 'utf8')) as MdbEntry[]) {
			if (e.lemma) attested.add(fold(e.lemma));
			for (const a of e.allomorphs ?? []) if (a) attested.add(fold(a));
			const key = fold(e.lemma);
			if (e.category && /^v[tidc]?$/.test(e.category)) addCat(valency, key, e.category);
			for (const a of e.category_alt ?? []) if (/^v[tidc]?$/.test(a)) addCat(valency, key, a);
		}
		return { attested, valency, source: `morpheme DB @ ${mdbRoot}` };
	}
	const vendored = `${import.meta.dir}/data/ainu-lexicon.json`;
	if (existsSync(vendored)) {
		const v = JSON.parse(readFileSync(vendored, 'utf8')) as { attested: string[]; valency: Record<string, string[]> };
		return {
			attested: new Set(v.attested),
			valency: new Map(Object.entries(v.valency).map(([k, cats]) => [k, new Set(cats)])),
			source: 'vendored scripts/data/ainu-lexicon.json'
		};
	}
	return null;
}

/**
 * Forms confirmed attested in a dictionary but absent from the corpus / morpheme
 * DB snapshot (else false-flagged). Each MUST cite its source.
 */
const DICTIONARY_ALLOWLIST: Record<string, string> = {
	ukoerankarap: 'Ota 2022: [他] 皆で挨拶する — reciprocal of (ko)erankarap; absent from corpus snapshot'
};

/**
 * Labile verbs the morpheme DB tags with only their intransitive sense but which
 * also have an attested transitive use — suppresses the object-clitic valency flag.
 */
const LABILE_ALLOWLIST: Record<string, string> = {
	as: 'labile: vi "stand (sg)" but also transitive "erect/set up"; DB tags vi only'
};

// ------------------------------------------------------------------------- main
interface Finding { level: 'error' | 'warn'; kind: string; where: string; message: string }
const findings: Finding[] = [];

const lex = loadLexicon();
// Course-defined vocab valency (canonicalized pos) augments the morpheme-DB map.
const vocabPos = new Map<string, Set<string>>();
for (const v of Object.values(bundle.vocab)) {
	if (!v.pos) continue;
	const cat = canonPos(v.pos);
	if (!cat || cat === 'v') continue; // 'v' = verb of unknown valency
	for (const w of v.latin.split(/\s+/)) {
		const s = toStem(w);
		if (s) addCat(vocabPos, s, cat);
	}
}
const catsOf = (stem: string): Set<string> => new Set([...(lex?.valency.get(stem) ?? []), ...(vocabPos.get(stem) ?? [])]);
const isIntransitive = (stem: string): boolean => {
	if (stem in LABILE_ALLOWLIST) return false;
	const cats = catsOf(stem);
	return cats.has('vi') && !cats.has('vt') && !cats.has('vd') && !cats.has('vc');
};

// Every Ainu surface in the bundle: sentences + vocab.
const surfaces: { latin: string; where: string }[] = [];
for (const s of Object.values(bundle.sentences)) surfaces.push({ latin: s.latin, where: s.id });
for (const v of Object.values(bundle.vocab)) surfaces.push({ latin: v.latin, where: v.id });

// 1) attestation
const reportedUnattested = new Set<string>();
if (lex) {
	for (const { latin, where } of surfaces) {
		for (const w of latin.split(/\s+/)) {
			const stem = toStem(w);
			if (!stem || reportedUnattested.has(stem)) continue;
			if (lex.attested.has(stem) || stem in DICTIONARY_ALLOWLIST) continue;
			reportedUnattested.add(stem);
			findings.push({
				level: 'error',
				kind: 'attestation',
				where,
				message: `unattested word form "${stem}" (from "${w}") — not in corpus, morpheme DB, or allowlist`
			});
		}
	}
}

// 2) valency: object clitic on a verb that is intransitive across all known senses
for (const { latin, where } of surfaces) {
	for (const w of latin.split(/\s+/)) {
		if (!hasObjectClitic(w)) continue;
		const stem = toStem(w);
		if (!stem || catsOf(stem).size === 0) continue; // unknown valency → can't judge
		if (isIntransitive(stem))
			findings.push({
				level: 'error',
				kind: 'valency',
				where,
				message: `object clitic on intransitive verb in "${w}" (stem "${stem}" = vi) — vi takes no object`
			});
	}
}

// 3) duplicate sentences
const byLatin = new Map<string, string[]>();
for (const s of Object.values(bundle.sentences)) {
	const key = fold(s.latin.trim());
	(byLatin.get(key) ?? byLatin.set(key, []).get(key)!).push(s.id);
}
for (const [key, ids] of byLatin)
	if (ids.length > 1)
		findings.push({ level: 'warn', kind: 'duplicate', where: ids.join(', '), message: `same sentence under ${ids.length} ids: "${key}"` });

// ------------------------------------------------------------------------ report
const nVocab = Object.values(bundle.vocab).length;
const nSent = Object.values(bundle.sentences).length;
console.log(`tu itak content check — ${nVocab} vocab + ${nSent} sentences`);
console.log(lex ? `attestation: ${lex.source}` : 'attestation: SKIPPED (no morpheme DB / vendored lexicon — set $AINU_MDB)');

const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');
const show = (f: Finding) => console.log(`  ${f.level === 'error' ? '✗' : '⚠'} [${f.kind}] ${f.where}: ${f.message}`);
if (errors.length) { console.log(`\n${errors.length} error(s):`); errors.forEach(show); }
if (warns.length) { console.log(`\n${warns.length} warning(s):`); warns.forEach(show); }
if (!findings.length) console.log('\n✓ no issues');

const failed = errors.length > 0 || (STRICT && warns.length > 0);
console.log(`\n${failed ? 'FAIL' : 'OK'} — ${errors.length} error(s), ${warns.length} warning(s) over ${nVocab + nSent} items`);
process.exit(failed ? 1 : 0);
