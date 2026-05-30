<script lang="ts">
	import { settings, type ScriptMode } from '$lib/settings/settings.svelte';
	import { toKana } from '$lib/script/convert';
	import { toDialect } from '$lib/script/dialect';

	interface Props {
		/** Canonical Latin Ainu (source of truth). */
		latin: string;
		/** Override the global script mode for this instance. */
		mode?: ScriptMode;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let { latin, mode, class: klass = '' }: Props = $props();

	const m = $derived(mode ?? settings.scriptMode);
	// Canonical (Saru) Latin → the active dialect's surface form, then to kana.
	const lat = $derived(toDialect(latin, settings.dialect));
	const kana = $derived(toKana(lat));
</script>

{#if m === 'latin'}
	<span class="ainu-latin {klass}">{lat}</span>
{:else if m === 'kana'}
	<span class="ainu-kana {klass}">{kana}</span>
{:else}
	<span class="both {klass}">
		<span class="ainu-latin lead">{lat}</span>
		<span class="ainu-kana sub">{kana}</span>
	</span>
{/if}

<style>
	.both {
		display: inline-flex;
		flex-direction: column;
		gap: 1px;
		align-items: inherit;
		line-height: var(--lh-tight);
	}
	.both .sub {
		font-size: 0.66em;
		font-weight: 500;
		color: var(--c-ink-soft);
		letter-spacing: 0.01em;
	}
</style>
