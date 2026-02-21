# 🗄️ Guía de Arquitectura de Base de Datos - Paziify (v2.30.0) 🔐

Esta guía detalla la infraestructura de datos de Paziify alojada en **Supabase (PostgreSQL)**. La versión **v2.30.0** consolida la unificación de buckets de storage y el sistema de carpetas dinámicas.

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

### 3. Esquema Educativo (Academia v2.8.10) 🎓
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

## 7. Privacidad Bio-métrica (v2.11.0) 🧬🛡️

Con la introducción del **Escáner Cardio Premium** en v2.11.0, se establece un protocolo estricto de no-persistencia para datos sensibles:

- **Zero Cloud Storage**: Los datos crudos del sensor rPPG (frames de video) y las métricas calculadas (BPM, HRV, Stress Level) **NUNCA** se envían a Supabase ni a ningún servidor externo.
- **Procesamiento Local (Edge)**: Todo el análisis de señal mediante el algoritmo POS ocurre estrictamente en el dispositivo del usuario (`BioSignalProcessor.ts`).
- **Persistencia Efímera**: Los resultados solo existen en la memoria volátil de la sesión (`Context`) y se descartan al cerrar la pantalla de resultados, a menos que el usuario decida explícitamente guardarlos en su historial local (AsyncStorage, no Cloud).

Esta arquitectura garantiza el cumplimiento de normativas de privacidad y confianza del usuario.

---
*Última revisión: 21 de Febrero de 2026 - Versión 2.15.0 (Premium Audio & Admin Sync)*

