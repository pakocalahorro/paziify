# Plan de Implementación: Storybook en Paziify (Refinado)

## Objetivo
Integrar **Storybook** en la aplicación móvil Paziify para facilitar el refinamiento visual y la documentación de componentes vivos (Skia/Reanimated), asegurando **cero impacto** en el bundle de producción.

## User Review Required
> [!NOTE]
> Se utilizará la variable de entorno `EXPO_PUBLIC_STORYBOOK_ENABLED` para alternar modos.
> **Importante**: Los componentes que dependan de `AudioContext` o `Navigation` requerirán "Decorators" (mocks) para funcionar aislados.

## Proposed Changes

### 1. Configuración del Entorno (`/`)
#### [NEW] [.storybook/](file:///c:/Mis%20Cosas/Proyectos/Paziify/.storybook/)
- Crear estructura estándar: `main.ts`, `preview.tsx`, `index.tsx`, `storybook.requires.ts`.
- **Addons**: `@storybook/addon-ondevice-controls`, `@storybook/addon-ondevice-actions`.

#### [MODIFY] [metro.config.js](file:///c:/Mis%20Cosas/Proyectos/Paziify/metro.config.js)
- Configurar resolver para incluir archivos `.sb.js` y `.stories.tsx`.
- **Optimización**: Asegurar que en modo producción (release) se excluyan los archivos de historias para no aumentar el peso de la App.

#### [MODIFY] [App.tsx](file:///c:/Mis%20Cosas/Proyectos/Paziify/App.tsx)
- Implementar "Toggle Switch":
  ```typescript
  const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';
  // ... lógica de carga de fuentes compartida ...
  if (isStorybook) return <StorybookUI />;
  return <MainApp />;
  ```
- **Crucial**: La carga de Hooks básicos (Fuentes, Assets) debe ocurrir *antes* de decidir qué renderizar, para que Storybook tenga acceso a iconos y tipografía.

#### [MODIFY] [package.json](file:///c:/Mis%20Cosas/Proyectos/Paziify/package.json)
- Añadir script dedicado para lanzar en modo Storybook:
  ```json
  "scripts": {
    "start": "expo start",
    "storybook": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start",
    // ...
  }
  ```

### 2. Infraestructura de Historias (`src/components`)
### 2. Infraestructura de Historias ("The Sandbox")

#### [MODIFY] [App.tsx](file:///c:/Mis%20Cosas/Proyectos/Paziify/App.tsx)
- **Refactorización de Carga**: Extraeremos la carga de `useFonts` / `Assets` al nivel superior de `App`, antes del `return`.
  ```typescript
  export default function App() {
    // 1. Cargar Fuentes e Iconos (Global)
    const [fontsLoaded] = useFonts({ ... });
    
    // 2. Decisión de Renderizado
    const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

    if (!fontsLoaded) return null; // Splash handling
    
    if (isStorybook) {
      return <StorybookUI />; // 🛑 SIN Providers reales, Storybook pone los suyos
    }

    return <MainApp />; // ✅ App Normal con todos sus Providers
  }
  ```

#### [NEW] [Decorators Globales] (`.storybook/preview.tsx`)
Para evitar crashes y garantizar aislamiento, **todo** componente será envuelto automáticamente en:
1.  **`withSafeAreas`**: Simula el notch y márgenes de móviles modernos (`SafeAreaProvider`).
2.  **`withMockNavigation`**: Un `NavigationContainer` falso para que `useNavigation` no falle.
3.  **`withMockAppContext`**: Una versión "Dummy" del contexto de usuario que permite simular estados (Usuario Premium, Invitado, Night Mode) sin conectar a Supabase.
4.  **`withQueryClient`**: Un cliente de React Query aislado y vacío para componentes que piden datos.

#### [NEW] [metro.config.js](file:///c:/Mis%20Cosas/Proyectos/Paziify/metro.config.js)
- **Creación**: Actualmente no existe. Lo crearemos extendiendo la configuración default de Expo (`@expo/metro-config`) para soportar `.sb.js` y `.stories.tsx`.

