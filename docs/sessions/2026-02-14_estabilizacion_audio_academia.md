# Nota de Sesión: Estabilización de Audio de la Academia y Resiliencia Offline
**Fecha**: 2026-02-14
**Versión**: v2.8.10

## 🎯 Objetivos de la Sesión
1. Restaurar el contenido de audio del curso "Adiós al Insomnio" (7 lecciones).
2. Optimizar globalmente los activos de la Academia eliminando redundancias masivas.
3. Consolidar el protocolo "Zero-Egress" para garantizar funcionamiento offline 100% fiable.

## 🚀 Hitos Críticos

### 1. Recuperación Táctica del Curso de Insomnio
- **Problema**: El curso de Insomnio no tenía archivos de audio vinculados ni en local ni en Supabase.
- **Acción**: Se regeneraron 7 archivos MP3 (`insomnia-1.mp3` a `insomnia-7.mp3`) usando la voz premium **'Eter'** de Google Cloud TTS.
- **Detalle Técnico**: Se utilizó SSML con un `rate` de 0.95 para asegurar un tono terapéutico adecuado para el sueño.

### 2. Overhaul de la Arquitectura de Archivos (Academia)
- **Problema**: Se detectaron 53 archivos redundantes (nombres descriptivos) que duplicaban a los archivos técnicos.
- **Acción**: Ejecutamos el script `optimize_academy_assets.py` para realizar una limpieza forense.
- **Resultado**: Pasamos de 113 archivos mixtos a exactamente **60 archivos técnicos** (1 por lección). La app es ahora más ligera y la estructura de Supabase es 100% predecible.

### 3. Estabilización Offline y Resolución de Error 400
- **Problema**: La app sufría errores 400 al intentar descargar archivos con nombres antiguos/descriptivos.
- **Solución**: Se actualizaron los servicios (`AcademyService`, `contentService`) y el archivo de datos (`academyData.ts`) para usar **URLs públicas absolutas** de Supabase.
- **Beneficio**: El `CacheService` ahora puede persistir los archivos localmente en el primer uso, permitiendo que el modo offline funcione sin necesidad de consultar el servidor para las rutas.

### 4. Resiliencia del Catálogo
- Se reforzó la lógica de `MeditationCatalogScreen` para asegurar que las categorías y sesiones fijas (locales) siempre se muestren, incluso sin conexión a internet.

## 🛠️ Herramientas y Scripts Utilizados
- `regenerate_insomnia.py`: Motor de TTS para recuperación de audio.
- `optimize_academy_assets.py`: Auditoría y borrado masivo de activos redundantes.
- `fix_academy_urls.py`: Actualización masiva de `academyData.ts` de rutas relativas a absolutas.

## ✅ Estado de Entrega
- **Academia**: 10/10 cursos operativos y verificados.
- **Offline**: Verificado en sección Academia y Meditación.
- **Documentación**: Master Walkthrough (v2.8.10) actualizado.

---
**Próximos Pasos**:
- Subir los 60 archivos optimizados de la carpeta local al bucket `academy-voices` (vaciado previo del bucket recomendado).
