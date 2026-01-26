-- Migration: Create audiobooks and user_favorites tables
-- Date: 2026-01-25
-- Description: Infrastructure for Audiobooks and Real Stories features

-- ============================================
-- TABLE: audiobooks
-- ============================================
CREATE TABLE IF NOT EXISTS audiobooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  narrator TEXT DEFAULT 'LibriVox Volunteer',
  description TEXT,
  
  -- Classification
  category TEXT NOT NULL, -- 'anxiety', 'professional', 'family', 'children', 'sleep', 'relationships', 'health', 'growth'
  tags TEXT[],
  
  -- Audio
  audio_url TEXT NOT NULL, -- URL from Supabase Storage
  duration_minutes INTEGER,
  
  -- Metadata
  source TEXT DEFAULT 'librivox',
  librivox_id TEXT,
  language TEXT DEFAULT 'en',
  is_premium BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_audiobooks_category ON audiobooks(category);
CREATE INDEX IF NOT EXISTS idx_audiobooks_tags ON audiobooks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_audiobooks_featured ON audiobooks(is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE audiobooks ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read audiobooks
CREATE POLICY "Audiobooks are public" 
  ON audiobooks FOR SELECT 
  USING (true);

-- ============================================
-- TABLE: real_stories
-- ============================================
CREATE TABLE IF NOT EXISTS real_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  story_text TEXT NOT NULL, -- 300-500 words
  
  -- Character
  character_name TEXT,
  character_age INTEGER,
  character_role TEXT,
  
  -- Classification
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  
  -- Metadata
  reading_time_minutes INTEGER,
  transformation_theme TEXT,
  related_meditation_id TEXT, -- Link to session_id from sessionsData.ts
  
  -- Engagement
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  
  -- Source
  source_platform TEXT, -- 'quora', 'medium', 'insight_timer'
  source_attribution TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stories_category ON real_stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_tags ON real_stories USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON real_stories(is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE real_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read stories
CREATE POLICY "Stories are public" 
  ON real_stories FOR SELECT 
  USING (true);

-- ============================================
-- TABLE: user_favorites
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'audiobook' or 'story'
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users manage their own favorites
CREATE POLICY "Users manage their favorites" 
  ON user_favorites FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE audiobooks IS 'LibriVox audiobooks catalog organized by life categories';
COMMENT ON TABLE real_stories IS 'Real testimonials and transformation stories for reading';
COMMENT ON TABLE user_favorites IS 'User favorites for audiobooks and stories';
