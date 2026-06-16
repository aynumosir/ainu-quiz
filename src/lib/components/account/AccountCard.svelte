<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient, useSession, ensureSession } from '$lib/auth-client';
	import { settings } from '$lib/settings/settings.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const ja = $derived(settings.locale === 'ja');
	const session = useSession();
	const user = $derived($session.data?.user ?? null);
	const isGuest = $derived(!user || (user as { isAnonymous?: boolean }).isAnonymous === true);

	let cfg = $state<{ google: boolean; github: boolean; magicLink: boolean; passwordReset: boolean }>({
		google: false,
		github: false,
		magicLink: false,
		passwordReset: false
	});
	let mode = $state<'create' | 'signin'>('create');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let busy = $state(false);
	let error = $state(''); // failures — shown in danger red
	let notice = $state(''); // informational/success confirmations — shown neutral
	let saved = $state(false);

	onMount(async () => {
		try {
			cfg = await (await fetch('/api/auth-config')).json();
		} catch {
			/* offline */
		}
	});

	$effect(() => {
		if (user && !name) name = user.name && user.name !== 'Anonymous' ? user.name : '';
	});

	async function saveName() {
		if (!name.trim()) return;
		busy = true;
		error = '';
		const r = await authClient.updateUser({ name: name.trim() }).catch((e) => ({ error: e }));
		busy = false;
		if ((r as { error?: unknown }).error) error = String((r as { error?: { message?: string } }).error?.message ?? 'Error');
		else {
			saved = true;
			setTimeout(() => (saved = false), 1500);
		}
	}

	async function claim() {
		if (!email.trim() || !password) return;
		busy = true;
		error = '';
		notice = '';
		const res =
			mode === 'create'
				? await authClient.signUp.email({ email: email.trim(), password, name: name.trim() || 'Learner' })
				: await authClient.signIn.email({ email: email.trim(), password });
		busy = false;
		if (res.error) error = res.error.message ?? 'Sign-in failed';
		else {
			email = '';
			password = '';
			await progress.resync(); // carry guest progress into the account
		}
	}

	async function social(provider: 'google' | 'github') {
		await authClient.signIn.social({ provider, callbackURL: '/profile' });
	}

	// Send a password-reset link. The reply is deliberately the same whether or not
	// the email has an account (better-auth simulates the work for unknown emails),
	// so we never reveal which addresses are registered.
	async function forgot() {
		if (!email.trim()) {
			error = ja ? 'まずメールアドレスを入力してください。' : 'Enter your email first.';
			return;
		}
		busy = true;
		error = '';
		notice = '';
		try {
			const res = await (
				authClient as unknown as {
					requestPasswordReset: (o: {
						email: string;
						redirectTo: string;
					}) => Promise<{ error?: { message?: string } }>;
				}
			).requestPasswordReset({ email: email.trim(), redirectTo: '/reset-password' });
			if (res?.error) {
				error = res.error.message ?? (ja ? '送信に失敗しました。' : 'Could not send the email.');
			} else {
				// Uniform reply whether or not the address has an account (no enumeration).
				notice = ja
					? 'そのメールアドレスのアカウントがあれば、再設定リンクを送りました。メールをご確認ください。'
					: 'If that email has an account, we sent a reset link. Check your inbox.';
			}
		} catch {
			error = ja ? 'ネットワークエラー。あとでお試しください。' : 'Network error — please try again.';
		} finally {
			busy = false;
		}
	}

	async function magic() {
		if (!email.trim()) return;
		busy = true;
		error = '';
		notice = '';
		const res = await (authClient as unknown as {
			signIn: { magicLink: (o: { email: string; callbackURL: string }) => Promise<{ error?: { message?: string } }> };
		}).signIn.magicLink({ email: email.trim(), callbackURL: '/' });
		busy = false;
		if (res.error) error = res.error.message ?? 'Error';
		else notice = ja ? 'リンクを送信しました。メールを確認してください。' : 'Check your email for the link.';
	}

	async function logout() {
		await authClient.signOut();
		// Shared-device safety: clear this device's local progress so the next guest
		// doesn't inherit the signed-out user's data (otherwise resync would merge it).
		progress.wipe();
		await ensureSession(); // fall back to a fresh guest so the app keeps an identity
		await progress.resync();
	}
</script>

