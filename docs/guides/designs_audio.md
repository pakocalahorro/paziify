# Guía Maestra de Diseño y Audio (v2.0.0 Offline & Cloud)

Esta guía documenta la arquitectura técnica y los principios de diseño aplicados durante el **Milestone 3: Excelencia Visual y Sonora**. Es esencial seguir estas directrices para mantener la calidad premium y el rendimiento del proyecto.

---

## 1. Sistema de Diseño: Concepto "Oasis"

El diseño de Paziify se basa en la calma, la naturaleza y la tecnología fluida.

### Visuales con @shopify/react-native-skia
Utilizamos **Skia** para renderizar gráficos de alto rendimiento que no podrían lograrse con componentes estándar de React Native.

#### Tipografía Dinámica (Oswald) 🅰️
- **Identidad**: Usamos la fuente *Oswald* en sus variantes Bold/Regular para títulos de alto impacto.
- **Implementación**: Cargada vía `Skia.Typeface` para renderizado vectorial dentro de los canvas, permitiendo efectos de enmascarado y gradientes sobre el texto.

#### El Orbe de Respiración (`ProBreathingOrb.tsx`)
*   **Modelo Emerald Heart**: Un núcleo verde esmeralda con retroiluminación interna.
*   **Dinámica Total**: El orbe completo (base y rim) escala sincrónicamente con las fases de respiración (`inhale`, `exhale`).
*   **Movimiento Lava Flow**: Energía interna generada por gradientes radiales que se desplazan de forma independiente para evitar el estatismo.
*   **Renderizado de Alta Fidelidad**: Evitamos el componente `Blur` de Skia en capas transparentes para prevenir el "lavado gris" (Blur Bleaching). En su lugar, usamos gradientes multi-parada (`positions`) para suavizar los bordes.
*   **Aura de Latido (Heartbeat)**: Durante la fase de mantenimiento, el orbe emite un pulso rítmico secundario para mantener la conexión vital.

#### Separadores de Frecuencia (Soundwaves)
*   **Concepto**: Líneas de energía viva que separan grandes bloques de contenido.
*   **Implementación Skia**: `Path` personalizado con alta amplitud y `BlurMask` para el resplandor cian/blanco.
*   **Animación**: Uso de `useSharedValue` y `withRepeat` de Reanimated para pulsar la opacidad (0.3 <-> 1.0), simulando respiración.
*   **Tipografía**: Textos de sección con sombra negra sólida (`textShadowColor: 'rgba(0,0,0,1)'`) para crear un efecto de "silueta" o "retroiluminación" de alto contraste sobre la onda brillante.

### Buenas Prácticas de UI
*   **Glassmorphism**: Uso de fondos semi-transparentes (`rgba`) y bordes finos de 1px a 1.5px.
*   **Paleta Bio-Luminiscente**: Tonos esmeralda, cian eléctrico, magenta neón y blanco puro sobre fondos obsidian (`#000000`) o gradientes profundos.
*   **Sistema de Temas Visuales (v1.7.0)**:
    *   🌌 **Cosmos Místico**: Nebulosa espacial verde/azul con orbe esmeralda y partículas estelares.
    *   ⛩️ **Templo Zen**: Interior minimalista con velas, tonos cálidos y orbe naranja.
    *   🌲 **Bosque Místico**: Bosque al amanecer con orbe verde lima natural y luciérnagas.
    *   💧 **Cueva Cristalina**: Cueva natural con gotas, tonos fríos y orbe cian.
*   **Identidad Visual por Guía (v2.0)**:
    *   **Aria (Mindfulness)**: Realismo sereno, luz natural, tonos cálidos y suaves.
    *   **Éter (Resiliencia/Sueño)**: "Realismo Etéreo y Humano". Fusión de personas reales en entornos místicos (cuevas, bosques, niebla). Paleta índigo/violeta.
    *   **Ziro (Rendimiento)**: "Obsidiana Técnica". Fotografía documental de lujo, hiperrealismo, entornos de trabajo/estudio oscuros con iluminación focalizada (spotlight). Paleta Cian/Azul Cobalto.
    *   **Gaia (Niños/Energía)**: "Realismo Mágico". Fotografía vibrante con toques de fantasía sutil. Especialista en sesiones infantiles y despertar energético.