#### [NEW] [Historias Piloto]
- `src/components/Meditation/ProBreathingOrb.stories.tsx`: Ideal para probar controles de animación en tiempo real.
- `src/components/Shared/SoundwaveSeparator.stories.tsx`: Prueba de Skia puramente visual.

## Verification Plan

### Manual Verification
1.  **Modo Dev Normal**: `npx expo start` -> Carga la App completa.
2.  **Modo Storybook**: 
    - Crear script `"storybook": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start"`
    - Ejecutar y verificar que carga la UI de Storybook.
    - Navegar a `ProBreathingOrb` y manipular controles (Knobs).
3.  **Build Check**: Verificar que un build de producción no crashea ni incluye el runtime de Storybook (opcional, validación por tamaño).

3.  **Build Check**: Verificar que un build de producción no crashea ni incluye el runtime de Storybook (opcional, validación por tamaño).

## Estrategia de "Documentación Viva" (Tu Petición)
Entendido. Si el objetivo es **Autonomía Total** y **Documentación Automática**, cambiaremos el enfoque de "Piloto" a **"Sistema de Diseño Completo"**.

### Plan de Cobertura (Por Prioridad)

#### 🔴 Lote 1: "Lo Intocable" (Complejidad Alta) - *Inicio Inmediato*
*Componentes que requieren ajuste fino (física, shaders).*
- `Bio/CalibrationRing` (Anillo Cardio)
- `Bio/CountdownOverlay`
- `Meditation/ProBreathingOrb`
- `Sanctuary/AtmosphereShader`
- `Shared/SoundwaveSeparator`

#### 🟡 Lote 2: "Bloques de Construcción" (UI Core) - *Siguiente Sesión*
*Los ladrillos de la App. Si están documentados, no hay dudas de diseño.*
- `Home/BentoCard`
- `Home/ZenMeter`
- `Shared/MiniPlayer`
- `CategoryRow` (Filtros)

#### 🟢 Lote 3: "Estructura" (Pantallas Parciales) - *Fase Final*
- `CourseCard`
- `SessionCard`

### Compromiso de Mantenimiento
Para que esto funcione como documentación real y no se "olvide":
> [!IMPORTANT]
> **Nueva Regla de Oro**: "Si tocas un componente, actualizas su Historia".
> Esto garantiza que Storybook sea siempre la **Verdad Única** del diseño de Paziify.

## Impacto en tu Flujo de Trabajo (Workflow Guide)

### 1. Desarrollo Normal (Como siempre)
- **Comando**: `npm start` o `npx expo start`
- **Experiencia**: La App carga normalmente. Navegas por las pantallas, pruebas flujos completos (Login -> Home -> Reproductor).
- **Uso**: Para implementar lógica de negocio, navegación, y ver "el todo".

### 2. Refinamiento Visual (Nuevo Modo)
- **Comando**: `npm run storybook`
- **Experiencia**: La App carga **directamente** en un menú de Storybook. No hay Login ni Home.
- **Uso**: 
  - Aislar un componente rebelde (ej: `OrbFlow` o `CardioRing`) y ajustarlo al píxel sin tener que navegar hasta él cada vez.
  - Probar variaciones de estado (BPM bajo/alto, error, éxito) pulsando un botón en lugar de simular todo el flujo.

> [!TIP]
> **No necesitas dos Apps distintas**. Es la misma App, pero el comando `npm run storybook` le dice al iniciarse: "Hoy compórtate como un taller de componentes, no como la App completa".

### FAQ: ¿Cómo controlo los valores en una pantalla pequeña?
Es una duda muy común. La interfaz de Storybook en el móvil tiene **Pestañas (Tabs)** en la parte inferior:
1.  **Canvas (Vista)**: Ves el componente a pantalla completa, limpio.
2.  **Addons (Controles)**: Un panel deslizante donde aparecen los "knobs" (deslizadores, selectores de color, textos).
   
**Flujo de trabajo**:
- Abres "Addons" -> Cambias la velocidad de `10` a `50`.
- Cierras "Addons" -> Ves el resultado en "Canvas".
- *Opción Pro*: Si te resulta incómodo, podemos activar el **Web Dashboard**, donde usas el PC para mover los controles y el móvil solo muestra el resultado (requiere un paso extra de configuración, pero es posible).

