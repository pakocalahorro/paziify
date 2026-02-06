-- ⚠️ INSTRUCCIONES CORREGIDAS:
-- Ejecuta esto en Supabase > SQL Editor

-- 1. Crear el bucket 'audiobooks' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('audiobooks', 'audiobooks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. (ELIMINADO: ALTER TABLE storage.objects...) 
-- Ya tiene RLS activado por defecto y no tenemos permisos para cambiarlo, así que saltamos este paso.

-- 3. Limpiar políticas antiguas
-- Nota: Si esto falla, ignóralo y sigue con los CREATE
DO $$
BEGIN
    BEGIN
        DROP POLICY IF EXISTS "Public Read Audiobooks" ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated Upload Audiobooks" ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated Update Audiobooks" ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated Delete Audiobooks" ON storage.objects;
    EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 4. Crear Políticas de Permisos

-- Lectura para todos (App y Web)
CREATE POLICY "Public Read Audiobooks"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'audiobooks' );

-- Subida permitida solo usuarios logueados
CREATE POLICY "Authenticated Upload Audiobooks"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'audiobooks' );

-- Modificación permitida solo usuarios logueados
CREATE POLICY "Authenticated Update Audiobooks"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'audiobooks' );

-- Borrado permitido solo usuarios logueados
CREATE POLICY "Authenticated Delete Audiobooks"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'audiobooks' );
