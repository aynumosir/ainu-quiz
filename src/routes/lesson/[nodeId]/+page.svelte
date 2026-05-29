<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { X, Heart, Flame } from '@lucide/svelte';
	import { nodeById, XP_BY_TYPE } from '$lib/content';
	import { loc } from '$lib/content/types';
	import { buildLesson, checkExercise, type Exercise } from '$lib/lesson/exercise';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import OptionList from '$lib/components/exercise/OptionList.svelte';
	import TileBuilder from '$lib/components/exercise/TileBuilder.svelte';
	import MatchPairs from '$lib/components/exercise/MatchPairs.svelte';
	import ResultBanner from '$lib/components/lesson/ResultBanner.svelte';
	import Speaker from '$lib/components/ui/Speaker.svelte';
	import Sik from '$lib/components/motif/Sik.svelte';

	const node = nodeById(page.params.nodeId ?? '');

	type Ex = Exercise & { requeued?: boolean };
	let exercises = $state<Ex[]>(node ? buildLesson(node) : []);
	const initialTotal = exercises.length || 1;

	let index = $state(0);
	let selected = $state<number | null>(null);
	let built = $state('');
	let checked = $state(false);
	let lastCorrect = $state(false);

	let combo = $state(0);
	let bestCombo = $state(0);
	let correctFirstTry = $state(0);

	let phase = $state<'play' | 'summary' | 'out'>('play');
	let showQuit = $state(false);
	let xpEarned = $state(0);
	let streakGrew = $state(false);

	const current = $derived(exercises[index]);
	const pct = $derived(Math.min(100, Math.round((index / exercises.length) * 100)));

	const canCheck = $derived.by(() => {
		if (!current || checked) return false;
		if (current.kind === 'tiles') return built.trim() !== '';
		if (current.kind === 'choice' || current.kind === 'fill') return selected != null;
		return false;
	});

	const solution = $derived.by(() => {
		if (!current) return { latin: undefined as string | undefined, text: undefined as string | undefined };
		if (current.kind === 'tiles' || current.kind === 'fill')
			return { latin: current.answer, text: undefined };
		const c = current.choices?.find((x) => x.correct);
		return { latin: c?.latin, text: c?.text ? loc(c.text, settings.locale) : undefined };
	});

	function onCheck() {
		if (!canCheck || !current) return;
		const correct = checkExercise(current, { selected: selected ?? undefined, built });
		checked = true;
		lastCorrect = correct;
		current.vocabIds?.forEach((id) => progress.recordWordResult(id, correct));
		if (correct) {
			combo += 1;
			bestCombo = Math.max(bestCombo, combo);
			if (!current.requeued) correctFirstTry += 1;
		} else {
			combo = 0;
			progress.loseHeart();
			progress.addMistake({ sentenceId: current.sentenceId, vocabId: current.vocabIds?.[0] });
			exercises = [...exercises, { ...current, requeued: true }];
		}
	}

	function advance() {
		checked = false;
		selected = null;
		built = '';
		if (!lastCorrect && !progress.unlimitedHearts && progress.hearts <= 0) {
			phase = 'out';
			return;
		}
		index += 1;
		if (index >= exercises.length) finish();
	}

	function onMatchComplete(mistakes: number) {
		if (mistakes === 0) correctFirstTry += 1;
		combo = mistakes === 0 ? combo + 1 : 0;
		bestCombo = Math.max(bestCombo, combo);
		setTimeout(() => {
			index += 1;
			if (index >= exercises.length) finish();
		}, 320);
	}

	function finish() {
		if (!node) return;
		const base = XP_BY_TYPE[node.type] ?? 10;
		xpEarned = base + Math.min(8, Math.floor(bestCombo / 3) * 2);
		progress.addXp(xpEarned);
		progress.addGems(node.type === 'lesson' ? 2 : 1);
		streakGrew = progress.registerStudyDay();
		progress.completeNodeLevel(node.id, { legendary: node.legendary, levels: node.levels ?? 1 });
		phase = 'summary';
	}

	function refillAndResume() {
		progress.refillHearts();
		phase = 'play';
		index += 1;
		if (index >= exercises.length) finish();
	}

	const accuracy = $derived(Math.round((correctFirstTry / initialTotal) * 100));

	function onKey(e: KeyboardEvent) {
		if (phase !== 'play') return;
		if (e.key === 'Escape') {
			showQuit = true;
			return;
		}
		if (checked) {
			if (e.key === 'Enter') advance();
			return;
		}
		if (current?.kind === 'choice' || current?.kind === 'fill') {
			const n = parseInt(e.key, 10);
			if (n >= 1 && n <= (current.choices?.length ?? 0)) selected = n - 1;
		}
		if (e.key === 'Enter' && canCheck) onCheck();
	}

	onMount(() => {
		if (!node) goto('/');
	});
