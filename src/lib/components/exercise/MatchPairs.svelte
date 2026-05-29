<script lang="ts">
	import { settings } from '$lib/settings/settings.svelte';
	import { loc, type Localized } from '$lib/content/types';
	import AinuText from '$lib/components/AinuText.svelte';

	interface Props {
		pairs: { latin: string; text: Localized }[];
		oncomplete?: (mistakes: number) => void;
	}
	let { pairs, oncomplete }: Props = $props();

	function sh<T>(a: T[]): T[] {
		const b = a.slice();
		for (let i = b.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[b[i], b[j]] = [b[j], b[i]];
		}
		return b;
	}
	const left = sh(pairs.map((p, i) => ({ pi: i, latin: p.latin })));
	const right = sh(pairs.map((p, i) => ({ pi: i, text: p.text })));

	let activeCol = $state<'L' | 'R' | null>(null);
	let activePi = $state<number | null>(null);
	let matched = $state<number[]>([]);
	let wrong = $state<number[]>([]);
	let mistakes = 0;

	function tap(col: 'L' | 'R', pi: number) {
		if (matched.includes(pi)) return;
		if (activeCol === null) {
			activeCol = col;
			activePi = pi;
			return;
		}
		if (activeCol === col) {
			activePi = pi;
			return;
		}
		// resolving across columns
		if (activePi === pi) {
			matched = [...matched, pi];
			activeCol = null;
			activePi = null;
			if (matched.length === pairs.length) oncomplete?.(mistakes);
		} else {
			mistakes++;
			wrong = [pi, activePi as number];
			activeCol = null;
			activePi = null;
			setTimeout(() => (wrong = []), 380);
		}
	}
</script>

<div class="match">
	<div class="col">
		{#each left as item (item.pi)}
			<button
				class="cell"
				class:active={activeCol === 'L' && activePi === item.pi}
				class:matched={matched.includes(item.pi)}
				class:wrong={wrong.includes(item.pi)}
				disabled={matched.includes(item.pi)}
				onclick={() => tap('L', item.pi)}
			>
				<AinuText latin={item.latin} />
			</button>
		{/each}
	</div>
	<div class="col">
		{#each right as item (item.pi)}
			<button
				class="cell"
				class:active={activeCol === 'R' && activePi === item.pi}
				class:matched={matched.includes(item.pi)}
				class:wrong={wrong.includes(item.pi)}
				disabled={matched.includes(item.pi)}
				onclick={() => tap('R', item.pi)}
			>
				{loc(item.text, settings.locale)}
			</button>
		{/each}
	</div>
</div>

<style>
	.match {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.cell {
		padding: var(--sp-3) var(--sp-3);
		min-height: 56px;
		border: 2px solid var(--c-border-strong);
		border-bottom-width: 4px;
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-size: var(--fz-md);
		font-weight: 600;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			background var(--dur-fast) var(--ease-out),
			opacity var(--dur-med) var(--ease-out);
	}
	.cell.active {
		border-color: var(--c-primary);
		background: var(--c-primary-soft);
		color: var(--c-primary);
	}
	.cell.wrong {
		border-color: var(--c-danger);
		background: var(--c-danger-bg);
		animation: shake 0.32s var(--ease-out);
	}
	.cell.matched {
		opacity: 0;
		pointer-events: none;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
</style>
