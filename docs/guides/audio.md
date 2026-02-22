# 🎙️ Guía Maestra de Audio - Paziify (v2.30.5) 💎

Esta guía documenta la arquitectura técnica del motor de audio, los protocolos de nomenclatura y el catálogo auditado. La versión **v2.30.5** marca la **Sincronización Universal**, consolidando el motor asíncrono y la protección offline total.

---

## 1. Arquitectura del Motor de Audio

El motor de audio de Paziify ha sido diseñado para ser inmersivo, multi-capa y personalizable.

### Motor Multi-Capa (`AudioEngineService.ts`)
Paziify permite la mezcla simultánea de cuatro tipos de fuentes:
1.  **Voice Track (Pre-grabado)**: Pistas de voz MP3 generadas con Google Cloud TTS para ejecución en segundo plano confiable.
2.  **Guía Vocal (Dinámica)**: Instrucciones TTS en tiempo real para sesiones sin voice track.
3.  **Soundscapes (Ambientes)**: Paisajes sonoros infinitos (lluvia, bosque) que pueden reproducirse solos o mezclados.
4.  **Ondas Binaurales**: Frecuencias (Theta, Alpha, Gamma) inyectadas como capa secundaria para potenciar el enfoque o la relajación.

### Implementaciones Técnicas
*   **Supabase Storage**: Centralización absoluta en el bucket unificado **`meditation`** (v2.30.0).
    - **Bucket Maestro**: `meditation` (Contiene audios y miniaturas).
    - **Buckets Especializados**: `soundscapes`, `binaurals`, `audiobooks`, `academy-voices`.
    - **Legado**: `meditation-voices` y `meditation-thumbnails` se consideran obsoletos.
*   **Oasis Folder Strategy**: Los archivos en el bucket `meditation` se organizan en subcarpetas dinámicas por categoría (ej. `/kids`, `/sueno`, `/calmasos`).
*   **Background Execution**: Audio configurado con `staysActiveInBackground: true` para mantener la reproducción incluso con la pantalla apagada.
*   **Protocolo de Nomenclatura ASCII**: Todos los archivos y URLs deben ser 100% ASCII y comenzar con un prefijo de 4 dígitos correlativo al `ID` de la sesión (ej. `0001-meditation-slug.mp3`).
*   **Security Hardening (RLS)**: El bucket `meditation` cuenta con políticas RLS de lectura protegida y permisos de sobrescritura (`upsert`) vía SQL.

### Reproductor Global y Persistencia (`AudioPlayerContext.tsx`)
Para audiolibros e historias:
*   **Global Context**: Mantiene el estado del audio vivo entre cambios de pantalla.
*   **MiniPlayer**: Componente flotante que permite el control de reproducción en toda la app.

---

## 2. Identidad de los Guías (Parámetros Premium)

A continuación se detallan los parámetros técnicos de Google Cloud TTS validados para mantener la calidad profesional de Paziify.

### 📋Resumen de Guías Oficiales
- **Aria (Calma/Salud/Emocional)**: `es-ES-Chirp3-HD-Vindemiatrix` | Pitch: 0.0 | Rate: 0.72 | Voz nutritiva y protectora.
- **Laomedeia (Kids/Adolescente)**: `es-ES-Neural2-A` (Perfil *Nova v8*) | Pitch: +1.0 | Rate: 0.85 | Voz juvenil, veloz y empática.
- **Ziro (Rendimiento/Despertar)**: `es-ES-Chirp3-HD-Autonoe` (Perfil *Helios*) | Pitch: 0.0 | Rate: 0.75 | Voz vibrante y motivadora.
- **Éter (Sueño/Resiliencia)**: `es-ES-Neural-Deep` (Perfil *Zenon*) | Pitch: -2.0 | Rate: 0.70 | Voz profunda y de comando.
- **Gaia (Mindfulness)**: `es-ES-Studio-F` | Pitch: 0.0 | Rate: 0.75 | Voz etérea y consciente.

