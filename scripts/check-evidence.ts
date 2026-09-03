/**
 * Evidence gate for course content.
 *
 * Enumerates every learner-visible Ainu form (sentences, story lines, story
 * questions) and validates its typed `evidence` witnesses (see `Witness` in
 * src/lib/content/types.ts): corpus witnesses carry a pointer and a role,
 * print/manual references carry a `ref` string.
 *
 * Two modes:
 * - With the corpus database (default `~/projects/Ainu/ainu-corpora-api/build/
 *   corpus.db`, override via AINU_CORPUS_DB): resolves every pointer and
 *   compares each against the existing `scripts/evidence-lock.json`. A pointer
 *   whose attested text changed since the last validation is an error —
 *   positional ids shift between corpus builds — unless AINU_EVIDENCE_REFRESH=1
 *   accepts the new text. The lock is rewritten only on an error-free run.
 * - Without it (CI): verifies content hashes against the lock, so any change to
 *   a sentence's Ainu text or evidence fails until revalidated locally.
 *
 * Errors: dangling pointer; an `attests` witness whose locus does not contain
 * the form; a corpus pointer hiding inside a `ref` string; a sentence with no
 * evidence; attested text changed under a pointer; content changed without
 * lock refresh. Warnings: forms with no evidence (story backlog); sentences
 * with no `attests` witness; a `base`/`parallel` witness whose locus matches
 * the form directly (its role should be `attests`).
 */
import { Database } from 'bun:sqlite';
import { join, dirname } from 'node:path';
import type { Sentence, Story, Witness } from '../src/lib/content/types';

const ROOT = dirname(import.meta.dir);
const LOCK_PATH = join(import.meta.dir, 'evidence-lock.json');
const DB_PATH =
	process.env.AINU_CORPUS_DB ??
	join(process.env.HOME ?? '', 'projects/Ainu/ainu-corpora-api/build/corpus.db');
const REFRESH = process.env.AINU_EVIDENCE_REFRESH === '1';
const NORMALIZER_VERSION = 3;

const { bundle } = await import(join(ROOT, 'src/lib/content/index.ts'));
const sentences: Record<string, Sentence> = bundle.sentences;
const stories: Record<string, Story> = bundle.stories;

const POINTER_RE = /[a-z0-9-]+\/[^\s()、;,]+#\d+/;

