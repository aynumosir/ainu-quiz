import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** Current identity + admin flag for the client (admin is env-driven server-side). */
export const GET: RequestHandler = ({ locals }) => {
	return json({
		authed: !!locals.user,
		email: locals.user?.email ?? null,
		isAnonymous: (locals.user as { isAnonymous?: boolean } | null)?.isAnonymous ?? false,
		isAdmin: locals.isAdmin ?? false
	});
};
