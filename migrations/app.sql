-- App tables (keyed by better-auth user.id). better-auth's own tables
-- (user, session, account, verification, anonymous fields, role) are created by
-- getMigrations() in scripts/migrate.ts; this file holds only our domain tables.

CREATE TABLE IF NOT EXISTS player_meta (
  user_id          TEXT PRIMARY KEY,
  display_name     TEXT,
  xp               INTEGER NOT NULL DEFAULT 0,
  gems             INTEGER NOT NULL DEFAULT 0,
  hearts           INTEGER NOT NULL DEFAULT 5,
  hearts_ts        INTEGER NOT NULL DEFAULT 0,
  unlimited_hearts INTEGER NOT NULL DEFAULT 0,
  streak           INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  daily_goal       INTEGER NOT NULL DEFAULT 20,
  today_xp         INTEGER NOT NULL DEFAULT 0,
  today_date       TEXT,
  weekly_xp        INTEGER NOT NULL DEFAULT 0,
  week_key         TEXT,
  league           INTEGER NOT NULL DEFAULT 0,
  updated_at       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_player_week ON player_meta (week_key, weekly_xp);

CREATE TABLE IF NOT EXISTS node_progress (
  user_id        TEXT NOT NULL,
  node_id        TEXT NOT NULL,
  level          INTEGER NOT NULL DEFAULT 0,
  legendary_done INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, node_id)
);

CREATE TABLE IF NOT EXISTS word_stat (
  user_id   TEXT NOT NULL,
  vocab_id  TEXT NOT NULL,
  strength  REAL NOT NULL DEFAULT 0.3,
  seen      INTEGER NOT NULL DEFAULT 0,
  correct   INTEGER NOT NULL DEFAULT 0,
  last_seen INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, vocab_id)
);

CREATE TABLE IF NOT EXISTS mistake (
  user_id     TEXT NOT NULL,
  ref         TEXT NOT NULL, -- sentenceId or vocabId
  sentence_id TEXT,
  vocab_id    TEXT,
  created_at  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, ref)
);

CREATE TABLE IF NOT EXISTS report (
  id              TEXT PRIMARY KEY,
  user_id         TEXT,
  node_id         TEXT,
  sentence_id     TEXT,
  vocab_id        TEXT,
  exercise_kind   TEXT,
  user_answer     TEXT,
  expected        TEXT,
  reason          TEXT,
  note            TEXT,
  locale          TEXT,
  dialect         TEXT,
  status          TEXT NOT NULL DEFAULT 'open',
  resolver_id     TEXT,
  resolution_note TEXT,
  created_at      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_report_status ON report (status, created_at);
