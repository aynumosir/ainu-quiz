import { createClient, type Client } from '@libsql/client';
import type { AuthEnv } from './auth-options';

/** A libsql client for the app tables (player_meta, node_progress, …). Used in
 *  endpoints with parameterized SQL. better-auth owns its own connection. */
export function makeDb(env: AuthEnv): Client {
	return createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
}

/** ISO week key like "2026-W22" — used to reset weekly_xp on a new week. */
export function weekKey(d = new Date()): string {
	const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	const day = t.getUTCDay() || 7;
	t.setUTCDate(t.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
