<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { course, flatNodes } from '$lib/content';
	import { loc, type CourseNode } from '$lib/content/types';
	import { progress } from '$lib/state/progress.svelte';
	import { admin } from '$lib/state/admin.svelte';
	import { settings } from '$lib/settings/settings.svelte';
	import { accentStyle } from '$lib/design/accents';
	import { t } from '$lib/i18n/t';
	import PathNode from '$lib/components/path/PathNode.svelte';
	import MoreuRule from '$lib/components/motif/MoreuRule.svelte';

	const nodes = flatNodes();
	const gindex = new Map(nodes.map((f) => [f.node.id, f.globalIndex]));

	const frontierId = $derived.by(() => {
		for (const f of nodes) {
			if (!progress.isCrowned(f.node.id, f.node.levels ?? 1)) return f.node.id;
		}
		return null;
	});

	function stateFor(node: CourseNode): 'done' | 'active' | 'locked' {
		if (progress.isCrowned(node.id, node.levels ?? 1)) return 'done';
		return node.id === frontierId ? 'active' : 'locked';
	}

	function labelFor(node: CourseNode): string {
		if (node.type === 'review' || node.type === 'practice') return t('path.review');
		if (progress.nodeLevel(node.id) > 0) return t('path.continue');
		return t('path.start');
	}

	function startNode(node: CourseNode) {
		if (stateFor(node) === 'locked' && !admin.active) return;
		goto(`/lesson/${node.id}`);
	}

	// Center the newest undone (active/frontier) node — or the end if the course
	// is fully crowned. Used on load/refresh and whenever the frontier advances.
	function scrollToActive(behavior: ScrollBehavior) {
		const el =
			document.getElementById('active-node') ??
			(document.querySelector('.end') as HTMLElement | null);
		el?.scrollIntoView({ block: 'center', behavior });
	}

	let mounted = false;

	onMount(async () => {
		await tick();
		// Wait for fonts so layout has settled, and run after a frame so our scroll
		// wins over the browser's reload scroll-restoration; otherwise the active
		// node ends up off-screen after a refresh.
		try {
			await document.fonts.ready;
		} catch {
			/* not supported — proceed */
		}
		requestAnimationFrame(() => {
			scrollToActive('instant');
			mounted = true;
		});
	});

	// Re-center if the frontier moves while the path is open (e.g. progress changes).
	$effect(() => {
		const id = frontierId;
		if (mounted && id) requestAnimationFrame(() => scrollToActive('smooth'));
	});
</script>

<div class="path">
	{#each course.sections as section (section.id)}
		<div class="section-head">
			<span class="cefr">{section.cefr}</span>
			<h1>{loc(section.title, settings.locale)}</h1>
		</div>

		{#each section.units as unit, ui (unit.id)}
			<section class="unit" style={accentStyle(unit.accent)}>
				<header class="unit-head">
					<div>
						<p class="unit-label">{loc(unit.label, settings.locale)}</p>
						<h2>{loc(unit.title, settings.locale)}</h2>
					</div>
				</header>

				<div class="nodes">
					{#each unit.nodes as node (node.id)}
						{@const st = stateFor(node)}
						<div class="slot" id={st === 'active' ? 'active-node' : undefined}>
							<PathNode
								{node}
								state={st}
								level={progress.nodeLevel(node.id)}
								legendaryDone={progress.legendaryDone(node.id)}
								offset={Math.round(Math.sin((gindex.get(node.id) ?? 0) * 0.9) * 54)}
								startLabel={labelFor(node)}
								adminUnlock={admin.active}
								onstart={() => startNode(node)}
							/>
						</div>
					{/each}
				</div>
			</section>
			{#if ui < section.units.length - 1}
				<div class="divider"><MoreuRule /></div>
			{/if}
		{/each}
	{/each}

	<div class="end">
		<MoreuRule />
		<p>{settings.locale === 'ja' ? 'もっと近日公開' : 'More coming soon'}</p>
	</div>
</div>

<style>
	.path {
		max-width: 480px;
		margin: 0 auto;
		padding: var(--sp-4) var(--sp-4) var(--sp-8);
	}

	.section-head {
		text-align: center;
		margin: var(--sp-4) 0 var(--sp-5);
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
	.section-head h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-xl);
		margin-top: var(--sp-2);
		color: var(--c-ink);
	}

	.unit-head {
		position: sticky;
		top: 60px;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		background: var(--accent);
		color: var(--accent-ink);
		padding: var(--sp-3) var(--sp-4);
		border-radius: var(--r-lg);
		box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 70%, #000);
		margin-bottom: var(--sp-5);
	}
	.unit-label {
		font-size: var(--fz-xs);
		font-weight: 700;
		opacity: 0.85;
		letter-spacing: 0.06em;
	}
	.unit-head h2 {
		color: var(--accent-ink);
		font-size: var(--fz-lg);
		font-family: var(--ff-ui);
	}
	.nodes {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-4);
		/* Room above the first node so its floating START bubble clears the
		   sticky unit header instead of being covered by it. */
		padding-top: var(--sp-6);
		padding-bottom: var(--sp-5);
	}
	.slot {
		scroll-margin-top: 120px;
	}

	.divider {
		padding: var(--sp-2) var(--sp-5) var(--sp-6);
	}
	.end {
		text-align: center;
		color: var(--c-ink-faint);
		font-size: var(--fz-sm);
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
		align-items: center;
		padding-top: var(--sp-4);
	}
</style>
