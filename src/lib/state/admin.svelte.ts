import { browser } from '$app/environment';

const KEY = 'tu-itak:admin-unlock';

/**
 * Admin state. `isAdmin` is decided server-side (env ADMIN_EMAILS, exposed via
 * /api/me). `unlockAll` is an admin convenience that opens every path node
 * regardless of progression (and re-locks when off) — purely a UI/QA aid, not a
 * security boundary (lesson content is public). Only effective when isAdmin.
 */
class Admin {
	isAdmin = $state(false);
	unlockAll = $state(false);

	constructor() {
		if (!browser) return;
		try {
			this.unlockAll = localStorage.getItem(KEY) === '1';
		} catch {
			/* ignore */
		}
		this.#load();
	}

	async #load() {
		try {
			const r = await fetch('/api/me');
			if (r.ok) this.isAdmin = !!(await r.json()).isAdmin;
		} catch {
			/* offline */
		}
	}

	/** Unlock is in effect only for confirmed admins. */
	get active(): boolean {
		return this.isAdmin && this.unlockAll;
	}

	setUnlockAll(on: boolean) {
		this.unlockAll = on;
		if (browser) {
			try {
				localStorage.setItem(KEY, on ? '1' : '0');
			} catch {
				/* ignore */
			}
		}
	}
}

export const admin = new Admin();