</script>

<svelte:window onkeydown={onKey} />

{#if !node}
	<div class="loading">{t('common.loading')}</div>
{:else if phase === 'summary'}
	<div class="summary">
		<div class="burst"><Sik size={72} filled /></div>
		<h1>{t('summary.title')}</h1>
		<div class="cards">
			<div class="card xp">
				<span class="k">{t('summary.totalXp')}</span>
				<strong>{xpEarned}</strong>
			</div>
			<div class="card acc">
				<span class="k">{t('summary.accuracy')}</span>
				<strong>{accuracy}%</strong>
			</div>
			<div class="card combo">
				<span class="k">{t('summary.combo')}</span>
				<strong>{bestCombo}</strong>
			</div>
		</div>
		{#if streakGrew}
			<p class="streakline"><Flame size={18} /> {t('stats.streak', { n: progress.streak })}</p>
		{/if}
		<div class="summary-foot">
			<Button full caps onclick={() => goto('/')}>{t('summary.claim')}</Button>
		</div>
	</div>
{:else}
	<div class="lesson">
		<header class="lbar">
			<button class="close" aria-label={t('lesson.quit')} onclick={() => (showQuit = true)}>
				<X size={26} />
			</button>
			<div class="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
				<div class="fill" style="width:{pct}%"></div>
			</div>
			<div class="hearts" aria-label={t('stats.hearts', { n: progress.hearts })}>
				<Heart size={22} fill="currentColor" />
				<span>{progress.unlimitedHearts ? '∞' : progress.hearts}</span>
			</div>
		</header>

		{#if combo >= 2}
			<div class="combo-badge" aria-hidden="true"><Flame size={16} /> {combo}</div>
		{/if}

		<main class="stage">
			<h2 class="instruction">{t(current.instructionKey)}</h2>

			<div class="prompt">
				{#if current.kind === 'tiles'}
					<p class="meaning">{loc(current.promptText, settings.locale)}</p>
				{:else if current.kind === 'fill'}
					<p class="meaning small">{loc(current.promptText, settings.locale)}</p>
					<p class="fillline">
						<AinuText latin={current.blankParts?.[0] ?? ''} />
						<span class="gap" class:filled={selected != null}>
							{#if selected != null && current.choices?.[selected]?.latin}
								<AinuText latin={current.choices[selected].latin ?? ''} />
							{/if}
						</span>
						<AinuText latin={current.blankParts?.[1] ?? ''} />
					</p>
				{:else if current.kind === 'choice'}
					{#if current.promptLatin}
						<div class="promptline">
							<Speaker latin={current.promptLatin} autoplay />
							<p class="big"><AinuText latin={current.promptLatin} /></p>
						</div>
					{:else if current.promptRaw}
						<p class="raw">{current.promptRaw}</p>
					{/if}
				{/if}
			</div>

			{#key index}
				<div class="answer">
					{#if current.kind === 'tiles'}
						<TileBuilder tiles={current.tiles ?? []} {checked} bind:built />
					{:else if current.kind === 'match'}
						<MatchPairs pairs={current.pairs ?? []} oncomplete={onMatchComplete} />
					{:else}
						<OptionList choices={current.choices ?? []} {checked} bind:selected />
					{/if}
				</div>
			{/key}
		</main>

		{#if current.kind !== 'match' && !checked}
			<footer class="foot">
				<Button full caps disabled={!canCheck} onclick={onCheck}>{t('lesson.check')}</Button>
			</footer>
		{/if}

		{#if checked}
			<ResultBanner
				correct={lastCorrect}
				solutionLatin={lastCorrect ? undefined : solution.latin}
				solutionText={lastCorrect ? undefined : solution.text}
				onContinue={advance}
			/>
		{/if}

		{#if showQuit}
			<div class="scrim" role="dialog" aria-modal="true" aria-label={t('lesson.quit')}>
				<div class="modal">
					<h3>{t('lesson.quit')}</h3>
					<p>{t('lesson.quitBody')}</p>
					<Button full onclick={() => (showQuit = false)}>{t('lesson.quitStay')}</Button>
					<Button variant="ghost" full onclick={() => goto('/')}>{t('lesson.quitLeave')}</Button>
				</div>
			</div>
		{/if}

		{#if phase === 'out'}
			<div class="scrim" role="dialog" aria-modal="true" aria-label={t('stats.outOfHearts')}>
				<div class="modal">
					<div class="heart-big"><Heart size={48} fill="currentColor" /></div>
					<h3>{t('stats.outOfHearts')}</h3>
					<p>{t('stats.outOfHeartsBody')}</p>
					<Button
						full
						disabled={progress.gems < 350}
						onclick={() => progress.refillWithGems(350) && (phase = 'play') && advance()}
					>
						{t('stats.refillGems', { n: 350 })}
					</Button>
					<Button variant="success" full onclick={refillAndResume}>
						{t('stats.practiceToHeal')}
					</Button>
					<Button variant="ghost" full onclick={() => goto('/')}>{t('lesson.quitLeave')}</Button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.lesson {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--c-bg);
	}
	.loading {
		padding: var(--sp-8);
		text-align: center;
		color: var(--c-ink-soft);
	}

	.lbar {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: calc(var(--sp-3) + env(safe-area-inset-top, 0px)) var(--sp-4) var(--sp-3);
	}
	.close {
		flex: none;
		color: var(--c-ink-faint);
	}
	.bar {
		flex: 1;
		height: 14px;
		border-radius: var(--r-pill);
		background: var(--c-track);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		border-radius: var(--r-pill);
		background: var(--c-success);
		transition: width var(--dur-slow) var(--ease-out);
	}
	.hearts {
		flex: none;
		display: flex;
		align-items: center;
		gap: 4px;
		font-weight: 800;
		color: var(--c-danger);
	}

	.combo-badge {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-top: var(--sp-2);
		padding: 4px 12px;
		border-radius: var(--r-pill);
		background: color-mix(in srgb, #e8862a 18%, var(--c-surface));
		color: #c2701f;
		font-weight: 800;
		font-size: var(--fz-sm);
		animation: pop var(--dur-med) var(--ease-spring);
	}
	@keyframes pop {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.stage {
		flex: 1;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		padding: var(--sp-4) var(--sp-4) var(--sp-8);
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	.instruction {
		font-family: var(--ff-display);
		font-size: var(--fz-xl);
		color: var(--c-ink);
	}
	.promptline {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		flex-wrap: wrap;
	}
	.prompt .big {
		font-size: var(--fz-3xl);
		font-weight: 800;
		color: var(--c-ink);
	}
	.prompt .meaning {
		font-size: var(--fz-xl);
		font-weight: 700;
		color: var(--c-ink);
	}
	.prompt .meaning.small {
		font-size: var(--fz-md);
		font-weight: 600;
		color: var(--c-ink-soft);
		margin-bottom: var(--sp-3);
	}
	.prompt .raw {
		font-size: var(--fz-lg);
		color: var(--c-ink);
	}
	.fillline {
		font-size: var(--fz-2xl);
		font-weight: 700;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.gap {
		min-width: 80px;
		min-height: 1.4em;
		border-bottom: 3px solid var(--c-border-strong);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
	}
	.gap.filled {
		border-bottom-color: var(--c-primary);
	}

	.foot {
		position: sticky;
		bottom: 0;
		padding: var(--sp-4);
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	/* modals */
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background: color-mix(in srgb, #000 45%, transparent);
	}
	.modal {
		width: 100%;
		max-width: 460px;
		background: var(--c-surface);
		border-top-left-radius: var(--r-xl);
		border-top-right-radius: var(--r-xl);
		padding: var(--sp-6) var(--sp-4) calc(var(--sp-5) + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
		text-align: center;
	}
	.modal h3 {
		font-size: var(--fz-xl);
	}
	.modal p {
		color: var(--c-ink-soft);
		margin-bottom: var(--sp-2);
	}
	.heart-big {
		align-self: center;
		color: var(--c-danger);
	}

	/* summary */
	.summary {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--sp-5);
		padding: var(--sp-6) var(--sp-4);
		text-align: center;
		background: var(--c-bg);
	}
	.burst {
		color: var(--c-primary);
		animation: pop var(--dur-slow) var(--ease-spring);
	}
	.summary h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-2xl);
		color: var(--c-primary);
	}
	.cards {
		display: flex;
		gap: var(--sp-3);
		flex-wrap: wrap;
		justify-content: center;
	}
	.card {
		min-width: 92px;
		padding: var(--sp-3) var(--sp-4);
		border-radius: var(--r-md);
		border: 2px solid var(--c-border);
		background: var(--c-surface);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.card .k {
		font-size: var(--fz-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--c-ink-faint);
	}
	.card strong {
		font-size: var(--fz-2xl);
		color: var(--c-ink);
	}
	.card.xp strong {
		color: var(--c-warning);
	}
	.card.acc strong {
		color: var(--c-success);
	}
	.streakline {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #c2701f;
		font-weight: 700;
	}
	.summary-foot {
		width: 100%;
		max-width: 460px;
	}
</style>
