# 📤 Guía: Subir Audiolibro a Supabase

¡Tu primer audiolibro está listo! Ahora vamos a subirlo a Supabase.

---

## ✅ Audiolibro Generado:

**Archivo**: `audiobooks_temp/manual-de-vida-epicteto.mp3`
- **Tamaño**: 1.96 MB
- **Duración**: ~4 minutos
- **Caracteres usados**: 3,955 (de 1,000,000 gratis/mes)
- **Contenido**: Primeros 5 capítulos del Enquiridión

---

## 📤 Paso 1: Subir a Supabase Storage

### **1.1 Ir a Supabase Dashboard**
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto **Paziify**

### **1.2 Navegar a Storage**
1. En el menú lateral, haz clic en **Storage**
2. Haz clic en el bucket **audiobooks**

### **1.3 Crear carpeta (si no existe)**
1. Haz clic en **Create folder**
2. Nombre: `growth`
3. Haz clic en **Create**

### **1.4 Subir el archivo**
1. Entra a la carpeta `growth`
2. Haz clic en **Upload file**
3. Selecciona: `C:\Mis Cosas\Proyectos\Paziify\audiobooks_temp\manual-de-vida-epicteto.mp3`
4. Espera a que se suba (puede tardar 30-60 segundos)

### **1.5 Obtener URL pública**
1. Una vez subido, haz clic en el archivo
2. Haz clic en **Get URL** o **Copy URL**
3. La URL tendrá este formato:
   ```
   https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/growth/manual-de-vida-epicteto.mp3
   ```
4. **Copia esta URL** - la necesitarás para el siguiente paso

---

## 💾 Paso 2: Insertar Metadata en la Base de Datos

### **2.1 Ir al SQL Editor**
1. En Supabase, haz clic en **SQL Editor**
2. Haz clic en **+ New query**

### **2.2 Ejecutar el SQL**

Copia y pega este SQL, **reemplazando** `[TU-URL-COMPLETA]` con la URL que copiaste:

```sql
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
    '[TU-URL-COMPLETA]',
    4,
    'google-cloud-tts',
    'manual-de-vida-epicteto',
    'es',
    false,
    true
);

-- Verificar inserción
SELECT 
    title,
    author,
    duration_minutes,
    is_featured,
    language
FROM audiobooks
WHERE language = 'es';
```

### **2.3 Ejecutar**
1. Haz clic en **Run** (abajo a la derecha)
2. Deberías ver: **Success. 1 rows affected**
3. Luego verás la fila insertada en la tabla

---

## ✅ Verificación

Para verificar que todo funciona:

1. Ve a **Table Editor** → **audiobooks**
2. Deberías ver tu audiolibro en la lista
3. Haz clic en la URL del `audio_url`
4. El audio debería reproducirse en tu navegador

---

## 🎯 Próximo Paso

Una vez subido y verificado, podemos:
1. Implementar el player de audio en la app
2. Probar la reproducción desde AudiobooksScreen
3. Generar más audiolibros

---

**Avísame cuando hayas subido el archivo y ejecutado el SQL para continuar.**
