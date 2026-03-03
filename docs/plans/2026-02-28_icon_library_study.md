# Estudio de Diseño: Sistema de Iconografía Premium (v2.35+)

**Fecha:** 2026-02-28
**Estado:** [PENDIENTE / EN PAUSA]

## Contexto
Se evaluó la migración desde `Ionicons` (actual) hacia un sistema de trazo fino que complemente el **Glassmorphism** de Oasis y la tipografía `Satisfy`.

## Opciones Evaluadas

### 1. Feather Premium (Clean & standard)
*   **Vibe:** Minimalismo suizo, técnico, muy limpio.
*   **Decisión:** Opción eficiente pero menos diferenciadora. Ya integrada en `@expo/vector-icons`.

### 2. Solar Icons (Luxury & Organic)
*   **Vibe:** Curvas suaves, "Soft Corners", trazo "Linear Duotone".
*   **Análisis CTO:** Es la opción que mejor encaja con la psicología de "Paz" y el lujo orgánico. Acompaña mejor a la fuente `Satisfy`.

### 3. Iconoir (High-End Editorial)
*   **Vibe:** Geometría perfecta, extremada sofisticación.
*   **Análisis CTO:** Ideal si buscamos una estética de "revista de diseño" o "marca de relojes".

## Matriz de Repercusiones Técnicas
| Librería | Complejidad | Peso Bundle | Estilo PDS |
| :--- | :--- | :--- | :--- |
| Feather | Baja (Nativa) | 0kb extra | Excelente |
| Solar | Media (SVG) | ~200kb | **Superior** |
| Iconoir | Media (SVG) | ~300kb | Alta Gama |

---

> [!NOTE]
> Este estudio queda guardado para cuando el CEO decida retomar la unificación iconográfica. Se recomienda la creación de un componente `<OasisIcon />` para abstraer la librería elegida.
