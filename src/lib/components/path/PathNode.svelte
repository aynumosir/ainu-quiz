<script lang="ts">
	import { Star, Repeat, Trophy, BookOpen, Dumbbell, Check, Lock } from '@lucide/svelte';
	import type { CourseNode, NodeType } from '$lib/content/types';

	type NodeState = 'done' | 'active' | 'locked';

	interface Props {
		node: CourseNode;
		state: NodeState;
		level?: number;
		legendaryDone?: boolean;
		offset?: number;
		startLabel?: string;
		/** Admin override: render locked nodes as openable (still shown locked). */
		adminUnlock?: boolean;
		onstart?: () => void;
	}

	let {
		node,
		state,
		level = 0,
		legendaryDone = false,
		offset = 0,
		startLabel = 'START',
		adminUnlock = false,
		onstart
	}: Props = $props();

	const levels = $derived(node.levels ?? 1);
	const icons: Record<NodeType, typeof Star> = {
		lesson: Star,
		review: Repeat,
		unitReview: Trophy,
		story: BookOpen,
		practice: Dumbbell
	};
	const Icon = $derived(state === 'done' ? Check : (icons[node.type] ?? Star));

	// Segmented progress ring — one arc per level (Duolingo-style crown progress),
	// so it's obvious how many passes a node needs and how many remain.
	const R = 37;
	const C = 2 * Math.PI * R;
	const filled = $derived(state === 'done' ? levels : level);
	// A fully-crowned node closes into ONE solid ring (no gaps); partial progress
	// stays segmented so it's clear how many passes remain.
	const complete = $derived(filled >= levels);
	// Show the ring whenever there's progress to convey: a started node, a done
	// node, or an active multi-pass node (revealing the 0/n goal up front).
	const showRing = $derived(state === 'done' || level > 0 || (state === 'active' && levels > 1));
	const gapDeg = $derived(levels > 1 ? 14 : 0);
	const segLen = $derived((C * (360 / levels - gapDeg)) / 360);
	const segments = $derived(
		Array.from({ length: levels }, (_, i) => ({
			i,
			rot: -90 + i * (360 / levels) + gapDeg / 2,
			on: i < filled
		}))
	);
</script>

<div class="node-wrap" style="transform: translateX({offset}px)">
	{#if state === 'active'}
		<div class="bubble">
			<span>{startLabel}</span>
			<i class="tail"></i>
		</div>
	{/if}

	<div class="stack">
		{#if showRing}
			<svg
				class="ring"
				width="86"
				height="86"
				viewBox="0 0 86 86"
				aria-label={levels > 1 ? `${filled}/${levels}` : undefined}
			>
				{#if complete}
					<!-- fully done → one continuous ring, no gaps -->
					<circle cx="43" cy="43" r={R} class="ring-fill" />
				{:else}
					{#each segments as seg (seg.i)}
						<circle
							cx="43"
							cy="43"
							r={R}
							class="ring-track"
							stroke-dasharray="{segLen} {C - segLen}"
							transform="rotate({seg.rot} 43 43)"
						/>
					{/each}
					{#each segments as seg (seg.i)}
						{#if seg.on}
							<circle
								cx="43"
								cy="43"
								r={R}
								class="ring-fill"
								stroke-dasharray="{segLen} {C - segLen}"
								transform="rotate({seg.rot} 43 43)"
							/>
						{/if}
					{/each}
				{/if}
			</svg>
		{/if}

		{#if state === 'locked' && adminUnlock}
			<button class="circle locked admin-open" onclick={onstart} aria-label="{startLabel} (admin)">
				<Lock size={26} />
			</button>
		{:else if state === 'locked'}
			<div class="circle locked" aria-disabled="true" title={startLabel}>
				<Lock size={26} />
			</div>
		{:else}
			<button
				class="circle {state}"
				class:legend={legendaryDone}
				onclick={onstart}
				aria-label={startLabel}
			>
				<Icon size={30} strokeWidth={2.6} absoluteStrokeWidth />
			</button>
		{/if}
	</div>
</div>

<style>
	.node-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stack {
		position: relative;
		display: grid;
		place-items: center;
		width: 86px;
		height: 86px;
	}

	.circle {
		position: relative;
		z-index: 2;
		width: 66px;
		height: 66px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		color: var(--accent-ink, #fff);
		background: var(--accent, var(--c-primary));
		box-shadow: 0 6px 0 color-mix(in srgb, var(--accent, var(--c-primary)) 70%, #000);
		transition:
			transform var(--dur-fast) var(--ease-out),
			box-shadow var(--dur-fast) var(--ease-out),
			filter var(--dur-fast) var(--ease-out);
	}
	.circle:hover {
		filter: brightness(1.05);
	}
	.circle:active {
		transform: translateY(6px);
		box-shadow: 0 0 0 color-mix(in srgb, var(--accent, var(--c-primary)) 70%, #000);
	}

	.circle.done {
		filter: saturate(0.92);
	}
	.circle.legend {
		background: linear-gradient(145deg, #e7be57, #b8861f);
		color: #3a2c08;
		box-shadow: 0 6px 0 #876214;
	}

	.circle.locked {
		width: 60px;
		height: 60px;
		background: var(--c-surface-sunken);
		color: var(--c-ink-faint);
		box-shadow: none;
		cursor: default;
		opacity: 0.7;
	}
	.circle.locked.admin-open {
		cursor: pointer;
		opacity: 0.9;
		outline: 2px dashed color-mix(in srgb, var(--c-primary) 50%, transparent);
		outline-offset: 3px;
	}

	.ring {
		position: absolute;
		z-index: 1;
	}
	.ring-track {
		fill: none;
		stroke: color-mix(in srgb, var(--accent, var(--c-primary)) 28%, var(--c-bg));
		stroke-width: 7;
		stroke-linecap: round;
	}
	.ring-fill {
		fill: none;
		stroke: var(--accent, var(--c-primary));
		stroke-width: 7;
		stroke-linecap: round;
	}

	/* START bubble — calm sine bob, exactly one on screen */
	.bubble {
		position: absolute;
		bottom: calc(100% - 2px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--c-surface);
		color: var(--accent, var(--c-primary));
		font-weight: 800;
		font-size: var(--fz-sm);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 8px 16px;
		border-radius: var(--r-md);
		box-shadow: var(--sh-2);
		white-space: nowrap;
		animation: bob 1.5s var(--ease-out) infinite;
	}
	.bubble .tail {
		position: absolute;
		bottom: -6px;
		left: 50%;
		width: 14px;
		height: 14px;
		background: var(--c-surface);
		transform: translateX(-50%) rotate(45deg);
		border-radius: 0 0 4px 0;
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-8px);
		}
	}
</style>
