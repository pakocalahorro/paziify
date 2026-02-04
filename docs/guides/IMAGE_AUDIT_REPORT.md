# Auditoría de Imágenes y Plan de Optimización (Fase 1 y 2)

Este documento detalla el estado actual del catálogo de 119 sesiones de Paziify y establece la estrategia técnica para la carga eficiente del contenido.

## Fase 1: Auditoría de Imágenes

### Resumen Estadístico
- **Total Sesiones**: 119
- **Imágenes en Supabase**: 24 (20% del catálogo)
- **Placeholders (Unsplash)**: 4 detectadas
- **Pendientes de Asignación**: 91 (76.5% del catálogo)

### Estado por Categoría

| Categoría | Sesiones | Imágenes OK | Pendientes | Detalle / Observaciones |
| :--- | :--- | :--- | :--- | :--- |
| **Calma SOS** | 18 | 15 | 3 | La mayoría tiene assets técnicos (orbes). |
| **Mindfulness** | 12 | 0 | 12 | Todo pendiente o local. |
| **Sueño** | 17 | 9 | 8 | Gran avance, pero faltan 8 sesiones clave. |
| **Resiliencia** | 12 | 0 | 12 | 100% pendiente. |
| **Rendimiento** | 10 | 0 | 10 | 100% pendiente. |
| **Despertar** | 10 | 0 | 10 | 100% pendiente. |
| **Salud** | 10 | 0 | 10 | 100% pendiente. |
| **Hábitos** | 10 | 0 | 10 | 100% pendiente. |
| **Emocional** | 10 | 0 | 10 | 100% pendiente. |
| **Niños** | 10 | 0 | 10 | 100% pendiente. |

### Detalle de Archivos en Supabase (Optimización Necesaria)
| Archivo | Tamaño Original | Formato | Problema |
| :--- | :---: | :---: | :--- |
| `aria_avatar.png` | 666 KB | PNG | Crítico (Avatar) |
| `calma_sos_panic_roots_...png` | 825 KB | PNG | Muy pesado |
| `calma_sos_sensory_...png` | 860 KB | PNG | Crítico |
| **Promedio Actual** | **~600 KB** | **PNG** | **Bloqueo de Rendimiento** |

---

## Fase 2: Estrategia de Optimización (CTO Recommendation)

### 1. Estándar Técnico de Assets
Para evitar la lentitud en el catálogo (119 ítems), implementaremos el siguiente estándar:
- **Formato**: **WebP** (sustituyendo a PNG/JPG). Es el formato más eficiente para web/móvil.
- **Resolución Máxima**: **800x800 px** (Garantiza nitidez en tablets y pantallas Retina).
- **Peso Objetivo**: **< 80 KB** por imagen (sigue siendo una reducción del 85% vs actual).
- **Calidad**: 75-80% (imperceptible en pantallas pequeñas).

### 2. Estilo Visual (IA Prompting)
Las nuevas imágenes deben seguir un estilo coherente:
- **Conceptos**: Naturalidad, Realismo, Humanidad.
- **Paleta**: Bio-luminiscente (ver Guía Maestra).
- **Evitar**: Diseños abstractos planos o CGI excesivamente artificial.

### 3. Próximos Pasos (Hoja de Ruta)
1. **Limpieza**: Descargar los 24 archivos actuales, convertirlos a WebP (600px) y resubirlos.
2. **Generación por Secciones**:
   - Bloque 1: **Salud y Emocional** (Prioridad por ser nuevas).
   - Bloque 2: **Niños** (Estilo Gaia).
   - Bloque 3: **Rendimiento y Despertar** (Estilo Ziro).
3. **Automatización**: Actualizar `sessionsData.ts` masivamente con las nuevas URLs WebP.

---
*Documento generado por Antigravity (CTO AI) - 04/02/2026*
