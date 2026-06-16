import type { BetterAuthOptions } from 'better-auth';
import { anonymous, magicLink } from 'better-auth/plugins';
import { LibsqlDialect } from '@libsql/kysely-libsql';

/** Backend env (from `event.platform.env` in the Worker, or .dev.vars locally). */
export interface AuthEnv {
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN?: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	RESEND_API_KEY?: string;
}

/**
 * better-auth options, with NO SvelteKit-only imports so this can be reused by
 * the migration script (`scripts/migrate.ts`). The SvelteKit cookie plugin is
 * layered on in `auth.ts`. Social providers + magic link are only enabled when
 * their credentials are present in env, so they light up the moment creds are
 * supplied — no code change.
 */
export function authOptions(env: AuthEnv): BetterAuthOptions {
	const socialProviders: NonNullable<BetterAuthOptions['socialProviders']> = {};
	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
		socialProviders.google = {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET
		};
	if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)
		socialProviders.github = {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		};

	const plugins: NonNullable<BetterAuthOptions['plugins']> = [anonymous()];
	if (env.RESEND_API_KEY) {
		plugins.push(
			magicLink({
				sendMagicLink: async ({ email, url }) => {
					await fetch('https://api.resend.com/emails', {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${env.RESEND_API_KEY}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							from: 'tu itak re itak <login@aynu.org>',
							to: email,
							subject: 'Your sign-in link — tu itak re itak',
							html: `<p>irankarapte! Tap to sign in:</p><p><a href="${url}">${url}</a></p>`
						})
					});
				}
			})
		);
	}

	return {
		appName: 'tu itak re itak',
		secret: env.BETTER_AUTH_SECRET,
		// No fixed baseURL: it's inferred from the request origin, so the same
		// build works on any dev port AND on quiz.aynu.org. CSRF is guarded by
		// trustedOrigins below. (A hardcoded baseURL whose origin ≠ the request
		// origin makes better-auth treat /api/auth/* as NOT an auth path → 404.)
		database: {
			dialect: new LibsqlDialect({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN }),
			type: 'sqlite'
		},
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			// A reset is usually triggered because someone else has access — so kill all
			// of the user's existing sessions when the password changes.
			revokeSessionsOnPasswordReset: true,
			// Password recovery. Like the magic link this needs Resend; when
			// RESEND_API_KEY is absent the handler is undefined and reset requests
			// error out — the account UI hides "Forgot password?" in that case
			// (gated on /api/auth-config's `passwordReset`).
			sendResetPassword: env.RESEND_API_KEY
				? async ({ user, url }: { user: { email: string }; url: string }) => {
						await fetch('https://api.resend.com/emails', {
							method: 'POST',
							headers: {
								Authorization: `Bearer ${env.RESEND_API_KEY}`,
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								from: 'tu itak re itak <login@aynu.org>',
								to: user.email,
								subject: 'Reset your password — tu itak re itak',
								html: `<p>irankarapte! Tap to choose a new password:</p><p><a href="${url}">${url}</a></p><p>If you didn't ask for this, you can ignore this email.</p>`
							})
						});
					}
				: undefined
		},
		socialProviders,
		user: {
			additionalFields: {
				role: { type: 'string', required: false, defaultValue: 'learner', input: false }
			}
		},
		plugins,
		trustedOrigins: ['https://quiz.aynu.org', 'http://localhost:5173', 'http://localhost:8787']
	};
}
