# Propuesta de Rediseño: "El Santuario Empático + UI Viva" (v4.0 - Final)

## 1. La Filosofía Visual: "Tecnología Orgánica"
Para lograr que la app "tenga vida propia" y "efectos espectaculares", elevaremos el stack técnico usando **Shaders y Gráficos de Alto Rendimiento**. No usaremos simples colores planos; usaremos luz y movimiento fluido.

**El Stack Visual ("The Engine"):**
*   **React Native Skia:** Para gráficos 2D de alto rendimiento, efectos de "luz líquida", desenfoques variables y partículas.
*   **Reanimated 3:** Para la física de los movimientos y la coreografía de elementos.

---

## 2. Experiencia Visual por Pantalla

### A. La Brújula ("Bioluminiscencia Táctil")
*   **Concepto:** Dos orbes de energía viva flotando en el vacío.
*   **Efecto Visual:**
    *   **Opción Healing:** Un orbe azul profundo/añil que respira lentamente. Al tocarlo, **"tinta" líquida azul** se expande por la pantalla (Shader Skia).
    *   **Opción Growth:** Un orbe dorado/naranja vibrante con partículas ascendentes. Al tocarlo, un **brillo solar** inunda la interfaz.
*   **Retroiluminación:** Los bordes de la pantalla emiten un "resplandor" suave que cambia de color según la selección, anticipando lo que viene.

### B. El Manifiesto ("Palabras de Luz")
*   **Concepto:** Revelación cinemática en un espacio etéreo.
*   **Efecto Visual:**
    *   **Fondo:** Una **nebulosa en movimiento real** (no un video loop, sino ruido generado proceduralmente) que reacciona sutilmente al giroscopio del móvil (efecto paralaje).
    *   **Texto:** No es texto plano. Usaremos un **Masked Shader**: las letras parecen estar hechas de vidrio, dejando pasar la luz de la nebulosa de fondo, o tienen un efecto de "barrido de luz" brillante al aparecer.

### C. El Santuario ("Respiración Volumétrica")
*   **Concepto:** Profundidad 3D simulada (Glassmorphism Avanzado).
*   **Efecto Visual:**
    *   **Capas de Profundidad:** 3 capas de gradientes con diferentes niveles de desenfoque (`BlurView` variable).
    *   **Subliminal Breathing 2.0:** No solo escala la UI. **La intensidad de la luz** de fondo sube y baja orgánicamente a 6bpm. Es como si la pantalla tuviera pulso.
    *   **Botón Mágico:** Un anillo de luz neón que deja una estela (trail) cuando mantienes el dedo, indicando la carga de la micro-dosis.

---

## 3. Los Recorridos (Con Visuales)

*   **Ruta Healing:** Orbe Azul (líquido) -> Nebulosa Nocturna (calma) -> Santuario Profundo (Búnker de Luz tenue).
*   **Ruta Growth:** Orbe Solar (fuego) -> Amanecer Cósmico (energía) -> Santuario Radiante (Interfaz nítida y brillante).

---

## 4. Fases de Implementación Técnica

1.  **Fase 1: El Motor Gráfico (Skia Setup)**
    *   Instalar `@shopify/react-native-skia`.
    *   Crear componentes base: `LiquidBackground`, `GlowingOrb`, `ShimmerText`.
2.  **Fase 2: El Flujo Cinematográfico**
    *   **CompassScreen:** Implementar interacción de "expansión líquida" al elegir.
    *   **ManifestoScreen:** Implementar texto con shader de luz y fondo procedural.
3.  **Fase 3: Santuario Vivo**
    *   Integrar `useBreathingRhythm` con los shaders de fondo (la luz "respira").
    *   Refactorizar UI para usar Glassmorphism real (Blur de alto rendimiento).
4.  **Fase 4: Pulido Sensorial**
    *   Sincronizar Haptics (vibración) con los picos de luz (sinestesia digital).

---

## Revisión de Usuario Requerida
> [!WARNING]
> **Rendimiento:** El uso de Skia y Shaders es espectacular pero intensivo. ¿Nos enfocamos primero en iOS/Android Gama Alta y luego optimizamos, o limitamos los efectos en dispositivos antiguos? *Recomendación: Ir a por el "Efecto WOW" full y usar un modo "Lite" automático si detectamos bajo rendimiento.*
