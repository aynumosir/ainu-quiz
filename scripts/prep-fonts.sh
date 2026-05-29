#!/usr/bin/env bash
# =====================================================================
# prep-fonts.sh — build the self-hosted Ainu-kana web font.
#
# WHY: Ainu katakana needs small kana (U+31F0–31FF) AND the combining
# handakuten (U+309A) to live in ONE physical font file so the ccmp lookup
# can compose ㇷ゚ / セㇷ゚. Google Fonts / Fontsource split those codepoints
# into separate unicode-range subset files, which BREAKS the composition.
# So we download the full upstream BIZ UDPGothic (Morisawa UD — excellent
# legibility, ccmp-only) and subset it ourselves into a single woff2 that
# covers all kana + the Ainu block, keeping every layout feature.
#
# Requires: uv (for uvx → fonttools[woff]), curl.
# Output:  static/fonts/biz-udpgothic-ainu-{400,700}.woff2
# =====================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/static/fonts"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

BASE="https://github.com/googlefonts/morisawa-biz-ud-gothic/raw/main/fonts/ttf"

# Everything the three script modes can emit, all in one file:
#  - Basic Latin incl. '=' (Ainu affix marker) and apostrophes
#  - CJK punctuation, hiragana (for combining marks U+3099/309A), full katakana
#  - U+31F0–31FF Ainu small kana  +  halfwidth kana
UNICODES="U+0020-007E,U+00A0,U+02BC,U+2018-2019,U+3000-303F,U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"

subset() {
	local weight="$1" file="$2"
	echo "↓ downloading $file …"
	curl -fsSL -o "$TMP/$file" "$BASE/$file"
	echo "✂  subsetting $file (weight $weight) …"
	uvx --from "fonttools[woff]" pyftsubset "$TMP/$file" \
		--output-file="$OUT/biz-udpgothic-ainu-$weight.woff2" \
		--flavor=woff2 \
		--layout-features='*' \
		--unicodes="$UNICODES" \
		--name-IDs='' --notdef-outline
	echo "✓  $(du -h "$OUT/biz-udpgothic-ainu-$weight.woff2" | cut -f1)  →  biz-udpgothic-ainu-$weight.woff2"
}

subset 400 BIZUDPGothic-Regular.ttf
subset 700 BIZUDPGothic-Bold.ttf

rm -rf "$TMP"
echo "done. verify ㇷ゚ composition in-browser (イランカラㇷ゚テ, セㇷ゚, トゥ)."
