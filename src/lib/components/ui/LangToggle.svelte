<script lang="ts">
	import { settings, type Locale } from '$lib/settings/settings.svelte';

	interface Props {
		size?: 'sm' | 'md';
	}
	let { size = 'sm' }: Props = $props();

	// UI language for the learner. Ainu is always the target — this only switches
	// the glosses/instructions. Mirrors ScriptToggle so the two sit together.
	const opts: { locale: Locale; label: string; aria: string }[] = [
		{ locale: 'ja', label: 'JA', aria: '日本語' },
		{ locale: 'en', label: 'EN', aria: 'English' }
	];
</script>

<div class="seg {size}" role="group" aria-label="UI language">
	{#each opts as o (o.locale)}
		<button
			class="seg-btn"
			class:active={settings.locale === o.locale}
			aria-pressed={settings.locale === o.locale}
			aria-label={o.aria}
			onclick={() => settings.setLocale(o.locale)}
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
