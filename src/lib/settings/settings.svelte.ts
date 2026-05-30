import { browser } from '$app/environment';

export type Locale = 'ja' | 'en';
export type ScriptMode = 'latin' | 'kana' | 'both';
export type ThemePref = 'light' | 'dark' | 'system';
/** Ainu dialect for rendering. 'saru' is canonical (content is stored in Saru). */
export type Dialect = 'saru' | 'ishikari' | 'shizunai' | 'tokachi';
const DIALECTS: Dialect[] = ['saru', 'ishikari', 'shizunai', 'tokachi'];

const STORAGE_KEY = 'tu-itak:settings:v1';

interface Persisted {
	locale: Locale;
	scriptMode: ScriptMode;
	dialect: Dialect;
	theme: ThemePref;
	sound: boolean;
	haptics: boolean;
	reduceMotion: boolean;
}

const DEFAULTS: Persisted = {
	locale: 'ja',
	scriptMode: 'both',
	dialect: 'saru',
	theme: 'system',
	sound: true,
	haptics: true,
	reduceMotion: false
};

/**
 * Global, persisted user preferences:
 *  - locale:       learner's UI language (ja/en). Ainu is always the target.
 *  - scriptMode:   how Ainu renders (Latin / Katakana / both).
 *  - theme:        light / dark / follow-system.
 *  - sound:        UI sound effects (Web Audio synthesis).
 *  - haptics:      vibration feedback (where supported).
 *  - reduceMotion: damps animations (also respects the OS media query).
 */
class Settings {
	locale = $state<Locale>(DEFAULTS.locale);
	scriptMode = $state<ScriptMode>(DEFAULTS.scriptMode);
	dialect = $state<Dialect>(DEFAULTS.dialect);
	theme = $state<ThemePref>(DEFAULTS.theme);
	sound = $state<boolean>(DEFAULTS.sound);
	haptics = $state<boolean>(DEFAULTS.haptics);
	reduceMotion = $state<boolean>(DEFAULTS.reduceMotion);

	constructor() {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const p = JSON.parse(raw) as Partial<Persisted>;
				if (p.locale === 'ja' || p.locale === 'en') this.locale = p.locale;
				if (p.scriptMode === 'latin' || p.scriptMode === 'kana' || p.scriptMode === 'both')
					this.scriptMode = p.scriptMode;
				if (p.dialect && DIALECTS.includes(p.dialect)) this.dialect = p.dialect;
				if (p.theme === 'light' || p.theme === 'dark' || p.theme === 'system') this.theme = p.theme;
				if (typeof p.sound === 'boolean') this.sound = p.sound;
				if (typeof p.haptics === 'boolean') this.haptics = p.haptics;
				if (typeof p.reduceMotion === 'boolean') this.reduceMotion = p.reduceMotion;
			}
		} catch {
			/* ignore corrupt state */
		}
		this.#applyTheme();
		this.#applyLang();
		this.#applyReduceMotion();
		window
			.matchMedia?.('(prefers-color-scheme: dark)')
			.addEventListener('change', () => this.theme === 'system' && this.#applyTheme());
	}

	#persist() {
		if (!browser) return;
		const data: Persisted = {
			locale: this.locale,
			scriptMode: this.scriptMode,
			dialect: this.dialect,
			theme: this.theme,
			sound: this.sound,
			haptics: this.haptics,
			reduceMotion: this.reduceMotion
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
			(this.theme === 'system' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches);
		document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
	}

	#applyLang() {
		if (!browser) return;
		document.documentElement.setAttribute('lang', this.locale);
	}

	#applyReduceMotion() {
		if (!browser) return;
		document.documentElement.setAttribute('data-reduce-motion', String(this.reduceMotion));
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

	setDialect(d: Dialect) {
		this.dialect = d;
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

	setSound(on: boolean) {
		this.sound = on;
		this.#persist();
	}

	setHaptics(on: boolean) {
		this.haptics = on;
		this.#persist();
	}

	setReduceMotion(on: boolean) {
		this.reduceMotion = on;
		this.#applyReduceMotion();
		this.#persist();
	}
}

export const settings = new Settings();
