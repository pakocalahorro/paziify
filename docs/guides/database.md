# 🗄️ Guía de Arquitectura de Base de Datos - Paziify (v2.8.10) 🔐

Esta guía detalla la infraestructura de datos de Paziify alojada en **Supabase (PostgreSQL)**. La versión **v2.9.0** se enfoca en la consolidación del almacenamiento de la Academia, la resiliencia offline y la **Unificación de Categorías**.

---

## 1. Principio de Seguridad: Row Level Security (RLS) ... [Mantenido] ...

---

## 2. Diccionario de Datos (Esquema Public)

### `meditation_sessions_content` 🧘
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `audio_layers` | JSONB | Voces (Gaia, Ziro, Aria, Éter), Paisajes, Ondas |
| `breathing_config` | JSONB | Tiempos de inhalación/exhalación (Bio-feedback) |

### 3. Esquema Educativo (Academia v2.8.10) 🎓
| Tabla | Propósito |
| :--- | :--- |
| `courses` | 10 cursos temáticos verificados. |
| `lessons` | 60 lecciones con mapeo técnico único a MP3. |

---

## 4. Políticas de Seguridad (RLS Hardening) 🔐
```sql
-- Storage: Blindaje de buckets v2.8.10
CREATE POLICY "Lectura pública de assets" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('meditation-voices', 'meditation-thumbnails', 'audiobooks', 'soundscapes', 'academy-voices'));
```

---

## 5. Almacenamiento (Supabase Storage) & Optimización Zero-Egress ☁️

| Bucket | Contenido | Política | Estrategia de Caché |
| :--- | :--- | :--- | :--- |
| `meditation-voices` | Voces 101 sesiones | Public Read | `max-age=31536000` |
| `academy-voices` | **Audios Academia (60 archivos técnicos)** | Public Read | **Zero-Egress Persistent Cache** |
| `meditation-thumbnails`| Portadas IA / WebP | Public Read | `max-age=31536000` |
| `audiobooks` | Archivos MP3 narrados | Public Read | Persistent Cache local |

> [!NOTE]
> **Estrategia Zero-Egress**: Se han convertido todas las referencias de audio en `academyData.ts` de rutas relativas a URLs públicas absolutas. Esto permite que el cliente (App) gestione la descarga y persistencia local sin depender de resoluciones de ruta dinámicas en tiempo de ejecución.


---

## 6. Unificación de Categorías (v2.9.0 Standard) 🔗

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
*Última revisión: 14 de Febrero de 2026 - Master Audit v2.9.0 (Zero-Egress & Unified Categories)*

