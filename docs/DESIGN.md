# tu itak — design system

**tu itak** ("two words/languages" in Ainu) is a Duolingo-style quiz for learning
Ainu. It replicates Duolingo's *mechanics, timing and feel* while wearing a
distinctly Ainu visual identity — never Duolingo's cartoon style.

Target language is always **Ainu**; the learner's UI language is switchable
(ja/en, zh later). Ainu renders in **Latin**, **Katakana**, or **both** at once.

## Palette — grounded in Ainu material culture

Every base color traces to a documented Ainu textile/material (not a generic
"ethnic" palette), WCAG-AA verified. Tokens live in `src/lib/design/tokens.css`.

| Role | Light | Material origin |
|---|---|---|
| primary | `#1d3461` | 藍染 ai-zome indigo cotton (ruunpe/chikarkarpe ground) |
| accent | `#9c2a2a` | appliqué red — **cultural highlight only, NOT errors** |
| success | `#1b6b42` | kina woven-grass green (functional, hue-distinct from primary) |
| danger | `#a01f18` | a hotter red than the accent, so errors never read as decoration |
| bg | `#f4ece0` | アットゥㇱ attus undyed elm-bark cloth |
| surface | `#fbf6ee` | off-white kaparamip cotton appliqué |
| ink | `#1f2430` | — |

Dark theme uses cool navy-charcoals with an indigo cast (primary inverts to the
sky-indigo `#7da7d9` for AA on dark). Accent red is reserved for emphasis/streaks
and is kept separate from the error red. Pair every quiz state with an icon +
label so feedback is never color-only.

## Typography — the ㇷ゚ trap (READ THIS)

Ainu katakana needs small kana (U+31F0–31FF) **and** the combining handakuten
(U+309A) to compose `ㇷ゚` / `セㇷ゚` via the font's `ccmp` lookup. Two hazards,
both verified by inspecting font binaries with fonttools:

1. **Most fonts can't render it at all.** Verified FAIL (0/16 small kana):
   Zen Maru/Kaku/Old, M PLUS 1/2, IBM Plex Sans JP, Klee, Kaisei, Reggae One,
   Rampart One, Yuji Syuku, DotGothic16. Verified PASS: **Noto Sans/Serif JP,
   Source Han, BIZ UDGothic/UDPGothic, Shippori Mincho/B1**.
2. **unicode-range splitting breaks `ccmp`.** Google Fonts / Fontsource split
   U+31F7 (small-fu) and U+309A into *different* woff2 files → the browser can't
   compose them. So we **self-host a single-file subset** of BIZ UDPGothic that
   keeps both + the `ccmp` lookup in one woff2 (`scripts/prep-fonts.sh` →
   `static/fonts/biz-udpgothic-ainu-*.woff2`, 88 K). Verified with HarfBuzz:
   `セㇷ゚` 3 codepoints → 2 glyphs, `ㇷ゚` 2 → 1, notdef=0.

Stacks (`tokens.css`): display = Shippori Mincho B1 (carved/woodcut feel, kana-
capable); UI = Inter → BIZ UDPGothic; Ainu Latin = Inter; **Ainu kana =
'BIZ UDPGothic Ainu' (our subset) first**. Never put a kana-incapable font where
Ainu kana renders.

## アイヌ文様 — motifs, used with restraint

A vocabulary of line/curve/rhythm, **abstracted, never replicated**:

- **moreu** モレウ — a calm swelling spiral (mo "calm" + rew "bend"); a single
  continuous open stroke, thin→full→fine, mirrored in CW/CCW pairs. Use as a
  one-stroke flourish/loader; lots of whitespace.
- **ayus / kirau** アイウㇱ/キラウ — thorn/horn spikes at the tips of moreu; a
  sharp counter-rhythm. Use as tiny rhythm ticks/edge detail, sparingly.
- **sik** シㇰ — the "eye" lozenge that emerges in the negative space where two
  moreu cross (**utasa**). Use as a focal/selected marker, the app-icon core.

Composition rules: **one continuous flowing line**, **bilateral symmetry**,
**ornament frames edges/thresholds/focal points** (headers, card borders, the
active node) — not wallpaper — and **high whitespace** (the tradition itself says
"don't over-fill"). Curve (moreu) vs. spike (kirau) is the core tension.

### Ethics / credits (non-negotiable)
- Do **not** assert fixed sacred / "ward-off-evil" meanings as fact — scholarship
  (National Ainu Museum/Upopoy; Hokkaido Museum) flags the systematic 魔除け
  reading as a post-1970 popularization. If meaning is referenced, hedge + cite.
- Treat motifs as living Indigenous cultural property. Abstract, credit sources
  (ff-ainu.or.jp, nam.go.jp), frame as "inspired by / homage", and include an
  in-app "About the design" note. Golden Kamuy's model — consult + credit Ainu
  makers — is the bar.

## Duolingo feel — fidelity checklist (condensed)

- **Path**: serpentine column; exactly one **active node** with a calm bouncing
  START bubble (sine, ~1.4 s, 6–10 px — never a fast jitter); locked nodes are
  flat + ~60% opacity; auto-scroll to the active node on load. One node = one
  step (no 5-crown stacking); legendary is rare/gold.
- **Tactile 3D button**: face + ~4 px darker bottom lip; on press the face drops
  4 px and the lip collapses ("clunk"). **Disabled = flat + gray (no lip).**
- **Lesson loop**: top bar (X + progress + hearts) → instruction + auto-played
  audio → answer area → bottom CHECK (gray-flat-disabled → green-raised-enabled)
  → result banner slides up (green/red, ~250 ms with slight overshoot, icon +
  copy + CONTINUE; Enter advances). Wrong = lose a heart, momentum preserved
  (progress doesn't retreat punitively); never harsh/alarmist.
- **Word tiles**: tap flies tile to the answer line leaving a **ghost slot** (no
  reflow); tap again returns it; ~150–200 ms arc + landing bounce + soft click.
- **Reward easing (reuse ONE curve)**: XP/gems/goal-ring count-up = ease-out,
  fast→settle, ending on a ding; combo pop with **rising pitch**; summary stat
  cards reveal staggered ~150–250 ms.
- **A11y**: keys 1–9 pick options/tiles, Enter = Check then Continue, Esc = quit-
  confirm; aria-live result; color-independent (icon+text); `prefers-reduced-
  motion` drops bounce/confetti/count-up; ≥44 px targets; persistent mute +
  per-item "Can't listen now".
- **Pitfalls**: linear easing, multi/too-fast START bubbles, a 3D lip on disabled
  buttons, reflowing tile bank, instant quit with no confirm, dumping summary
  stats at once, paywall-only out-of-hearts (always offer "practice to refill"),
  over-gilding the path.

Full research (sources, hexes, font-table evidence, all UX states) was generated
into the design-research workflow output; key decisions are distilled here.
