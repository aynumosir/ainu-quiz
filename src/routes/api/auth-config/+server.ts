import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** Which optional sign-in methods are configured (creds present in env), so the
 *  account UI only shows buttons that actually work. */
export const GET: RequestHandler = ({ platform }) => {
	const env = platform?.env;
	return json({
		emailPassword: true,
		anonymous: true,
		google: !!(env?.GOOGLE_CLIENT_ID && env?.GOOGLE_CLIENT_SECRET),
		github: !!(env?.GITHUB_CLIENT_ID && env?.GITHUB_CLIENT_SECRET),
		magicLink: !!env?.RESEND_API_KEY
	});
};
