/**
 * Unit accent colors — the saturated band color each path unit adopts (à la
 * Duolingo's per-unit color), drawn from the Ainu palette. Components derive
 * the darker "edge" (3D lip) and a theme-aware "soft" tint via CSS color-mix,
 * so only the base + ink need defining here.
 */
export type AccentName = 'indigo' | 'green' | 'red' | 'wood';

interface Accent {
	base: string;
	ink: string;
}

export const ACCENTS: Record<AccentName, Accent> = {
	indigo: { base: '#2d4373', ink: '#fbf6ee' },
	green: { base: '#2e7d52', ink: '#ffffff' },
	red: { base: '#a8392b', ink: '#fbf6ee' },
	wood: { base: '#8a6d4f', ink: '#fbf6ee' }
};

/** Inline style string exposing `--accent` and `--accent-ink` for a unit subtree. */
export function accentStyle(name: string): string {
	const a = ACCENTS[name as AccentName] ?? ACCENTS.indigo;
	return `--accent:${a.base};--accent-ink:${a.ink};`;
}
