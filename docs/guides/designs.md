# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.8.0) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.8.0** marca la transición a una capa visual nativa y resiliente mediante **expo-image**.

---

## 1. El Flujo Espiritual (UX Zen) ... [Secciones anteriores mantenidas] ...

---

## 2. Componentes Inteligentes (Skia & Reanimated) ... [Secciones anteriores mantenidas] ...

---

## 3. Estética Bento & Capa Editorial
La Home y el Perfil se rigen por la organización celular y la transparencia.
- **Bento Grid**: Organización en tarjetas de cristal con fondos de **fotografía real (WebP)**.
- **Optimización Expo-Image (v2.8.0)**: Sustitución del `Image` legacy por `expo-image` para un renderizado nativo.
  - **Caché en Disco**: Persistencia total de carátulas para navegación Zero-Egress.
  - **Transiciones Cross-fade**: Efecto suave de 300ms al cargar nuevas imágenes.
- **Jerarquía de Audio/Historias**: Escalado del avatar y saludo para una lectura más limpia.
- **SessionDetailScreen**: Capa editorial con jerarquía clara (**Guía > Título > Descripción > Play**) para una experiencia tipo "Streaming de Bienestar".
- **Glassmorphism 3.0**: Uso intensivo de `BlurView` (intensidad 20-40) y bordes de 1px con baja opacidad (0.15).
- **Alfabetización de Datos (Iconos ⓘ)**: Modales de información minimalistas para educar al usuario sobre sus métricas espirituales.

---

## 4. Identidad Corporativa y Catálogos Unificados 🏗️⚖️
- **Arquitectura Unificada**: Biblioteca, Academia y Audiolibros comparten el `SoundWaveHeader` y el sistema de carrusel centrado.
- **Jerarquía de Espacios**: Uso de `ITEM_WIDTH = width * 0.75` y ratio **1.35** para coherencia visual absoluta.
- **Tipografía Skia (v2.7.0)**: Uso del motor Skia para títulos de tarjetas con efectos procedimentales:
  - **Hollow**: Trazo fino para Ansiedad (`strokeWidth: 1.5`).
  - **Duotone**: Relleno vibrante y trazo de contraste para Salud.
  - **Glow**: Aura luminosa para Familia y Crecimiento.

---

## 5. El Menú Flotante (CustomTabBar) 🛸
- **Concepto**: Isla de cristal suspendida sobre el `insets.bottom`.
- **Interacción**: Orbe respiratorio central (`StarCore`) con feedback visual basado en el `life_mode` del usuario.
- **Glassmorphism**: Intensidad de 65 con bordes de 1.5px tipo "Joyaría".

---

## 6. Paleta de Color Bio-Luminiscente
- **Healing**: Emerald Green (`#2DD4BF`) / Cyan / Deep Obsidian.
- **Growth**: Solar Yellow (`#FBBF24`) / Golden White / Deep Obsidian.
- **Tipografía**: **Oswald** (Headings) para autoridad espiritual y **Inter/System** para lectura técnica.

---

## 7. Optimización de Safe Areas
- **Top Safe Area**: Cristal de seguridad de intensidad 90 en Home.
- **Bottom Safe Area**: Elevación dinámica de carruseles a **+100px** para evitar solapes con el menú flotante.

---

*Última revisión: 12 de Febrero de 2026 - Master Audit v2.7.0 (Unified Experience)*
