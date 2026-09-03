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
 *   accepts the new text. The lock is rewritten only on an error-free run, and
 *   records each witness's attested text, author, dialect, and collection.
 * - Without it (CI): verifies content hashes against the lock, checks that the
 *   locked witnesses match the evidence pointer-for-pointer, and re-applies the
 *   role rules to the locked match classes.
 *
 * Errors: dangling or malformed pointer; an `attests` witness whose locus does
 * not contain the form; an `options` witness matching no exercise option; a
 * corpus reference hiding inside a `ref` string; a sentence with no evidence;
 * attested text changed under a pointer; content changed without lock refresh.
 * Warnings: forms with no evidence (story backlog); sentences resting on print
 * references alone; a `base`/`parallel` witness whose locus matches the form
 * directly (its role should be `attests`).
 */
import { Database } from 'bun:sqlite';
import { join, dirname, basename } from 'node:path';
import type { Sentence, Story, Witness } from '../src/lib/content/types';

const ROOT = dirname(import.meta.dir);
const LOCK_PATH = join(import.meta.dir, 'evidence-lock.json');
const DB_PATH =
	process.env.AINU_CORPUS_DB ??
	join(process.env.HOME ?? '', 'projects/Ainu/ainu-corpora-api/build/corpus.db');
const REFRESH = process.env.AINU_EVIDENCE_REFRESH === '1';
const NORMALIZER_VERSION = 2;
const LOCK_VERSION = 4;

const { bundle } = await import(join(ROOT, 'src/lib/content/index.ts'));
const sentences: Record<string, Sentence> = bundle.sentences;
const stories: Record<string, Story> = bundle.stories;

const POINTER_RE = /^[a-z0-9-]+\/[^\s()、;,]+#\d+$/;
// a slash-and-digit token that reads as a corpus reference (well-formed or
// not) — must not appear in `ref` prose, and a malformed `pointer` is an error
const POINTERISH_RE = /[a-z0-9-]+\/[^\s()、;,]*\d/;

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
	// a whole-word span of the locus attests the form at any length
	if (` ${norm(b)} `.includes(` ${norm(a)} `)) return 'excerpt';
	// folded containment needs length to mean anything
	if (seg(a).length >= 10 && seg(b).includes(seg(a))) return 'excerpt';
	if (seg(b).length >= 10 && seg(a).includes(seg(b))) return 'superset';
	return 'adapted';
}
const DIRECT = new Set(['exact', 'normalized', 'segmental', 'excerpt']);

/** stable hash of the evidence, independent of key order in the literals */
function evidenceHash(ws: Witness[]): string {
	return sha(
		JSON.stringify(
			ws.map((w) =>
				'pointer' in w ? ['p', w.pointer, w.role, w.note ?? ''] : ['r', w.ref, w.note ?? '']
			)
		)
	);
}
const pointerWitnesses = (ws: Witness[]) =>
	ws.filter((w): w is Extract<Witness, { pointer: string }> => 'pointer' in w);

interface Surface {
	id: string;
	kind: 'sentence' | 'story-line' | 'story-question';
	latin: string;
	evidence?: Witness[];
	options: string[];
	viaSentence?: string;
}

const surfaces: Surface[] = [];
for (const s of Object.values(sentences)) {
	surfaces.push({
		id: s.id,
		kind: 'sentence',
		latin: s.latin,
		evidence: s.evidence,
		options: [...(s.blank?.options ?? []), ...(s.convo?.options ?? [])]
	});
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
			options: [],
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
			options: [],
			viaSentence: reuse?.id
		});
	}
}

interface LockWitness {
	pointer: string;
	role: 'attests' | 'base' | 'parallel' | 'options';
	sourceSlug: string;
	quote: string;
	quoteHash: string;
	match: string;
	author?: string;
	dialect?: string;
	collection?: string;
}
interface LockEntry {
	latinHash: string;
	evidenceHash: string;
	viaSentence?: string;
	witnesses: LockWitness[];
}
interface Lock {
	lockVersion: number;
	normalizerVersion: number;
	corpus?: { file: string; size: number; mtimeMs: number };
	entries: Record<string, LockEntry>;
}

