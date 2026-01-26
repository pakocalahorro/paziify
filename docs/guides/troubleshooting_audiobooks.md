# 🔍 Verificación: ¿Por qué no aparecen los audiolibros?

## Posibles Causas:

### 1. **El audiolibro no se insertó en la base de datos**
   - ¿Ejecutaste el SQL en Supabase después de subir el MP3?
   - ¿Reemplazaste `[TU-URL-COMPLETA]` con la URL real?

### 2. **Error de conexión a Supabase**
   - Verifica que las credenciales estén correctas en `.env`

### 3. **Error en el código**
   - Revisa la consola de la app para ver errores

---

## ✅ Pasos de Verificación:

### **Paso 1: Verificar que el audiolibro existe en Supabase**

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto **Paziify**
3. Ve a **Table Editor** → **audiobooks**
4. ¿Ves una fila con "Manual de Vida"?

**Si NO ves la fila**:
- Necesitas ejecutar el SQL de inserción
- Ve a **SQL Editor** y ejecuta:

```sql
-- Verifica primero si existe
SELECT * FROM audiobooks WHERE language = 'es';

-- Si no existe, inserta (reemplaza [TU-URL] con la URL real del MP3)
INSERT INTO audiobooks (
    title,
    author,
    narrator,
    description,
    category,
    tags,
    audio_url,
    duration_minutes,
    source,
    librivox_id,
    language,
    is_premium,
    is_featured
) VALUES (
    'Manual de Vida (Enquiridión)',
    'Epicteto',
    'Google Cloud TTS - Voz Masculina',
    'Los primeros 5 capítulos del Enquiridión de Epicteto. Guía práctica de filosofía estoica para vivir con tranquilidad y sabiduría.',
    'growth',
    ARRAY['estoicismo', 'filosofía', 'práctica', 'serenidad', 'autodominio'],
    'https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/growth/manual-de-vida-epicteto.mp3',
    4,
    'google-cloud-tts',
    'manual-de-vida-epicteto',
    'es',
    false,
    true
);
```

---

### **Paso 2: Verificar la URL del MP3**

1. En Supabase, ve a **Storage** → **audiobooks** → **growth**
2. Haz clic en `manual-de-vida-epicteto.mp3`
3. Haz clic en **"Copy URL"**
4. Pega la URL en un navegador
5. ¿Se reproduce el audio?

**Si NO se reproduce**:
- El archivo no se subió correctamente
- Vuelve a subirlo

---

### **Paso 3: Verificar credenciales de Supabase**

Abre el archivo `.env` y verifica que tenga:

```env
EXPO_PUBLIC_SUPABASE_URL=https://[TU-PROJECT-ID].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[TU-ANON-KEY]
```

**Para obtener las credenciales**:
1. Ve a Supabase Dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

### **Paso 4: Ver errores en la consola**

En la terminal donde corre `npm start`, busca errores como:

```
Error fetching audiobooks: ...
```

O en la app, agita el dispositivo y ve a **"Debug Remote JS"** para ver la consola del navegador.

---

## 🆘 Solución Rápida:

**Si quieres probar rápidamente**, ejecuta este SQL en Supabase para insertar un audiolibro de prueba:

```sql
-- Insertar audiolibro de prueba
INSERT INTO audiobooks (
    title,
    author,
    narrator,
    description,
    category,
    tags,
    audio_url,
    duration_minutes,
    source,
    librivox_id,
    language,
    is_premium,
    is_featured
) VALUES (
    'Audiolibro de Prueba',
    'Autor de Prueba',
    'Narrador de Prueba',
    'Este es un audiolibro de prueba para verificar que la app funciona correctamente.',
    'growth',
    ARRAY['prueba', 'test'],
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    3,
    'test',
    'test-audiobook',
    'es',
    false,
    true
);
```

Luego recarga la app (agita → Reload) y verifica si aparece "Audiolibro de Prueba".

---

**Avísame qué encuentras en cada paso para ayudarte a solucionarlo.**
