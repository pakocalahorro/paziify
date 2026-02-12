# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.6.5) 🎨

Esta guía define el ADN visual de Paziify. Cada píxel, transición y efecto está diseñado para inducir un estado de calma, claridad y compromiso espiritual.

---

## 1. El Flujo Espiritual (UX Zen)
El viaje del usuario se basa en la transición suave y la preparación mental.
- **Spiritual Preloader**: Branding con "PAZIIFY" (letter-spacing: 8). Tiempo de exposición: **3.5 segundos** (Mandato CEO). 
  - **Lógica Inteligente**: El preloader actúa como orquestador de rutas, bifurcando hacia `CompassScreen` (Ritual Diario) o `HomeScreen` según persistencia.
- **Nexus Navigation**: Salto directo de Brújula a Home. Feedback háptico "explosivo" y explosión de **partículas Skia** al seleccionar modo de vida.

---

## 2. Componentes Inteligentes (Skia & Reanimated)
- **ThemedBreathingOrb**: Orbes cinéticos que laten síncronos con el pulso humano (periodos de 4s-6s).
- **ResilienceTree Orgánico**: Curvas Bézier con **30 luces bioluminiscentes**. 
  - **Identidad**: Las luces cambian de tono e intensidad según el `life_mode`.
  - **Psicología**: El árbol nace con un **15% de base visual** para evitar el sesgo de "tabula rasa".
- **ZenMeters**: Medidores circulares de cristal esmerilado que escalan dinámicamente con las metas del perfil.
- **Purpose Modal**: Interface de cristal inmersivo con **copa de árbol redondeada y realista**, buscando la máxima calidez orgánica.
- **Botón "Reto Paziify"**: Diseño en oro con **texto en blanco puro** (`#FFFFFF`) para legibilidad premium. El botón es **dinámico**: cambia a "Reto Activado" y actualiza su micro-animación al confirmar el compromiso.

---

## 3. Estética Bento & Capa Editorial
La Home y el Perfil se rigen por la organización celular y la transparencia.
- **Bento Grid**: Organización en tarjetas de cristal con fondos de **fotografía real (WebP)**, eliminando la frialdad de los iconos planos.
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
