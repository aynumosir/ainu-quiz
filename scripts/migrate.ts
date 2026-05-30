/**
 * Apply the database schema to Turso.
 *   bun scripts/migrate.ts
 *
 * 1. better-auth core + plugin tables via getMigrations() (matches the exact
 *    schema better-auth's kysely adapter expects).
 * 2. our app tables from migrations/app.sql.
 *
 * Reads creds from .dev.vars (or the process env). For production, point
 * TURSO_DATABASE_URL/TOKEN at the same remote DB (Turso has one DB for both).
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@libsql/client';
import { getMigrations } from 'better-auth/db/migration';
import { authOptions, type AuthEnv } from '../src/lib/server/auth-options';

function loadDevVars() {
	const path = new URL('../.dev.vars', import.meta.url);
	if (!existsSync(path)) return;
	for (const line of readFileSync(path, 'utf8').split('\n')) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
	}
}
loadDevVars();

const env: AuthEnv = {
	TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
	TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? 'migrate-only-secret'
};
if (!env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL missing (set .dev.vars)');

console.log('→ better-auth schema (getMigrations)…');
const { runMigrations, toBeCreated, toBeAdded } = await getMigrations(authOptions(env));
console.log(
	'  tables to create:',
	toBeCreated.map((t: { table: string }) => t.table).join(', ') || '(none / up to date)'
);
if (toBeAdded?.length)
	console.log('  columns to add:', toBeAdded.map((t: { table: string }) => t.table).join(', '));
await runMigrations();
console.log('  ✓ better-auth tables ready');

console.log('→ app tables (migrations/app.sql)…');
const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
const sql = readFileSync(new URL('../migrations/app.sql', import.meta.url), 'utf8');
const statements = sql
	.replace(/--[^\n]*/g, '') // strip line comments first (they may contain ';')
	.split(';')
	.map((s) => s.trim())
	.filter(Boolean);
for (const stmt of statements) await client.execute(stmt);
console.log(`  ✓ ${statements.length} app statements applied`);
console.log('done.');
