<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'success' | 'danger' | 'accent' | 'ghost';

	interface Props {
		variant?: Variant;
		disabled?: boolean;
		/** Uppercase + letter-spaced label (the CHECK/CONTINUE feel). */
		caps?: boolean;
		full?: boolean;
		type?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
		ariaLabel?: string;
		children: Snippet;
	}

	let {
		variant = 'primary',
		disabled = false,
		caps = false,
		full = false,
		type = 'button',
		onclick,
		ariaLabel,
		children
	}: Props = $props();
</script>

<button
	{type}
	class="btn {variant}"
	class:full
	class:caps
	{disabled}
	aria-label={ariaLabel}
	{onclick}
>
	{@render children()}
</button>

<style>
	.btn {
		--btn-bg: var(--c-primary);
		--btn-edge: var(--c-primary-edge);
		--btn-ink: var(--c-primary-ink);

		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		min-height: 50px;
		padding: 0 var(--sp-5);
		border-radius: var(--r-md);
		font-family: var(--ff-ui);
		font-weight: 800;
		font-size: var(--fz-md);
		color: var(--btn-ink);
		background: var(--btn-bg);
		box-shadow: 0 var(--btn-depth) 0 var(--btn-edge);
		margin-bottom: var(--btn-depth);
		transform: translateY(0);
		transition:
			transform var(--dur-fast) var(--ease-out),
			box-shadow var(--dur-fast) var(--ease-out),
			filter var(--dur-fast) var(--ease-out);
	}
	.btn.full {
		width: 100%;
	}
	.btn.caps {
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.btn.primary {
		--btn-bg: var(--c-primary);
		--btn-edge: var(--c-primary-edge);
		--btn-ink: var(--c-primary-ink);
	}
	.btn.success {
		--btn-bg: var(--c-success);
		--btn-edge: var(--c-success-edge);
		--btn-ink: #ffffff;
	}
	.btn.danger {
		--btn-bg: var(--c-danger);
		--btn-edge: var(--c-danger-edge);
		--btn-ink: #ffffff;
	}
	.btn.accent {
		--btn-bg: var(--accent, var(--c-accent));
		--btn-edge: color-mix(in srgb, var(--accent, var(--c-accent)) 75%, #000);
		--btn-ink: var(--accent-ink, var(--c-accent-ink));
	}

	.btn:hover:not(:disabled) {
		filter: brightness(1.04);
	}
	/* the tactile "clunk": face drops, lip collapses to meet the base */
	.btn:active:not(:disabled) {
		transform: translateY(var(--btn-depth));
		box-shadow: 0 0 0 var(--btn-edge);
	}

	/* ghost: flat outline, no depth */
	.btn.ghost {
		background: transparent;
		color: var(--c-ink-soft);
		border: 2px solid var(--c-border-strong);
		box-shadow: none;
		margin-bottom: 0;
		font-weight: 700;
	}
	.btn.ghost:active:not(:disabled) {
		transform: translateY(1px);
		background: var(--c-surface-alt);
	}

	/* disabled MUST be flat + muted (no lip = clearly inert) */
	.btn:disabled {
		--btn-bg: var(--c-surface-sunken);
		--btn-ink: var(--c-ink-faint);
		background: var(--c-surface-sunken);
		color: var(--c-ink-faint);
		box-shadow: none;
		margin-bottom: var(--btn-depth);
		cursor: default;
	}
</style>
