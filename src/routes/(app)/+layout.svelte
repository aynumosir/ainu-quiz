<script lang="ts">
	import { page } from '$app/state';
	import { BookOpen, Dumbbell, Shield, User, Flame, Gem, Heart } from '@lucide/svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { t } from '$lib/i18n/t';
	import ScriptToggle from '$lib/components/ui/ScriptToggle.svelte';
	import LangToggle from '$lib/components/ui/LangToggle.svelte';
	import Sik from '$lib/components/motif/Sik.svelte';

	let { children } = $props();

	const tabs = [
		{ href: '/', icon: BookOpen, key: 'nav.learn' as const },
		{ href: '/practice', icon: Dumbbell, key: 'nav.practice' as const },
		{ href: '/leagues', icon: Shield, key: 'nav.leagues' as const },
		{ href: '/profile', icon: User, key: 'nav.profile' as const }
	];

	function isActive(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<div class="app">
	<header class="topbar">
		<a class="brand" href="/" aria-label={t('app.name')}>
			<Sik size={20} filled />
		</a>
		<div class="toggles">
			<LangToggle />
			<ScriptToggle />
		</div>
		<div class="stats">
			<a class="stat streak" href="/profile" aria-label={t('stats.streak', { n: progress.streak })}>
				<Flame size={20} />
				<span>{progress.streak}</span>
			</a>
			<a class="stat gem" href="/profile" aria-label={t('stats.gems', { n: progress.gems })}>
				<Gem size={20} />
				<span>{progress.gems}</span>
			</a>
			<a class="stat heart" href="/practice" aria-label={t('stats.hearts', { n: progress.hearts })}>
				<Heart size={20} fill="currentColor" />
				<span>{progress.unlimitedHearts ? '∞' : progress.hearts}</span>
			</a>
		</div>
	</header>

	<main class="content">
		{@render children()}
	</main>

	<nav class="bottomnav" aria-label="Primary">
		{#each tabs as tab (tab.href)}
			{@const Icon = tab.icon}
			<a class="tab" class:active={isActive(tab.href)} href={tab.href} aria-current={isActive(tab.href) ? 'page' : undefined}>
				<Icon size={24} />
				<span>{t(tab.key)}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	.app {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--c-bg);
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: calc(var(--sp-3) + env(safe-area-inset-top, 0px)) var(--sp-4) var(--sp-3);
		background: color-mix(in srgb, var(--c-bg) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--c-border);
	}
	.brand {
		color: var(--c-primary);
		display: inline-flex;
	}
	.toggles {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-width: 0;
	}
	.stats {
		margin-left: auto;
		display: flex;
		gap: var(--sp-3);
		align-items: center;
	}
	.stat {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-weight: 800;
		font-size: var(--fz-sm);
		color: var(--c-ink);
	}
	.stat.streak {
		color: var(--c-warning);
	}
	.stat.streak :global(svg) {
		color: #e8862a;
	}
	.stat.gem :global(svg) {
		color: var(--c-primary);
	}
	.stat.heart :global(svg) {
		color: var(--c-danger);
	}

	.content {
		flex: 1;
		min-height: 0;
	}

	.bottomnav {
		position: sticky;
		bottom: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--sp-1);
		padding: var(--sp-2) var(--sp-2) calc(var(--sp-2) + env(safe-area-inset-bottom, 0px));
		background: var(--c-surface);
		border-top: 1px solid var(--c-border);
	}
	.tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--sp-2) 0;
		border-radius: var(--r-md);
		color: var(--c-ink-faint);
		font-size: var(--fz-xs);
		font-weight: 700;
		transition: color var(--dur-fast) var(--ease-out);
	}
	.tab.active {
		color: var(--c-primary);
		background: var(--c-primary-soft);
	}
</style>
