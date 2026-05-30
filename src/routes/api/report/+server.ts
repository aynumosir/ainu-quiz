import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { makeDb } from '$lib/server/db';

/**
 * "This is incorrect" reports — the learner flags wrong/odd content from a
 * lesson. Rows land in `report` (status 'open') and become the editor review
 * queue (Phase 5). Reporting is allowed for guests too (user_id may be null).
 */
interface Body {
	nodeId?: string;
	sentenceId?: string;
	vocabId?: string;
	exerciseKind?: string;
	userAnswer?: string;
	expected?: string;
	reason?: string;
	note?: string;
	locale?: string;
	dialect?: string;
}

export const POST: RequestHandler = async ({ locals, platform, request }) => {
	const env = platform?.env;
	if (!env?.TURSO_DATABASE_URL) throw error(503, 'backend unavailable');
	const b = (await request.json()) as Body;
	if (!b.reason && !b.note) throw error(400, 'reason required');

	const db = makeDb(env);
	const uid = locals.user?.id ?? null;

	// light rate limit: max 8 reports per user per 10 minutes
	if (uid) {
		const since = Date.now() - 10 * 60_000;
		const r = await db.execute({
			sql: 'SELECT count(*) AS n FROM report WHERE user_id = ? AND created_at > ?',
			args: [uid, since]
		});
		if (Number(r.rows[0]?.n ?? 0) >= 8) throw error(429, 'too many reports, please slow down');
	}

	await db.execute({
		sql: `INSERT INTO report
			(id,user_id,node_id,sentence_id,vocab_id,exercise_kind,user_answer,expected,reason,note,locale,dialect,status,created_at)
			VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'open', ?)`,
		args: [
			crypto.randomUUID(),
			uid,
			b.nodeId ?? null,
			b.sentenceId ?? null,
			b.vocabId ?? null,
			b.exerciseKind ?? null,
			(b.userAnswer ?? '').slice(0, 300) || null,
			(b.expected ?? '').slice(0, 300) || null,
			(b.reason ?? '').slice(0, 60) || null,
			(b.note ?? '').slice(0, 600) || null,
			b.locale ?? null,
			b.dialect ?? null,
			Date.now()
		]
	});
	return json({ ok: true });
};
