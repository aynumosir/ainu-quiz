<script lang="ts">
	import { X } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { loc, type Story } from '$lib/content/types';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';
	import Speaker from '$lib/components/ui/Speaker.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import OptionList from '$lib/components/exercise/OptionList.svelte';
	import ResultBanner from '$lib/components/lesson/ResultBanner.svelte';
	import { sfx } from '$lib/audio/sfx.svelte';
	import { haptic } from '$lib/audio/haptics';

	interface Props {
		story: Story;
		onquit?: () => void;
		/** correctFirstTry, bestCombo */
		onfinish?: (correct: number, bestCombo: number) => void;
	}
	let { story, onquit, onfinish }: Props = $props();

	// Assign each distinct speaker a side: first seen = left, second = right,
	// further speakers alternate. Keeps the dialogue readable as a chat.
	const sideOf = (() => {
		const order: string[] = [];
		return (speaker: string): 'a' | 'b' => {
			if (!order.includes(speaker)) order.push(speaker);
			return order.indexOf(speaker) % 2 === 0 ? 'a' : 'b';
		};
	})();

	type Phase = 'read' | 'quiz';
	let phase = $state<Phase>('read');
	let revealed = $state(1); // how many lines are shown
	let scroller = $state<HTMLElement>();

	// quiz state
	let qIndex = $state(0);
	let selected = $state<number | null>(null);
	let checked = $state(false);
	let lastCorrect = $state(false);
	let correct = $state(0);
	let combo = $state(0);
	let bestCombo = $state(0);

	const q = $derived(story.questions[qIndex]);
	const qChoices = $derived(
		(q?.options ?? []).map((o) => ({ latin: o, correct: o === q.answer }))
	);
	const total = $derived(story.lines.length + story.questions.length);
	const done = $derived(phase === 'read' ? revealed : story.lines.length + qIndex + (checked ? 1 : 0));
	const pct = $derived(Math.min(100, Math.round((done / total) * 100)));

	async function reveal() {
		sfx.tap();
		if (revealed < story.lines.length) {
			revealed += 1;
			await tick();
			scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
		} else if (story.questions.length) {
			phase = 'quiz';
		} else {
			onfinish?.(0, 0);
		}
	}

	function check() {
		if (selected == null || checked) return;
		checked = true;
		lastCorrect = !!qChoices[selected]?.correct;
		if (lastCorrect) {
			correct += 1;
			combo += 1;
			bestCombo = Math.max(bestCombo, combo);
			sfx.correct(combo);
			haptic(18);
		} else {
			combo = 0;
			sfx.wrong();
			haptic([25, 40, 25]);
		}
	}

	function nextQuestion() {
		sfx.tap();
		checked = false;
		selected = null;
		if (qIndex >= story.questions.length - 1) {
			onfinish?.(correct, bestCombo);
			return;
		}
		qIndex += 1;
	}

	const canCheck = $derived(selected != null && !checked);
</script>

<div class="story">
	<header class="sbar">
		<button class="close" aria-label={t('lesson.quit')} onclick={() => onquit?.()}>
			<X size={26} />
		</button>
		<div class="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
			<div class="fill" style="width:{pct}%"></div>
		</div>
	</header>

	{#if phase === 'read'}
		<div class="scroll" bind:this={scroller}>
			<div class="story-head">
				<span class="kicker">{t('story.label')}</span>
				<h1>{loc(story.title, settings.locale)}</h1>
			</div>
			{#each story.lines.slice(0, revealed) as line, i (i)}
				{@const side = sideOf(line.speaker)}
				<div class="row {side}">
					<span class="who">{line.speaker}</span>
					<div class="bubble">
						<div class="line">
							<Speaker latin={line.latin} autoplay={i === revealed - 1} />
							<p class="ain"><AinuText latin={line.latin} /></p>
						</div>
						<p class="gloss">{loc(line.translation, settings.locale)}</p>
					</div>
				</div>
			{/each}
		</div>

		<footer class="foot">
			<Button full caps onclick={reveal}>
				{revealed < story.lines.length ? t('story.tapToContinue') : t('lesson.continue')}
			</Button>
		</footer>
	{:else}
		<main class="quiz">
			<span class="kicker">{t('story.question')}</span>
			<h2 class="prompt">{loc(q.prompt, settings.locale)}</h2>
			{#key qIndex}
				<OptionList choices={qChoices} {checked} bind:selected />
			{/key}
		</main>

		{#if !checked}
			<footer class="foot">
				<Button full caps disabled={!canCheck} onclick={check}>{t('lesson.check')}</Button>
			</footer>
		{:else}
			<ResultBanner
				correct={lastCorrect}
				solutionLatin={lastCorrect ? undefined : q.answer}
				onContinue={nextQuestion}
			/>
		{/if}
	{/if}
</div>

<style>
	.story {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--c-bg);
	}
	.sbar {
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

	.scroll {
		flex: 1;
		overflow-y: auto;
		padding: var(--sp-3) var(--sp-4) var(--sp-5);
		max-width: 560px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}
	.story-head {
		text-align: center;
		margin-bottom: var(--sp-2);
	}
	.kicker {
		display: inline-block;
		font-size: var(--fz-xs);
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--c-primary);
	}
	.story-head h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-xl);
		color: var(--c-ink);
		margin-top: var(--sp-1);
	}

	.row {
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-width: 86%;
		animation: rise var(--dur-med) var(--ease-out);
	}
	.row.a {
		align-self: flex-start;
		align-items: flex-start;
	}
	.row.b {
		align-self: flex-end;
		align-items: flex-end;
	}
	.who {
		font-size: var(--fz-xs);
		font-weight: 800;
		color: var(--c-ink-faint);
		padding: 0 var(--sp-2);
	}
	.bubble {
		padding: var(--sp-3) var(--sp-4);
		border-radius: var(--r-lg);
		background: var(--c-surface);
		border: 2px solid var(--c-border);
	}
	.row.a .bubble {
		border-bottom-left-radius: var(--r-xs);
	}
	.row.b .bubble {
		background: var(--c-primary-soft);
		border-color: color-mix(in srgb, var(--c-primary) 30%, transparent);
		border-bottom-right-radius: var(--r-xs);
	}
	.line {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}
	.ain {
		font-size: var(--fz-lg);
		font-weight: 700;
		color: var(--c-ink);
	}
	.gloss {
		margin-top: 4px;
		font-size: var(--fz-sm);
		color: var(--c-ink-soft);
	}

	.quiz {
		flex: 1;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
		padding: var(--sp-4);
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}
	.prompt {
		font-size: var(--fz-lg);
		font-weight: 800;
		color: var(--c-ink);
	}

	.foot {
		padding: var(--sp-4) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom, 0px));
		max-width: 560px;
		width: 100%;
		margin: 0 auto;
		border-top: 1px solid var(--c-border);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	:global([data-reduce-motion='true']) .row {
		animation: none;
	}
</style>
