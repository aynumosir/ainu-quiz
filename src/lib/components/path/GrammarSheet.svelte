<script lang="ts">
	import { BookOpen, X } from '@lucide/svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { loc, type Localized } from '$lib/content/types';

	let { title, grammar, onclose }: { title: string; grammar: Localized; onclose: () => void } =
		$props();

	let closeBtn = $state<HTMLButtonElement | null>(null);
	// Move focus into the dialog when it opens (keyboard / screen-reader users).
	$effect(() => {
		closeBtn?.focus();
	});

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="scrim" role="dialog" aria-modal="true" aria-labelledby="grammar-title">
	<div class="sheet">
		<header>
			<span class="kicker">
				<BookOpen size={16} aria-hidden="true" />
				{settings.locale === 'ja' ? '文法のヒント' : 'Grammar tips'}
			</span>
			<button
				bind:this={closeBtn}
				class="x"
				onclick={onclose}
				aria-label={settings.locale === 'ja' ? '閉じる' : 'Close'}
			>
				<X size={20} aria-hidden="true" />
			</button>
		</header>
		<h3 id="grammar-title">{title}</h3>
		<p class="body">{loc(grammar, settings.locale)}</p>
	</div>
</div>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background: color-mix(in srgb, #000 45%, transparent);
	}
	.sheet {
		width: 100%;
		max-width: 460px;
		background: var(--c-surface);
		border-top-left-radius: var(--r-xl);
		border-top-right-radius: var(--r-xl);
		padding: var(--sp-5) var(--sp-4) calc(var(--sp-5) + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fz-xs);
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-primary);
	}
	.x {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: var(--r-pill);
		color: var(--c-ink-soft);
	}
	.x:hover {
		background: var(--c-primary-soft);
	}
	h3 {
		font-family: var(--ff-display);
		font-size: var(--fz-lg);
		color: var(--c-ink);
	}
	.body {
		color: var(--c-ink-soft);
		line-height: 1.7;
		white-space: pre-line;
	}
</style>
