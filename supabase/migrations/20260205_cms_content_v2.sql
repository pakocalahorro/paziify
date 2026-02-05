-- Migration: CMS Content V2
-- Date: 2026-02-05
-- Description: Unified content architecture for Sessions, Audiobooks, and Stories (V2 Schema)

-- Ensure UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. MEDITATION SESSIONS (The Core)
-- ============================================
CREATE TABLE IF NOT EXISTS meditation_sessions_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  legacy_id TEXT UNIQUE NOT NULL, -- "anx_478"
  slug TEXT UNIQUE,               -- "box-breathing-anxiety"
  
  -- Core Info
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  
  -- Classification
  category TEXT NOT NULL,         -- "calmasos", "rendimiento", etc.
  mood_tags TEXT[],               -- ["anxiety", "panic"]
  time_of_day TEXT,               -- "morning", "night"
  difficulty_level TEXT,          -- "beginner"
  
  -- Access & Stats
  is_premium BOOLEAN DEFAULT false,
  is_technical BOOLEAN DEFAULT false, -- For tutorials
  
  -- Media Resources
  voice_url TEXT,                 -- URL to main MP3
  thumbnail_url TEXT,             -- URL to main Image
  
  -- Configuration (JSONB for flexibility)
  audio_config JSONB,     -- { defaultBinaural, defaultSoundscape, volumeBalance }
  breathing_config JSONB, -- { inhale, hold, exhale, holdPost }
  metadata JSONB,         -- { custom_color, visual_sync_enabled, creator_credentials }
  
  -- Creator
  creator_name TEXT, 
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_legacy ON meditation_sessions_content(legacy_id);
CREATE INDEX IF NOT EXISTS idx_sessions_category ON meditation_sessions_content(category);
CREATE INDEX IF NOT EXISTS idx_sessions_tags ON meditation_sessions_content USING GIN(mood_tags);
CREATE INDEX IF NOT EXISTS idx_sessions_premium ON meditation_sessions_content(is_premium);

-- RLS
ALTER TABLE meditation_sessions_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON meditation_sessions_content;

CREATE POLICY "Public Read Access" 
  ON meditation_sessions_content FOR ALL 
  USING (true);

-- ============================================
-- 2. AUDIOBOOKS (Re-creation for V2)
-- ============================================
-- Safe drop since data is currently hardcoded in app
DROP TABLE IF EXISTS audiobooks CASCADE;

CREATE TABLE audiobooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Info
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  narrator TEXT,
  description TEXT,
  
  -- Classification
  category TEXT NOT NULL,
  tags TEXT[],
  language TEXT DEFAULT 'en',
  
  -- Media
  audio_url TEXT,
  cover_url TEXT,
  duration_minutes INTEGER,
  
  -- Access
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audiobooks_category ON audiobooks(category);
CREATE INDEX idx_audiobooks_author ON audiobooks(author);
CREATE INDEX idx_audiobooks_tags ON audiobooks USING GIN(tags);

-- RLS
ALTER TABLE audiobooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Audiobooks" ON audiobooks;
CREATE POLICY "Public Read Audiobooks" ON audiobooks FOR ALL USING (true);


-- ============================================
-- 3. REAL STORIES (Re-creation for V2)
-- ============================================
DROP TABLE IF EXISTS real_stories CASCADE;

CREATE TABLE real_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Info
  title TEXT NOT NULL,
  subtitle TEXT,
  story_text TEXT NOT NULL, -- Markdown content
  
  -- Classification
  category TEXT NOT NULL,
  tags TEXT[],
  
  -- Metadata
  reading_time_minutes INTEGER,
  character_profile JSONB, -- { name, age, role, avatar_url }
  
  -- Media
  cover_url TEXT,
  related_meditation_id UUID REFERENCES meditation_sessions_content(id),
  
  -- Access
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_category ON real_stories(category);
CREATE INDEX idx_stories_tags ON real_stories USING GIN(tags);

-- RLS
ALTER TABLE real_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Stories" ON real_stories;
CREATE POLICY "Public Read Stories" ON real_stories FOR ALL USING (true);

-- ============================================
-- 4. USER FAVORITES (Polymorphic)
-- ============================================
-- Ensure table exists (might be from previous migration), if not create it.
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'audiobook', 'story', 'session'
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to avoid conflict when re-running
DROP POLICY IF EXISTS "Users manage their favorites" ON user_favorites;

CREATE POLICY "Users manage their favorites" 
  ON user_favorites FOR ALL 
  USING (auth.uid() = user_id);
