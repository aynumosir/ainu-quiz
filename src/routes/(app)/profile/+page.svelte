<script lang="ts">
	import { Flame, Gem, Trophy, Zap } from '@lucide/svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings, type Locale, type ThemePref } from '$lib/settings/settings.svelte';
	import { t } from '$lib/i18n/t';
	import ScriptToggle from '$lib/components/ui/ScriptToggle.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const LEAGUES = ['Bronze', 'Silver', 'Gold', 'Sapphire', 'Ruby', 'Emerald', 'Diamond'];
	const locales: { v: Locale; label: string }[] = [
		{ v: 'ja', label: '日本語' },
		{ v: 'en', label: 'English' }
	];
	const themes: {
		v: ThemePref;
		key: 'settings.themeLight' | 'settings.themeDark' | 'settings.themeSystem';
	}[] = [
		{ v: 'light', key: 'settings.themeLight' },
		{ v: 'dark', key: 'settings.themeDark' },
		{ v: 'system', key: 'settings.themeSystem' }
	];

	function confirmReset() {
		if (confirm(t('settings.resetConfirm'))) progress.reset();
	}
</script>

<div class="profile">
	<section class="stats">
		<div class="stat">
			<Flame size={22} /><strong>{progress.streak}</strong>
			<span>{settings.locale === 'ja' ? '連続' : 'streak'}</span>
		</div>
		<div class="stat">
			<Zap size={22} /><strong>{progress.xp}</strong><span>XP</span>
		</div>
		<div class="stat">
			<Gem size={22} /><strong>{progress.gems}</strong>
			<span>{settings.locale === 'ja' ? 'ジェム' : 'gems'}</span>
		</div>
		<div class="stat">
			<Trophy size={22} /><strong>{LEAGUES[progress.league] ?? LEAGUES[0]}</strong>
			<span>{settings.locale === 'ja' ? 'リーグ' : 'league'}</span>
		</div>
	</section>

	<MoreuRule />

	<section class="group">
		<h2>{t('settings.title')}</h2>

		<div class="row">
			<span class="rlabel">{t('settings.uiLanguage')}</span>
			<div class="seg">
				{#each locales as o (o.v)}
					<button class="seg-btn" class:active={settings.locale === o.v} onclick={() => settings.setLocale(o.v)}>
						{o.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="row">
			<span class="rlabel">{t('settings.scriptMode')}</span>
			<ScriptToggle size="md" />
		</div>

		<div class="row">
			<span class="rlabel">{t('settings.theme')}</span>
			<div class="seg">
				{#each themes as o (o.v)}
					<button class="seg-btn" class:active={settings.theme === o.v} onclick={() => settings.setTheme(o.v)}>
						{t(o.key)}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<MoreuRule />

	<section class="group about">
		<h2>{settings.locale === 'ja' ? 'デザインについて' : 'About the design'}</h2>
		<p>
			{#if settings.locale === 'ja'}
				このアプリの意匠は<strong>アイヌ文様</strong>（モレウ・アイウㇱ・シㇰ）に敬意を込めて着想を得たもので、特定の作品の複製ではありません。色は藍染やアットゥㇱなどの素材に由来します。参考：公益財団法人アイヌ民族文化財団（ff-ainu.or.jp）、国立アイヌ民族博物館
				ウポポイ（nam.go.jp）。文様の意味には地域差があり、断定的な解釈は避けています。
			{:else}
				This design is a respectful homage to <strong>アイヌ文様 (Ainu patterns)</strong> — moreu, ayus,
				sik — abstracted, not a reproduction of any specific work. Colors derive from materials like
				indigo dye and attus elm-bark cloth. References: Foundation for Ainu Culture (ff-ainu.or.jp) and
				the National Ainu Museum, Upopoy (nam.go.jp). Pattern meanings vary by region, so we avoid
				asserting fixed interpretations.
			{/if}
		</p>
	</section>

	<div class="danger">
		<Button variant="ghost" full onclick={confirmReset}>{t('settings.reset')}</Button>
	</div>
</div>

<style>
	.profile {
		max-width: 520px;
		margin: 0 auto;
		padding: var(--sp-5) var(--sp-4) var(--sp-8);
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--sp-3);
	}
	.stat {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		column-gap: var(--sp-3);
		align-items: center;
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-border);
		border-radius: var(--r-md);
		background: var(--c-surface);
	}
	.stat :global(svg) {
		grid-row: 1 / 3;
		color: var(--c-primary);
	}
	.stat strong {
		font-size: var(--fz-xl);
		color: var(--c-ink);
	}
	.stat span {
		font-size: var(--fz-xs);
		color: var(--c-ink-faint);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.group h2 {
		font-family: var(--ff-display);
		font-size: var(--fz-lg);
		margin-bottom: var(--sp-3);
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		padding: var(--sp-3) 0;
		border-bottom: 1px solid var(--c-border);
	}
	.rlabel {
		font-weight: 600;
		color: var(--c-ink-soft);
	}
	.seg {
		display: inline-flex;
		background: var(--c-surface-sunken);
		border-radius: var(--r-pill);
		padding: 3px;
		gap: 2px;
	}
	.seg-btn {
		padding: 6px 12px;
		border-radius: var(--r-pill);
		font-weight: 700;
		font-size: var(--fz-sm);
		color: var(--c-ink-soft);
	}
	.seg-btn.active {
		background: var(--c-surface);
		color: var(--c-primary);
		box-shadow: var(--sh-1);
	}
	.about p {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.6;
	}
	.danger {
		margin-top: var(--sp-4);
	}
</style>
