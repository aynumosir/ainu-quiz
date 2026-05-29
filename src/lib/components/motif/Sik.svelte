<script lang="ts">
	// sik シㇰ — the "eye": a symmetric pointed-oval (vesica) with a pupil.
	// Used as a focal/selected marker and the core of the app mark. Abstracted.
	interface Props {
		size?: number;
		filled?: boolean;
		class?: string;
	}
	let { size = 24, filled = false, class: klass = '' }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	class={klass}
	aria-hidden="true"
	role="presentation"
>
	<path
		d="M12 1.6C16.2 6.4 16.2 17.6 12 22.4C7.8 17.6 7.8 6.4 12 1.6Z"
		fill={filled ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<circle cx="12" cy="12" r="1.8" fill="currentColor" opacity={filled ? 0.85 : 1} />
</svg>
