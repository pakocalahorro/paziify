# Guía de Pruebas: Sistema de Notificaciones Paziify

Esta guía detalla cómo verificar que las notificaciones inteligentes de Paziify funcionan correctamente, desde los permisos iniciales hasta los recordatorios de racha dinámicos.

## 1. Verificación de Permisos
El primer paso es asegurar que la app tiene permiso para enviar notificaciones.

- **Prueba:** Abre la app por primera vez o ve a **Ajustes de Perfil**.
- **Acción:** Si nunca has aceptado, la app debería pedir permiso.
- **Validación:** Ve a los ajustes del sistema de tu teléfono y verifica que Paziify tiene las notificaciones permitidas.

## 2. Pruebas de Notificaciones Programadas (Mañana/Noche)
Estas notificaciones dependen de las horas configuradas en **Ajustes de Perfil**.

### Método "Forzar Tiempo" (Recomendado para testing rápido):
1. Ve a **Ajustes de Perfil**.
2. Cambia la **Hora de Mañana** a 2 o 3 minutos después de tu hora actual real.
3. Asegúrate de que el toggle "Rutina de Mañana" esté activado.
4. Sal de la app o ponla en segundo plano.
5. **Resultado:** Deberías recibir la notificación a la hora configurada.

## 3. Pruebas de Recordatorios de Racha
El sistema elige diferentes mensajes según los días de racha actuales.

- **Prueba de "Racha en Peligro":**
    - Configura tu racha a 3 o más en el **Admin Panel** de Supabase (o mediante código temporal).
    - Asegúrate de que hoy **no has meditado**.
    - Configura la hora del sistema (o espera) a las 21:30.
    - **Resultado:** Deberías recibir la alerta de "Peligro de Racha".

## 4. Validación Técnica (Supabase)
Las notificaciones no tienen el texto "hardcoded", se bajan de Supabase.

1. Entra en tu panel de Supabase -> Tabla `notification_templates`.
2. Busca la plantilla tipo `morning`.
3. Cambia el título o cuerpo (ej: añade "!" al final).
4. En la app, ve a **Ajustes de Perfil** (esto fuerza una descarga de plantillas/reschedule).
5. Espera a la siguiente notificación programada.
6. **Resultado:** El texto debe reflejar los cambios hechos en Supabase.

## 5. Pruebas en Dispositivos Físicos vs Emuladores
- **Simulador iOS:** Soporta notificaciones locales programadas.
- **Emulador Android:** Soporta notificaciones locales programadas.
- **Notificaciones Push:** **SOLO** funcionan en dispositivos físicos reales.

## Tips para Desarrolladores
Si quieres lanzar una notificación inmediata para ver cómo queda el diseño:
- Puedes llamar a `NotificationService.sendImmediate('streak_3', { name: 'Paco', streak: '3' })` desde cualquier `useEffect` o botón temporal.

---
*Paziify v2.33.5 • Oasis Design Ecosystem*
