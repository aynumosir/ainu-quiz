import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { authOptions, type AuthEnv } from './auth-options';

/**
 * Build a better-auth instance for the current request. Cloudflare Worker
 * bindings/env are NOT global, so this is a per-request factory called from
 * hooks + endpoints with `event.platform.env`. Adds the SvelteKit cookie plugin
 * on top of the shared `authOptions`.
 */
export function createAuth(env: AuthEnv) {
	const opts = authOptions(env);
	return betterAuth({
		...opts,
		plugins: [...(opts.plugins ?? []), sveltekitCookies(getRequestEvent)]
	});
}

export type { AuthEnv };
