---
description: Guardar el progreso de la sesión actual
---

# Workflow: Session End

Este workflow se ejecuta al finalizar una sesión de trabajo para documentar todo lo realizado.

## Pasos:

1. **Revisar el trabajo realizado**
   - Listar archivos modificados
   - Identificar logros principales
   - Detectar problemas pendientes


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
   - **Condicional**: Si hubo cambios de entorno (scripts, build, etc.), actualizar `docs/README.md`.

4. **Guías Técnicas (Actualización en Cascada)** 
   - **Base de Datos**: Si hubo cambios en esquema/auth -> Actualizar `docs/guides/database.md`.
   - **Diseño/Audio**: Si hubo cambios visuales/sonoros -> Actualizar `docs/guides/designs_audio.md`.
   - **Manual de Usuario**: Si hubo cambios funcionales -> Actualizar `docs/guides/user_manual.md`.


5. **Control de Versiones y Commit**
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