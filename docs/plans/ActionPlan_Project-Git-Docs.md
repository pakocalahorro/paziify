# 📝 Plan de Acción: Auditoría de Documentación (Code = Git = Docs)
**Fecha**: 19 de Febrero de 2026
**Objetivo**: Sincronización absoluta entre el código fuente (v2.12.0) y la memoria del proyecto (`docs/guides/`).

---

## 🔍 Resultados de la Auditoría

He analizado los 5 documentos principales (`structure.md`, `audio.md`, `database.md`, `designs.md`, `user_manual.md`) comparándolos con el árbol de directorios `src/` actual. 

### 🔴 1. Desfase de Versiones Global (Prioridad Alta)
Varios documentos se quedaron "congelados" en la versión anterior (v2.11.0), mientras que el proyecto y el `user_manual.md` ya avanzaron a la **v2.12.0** (Cardio Science Reliability).
- **Afectados**: `database.md`, `audio.md`, `structure.md`.
- **Acción**: Actualizar cabeceras y fechas de última revisión al 19 de Febrero.

### 🔴 2. Huecos en `structure.md` (Prioridad Alta)
Este es el documento más crítico por ser el "mapa" del proyecto. He detectado que le faltan módulos enteros que sí existen en `src/`:
- **Falta: Módulo `BackgroundSound`**: 
  - Screens: `BackgroundPlayerScreen.tsx`, `BackgroundSoundScreen.tsx`.
  - Components: `SoundscapeCard.tsx`.
- **Falta: Módulo `Gamification`**:
  - Components: `GameContainer.tsx`, `NebulaBreathGame.tsx`, `OrbFlowGame.tsx`.
- **Falta: Actualizaciones en `Academy`**:
  - Asegurar mención de `AcademyCourseDetailScreen.tsx` y `QuizScreen.tsx`.
- **Acción**: Redactar y añadir estas secciones estructurales con la misma sintaxis que el resto del documento.

### 🟡 3. Detalles en `audio.md` (Prioridad Media)
- El documento menciona la estructura de la Academia v2.8, pero falta documentar el mecanismo de "Smart Paths" (`academyData.ts`) y la resolución `https://` absoluta de los audios para evitar el error 400.
- **Acción**: Añadir un pequeño bloque técnico sobre la resiliencia de URLs en `AcademyService`.

### 🟢 4. `designs.md` y `user_manual.md` (Perfectos)
- Estos dos documentos están asombrosamente al día con la v2.12.0. Detallan perfectamente el Cardio Scan v2.0, los componentes bio-métricos y la interfaz de la Academia.
- **Acción**: No tocar, salvo verificar fecha.

---

## 🛠 Plan de Ejecución Propuesto

## 🛠 Plan de Ejecución Propuesto (Pivote Estratégico "Code as Truth")

Tras la consulta CTO/CEO, hemos decidido **abandonar el mantenimiento manual** de documentos de bajo nivel (`structure.md`) por ser ineficiente e insostenible a largo plazo. 

El nuevo plan busca la automatización total de la documentación técnica:

### Fase 1: Limpieza y Archivo (Hoy)
1.  **Archivar `structure.md`**: Moveremos este archivo a una carpeta `docs/archive/` (o le pondremos un aviso `[OBSOLETO]`) indicando que ya no es la Fuente de la Verdad para componentes y pantallas.
2.  **Parche Técnico Mínimo (`audio.md`, `database.md`, `user_manual.md`)**:
    - Actualizar cabeceras a la **v2.12.0**.
    - Añadir una breve nota técnica en `audio.md` sobre los Smart Paths.
    Estos documentos se mantienen por ser estratégicos (no cambian con cada nuevo botón).

### Fase 2: Automatización (Próximos Sprints)
1.  **UI/Componentes -> Storybook**: Implementar el plan arquitectónico (`docs/plans/storybook_implementation.md`) para que los componentes se autocumenten visualmente mediante historias.
2.  **Arquitectura/APIs -> TypeDoc + JSDoc**: Adoptar el estándar de comentar funciones clave en TypeScript para generar un sitio web documental automático.
3.  **Mapa de Proyecto -> Dependency Graphs**: Usar herramientas (ej. Dependency Cruiser) para generar mapas `.svg` de la carpeta `src/` automáticamente en cada commit.

> **Nota del CTO (IA)**: Este pivote nos ahorra horas de mantenimiento burocrático en cada cierre de sesión. Dejamos de ser escribanos para ser ingenieros.

***

¿Me das permiso para ejecutar este plan y sincronizar los archivos exactos ahora mismo?
