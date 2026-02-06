-- Add title and description columns to meditation_sessions_content
ALTER TABLE public.meditation_sessions_content 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Refresh definitions if needed (optional, just ensuring visibility)
COMMENT ON COLUMN public.meditation_sessions_content.title IS 'Human readable title of the session';
COMMENT ON COLUMN public.meditation_sessions_content.description IS 'Brief description or benefits of the session';
