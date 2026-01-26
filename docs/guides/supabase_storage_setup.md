# 📦 Guía: Configurar Storage Bucket en Supabase

**Objetivo**: Crear un bucket público para almacenar los archivos MP3 de audiolibros.

---

## Paso 1: Crear el Bucket

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el menú lateral, haz clic en **Storage**
3. Haz clic en **Create a new bucket**
4. Configura el bucket:
   - **Name**: `audiobooks`
   - **Public bucket**: ✅ **Activado** (importante para que los MP3 sean accesibles)
   - **File size limit**: 100 MB (suficiente para audiolibros)
   - **Allowed MIME types**: `audio/mpeg, audio/mp3`
5. Haz clic en **Create bucket**

---

## Paso 2: Configurar Políticas de Acceso

El bucket público ya permite lectura, pero vamos a verificar:

1. Haz clic en el bucket `audiobooks`
2. Ve a la pestaña **Policies**
3. Debería haber una política llamada **"Public Access"** o similar
4. Si no existe, créala:

```sql
-- Política: Permitir lectura pública
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'audiobooks');
```

---

## Paso 3: Obtener la URL Base del Storage

1. En el bucket `audiobooks`, haz clic en cualquier carpeta (o crea una de prueba)
2. La URL tendrá este formato:
   ```
   https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/
   ```
3. **Copia esta URL base** - la necesitaremos para los audiolibros

---

## Paso 4: Estructura de Carpetas (Opcional)

Puedes organizar los MP3s en carpetas por categoría:

```
audiobooks/
├── growth/
│   ├── meditations-marcus-aurelius.mp3
│   ├── enchiridion-epictetus.mp3
│   └── tao-te-ching-laozi.mp3
├── professional/
│   ├── as-a-man-thinketh-james-allen.mp3
│   └── power-of-concentration-dumont.mp3
├── anxiety/
│   └── conquest-of-fear-basil-king.mp3
└── health/
    ├── science-of-being-well-wattles.mp3
    └── walden-thoreau.mp3
```

---

## Paso 5: Subir Archivos MP3

### Opción A: Desde el Dashboard (Manual)

1. Ve al bucket `audiobooks`
2. Haz clic en **Upload file**
3. Selecciona el archivo MP3
4. Espera a que se suba
5. Copia la URL pública del archivo

### Opción B: Desde Código (Programático)

```typescript
import { supabase } from './supabaseClient';

async function uploadAudiobook(file: File, filename: string) {
  const { data, error } = await supabase.storage
    .from('audiobooks')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading:', error);
    return null;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('audiobooks')
    .getPublicUrl(filename);

  return publicUrl;
}
```

---

## Paso 6: Actualizar URLs en la Base de Datos

Una vez subidos los MP3s, actualiza el SQL de inserción:

1. Abre `supabase/seeds/audiobooks_initial.sql`
2. Reemplaza `[SUPABASE_STORAGE_URL]` con tu URL base
3. Ejemplo:
   ```sql
   -- Antes
   'https://[SUPABASE_STORAGE_URL]/audiobooks/meditations-marcus-aurelius.mp3'
   
   -- Después
   'https://abcdefgh.supabase.co/storage/v1/object/public/audiobooks/meditations-marcus-aurelius.mp3'
   ```
4. Ejecuta el SQL en Supabase SQL Editor

---

## ✅ Verificación

Para verificar que todo funciona:

1. Sube un MP3 de prueba al bucket
2. Copia su URL pública
3. Pégala en el navegador
4. ✅ El audio debería reproducirse o descargarse

---

## 📝 Notas Importantes

- **Tamaño**: LibriVox MP3s suelen ser 50-200 MB por audiolibro
- **Formato**: Asegúrate de que sean MP3 (no M4A, OGG, etc.)
- **Nombres**: Usa nombres sin espacios ni caracteres especiales
- **Backup**: Guarda los MP3s originales en tu computadora

---

**Próximo paso**: Descargar los MP3s de LibriVox y subirlos al bucket.
