-- Add resilience_light and last_meditation_date to profiles for the new Gamified Tree System
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS resilience_light INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_meditation_date TIMESTAMPTZ;

-- Backfill resilience_light with the legacy resilience_score if the user has points but light is 0
-- This acts as the fallback mechanism so veteran users don't start at Level 1
UPDATE profiles
SET resilience_light = resilience_score
WHERE resilience_light = 0 AND resilience_score > 0;
