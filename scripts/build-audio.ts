/**
 * Precompile Ainu audio clips for the course (no realtime synthesis).
 *
 * Walks every Ainu string in the content bundle and renders one wav per unique
 * string via the LOCAL ainu-tts Piper server (POST /api/tts {label,speaker,text}
 * → audio/wav). Writes clips to static/audio/ + a manifest keyed by the Latin
 * string. Run with the TTS server up:
 *     uv run python scripts/tts_server.py        # in ../ainu-tts, serves :8765
 *     bun scripts/build-audio.ts
 *
 * Override via env: TTS_URL, TTS_LABEL, TTS_SPEAKER, AUDIO_LIMIT.
 *
 * ETHICS: the resulting clips are derived from native-speaker recordings and
 * are NOT cleared for public release. Keep static/audio/ out of public builds
 * until community review approves a model (see ../ainu-tts/docs/ETHICS.md).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { bundle } from '../src/lib/content/course';

const TTS_URL = process.env.TTS_URL ?? 'http://127.0.0.1:8765/api/tts';
const LABEL = process.env.TTS_LABEL ?? 'ainu_saru_multispk_dfn_lufs';
const SPEAKER = Number(process.env.TTS_SPEAKER ?? 0);
const LIMIT = process.env.AUDIO_LIMIT ? Number(process.env.AUDIO_LIMIT) : Infinity;
const OUT = new URL('../static/audio/', import.meta.url);

const strings = new Set<string>();
for (const v of Object.values(bundle.vocab)) if (v.pos !== 'pers') strings.add(v.latin.trim());
for (const s of Object.values(bundle.sentences)) strings.add(s.latin.trim());
for (const st of Object.values(bundle.stories)) for (const l of st.lines) strings.add(l.latin.trim());

const list = [...strings].filter(Boolean).slice(0, LIMIT);
await mkdir(OUT, { recursive: true });

const manifest: Record<string, string> = {};
let ok = 0;
let fail = 0;
for (const text of list) {
	const file = createHash('sha1').update(`${LABEL}|${text}`).digest('hex').slice(0, 16) + '.wav';
	try {
		const r = await fetch(TTS_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label: LABEL, speaker: SPEAKER, text })
		});
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		await writeFile(new URL(file, OUT), Buffer.from(await r.arrayBuffer()));
		manifest[text] = file;
		ok++;
		console.log('✓', text);
	} catch (e) {
		fail++;
		console.warn('✗', text, '—', e instanceof Error ? e.message : e);
	}
}

await writeFile(new URL('manifest.json', OUT), JSON.stringify(manifest));
console.log(`\ndone: ${ok} ok, ${fail} failed → static/audio/manifest.json (${list.length} strings)`);
if (fail && !ok) {
	console.log('Is the TTS server running? cd ../ainu-tts && uv run python scripts/tts_server.py');
}
