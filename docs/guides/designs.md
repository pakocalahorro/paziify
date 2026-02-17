# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.11.0) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.11.0** introduce los **Componentes Bio Premium** para el Sistema de Calibración del Escáner Cardio, consolidando la experiencia de bienestar con interfaces profesionales de alta fidelidad.

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

## 8. Componentes Bio Premium (v2.11.0) 🫀✨

### CalibrationRing (Anillo de Calibración)
**Propósito**: Feedback visual en tiempo real durante calibración

**Especificaciones de Diseño**:
- **Forma**: Anillo SVG con radio 80px, stroke-width 12px
- **Colores Dinámicos**:
  - 🔴 Rojo (`#EF4444`) cuando score < 60
  - 🟡 Amarillo (`#FBBF24`) cuando score 60-79
  - 🟢 Verde (`#10B981`) cuando score ≥ 80
- **Animación**: Transición suave de 300ms con Reanimated
- **Tipografía**:
  - Porcentaje: Oswald Bold, 48px
  - Estado: Inter Medium, 14px, uppercase, letter-spacing 1.5px
- **Estados Textuales**:
  - "AJUSTA" (rojo)
  - "CASI" (amarillo)
  - "✓ ÓPTIMO" (verde)

### CountdownOverlay (Overlay de Cuenta Regresiva)
**Propósito**: Transición visual entre calibración y medición

**Especificaciones de Diseño**:
- **Fondo**: Overlay fullscreen con `rgba(0, 0, 0, 0.85)`
- **Número**:
  - Tipografía: Oswald Bold, 120px
  - Color: `#FFFFFF`
  - Animación: Pulse (scale 1.0 → 1.2 → 1.0) con duración 400ms
- **Mensaje Principal**:
  - Texto: "¡Perfecto! Iniciando..."
  - Tipografía: Inter SemiBold, 24px
  - Color: `#10B981` (verde éxito)
- **Subtítulo**:
  - Texto: "Mantén el dedo quieto"
  - Tipografía: Inter Regular, 16px
  - Color: `rgba(255, 255, 255, 0.7)`
  - Margin-top: 12px

### QualityAlert (Alerta de Calidad)
**Propósito**: Notificación flotante durante medición si calidad cae

**Especificaciones de Diseño**:
- **Contenedor**:
  - Posición: Absolute, top 60px
  - Width: 90% del viewport
  - Padding: 16px horizontal, 12px vertical
  - Border-radius: 12px
  - Background: `#FEF3C7` (amarillo suave)
  - Border: 2px solid `#F59E0B` (naranja)
  - Shadow: `0px 4px 12px rgba(0, 0, 0, 0.15)`
- **Icono**: ⚠️ (24px, color `#F59E0B`)
- **Texto**:
  - Tipografía: Inter Medium, 14px
  - Color: `#92400E` (marrón oscuro)
  - Line-height: 1.4
- **Animación**:
  - Entrada: Slide-down desde -100px con spring animation
  - Salida: Fade-out + slide-up con duración 300ms

---

## 8. Estandarización de Cabeceras (v2.9.0) 📐
... [Mantenido] ...

---

## 9. Medical HUD & Bio-Feedback UI (v2.10.0) 🫀✨
Interfaz de alta fidelidad para el Escáner Cardio que combina precisión técnica con calidez terapéutica.

### Arquitectura Visual
- **Glassmorphism Profundo**: 
  - `BlurView` con `intensity={80}` y `tint="dark"`
  - Fondo semi-transparente (`rgba(0,0,0,0.4)`) para separar datos del video
  - Bordes sutiles con `borderColor: 'rgba(255,255,255,0.1)'`

### Paleta de Estados Semánticos
El color comunica el estado del sistema de forma intuitiva:

| Estado | Color | Hex | Uso |
|:---|:---|:---|:---|
| **Sin Señal** | Rojo Alerta | `#EF4444` | Indicador de señal, texto de error |
| **Buscando** | Ámbar Cálido | `#F59E0B` | Estado de carga, transición |
| **Señal Óptima** | Esmeralda | `#10B981` | Confirmación de detección |
| **Sobrecarga** | Rojo Intenso | `#DC2626` | Resultado: estrés alto |
| **Energía Baja** | Ámbar Suave | `#FBBF24` | Resultado: fatiga |
| **Equilibrio** | Verde Vital | `#2DD4BF` | Resultado: balance óptimo |

### Tipografía Jerárquica
- **Números Grandes (BPM/HRV)**: Oswald ExtraBold 48px para legibilidad instantánea
- **Labels**: Inter Medium 14px con `opacity: 0.7`
- **Instrucciones**: Inter Regular 16px con line-height 1.5
- **Resultados**: Oswald Bold 26px con letter-spacing -0.5

### Micro-Interacciones (Reanimated)
1. **Latido del Corazón**:
   ```typescript
   // Animación sincronizada con BPM detectado
   scale: withRepeat(withTiming(1.2, {duration: 600}), -1, true)
   ```
2. **Anillo de Progreso**:
   - Stroke circular que se completa en 30 segundos
   - Color dinámico según estado de señal
3. **Pulse de Señal**:
   - Indicadores circulares que respiran cuando hay detección activa

### Layout Responsivo
- **Video Background**: `position: absolute`, full screen con `aspectRatio: 3/4`
- **Data Panel**: Centrado verticalmente, anclado a `insets.bottom + 120px`
- **Safe Areas**: Respeta `useSafeAreaInsets()` para notch y botones virtuales

### Feedback de Liveness (Detección de Presencia)
- **Instrucción Visual**: "Coloca tu dedo sobre la lente" con icono animado
- **Confirmación Táctil**: Haptic feedback (`Haptics.impactAsync`) al detectar señal
- **Transición Suave**: Fade-in de 300ms al cambiar entre estados

### Accesibilidad
- Contraste mínimo 4.5:1 en todos los textos sobre video
- Iconos con tamaño mínimo de 24x24px
- Feedback multi-sensorial (visual + háptico)

---

*Última revisión: 15 de Febrero de 2026 - Master Audit v2.10.0 (Bio-Metric Awakening)*
