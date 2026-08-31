/**
 * Evidence gate for course content.
 *
 * Enumerates every learner-visible Ainu form (sentences, story lines, story
 * questions) and validates its `source` citations. A citation is one or more
 * corpus pointers (`collection/document#index`), each optionally followed by
 * a parenthesized quote of the attested text; prose describing a construction
 * or a print-dictionary reference counts as a manual witness.
 *
 * Two modes:
 * - With the corpus database (default `~/projects/Ainu/ainu-corpora-api/build/
 *   corpus.db`, override via AINU_CORPUS_DB): resolves every pointer, compares
 *   the sentence text against the attested text, and rewrites
 *   `scripts/evidence-lock.json` with the resolved quote, source slug, and
 *   content hashes. Positional pointers shift between corpus builds; the lock's
 *   hashes are what survive.
 * - Without it (CI): verifies content hashes against the lock, so any change to
 *   a sentence's Ainu text or citations fails until revalidated locally.
 *
 * Errors: dangling pointer, attested text changed under a pointer, content
 * changed without lock refresh. Warnings: forms with no evidence (story
 * backlog), quotes that no longer match verbatim.
 */
import { Database } from 'bun:sqlite';
import { join, dirname } from 'node:path';

const ROOT = dirname(import.meta.dir);
const LOCK_PATH = join(import.meta.dir, 'evidence-lock.json');
const DB_PATH =
	process.env.AINU_CORPUS_DB ??
	join(process.env.HOME ?? '', 'projects/Ainu/ainu-corpora-api/build/corpus.db');

const { bundle } = await import(join(ROOT, 'src/lib/content/course.ts'));
const { generated } = await import(join(ROOT, 'src/lib/content/course-generated.ts'));

const sentences: Record<string, any> = { ...bundle.sentences, ...generated.sentences };
const stories: Record<string, any> = { ...(bundle.stories ?? {}), ...(generated.stories ?? {}) };

const POINTER_RE = /([a-z0-9-]+\/[^\s()、;,]+#\d+)/g;

function norm(s: string): string {
	return s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[.?!,"'“”‘’「」『』（）()]/g, ' ')
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
	if (seg(b).includes(seg(a))) return 'excerpt';
	if (seg(a).includes(seg(b))) return 'base';
	return 'adapted';
}

interface Surface {
	id: string;
	kind: 'sentence' | 'story-line' | 'story-question';
	latin: string;
	source?: string;
	viaSentence?: string;
}

const surfaces: Surface[] = [];
for (const s of Object.values(sentences) as any[]) {
	surfaces.push({ id: s.id, kind: 'sentence', latin: s.latin, source: s.source });
}
const byNorm = new Map<string, any>();
for (const s of Object.values(sentences) as any[]) byNorm.set(norm(s.latin), s);
for (const st of Object.values(stories) as any[]) {
	st.lines.forEach((line: any, i: number) => {
		const reuse = byNorm.get(norm(line.latin));
		surfaces.push({
			id: `${st.id}#${i}`,
			kind: 'story-line',
			latin: line.latin,
			source: reuse?.source,
			viaSentence: reuse?.id
		});
	});
	(st.questions ?? []).forEach((q: any, i: number) => {
		const reuse = byNorm.get(norm(q.answer));
		surfaces.push({
			id: `${st.id}?q${i}`,
			kind: 'story-question',
			latin: q.answer,
			source: reuse?.source,
			viaSentence: reuse?.id
		});
	});
}

interface LockEntry {
	latinHash: string;
	sourceHash: string;
	viaSentence?: string;
	witnesses: {
		pointer: string;
		sourceSlug: string;
		quote: string;
		quoteHash: string;
		match: string;
	}[];
}
type Lock = { entries: Record<string, LockEntry> };

const errors: string[] = [];
const warnings: string[] = [];

const dbFile = Bun.file(DB_PATH);
const online = await dbFile.exists();

if (online) {
	const db = new Database(DB_PATH, { readonly: true });
	const byId = db.query('select text, source_slug from sentences where id = ?');
	const lock: Lock = { entries: {} };
	for (const f of surfaces) {
		if (!f.source) {
			if (f.kind === 'sentence') errors.push(`${f.id}: no source`);
			else warnings.push(`${f.id}: no evidence (story backlog): ${f.latin}`);
			continue;
		}
		const pointers = [...f.source.matchAll(POINTER_RE)].map((m) => m[1]);
		const entry: LockEntry = {
			latinHash: sha(f.latin),
			sourceHash: sha(f.source),
			...(f.viaSentence ? { viaSentence: f.viaSentence } : {}),
			witnesses: []
		};
		for (const p of pointers) {
			const row = byId.get(p) as any;
			if (!row) {
				errors.push(`${f.id}: dangling pointer ${p}`);
				continue;
			}
			// a quote in the source string must still match the corpus text
			const quoted = f.source.match(
				new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\(([^)]+)\\)')
			);
			if (quoted && !seg(row.text).includes(seg(quoted[1].replace(/[…,、]\s*[^,]*$/, '')))) {
				warnings.push(`${f.id}: quote for ${p} differs from corpus text: ${row.text}`);
			}
			entry.witnesses.push({
				pointer: p,
				sourceSlug: row.source_slug,
				quote: row.text,
				quoteHash: sha(row.text),
				match: matchClass(f.latin, row.text)
			});
		}
		if (f.kind === 'sentence' && pointers.length === 0) {
			// prose-only manual witness (print dictionary / construction note)
			if (!/[A-Za-z]/.test(f.source)) errors.push(`${f.id}: source is neither pointer nor prose`);
		}
		lock.entries[f.id] = entry;
	}
	await Bun.write(LOCK_PATH, JSON.stringify(lock, null, 1) + '\n');
} else {
	const lockFile = Bun.file(LOCK_PATH);
	if (!(await lockFile.exists())) {
		console.error('✗ corpus.db unavailable and no evidence-lock.json — cannot verify evidence');
		process.exit(1);
	}
	const lock: Lock = await lockFile.json();
	for (const f of surfaces) {
		const entry = lock.entries[f.id];
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
	}
}

const nSent = surfaces.filter((f) => f.kind === 'sentence').length;
const covered = surfaces.filter((f) => f.source).length;
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
console.log(
	`${errors.length ? 'FAIL' : 'OK'} — ${errors.length} error(s), ${warnings.length} warning(s); ` +
		`${covered}/${surfaces.length} surfaces evidenced (${nSent} sentences), ` +
		(online ? 'validated against corpus.db (lock refreshed)' : 'verified against evidence lock')
);
if (errors.length) process.exit(1);
