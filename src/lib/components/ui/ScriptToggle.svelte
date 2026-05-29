<script lang="ts">
	import { settings, type ScriptMode } from '$lib/settings/settings.svelte';

	interface Props {
		size?: 'sm' | 'md';
	}
	let { size = 'sm' }: Props = $props();

	const opts: { mode: ScriptMode; label: string; aria: string }[] = [
		{ mode: 'latin', label: 'A', aria: 'Latin' },
		{ mode: 'kana', label: 'ア', aria: 'Katakana' },
		{ mode: 'both', label: 'A・ア', aria: 'Both scripts' }
	];
</script>

<div class="seg {size}" role="group" aria-label="Ainu script">
	{#each opts as o (o.mode)}
		<button
			class="seg-btn"
			class:active={settings.scriptMode === o.mode}
			aria-pressed={settings.scriptMode === o.mode}
			aria-label={o.aria}
			onclick={() => settings.setScriptMode(o.mode)}
		>
			{o.label}
		</button>
	{/each}
</div>

<style>
	.seg {
		display: inline-flex;
		background: var(--c-surface-sunken);
		border-radius: var(--r-pill);
		padding: 3px;
		gap: 2px;
	}
	.seg-btn {
		border-radius: var(--r-pill);
		color: var(--c-ink-soft);
		font-weight: 700;
		line-height: 1;
		transition:
			background var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}
	.sm .seg-btn {
		padding: 5px 10px;
		font-size: var(--fz-sm);
	}
	.md .seg-btn {
		padding: 8px 16px;
		font-size: var(--fz-md);
	}
	.seg-btn.active {
		background: var(--c-surface);
		color: var(--c-primary);
		box-shadow: var(--sh-1);
	}
</style>
