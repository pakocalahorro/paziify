# Sesión: Algoritmo Dinámico de Rotación de Contenidos
**Fecha:** 25 Marzo 2026 | **Versión:** v2.54.0 | **Sprint:** Auditoría Pre-Lanzamiento

---

## Contexto Estratégico — El "Alma" de la Sesión

La auditoría pre-lanzamiento reveló que `HomeScreen` mostraba siempre el mismo contenido porque `recommendations` usaba `.find()` estático sobre arrays de Supabase. Para un catálogo que crecerá de las ~30 sesiones actuales a 500+, hardcodear IDs o depender del primer elemento es un antipatrón que destruye la retención del usuario.

**Decisión arquitectural clave:** el Admin Panel es la única fuente de verdad. El campo `slug` actúa como "sello de calidad" — solo el contenido validado entra en rotación. El código define *intenciones terapéuticas* (categorías), nunca sesiones concretas. Esto garantiza que cualquier nueva sesión subida por el admin entre automáticamente en rotación sin tocar código.

Esta misma filosofía se extendió a audiolibros y soundscapes, alineando los tres tipos de contenido bajo el mismo patrón.

---

## Hitos Técnicos

### H1 — Migración SQL (Supabase `ueuxjtyottluwkvdreqe`)
```sql
ALTER TABLE audiobooks ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE soundscapes ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
-- meditation_sessions_content.slug ya existía como TEXT ✓
```

### H2 — Motor del Algoritmo (`src/services/contentService.ts`)
Tres exportaciones nuevas que forman el núcleo del sistema:
```typescript
export const getDayOfYear = (): number => { ... };          // seed diario
export const pickSessionByDaySeed = <T>(items, offset) => { // selector determinista
    return items[(getDayOfYear() + offset) % items.length];
};
// Nuevo método: solo sesiones con slug != null (validadas por admin)
sessionsService.getSessionsByTheme(category: string): Promise<MeditationSessionContent[]>
```
SELECT de `getAll()` actualizado para incluir `slug`.

### H3 — Programas de Evolución (`src/constants/challenges.ts`)
- Nuevo tipo `SessionTheme { category: string, mood?, intent? }`
- `category: string` libre (TEXT en Supabase) — sin enum que mantener jamás
- 5 programas con guiones terapéuticos por categoría (no IDs hardcodeados):
  - **Sprint SOS** (3d): Intervención → Estabilización → Cierre
  - **Pausa Express** (3d): Cortar → Soltar → Renovar
  - **Senda de la Calma** (7d): Descender → Arraigarse → Expandirse → Consolidar
  - **Senda del Foco** (7d): Activar → Enfocar → Profundizar → Anclar
  - **Desafío Paziify** (30d): 5 semanas temáticas (Calma→Presencia→Despertar→Resiliencia→Integración)

### H4 — Resolución Dinámica del Reto (`src/screens/Meditation/SessionEndScreen.tsx`)
Al completar un día de reto, la sesión del día siguiente se resuelve en runtime:
```typescript
const nextTheme = challenge?.sessionSchedule?.[nextDay]; // { category: 'calmasos' }
const available = await sessionsService.getSessionsByTheme(nextTheme.category);
const picked = pickSessionByDaySeed(available, nextDay);
nextSessionSlug = picked?.legacy_id || picked?.slug || currentSlug; // fallback seguro
```

### H5 — Rotación Home (`src/screens/Home/HomeScreen.tsx`)
5 contenidos con seed diario, offsets independientes (0-4):
| Contenido | Offset | Pool |
|:---|:---|:---|
| Meditación | 0 | slug-validadas filtradas por modo |
| Audiolibro | 1 | slug-validados · fallback: todos |
| Relato | 2 | filtrados por mood del modo |
| Música | 3 | slug-validados · fallback: todos |
| Academia | 4 | filtrados por modo |

**Invariante protegida:** si hay reto activo, "Tu práctica de hoy" no rota — siempre muestra la sesión del reto.

### H6 — Tipos TypeScript (`src/types/index.ts`)
```typescript
MeditationSessionContent: + slug?: string | null
Audiobook:                + slug?: string | null
RealStory:                + duration_minutes?: number
```

---

## Validación
```
✅ npm run test:ojo    → PASS (1/1)
✅ npm run test contentService → PASS (3/3)
✅ Migración SQL → success
✅ Zero regressions
```

---

## Backlog (Post-lanzamiento)
- **Árbol de Resiliencia** → Sistema de Luz (puntuación acumulativa logarítmica)
- **Día 0 del reto** → resolución dinámica al activar programa
- **Personalización** → filtro por `mood_tags` del perfil de usuario (cuando catálogo > 100 sesiones)
