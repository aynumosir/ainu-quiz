import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { makeDb, weekKey } from '$lib/server/db';

/**
 * Server-saved player progress, in the same shape as the client's localStorage
 * `Persisted`. GET returns the stored snapshot; PUT upserts it. PUT uses max()
 * on monotonic fields (xp, weeklyXp, streak, league, crown level, word stats) so
 * a stale device can never regress progress — the client already merges to the
 * most-advanced before pushing, this is defense-in-depth.
 */

interface Snap {
	xp: number;
	gems: number;
	hearts: number;
	heartsTs: number;
	unlimitedHearts: boolean;
	streak: number;
	lastActiveDate: string | null;
	dailyGoal: number;
	todayXp: number;
	todayDate: string | null;
	weeklyXp: number;
	league: number;
	nodes: Record<string, { level: number; legendaryDone?: boolean }>;
	words: Record<string, { strength: number; seen: number; correct: number; lastSeen: number }>;
	mistakes: { sentenceId?: string; vocabId?: string }[];
}

function requireEnv(platform: App.Platform | undefined) {
	const env = platform?.env;
	if (!env?.TURSO_DATABASE_URL) throw error(503, 'backend unavailable');
	return env;
}

export const GET: RequestHandler = async ({ locals, platform }) => {
	if (!locals.user) throw error(401, 'not signed in');
	const db = makeDb(requireEnv(platform));
	const uid = locals.user.id;
	const [meta, nodes, words, mistakes] = await Promise.all([
		db.execute({ sql: 'SELECT * FROM player_meta WHERE user_id = ?', args: [uid] }),
		db.execute({ sql: 'SELECT node_id, level, legendary_done FROM node_progress WHERE user_id = ?', args: [uid] }),
		db.execute({ sql: 'SELECT vocab_id, strength, seen, correct, last_seen FROM word_stat WHERE user_id = ?', args: [uid] }),
		db.execute({ sql: 'SELECT sentence_id, vocab_id FROM mistake WHERE user_id = ?', args: [uid] })
	]);
	const m = meta.rows[0] as Record<string, unknown> | undefined;
	const snap: Snap = {
		xp: Number(m?.xp ?? 0),
		gems: Number(m?.gems ?? 0),
		hearts: Number(m?.hearts ?? 5),
		heartsTs: Number(m?.hearts_ts ?? 0),
		unlimitedHearts: !!Number(m?.unlimited_hearts ?? 0),
		streak: Number(m?.streak ?? 0),
		lastActiveDate: (m?.last_active_date as string) ?? null,
		dailyGoal: Number(m?.daily_goal ?? 20),
		todayXp: Number(m?.today_xp ?? 0),
		todayDate: (m?.today_date as string) ?? null,
		weeklyXp: Number(m?.weekly_xp ?? 0),
		league: Number(m?.league ?? 0),
		nodes: Object.fromEntries(
			nodes.rows.map((r) => [r.node_id as string, { level: Number(r.level), legendaryDone: !!Number(r.legendary_done) }])
		),
		words: Object.fromEntries(
			words.rows.map((r) => [
				r.vocab_id as string,
				{ strength: Number(r.strength), seen: Number(r.seen), correct: Number(r.correct), lastSeen: Number(r.last_seen) }
			])
		),
		mistakes: mistakes.rows.map((r) => ({
			sentenceId: (r.sentence_id as string) || undefined,
			vocabId: (r.vocab_id as string) || undefined
		}))
	};
	return json(snap);
};

export const PUT: RequestHandler = async ({ locals, platform, request }) => {
	if (!locals.user) throw error(401, 'not signed in');
	const db = makeDb(requireEnv(platform));
	const uid = locals.user.id;
	const s = (await request.json()) as Snap;
	const now = Date.now();

	const stmts: { sql: string; args: (string | number | null)[] }[] = [
		{
			sql: `INSERT INTO player_meta
				(user_id,xp,gems,hearts,hearts_ts,unlimited_hearts,streak,last_active_date,daily_goal,today_xp,today_date,weekly_xp,week_key,league,updated_at)
				VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
				ON CONFLICT(user_id) DO UPDATE SET
					xp=max(xp,excluded.xp), gems=max(gems,excluded.gems),
					hearts=excluded.hearts, hearts_ts=excluded.hearts_ts,
					unlimited_hearts=max(unlimited_hearts,excluded.unlimited_hearts),
					streak=max(streak,excluded.streak), last_active_date=excluded.last_active_date,
					daily_goal=excluded.daily_goal, today_xp=excluded.today_xp, today_date=excluded.today_date,
					weekly_xp=max(weekly_xp,excluded.weekly_xp), week_key=excluded.week_key,
					league=max(league,excluded.league), updated_at=excluded.updated_at`,
			args: [
				uid, s.xp | 0, s.gems | 0, s.hearts | 0, s.heartsTs | 0, s.unlimitedHearts ? 1 : 0,
				s.streak | 0, s.lastActiveDate, s.dailyGoal | 0, s.todayXp | 0, s.todayDate,
				s.weeklyXp | 0, weekKey(), s.league | 0, now
			]
		}
	];
	for (const [nodeId, n] of Object.entries(s.nodes ?? {})) {
		stmts.push({
			sql: `INSERT INTO node_progress (user_id,node_id,level,legendary_done) VALUES (?,?,?,?)
				ON CONFLICT(user_id,node_id) DO UPDATE SET
					level=max(level,excluded.level), legendary_done=max(legendary_done,excluded.legendary_done)`,
			args: [uid, nodeId, n.level | 0, n.legendaryDone ? 1 : 0]
		});
	}
	for (const [vocabId, w] of Object.entries(s.words ?? {})) {
		stmts.push({
			sql: `INSERT INTO word_stat (user_id,vocab_id,strength,seen,correct,last_seen) VALUES (?,?,?,?,?,?)
				ON CONFLICT(user_id,vocab_id) DO UPDATE SET
					strength=max(strength,excluded.strength), seen=max(seen,excluded.seen),
					correct=max(correct,excluded.correct), last_seen=max(last_seen,excluded.last_seen)`,
			args: [uid, vocabId, w.strength ?? 0, w.seen | 0, w.correct | 0, w.lastSeen | 0]
		});
	}
	// mistakes: the snapshot is authoritative (they get cleared) → replace.
	stmts.push({ sql: 'DELETE FROM mistake WHERE user_id = ?', args: [uid] });
	for (const mk of s.mistakes ?? []) {
		const ref = mk.sentenceId ?? mk.vocabId;
		if (!ref) continue;
		stmts.push({
			sql: 'INSERT OR IGNORE INTO mistake (user_id,ref,sentence_id,vocab_id,created_at) VALUES (?,?,?,?,?)',
			args: [uid, ref, mk.sentenceId ?? null, mk.vocabId ?? null, now]
		});
	}
	await db.batch(stmts, 'write');
	return json({ ok: true });
};
