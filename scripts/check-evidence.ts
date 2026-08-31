/**
 * Evidence gate for course content.
 *
 * Enumerates every learner-visible Ainu form (sentences, story lines, story
 * questions) and validates its `source` citations. A citation is one or more
 * corpus pointers (`collection/document#index`), each optionally followed by
 * a parenthesized quote of the attested text; prose describing a construction
 * or a print-dictionary reference counts as a manual witness and is reported,
 * never silently passed.
 *
 * Two modes:
 * - With the corpus database (default `~/projects/Ainu/ainu-corpora-api/build/
 *   corpus.db`, override via AINU_CORPUS_DB): resolves every pointer and
 *   compares each against the existing `scripts/evidence-lock.json`. A pointer
 *   whose attested text changed since the last validation is an error —
 *   positional ids shift between corpus builds — unless AINU_EVIDENCE_REFRESH=1
 *   accepts the new text. The lock is rewritten only on an error-free run.
 * - Without it (CI): verifies content hashes against the lock, so any change to
 *   a sentence's Ainu text or citations fails until revalidated locally.
 *
 * Errors: dangling or malformed pointer, attested text changed under a pointer,
 * content changed without lock refresh, pointer-bearing source that resolved no
 * witness. Warnings: forms with no evidence (story backlog), sentences whose
 * witnesses are all adapted bases or manual prose, quotes that no longer match.
 */
import { Database } from 'bun:sqlite';
import { join, dirname } from 'node:path';
import type { Sentence, Story } from '../src/lib/content/types';

const ROOT = dirname(import.meta.dir);
const LOCK_PATH = join(import.meta.dir, 'evidence-lock.json');
const DB_PATH =
	process.env.AINU_CORPUS_DB ??
	join(process.env.HOME ?? '', 'projects/Ainu/ainu-corpora-api/build/corpus.db');
const REFRESH = process.env.AINU_EVIDENCE_REFRESH === '1';
const NORMALIZER_VERSION = 2;

const { bundle } = await import(join(ROOT, 'src/lib/content/index.ts'));
const sentences: Record<string, Sentence> = bundle.sentences;
const stories: Record<string, Story> = bundle.stories;

const POINTER_RE = /([a-z0-9-]+\/[^\s()、;,]+#\d+)/g;
// a slash-and-digit token that looks like a corpus reference but is not a
// well-formed pointer (missing #index, stray spacing) — these must not
// silently degrade to prose
const POINTERISH_RE = /[a-z0-9-]+\/[^\s()、;,]*\d[^\s()、;,]*/g;

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

/** quote fragments from `(...)` after a pointer: trailing CJK dialect label
 *  stripped, then split on … — each fragment must appear in order. A
 *  parenthetical with no Latin content is a descriptive annotation, not a
 *  quote, and is not checked. */
function quoteMatches(quote: string, corpusText: string): boolean {
	const body = quote
		.replace(/\s[—–]\s.*$/u, '') // trailing annotation after an em dash
		.replace(/[,、]\s*[^,、()]*[぀-鿿][^,、()]*$/u, ''); // trailing dialect label
	// Ainu quotes are lowercase Latin; labels like "CDエクスプレス" are not quotes
	if (!/[a-z]{2}/.test(body)) return true;
	const frags = body
		.split(/[…、,]|[぀-鿿『』]+/u) // CJK runs are annotations, not quote text
		.map((f) => seg(f.replace(/^\s*(cf|eg)\.?\s*/i, '')))
		.filter((f) => f.length >= 4);
	const hay = seg(corpusText);
	let at = 0;
	for (const f of frags) {
		const i = hay.indexOf(f, at);
		if (i < 0) return false;
		at = i + f.length;
	}
	return true;
}

interface Surface {
	id: string;
	kind: 'sentence' | 'story-line' | 'story-question';
	latin: string;
	source?: string;
	viaSentence?: string;
}

const surfaces: Surface[] = [];
for (const s of Object.values(sentences)) {
	surfaces.push({ id: s.id, kind: 'sentence', latin: s.latin, source: s.source });
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
			source: reuse?.source,
			viaSentence: reuse?.id
		});
	}
	for (const q of st.questions ?? []) {
		const reuse = byNorm.get(norm(q.answer));
		surfaces.push({
			id: storyKey(st.id, q.answer),
			kind: 'story-question',
			latin: q.answer,
			source: reuse?.source,
			viaSentence: reuse?.id
		});
	}
}

