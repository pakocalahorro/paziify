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
3. **Supabase - Base de datos y Login** 
   - Si en la nota de sesion hay cambios en login o base de datos leer y actualizar `docs/guides/database.md`

4. **Diseño y Audio** 
   - Si en la nota de sesion hay cambios en diseño o audio leer y actualizar `docs/guides/designs_audio.md`

5. **Manual de usuario** 
   - Si en la nota de sesion hay nuevos cambios en cualquier funcionalidad leer y actualizar `docs/guides/user_manual.md`

6. **Commit de cambios** Preguntar si hacemos commit
   - Crear commit con mensaje descriptivo
   - Incluir todos los archivos relevantes

## Ubicaciones de Documentos:

- **Sesiones:** `docs/sessions/`
- **Workflows:** `.agent/workflows/`
- **Guias:** `docs/guides/`