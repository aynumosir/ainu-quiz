<script lang="ts">
	import { Heart, RefreshCcw, Dumbbell } from '@lucide/svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { MAX_HEARTS } from '$lib/state/progress.svelte';
	import { vocabById } from '$lib/content';
	import { loc } from '$lib/content/types';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';

	let now = $state(Date.now());
	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	const heartCountdown = $derived.by(() => {
		void now;
		const ms = progress.msToNextHeart;
		if (ms <= 0) return null;
		const m = Math.floor(ms / 60000);
		const s = Math.floor((ms % 60000) / 1000);
		return `${m}:${String(s).padStart(2, '0')}`;
	});

	const learned = $derived(
		Object.entries(progress.words)
			.map(([id, stat]) => ({ vocab: vocabById(id), stat }))
			.filter((x) => x.vocab)
			.sort((a, b) => a.stat.strength - b.stat.strength)
	);
</script>

<div class="practice">
	<h1>{t('practice.title')}</h1>

	<section class="card hearts-card">
		<div class="hicons" aria-label={t('stats.hearts', { n: progress.hearts })}>
			{#each Array(MAX_HEARTS) as _, i (i)}
				<span class:filled={i < progress.hearts}><Heart size={26} fill="currentColor" /></span>
			{/each}
		</div>
		<div class="hinfo">
			{#if progress.unlimitedHearts}
				<strong>∞</strong>
			{:else if heartCountdown}
				<span class="next">{settings.locale === 'ja' ? '次のハートまで' : 'Next heart in'} {heartCountdown}</span>
				<Button onclick={() => progress.refillWithGems(350)} disabled={progress.gems < 350}>
					{t('stats.refillGems', { n: 350 })}
				</Button>
			{:else}
				<span class="full">{settings.locale === 'ja' ? 'ハートは満タン' : 'Hearts full'}</span>
			{/if}
		</div>
	</section>

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
	.card {
		background: var(--c-surface);
		border: 2px solid var(--c-border);
		border-radius: var(--r-lg);
		padding: var(--sp-4);
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
		align-items: center;
	}
	.hicons {
		display: flex;
		gap: var(--sp-2);
		color: var(--c-danger);
	}
	.hicons span {
		opacity: 0.25;
	}
	.hicons span.filled {
		opacity: 1;
	}
	.hinfo {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		align-items: center;
		color: var(--c-ink-soft);
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
