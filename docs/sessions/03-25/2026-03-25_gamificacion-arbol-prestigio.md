# Sesión 25-03-2026: Gamificación del Árbol de Resiliencia (Prestigio Logarítmico)

## 1. Resumen de Ejecución
Se ha implementado íntegramente el sistema de prestigio infinito del Árbol de Resiliencia ("Resilience Light"), transformándolo de un trackeador estático de retos lineales a una entidad viva que acumula la paz del usuario y reacciona con métricas universales en toda la arquitectura de Paziify.

## 2. Hitos Críticos y Arquitectura

### 🌳 El Nuevo Corazón del Árbol (`ResilienceTree.tsx`)
**Por qué:** El progreso en días (métricas lineales) se volvía plano en retos largos y la motivación estancaba.
**Qué:** Se mutó a un sistema de acumulación de puntos (`resilienceLight`) en Supabase.
**Mejoras Técnicas:**
- **Rendimiento 0ms**: La geometría base de las ramas carga instantáneamente en el frame inicial, evitando el efecto visual de recarga "lenta" al cambiar de pestaña.
- **Efecto Wow (2.5s)**: Las luces y auras ("Blooms") emergen con un suavizado diferencial, proporcionando recompensa neurológica paulatina sin estresar el hilo de UI.
- **Colores de Prestigio (Logarítmicos)**: Mapeo matemático de `lightPoints` a 5 niveles espirituales dinámicos: Naranja (Shamatha), Azul (Vipassana), Verde (Metta), Morado (Bodhi) y Oro (Zen Absoluto).

### 🧠 El Cerebro: Puntos y Penalizaciones
- **Fórmula de Crecimiento**: Sesiones normales (+3), Sesiones de reto (+5). Bonus de +1 al reportar un buen estado (Bio-Feedback dinámico in situ).
- **Mecánica de Erosión / Decaimiento**: El sistema lee `lastMeditationDate` al recargar la sesión. Si detecta más de 48h de inactividad, restará `resilienceLight` emulando el marchitamiento sutil del hábito a cuidar.

### 🌐 Blindaje de Sync Offline-Online (`AppContext.tsx` & `analyticsService.ts`)
**Por qué:** Volcar datos acumulados offline de golpe corrompía las cachés de React borrando temporalmente el progreso visual en la UI.
**Solución Técnica:**
- **Blindaje del NetInfo**: El listener de reconexión ahora lee el estado atómico actualizado sin cierres léxicos obsoletos (`userStateRef.current`).
- **Purga Táctica de Cachés**: Tras reconectar y enviar las sesiones locales, se fuerza una aniquilación selectiva del TanStack Query (`_memCache.clear()`). Esto obliga a la App a consumir la *"Single Source of Truth"* validada, dibujando los datos perfectos en la Home sin *Data Races*.

## 3. Omnipresencia y Curvas de Enganche (Master Plan Fase 2)
**Por qué:** La gamificación confinada exclusivamente en la pestaña Perfil perdía efectividad al no acompañar al usuario en su navegación diaria.
**Ejecución de Alta Fidelidad:**
- **Diccionario Central (`resilienceUtils.ts`)**: Base algorítmica inyectable globalmente.
- **El Avatar Coronante (`OasisHeader.tsx`)**: En todas las cabeceras de la app, la foto del usuario presenta ahora un borde luminoso `borderColor` tintado dinámicamente según su Fase Actual (Ej. Vipassana = Halo Celeste), aportando recordatorios de gloria sin interferir con componentes nativos.
- **Multiplicadores de Hábito (Streak Boosters)**: En `SessionEndScreen` se recompensa la constancia agresivamente antes del guardado (Ej: `+3 Por Práctica`, `+1 Bio-Feedback`, `+5 Racha Oro`). Reduce los días para subir de nivel si el usuario concentra el hábito.
- **Hero de Coronación (`WeeklyReportScreen.tsx`)**: Sustitución de la entrada fría de datos por un componente iluminado "Hero" que corona al usuario y muestra el Árbol nativo en alta definición (100x100) nada más abrir su parte semanal.
