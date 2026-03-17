# 🗄️ Guía de Arquitectura de Base de Datos - Paziify 🔐

Esta guía detalla la infraestructura de datos de Paziify. Esta versión se sincroniza con el rediseño Oasis 3.0 y la estandarización de contenidos.

---

## 1. Principio de Seguridad: Row Level Security (RLS) ... [Mantenido] ...

---

## 2. Diccionario de Datos (Esquema Public)

### `meditation_sessions_content` 🧘
> [!IMPORTANT]
> **Permisos de Escritura**: Esta tabla requiere el rol `admin` en la tabla `profiles`. Si un usuario intenta guardar cambios sin el rol adecuado, Supabase devolverá un éxito falso (Silent Fail) pero no persistirá los datos.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `legacy_id` | TEXT | ID único para la App (ej: "anx_401"). Autosync con `slug`. |
| `description` | TEXT | [NEW v2.39.0] Sinopsis real síncrona con el App. |
| `audio_config`| JSONB | Configuración de Binaurales y Soundscapes. |
| `breathing_config`| JSONB | Tiempos de inhalación/exhalación. |
| `time_of_day` | TEXT | Categorización temporal (mañana/noche). |

### `real_stories` 📚
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único. |
| `title` | TEXT | Título de la historia. |
| `story_text` | TEXT | Contenido narrativo completo. |
| `character_name` | TEXT | Nombre del protagonista. |
| `category` | TEXT | Categoría unificada (ver sección 6). |
| `tags` | TEXT[] | Etiquetas temáticas. |
| `reading_time_minutes` | INT | Tiempo estimado de lectura. |
| `is_featured` | BOOL | Destacada en la Home. |
| `is_premium` | BOOL | Contenido premium. |
| `thumbnail_url` | TEXT | URL de la portada. |

### 3. Esquema Educativo (Academia) 🎓
| Tabla | Propósito |
| :--- | :--- |
| `courses` | 10 cursos temáticos verificados. |
| `lessons` | 60 lecciones con mapeo técnico único a MP3. |

---

## 4. Políticas de Seguridad (RLS Hardening) 🔐
```sql
-- Storage: Blindaje de buckets v2.30.0
CREATE POLICY "Lectura pública de assets" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('meditation', 'soundscapes', 'binaurals', 'audiobooks', 'academy-voices'));
```

---

## 5. Almacenamiento (Supabase Storage) & Optimización Zero-Egress ☁️

| Bucket | Contenido | Política | Estrategia |
| :--- | :--- | :--- | :--- |
| **`meditation`** | **Unified Master**: Audios 119 sesiones y thumbnails | Public Read | `max-age=31536000` |
| `academy-voices`| Audios Academia (60 archivos) | Public Read | Zero-Egress Persistent |
| `soundscapes` | Ambientes infinitos | Public Read | Persistent Cache |
| `binaurals` | Ondas Theta/Alpha | Public Read | Persistent Cache |
| `audiobooks` | Archivos MP3 narrados | Public Read | Persistent Cache |
| `meditation-voice`| (DEP) Bucket de voz legado | (Legacy) | Obsoleto v2.30 |
| `meditation-thumbnails`| (DEP) Bucket de portadas legado| (Legacy) | Obsoleto v2.30 |

> [!IMPORTANT]
> **Estrategia Oasis Folder**: El bucket `meditation` utiliza subcarpetas dinámicas (`/kids`, `/calmasos`, `/sueno`, etc.) para una organización granular gestionada por el componente `MediaUploader.tsx`.

> [!NOTE]
> **Estrategia Zero-Egress Dinámica**: La App ya no precarga listas estáticas de ambientes. El sistema resuelve mediante servicios (`contentService.ts`) los metadatos de audios y miniaturas, permitiendo que el 100% del contenido sea gestionable desde el Panel Admin y almacenable localmente por el `CacheService`.


---

## 6. Unificación de Categorías 🔗

A partir de la versión 2.9.0, todas las tablas de contenido (`meditation_sessions_content`, `real_stories`) comparten estrictamente el mismo juego de claves para el campo `category`.

**Valores Válidos (Enum implícito):**
- `rendimiento` (Professional)
- `despertar` (Growth)
- `calmasos` (Anxiety)
- `mindfulness`
- `sueno` (Sleep)
- `salud` (Health)
- `emocional` (Relationships)
- `habitos`
- `kids`
- `resiliencia`

Esto garantiza que el Panel de Administración (CMS) pueda filtrar y asignar contenido de manera consistente en toda la plataforma.

---

## 7. Privacidad Bio-métrica 🧬🛡️

Con la introducción del **Escáner Cardio Premium**, se establece un protocolo estricto de no-persistencia para datos sensibles:

- **Cloud Sync v2.51.0**: Las métricas finales (BPM, HRV, Diagnóstico) se sincronizan con la tabla `cardio_scans` para permitir el acceso multi-dispositivo y evitar la pérdida de historial médico.
- **Persistencia Híbrida**: Los resultados se guardan primero en `AsyncStorage` (vía `CardioService.ts`) y se replican inmediatamente en Supabase si hay conexión.

Esta arquitectura garantiza el cumplimiento de normativas de privacidad y confianza del usuario.

---

- **Cloud Streak Sync (v2.51.0)**: La racha de días (`streak`) se guarda de forma redundante en la tabla `profiles`.
- **`activeChallenge`**: Objeto `ActiveChallenge` con id, slug, type, title, startDate, daysCompleted, totalDays, currentSessionSlug. Almacenado localmente.
- **Persistencia**: El estado del reto se guarda localmente, pero los **Días de Calma** (racha) tienen persistencia indestructible en la nube.

---
## 9. Sistema de Notificaciones (Supabase) 🔔

### `notification_templates`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `type` | TEXT | Identificador técnico (morning, night, streak_3, etc.) |
| `title` | TEXT | Título con soporte de variables `{name}` |
| `body` | TEXT | Cuerpo del mensaje con variables `{streak}` |
| `is_active`| BOOL | Control de publicación instantánea |

---
---
*Última revisión: 17 de Marzo de 2026 - Versión 2.51.0 (Cloud Persistence)*