function norm(s: string): string {
	return s
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[.?？!！,"'“”‘’「」『』（）():：;；・]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
function seg(s: string): string {
	return norm(s).replace(/[=-]/g, '').replace(/ /g, '');
}
function stripSpeaker(s: string): string {
	return s.replace(/^[A-Za-zĀ-ž=]+\s*[:：]\s*/, '');
}
function sha(s: string): string {
	return new Bun.CryptoHasher('sha256').update(s).digest('hex').slice(0, 16);
}
function matchClass(latin: string, corpusText: string): string {
	const a = latin.trim();
	const b = stripSpeaker(corpusText.trim());
	if (a === corpusText.trim()) return 'exact';
	if (norm(a) === norm(b)) return 'normalized';
	if (seg(a) === seg(b)) return 'segmental';
	// substring matches on folded letters are meaningless for very short forms
	if (seg(a).length >= 10 && seg(b).includes(seg(a))) return 'excerpt';
	if (seg(b).length >= 10 && seg(a).includes(seg(b))) return 'base';
	return 'adapted';
}
const DIRECT = new Set(['exact', 'normalized', 'segmental', 'excerpt']);

interface Surface {
	id: string;
	kind: 'sentence' | 'story-line' | 'story-question';
	latin: string;
	evidence?: Witness[];
	viaSentence?: string;
}

const surfaces: Surface[] = [];
for (const s of Object.values(sentences)) {
	surfaces.push({ id: s.id, kind: 'sentence', latin: s.latin, evidence: s.evidence });
}
const byNorm = new Map<string, Sentence>();
for (const s of Object.values(sentences)) byNorm.set(norm(s.latin), s);
const seen = new Map<string, number>();
function storyKey(storyId: string, latin: string): string {
	// keyed by content hash, not position, so inserting a line does not
	// renumber its siblings; duplicates get an ordinal suffix
	const base = `${storyId}~${sha(latin).slice(0, 8)}`;
	const n = (seen.get(base) ?? 0) + 1;
	seen.set(base, n);
	return n === 1 ? base : `${base}~${n}`;
}
for (const st of Object.values(stories)) {
	for (const line of st.lines) {
		const reuse = byNorm.get(norm(line.latin));
		surfaces.push({
			id: storyKey(st.id, line.latin),
			kind: 'story-line',
			latin: line.latin,
			evidence: reuse?.evidence,
			viaSentence: reuse?.id
		});
	}
	for (const q of st.questions ?? []) {
		const reuse = byNorm.get(norm(q.answer));
		surfaces.push({
			id: storyKey(st.id, q.answer),
			kind: 'story-question',
			latin: q.answer,
			evidence: reuse?.evidence,
			viaSentence: reuse?.id
		});
	}
}

interface LockWitness {
	pointer: string;
	role: string;
	sourceSlug: string;
	quote: string;
	quoteHash: string;
	match: string;
}
interface LockEntry {
	latinHash: string;
	evidenceHash: string;
	viaSentence?: string;
	witnesses: LockWitness[];
}
interface Lock {
	normalizerVersion: number;
	corpus?: { path: string; size: number; mtimeMs: number };
	entries: Record<string, LockEntry>;
}

const errors: string[] = [];
const warnings: string[] = [];
const classCounts: Record<string, number> = {};

const evidenceHash = (ws: Witness[]) => sha(JSON.stringify(ws));
const pointerWitnesses = (ws: Witness[]) =>
	ws.filter((w): w is Extract<Witness, { pointer: string }> => 'pointer' in w);

const dbFile = Bun.file(DB_PATH);
const online = await dbFile.exists();
const lockFile = Bun.file(LOCK_PATH);
const prior: Lock | undefined = (await lockFile.exists()) ? await lockFile.json() : undefined;

if (online) {
	const db = new Database(DB_PATH, { readonly: true });
	const byId = db.query('select text, source_slug from sentences where id = ?');
	const next: Lock = {
		normalizerVersion: NORMALIZER_VERSION,
		corpus: { path: DB_PATH, size: dbFile.size, mtimeMs: Math.round(dbFile.lastModified) },
		entries: {}
	};
	for (const f of surfaces) {
		if (!f.evidence || f.evidence.length === 0) {
			if (f.kind === 'sentence') errors.push(`${f.id}: no evidence`);
			else warnings.push(`${f.id}: no evidence (story backlog): ${f.latin}`);
			continue;
		}
		const entry: LockEntry = {
			latinHash: sha(f.latin),
			evidenceHash: evidenceHash(f.evidence),
			...(f.viaSentence ? { viaSentence: f.viaSentence } : {}),
			witnesses: []
		};
		const priorWitnesses = new Map(
			(prior?.entries[f.id]?.witnesses ?? []).map((w) => [w.pointer, w])
		);
		for (const w of f.evidence) {
			if (!('pointer' in w)) {
				if (POINTER_RE.test(w.ref))
					errors.push(`${f.id}: ref "${w.ref}" contains a corpus pointer — cite it as a witness`);
				continue;
			}
			const row = byId.get(w.pointer) as { text: string; source_slug: string } | null;
			if (!row) {
				errors.push(`${f.id}: dangling pointer ${w.pointer}`);
				continue;
			}
			const match = matchClass(f.latin, row.text);
			if (w.role === 'attests' && !DIRECT.has(match))
				errors.push(
					`${f.id}: witness ${w.pointer} claims 'attests' but the locus ("${row.text}") does not contain the form (${match})`
				);
			if ((w.role === 'base' || w.role === 'parallel') && DIRECT.has(match))
				warnings.push(
					`${f.id}: witness ${w.pointer} matches directly (${match}) — role should be 'attests'`
				);
			const old = priorWitnesses.get(w.pointer);
			const quoteHash = sha(row.text);
			if (old && old.quoteHash !== quoteHash && !REFRESH) {
				errors.push(
					`${f.id}: attested text changed under ${w.pointer} (was "${old.quote}", corpus now has "${row.text}") — rerun with AINU_EVIDENCE_REFRESH=1 to accept`
				);
			}
			entry.witnesses.push({
				pointer: w.pointer,
				role: w.role,
				sourceSlug: row.source_slug,
				quote: row.text,
				quoteHash,
				match
			});
			classCounts[match] = (classCounts[match] ?? 0) + 1;
		}
		if (f.kind === 'sentence' && !entry.witnesses.some((w) => w.role === 'attests'))
			warnings.push(
				`${f.id}: no attesting witness — ${entry.witnesses.length ? 'adapted/parallel bases only' : 'print references only'}`
			);
		next.entries[f.id] = entry;
	}
	if (errors.length === 0) {
		await Bun.write(LOCK_PATH, JSON.stringify(next, null, 1) + '\n');
	}
} else {
	if (!prior) {
		console.error('✗ corpus.db unavailable and no evidence-lock.json — cannot verify evidence');
		process.exit(1);
	}
	if (prior.normalizerVersion !== NORMALIZER_VERSION)
		errors.push(
			`evidence lock was written by normalizer v${prior.normalizerVersion}, current is v${NORMALIZER_VERSION} — revalidate with corpus.db`
		);
	const surfaceIds = new Set(surfaces.map((f) => f.id));
	for (const id of Object.keys(prior.entries))
		if (!surfaceIds.has(id)) warnings.push(`lock entry ${id} matches no current surface (stale)`);
	for (const f of surfaces) {
		const entry = prior.entries[f.id];
		if (!f.evidence || f.evidence.length === 0) {
			if (f.kind === 'sentence') errors.push(`${f.id}: no evidence`);
			else warnings.push(`${f.id}: no evidence (story backlog): ${f.latin}`);
			continue;
		}
		if (!entry) {
			errors.push(`${f.id}: not in evidence lock — run with corpus.db to validate`);
			continue;
		}
		if (entry.latinHash !== sha(f.latin))
			errors.push(`${f.id}: Ainu text changed since last validation`);
		if (entry.evidenceHash !== evidenceHash(f.evidence))
			errors.push(`${f.id}: evidence changed since last validation`);
		if (pointerWitnesses(f.evidence).length !== entry.witnesses.length)
			errors.push(`${f.id}: lock witnesses do not cover the evidence — revalidate with corpus.db`);
		for (const w of entry.witnesses) classCounts[w.match] = (classCounts[w.match] ?? 0) + 1;
	}
}

const nSent = surfaces.filter((f) => f.kind === 'sentence').length;
const covered = surfaces.filter((f) => f.evidence && f.evidence.length > 0).length;
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
const hist = Object.entries(classCounts)
	.sort()
	.map(([k, v]) => `${k}:${v}`)
	.join(' ');
console.log(
	`${errors.length ? 'FAIL' : 'OK'} — ${errors.length} error(s), ${warnings.length} warning(s); ` +
		`${covered}/${surfaces.length} surfaces evidenced (${nSent} sentences); witnesses ${hist}; ` +
		(online
			? errors.length
				? 'validated against corpus.db (lock NOT written)'
				: 'validated against corpus.db (lock refreshed)'
			: 'verified against evidence lock')
);
if (errors.length) process.exit(1);