### FAQ: ¿Diseño vs. Operativa? (Tu Duda Clave)
**Pregunta**: *"En la pantalla de resultados, ¿puedo editar la operativa (lógica) o solo el diseño?"*

**Respuesta**: Tienes el control total de la **Simulación**, pero no del código de negocio.
- **Lo que SÍ controlas (Diseño + Estados)**:
  - Puedes forzar que el resultado sea "Estrés Alto" (HRV: 20ms) sin tener que correr 100 metros.
  - Puedes cambiar el texto de "Análisis Completado" a "Diagnóstico Listo" en vivo.
  - Puedes ajustar el color del gráfico o el tamaño de la fuente.
- **Lo que NO controlas (Lógica Profunda)**:
  - No puedes reescribir la fórmula matemática del `rmssd` desde Storybook.
  - No puedes cambiar cómo se guarda en Supabase (porque eso está "mockeado").

**Resumen**: Storybook te permite ver **CÓMO reacciona la App** ante cualquier situación (incluso las difíciles de reproducir), pero la lógica interna del cálculo sigue estando en tu código (`.ts`).

### FAQ: ¿Puedo mover cosas de sitio (Drag & Drop)?
**Pregunta**: *"¿Puedo cambiar el tamaño, posición o fondos arrastrando?"*

**Respuesta**: **No directamente** (no es Wix ni Figma), pero hay un truco.
Storybook solo controla lo que el programador "expone".
- Si yo programo el componente `CardioResult` con propiedades fijas, no podrás mover nada.
- **La Solución (Flexibilidad)**: Cuando implementemos las historias, puedo añadir controles de diseño especiales ("Layout Props"):
  - `padding`: Deslizador para separar los bordes.
  - `scale`: Deslizador para hacer más grande/pequeño el bloque.
  - `glassIntensity`: Deslizador para hacer el fondo más o menos transparente.

**Conclusión**: Si quieres poder "jugar" con el diseño, dímelo al crear la historia y le pondré esos controles ("Knobs") extra.

### FAQ: ¿Quién escribe la documentación?
**Pregunta**: *"¿La documentación se hace sola o tengo que escribirla yo?"*

**Respuesta**: **Es híbrido (80% Automático / 20% Manual)**.
1.  **Automático (Autodocs)**:
    - Storybook lee tu código. Si tu componente se llama `CardioResult` y tiene una propiedad `bpm`, Storybook genera automáticamente una tabla que dice: "Este componente acepta `bpm` (número)".
    - Si yo he puesto comentarios en el código (`/** El ritmo cardiaco detectado */`), Storybook los extrae y los pone en la web sin que muevas un dedo.
2.  **Manual (Markdown/MDX)**:
    - Si quieres añadir "Guías de Estilo", "Ejemplos de Uso" o notas de diseño ("Usar solo en fondo oscuro"), eso hay que escribirlo a mano en palabras.

**Tu Ventaja**: Al usar TypeScript, la mayoría de la documentación técnica ("qué hace este botón") sale gratis. Tú solo tendrías que preocuparte de las notas de diseño si quisieras añadirlas.

### FAQ: ¿Qué pasa con los .md actuales? (`structure.md`, `designs.md`...)
**Pregunta**: *"¿Tiro a la basura los documentos actuales?"*

**Respuesta**: **NO**. Son complementarios, no sustitutos.
- **Storybook (Nivel Micro)**: Sustituye a la sección "Componentes" de `structure.md`. Ya no tendrás que describir ahí si el botón es rojo o azul, porque lo ves vivo en Storybook.
- **Markdown Docs (Nivel Macro)**:
  - `database.md`: Sigue siendo vital (Storybook no sabe de bases de datos).
  - `audio.md`: Sigue siendo vital (Storybook no sabe de arquitectura de audio).
  - `user_manual.md`: Sigue siendo vital (es para el usuario final, no para el desarrollador).

**Evolución**: Tus documentos `.md` serán más ligeros y estratégicos, delegando los "detalles visuales" a Storybook.
