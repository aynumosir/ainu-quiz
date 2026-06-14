<script lang="ts">
	import { bundle } from '$lib/content';
	import { loc } from '$lib/content/types';
	import { settings } from '$lib/settings/settings.svelte';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';

	const all = Object.values(bundle.vocab);
	let q = $state('');

	const list = $derived.by(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return all;
		return all.filter(
			(v) =>
				v.latin.toLowerCase().includes(needle) ||
				(v.gloss.en ?? '').toLowerCase().includes(needle) ||
				(v.gloss.ja ?? '').includes(q.trim())
		);
	});
</script>

<div class="words">
	<h1>{t('nav.words')}</h1>
	<input
		class="search"
		type="search"
		bind:value={q}
		placeholder={settings.locale === 'ja' ? '単語を検索…' : 'Search words…'}
		aria-label={t('nav.words')}
	/>

	<ul>
		{#each list as v (v.id)}
			<li>
				<div class="row">
					<AinuText latin={v.latin} class="word" />
					<span class="gloss">{loc(v.gloss, settings.locale)}</span>
				</div>
				{#if v.note}
					<p class="note">{loc(v.note, settings.locale)}</p>
				{/if}
			</li>
		{/each}
	</ul>

	{#if list.length === 0}
		<p class="empty">{settings.locale === 'ja' ? '見つかりません' : 'No matches'}</p>
	{/if}
	<p class="count">{list.length} / {all.length}</p>
</div>

<style>
	.words {
		max-width: 560px;
		margin: 0 auto;
		padding: var(--sp-4) var(--sp-4) var(--sp-8);
	}
	h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-xl);
		color: var(--c-ink);
		margin-bottom: var(--sp-3);
	}
	.search {
		width: 100%;
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-border);
		border-radius: var(--r-lg);
		background: var(--c-surface);
		color: var(--c-ink);
		font-size: var(--fz-md);
		margin-bottom: var(--sp-4);
	}
	.search:focus {
		outline: none;
		border-color: var(--c-primary);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		list-style: none;
	}
	li {
		background: var(--c-surface);
		border: 1px solid var(--c-border);
		border-radius: var(--r-lg);
		padding: var(--sp-3) var(--sp-4);
	}
	.row {
		display: flex;
		align-items: baseline;
		gap: var(--sp-3);
	}
	.row :global(.word) {
		font-weight: 800;
		font-size: var(--fz-lg);
		color: var(--c-ink);
	}
	.gloss {
		flex: 1;
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
	}
	.note {
		margin-top: var(--sp-2);
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-border);
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.6;
	}
	.count,
	.empty {
		text-align: center;
		color: var(--c-ink-faint);
		font-size: var(--fz-sm);
		margin-top: var(--sp-4);
	}
</style>
