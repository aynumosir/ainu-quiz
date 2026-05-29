import { browser } from '$app/environment';

/**
 * Audio layer. Clips are PRECOMPILED by scripts/build-audio.ts (no realtime
 * synthesis) and served from /audio/<file>.wav with a manifest keyed by the
 * canonical Latin string. If no manifest exists (e.g. before the pipeline has
 * run, or a public build that ships without synthetic audio per the ETHICS
 * gate), `has()` is always false and the UI simply hides speaker buttons.
 */
class AudioLayer {
	#manifest = $state<Record<string, string> | null>(null);
	#current: HTMLAudioElement | null = null;

	constructor() {
		if (browser) this.#load();
	}

	async #load() {
		try {
			const r = await fetch('/audio/manifest.json');
			if (r.ok) this.#manifest = await r.json();
		} catch {
			/* no audio available — fine */
		}
	}

	has(latin: string): boolean {
		return !!this.#manifest?.[latin.trim()];
	}

	url(latin: string): string | null {
		const f = this.#manifest?.[latin.trim()];
		return f ? `/audio/${f}` : null;
	}

	play(latin: string) {
		if (!browser) return;
		const u = this.url(latin);
		if (!u) return;
		this.#current?.pause();
		this.#current = new Audio(u);
		this.#current.play().catch(() => {});
	}
}

export const audio = new AudioLayer();
