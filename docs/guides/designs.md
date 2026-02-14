# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.9.0) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.9.0** consolida la arquitectura de activos única para la Academia, la resiliencia offline total y la **Estandarización de Cabeceras**.

---

## 1. El Flujo Espiritual (UX Zen) ... [Mantenido] ...

---

## 2. Componentes Inteligentes (Skia & Reanimated) ... [Mantenido] ...

---

## 3. Estética Bento & Capa Editorial
La Home y el Perfil se rigen por la organización celular y la transparencia.
- **Bento Grid**: Organización en tarjetas de cristal con fondos de **fotografía real (WebP)**.
- **Optimización Expo-Image**: Renderizado nativo con caché en disco para navegación Zero-Egress.
- **Jerarquía Técnica (v2.8.10)**: Hemos simplificado la carga de audio eliminando archivos descriptivos. El diseño ahora busca la eficiencia: 1 archivo técnico por lección, eliminando errores de visualización 400.

---

## 4. Identidad Corporativa y Catálogos Unificados 🏗️⚖️
- **Arquitectura de Activos Unificada**: Todas las lecciones de la Academia siguen el patrón `{moduleId}-{indice}.mp3`. Esto asegura una visualización limpia e inmediata en el reproductor.
- **Ratio de Carátulas**: Se mantiene el ratio **1.35** para coherencia visual absoluta en todos los catálogos (Meditación, Academia, Audiolibros).

---

## 5. El Menú Flotante (CustomTabBar) 🛸
- **Concepto**: Isla de cristal suspendida sobre el `insets.bottom`.
- **StarCore**: Orbe respiratorio central con feedback dinámico según el `life_mode`.

---

## 6. Paleta de Color Bio-Luminiscente
- **Healing**: Emerald Green (`#2DD4BF`) / Cyan / Deep Obsidian.
- **Growth**: Solar Yellow (`#FBBF24`) / Golden White / Deep Obsidian.
- **Tipografía**: **Oswald** (Headings) y **Inter/System** (Cuerpo técnico).

---

## 7. Optimización de Safe Areas
- **Bottom Elevation**: Elevación de carruseles a **+100px** para evitar colisiones con el menú flotante.

---


---

## 8. Estandarización de Cabeceras (v2.9.0) 📐
Para reducir el ruido visual y mejorar la consistencia:
- **Tipografía**: **26px ExtraBold** (Black) con `letter-spacing: -0.5`.
- **Estructura**: `[Botón Atrás] [Título] [Icono Sección]` (Fila 1).
- **Filtros**: Siempre debajo del título (Fila 2), como en la Biblioteca.
- **Aplicación**: Implementado en Biblioteca, Audiolibros e Historias (eliminando las siluetas gigantes antiguas).

---

*Última revisión: 14 de Febrero de 2026 - Master Audit v2.9.0 (Zero-Egress & Unified Categories)*