const errors: string[] = [];
const warnings: string[] = [];
const classCounts: Record<string, number> = {};

/** role rules shared by both modes; quote is the locus text, match its class */
function checkRoles(
	id: string,
	role: string,
	pointer: string,
	quote: string,
	match: string,
	options: string[]
): void {
	if (role === 'attests' && !DIRECT.has(match))
		errors.push(
			`${id}: witness ${pointer} claims 'attests' but the locus ("${quote}") does not contain the form (${match})`
		);
	if ((role === 'base' || role === 'parallel') && DIRECT.has(match))
		warnings.push(`${id}: witness ${pointer} matches directly (${match}) — role should be 'attests'`);
	if (role === 'options' && !options.some((o) => seg(quote).includes(seg(o)) || seg(o).includes(seg(quote))))
		errors.push(`${id}: 'options' witness ${pointer} ("${quote}") matches no exercise option`);
}

const dbFile = Bun.file(DB_PATH);
const online = await dbFile.exists();
const lockFile = Bun.file(LOCK_PATH);
const prior: Lock | undefined = (await lockFile.exists()) ? await lockFile.json() : undefined;

if (online) {
	const db = new Database(DB_PATH, { readonly: true });
	const byId = db.query('select text, source_slug, author, dialect, collection from sentences where id = ?');
	const next: Lock = {
		lockVersion: LOCK_VERSION,
		normalizerVersion: NORMALIZER_VERSION,
		corpus: { file: basename(DB_PATH), size: dbFile.size, mtimeMs: Math.round(dbFile.lastModified) },
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
		const priorByPointer = new Map(
			(prior?.entries[f.id]?.witnesses ?? []).map((w) => [w.pointer, w])
		);
		for (const w of f.evidence) {
			if (!('pointer' in w)) {
				if (POINTERISH_RE.test(w.ref))
					errors.push(`${f.id}: ref "${w.ref}" contains a corpus reference — cite it as a witness`);
				continue;
			}
			if (!POINTER_RE.test(w.pointer)) {
				errors.push(`${f.id}: malformed pointer "${w.pointer}" — needs collection/doc#index`);
				continue;
			}
			const row = byId.get(w.pointer) as {
				text: string;
				source_slug: string;
				author: string | null;
				dialect: string | null;
				collection: string | null;
			} | null;
			if (!row) {
				errors.push(`${f.id}: dangling pointer ${w.pointer}`);
				continue;
			}
			const match = matchClass(f.latin, row.text);
			checkRoles(f.id, w.role, w.pointer, row.text, match, f.options);
			const old = priorByPointer.get(w.pointer);
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
				match,
				...(row.author ? { author: row.author } : {}),
				...(row.dialect ? { dialect: row.dialect } : {}),
				...(row.collection ? { collection: row.collection } : {})
			});
			classCounts[match] = (classCounts[match] ?? 0) + 1;
		}
		if (f.kind === 'sentence' && entry.witnesses.length === 0)
			warnings.push(`${f.id}: print references only — no corpus witness`);
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
	if (prior.lockVersion !== LOCK_VERSION || prior.normalizerVersion !== NORMALIZER_VERSION)
		errors.push(
			`evidence lock is v${prior.lockVersion}/n${prior.normalizerVersion}, current is v${LOCK_VERSION}/n${NORMALIZER_VERSION} — revalidate with corpus.db`
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
		const pws = pointerWitnesses(f.evidence);
		const locked = entry.witnesses;
		if (
			pws.length !== locked.length ||
			pws.some((w, i) => locked[i].pointer !== w.pointer || locked[i].role !== w.role)
		) {
			errors.push(`${f.id}: lock witnesses do not match the evidence — revalidate with corpus.db`);
			continue;
		}
		for (const w of locked) {
			checkRoles(f.id, w.role, w.pointer, w.quote, w.match, f.options);
			classCounts[w.match] = (classCounts[w.match] ?? 0) + 1;
		}
		if (f.kind === 'sentence' && locked.length === 0)
			warnings.push(`${f.id}: print references only — no corpus witness`);
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
