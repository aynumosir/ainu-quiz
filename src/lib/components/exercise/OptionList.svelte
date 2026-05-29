<script lang="ts">
	import { settings } from '$lib/settings/settings.svelte';
	import { loc } from '$lib/content/types';
	import type { Choice } from '$lib/lesson/exercise';
	import AinuText from '$lib/components/AinuText.svelte';
	import { sfx } from '$lib/audio/sfx.svelte';
	import { haptic } from '$lib/audio/haptics';
	import { Check, X } from '@lucide/svelte';

	interface Props {
		choices: Choice[];
		checked?: boolean;
		selected?: number | null;
	}
	let { choices, checked = false, selected = $bindable(null) }: Props = $props();

	function select(i: number) {
		if (checked) return;
		selected = i;
		sfx.select();
		haptic(8);
	}
</script>

<div class="options" role="radiogroup" aria-label="answers">
	{#each choices as c, i (i)}
		<button
			class="opt"
			class:selected={selected === i}
			class:correct={checked && c.correct}
			class:wrong={checked && selected === i && !c.correct}
			role="radio"
			aria-checked={selected === i}
			disabled={checked}
			onclick={() => select(i)}
		>
			<span class="num">{i + 1}</span>
			<span class="label">
				{#if c.latin}
					<AinuText latin={c.latin} />
				{:else}
					{loc(c.text, settings.locale)}
				{/if}
			</span>
			{#if checked && c.correct}
				<span class="mark ok"><Check size={18} /></span>
			{:else if checked && selected === i}
				<span class="mark no"><X size={18} /></span>
			{/if}
		</button>
	{/each}
</div>

<style>
	.options {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.opt {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		text-align: left;
		padding: var(--sp-3) var(--sp-4);
		min-height: 60px;
		border: 2px solid var(--c-border-strong);
		border-bottom-width: 4px;
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-size: var(--fz-lg);
		transition:
			border-color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out);
	}
	.opt:active:not(:disabled) {
		transform: translateY(1px);
	}
	.num {
		flex: none;
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		border-radius: var(--r-sm);
		border: 2px solid var(--c-border-strong);
		font-size: var(--fz-sm);
		font-weight: 800;
		color: var(--c-ink-faint);
	}
	.label {
		flex: 1;
	}
	.mark {
		flex: none;
		display: grid;
		place-items: center;
	}
	.opt.selected {
		border-color: var(--c-primary);
		background: var(--c-primary-soft);
	}
	.opt.selected .num {
		border-color: var(--c-primary);
		color: var(--c-primary);
	}
	.opt.correct {
		border-color: var(--c-success);
		background: var(--c-success-bg);
		color: var(--c-success-ink);
	}
	.opt.correct .mark.ok {
		color: var(--c-success);
	}
	.opt.wrong {
		border-color: var(--c-danger);
		background: var(--c-danger-bg);
		color: var(--c-danger-ink);
	}
	.opt.wrong .mark.no {
		color: var(--c-danger);
	}
</style>
