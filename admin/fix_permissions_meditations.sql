-- ⚠️ INSTRUCCIONES:
-- Ejecuta esto en Supabase SQL Editor para habilitar la gestión de Meditaciones

-- 1. Asegurar que RLS está activo
ALTER TABLE public.meditation_sessions_content ENABLE ROW LEVEL SECURITY;

-- 2. Limpieza de políticas antiguas
DROP POLICY IF EXISTS "Public Read Access" ON public.meditation_sessions_content;
DROP POLICY IF EXISTS "Authenticated Insert" ON public.meditation_sessions_content;
DROP POLICY IF EXISTS "Authenticated Update" ON public.meditation_sessions_content;
DROP POLICY IF EXISTS "Authenticated Delete" ON public.meditation_sessions_content;

-- 3. Crear Políticas NUEVAS

-- A) Todo el mundo puede LEER
CREATE POLICY "Public Read Access"
ON public.meditation_sessions_content FOR SELECT
TO public
USING (true);

-- B) Solo usuarios logueados pueden CREAR
CREATE POLICY "Authenticated Insert"
ON public.meditation_sessions_content FOR INSERT
TO authenticated
WITH CHECK (true);

-- C) Solo usuarios logueados pueden EDITAR
CREATE POLICY "Authenticated Update"
ON public.meditation_sessions_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- D) Solo usuarios logueados pueden BORRAR
CREATE POLICY "Authenticated Delete"
ON public.meditation_sessions_content FOR DELETE
TO authenticated
USING (true);
