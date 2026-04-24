-- =============================================================================
-- PHASE 1: IDENTITY SYSTEM MIGRATION
-- Run this in your Supabase SQL editor (Dashboard → SQL → New Query).
-- Idempotent: safe to re-run.
-- =============================================================================

-- 1. Extend the existing users table -----------------------------------------
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS primary_world      TEXT,
  ADD COLUMN IF NOT EXISTS quiz_completed_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_name       TEXT,
  ADD COLUMN IF NOT EXISTS bio                TEXT;

-- Make username lookups fast and case-insensitive for /u/<handle> routes.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_unique
  ON users (LOWER(username));

-- 2. World alignment (one row per user) --------------------------------------
CREATE TABLE IF NOT EXISTS world_alignment (
  user_id        UUID         PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  haven_pct      SMALLINT     NOT NULL DEFAULT 0,
  tools_pct      SMALLINT     NOT NULL DEFAULT 0,
  oasis_pct      SMALLINT     NOT NULL DEFAULT 0,
  nexus_pct      SMALLINT     NOT NULL DEFAULT 0,
  primary_world  TEXT         NOT NULL,
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT pct_sum_100 CHECK (
    haven_pct + tools_pct + oasis_pct + nexus_pct BETWEEN 99 AND 101
  )
);

-- 3. Quiz responses (append-only audit log) ----------------------------------
CREATE TABLE IF NOT EXISTS quiz_responses (
  id           BIGSERIAL    PRIMARY KEY,
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_id   UUID         NOT NULL,
  question_id  TEXT         NOT NULL,
  option_id    TEXT         NOT NULL,
  weights      JSONB        NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user    ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_attempt ON quiz_responses(attempt_id);

-- 4. Row-level security ------------------------------------------------------
ALTER TABLE world_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses  ENABLE ROW LEVEL SECURITY;

-- Public profiles need public alignment reads.
DROP POLICY IF EXISTS alignment_public_read ON world_alignment;
CREATE POLICY alignment_public_read
  ON world_alignment FOR SELECT
  USING (true);

DROP POLICY IF EXISTS alignment_self_insert ON world_alignment;
CREATE POLICY alignment_self_insert
  ON world_alignment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS alignment_self_update ON world_alignment;
CREATE POLICY alignment_self_update
  ON world_alignment FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz responses are private to the user.
DROP POLICY IF EXISTS quiz_self_read ON quiz_responses;
CREATE POLICY quiz_self_read
  ON quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS quiz_self_insert ON quiz_responses;
CREATE POLICY quiz_self_insert
  ON quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