### SSML Prosody (Calidad Premium) 🎙️
Para una experiencia meditativa superior, el motor de audio (`generate_audiobook.py`) utiliza etiquetas SSML para controlar la prosodia:
- **Pausas Automáticas**: Se insertan etiquetas `<break time="2000ms"/>` entre párrafos.
- **Ritmo Espiritual**: Las tasas de habla (`speaking_rate`) se mantienen por debajo de 0.8x para facilitar la introspección.
- **Control de Carga (Byte-Based)**: El script calcula dinámicamente el tamaño de la petición en bytes (`MAX_BYTES = 4800`) para garantizar que nunca se supere el límite de 5000 bytes de Google Cloud, incluso con caracteres especiales y etiquetas complejas.
- **Compatibilidad Studio/Chirp**: Se omite automáticamente el atributo `pitch` en voces avanzadas para evitar errores 400.

---

## 3. Herramientas de Mantenimiento y Scripts

Disponemos de herramientas en la carpeta `scripts/` para mantener el catálogo organizado:

*   **`sync_sessions.js`**: Cruza los guiones de `docs/scripts/` con `sessionsData.ts`. Asigna guías y genera URLs ASCII.
*   **`prepare_upload.js`**: Renombra físicamente los MP3 locales para que coincidan con la base de datos.
*   **`bulk_generate_scripts.py`**: Migración masiva de guiones profesionales (`docs/scripts/`) a formato `.txt`.
*   **`SSML-Audio-Generator`**: El motor principal de síntesis. En su versión **v2.30.0** incluye:
    - **Soporte SSML Completo**: Procesa etiquetas de prosodia, énfasis y silencios.
    - **Chunking por Bytes**: Fragmentación automática para no superar los 5000 bytes.
    - **Quota Tracker**: Seguimiento local en `quota_tracker.json`.
*   **`generate_audio_easy.bat`**: Lanzador simplificado para generar sesiones premium arrastrando archivos `.txt`.

> [!TIP]
> **Regla de Oro**: Si cambias algo en la autoría o categorías, primero corre `sync_sessions.js`, luego `prepare_upload.js`, y finalmente sube a Supabase.

---

## 4. Control de Consumo y Cuotas (Free Tier)

Para evitar sorpresas con la facturación de Google Cloud, el motor integra un sistema de monitoreo en `scripts/quota_tracker.json`.

### Límites Mensuales del Modo Gratuito:
| Tipo de Voz | Modelos Paziify | Límite (Cars/mes) |
| :--- | :--- | :--- |
| **Studio** | Éter | 100,000 |
| **Neural/Chirp** | Aria, Ziro, Gaia | 1,000,000 |
| **Standard** | (No usados) | 4,000,000 |

> [!NOTE]
> Al finalizar cada generación, el script informa del consumo acumulado y los caracteres restantes para el mes en curso.

---

### 🛑 119 Sesiones Guiadas (Premium Evolution v2.30)
| Bloque | Categoría | Guiones | Voz (Guía) | Estado |
| :--- | :--- | :---: | :--- | :--- |
| 01 | Calma SOS | 16 | Aria | **Premium SSML** |
| 02 | Mindfulness | 13 | Gaia | **Premium SSML** |
| 03 | Sueño | 14 | Éter | **Premium SSML** |
| 04 | Resiliencia | 13 | Éter | **Premium SSML** |
| 05 | Rendimiento | 10 | Ziro | **Premium SSML** |
| 06 | Despertar | 13 | Ziro | **Premium SSML** |
| 07 | Salud | 10 | Aria | **Premium SSML** |
| 08 | Emocional | 10 | Aria | **Premium SSML** |
| 09 | Hábitos | 10 | Aria | **Premium SSML** |
| 10 | Paziify Kids | 10 | Laomedeia | **Premium SSML** |

---

### Mantenimiento de Scripts
> [!CAUTION]
> Los scripts que apuntan a buckets legacy (`meditation-voice`) han sido movidos a `scripts/LEGACY_OLD_STRUCTURE/`. **No usarlos** para nuevas cargas masivas. Usa el Panel Admin.

---
*Última revisión: 22 de Febrero de 2026 - Versión 2.30.5 (Universal Sync Evolution)*