*   **Consistencia de Cabezales**: Los catálogos (Oasis) deben seguir la jerarquía: **Header Unificado -> Contenido -> Tarjetas**.
*   **Patrón UX "Netflix"**: Organización del contenido en carruseles horizontales por categoría con botón de expansión para mejorar el descubrimiento sin abrumar al usuario.
*   **Tarjetas con Identidad**:
    *   **Audiolibros**: Diseño tipo "Poster" que destaca la portada, incluye avatar del narrador en "píldora" visual e indicador de duración.
    *   **Meditaciones**: Diseño "Clean" enfocado en la temática y el estado de ánimo.
    *   **Academia (Cursos v2.3)**: Diseño "Impact" con tipografía **Oswald** y estilos dinámicos Skia:
        *   *Ansiedad (Hollow)*: Borde de neón, interior transparente para "claridad".
        *   *Profesional (Solid)*: Bloque blanco/negro de alto contraste para "foco".
        *   *Salud (Duotone)*: Gradientes suaves bi-color para "armonía".
        *   *Crecimiento*: Elegant Outline.

---

## 2. Arquitectura del Motor de Audio

El motor de audio ha sido diseñado para ser inmersivo y personalizable.

### Motor Multi-Capa (`AudioEngineService.ts`)
Paziify permite la mezcla simultánea de cuatro tipos de fuentes:
1.  **Voice Track (Pre-grabado)**: Pistas de voz MP3 generadas con Google Cloud TTS para background execution confiable.
2.  **Guía Vocal (Dinámica)**: Instrucciones TTS en tiempo real para sesiones sin voice track.
3.  **Soundscapes (Ambientes)**: Paisajes sonoros infinitos (lluvia, bosque) que pueden reproducirse solos o mezclados.
4.  **Ondas Binaurales**: Frecuencias (Theta, Alpha, Gamma) inyectadas como capa secundaria para potenciar el enfoque o la relajación.

### Implementaciones Técnicas
*   **Supabase Storage**: Todos los assets estáticos (Voice Tracks, Soundscapes, Binaurales, Audiolibros) se sirven desde buckets dedicados (`meditation-voices`, `soundscapes`, `binaurals`, `audiobooks`) para minimizar el tamaño del bundle.
*   **Voice Tracks Pre-grabadas**: Archivos MP3 generados con Google Cloud TTS (WaveNet) que contienen todas las instrucciones de voz de una sesión. Configurados con `isLooping: true` para evitar pausa en background (la sesión termina antes del loop).
*   **Sistema Híbrido**: Sesiones con `voiceTrack` usan audio pre-grabado; sesiones sin `voiceTrack` usan TTS dinámico (`playVoiceCue`).
*   **Background Execution**: Audio configurado con `staysActiveInBackground: true` y silent audio trick para mantener JavaScript activo.
*   **Edge Functions**: Sourcing dinámico de metadatos mediante Supabase Edge Functions.
*   **Pre-carga Dinámica**: Los cues de voz se pre-cargan antes de iniciar la sesión para evitar latencia (solo en modo dinámico).
*   **Estrategia "Content King" (119 Sesiones)**: Arquitectura diseñada para servir un catálogo masivo desde Supabase Storage. Ver **[Arquitectura de Contenido v2.0](./content_architecture_expansion.md)**.
*   **Protocolo de Nomenclatura ASCII**: Todos los archivos de audio y sus URLs deben ser 100% ASCII (ej. `sueno` en lugar de `sueño`) para garantizar la compatibilidad universal y evitar errores 400 en la nube.
*   **Mapeo de Voces y Especialidades (v1.9.0)**:
    - **Aria** (Femenina - Calm): Especialista en Calma SOS y Mindfulness.
    - **Ziro** (Masculina - Standard): Especialista en Rendimiento (Sesiones 080-089) y Enfoque.
    - **Éter** (Masculina - Deep): Especialista en Sueño y Resiliencia (Sesiones 090-099).
    - **Gaia** (Femenina - Kids): Especialista en Niños y Despertar/Energía.
    - **Paziify Team**: Protocolos técnicos y core del sistema.
