<script lang="ts">
	import { settings } from '$lib/settings/settings.svelte';
	import { loc, type Localized } from '$lib/content/types';
	import AinuText from '$lib/components/AinuText.svelte';
	import { sfx } from '$lib/audio/sfx.svelte';
	import { haptic } from '$lib/audio/haptics';

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
			sfx.select();
			haptic(8);
			return;
		}
		if (activeCol === col) {
			activePi = pi;
			sfx.select();
			return;
		}
		// resolving across columns
		if (activePi === pi) {
			matched = [...matched, pi];
			activeCol = null;
			activePi = null;
			sfx.ping();
			haptic(12);
			if (matched.length === pairs.length) oncomplete?.(mistakes);
		} else {
			mistakes++;
			wrong = [pi, activePi as number];
			activeCol = null;
			activePi = null;
			sfx.wrong();
			haptic([18, 30, 18]);
			setTimeout(() => (wrong = []), 380);
		}
	}
</script>

<!-- One grid, interleaved L/R per row, so each pair shares a row and the two
     columns stay aligned even when Ainu (2-line) and gloss (1-line) heights differ. -->
<div class="match">
	{#each left as l, i (l.pi)}
		<button
			class="cell"
			class:active={activeCol === 'L' && activePi === l.pi}
			class:matched={matched.includes(l.pi)}
			class:wrong={wrong.includes(l.pi)}
			disabled={matched.includes(l.pi)}
			onclick={() => tap('L', l.pi)}
		>
			<AinuText latin={l.latin} />
		</button>
		<button
			class="cell gloss"
			class:active={activeCol === 'R' && activePi === right[i].pi}
			class:matched={matched.includes(right[i].pi)}
			class:wrong={wrong.includes(right[i].pi)}
			disabled={matched.includes(right[i].pi)}
			onclick={() => tap('R', right[i].pi)}
		>
			{loc(right[i].text, settings.locale)}
		</button>
	{/each}
</div>

<style>
	.match {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
		align-items: stretch;
	}
	.cell {
		align-self: stretch;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--sp-3);
		min-height: 60px;
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
