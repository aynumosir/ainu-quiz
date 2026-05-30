import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { makeDb } from '$lib/server/db';
import { leagueForXp } from '$lib/state/league';

/**
 * Global ranking by total XP. Returns the top players (with display names) plus
 * the caller's own rank if they're below the cut. League tier is derived from
 * total XP (see league.ts). Named accounts show their name; guests show "Guest".
 */
export const GET: RequestHandler = async ({ locals, platform }) => {
	const env = platform?.env;
	if (!env?.TURSO_DATABASE_URL) throw error(503, 'backend unavailable');
	const db = makeDb(env);
	const uid = locals.user?.id ?? null;

	const r = await db.execute(
		`SELECT pm.user_id, pm.xp, u.name, u.isAnonymous
		 FROM player_meta pm JOIN user u ON u.id = pm.user_id
		 WHERE pm.xp > 0 ORDER BY pm.xp DESC LIMIT 50`
	);
	const top = r.rows.map((row, i) => {
		const xp = Number(row.xp);
		const named = !Number(row.isAnonymous) && row.name && row.name !== 'Anonymous';
		return {
			rank: i + 1,
			xp,
			name: named ? (row.name as string) : 'Guest',
			league: leagueForXp(xp),
			isYou: row.user_id === uid
		};
	});

	let you = top.find((x) => x.isYou) ?? null;
	if (!you && uid) {
		const me = await db.execute({ sql: 'SELECT xp FROM player_meta WHERE user_id = ?', args: [uid] });
		if (me.rows[0]) {
			const xp = Number(me.rows[0].xp);
			const ahead = await db.execute({ sql: 'SELECT count(*) AS n FROM player_meta WHERE xp > ?', args: [xp] });
			you = { rank: Number(ahead.rows[0].n) + 1, xp, name: 'You', league: leagueForXp(xp), isYou: true };
		}
	}
	return json({ top, you });
};
