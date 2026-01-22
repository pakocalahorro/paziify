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

2. **Crear nota de sesión**
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

3. **Actualizar plan de implementación**
   - Marcar tareas completadas en `docs/plans/implementation_plan.md`
   - Actualizar porcentaje de progreso
   - Ajustar estimaciones si es necesario

4. **Commit de cambios** (opcional)
   - Crear commit con mensaje descriptivo
   - Incluir todos los archivos relevantes

## Ubicaciones de Documentos:

- **Planes:** `docs/plans/`
- **Sesiones:** `docs/sessions/`
- **Workflows:** `.agent/workflows/`
