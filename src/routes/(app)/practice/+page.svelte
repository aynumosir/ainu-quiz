<script lang="ts">
	import { RefreshCcw, Dumbbell, Library } from '@lucide/svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { vocabById } from '$lib/content';
	import { loc } from '$lib/content/types';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';

	const learned = $derived(
		Object.entries(progress.words)
			.map(([id, stat]) => ({ vocab: vocabById(id), stat }))
			.filter((x) => x.vocab)
			.sort((a, b) => a.stat.strength - b.stat.strength)
	);
</script>

<div class="practice">
	<h1>{t('practice.title')}</h1>

	<section class="tiles">
		<div class="ptile">
			<RefreshCcw size={28} />
			<div>
				<strong>{t('practice.mistakes')}</strong>
				<span>{progress.mistakes.length}</span>
			</div>
		</div>
		<div class="ptile">
			<Dumbbell size={28} />
			<div>
				<strong>{t('practice.words')}</strong>
				<span>{learned.length}</span>
			</div>
		</div>
	</section>

	<a class="browse" href="/words">
		<Library size={22} />
		<span class="lbl">{t('practice.vocabulary')}</span>
		<span class="chev" aria-hidden="true">›</span>
	</a>

	<MoreuRule />

	<section class="words">
		<h2>{t('practice.weakSpots')}</h2>
		{#if learned.length === 0}
			<p class="empty">{t('practice.empty')}</p>
		{:else}
			<ul>
				{#each learned as { vocab, stat } (vocab!.id)}
					<li>
						<div class="w">
							<AinuText latin={vocab!.latin} />
							<span class="g">{loc(vocab!.gloss, settings.locale)}</span>
						</div>
						<div class="strength" aria-hidden="true">
							<div class="fill" style="width:{Math.round(stat.strength * 100)}%"></div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<style>
	.practice {
		max-width: 520px;
		margin: 0 auto;
		padding: var(--sp-5) var(--sp-4) var(--sp-8);
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-2xl);
		color: var(--c-ink);
	}
	.tiles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}
	.ptile {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-4);
		border: 2px solid var(--c-border);
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-primary);
	}
	.ptile div {
		display: flex;
		flex-direction: column;
		color: var(--c-ink);
	}
	.ptile strong {
		font-size: var(--fz-sm);
	}
	.ptile span {
		font-size: var(--fz-xl);
		font-weight: 800;
	}
	.browse {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-4);
		border: 2px solid var(--c-border-strong);
		border-bottom-width: 4px;
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-weight: 700;
	}
	.browse :global(svg) {
		color: var(--c-primary);
	}
	.browse .lbl {
		flex: 1;
	}
	.browse .chev {
		color: var(--c-ink-faint);
		font-size: var(--fz-lg);
	}
	.words h2 {
		font-family: var(--ff-display);
		font-size: var(--fz-lg);
		margin-bottom: var(--sp-3);
	}
	.empty {
		color: var(--c-ink-faint);
		text-align: center;
		padding: var(--sp-5);
	}
	.words ul {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.words li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-4);
	}
	.w {
		display: flex;
		flex-direction: column;
		font-size: var(--fz-lg);
		font-weight: 600;
	}
	.w .g {
		font-size: var(--fz-sm);
		font-weight: 400;
		color: var(--c-ink-faint);
	}
	.strength {
		flex: none;
		width: 90px;
		height: 10px;
		border-radius: var(--r-pill);
		background: var(--c-track);
		overflow: hidden;
	}
	.strength .fill {
		height: 100%;
		background: var(--c-success);
		border-radius: var(--r-pill);
		transition: width var(--dur-med) var(--ease-out);
	}
</style>
