-- Create Academy Modules Table
CREATE TABLE IF NOT EXISTS public.academy_modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL CHECK (category IN ('anxiety', 'growth', 'professional', 'health', 'sleep', 'basics', 'family')),
    author TEXT,
    duration TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    learning_outcomes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Academy Lessons Table
CREATE TABLE IF NOT EXISTS public.academy_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.academy_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Markdown content
    duration TEXT,
    is_premium BOOLEAN DEFAULT false,
    audio_url TEXT,
    video_url TEXT, -- Optional for future use
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_lessons ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read, Admin Write)
CREATE POLICY "Public modules are viewable by everyone" ON public.academy_modules
    FOR SELECT USING (true); -- Or (is_published = true)

CREATE POLICY "Public lessons are viewable by everyone" ON public.academy_lessons
    FOR SELECT USING (true);

-- Assuming authenticated admin role or service role for modifications
-- For now, we allow authenticated users to read. Write policies might depend on your app's admin structure.
-- If you are using the Service Role key for scripts, it bypasses RLS.
-- If using the Dashboard SQL Editor, you are a superuser.

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_modules_category ON public.academy_modules(category);
CREATE INDEX IF NOT EXISTS idx_academy_lessons_module_id ON public.academy_lessons(module_id);
