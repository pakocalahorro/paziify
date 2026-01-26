# 🗄️ Guía: Aplicar Migración de Audiolibros e Historias

**Fecha**: 25 de Enero de 2026  
**Migración**: `20260125_audiobooks_stories.sql`

---

## Paso 1: Acceder a Supabase Dashboard

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **Paziify**

---

## Paso 2: Abrir el Editor SQL

1. En el menú lateral izquierdo, haz clic en **SQL Editor**
2. Haz clic en el botón **+ New query** (arriba a la derecha)

---

## Paso 3: Copiar y Pegar la Migración

1. Abre el archivo: `supabase/migrations/20260125_audiobooks_stories.sql`
2. Copia **todo el contenido** del archivo
3. Pégalo en el editor SQL de Supabase

---

## Paso 4: Ejecutar la Migración

1. Haz clic en el botón **Run** (abajo a la derecha)
2. Espera a que aparezca el mensaje: **Success. No rows returned**
3. ✅ Si ves este mensaje, la migración se aplicó correctamente

---

## Paso 5: Verificar las Tablas Creadas

1. En el menú lateral, haz clic en **Table Editor**
2. Deberías ver 3 nuevas tablas:
   - `audiobooks`
   - `real_stories`
   - `user_favorites`

---

## Paso 6: Configurar Storage Bucket (Opcional - para más adelante)

Cuando estemos listos para subir los MP3s de audiolibros:

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Nombre: `audiobooks`
4. **Public bucket**: ✅ Activado (para que los audios sean accesibles)
5. Haz clic en **Create bucket**

---

## ⚠️ Solución de Problemas

### Error: "relation already exists"
- **Causa**: Las tablas ya existen
- **Solución**: Elimina las tablas manualmente o ignora el error si las tablas están correctas

### Error: "permission denied"
- **Causa**: No tienes permisos de administrador
- **Solución**: Verifica que estás usando la cuenta correcta del proyecto

### Error: "syntax error"
- **Causa**: El SQL no se copió correctamente
- **Solución**: Vuelve a copiar el archivo completo, asegurándote de no perder ninguna línea

---

## ✅ Checklist de Verificación

Después de aplicar la migración, verifica:

- [ ] Tabla `audiobooks` existe con 15 columnas
- [ ] Tabla `real_stories` existe con 16 columnas
- [ ] Tabla `user_favorites` existe con 4 columnas
- [ ] Políticas RLS están activas (icono de candado en Table Editor)
- [ ] Índices creados (puedes verlos en Database → Indexes)

---

**Próximo paso**: Una vez aplicada la migración, podemos continuar con la descarga de audiolibros de LibriVox.
