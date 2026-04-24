-- =============================================================================
-- 4 WORLDS — PHASE 1 SCHEMA (Identity System)
--
-- Run this once on a brand-new Supabase project from the Dashboard:
--   SQL Editor → New Query → paste → Run.
--
-- Idempotent and self-contained: it creates the public.users profile table,
-- wires it to auth.users via a trigger, and adds the alignment + quiz tables
-- with row-level security. Safe to re-run.
-- =============================================================================


-- 1. PUBLIC USERS PROFILE TABLE ----------------------------------------------
--    Mirrors auth.users one-to-one. Created automatically by the trigger
--    below when a new auth user signs up.
CREATE TABLE IF NOT EXISTS public.users (
  id                 UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT         NOT NULL,
  username           TEXT         NOT NULL UNIQUE,
  display_name       TEXT,
  bio                TEXT,
  primary_world      TEXT,
  quiz_completed_at  TIMESTAMPTZ,
  saved_products     JSONB        NOT NULL DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Defensive: if an older version of this table already exists, top it up.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS display_name      TEXT,
  ADD COLUMN IF NOT EXISTS bio               TEXT,
  ADD COLUMN IF NOT EXISTS primary_world     TEXT,
  ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS saved_products    JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Case-insensitive unique handle so /u/<username> resolves regardless of case.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_unique
  ON public.users (LOWER(username));


-- 2. AUTO-CREATE PROFILE ON SIGNUP -------------------------------------------
--    Reads the username out of auth metadata (sent by AuthModal during
--    signUp). Falls back to the email prefix if no username is supplied.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_username TEXT;
BEGIN
  resolved_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, resolved_username)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. WORLD ALIGNMENT (one row per user) --------------------------------------
CREATE TABLE IF NOT EXISTS public.world_alignment (
  user_id        UUID         PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
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


-- 4. QUIZ RESPONSES (append-only audit log) ----------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id           BIGSERIAL    PRIMARY KEY,
  user_id      UUID         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  attempt_id   UUID         NOT NULL,
  question_id  TEXT         NOT NULL,
  option_id    TEXT         NOT NULL,
  weights      JSONB        NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user
  ON public.quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_attempt
  ON public.quiz_responses(attempt_id);


-- 5. ROW-LEVEL SECURITY ------------------------------------------------------
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.world_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses  ENABLE ROW LEVEL SECURITY;

-- users: anyone can read profile basics (powers public /u/:username pages),
-- only the owner can insert or update their own row.
DROP POLICY IF EXISTS users_public_read ON public.users;
DROP POLICY IF EXISTS users_self_insert ON public.users;
DROP POLICY IF EXISTS users_self_update ON public.users;

CREATE POLICY users_public_read ON public.users
  FOR SELECT USING (true);
CREATE POLICY users_self_insert ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- world_alignment: public read so identity cards are shareable, owner writes.
DROP POLICY IF EXISTS alignment_public_read ON public.world_alignment;
DROP POLICY IF EXISTS alignment_self_insert ON public.world_alignment;
DROP POLICY IF EXISTS alignment_self_update ON public.world_alignment;

CREATE POLICY alignment_public_read ON public.world_alignment
  FOR SELECT USING (true);
CREATE POLICY alignment_self_insert ON public.world_alignment
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY alignment_self_update ON public.world_alignment
  FOR UPDATE USING (auth.uid() = user_id);

-- quiz_responses: private to the user.
DROP POLICY IF EXISTS quiz_self_read   ON public.quiz_responses;
DROP POLICY IF EXISTS quiz_self_insert ON public.quiz_responses;

CREATE POLICY quiz_self_read   ON public.quiz_responses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quiz_self_insert ON public.quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
