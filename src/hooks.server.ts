import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { createAuth } from '$lib/server/auth';
import { isAdminEmail } from '$lib/server/admin';

/**
 * Mounts better-auth (it intercepts /api/auth/* itself) and populates
 * `locals.user`/`locals.session`. If the backend env is absent (e.g. a plain
 * build, or `vite dev` without the platform proxy), we degrade gracefully to
 * the offline/localStorage-only behaviour the app had before.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const env = event.platform?.env;
	if (!env?.TURSO_DATABASE_URL || !env?.BETTER_AUTH_SECRET) {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.isAdmin = false;
		return resolve(event);
	}

	const auth = createAuth(env);
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });
		event.locals.user = session?.user ?? null;
		event.locals.session = session?.session ?? null;
		event.locals.isAdmin = isAdminEmail(session?.user?.email, env.ADMIN_EMAILS);
	} catch {
		event.locals.user = null;
		event.locals.session = null;
		event.locals.isAdmin = false;
	}
	return svelteKitHandler({ event, resolve, auth, building });
};
