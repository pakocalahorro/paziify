# Nota de Sesión: Evolución del Ecosistema Oasis (v2.33.5) 🌴
**Fecha:** 25 de Febrero de 2026

## Hitos Críticos de la Sesión

### 1. Rediseño de Perfil y Ajustes (Oasis UX)
- **Problemática**: Fragmentación de ajustes y botones redundantes de reporte.
- **Solución**: Se ha unificado la gestión de datos en un nuevo centro de **Ajustes** y se ha simplificado el **Perfil**.
- **Impacto**: Reducción de la carga cognitiva y mejora en la jerarquía visual siguiendo el concepto de "Santuario".

### 2. Intelligent Notifications & Streak Protection
- **Nueva Lógica**: El `NotificationService` ahora programa notificaciones basadas en el nivel de racha del usuario (`streak_1` hasta `streak_30`).
- **Peligro de Racha**: Alerta proactiva a las 21:30 para usuarios con racha > 3 que no han meditado aún ese día.
- **Dinamismo**: Sincronización con plantillas remotas de Supabase.

### 3. Sincronización Zero-Friction (Health Pro)
- **Innovación**: Eliminación del botón "Guardar" en el perfil de salud.
- **Técnica**: Implementación de un efecto de auto-sync debounced que persiste cambios en Supabase y estado local transparentemente.
- **Fix**: Corrección del cálculo de edad y formato de fecha ISO para asegurar diagnósticos precisos en Cardio Scan.

## Cambios por Componente

### App (src/)
- `ProfileScreen.tsx`: Fusión de botones de reporte y reorganización del header.
- `NotificationSettings.tsx`: Overhaul completo de la pantalla de ajustes.
- `NotificationService.ts`: Refactor para soportar plantillas dinámicas y programación de rachas.
- `AppContext.tsx`: Integración de disparadores de re-programación de notificaciones.

### Documentación
- Actualización de todas las guías maestras a **v2.33.5**.
- Creación de `testing_notifications_guide.md`.
- Actualización de `walkthrough.md`.

## Próximos Pasos (Milestone v2.34)
1. Implementación de Zen Widgets dinámicos.
2. Refinamiento de la pantalla de Reporte Semanal con Bio-Ritmos agregados.

---
*Paziify: Elevando la tecnología al servicio de la paz mental.*
