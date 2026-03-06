-- Migration: Admin-Only RLS Policies (Security Hardening v2)
-- Date: 2026-03-06
-- Fix: Replace permissive write policies (true-for-all) with admin-only restrictions.
--      The Admin Panel operates as an authenticated Supabase user with role='admin'
--      stored in the public.profiles table.
--      All users can READ content; only admins can INSERT/UPDATE/DELETE.

-- ============================================
-- STEP 1: Helper function is_admin()
-- Uses SECURITY DEFINER to bypass RLS on profiles when checking the role.
-- This avoids circular dependency (RLS on profiles checking a function that reads profiles).
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ============================================
-- STEP 2: meditation_sessions_content
-- ============================================
DROP POLICY IF EXISTS "Authenticated Delete" ON meditation_sessions_content;
DROP POLICY IF EXISTS "Authenticated Insert" ON meditation_sessions_content;
DROP POLICY IF EXISTS "Authenticated Update" ON meditation_sessions_content;

CREATE POLICY "Admin Insert Sessions"
  ON meditation_sessions_content FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin Update Sessions"
  ON meditation_sessions_content FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin Delete Sessions"
  ON meditation_sessions_content FOR DELETE
  USING (is_admin());

-- ============================================
-- STEP 3: audiobooks
-- ============================================
DROP POLICY IF EXISTS "Authenticated Delete" ON audiobooks;
DROP POLICY IF EXISTS "Authenticated Insert" ON audiobooks;
DROP POLICY IF EXISTS "Authenticated Update" ON audiobooks;

CREATE POLICY "Admin Insert Audiobooks"
  ON audiobooks FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin Update Audiobooks"
  ON audiobooks FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin Delete Audiobooks"
  ON audiobooks FOR DELETE
  USING (is_admin());

-- ============================================
-- STEP 4: real_stories
-- ============================================
DROP POLICY IF EXISTS "Public Delete Stories" ON real_stories;
DROP POLICY IF EXISTS "Public Insert Stories" ON real_stories;
DROP POLICY IF EXISTS "Public Update Stories" ON real_stories;

CREATE POLICY "Admin Insert Stories"
  ON real_stories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin Update Stories"
  ON real_stories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin Delete Stories"
  ON real_stories FOR DELETE
  USING (is_admin());

-- ============================================
-- STEP 5: soundscapes
-- ============================================
DROP POLICY IF EXISTS "Admin Manage Soundscapes" ON soundscapes;

-- Public read (anon + authenticated)
DROP POLICY IF EXISTS "Public Read Soundscapes" ON soundscapes;
CREATE POLICY "Public Read Soundscapes"
  ON soundscapes FOR SELECT
  USING (true);

-- Admin write only
CREATE POLICY "Admin Insert Soundscapes"
  ON soundscapes FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin Update Soundscapes"
  ON soundscapes FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin Delete Soundscapes"
  ON soundscapes FOR DELETE
  USING (is_admin());