interface Witness {
	pointer: string;
	sourceSlug: string;
	quote: string;
	quoteHash: string;
	match: string;
}
interface LockEntry {
	latinHash: string;
	sourceHash: string;
	viaSentence?: string;
	witnesses: Witness[];
}
interface Lock {
	normalizerVersion: number;
	corpus?: { path: string; size: number; mtimeMs: number };
	entries: Record<string, LockEntry>;
}

const errors: string[] = [];
const warnings: string[] = [];
const classCounts: Record<string, number> = {};

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
		if (!f.source) {
			if (f.kind === 'sentence') errors.push(`${f.id}: no source`);
			else warnings.push(`${f.id}: no evidence (story backlog): ${f.latin}`);
			continue;
		}
		const pointers = [...f.source.matchAll(POINTER_RE)].map((m) => m[1]);
		for (const m of f.source.matchAll(POINTERISH_RE)) {
			const tok = m[0];
			if (!pointers.some((p) => p === tok || p.startsWith(tok) || tok.startsWith(p)))
				errors.push(`${f.id}: malformed corpus reference "${tok}" — needs collection/doc#index`);
		}
		const entry: LockEntry = {
			latinHash: sha(f.latin),
			sourceHash: sha(f.source),
			...(f.viaSentence ? { viaSentence: f.viaSentence } : {}),
			witnesses: []
		};
		const priorWitnesses = new Map(
			(prior?.entries[f.id]?.witnesses ?? []).map((w) => [w.pointer, w])
		);
		for (const p of pointers) {
			const row = byId.get(p) as { text: string; source_slug: string } | null;
			if (!row) {
				errors.push(`${f.id}: dangling pointer ${p}`);
				continue;
			}
			const w: Witness = {
				pointer: p,
				sourceSlug: row.source_slug,
				quote: row.text,
				quoteHash: sha(row.text),
				match: matchClass(f.latin, row.text)
			};
			const old = priorWitnesses.get(p);
			if (old && old.quoteHash !== w.quoteHash && !REFRESH) {
				errors.push(
					`${f.id}: attested text changed under ${p} (was "${old.quote}", corpus now has "${row.text}") — rerun with AINU_EVIDENCE_REFRESH=1 to accept`
				);
			}
			const quoted = f.source.match(
				new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(([^)]+)\\)')
			);
			if (quoted && !quoteMatches(quoted[1], row.text))
				warnings.push(`${f.id}: quote for ${p} differs from corpus text: ${row.text}`);
			entry.witnesses.push(w);
			classCounts[w.match] = (classCounts[w.match] ?? 0) + 1;
		}
		if (pointers.length > 0 && entry.witnesses.length === 0)
			errors.push(`${f.id}: no pointer resolved to a witness`);
		if (f.kind === 'sentence') {
			if (pointers.length === 0)
				warnings.push(`${f.id}: manual-only witness (print reference / construction note)`);
			else if (!entry.witnesses.some((w) => DIRECT.has(w.match)))
				warnings.push(
					`${f.id}: no direct attestation — witnesses are adapted bases only (${entry.witnesses.map((w) => w.match).join(', ')})`
				);
		}
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
		if (!f.source) {
			if (f.kind === 'sentence') errors.push(`${f.id}: no source`);
			else warnings.push(`${f.id}: no evidence (story backlog): ${f.latin}`);
			continue;
		}
		if (!entry) {
			errors.push(`${f.id}: not in evidence lock — run with corpus.db to validate`);
			continue;
		}
		if (entry.latinHash !== sha(f.latin))
			errors.push(`${f.id}: Ainu text changed since last validation`);
		if (entry.sourceHash !== sha(f.source))
			errors.push(`${f.id}: source citation changed since last validation`);
		const pointers = [...f.source.matchAll(POINTER_RE)].map((m) => m[1]);
		if (pointers.length > 0 && entry.witnesses.length === 0)
			errors.push(`${f.id}: lock entry has pointers but no resolved witnesses`);
		for (const w of entry.witnesses) classCounts[w.match] = (classCounts[w.match] ?? 0) + 1;
	}
}

const nSent = surfaces.filter((f) => f.kind === 'sentence').length;
const covered = surfaces.filter((f) => f.source).length;
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
