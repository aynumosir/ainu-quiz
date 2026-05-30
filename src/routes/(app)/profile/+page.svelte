<script lang="ts">
	import { Flame, Gem, Trophy, Zap } from '@lucide/svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings, type Locale, type ThemePref } from '$lib/settings/settings.svelte';
	import { t } from '$lib/i18n/t';
	import ScriptToggle from '$lib/components/ui/ScriptToggle.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { DIALECT_OPTIONS } from '$lib/script/dialect';
	import AccountCard from '$lib/components/account/AccountCard.svelte';

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

	const toggles = [
		{ key: 'settings.sound' as const, get: () => settings.sound, set: (v: boolean) => settings.setSound(v) },
		{ key: 'settings.haptics' as const, get: () => settings.haptics, set: (v: boolean) => settings.setHaptics(v) },
		{ key: 'settings.motion' as const, get: () => settings.reduceMotion, set: (v: boolean) => settings.setReduceMotion(v) }
	];

	function confirmReset() {
		if (confirm(t('settings.resetConfirm'))) progress.reset();
	}
</script>

<div class="profile">
	<AccountCard />

	<MoreuRule />

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
			<span class="rlabel">{t('settings.dialect')}</span>
			<select
				class="dsel"
				value={settings.dialect}
				onchange={(e) => settings.setDialect(e.currentTarget.value as typeof settings.dialect)}
				aria-label={t('settings.dialect')}
			>
				{#each DIALECT_OPTIONS as d (d.id)}
					<option value={d.id}>{settings.locale === 'ja' ? d.ja : d.en}</option>
				{/each}
			</select>
		</div>
		<p class="rnote">{t('settings.dialectNote')}</p>

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

		{#each toggles as tg (tg.key)}
			<div class="row">
				<span class="rlabel">{t(tg.key)}</span>
				<button
					class="toggle"
					class:on={tg.get()}
					role="switch"
					aria-checked={tg.get()}
					aria-label={t(tg.key)}
					onclick={() => tg.set(!tg.get())}
				>
					<span class="knob"></span>
				</button>
			</div>
		{/each}
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

	<a class="reflink" href="/about">
		<span>{settings.locale === 'ja' ? '出典・参考文献' : 'References & sources'}</span>
		<span class="chev" aria-hidden="true">›</span>
	</a>

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
	.dsel {
		appearance: none;
		background: var(--c-surface-sunken);
		color: var(--c-ink);
		font-weight: 700;
		font-size: var(--fz-sm);
		padding: 7px 28px 7px 14px;
		border: 2px solid var(--c-border-strong);
		border-radius: var(--r-pill);
		background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position:
			calc(100% - 15px) 50%,
			calc(100% - 10px) 50%;
		background-size:
			5px 5px,
			5px 5px;
		background-repeat: no-repeat;
	}
	.rnote {
		font-size: var(--fz-xs);
		color: var(--c-ink-faint);
		line-height: 1.5;
		margin: calc(-1 * var(--sp-2)) 0 var(--sp-2);
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
	.toggle {
		width: 50px;
		height: 30px;
		border-radius: var(--r-pill);
		background: var(--c-surface-sunken);
		border: 2px solid var(--c-border-strong);
		padding: 2px;
		display: flex;
		transition: background var(--dur-fast) var(--ease-out);
	}
	.toggle .knob {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--c-surface);
		box-shadow: var(--sh-1);
		transition: transform var(--dur-fast) var(--ease-out);
	}
	.toggle.on {
		background: var(--c-primary);
		border-color: var(--c-primary);
	}
	.toggle.on .knob {
		transform: translateX(20px);
		background: var(--c-primary-ink);
	}
	.about p {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.6;
	}
	.reflink {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--sp-4);
		border: 2px solid var(--c-border-strong);
		border-bottom-width: 4px;
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-weight: 700;
	}
	.reflink .chev {
		color: var(--c-ink-faint);
		font-size: var(--fz-lg);
	}
	.danger {
		margin-top: var(--sp-4);
	}
</style>
