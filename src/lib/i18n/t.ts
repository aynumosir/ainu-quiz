import { settings } from '$lib/settings/settings.svelte';
import { messages, type MessageKey } from './messages';

/**
 * Translate a UI message key into the active locale.
 *
 * Reading `settings.locale` ($state) inside this function makes any component
 * template or $derived that calls `t()` re-run when the locale changes — no
 * extra wiring needed. Falls back to English, then to the raw key.
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
	const dict = messages[settings.locale] ?? messages.en;
	let out: string =
		(dict as Record<string, string>)[key] ??
		(messages.en as Record<string, string>)[key] ??
		key;
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			out = out.replaceAll(`{${k}}`, String(v));
		}
	}
	return out;
}
