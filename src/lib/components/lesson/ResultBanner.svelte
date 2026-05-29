<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Check, X } from '@lucide/svelte';
	import { t } from '$lib/i18n/t';
	import AinuText from '$lib/components/AinuText.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		correct: boolean;
		solutionLatin?: string;
		solutionText?: string;
		onContinue: () => void;
	}
	let { correct, solutionLatin, solutionText, onContinue }: Props = $props();
</script>

<div
	class="banner {correct ? 'ok' : 'no'}"
	transition:fly={{ y: 240, duration: 260, opacity: 1 }}
	role="status"
	aria-live="assertive"
>
	<div class="inner">
		<div class="head">
			<span class="icon">
				{#if correct}<Check size={26} strokeWidth={3} />{:else}<X size={26} strokeWidth={3} />{/if}
			</span>
			<div class="text">
				<strong>{correct ? t('lesson.correct') : t('lesson.incorrectTitle')}</strong>
				{#if !correct && (solutionLatin || solutionText)}
					<div class="sol">
						{#if solutionLatin}<AinuText latin={solutionLatin} />{:else}{solutionText}{/if}
					</div>
				{/if}
			</div>
		</div>
		<Button variant={correct ? 'success' : 'danger'} full caps onclick={onContinue}>
			{correct ? t('lesson.continue') : t('lesson.gotIt')}
		</Button>
	</div>
</div>

<style>
	.banner {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		padding: var(--sp-4) var(--sp-4) calc(var(--sp-4) + env(safe-area-inset-bottom, 0px));
		border-top-left-radius: var(--r-xl);
		border-top-right-radius: var(--r-xl);
	}
	.banner.ok {
		background: var(--c-success-bg);
		color: var(--c-success-ink);
	}
	.banner.no {
		background: var(--c-danger-bg);
		color: var(--c-danger-ink);
	}
	.inner {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}
	.head {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}
	.icon {
		flex: none;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: color-mix(in srgb, currentColor 16%, transparent);
	}
	.text strong {
		font-size: var(--fz-lg);
		font-weight: 800;
	}
	.sol {
		font-size: var(--fz-md);
		font-weight: 600;
		margin-top: 2px;
	}
</style>
