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

/** Public URL of a vocab word's illustration, or null if none.
 *  Folds accent marks (úsey → usey) so the IMAGED set + filenames stay ASCII. */
export function vocabImage(latin: string): string | null {
	const key = latin.normalize('NFD').replace(/[̀-ͯ]/g, '');
	return IMAGED.has(key) ? `/img/vocab/${key}.svg` : null;
}
