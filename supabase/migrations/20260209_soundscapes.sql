-- Migration: Soundscapes Table
-- Date: 2026-02-09
-- Description: Table for background music/soundscapes management

CREATE TABLE IF NOT EXISTS soundscapes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  icon TEXT DEFAULT 'leaf',
  color TEXT DEFAULT '#4A6741',
  recommended_for TEXT[],
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE soundscapes ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read Soundscapes" ON soundscapes;
CREATE POLICY "Public Read Soundscapes" ON soundscapes FOR SELECT USING (true);

-- Admin Policy (Assuming service_role is used or similar)
DROP POLICY IF EXISTS "Admin Manage Soundscapes" ON soundscapes;
CREATE POLICY "Admin Manage Soundscapes" ON soundscapes FOR ALL USING (true); -- Simplified for dev
