# 🗄️ Guía de Arquitectura de Base de Datos - Paziify (v1.2) 🔐

Esta guía detalla la infraestructura de datos de Paziify alojada en **Supabase (PostgreSQL)**. La seguridad y la escalabilidad son los pilares de este diseño, con un enfoque centrado en la privacidad mediante **Row Level Security (RLS)**.

---

## 1. Principio de Seguridad: Row Level Security (RLS) 🛡️

En Paziify, la privacidad es una característica innegociable. Todas las tablas tienen RLS activado.

- **Aislamiento Total**: Cada registro está vinculado a un `user_id` (o ID de perfil) que referencia a `auth.users`.
- **Validación en Servidor**: Las políticas de PostgreSQL impiden que un usuario acceda o manipule datos que no le pertenecen.

---

## 2. Diccionario de Datos (Esquema Public)

### `meditation_sessions_content` 🧘
Nueva tabla para gestionar la lógica de las sesiones de meditación (v1.4).
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `slug` | TEXT | Identificador corto (ej: `box_breathing`) |
| `audio_layers` | JSONB | Configuración de capas (Voces, Paisajes, Ondas) |
| `breathing_config` | JSONB | Tiempos de inhalación, exhalación y retención |
| `is_plus` | BOOLEAN | Acceso premium |

### `profiles`
Extensión del perfil de usuario para gamificación y personalización.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Referencia a `auth.users.id` |
| `full_name` | TEXT | Nombre completo del usuario |
| `avatar_url` | TEXT | URL de la imagen de perfil |
| `streak` | INTEGER | Racha actual de días consecutivos |
| `resilience_score` | INTEGER | Puntuación acumulada de bienestar (0-100) |
| `is_plus_member` | BOOLEAN | Estado de suscripción premium |

### `meditation_logs`
Histórico de sesiones completadas.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único del log |
| `user_id` | UUID (FK) | Relación con el usuario |
| `session_id` | TEXT | ID de la sesión (ej: `anx_box`) |
| `duration_minutes` | INTEGER | Minutos meditados en esa sesión |

### `community_posts`
Espacio social para reflexiones y apoyo.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `user_id` | UUID (FK) | Creador del post |
| `content` | TEXT | Reflexión escrita |
| `mood_index` | INTEGER | Estado de ánimo asociado |
| `likes_count`| INTEGER | Apoyo recibido ("Paz") |

### `audiobooks` 📚
Catálogo de audiolibros de dominio público.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `title` | TEXT | Título de la obra |
| `author` | TEXT | Autor |
| `audio_url` | TEXT | URL del archivo MP3 en Storage |
| `category` | TEXT | Categoría (anxiety, growth, etc.) |
| `is_premium` | BOOLEAN | Control de acceso Plus |

### `real_stories` 🌟
Testimonios reales y artículos de inspiración.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Identificador único |
| `title` | TEXT | Título de la historia |
| `content` | TEXT | Cuerpo del texto (soporta Markdown) |
| `image_url` | TEXT | Portada representativa |

### `user_favorites_content` ⭐
Sistema unificado de marcadores para la biblioteca.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `user_id` | UUID (FK) | Dueño del favorito |
| `content_id` | UUID (FK) | ID del audiolibro o historia |
| `content_type`| TEXT | 'audiobook' o 'story' |

---

## 3. Políticas de Seguridad (RLS) 🔐

```sql
-- Contenido Público (Lectura para todos)
CREATE POLICY "Lectura pública" ON audiobooks FOR SELECT USING (true);
CREATE POLICY "Lectura pública" ON real_stories FOR SELECT USING (true);

-- Favoritos (Privacidad total por usuario)
CREATE POLICY "Solo dueño gestiona favoritos" ON user_favorites_content
  FOR ALL USING (auth.uid() = user_id);

-- Perfiles y Logs
CREATE POLICY "Dueño gestiona sus datos" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Dueño gestiona sus logs" ON meditation_logs FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Automatizaciones y Triggers ⚡

### Creación Automática de Perfil
Cada registro en `auth.users` dispara la creación de un perfil en `public.profiles` con los metadatos de Google o el registro manual. Esto garantiza que el `AppContext` siempre tenga un perfil disponible al iniciar sesión.

---

## 5. Buenas Prácticas 🚀

1. **Derecho al Olvido**: Todas las claves foráneas hacia `user_id` utilizan `ON DELETE CASCADE`.
2. **Consultas Seguras**: Utilizar siempre el servicio `contentService` para interactuar con estas tablas, asegurando el manejo correcto de errores y estados de carga.
3. **Optimización**: Se recomienda el uso de índices sobre `category` y `content_type` para búsquedas rápidas en catálogos grandes.

---
*Última revisión: 27 de Enero de 2026 - Milestone 3: Oasis Hub (v1.4)*
