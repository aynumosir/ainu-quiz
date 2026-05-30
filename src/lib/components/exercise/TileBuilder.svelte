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

	let placed = $state<number[]>([]); // tile ids in answer order
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

	// --- drag to reorder placed tiles (tap = remove, drag = rearrange) ---
	let lineEl: HTMLElement | undefined = $state();
	let dragId = $state<number | null>(null); // tile id being dragged
	let active = false; // pointer is down on a placed tile
	let moved = false; // crossed the drag threshold
	let startX = 0;
	let startY = 0;

	function down(e: PointerEvent, id: number) {
		if (checked) return;
		active = true;
		moved = false;
		dragId = id;
		startX = e.clientX;
		startY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function move(e: PointerEvent) {
		if (!active || dragId == null) return;
		if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) < 7) return;
		moved = true;
		const els = lineEl ? ([...lineEl.querySelectorAll('.placed')] as HTMLElement[]) : [];
		// insertion index = first placed tile whose center is past the pointer
		let target = placed.length;
		for (let k = 0; k < els.length; k++) {
			const r = els[k].getBoundingClientRect();
			if (e.clientY < r.bottom && e.clientX < r.left + r.width / 2) {
				target = k;
				break;
			}
		}
		const cur = placed.indexOf(dragId);
		if (cur === -1) return;
		let to = target > cur ? target - 1 : target;
		to = Math.max(0, Math.min(placed.length - 1, to));
		if (to !== cur) {
			const arr = [...placed];
			arr.splice(cur, 1);
			arr.splice(to, 0, dragId);
			placed = arr;
			haptic(5);
		}
	}

	function up(id: number) {
		if (!active) return;
		active = false;
		if (!moved) unplace(id);
		else sfx.tap();
		dragId = null;
	}
</script>

<div class="builder">
	<div class="answer-line" aria-label="your answer" bind:this={lineEl}>
		{#each placed as i (i)}
			<button
				class="tile placed"
				class:dragging={dragId === i}
				disabled={checked}
				onpointerdown={(e) => down(e, i)}
				onpointermove={move}
				onpointerup={() => up(i)}
				onpointercancel={() => (active = false)}
			>
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
		touch-action: none; /* let pointer drag work without the page scrolling */
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
		transition:
			transform var(--dur-fast) var(--ease-out),
			box-shadow var(--dur-fast) var(--ease-out);
	}
	.tile.placed {
		cursor: grab;
		touch-action: none;
	}
	.tile:active:not(:disabled) {
		transform: translateY(2px);
		border-bottom-width: 2px;
	}
	.tile.dragging {
		cursor: grabbing;
		transform: translateY(-2px) scale(1.04);
		box-shadow: var(--sh-2);
		border-color: var(--c-primary);
	}
	/* vacated bank slot keeps its footprint so the layout doesn't reflow */
	.tile.ghost {
		visibility: hidden;
	}
</style>
