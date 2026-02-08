# 🎓 Paziify Academy: Análisis y Estrategia de Implementación (Zero Cost)

## 1. Análisis de Situación Actual

### Estado Actual en Paziify
- **Código Existente**: Tenemos pantallas funcionales (`CBTAcademyScreen`, `CBTDetailScreen`) que renderizan contenido en **Markdown** desde un archivo local (`academyData.ts`).
- **Limitaciones**: 
  - Solo texto (sin audio/video).
  - Datos hardcodeados (no se actualizan desde la nube).
  - Sin seguimiento real de progreso en base de datos (solo local).

### Benchmarking: Apps Líderes 🏆

| App | Enfoque de "Academy/Cursos" | Lección Tipo | Gamificación |
| :--- | :--- | :--- | :--- |
| **Headspace** | **"The Basics"** | Audio guía (10m) + Animación corta (1-2m) | Progreso visual, racha. |
| **Calm** | **"Masterclasses"** | Audio largo (45m) o series episódicas tipo podcast. | Diploma digital al finalizar. |
| **Waking Up** | **"Introductory Course"** | Audio charla teoría (10m) + Meditación práctica (10m). | Estricto orden secuencial. |
| **Insight Timer** | **"Cursos" (Paid)** | 10 Días. Audio + Aula de chat (comunidad). | Reseñas y valoraciones. |

---

## 2. Propuesta: "Paziify Academy" (Estrategia Coste Cero) 💸

Para cumplir el requisito de **0 costes**, aprovecharemos la infraestructura gratuita ya existente (Supabase Free Tier) y evitaremos servicios de hosting de video o plugins de pago.

### A. Formato "Audio-First & Rich Text" 🎧+📝
En lugar de video (que es caro de producir y hostear), proponemos un formato híbrido que ya soportan las apps líderes como Waking Up:
1.  **Lección de Audio (Core)**: La enseñanza principal se entrega en audio (MP3 en Supabase). Es más íntimo, "Zen" y barato.
2.  **Texto Enriquecido (Markdown)**: Resúmenes, ejercicios de escritura y gráficos clave.
3.  **Video (Opcional)**: Si es imprescindible, usamos **YouTube Unlisted** embebido (Coste: 0, pero saca al usuario del "ambiente zen").

### B. Arquitectura Técnica (Supabase) 🏗️

Aprovechando el límite gratuito de 500MB de base de datos y 1GB de almacenamiento de Supabase:

#### 1. Base de Datos (Nuevas Tablas)
```sql
-- Cursos (Ej: "Fundamentos TCC")
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT, -- Imagen en Supabase Storage
  author_id UUID REFERENCES users(id), -- O perfil de "Paziify Team"
  is_published BOOLEAN DEFAULT false
);

-- Lecciones
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  content_md TEXT, -- Markdown completo
  audio_url TEXT, -- MP3 en Supabase
  video_url TEXT, -- Link YouTube (opcional)
  duration_minutes INT,
  order_index INT,
  is_free BOOLEAN DEFAULT false -- Para modelo Freemium
);

-- Progreso de Usuario
CREATE TABLE user_course_progress (
  user_id UUID REFERENCES auth.users(id),
  lesson_id UUID REFERENCES lessons(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);
```

#### 2. Almacenamiento (Storage)
- Bucket existente `audiobooks` o crear `academy-media`.
- **Coste**: $0 (hasta 1GB).

### C. Experiencia de Usuario (UX) ✨

1.  **Discovery (Netflix Style)**:
    - Carrusel horizontal en la sección "Aprender" o tab dedicado.
    - Tarjetas con % de progreso visible.
2.  **Reproductor Híbrido**:
    - Al entrar en una lección, ves el título y un botón **"Escuchar Lección"** (Player flotante).
    - Debajo, el contenido en texto para leer mientras escuchas o después.
3.  **Gamificación**:
    - **Certificados**: Al completar un curso (100%), desbloquear una insignia especial en el perfil ("Maestro TCC").
    - **Racha**: Las lecciones cuentan para la racha diaria.

---

## 3. Hoja de Ruta de Implementación 🗺️

### Fase 1: Migración a Datos Reales (Backend)
- [ ] Crear tablas en Supabase (`courses`, `lessons`, `progress`).
- [ ] Crear bucket `academy-media`.
- [ ] Migrar el contenido de `academyData.ts` a la base de datos.
- [ ] Crear herramienta de subida (script o Admin Panel).

### Fase 2: Reproductor Academy
- [ ] Integrar el `AudioEngineService` para reproducir las lecciones de la academia (tratarlas como una pista de voz).
- [ ] Actualizar `CBTDetailScreen` para incluir botón de Play y barra de progreso.

### Fase 3: Gestión de Progreso
- [ ] Conectar `handleComplete` con la tabla `user_course_progress`.
- [ ] Mostrar barras de progreso reales en el listado de cursos.

---

## 4. Conclusión

Esta estrategia nos permite montar una **Academia de nivel profesional** (equiparable a Waking Up o Calm en funcionalidad) sin **ningún coste recurrente adicional**, utilizando la capacidad ociosa de tu plan actual de Supabase y el almacenamiento local del usuario para la caché.
