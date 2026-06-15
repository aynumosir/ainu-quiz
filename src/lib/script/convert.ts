import { convert, separate } from 'ainconv';
import type { ScriptMode } from '$lib/settings/settings.svelte';

/**
 * Script conversion for Ainu text.
 *
 * Canonical storage is ALWAYS Latin romanization. ainconv's Latin→Kana is
 * deterministic and clean, but Kana→Latin is intrinsically lossy (the broadly
 * used Ainu katakana cannot distinguish e.g. `tu`/`tow`, `ay`/`a.i`), so we
 * never store or round-trip through kana — we derive it on demand and cache.
 */

const kanaCache = new Map<string, string>();
const syllableCache = new Map<string, string[]>();

/** Render canonical Latin Ainu as Katakana. Whitespace and punctuation pass through. */
export function toKana(latin: string): string {
	const hit = kanaCache.get(latin);
	if (hit !== undefined) return hit;
	let out: string;
	try {
		// Derive a phonetic spelling for the kana only; the canonical Latin is left
		// untouched. Two conventional folds:
		//
		// 1. Glide after u (Nakagawa style). The canonical Latin is morphophonemic at
		//    a vowel boundary — uerankarap, uekarpa, kuari (no written glide) — but the
		//    kana reflects pronunciation, where an epenthetic [w] surfaces after u
		//    before a vowel: uerankarap → ウウェランカラㇷ゚, kuari → クワリ. The lookahead
		//    needs a vowel *immediately* after u, so clitic/word boundaries (ku=an →
		//    クアン) and existing w (ruwe, suwop) are untouched. Dictionaries write no
		//    glide after o/e/i (toan → トアン, easkay → エアㇱカイ), so this is u-only.
		// 2. A nasal before a bilabial (p/b) is the moraic nasal; conventional Ainu
		//    katakana writes ン there, never ㇺ. We allow surface-m spelling in the
		//    canonical Latin (e.g. kampi, kampisos), so fold m→n before p/b — yields
		//    カンピ, not カㇺピ (tanpe → タンペ unchanged, word-final kam → カㇺ unaffected).
		const phonetic = latin
			.replace(/([uúUÚ])(?=[aeiouáéíóúAEIOUÁÉÍÓÚ])/g, '$1w')
			.replace(/m(?=[pb])/gi, 'n');
		out = convert(phonetic, 'Latn', 'Kana');
	} catch {
		out = latin;
	}
	kanaCache.set(latin, out);
	return out;
}

/** Split a single Latin word into Ainu syllables (for tiles / pronunciation hints). */
export function syllables(latinWord: string): string[] {
	const clean = latinWord.replace(/[=.,!?]/g, '');
	const hit = syllableCache.get(clean);
	if (hit !== undefined) return hit;
	let out: string[];
	try {
		out = separate(clean);
	} catch {
		out = [clean];
	}
	syllableCache.set(clean, out);
	return out;
}

export interface ScriptForms {
	latin: string;
	kana: string;
}

export function forms(latin: string): ScriptForms {
	return { latin, kana: toKana(latin) };
}

/**
 * Primary line for a given script mode. In `both` mode Latin is primary
 * (it is the orthographic standard and the basis for answer-checking); kana
 * rides along as a secondary reading aid.
 */
export function primaryText(latin: string, mode: ScriptMode): string {
	return mode === 'kana' ? toKana(latin) : latin;
}

/** Secondary line, shown only in `both` mode (the kana reading); otherwise null. */
export function secondaryText(latin: string, mode: ScriptMode): string | null {
	return mode === 'both' ? toKana(latin) : null;
}
