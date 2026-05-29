<script lang="ts">
	// The tu itak app mark: a bilaterally-mirrored pair of moreu (モレウ) swelling
	// curves whose inner tails approach to leave a sik (eye) lozenge in the
	// negative space at the centre. One continuous-feeling stroke, lots of air —
	// an abstraction/homage, not a reproduction of any garment pattern.
	interface Props {
		size?: number;
		class?: string;
	}
	let { size = 48, class: klass = '' }: Props = $props();

	// one moreu curl, entering at bottom, swelling, curling inward toward centre
	const moreu = 'M9 43 C 9 24 17 15 25 17.5 C 31 19.4 31 26.5 25.5 28 C 21.6 29 18.8 26.2 20 22.6';
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 48 48"
	fill="none"
	class={klass}
	aria-hidden="true"
	role="presentation"
>
	<path
		d={moreu}
		stroke="currentColor"
		stroke-width="2.4"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d={moreu}
		transform="matrix(-1 0 0 1 48 0)"
		stroke="currentColor"
		stroke-width="2.4"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<!-- the sik eye that blooms where the two curves face each other -->
	<path
		d="M24 6.5C26.4 9.2 26.4 13.8 24 16.5C21.6 13.8 21.6 9.2 24 6.5Z"
		fill="currentColor"
	/>
</svg>
