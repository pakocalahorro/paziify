# 🗄️ Guía de Arquitectura de Base de Datos - Paziify 🔐

Esta guía detalla la infraestructura de datos de Paziify. Esta versión se sincroniza con el rediseño Oasis 3.0 y la estandarización de contenidos.

---

## 1. Principio de Seguridad: Row Level Security (RLS) ... [Mantenido] ...

---

## 2. Diccionario de Datos (Esquema Public)

### `meditation_sessions_content` 🧘
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `legacy_id` | TEXT | ID único para la App (ej: "anx_401"). Autosync con `slug`. |
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

- **Zero Cloud Storage**: Los datos crudos del sensor rPPG (frames de video) y las métricas calculadas (BPM, HRV, Stress Level) **NUNCA** se envían a Supabase ni a ningún servidor externo.
- **Procesamiento Local (Edge)**: Todo el análisis de señal mediante el algoritmo POS ocurre estrictamente en el dispositivo del usuario (`BioSignalProcessor.ts`).
- **Persistencia Efímera**: Los resultados solo existen en la memoria volátil de la sesión (`Context`) y se descartan al cerrar la pantalla de resultados, a menos que el usuario decida explícitamente guardarlos en su historial local (AsyncStorage, no Cloud).

Esta arquitectura garantiza el cumplimiento de normativas de privacidad y confianza del usuario.

---

## 8. Persistencia Local del Sistema de Evolución 🎯

El **Sistema de Evolución** (Desafíos, Retos, Misiones) almacena su estado **exclusivamente en AsyncStorage**, sin enviar ningún dato al cloud:

- **`activeChallenge`**: Objeto `ActiveChallenge` con id, slug, type, title, startDate, daysCompleted, totalDays, currentSessionSlug.
- **`hasAcceptedMonthlyChallenge`**: Flag booleano.
- **`dailyGoalMinutes` / `weeklyGoalMinutes`**: Enteros para gestión de metas.
- **Persistencia**: Se guarda como parte del `UserState` bajo la clave `@paziify_user_state`.

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
*Última revisión: 2 de Marzo de 2026 - Versión 2.37.0 (Oasis 3.0 Standardization)*
