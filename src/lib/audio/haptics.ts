import { browser } from '$app/environment';
import { settings } from '$lib/settings/settings.svelte';

/** Fire a vibration pattern (ms) where supported and enabled. No-op otherwise. */
export function haptic(pattern: number | number[]) {
	if (!browser || !settings.haptics) return;
	try {
		navigator.vibrate?.(pattern);
	} catch {
		/* unsupported — ignore */
	}
}
