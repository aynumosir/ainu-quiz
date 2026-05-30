# tu itak re itak — learn Ainu, the Duolingo way

**tu itak re itak** (アイヌ語 _"two words, three words" — the "tu… re…" doubling that
idiomatically means "many languages"_) is a gamified Ainu-language
quiz app. It reproduces Duolingo's _mechanics, timing and feel_ — the serpentine
path, the bouncing START bubble, the tactile CHECK button, hearts, streaks,
crowns, combos, the slide-up result banner — wearing a distinctly **Ainu** visual
identity instead of a cartoon one. Ainu is always the target language; the
learner's UI is **Japanese or English**, and Ainu text renders in **Latin,
Katakana, or both at once**.

> Built on the wider Ainu toolchain in this monorepo — see `../` for `ainconv`
> (script conversion), `ainu-mcp` (corpus/dictionary/glossary), `ainu-tts`
> (speech), and `ainu-corpora`.

## Run

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # static SPA → build/
bun run check        # svelte-check
```

No backend: progress lives in `localStorage`, content is bundled, and it ships as
a static SPA (`@sveltejs/adapter-static`).

## What's inside

- **Stack** — SvelteKit (Svelte 5 runes) + Vite + TypeScript + Bun.
- **Script modes** — `ainconv` converts canonical **Latin** romanization →
  Katakana on demand (never the reverse — Kana→Latin is lossy). Toggle in the top
  bar or Settings. See `src/lib/script/`.
- **i18n** — tiny typed catalogue (`src/lib/i18n/`), JP/EN, zh-ready.
- **Design system** — `src/lib/design/` (tokens grounded in Ainu materials:
  indigo / attus-ecru / wood / appliqué-red; light + dark) and
  `src/lib/components/motif/` (abstracted モレウ/シㇰ patterns). See
  **[docs/DESIGN.md](docs/DESIGN.md)**.
- **Content** — `src/lib/content/course.ts`: an A1 course (3 units, ~37 vocab, 22
  sentences, 2 stories) whose Ainu is verified against the `ainu` MCP dictionaries
  and Hokkaido-dialect corpus (dialect/source cited per item).
- **Engine** — `src/lib/lesson/` generates exercises (tile-build, multiple
  choice, fill-blank, pair-match, conversation); `src/lib/state/progress.svelte.ts`
  is the XP / hearts / streak / crowns / spaced-repetition / mistakes store.

## Fonts — the ㇷ゚ problem (important)

Ainu Katakana needs small kana (U+31F0–31FF) **and** the combining handakuten
(U+309A) composed via the font's `ccmp` lookup to render `ㇷ゚` / `セㇷ゚`. Google
Fonts / Fontsource split those codepoints into separate files, which **breaks**
the composition. We therefore self-host a single-file subset of **BIZ UDPGothic**
built by `scripts/prep-fonts.sh` (→ `static/fonts/biz-udpgothic-ainu-*.woff2`,
~88 K). Inter (Latin) and Shippori Mincho B1 (carved display) come from Fontsource.

```bash
bash scripts/prep-fonts.sh   # rebuild the Ainu-kana subset (needs uv + curl)
```

## Audio — precompiled, and ethically gated

Audio is **precompiled**, not synthesized at runtime. With the local `ainu-tts`
Piper server running, `scripts/build-audio.ts` renders one clip per Ainu string
into `static/audio/` + a manifest; the app then shows auto-playing speaker
buttons. Without it, the app simply runs audio-free.

```bash
# in ../ainu-tts:  uv run python scripts/tts_server.py   (serves :8765)
bun scripts/build-audio.ts
```

> **Do not ship `static/audio/` in a public build.** The TTS voices derive from
> native-speaker recordings and are not cleared for public release — see
> `../ainu-tts/docs/ETHICS.md`. Community review gates any public audio.

## Cultural note

The visual language is a respectful **homage** to アイヌ文様 (Ainu patterns),
abstracted — not a reproduction. Pattern meanings vary by region, so the app
avoids asserting fixed interpretations. References: Foundation for Ainu Culture
(ff-ainu.or.jp) and the National Ainu Museum / Upopoy (nam.go.jp). An "About the
design" note credits these in-app.

## Status

Done: path, full lesson loop + all exercise types, gamification, script modes,
i18n, themes, profile/settings, practice hub, audio pipeline, design system.
Stubbed for later: Leagues leaderboard, a dedicated Stories player (data exists),
and generating the rest of the course from the glossary via the same pipeline.
