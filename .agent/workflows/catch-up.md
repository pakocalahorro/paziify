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

2. **Git - Leer novedades ultima version Git** 
   - Informar al usuario de la ultima version de git, master, github
   - Comparar ultima version de Git con las ultimas notas de sesion e informar si coincide todo o hay diferencias

3. **Visión de Producto & Guías (LECTURA OBLIGATORIA)**
    - **Imprescindible**: Leer los 5 pilares de documentación para entender el estado actual:
      - `docs/guides/structure.md`: **[NUEVO]** Mapa completo del proyecto (pantallas, componentes, servicios, navegación).
      - `docs/guides/user_manual.md`: Funcionalidad y UX (v2.x).
      - `docs/guides/audio.md`: Arquitectura del motor, guías premium y auditoría.
      - `docs/guides/database.md`: Datos, esquema y seguridad RLS.
      - `docs/guides/designs.md`: Sistema de diseño Skia e identidad visual.
    - Esto garantiza que no reinventemos la rueda ni rompamos la consistencia.



5. **Health Check (Sanidad del Proyecto)**
   - Revisar archivos modificados recientemente (`git status`).
   - Verificar `package.json` en busca de nuevas dependencias sorpresa.
   - Confirmar que no hay errores de compilación obvios.

6. **Resumir al usuario**
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