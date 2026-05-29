<script lang="ts">
	import { Volume2 } from '@lucide/svelte';
	import { audio } from '$lib/audio/audio.svelte';

	interface Props {
		latin: string;
		autoplay?: boolean;
	}
	let { latin, autoplay = false }: Props = $props();

	// auto-play once when this exercise's prompt mounts/changes
	$effect(() => {
		if (autoplay && audio.has(latin)) audio.play(latin);
	});
</script>

{#if audio.has(latin)}
	<button class="speaker" aria-label="play audio" onclick={() => audio.play(latin)}>
		<Volume2 size={22} />
	</button>
{/if}

<style>
	.speaker {
		flex: none;
		width: 48px;
		height: 48px;
		display: grid;
		place-items: center;
		border-radius: var(--r-md);
		color: var(--c-primary-ink);
		background: var(--c-primary);
		box-shadow: 0 var(--btn-depth) 0 var(--c-primary-edge);
		margin-bottom: var(--btn-depth);
		transition: transform var(--dur-fast) var(--ease-out);
	}
	.speaker:active {
		transform: translateY(var(--btn-depth));
		box-shadow: 0 0 0 var(--c-primary-edge);
	}
</style>
