# 🗄️ Guía de Arquitectura de Base de Datos - Paziify (v2.6.5) 🔐

Esta guía detalla la infraestructura de datos de Paziify alojada en **Supabase (PostgreSQL)**. La seguridad y la escalabilidad son los pilares de este diseño, con un enfoque centrado en la privacidad mediante **Row Level Security (RLS)**.

---

## 1. Principio de Seguridad: Row Level Security (RLS) 🛡️

En Paziify, la privacidad es una característica innegociable. Todas las tablas tienen RLS activado.
- **Aislamiento Total**: Cada registro está vinculado a un `user_id` que referencia a `auth.users`.
- **Validación en Servidor**: Las políticas de PostgreSQL impiden que un usuario acceda o manipule datos que no le pertenecen.

---

## 2. Diccionario de Datos (Esquema Public)

### `profiles` (Personalización & Cloud Sync) ☁️
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Referencia a `auth.users.id` |
| `full_name` | TEXT | Nombre completo del usuario |
| `avatar_url` | TEXT | URL de la imagen de perfil |
| `streak` | INTEGER | Racha actual de días consecutivos |
| `resilience_score` | INTEGER | Puntuación de bienestar (0-100) |
| `is_plus_member` | BOOLEAN | Estado de suscripción premium |
| `has_accepted_monthly_challenge` | BOOLEAN | Estado del Reto de 30 días |
| `daily_goal_minutes` | INTEGER | Meta diaria (recalibra analíticas) |
| `weekly_goal_minutes` | INTEGER | Meta semanal (recalibra analíticas) |
| `life_mode` | TEXT | Enfoque: 'growth' o 'healing' (Persistente) |
| `last_selected_background_uri` | TEXT | Fondo místico de la Brújula (Persistente) |
| `last_entry_date` | TEXT | Fecha del último ritual (YYYY-MM-DD) |
| `favorite_session_ids` | JSONB | IDs favoritos (100% Cloud Sync) |
| `completed_session_ids` | JSONB | Historial de sesiones (100% Cloud Sync) |
| `notification_settings` | JSONB | Ajustes y recordatorios (100% Cloud Sync) |

### `meditation_sessions_content` 🧘
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `slug` | TEXT | Identificador corto (ej: `box_breathing`) |
| `audio_layers` | JSONB | Configuración de Voces, Paisajes, Ondas |
| `breathing_config` | JSONB | Tiempos de inhalación/exhalación |
| `is_plus` | BOOLEAN | Control de acceso premium |

### `real_stories` 🌟 (Historias Maestras)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `title` | TEXT | Título editorial |
| `content` | TEXT | Texto en Markdown (Formato Editorial) |
| `image_url` | TEXT | Portada representativa (WebP / Cloud Storage) |
| `character_name` | TEXT | Protagonista (ej: Steve Jobs, Marco Aurelio) |
| `character_role` | TEXT | Profesión o rol inspirador |
| `transformation_theme` | TEXT | Tema (Ansiedad, Resiliencia, etc.) |

### `audiobooks` 📚
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `title` | TEXT | Título de la obra |
| `author` | TEXT | Autor de dominio público |
| `audio_url` | TEXT | URL mística en Storage |
| `duration_minutes` | INTEGER | Tiempo total de escucha |

---

## 3. Esquema Educativo (Academia v2.3) 🎓

| Tabla | Propósito |
| :--- | :--- |
| `courses` | Catálogo de cursos de bienestar |
| `modules` | Agrupación lógica de lecciones |
| `lessons` | Unidad mínima de contenido (Markdown + Audio TTS) |
| `user_course_progress` | Seguimiento individual de avance |

---

## 4. Políticas de Seguridad (RLS Hardening v2.6.5) 🔐

```sql
-- Perfiles: Solo el dueño gestiona sus datos persistentes
CREATE POLICY "Dueño gestiona sus datos" ON profiles FOR ALL USING (auth.uid() = id);

-- Storage: Blindaje de buckets v2.6.5
CREATE POLICY "Lectura pública de assets" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('meditation-voices', 'meditation-thumbnails', 'audiobooks', 'soundscapes'));

-- Favoritos & Historial: Acceso denegado a terceros
CREATE POLICY "Privacidad Total JSONB" ON profiles 
  FOR SELECT USING (auth.uid() = id);
```

---

## 5. Almacenamiento (Supabase Storage) ☁️
| Bucket | Contenido | Política |
| :--- | :--- | :--- |
| `meditation-voices` | Voces 101 sesiones (Estandarizadas ASCII) | Public Read |
| `meditation-thumbnails`| Portadas IA / WebP | Public Read |
| `audiobooks` | Archivos MP3 narrados | Public Read |
| `soundscapes` | Ambientes infinitos (Bosque, Lluvia, Cosmos) | Public Read |

---
*Última revisión: 11 de Febrero de 2026 - Milestone 4: Sincronización Total & RLS Hardening (v2.6.5)*