<section class="group account">
	<h2>{ja ? 'アカウント' : 'Account'}</h2>

	{#if $session.isPending}
		<p class="muted">…</p>
	{:else if isGuest}
		<p class="muted">
			<span class="badge">{ja ? 'ゲスト' : 'Guest'}</span>
			{ja
				? '進捗を端末間で保存するにはアカウントを作成してください。'
				: 'Create an account to save your progress across devices.'}
		</p>

		<label class="fld">
			<span>{ja ? '表示名（リーダーボード用）' : 'Display name (for leaderboards)'}</span>
			<div class="inline">
				<input bind:value={name} maxlength="24" placeholder={ja ? '名前' : 'name'} />
				<Button onclick={saveName} disabled={busy || !name.trim()}>
					{saved ? (ja ? '保存済み' : 'Saved') : ja ? '保存' : 'Save'}
				</Button>
			</div>
		</label>

		<div class="claim">
			<input
				type="email"
				bind:value={email}
				placeholder={ja ? 'メールアドレス' : 'Email'}
				aria-label={ja ? 'メールアドレス' : 'Email'}
				autocomplete="email"
			/>
			<input
				type="password"
				bind:value={password}
				placeholder={ja ? 'パスワード' : 'Password'}
				aria-label={ja ? 'パスワード' : 'Password'}
				autocomplete={mode === 'create' ? 'new-password' : 'current-password'}
			/>
			<Button full onclick={claim} disabled={busy || !email.trim() || !password}>
				{mode === 'create' ? (ja ? 'アカウントを作成' : 'Create account') : ja ? 'ログイン' : 'Sign in'}
			</Button>
			<button class="link" onclick={() => (mode = mode === 'create' ? 'signin' : 'create')}>
				{mode === 'create'
					? ja
						? 'アカウントをお持ちですか？ ログイン'
						: 'Have an account? Sign in'
					: ja
						? 'アカウントを作成'
						: 'Create an account'}
			</button>
			{#if mode === 'signin' && cfg.passwordReset}
				<button class="link" onclick={forgot} disabled={busy}>
					{ja ? 'パスワードをお忘れですか？' : 'Forgot password?'}
				</button>
			{/if}
		</div>

		{#if cfg.google || cfg.github || cfg.magicLink}
			<div class="sep">{ja ? 'または' : 'or'}</div>
			<div class="socials">
				{#if cfg.google}<Button variant="ghost" onclick={() => social('google')}>Google</Button>{/if}
				{#if cfg.github}<Button variant="ghost" onclick={() => social('github')}>GitHub</Button>{/if}
				{#if cfg.magicLink}<Button variant="ghost" onclick={magic}>{ja ? 'リンクを送る' : 'Email link'}</Button>{/if}
			</div>
		{/if}
	{:else}
		<p class="who">
			<strong>{user?.name || (ja ? '学習者' : 'Learner')}</strong>
			{#if user?.email}<span class="muted">{user.email}</span>{/if}
		</p>
		<label class="fld">
			<span>{ja ? '表示名' : 'Display name'}</span>
			<div class="inline">
				<input bind:value={name} maxlength="24" />
				<Button onclick={saveName} disabled={busy || !name.trim()}>
					{saved ? (ja ? '保存済み' : 'Saved') : ja ? '保存' : 'Save'}
				</Button>
			</div>
		</label>
		<Button variant="ghost" full onclick={logout}>{ja ? 'ログアウト' : 'Sign out'}</Button>
	{/if}

	{#if notice}<p class="notice">{notice}</p>{/if}
	{#if error}<p class="err">{error}</p>{/if}
</section>

<style>
	.account {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.account h2 {
		font-size: var(--fz-md);
		font-weight: 800;
		color: var(--c-primary);
	}
	.muted {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.5;
	}
	.badge {
		display: inline-block;
		font-size: var(--fz-xs);
		font-weight: 800;
		color: var(--c-primary);
		background: var(--c-primary-soft);
		padding: 2px 8px;
		border-radius: var(--r-pill);
		margin-right: 4px;
	}
	.fld span {
		display: block;
		font-size: var(--fz-xs);
		color: var(--c-ink-faint);
		margin-bottom: 4px;
	}
	.inline {
		display: flex;
		gap: var(--sp-2);
	}
	.inline input {
		flex: 1;
	}
	.claim {
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
	.link {
		align-self: flex-start;
		color: var(--c-primary);
		font-size: var(--fz-sm);
		font-weight: 700;
	}
	.sep {
		text-align: center;
		color: var(--c-ink-faint);
		font-size: var(--fz-xs);
	}
	.socials {
		display: flex;
		gap: var(--sp-2);
		flex-wrap: wrap;
	}
	.who {
		font-size: var(--fz-md);
		color: var(--c-ink);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.err {
		color: var(--c-danger);
		font-size: var(--fz-sm);
	}
	.notice {
		color: var(--c-ink-soft);
		font-size: var(--fz-sm);
		line-height: 1.5;
	}
</style>
