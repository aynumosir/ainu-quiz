<script lang="ts">
	import { onMount } from 'svelte';
	import { Trophy } from '@lucide/svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { LEAGUES, LEAGUES_JA, leagueForXp, nextThreshold } from '$lib/state/league';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';

	const ja = $derived(settings.locale === 'ja');

	interface Row {
		rank: number;
		xp: number;
		name: string;
		league: number;
		isYou: boolean;
	}
	let top = $state<Row[]>([]);
	let you = $state<Row | null>(null);
	let loaded = $state(false);
	let offline = $state(false);

	// fall back to local XP so the league badge always shows something
	const myXp = $derived(you?.xp ?? progress.xp);
	const myLeague = $derived(leagueForXp(myXp));
	const next = $derived(nextThreshold(myXp));
	const leagueName = (i: number) => (ja ? LEAGUES_JA[i] : LEAGUES[i]) ?? LEAGUES[0];

	onMount(async () => {
		try {
			const r = await fetch('/api/leaderboard');
			if (r.ok) {
				const d = await r.json();
				top = d.top ?? [];
				you = d.you ?? null;
			} else offline = true;
		} catch {
			offline = true;
		}
		loaded = true;
	});

	const inTop = $derived(top.some((r) => r.isYou));
</script>

<div class="leagues">
	<header class="lh">
		<span class="cefr">{ja ? 'ランキング' : 'Leaderboard'}</span>
		<h1>
			<Trophy size={22} />
			{leagueName(myLeague)}
		</h1>
		{#if next}
			<p class="toNext">
				{ja
					? `次のリーグまであと ${next - myXp} XP`
					: `${next - myXp} XP to ${leagueName(myLeague + 1)}`}
			</p>
		{:else}
			<p class="toNext">{ja ? '最高リーグ！' : 'Top league!'}</p>
		{/if}
	</header>

	<MoreuRule />

	{#if !loaded}
		<p class="muted">…</p>
	{:else if top.length === 0}
		<p class="muted">
			{ja
				? 'まだ誰もXPを獲得していません。レッスンを始めて1位になろう！'
				: 'No XP yet — start a lesson and claim the top spot!'}
		</p>
	{:else}
		<ol class="board">
			{#each top as r (r.rank)}
				<li class="row" class:you={r.isYou}>
					<span class="rank" class:medal={r.rank <= 3}>{r.rank}</span>
					<span class="name">{r.isYou ? (ja ? 'あなた' : 'You') : r.name}</span>
					<span class="tier">{leagueName(r.league)}</span>
					<span class="xp">{r.xp} XP</span>
				</li>
			{/each}
		</ol>

		{#if you && !inTop}
			<div class="youSep">···</div>
			<ol class="board">
				<li class="row you">
					<span class="rank">{you.rank}</span>
					<span class="name">{ja ? 'あなた' : 'You'}</span>
					<span class="tier">{leagueName(you.league)}</span>
					<span class="xp">{you.xp} XP</span>
				</li>
			</ol>
		{/if}
	{/if}
</div>

<style>
	.leagues {
		max-width: 480px;
		margin: 0 auto;
		padding: var(--sp-5) var(--sp-4) var(--sp-8);
	}
	.lh {
		text-align: center;
		margin-bottom: var(--sp-4);
	}
	.cefr {
		display: inline-block;
		font-size: var(--fz-xs);
		font-weight: 800;
		letter-spacing: 0.12em;
		color: var(--c-primary);
		background: var(--c-primary-soft);
		padding: 2px 10px;
		border-radius: var(--r-pill);
	}
	.lh h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-2xl);
		color: var(--c-ink);
		margin-top: var(--sp-2);
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
	}
	.lh h1 :global(svg) {
		color: var(--c-warning, #e8862a);
	}
	.toNext {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		margin-top: 2px;
	}
	.muted {
		text-align: center;
		color: var(--c-ink-soft);
		padding: var(--sp-6) var(--sp-2);
		line-height: 1.6;
	}
	.board {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		margin-top: var(--sp-4);
	}
	.row {
		display: grid;
		grid-template-columns: 34px 1fr auto auto;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-border);
		border-radius: var(--r-md);
		background: var(--c-surface);
	}
	.row.you {
		border-color: var(--c-primary);
		background: var(--c-primary-soft);
	}
	.rank {
		font-weight: 800;
		color: var(--c-ink-faint);
		text-align: center;
	}
	.rank.medal {
		color: var(--c-warning, #e8862a);
	}
	.name {
		font-weight: 700;
		color: var(--c-ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tier {
		font-size: var(--fz-xs);
		color: var(--c-ink-faint);
	}
	.xp {
		font-weight: 800;
		color: var(--c-primary);
		font-size: var(--fz-sm);
	}
	.youSep {
		text-align: center;
		color: var(--c-ink-faint);
		letter-spacing: 4px;
		padding: var(--sp-2) 0;
	}
</style>
