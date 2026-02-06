-- ⚠️ INSTRUCCIONES:
-- 1. Ve a tu Supabase Dashboard (https://supabase.com/dashboard/project/...)
-- 2. Entra en "SQL Editor" (icono de terminal en la barra lateral)
-- 3. Pega todo este contenido y dale a "RUN"

----------- INICIO DEL SCRIPT -----------

-- 1. Asegurar que RLS está activo (por seguridad)
ALTER TABLE public.audiobooks ENABLE ROW LEVEL SECURITY;

-- 2. Limpieza: Borrar políticas antiguas para evitar conflictos
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.audiobooks;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.audiobooks;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.audiobooks;
DROP POLICY IF EXISTS "Lectura pública" ON public.audiobooks;
DROP POLICY IF EXISTS "Public Read Access" ON public.audiobooks;
DROP POLICY IF EXISTS "Authenticated Insert" ON public.audiobooks;
DROP POLICY IF EXISTS "Authenticated Update" ON public.audiobooks;
DROP POLICY IF EXISTS "Authenticated Delete" ON public.audiobooks;

-- 3. Crear Políticas NUEVAS

-- A) Todo el mundo puede LEER (App móvil + Admin)
CREATE POLICY "Public Read Access"
ON public.audiobooks FOR SELECT
TO public
USING (true);

-- B) Solo usuarios logueados pueden CREAR (Admin Panel)
CREATE POLICY "Authenticated Insert"
ON public.audiobooks FOR INSERT
TO authenticated
WITH CHECK (true);

-- C) Solo usuarios logueados pueden EDITAR (Admin Panel)
CREATE POLICY "Authenticated Update"
ON public.audiobooks FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- D) Solo usuarios logueados pueden BORRAR (Admin Panel)
CREATE POLICY "Authenticated Delete"
ON public.audiobooks FOR DELETE
TO authenticated
USING (true);

----------- FIN DEL SCRIPT -----------
