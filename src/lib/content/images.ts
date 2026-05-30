/**
 * Picture support for vocab. We hand-draw cute flat SVGs (static/img/vocab/<latin>.svg)
 * for concrete, natural nouns. A word "has an image" iff its canonical Latin is
 * in IMAGED. Used by the picture exercises (tap-the-image / what-is-this) and as
 * card enrichment.
 */
export const IMAGED = new Set([
	'cep', // fish
	'cup', // sun
	'nonno', // flower
	'seta', // dog
	'wakka', // water
	'nupuri', // mountain
	'cape', // cat
	'cikap', // bird
	'yuk', // deer
	'tope', // milk
	'usey', // tea / hot water
	'sito', // dumpling
	'amam', // rice / grain
	'kam', // meat
	'to', // lake / pond
	'apto', // rain
	'upas' // snow
]);

/** Public URL of a vocab word's illustration, or null if none. */
export function vocabImage(latin: string): string | null {
	return IMAGED.has(latin) ? `/img/vocab/${latin}.svg` : null;
}
