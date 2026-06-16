<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { settings } from '$lib/settings/settings.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const ja = $derived(settings.locale === 'ja');

	// better-auth redirects the email link here as ?token=… (valid) or
	// ?error=INVALID_TOKEN (expired / already used).
	const token = $derived(page.url.searchParams.get('token'));
	const linkError = $derived(page.url.searchParams.get('error'));

	const MIN = 8;
	let password = $state('');
	let confirm = $state('');
	let busy = $state(false);
	let error = $state('');
	let done = $state(false);
	let invalid = $state(false); // token rejected at submit time (expired / already used)

	const tooShort = $derived(password.length > 0 && password.length < MIN);
	const mismatch = $derived(confirm.length > 0 && confirm !== password);
	const canSubmit = $derived(!!token && password.length >= MIN && confirm === password && !busy);

	async function submit() {
		if (!canSubmit || !token) return;
		busy = true;
		error = '';
		const res = await (
			authClient as unknown as {
				resetPassword: (o: {
					newPassword: string;
					token: string;
				}) => Promise<{ error?: { message?: string; code?: string } }>;
			}
		).resetPassword({ newPassword: password, token });
		busy = false;
		if (res.error) {
			// The token can expire or be consumed between page load and submit — show the
			// actionable "request a new link" state instead of a terse inline error.
			const msg = res.error.message ?? '';
			if (res.error.code === 'INVALID_TOKEN' || /token|expire/i.test(msg)) invalid = true;
			else error = msg || (ja ? '再設定に失敗しました。' : 'Reset failed.');
		} else {
			done = true;
			setTimeout(() => goto('/profile'), 1600);
		}
	}
</script>

<div class="wrap">
	<section class="card">
		<h1>{ja ? 'パスワードの再設定' : 'Reset your password'}</h1>

		{#if done}
			<p class="ok">
				{ja ? 'パスワードを変更しました。ログインしてください…' : 'Password updated — please sign in…'}
			</p>
		{:else if !token || linkError || invalid}
			<p class="muted">
				{ja
					? 'このリンクは無効か、有効期限が切れています。もう一度お試しください。'
					: 'This link is invalid or has expired. Please request a new one.'}
			</p>
			<Button full onclick={() => goto('/profile')}>{ja ? 'プロフィールへ' : 'Go to profile'}</Button>
		{:else}
			<p class="muted">
				{ja ? '新しいパスワードを入力してください。' : 'Choose a new password.'}
			</p>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<input
					type="password"
					bind:value={password}
					placeholder={ja ? '新しいパスワード' : 'New password'}
					aria-label={ja ? '新しいパスワード' : 'New password'}
					autocomplete="new-password"
					minlength={MIN}
				/>
				<input
					type="password"
					bind:value={confirm}
					placeholder={ja ? 'もう一度入力' : 'Confirm password'}
					aria-label={ja ? 'パスワードの確認' : 'Confirm password'}
					autocomplete="new-password"
					minlength={MIN}
				/>
				{#if tooShort}
					<p class="hint">{ja ? `${MIN}文字以上にしてください。` : `Use at least ${MIN} characters.`}</p>
				{:else if mismatch}
					<p class="hint">{ja ? 'パスワードが一致しません。' : "Passwords don't match."}</p>
				{/if}
				<Button full type="submit" disabled={!canSubmit}>
					{ja ? 'パスワードを変更' : 'Set new password'}
				</Button>
			</form>
		{/if}

		{#if error}<p class="err">{error}</p>{/if}
	</section>
</div>

<style>
	.wrap {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: var(--sp-4);
		background: var(--c-bg);
	}
	.card {
		width: 100%;
		max-width: 380px;
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
		padding: var(--sp-5);
		background: var(--c-surface);
		border: 2px solid var(--c-border);
		border-radius: var(--r-lg);
	}
	h1 {
		font-family: var(--ff-display);
		font-size: var(--fz-lg);
		color: var(--c-ink);
	}
	.muted {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.5;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}
	input {
		width: 100%;
		padding: 10px 12px;
		border: 2px solid var(--c-border-strong);
		border-radius: var(--r-md);
		background: var(--c-surface);
		color: var(--c-ink);
		font-size: var(--fz-md);
	}
	.hint {
		font-size: var(--fz-xs);
		color: var(--c-ink-faint);
	}
	.ok {
		color: var(--c-primary);
		font-weight: 700;
		font-size: var(--fz-sm);
	}
	.err {
		color: var(--c-danger);
		font-size: var(--fz-sm);
	}
</style>
