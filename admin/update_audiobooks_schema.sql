-- 1. Añadir columna para la imagen en la tabla audiobooks
ALTER TABLE public.audiobooks 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Asegurar que los buckets existen (por si acaso) y son públicos
INSERT INTO storage.buckets (id, name, public)
VALUES ('audiobook-voices', 'audiobook-voices', true),
       ('audiobook-thumbnails', 'audiobook-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Configurar Permisos (RLS) para los NUEVOS buckets

-- Limpieza previa de políticas para estos buckets específicos
DO $$
BEGIN
    -- Policies for audiobook-voices
    BEGIN DROP POLICY IF EXISTS "Public Read Voices" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Upload Voices" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Update Voices" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Delete Voices" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;

    -- Policies for audiobook-thumbnails
    BEGIN DROP POLICY IF EXISTS "Public Read Thumbnails" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Upload Thumbnails" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Update Thumbnails" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN DROP POLICY IF EXISTS "Auth Delete Thumbnails" ON storage.objects; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- A) bucket: audiobook-voices
CREATE POLICY "Public Read Voices" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'audiobook-voices' );
CREATE POLICY "Auth Upload Voices" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'audiobook-voices' );
CREATE POLICY "Auth Update Voices" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'audiobook-voices' );
CREATE POLICY "Auth Delete Voices" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'audiobook-voices' );

-- B) bucket: audiobook-thumbnails
CREATE POLICY "Public Read Thumbnails" ON storage.objects FOR SELECT TO public USING ( bucket_id = 'audiobook-thumbnails' );
CREATE POLICY "Auth Upload Thumbnails" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'audiobook-thumbnails' );
CREATE POLICY "Auth Update Thumbnails" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'audiobook-thumbnails' );
CREATE POLICY "Auth Delete Thumbnails" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'audiobook-thumbnails' );
