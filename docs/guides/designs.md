# Guía Maestra de Diseño Visual (Concepto Oasis)

Esta guía documenta los principios de diseño, visualización con Skia y el sistema de temas aplicados en Paziify para mantener una calidad premium.

---

## 1. Sistema de Diseño: Concepto "Oasis"

El diseño de Paziify se basa en la calma, la naturaleza y la tecnología fluida.

### Visuales con @shopify/react-native-skia
Utilizamos **Skia** para renderizar gráficos de alto rendimiento que no podrían lograrse con componentes estándar de React Native.

#### Tipografía Dinámica (Oswald) 🅰️
- **Identidad**: Usamos la fuente *Oswald* en sus variantes Bold/Regular para títulos de alto impacto.
- **Implementación**: Cargada vía `Skia.Typeface` para renderizado vectorial dentro de los canvas, permitiendo efectos de enmascarado y gradientes sobre el texto.

#### El Orbe de Respiración (`ThemedBreathingOrb.tsx`)
*   **Modelo Emerald Heart**: Un núcleo verde esmeralda con retroiluminación interna.
*   **Dinámica Total**: El orbe escala sincrónicamente con las fases de respiración (`inhale`, `exhale`).
*   **Movimiento Lava Flow**: Energía interna generada por gradientes radiales que se desplazan de forma independiente.
*   **Aura de Latido (Heartbeat)**: Durante la fase de mantenimiento, el orbe emite un pulso rítmico secundario.

#### Jerarquía de Carga de Imágenes (Admin vs Local) 🖼️
- **Prioridad Dinámica**: El sistema (`MeditationCatalogScreen.tsx`) prioriza las imágenes servidas desde Supabase Storage (subidas vía Panel Admin) sobre los placeholders de categoría locales.
- **Flujo de Renderizado**:
    1. Si existe `thumbnail_url` en DB -> Renderizado de imagen remota (WebP).
    2. Si no existe -> Fallback al asset local por categoría (`src/constants/images.ts`).

#### Separadores de Frecuencia (Soundwaves)
*   **Concepto**: Líneas de energía viva que separan grandes bloques de contenido.
*   **Implementación Skia**: `Path` personalizado con alta amplitud y `BlurMask` para el resplandor cian/blanco.
*   **Animación**: Uso de `useSharedValue` y `withRepeat` para pulsar la opacidad simulando respiración.

### Buenas Prácticas de UI
*   **Glassmorphism**: Fondos semi-transparentes (`rgba`) y bordes finos de 1px.
*   **Paleta Bio-Luminiscente**: Tonos esmeralda, cian eléctrico, magenta neón y blanco puro sobre fondos obsidian (`#000000`).
*   **Sistema de Temas Visuales**:
    *   🌌 **Cosmos Místico**: Nebulosa espacial verde/azul.
    *   ⛩️ **Templo Zen**: Interior minimalista, tonos cálidos.
    *   🌲 **Bosque Místico**: Bosque al amanecer, orbe verde lima.
    *   💧 **Cueva Cristalina**: Tonos fríos, orbe cian.

---

## 2. Identidad Visual por Guía

Cada guía tiene una atmósfera visual propia que debe respetarse en la selección de fondos y temas:

*   **Aria (Mindfulness)**: Realismo sereno, luz natural, tonos cálidos.
*   **Éter (Resiliencia/Sueño)**: "Realismo Etéreo y Humano". Índigo/Violeta.
*   **Ziro (Rendimiento)**: "Obsidiana Técnica". Hiperrealismo, entornos oscuros con spotlight. Cian/Azul Cobalto.
*   **Gaia (Niños/Energía)**: "Realismo Mágico". Fotografía vibrante con fantasía sutil. Sincronía con voz infantil dulce (`Wavenet-C`).

---

## 3. Estructura de Proyecto (Vista Visual)

```text
src/
├── components/
│   ├── Meditation/
│   │   └── ThemedBreathingOrb.tsx   # Orbe (Skia)
│   └── Shared/
│       └── OasisHeader.tsx          # Cabezal Glassmorphism
├── constants/
│   ├── images.ts                    # Mapeo de assets visuales
│   └── visualThemes.ts              # Configuración de temas
└── assets/
    └── backgrounds/                 # Fondos de alta calidad
```

---

## 4. Consideraciones para Desarrolladores

### Modificación de Gráficos (Skia)
> [!IMPORTANT]
> Nunca uses valores compartidos de Reanimated (`useSharedValue`) dentro de condicionales de renderizado si quieres evitar parpadeos. 

### Mantenimiento de Assets Visuales
Todas las nuevas imágenes deben alojarse en **Supabase Storage**.
*   **Imágenes**: Registrar URLs en `src/constants/images.ts`.
*   **Formato**: Usar siempre `.webp` u optimizaciones .png para no penalizar el rendimiento.

---
*Última revisión: 10 de Febrero de 2026 - Guía Consolidada v2.5*
