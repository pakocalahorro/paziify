-- Final Stabilization for Paziify Storage (Forensic Infrastructure Audit v1.0)
-- This script ensures that all required buckets exist and are 100% public for read access.

-- 1. Ensure Buckets exist and are public
INSERT INTO storage.buckets (id, name, public)
VALUES ('audiobooks', 'audiobooks', true),
       ('academy-voices', 'academy-voices', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Explicit Policies for Public Read (Select)
-- Audiobooks
DROP POLICY IF EXISTS "Public Read Access for Audiobooks" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "Public Read Access for Audiobooks"
ON storage.objects FOR SELECT
USING (bucket_id = 'audiobooks');

-- Academy Voices
DROP POLICY IF EXISTS "Public Read Access for Academy" ON storage.objects;
CREATE POLICY "Public Read Access for Academy"
ON storage.objects FOR SELECT
USING (bucket_id = 'academy-voices');

-- 3. General Public Access (Backup Policy)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow Public Read'
    ) THEN
        CREATE POLICY "Allow Public Read"
        ON storage.objects FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;
