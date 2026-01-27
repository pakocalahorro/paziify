# Guía Maestra de Diseño y Audio (Milestone 3)

Esta guía documenta la arquitectura técnica y los principios de diseño aplicados durante el **Milestone 3: Excelencia Visual y Sonora**. Es esencial seguir estas directrices para mantener la calidad premium y el rendimiento del proyecto.

---

## 1. Sistema de Diseño: Concepto "Oasis"

El diseño de Paziify se basa en la calma, la naturaleza y la tecnología fluida.

### Visuales con @shopify/react-native-skia
Utilizamos **Skia** para renderizar gráficos de alto rendimiento que no podrían lograrse con componentes estándar de React Native.

#### El Orbe de Respiración (`ProBreathingOrb.tsx`)
*   **Modelo Emerald Heart**: Un núcleo verde esmeralda con retroiluminación interna.
*   **Dinámica Total**: El orbe completo (base y rim) escala sincrónicamente con las fases de respiración (`inhale`, `exhale`).
*   **Movimiento Lava Flow**: Energía interna generada por gradientes radiales que se desplazan de forma independiente para evitar el estatismo.
*   **Renderizado de Alta Fidelidad**: Evitamos el componente `Blur` de Skia en capas transparentes para prevenir el "lavado gris" (Blur Bleaching). En su lugar, usamos gradientes multi-parada (`positions`) para suavizar los bordes.

### Buenas Prácticas de UI
*   **Glassmorphism**: Uso de fondos semi-transparentes (`rgba`) y bordes finos de 1px a 1.5px.
*   **Paleta Bio-Luminiscente**: Tonos esmeralda, cian eléctrico, magenta neón y blanco puro sobre fondos obsidian (`#000000`) o gradientes profundos.
*   **Consistencia de Cabezales**: Los catálogos (Oasis) deben seguir la jerarquía: **Header Unificado -> Contenido -> Tarjetas**.

---

## 2. Arquitectura del Motor de Audio

El motor de audio ha sido diseñado para ser inmersivo y personalizable.

### Motor Multi-Capa (`AudioEngineService.ts`)
Paziify permite la mezcla simultánea de tres tipos de fuentes:
1.  **Guía Vocal**: Instrucciones de meditación.
2.  **Soundscapes**: Sonidos de naturaleza (lluvia, bosque, aves).
3.  **Ondas Binaurales**: Frecuencias (Theta, Alpha) para estados mentales específicos.

### Implementaciones Técnicas
*   **Edge Functions**: Sourcing dinámico de audio mediante Supabase Edge Functions e IA de Google (Vertex AI) para generación de contenido.
*   **Pre-carga Dinámica**: Los cues de voz se pre-cargan antes de iniciar la sesión para evitar latencia.
*   **Mezclador en Pantalla**: Control de volumen independiente para cada capa de audio.

---

## 3. Estructura de Proyecto (Vista Milestone 3)

```text
src/
├── components/
│   ├── Meditation/
│   │   └── ProBreathingOrb.tsx   # Joya de la corona visual (Skia)
│   └── Shared/
│       └── OasisHeader.tsx      # Cabezal unificado
├── services/
│   └── AudioEngineService.ts    # Cerebro del audio multi-capa
├── constants/
│   └── images.ts                # Mapeo normalizado de assets vibrantes
└── screens/
    └── Meditation/
        ├── BreathingTimer.tsx   # Integración total Orbe + Audio
        └── MeditationCatalog.tsx# Estructura Oasis
```

---

## 4. Consideraciones para Desarrolladores

### Modificación de Gráficos (Skia + Reanimated)
> [!IMPORTANT]
> Nunca uses valores compartidos de Reanimated (`useSharedValue`) dentro de condicionales de renderizado si quieres evitar parpadeos. 
> Si un objeto Skia debe moverse, asegúrate de que sus animaciones ambientes corran fuera del estado `active` para que la app no parezca "muerta" en reposo.

### Gestión de Cache y Bundling
Si modificas archivos críticos de diseño como el Orbe y no ves los cambios:
1.  Ejecuta `npx expo start -c` para limpiar la caché de Metro.
2.  Usa logs de consola únicos (`v1.0`, `v1.1`) para confirmar qué bundle está leyendo el dispositivo.

---

## 5. Mantenimiento de Assets
Todas las nuevas imágenes deben registrarse en `src/constants/images.ts` y estar alojadas preferiblemente en **Supabase Storage** para carga eficiente, con un fallback de color sólido definido en las tarjetas de sesión.
