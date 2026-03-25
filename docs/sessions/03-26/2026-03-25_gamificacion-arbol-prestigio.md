# Sesión 25-03-2026: Gamificación del Árbol de Resiliencia (Prestigio Logarítmico)

## Hitos Críticos

### 1. Refactorización a Puntos de Luz (Logarítmico)
**Por qué:** El avance por Días Naturales es lineal, se estanca en retos largos y desmotiva.
**Qué:** Se mutó a un sistema de acumulación de puntos (`resilienceLight`) dictaminando el estadio gráfico del árbol con matemática exponencial/logarítmica y 5 colores clave (Shamatha a Zen Absoluto).
**Cambios:** `ResilienceTree.tsx` ahora renderiza el tamaño y el aura (`glow=2.5s`) basándose matemáticamente en este nuevo puntaje.

### 2. Sincronía Offline-Online y Data Race Fixing
**Por qué:** Si el usuario sumaba puntos sin red, y la red volvía de golpe, los listeners podían sobrescribir el progreso real debido a lecturas de caché antiguas.
**Qué:** Se forzó un `userStateRef` transaccional dentro de `AppContext` y se ordenó una purga del TanStack/React Cache en `analyticsService.syncPendingLogs` para asegurar Single Source of Truth tras un volcado de red.

### 3. Omnipresencia y Curvas de Enganche (Master Plan Fase 2)
**Por qué:** La gamificación confinada a la pestaña perfil aislaba al árbol del flujo natural del usuario (la Meditación).
**Qué:** 
  - La lógica se extrajo a un motor global `resilienceUtils.ts`.
  - El `OasisHeader.tsx` ahora inyecta un aura del color del nivel en miniatura sobre el Avatar.
  - Al completar sesiones (`SessionEndScreen.tsx`), se muestran modificadores exponenciales según racha (Plata +2, Oro +5) antes de pulsar Continuar.
  - El Reporte Semanal arranca ahora con un "Hero" coronando al usuario como guerrero místico en vez de con tablas planas.
