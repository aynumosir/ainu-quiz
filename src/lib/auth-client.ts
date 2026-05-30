import { createAuthClient } from 'better-auth/svelte';
import { anonymousClient } from 'better-auth/client/plugins';

/**
 * Browser auth client. baseURL is the current origin (+/api/auth by default),
 * matching the server's request-origin inference. `useSession` is a reactive
 * Svelte store. Guest-first: see `ensureSession()`.
 */
export const authClient = createAuthClient({
	plugins: [anonymousClient()]
});

export const { useSession, signIn, signOut, signUp, updateUser } = authClient;

let ensuring: Promise<unknown> | null = null;

/** Make sure a session exists — sign in anonymously on first ever visit. Safe to
 *  call repeatedly; best-effort (no-ops/offline if the backend is unavailable). */
export async function ensureSession(): Promise<void> {
	if (ensuring) {
		await ensuring;
		return;
	}
	ensuring = (async () => {
		try {
			const { data } = await authClient.getSession();
			if (!data) await authClient.signIn.anonymous();
		} catch {
			/* backend offline — app continues with localStorage only */
		}
	})();
	await ensuring;
	ensuring = null;
}
