<script lang="ts">
	import '$lib/design/tokens.css';
	import '$lib/design/base.css';
	import '$lib/design/fonts';
	import favicon from '$lib/assets/favicon.svg';
	import { settings } from '$lib/settings/settings.svelte';

	let { children } = $props();
	// Referencing the store guarantees its constructor (theme + lang application) runs.
	void settings;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