*   **Mezclador en Pantalla**: Control de volumen independiente para cada capa de audio.
*   **Sincronización Quirúrgica (v1.8.0)**:
    - **Update Interval**: Configurado a 16ms (60 FPS) para eliminiar latencia visual.
    - **Compensación Aditiva**: El motor visual suma dinámicamente el tiempo de voz (SPEECH_PER_WORD) a las fases activas para evitar la desincronización por "drift" en pistas técnicas.
    - **Offset de Anticipación**: Adelanto visual de 350ms respecto al audio para una respuesta intuitiva.
    - **Offset de Anticipación**: Adelanto visual de 350ms respecto al audio para una respuesta intuitiva.
    - **Flujo Zen**: Inicio automático tras carga total del audio con cuenta atrás de 3 segundos.
    - **Manejo de Errores Silencioso**: El motor captura fallos de carga de audio ambiental (ej. al cambiar a Modo Noche sin internet) y los maneja silenciosamente para no interrumpir la experiencia visual ni mostrar errores técnicos al usuario.

### Reproductor Global y Persistencia (`AudioPlayerContext.tsx`)
Para audiolibros e historias, utilizamos una arquitectura separada del motor de meditación:
*   **Global Context**: Un proveedor único envuelve la navegación para mantener el estado del audio (`Sound` object) vivo entre cambios de pantalla.
*   **MiniPlayer**: Componente flotante que se renderiza condicionalmente en el `TabNavigator`, permitiendo control de reproducción fuera de la pantalla de detalle.
*   **Gestión de Conflictos**: El contexto global pausa automáticamente el motor de meditación si se inicia un audiolibro, y viceversa.

### Estrategia de Datos (Mock Fallback)
Para garantizar una experiencia fluida ("Oasis") incluso sin conexión o con base de datos vacía:
*   **Service Level Mocking**: `contentService.ts` implementa un fallback automático. Si la consulta a Supabase retorna vacío, se inyectan datos locales de alta fidelidad.
*   **Tipado Estricto**: Los datos simulados cumplen estrictamente con las interfaces de TypeScript (`Audiobook`, `RealStory`) para evitar errores en tiempo de ejecución.

---

## 3. Estructura de Proyecto (Vista Milestone 3)

```text
src/
├── components/
│   ├── Meditation/
│   │   ├── ThemedBreathingOrb.tsx   # Orbe temático adaptable (Skia)
│   │   └── ProBreathingOrb.tsx      # Orbe legacy (deprecated)
│   └── Shared/
│       └── OasisHeader.tsx          # Cabezal unificado
├── services/
│   └── AudioEngineService.ts        # Cerebro del audio multi-capa
├── constants/
│   ├── images.ts                    # Mapeo normalizado de assets vibrantes
│   └── visualThemes.ts              # Configuración de temas visuales
├── assets/
│   └── backgrounds/                 # Fondos de alta calidad por tema
│       ├── cosmos.png
│       ├── temple.png
│       ├── forest.png
│       └── cave.png
└── screens/
    └── Meditation/
        ├── BreathingTimer.tsx       # Integración total Orbe + Audio + Temas
        └── MeditationCatalog.tsx    # Estructura Oasis
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
Todas las nuevas imágenes y audios deben alojarse en **Supabase Storage**.
*   **Imágenes**: Registrar en `src/constants/images.ts`.
*   **Audio**: Registrar URLs en `src/data/soundscapesData.ts` (Soundscapes/Binaurales).
> [!WARNING]
---

## 6. Herramientas de Mantenimiento (Scripts)

Para mantener el catálogo de 119 sesiones organizado y sincronizado, disponemos de las siguientes herramientas en la carpeta `scripts/`:

*   **`sync_sessions.js`**: El cerebro de la organización. Cruza los guiones de `docs/scripts/` con el código en `sessionsData.ts`. Asigna guías, categorías y genera las URLs de audio siguiendo el protocolo ASCII.
*   **`prepare_upload.js`**: El puente a la nube. Escanea `sessionsData.ts` y renombra físicamente tus archivos MP3 locales en `assets/voice-tracks-renamed/` para que coincidan con lo que la app espera.
*   **Auditores (`catalog_audit.js`, etc.)**: Generan informes de consistencia para detectar PDFs o audios faltantes.

> [!TIP]
> **Regla de Oro**: Si cambias algo en la autoría o categorías, primero corre `sync_sessions.js`, luego `prepare_upload.js`, y finalmente sube el contenido a Supabase.
---
*Última revisión: 5 de Febrero de 2026 - v2.0.0 (Offline-First & CMS V2)*
