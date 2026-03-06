-- Migration: RLS Security Hardening
-- Date: 2026-03-06
-- Fix: Change FOR ALL to FOR SELECT on public content tables.
-- Reason: FOR ALL allows INSERT/UPDATE/DELETE from any client holding the anon key,
--         which is embedded in the APK and therefore publicly accessible.
--         Public content tables should only be readable by anonymous clients.

-- ============================================
-- 1. meditation_sessions_content
-- ============================================
DROP POLICY IF EXISTS "Public Read Access" ON meditation_sessions_content;

CREATE POLICY "Public Read Access"
  ON meditation_sessions_content FOR SELECT
  USING (true);

-- ============================================
-- 2. audiobooks
-- ============================================
DROP POLICY IF EXISTS "Public Read Audiobooks" ON audiobooks;
DROP POLICY IF EXISTS "Audiobooks are public" ON audiobooks;

CREATE POLICY "Public Read Audiobooks"
  ON audiobooks FOR SELECT
  USING (true);

-- ============================================
-- 3. real_stories
-- ============================================
DROP POLICY IF EXISTS "Public Read Stories" ON real_stories;
DROP POLICY IF EXISTS "Stories are public" ON real_stories;

CREATE POLICY "Public Read Stories"
  ON real_stories FOR SELECT
  USING (true);

-- ============================================
-- 4. Índice compuesto en meditation_logs (bonus: M-4)
--    Acelera las queries de getWeeklyActivity y getMonthlyActivity.
-- ============================================
CREATE INDEX IF NOT EXISTS idx_logs_user_date
  ON meditation_logs(user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_type
  ON user_favorites(user_id, content_type);
