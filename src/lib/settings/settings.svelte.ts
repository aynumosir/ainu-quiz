import { browser } from '$app/environment';

export type Locale = 'ja' | 'en';
export type ScriptMode = 'latin' | 'kana' | 'both';
export type ThemePref = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'tu-itak:settings:v1';

interface Persisted {
	locale: Locale;
	scriptMode: ScriptMode;
	theme: ThemePref;
}

const DEFAULTS: Persisted = { locale: 'ja', scriptMode: 'both', theme: 'system' };

/**
 * Global, persisted user preferences. Three independent axes:
 *  - locale:     the learner's UI language (ja/en). Ainu is always the target.
 *  - scriptMode: how Ainu text is rendered (Latin / Katakana / both).
 *  - theme:      light / dark / follow-system.
 *
 * The no-flash <script> in app.html applies theme + lang before paint; this
 * store keeps them in sync afterwards and is the single source of truth.
 */
class Settings {
	locale = $state<Locale>(DEFAULTS.locale);
	scriptMode = $state<ScriptMode>(DEFAULTS.scriptMode);
	theme = $state<ThemePref>(DEFAULTS.theme);

	constructor() {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const p = JSON.parse(raw) as Partial<Persisted>;
				if (p.locale === 'ja' || p.locale === 'en') this.locale = p.locale;
				if (p.scriptMode === 'latin' || p.scriptMode === 'kana' || p.scriptMode === 'both')
					this.scriptMode = p.scriptMode;
				if (p.theme === 'light' || p.theme === 'dark' || p.theme === 'system') this.theme = p.theme;
			}
		} catch {
			/* ignore corrupt state */
		}
		this.#applyTheme();
		this.#applyLang();
		window
			.matchMedia?.('(prefers-color-scheme: dark)')
			.addEventListener('change', () => this.theme === 'system' && this.#applyTheme());
	}

	#persist() {
		if (!browser) return;
		const data: Persisted = {
			locale: this.locale,
			scriptMode: this.scriptMode,
			theme: this.theme
		};
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* quota / private mode — non-fatal */
		}
	}

	#applyTheme() {
		if (!browser) return;
		const dark =
			this.theme === 'dark' ||
			(this.theme === 'system' &&
				!!window.matchMedia?.('(prefers-color-scheme: dark)').matches);
		document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
	}

	#applyLang() {
		if (!browser) return;
		document.documentElement.setAttribute('lang', this.locale);
	}

	setLocale(l: Locale) {
		this.locale = l;
		this.#applyLang();
		this.#persist();
	}

	setScriptMode(m: ScriptMode) {
		this.scriptMode = m;
		this.#persist();
	}

	cycleScriptMode() {
		const order: ScriptMode[] = ['latin', 'kana', 'both'];
		this.setScriptMode(order[(order.indexOf(this.scriptMode) + 1) % order.length]);
	}

	setTheme(t: ThemePref) {
		this.theme = t;
		this.#applyTheme();
		this.#persist();
	}
}

export const settings = new Settings();
