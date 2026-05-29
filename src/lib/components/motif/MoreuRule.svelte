<script lang="ts">
	// A horizontal divider: thin rules flanking a centred sik with two small moreu
	// hooks — ornament that frames a threshold (section/unit breaks), per the
	// edge-framing principle. Keep it sparse.
	interface Props {
		class?: string;
	}
	let { class: klass = '' }: Props = $props();
</script>

<div class="rule {klass}" role="presentation" aria-hidden="true">
	<span class="line"></span>
	<svg width="64" height="20" viewBox="0 0 64 20" fill="none">
		<path
			d="M4 10 C 14 10 18 4 24 6 C 28 7.3 28 11 25 11.6"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			fill="none"
		/>
		<path
			d="M60 10 C 50 10 46 4 40 6 C 36 7.3 36 11 39 11.6"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			fill="none"
		/>
		<path d="M32 4 C 33.6 6 33.6 14 32 16 C 30.4 14 30.4 6 32 4Z" fill="currentColor" />
	</svg>
	<span class="line"></span>
</div>

<style>
	.rule {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		color: var(--c-border-strong);
		width: 100%;
	}
	.line {
		flex: 1;
		height: 2px;
		border-radius: 2px;
		background: currentColor;
		opacity: 0.5;
	}
	svg {
		flex: none;
	}
</style>
