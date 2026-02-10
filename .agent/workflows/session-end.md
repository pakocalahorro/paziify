---
description: Guardar el progreso de la sesión actual
---

# Workflow: Session End

Este workflow se ejecuta al finalizar una sesión de trabajo para documentar todo lo realizado.

## Pasos:

1. **Revisar el trabajo realizado (VISION HOLÍSTICA)**
   - **CRÍTICO: Leer `task.md` y `walkthrough.md` completos** para identificar todas las tareas marcadas como `[x]` y los hitos registrados en esta sesión.
   - **Historial de Chat**: Revisar los mensajes del usuario para recordar objetivos mayores (ej. "Implementar X", "Refactorizar Y").
   - **Archivos Modificados**: Usar `git status` como apoyo secundario.


2. **Crear nota de sesión** si ya existe una nota en el mismo dia se crea otra nueva con otro nombre indicando los nuevos cambios.
   - Archivo: `docs/sessions/YYYY-MM-DD_descripcion.md`
   - Formato:
     ```markdown
     # Sesión [Fecha] - [Título]
     
     ## Resumen
     [Descripción breve]
     
     ## Logros
     - [Lista de logros]
     
     ## Problemas
     - [Problemas encontrados]
     
     ## Próximos Pasos
     - [Tareas pendientes]
     
     ## Progreso
     [Estado del milestone actual]
     ```

3. **Walkthrough & Infraestructura**
   - **Obligatorio**: Actualizar `walkthrough.md` con un resumen técnico acumulativo de los logros.
   - **Condicional**: Si hubo cambios de entorno (scripts, build, etc.), actualizar `README.md`.

4. **Guías Técnicas & README (Actualización en Cascada)** 
    - **README**: El archivo `README.md` **DEBE** actualizarse con la nueva versión y el resumen de cambios destacados.
    - **Base de Datos**: Si hubo cambios en esquema/auth -> Actualizar `docs/guides/database.md`.
    - **Audio**: Si hubo cambios en voces, motor o auditoría -> Actualizar `docs/guides/audio.md`.
    - **Diseño**: Si hubo cambios visuales/Skia -> Actualizar `docs/guides/designs.md`.
    - **Manual de Usuario**: Si hubo cambios funcionales -> Actualizar `docs/guides/user_manual.md`.

5. **Documentación Técnica & Funcional (OBLIGATORIO)**
    - **Antes de cerrar**, revisa y actualiza los 5 pilares de documentación:
      - `README.md`: ¿La versión y el roadmap están al día?
      - `docs/guides/user_manual.md`: ¿Hay nuevas funciones o cambios de UX?
      - `docs/guides/audio.md`: ¿Nuevos parámetros de voz, cambios en el motor o auditoría?
      - `docs/guides/database.md`: ¿Cambió el esquema, RLS o diccionarios?
      - `docs/guides/designs.md`: ¿Nuevos componentes Skia, fuentes o assets visuales?
    - *Validación*: El usuario debe confirmar que estos docs reflejan la realidad v2.x del proyecto.

6. **Control de Versiones y Commit**
   - **Verificación**: Comparar versión en `package.json` vs el último `git tag`.
   - **Decisión**: 
     - Si los cambios son menores/fix -> Mantener versión o patch (+0.0.1).
     - Si son nuevas features -> Minor (+0.1.0).
     - Si es refactor mayor -> Major (+1.0.0).
   - **Commit**: Crear commit con mensaje descriptivo (ej: `feat: ...`, `fix: ...`).
   - **Tagging (CRÍTICO)**: Generar SIEMPRE el tag correspondiente (ej: `git tag v1.2.0`) para mantener sincronía.

## Ubicaciones de Documentos:

- **Sesiones:** `docs/sessions/`
- **Workflows:** `.agent/workflows/`
- **Guias:** `docs/guides/`