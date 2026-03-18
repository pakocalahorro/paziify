# Análisis Profundo: Sincronización y Resiliencia de Datos

Este documento analiza las debilidades actuales del sistema de sincronización de Paziify y propone una arquitectura de "Cero Errores" para garantizar que la información del usuario circule correctamente sin pérdidas ni colapsos.

## 1. Auditoría de Riesgos (Vulnerabilidades Detectadas)

### A. El "Bug del Borrado de Cola" (Crítico)
En `analyticsService.ts`, tras una subida exitosa de una sesión, se llama a `LocalAnalyticsService.clearLogs()`.
- **Riesgo**: Si el usuario ha realizado 3 sesiones offline (pendientes) y la 4ª se hace online, la subida exitosa de la 4ª **borra las otras 3 de la memoria local** antes de que tengan oportunidad de subir.
- **Impacto**: Pérdida de minutos y progreso del usuario en entornos con red inestable.

### B. Conflicto de "Tiro de Cuerda" (Tug-of-War)
`AppContext` carga el perfil de Supabase asincrónicamente.
- **Riesgo**: Si el usuario marca un favorito o acepta un reto justo después de abrir la app pero *antes* de que termine la carga de Supabase, esa nueva acción local será **sobrescrita** por el valor antiguo que viene de la nube.
- **Impacto**: Sensación de "lag" o de que la app no guarda los cambios recientes.

### C. Estratigrafía de Carga Inconsistente
Paziify usa dos sistemas de caché diferentes:
1. **React Query**: Para el catálogo (Sesiones, Audio). Es muy robusto y usa persistencia en `AsyncStorage`.
2. **Efectos Manuales**: Para el Perfil y Retos. Estos son más propensos a condiciones de carrera (race conditions).

---

## 2. Mapa de Recorrido del Dato (Arquitectura Actual)

| Dato | Recorrido (Offline → Online) | Garantía de Entrega |
| :--- | :--- | :---: |
| **Logs de Sesión** | Mobile → Local Queue → Supabase (Logs) | Media |
| **Reto Activo** | Mobile → UserState → Supabase (Profiles) | Baja |
| **Favoritos** | Mobile → UserState → Supabase (Profiles) | Baja |
| **Contenido** | Supabase → Cloudflare → Mobile Cache | Muy Alta |

---

## 3. Plan de Blindaje (Propuestas de Mejora)

### Fase 1: Sincronización de Conjuntos (Sets)
No debemos reemplazar las listas de IDs (Favoritos/Completados), debemos **unirlas**.
```typescript
// En AppContext.tsx
favoriteSessionIds: [...new Set([...remoteData, ...localPrev])]
```

### Fase 2: Gestor de Sincronización (Sync Manager)
Implementar una función que se ejecute en segundo plano o al recuperar la conexión (`NetInfo`):
1. Recupera la cola de `LocalAnalyticsService`.
2. Intenta subir cada log **uno por uno**.
3. Elimina de la memoria local **solo** los que reciban confirmación de éxito (200 OK) de Supabase.

### Fase 3: Timestamping (Sellado de Tiempo)
Añadir una marca de tiempo a cada cambio en el `userState`. Al sincronizar:
*   Si `local_updated_at > remote_updated_at`, el móvil manda el cambio a la nube.
*   Si `remote_updated_at > local_updated_at`, el móvil descarga el cambio de la nube.

---

## 4. Prevención de Colapsos (Escalabilidad)

Para evitar que el crecimiento de usuarios sature Supabase:
1. **ZeroEgress Total**: Seguir moviendo consultas de agregación (ej. total de minutos del mes) a funciones de base de datos o resultados cacheados en CDN.
2. **Paginación en Perfil**: No cargar los 1000 logs del historial de golpe; cargar solo los últimos 20 y pedir más bajo demanda.

---
*Análisis técnico realizado por Paziify AI Suite - v2.52.2*
