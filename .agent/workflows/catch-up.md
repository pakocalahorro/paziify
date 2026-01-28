---
description: Ponerse al día con el estado del proyecto
---

# Workflow: Catch Up

Este workflow se ejecuta al iniciar una nueva sesión para ponerse al corriente del estado del proyecto.

## Pasos:

1. **Leer la última sesión**
   - Abrir `docs/sessions/` y leer la nota más reciente, pueden existir varias en el ultimo dia, leer todas
   - Identificar:
     - ✅ Qué se logró
     - ⚠️ Qué problemas quedaron pendientes
     - 🎯 Qué se planeó hacer después

2. **Supabase - Base de datos y Login** 
   - Leer `docs/guides/database.md` para estar al corriente y aplicar buenas practicas a los nuevos cambios

3. **Diseño y Audio** 
   - Leer `docs/guides/designs_audio.md` para estar al corriente y aplicar buenas practicas a los nuevos cambios

4. **Verificar estado del código**
   - Revisar archivos modificados recientemente
   - Verificar si hay errores pendientes
   - Comprobar estado de dependencias

5. **Resumir al usuario**
   - Crear resumen conciso:
     ```
     📊 Estado del Proyecto Paziify
     
     Última sesión: [Fecha]
     Milestone actual: [Nombre] ([X]% completado)
     
     Logros recientes:
     - [Lista]
     
     Pendiente:
     - [Lista]
     
     ¿En qué quieres trabajar hoy?
     ```

## Ubicaciones de Documentos:

- **Planes:** `docs/plans/`
- **Sesiones:** `docs/sessions/`
- **Workflows:** `.agent/workflows/`
- **Guias:** `docs/guides/`