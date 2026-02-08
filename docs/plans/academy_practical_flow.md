# 🎓 Academia Paziify: Flujo Práctico y Análisis de Esfuerzo

Este documento detalla el paso a paso de la experiencia de usuario y "destripa" el trabajo real que implica para nosotros cada etapa.

## 🔄 El "Viaje del Usuario" (User Journey)

### Paso 1: El Usuario entra en "Academia" 🏠
*El usuario toca la pestaña "Aprender" o el banner de la Academia en la Home.*

**Lo que ve:**
- Un carrusel atractivo con cursos disponibles (ej. "Ansiedad Social", "Duelo", "Productividad").
- Cada tarjeta muestra: Título, Autor, Duración Total y **Barra de Progreso** (si ya empezó).

**🛠️ Esfuerzo para Nosotros:**
*   **Dev (Código - Una sola vez):**
    *   Crear pantalla `AcademyHub`.
    *   Conectar con Supabase para traer la lista de `courses`.
    *   *Complejidad:* **Media (2-3 horas)**.
*   **Contenido (Recurrente):**
    *   Diseñar la carátula del curso (Imagen vertical estilo Netflix).
    *   Redactar título y descripción corta.
    *   *Tiempo:* **30 min por curso**.

---

### Paso 2: Elige un Curso ("Fundamentos TCC") 👆
*El usuario toca una tarjeta.*

**Lo que ve (Detalle del Curso):**
- Portada grande y bonita.
- Lista de lecciones ("Módulo 1", "Módulo 2"...).
- Estado de cada lección: 🔒 Bloqueado / ▶️ Pendiente / ✅ Completado.
- Botón grande: **"Continuar Lección 3"** (Smart Action).

**🛠️ Esfuerzo para Nosotros:**
*   **Dev (Código):**
    *   Pantalla `CourseDetailScreen`.
    *   Lógica de bloqueo (si la lección 1 no está hecha, la 2 está candada - *opcional*).
    *   *Complejidad:* **Baja (ya tenemos la base UI)**.
*   **Contenido:**
    *   Estructurar el temario (¿Qué lecciones van?).
    *   *Tiempo:* **1 hora de planeación**.

---

### Paso 3: REALIZA UNA LECCIÓN 🎧📖
*El usuario toca "Lección 1: El Pensamiento Automático".*

**Lo que ve (El Player Híbrido):**
1.  **Reproductor de Audio (Arriba)**: Botón Play, barra de tiempo. Es la "clase magistral".
2.  **Contenido de Texto (Abajo)**: Resumen, puntos clave y quiz interactivo.

**🛠️ Esfuerzo para Nosotros (Aquí está el trabajo real):**
*   **Dev (Código):**
    *   Adaptar el `AudioEngine` para reproducir "lecciones" (es fácil, ya reproduce MPs3).
    *   Renderizar Markdown con estilo.
    *   *Complejidad:* **Baja (Reutilizamos código existente)**.
*   **Contenido (EL GRUESO DEL TRABAJO):**
    *   **Guion (Script):** Escribir lo que se va a decir. *(2 horas)*.
    *   **Grabación/TTS:** Grabar la voz (humana o IA de calidad). *(30 min)*.
    *   **Edición Audio:** Añadir música de fondo suave (Paziify style). *(30 min)*.
    *   **Redacción Texto:** Escribir el resumen Markdown para la app. *(30 min)*.
    *   **Total por Lección:** ~3-4 horas de trabajo creativo.

---

### Paso 4: Termina la Lección 🎉
*El audio termina o el usuario marca "Completado".*

**Lo que pasa:**
- Confeti / feedback háptico.
- **+10 Puntos de Resiliencia**.
- Se marca la lección como ✅ en base de datos.
- Se desbloquea la siguiente lección.

**🛠️ Esfuerzo para Nosotros:**
*   **Dev (Código):**
    *   Llamada a API `mark_lesson_complete`.
    *   Actualizar estado local.
    *   *Complejidad:* **Media (Lógica robusta de sincronización)**.
*   **Contenido:**
    *   Nada (es automático).

---

## 📊 Resumen de Recursos necesarios

Para lanzar **1 Curso Piloto de 5 Lecciones**:

| Recurso | Tiempo Estimado | Coste Monetario | Quién lo hace |
| :--- | :--- | :--- | :--- |
| **Desarrollo (App)** | 8-12 horas | 0€ (Equipo interno / Tú) | CTO / Dev |
| **Infraestructura** | 2 horas | 0€ (Supabase Free) | CTO |
| **Creación Contenido** | 20 horas | 0€ (Si usamos IA/TTS) | Content Creator |
| **Diseño Gráfico** | 2 horas | 0€ (Canva/Figma) | Diseñador |

### 🚀 MVP Recomendado: "Curso de Introducción a TCC"
- **Estructura**: 1 Módulo, 3 Lecciones (5 min cada una).
- **Formato**: Audio generado con IA (ElevenLabs o similar - *coste bajo*) o Grabado por nosotros.
- **Objetivo**: Probar el flujo técnico antes de invertir semanas en crear contenido masivo.
