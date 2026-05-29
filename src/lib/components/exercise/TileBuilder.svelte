<script lang="ts">
	import AinuText from '$lib/components/AinuText.svelte';
	import { sfx } from '$lib/audio/sfx.svelte';
	import { haptic } from '$lib/audio/haptics';

	interface Props {
		tiles: string[];
		checked?: boolean;
		built?: string;
	}
	let { tiles, checked = false, built = $bindable('') }: Props = $props();

	let placed = $state<number[]>([]);
	const placedSet = $derived(new Set(placed));

	$effect(() => {
		built = placed.map((i) => tiles[i]).join(' ');
	});

	function place(i: number) {
		if (checked || placedSet.has(i)) return;
		placed = [...placed, i];
		sfx.tap();
		haptic(8);
	}
	function unplace(i: number) {
		if (checked) return;
		placed = placed.filter((x) => x !== i);
		sfx.unplace();
	}
</script>

<div class="builder">
	<div class="answer-line" aria-label="your answer">
		{#each placed as i (i)}
			<button class="tile placed" disabled={checked} onclick={() => unplace(i)}>
				<AinuText latin={tiles[i]} />
			</button>
		{/each}
	</div>

	<div class="bank">
		{#each tiles as tok, i (i)}
			<button
				class="tile"
				class:ghost={placedSet.has(i)}
				disabled={checked || placedSet.has(i)}
				onclick={() => place(i)}
			>
				<AinuText latin={tok} />
			</button>
		{/each}
	</div>
</div>

<style>
	.builder {
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	.answer-line {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		min-height: 56px;
		padding-bottom: var(--sp-2);
		border-bottom: 2px solid var(--c-border);
		align-content: flex-start;
	}
	.bank {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		justify-content: center;
	}
	.tile {
		padding: var(--sp-2) var(--sp-4);
		border: 2px solid var(--c-border-strong);
		border-bottom-width: 4px;
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-size: var(--fz-lg);
		font-weight: 600;
		transition: transform var(--dur-fast) var(--ease-out);
	}
	.tile:active:not(:disabled) {
		transform: translateY(2px);
		border-bottom-width: 2px;
	}
	/* vacated bank slot keeps its footprint so the layout doesn't reflow */
	.tile.ghost {
		visibility: hidden;
	}
</style>
