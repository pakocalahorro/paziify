# Nota de Sesión: Blindaje de Sincronización y Refinamiento v2.52.6 (2026-03-18)

Esta sesión se ha centrado en resolver los problemas críticos de pérdida de datos en modo offline y elevar la calidad visual y de feedback de la aplicación.

## Hitos Críticos

### 1. Refinamiento del Tour de Bienvenida (UX)
- **Control de Usuario**: Añadido checkbox "No mostrar más" vinculado a la base de datos (`has_seen_welcome_tour`).
- **Indicadores Estáticos**: Sustitución de halos animados por indicadores fijos amarillos (rectángulos/círculos) para evitar distracciones.
- **Optimización**: Simplificación de ilustraciones y animaciones durante el tour para una carga fluida.

### 2. Blindaje de Integridad de Datos (Zero-Wipeout)
- **Guarda `isProfileLoaded`**: Se ha implementado un bloqueo en `AppContext` que impide que cualquier estado local vacío sobrescriba los datos de Supabase antes de que estos se hayan descargado por completo.
- **Fusión de Datos (Merge)**: Los favoritos y el historial ya no se sobrescriben; ahora se fusionan usando Lógica de Conjuntos (`Set Union`), garantizando que los datos locales y remotos se sumen.
- **Resiliencia Offline**: 
    - Forzado de excepciones (`throw error`) en consultas de analíticas para asegurar el salto a la caché local en caso de fallo de red.
    - Corrección del bug "17m + 5m = 22m": Las estadísticas ahora reflejan la suma real incluso sin conexión.

### 3. Experiencia de Conectividad (Feedback UI)
- **Banner de Estado**: Nuevo componente `ConnectivityBanner` con estados Ámbar (Offline) y Esmeralda (Sincronizando).
- **Auto-Sync**: Implementación de sincronización automática de fondo al recuperar la conexión WiFi.
- **Higiene Visual**: Silenciado de errores técnicos técnicos de red para el usuario final.

### 4. Estabilidad Nativa Android
- **Transparencia Pro**: Configuración de `styles.xml` y `app.json` para barra de navegación 100% transparente (Edge-to-Edge).
- **Fix Memoria (Skia)**: Sustitución de `Shadow` por `BlurMask` en el Árbol de Resiliencia, eliminando cierres inesperados en la pantalla de Perfil.

## Cambios Técnicos
- **Base de Datos**: Nueva columna `has_seen_welcome_tour` (boolean, default false).
- **Dependencias**: Instalación de `@react-native-community/netinfo`.
- **Arquitectura**: Paso de una cola de logs de "borrado total" a una de "borrado granular" por ID.

---
*Sesión finalizada con éxito bajo el protocolo PCO v4.0.*
