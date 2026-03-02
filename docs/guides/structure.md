# Estructura del Proyecto Paziify

## Índice
1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Pantallas (Screens)](#pantallas-screens)
5. [Componentes](#componentes)
6. [Navegación](#navegación)
7. [Servicios](#servicios)
8. [Contextos](#contextos)
9. [Panel de Administración](#panel-de-administración)
10. [Base de Datos](#base-de-datos)

---

## Visión General

**Paziify** es una aplicación móvil de bienestar, mindfulness y salud mental desarrollada con React Native y Expo. La app ofrece meditaciones guiadas, audiolibros, terapia cognitivo-conductual (CBT), bio-feedback y una experiencia de santuario espiritual inmersivo.

**Versión**: 2.37.0 (Sensorial Revolution - PDS 3.0 Standard)
**Última actualización**: 2 de Marzo de 2026

---

## Stack Tecnológico

### Core
- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Lenguaje**: TypeScript 5.9
- **Navegación**: React Navigation v7
- **Estado**: Context API + TanStack Query (React Query)

### Backend & Autenticación
- **BaaS**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Google OAuth

### UI/UX
- **Animaciones**: React Native Reanimated 4.1 + React Native Skia 2.2
- **Iconos**: Expo Vector Icons (Ionicons)
- **Componentes UI**: React Native Paper

### Funcionalidades Nativas
- **Audio**: Expo AV
- **Cámara**: Vision Camera + Expo Camera
- **Notificaciones**: Expo Notifications
- **Almacenamiento**: AsyncStorage + MMKV

---

## Estructura de Directorios

```
C:\Mis Cosas\Proyectos\Paziify TEST\
├── admin/                      # Panel de administración
│   ├── src/
│   │   ├── components/         # Componentes UI (Refine)
│   │   ├── constants/          # [NEW] Constantes unificadas (meditation-constants.ts)
│   │   ├── pages/              # Páginas de gestión
│   │   └── providers/          # Providers (auth, data)
│   └── package.json
├── android/                    # Código nativo Android
├── assets/                     # Recursos estáticos
│   ├── fonts/                  # Fuentes tipográficas
│   ├── icon.png                # Icono de la app
│   ├── splash.png              # Pantalla de splash
│   └── zen-hum.mp3             # Sonidos base
├── docs/                       # Documentación
│   ├── academy/                # Documentación de la academia
│   ├── guides/                 # Guías de desarrollo
│   ├── plans/                  # Planes y roadmaps
│   ├── scripts/                # Scripts de meditación
│   ├── tutorials/              # [NEW] Tutoriales de diseño y uso
│   └── sessions/               # Registro de sesiones
├── scripts/                    # Scripts SQL y utilidades
├── src/                        # Código fuente principal
│   ├── assets/                 # Assets optimizados
│   ├── components/             # Componentes reutilizables
│   │   ├── Challenges/         # [NEW] Modales de reto
│   ├── constants/              # Constantes (temas, categorías, retos)
│   │   ├── challenges.ts       # [NEW] Maestro de retos y slugs
│   │   ├── guides.ts           # [NEW] Fuente de verdad de avatares de guías (Aria, Éter...)
│   ├── context/                # Contextos de React
│   ├── data/                   # Datos estáticos y mocks
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Configuraciones de librerías
│   ├── navigation/             # Navegación
│   ├── screens/                # Pantallas de la app
│   ├── services/               # Servicios (API, auth, etc.)
│   ├── types/                  # Definiciones TypeScript
│   └── utils/                  # Utilidades
├── supabase/                   # Configuración Supabase
│   ├── migrations/             # Migraciones SQL
│   └── seeds/                  # Datos iniciales
└── Utils/                      # Scripts de utilidad
```

---

## Pantallas (Screens)

### 1. Academy - Academia CBT

#### `src/screens/Academy/AcademyCourseDetailScreen.tsx`
**Función**: Pantalla de detalle de curso CBT
**Contenido**:
- Visualización del contenido del curso (lecciones, videos, textos)
- Progreso del curso
- Navegación entre módulos
- Quiz interactivo al finalizar cada lección

#### `src/screens/Academy/CBTAcademyScreen.tsx`
**Función**: Pantalla principal de la Academia
**Contenido**:
- Listado de cursos CBT disponibles
- Categorías de cursos (Ansiedad, Estrés, Autoestima, etc.)
- Progreso general del usuario
- Certificados obtenidos
- Recomendaciones personalizadas

#### `src/screens/Academy/CBTDetailScreen.tsx`
**Función**: Detalle de un curso específico
**Contenido**:
- Descripción del curso
- Instructor y duración
- Lecciones incluidas
- Valoraciones y reviews
- Botón de inscripción/inicio

#### `src/screens/Academy/QuizScreen.tsx`
**Función**: Pantalla de cuestionarios
**Contenido**:
- Preguntas de opción múltiple
- Retroalimentación inmediata
- Puntuación y resultados
- Guardado de progreso

---

### 2. BackgroundSound - Sonidos Ambientales

#### `src/screens/BackgroundSound/BackgroundPlayerScreen.tsx`
**Función**: Reproductor de sonidos ambientales
**Contenido**:
- Controles de reproducción (play/pause)
- Ajuste de volumen
- Temporizador de apagado automático
- Mezcla de sonidos
- Visualización de ondas sonoras

#### `src/screens/BackgroundSound/BackgroundSoundScreen.tsx`
**Función**: Catálogo de sonidos ambientales
**Contenido**:
- Grid de soundscapes (Lluvia, Bosque, Olas, etc.)
- Filtros por categoría
- Favoritos
- Previsualización
- Descarga offline

#### `src/screens/BackgroundSound/components/SoundscapeCard.tsx`
**Función**: Tarjeta de visualización de soundscape
**Contenido**:
- Imagen representativa
- Título y descripción breve
- Indicador de duración
- Botón de reproducción rápida
- Icono de favorito

---

### 3. Bio - Bio-feedback Cardíaco (Cardio Scan v2)

#### `src/screens/Bio/CardioScanScreen.tsx`
**Función**: Escaneo cardíaco PPG usando cámara + flash
**Pipeline**: Calibración (3s) → Countdown → Medición progresiva (~30s) → Resultado
**Contenido**:
- Vista previa de la cámara (Vision Camera)
- Guía visual de colocación del dedo (esquemático lente + flash)
- Fase de calibración obligatoria (3s de señal "good")
- Indicador de progreso basado en calidad (no tiempo)
- Diagnóstico contextualizado por edad del perfil de salud
- normalizeHRV conectado al flujo de resultados
- Debug overlay solo en `__DEV__`
- Acepta `context: 'baseline' | 'post_session'` y `sessionData`

#### `src/screens/Bio/CardioResultScreen.tsx`
**Función**: Pantalla de resultados del escaneo cardíaco
**Variantes**:
- **Baseline** (pre-sesión): Vista ligera con BPM + HRV + badge "✓ Bio-ritmo registrado" + CTA "Comenzar Sesión ▶" → `BREATHING_TIMER`
- **Post-sesión**: Comparativa ANTES→DESPUÉS con deltas de BPM y VFC
- **Standalone** (sin programa): Arquetipos positivos (Sol Naciente, Guerrero en Reposo, Marea Calma) + Sanar/Crecer
- **Con programa activo**: "TU MISIÓN DE HOY" + sesión del día + mensaje motivacional adaptado
**Contenido**:
- Tags descriptivos completos (ej: "TU LUZ INTERIOR ES ESTABLE Y BRILLANTE")
- Historial Bio-Ritmo: mini-gráfica barras HRV 7 días (D L M X J V S)
- Disclaimer médico: "⚕️ Esta medición es orientativa..."
- Fondo de sesión via `ImageBackground` cuando `sessionData.thumbnailUrl` disponible
- Botón "Volver a Inicio" (post-session)

#### `src/services/BioSignalProcessor.ts`
**Función**: Motor de procesamiento PPG (algoritmos POS + Legacy Green)
**Pipeline**: Captura RGB @30Hz → Bandpass Filter (0.7-4 Hz) → Detección de picos → MAD Filter → Métricas
**Features v2**:
- Smart Filter: rechaza saltos >40 BPM entre lecturas
- Timestamps reales (no asume 33.33ms/frame)
- Bandpass filter antes de detección de picos
- Duración ~30s (progressDelta 0.08)
- normalizeHRV por edad y género

#### `src/services/CardioService.ts`
**Función**: Servicio de persistencia y consulta de escaneos cardíacos
**Métodos principales**:
- `saveScan()`: Guarda escaneo en AsyncStorage
- `getHistory(limit)`: Últimos N escaneos para gráfica de evolución
- `getTodayBaseline()`: Último baseline del día para comparativa pre/post

---

### 4. Content - Contenido Multimedia

#### `src/screens/Content/AudiobookPlayerScreen.tsx`
**Función**: Reproductor de audiolibros
**Contenido**:
- Portada del audiolibro
- Controles de reproducción (play/pause, siguiente, anterior)
- Control de velocidad (0.5x - 2x)
- Barra de progreso
- Capítulos y marcadores
- Temporizador de apagado
- Modo sleep

#### `src/screens/Content/AudiobooksScreen.tsx`
**Función**: Catálogo de audiolibros
**Contenido**:
- Grid de audiolibros disponibles
- Categorías (Autoayuda, Mindfulness, Psicología)
- Buscar y filtrar
- Continuar escuchando
- Nuevos lanzamientos
- Populares

#### `src/screens/Content/StoriesScreen.tsx`
**Función**: Biblioteca de historias
**Contenido**:
- Historias para dormir/relajación
- Categorías (Fantasía, Naturaleza, Viajes)
- Duración estimada
- Dificultad/nivel de atención
- Recomendaciones

#### `src/screens/Content/StoryDetailScreen.tsx`
**Función**: Detalle de una historia
**Contenido**:
- Sinopsis
- Autor/narrador
- Duración
- Tags y temáticas
- Valoraciones
- Botón de reproducción
- Historias relacionadas

---

### 5. Home - Pantalla Principal

#### `src/screens/Home/HomeScreen.tsx`
**Función**: Dashboard principal de la app (Premium Editorial Layout)
**Contenido**:
- Saludo personalizado (Tipografía manuscrita `Satisfy`)
- "Tu Estado": Dashboard compacto y unificado de analíticas diarias y semanales con orbes `ZenMeter`
- "Tu Práctica": Dosis Diaria en layout "Out-of-box" (Extracto de título y subtítulo externo a la imagen)
- "Consejos del día": BentoGrid modular temático (Formación, Relatos, Binaurales, Audiolibros)
- Progreso de rachas (streaks) e indicador de Actividad Semanal
- Mini reproductor si hay audio activo

---

### 6. Meditation - Meditación

#### `src/screens/Meditation/BreathingTimer.tsx`
**Función**: Motor de sesión de meditación (Audio Engine + Visual Sync)
**Contenido**:
- Animación del orbe de respiración (`ThemedBreathingOrb`)
- Master Clock sincronizado con audio (posición real del track)
- Patrones de respiración configurables con Visual Sync
- Audio Engine de 4 capas (voz, soundscape, binaural, elementos)
- Selección de temas visuales (Cosmos, Cave, Forest, Temple)
- Panel de configuración desplegable con controles de volumen
- Modo Inmersivo (cambia gradiente de fondo)
- Auto-start con countdown de 3s
- Pasa `thumbnailUrl` a `SessionEndScreen` para continuidad visual

#### `src/screens/Meditation/LibraryScreen.tsx`
**Función**: Biblioteca de meditaciones
**Contenido**:
- Colecciones de meditaciones
- Categorías (Dormir, Ansiedad, Enfoque, etc.)
- Meditaciones favoritas
- Descargadas para offline
- Historial

#### `src/screens/Meditation/MeditationCatalogScreen.tsx`
**Función**: Catálogo completo de meditaciones
**Contenido**:
- Todos los contenidos organizados
- Filtros avanzados (duración, categoría, instructor)
- Búsqueda
- Ordenar por popularidad, fecha, duración
- Preview de audio

#### `src/screens/Meditation/SessionDetailScreen.tsx`
**Función**: Detalle de sesión de meditación
**Contenido**:
- Descripción completa
- Instructor
- Duración y dificultad
- Tags y beneficios
- Iniciar sesión
- Añadir a favoritos

#### `src/screens/Meditation/SessionEndScreen.tsx`
**Función**: Pantalla de satisfacción post-meditación
**Contenido**:
- Fondo de sesión via `ImageBackground` + gradiente oscuro
- Selector de estado de ánimo (5 emociones)
- Opción de compartir/comentar
- Footer unificado: `♥ Verificar` (→ post_session scan) + `▶ Continuar` (→ Home)
- Ambos botones `flex: 1` (50/50) con animación heartbeat en botón rojo
- ResilienceTree para retos activos
- Actualización de racha y estadísticas

#### `src/screens/Meditation/TransitionTunnel.tsx`
**Función**: Transición visual entre sesiones
**Contenido**:
- Animación de túnel/túnel de luz
- Efectos visuales inmersivos
- Preparación para la siguiente actividad
- Frases motivacionales

---

### 7. Onboarding - Bienvenida y Registro

#### `src/screens/Onboarding/LoginScreen.tsx`
**Función**: Inicio de sesión
**Contenido**:
- Formulario email/contraseña
- Login con Google OAuth
- Recuperar contraseña
- Enlace a registro
- Modo invitado

#### `src/screens/Onboarding/NotificationSettings.tsx`
**Función**: Ajustes de Perfil (Propósito, Salud, Notificaciones, Sistema)
**Contenido**:
- **Mi Propósito**: Gestión de metas diarias y semanales con controles +/-.
- **Mi Perfil de Salud**: Auto-sync de edad, género, altura y peso.
- **Notificaciones Inteligentes**: Rutina mañana/noche, protección de racha y zona de calma.
- **Cuenta**: Acceso a cierre de sesión unificado.
- **Estética**: Oasis Design (Glassmorphism, micro-bordes, tipografía premium).

#### `src/screens/Onboarding/RegisterScreen.tsx`
**Función**: Registro de nuevos usuarios
**Contenido**:
- Formulario de registro (nombre, email, contraseña)
- Registro con Google
- Términos y condiciones
- Privacidad
- Validación de email

#### `src/screens/Onboarding/WelcomeScreen.tsx`
**Función**: Pantalla de bienvenida
**Contenido**:
- Presentación de la app
- Beneficios principales
- Slider de características
- Call-to-action (registro/login)
- Testimonios

---

### 8. Premium - Suscripción

#### `src/screens/Premium/PaywallScreen.tsx`
**Función**: Pantalla de conversión a premium
**Contenido**:
- Planes de suscripción (mensual/anual)
- Beneficios del premium
- Precios y promociones
- Prueba gratuita
- Restaurar compras
- Términos de suscripción
- Comparativa free vs premium

---

### 9. Profile - Perfil de Usuario

#### `src/screens/Profile/ProfileScreen.tsx`
**Función**: Dashboard de Progreso y Evolución
**Contenido**:
- **Header**: Logout (izq), Ajustes (der).
- **Tu Camino de Paz**: Acceso unificado "Ver Reporte Semanal" con diseño Bento.
- **Árbol de Resiliencia**: Visualización de crecimiento de retos activos.
- **Ritmo de Calma**: Gráfico de barras de actividad semanal.
- **Esencias**: Colección de badges obtenidos.

#### `src/screens/Profile/WeeklyReportScreen.tsx`
**Función**: Reporte semanal de bienestar
**Contenido**:
- Gráfico de actividad semanal
- Minutos de meditación
- Sesiones completadas
- Racha actual y récord
- Comparativa con semana anterior
- Insights y recomendaciones
- Compartir progreso

---

### 10. Sanctuary - Santuario Espiritual

#### `src/screens/Sanctuary/CompassScreen.tsx`
**Función**: Brújula espiritual/selector de experiencias
**Contenido**:
- Interfaz de selección de experiencias
- Modos disponibles (Meditación, Respiración, Exploración)
- Visualización tipo brújula
- Animaciones con Skia
- Acceso a diferentes ambientes

#### `src/screens/Sanctuary/SpiritualPreloader.tsx`
**Función**: Pantalla de carga inmersiva
**Contenido**:
- Animaciones con shaders y Skia
- Efectos atmosféricos
- Indicadores de carga elegantes
- Transiciones suaves
- Frases inspiradoras

---

### 11. Challenges - Sistema de Evolución

#### `src/screens/Challenges/EvolutionCatalogScreen.tsx`
**Función**: Catálogo de programas de evolución personal
**Contenido**:
- Grid de programas disponibles (Desafíos, Retos, Misiones)
- Selección y activación de un programa
- Modal de detalle (`ChallengeDetailsModal`) con beneficios
- Integración con `challenges.ts` como fuente única de verdad
- Navegación: `animation: 'slide_from_bottom'`

---

### 12. Social - Comunidad

#### `src/screens/Social/CommunityScreen.tsx`
**Función**: Pantalla de comunidad
**Contenido**:
- Feed de actividad de la comunidad
- Logros de otros usuarios (anónimos)
- Retos grupales
- Foro de discusión
- Compartir progreso
- Eventos en vivo
- Moderación y normas

---

## Componentes

### Componentes Oasis (PDS v3.0)

#### `src/components/Oasis/OasisInput.tsx`
**Función**: Campo de texto premium
**Props**: label, error, leftIcon, rightIcon
**Características**:
- Glassmorphism con BlurView
- Label flotante animado (Reanimated)
- Haptics al enfocar

#### `src/components/Oasis/OasisToggle.tsx`
**Función**: Switch animado premium
**Props**: value, onValueChange
**Características**:
- Switch con retroalimentación háptica
- Animación suave de color y posición
- Borde glassmorphism translúcido

#### `src/components/Oasis/OasisSkeleton.tsx`
**Función**: Esqueleto de carga inmersivo
**Props**: width, height, borderRadius
**Características**:
- Animación de shimmer continua
- Fondos de gradiente que simulan cristal
- Usado para skeleton states en catálogos

### Componentes de Retos (Sistema de Evolución)

#### `src/components/Challenges/ChallengeDetailsModal.tsx`
**Función**: Modal informativo de programas con diseño premium
**Props**: visible, onClose, challenge (ChallengeInfo), onActivate, hideActivateButton
**Contenido**:
- Título, duración y descripción del reto
- Listado de beneficios con iconos de color dinámico
- Botón CTA con gradiente por programa
- Efectos de desenfoque premium (BlurView intensity 90)
- Border radius 32, borde semitransparente

#### `src/components/Challenges/WidgetTutorialModal.tsx`
**Función**: Tutorial para añadir widget nativo al escritorio
**Props**: isVisible, onClose
**Contenido**:
- Mockup visual del widget
- Pasos diferenciados por plataforma (iOS vs Android)
- Diseño premium con BlurView
- Instrucciones paso a paso numeradas

### Componentes de Home


#### `src/components/Home/BentoGrid.tsx`
**Función**: Grid de accesos rápidos estilo Bento
**Props**: items (array de BentoCard)
**Características**:
- Layout adaptativo (2-3 columnas)
- Espaciado uniforme
- Scroll horizontal opcional
- Diferentes tamaños de tarjetas

#### `src/components/Home/PurposeModal.tsx`
**Función**: Modal para establecer intención diaria
**Props**: visible, onClose, onSave
**Características**:
- Entrada de texto
- Sugerencias predefinidas
- Guardar propósito del día
- Recordatorios de propósito

#### `src/components/Home/StatsCard.tsx`
**Función**: Tarjeta de estadísticas
**Props**: title, value, icon, trend
**Características**:
- Valor principal destacado
- Comparativa con período anterior
- Icono representativo
- Color según tendencia


---

### Componentes de Layout

#### `src/components/Layout/BackgroundWrapper.tsx`
**Función**: Contenedor con fondo personalizado
**Props**: children, type, colors
**Características**:
- Gradientes dinámicos
- Fondos animados
- Patrones SVG
- Adaptación a tema

---

### Componentes de Meditación

#### `src/components/Meditation/BorderEffects/`
**Contenido**: Efectos de borde para sesiones
**Características**:
- Animaciones de luz
- Bordes pulsantes
- Efectos de energía

#### `src/components/Meditation/ProBreathingOrb.tsx`
**Función**: Orbe de respiración profesional
**Props**: phase, duration, size
**Características**:
- Animación suave con Reanimated
- Fases: inhalar, retener, exhalar, pausa
- Personalizable (tamaño, color, velocidad)
- Efectos visuales avanzados

#### `src/components/Meditation/ReanimatedTest.tsx`
**Función**: Componente de prueba para animaciones
**Props**: - 
**Características**:
- Demo de capacidades de Reanimated
- Worklets de animación
- Interacciones gestuales

#### `src/components/Meditation/SkiaTest.tsx`
**Función**: Componente de prueba para Skia
**Props**: -
**Características**:
- Demo de renderizado con Skia
- Shaders personalizados
- Alto rendimiento gráfico

#### `src/components/Meditation/ThemedBreathingOrb.tsx`
**Función**: Orbe de respiración con temas
**Props**: theme, breathingPattern
**Características**:
- Múltiples temas visuales
- Patrones de respiración configurables
- Colores dinámicos
- Efectos de partículas

---

### Componentes de Gamificación

#### `src/components/Gamification/GameContainer.tsx`
**Función**: Orquestador de mini-juegos de mindfulness
**Props**: mode ('healing' \| 'growth'), onClose, onComplete
**Características**:
- Pantalla de selección de juego
- Estados: selection → playing → result
- Resultados con puntuación y feedback

#### `src/components/Gamification/NebulaBreathGame.tsx`
**Función**: Mini-juego de respiración nebular
**Características**:
- Mecánica de timing con respiración
- Efectos de partículas y nebulosa

#### `src/components/Gamification/OrbFlowGame.tsx`
**Función**: Mini-juego de flujo de orbes
**Características**:
- Mecánica de gestos táctiles
- Orbes de energía que fluyen en pantalla

---

### Componentes de Perfil

#### `src/components/Profile/AuraBackground.tsx`
**Función**: Fondo tipo aura para perfil
**Props**: colors, intensity
**Características**:
- Gradientes orgánicos
- Animación de flujo
- Colores personalizables
- Efecto de profundidad

#### `src/components/Profile/ResilienceTree.tsx`
**Función**: Árbol visual de resiliencia
**Props**: growth, stages
**Características**:
- Visualización del crecimiento personal
- Ramas que crecen con el progreso
- Hojas que representan logros
- Animación de crecimiento

---

### Componentes Bio (Cardio Scan)

#### `src/components/Bio/CalibrationRing.tsx`
**Función**: Anillo de progreso animado para calibración
**Props**: score (0-100), ready (boolean)
**Características**:
- Anillo SVG animado con Reanimated
- Color dinámico: 🔴 rojo (<60), 🟡 amarillo (60-79), 🟢 verde (≥80)
- Muestra porcentaje numérico
- Estado textual: "AJUSTA" / "CASI" / "✓ ÓPTIMO"
- Animación suave de 300ms

#### `src/components/Bio/CountdownOverlay.tsx`
**Función**: Overlay de cuenta regresiva (3-2-1)
**Props**: count (number), visible (boolean)
**Características**:
- Overlay fullscreen con fondo oscuro
- Número grande con animación pulse
- Mensaje: "¡Perfecto! Iniciando..."
- Subtítulo: "Mantén el dedo quieto"
- Feedback háptico en cada segundo

#### `src/components/Bio/QualityAlert.tsx`
**Función**: Alerta flotante durante medición
**Props**: visible (boolean), message (string)
**Características**:
- Slide-down animation desde arriba
- Diseño tipo toast con icono ⚠️
- Fondo amarillo con borde naranja
- Sombra y elevación
- Desaparece automáticamente cuando calidad mejora

---

### Componentes del Santuario


#### `src/components/Sanctuary/PortalBackground.tsx`
**Función**: Fondo tipo portal
**Props**: depth, rotation
**Características**:
- Efecto de túnel/portal
- Perspectiva 3D
- Animación de rotación
- Sentido de inmersión

#### `src/components/Sanctuary/StarCore.tsx`
**Función**: Núcleo estelar
**Props**: brightness, pulses
**Características**:
- Centro luminoso
- Pulsos de energía
- Rayos de luz
- Efecto de estrella

#### `src/components/Sanctuary/SunriseBackground.tsx`
**Función**: Fondo de amanecer
**Props**: progress, colors
**Características**:
- Gradiente de amanecer
- Sol naciente
- Nubes y atmósfera
- Transición de colores

---

### Componentes Compartidos

#### `src/components/Player/GlobalMiniPlayer.tsx`
**Función**: Mini reproductor persistente sobre la TabBar
**Características**:
- Flota en todas las pantallas principales
- Renderiza tanto Audiobooks como BackgroundSounds
- Animación de FadeInDown y blur intenso
- Botones de control con feedback háptico
- Sincronizado dinámicamente con `AudioPlayerContext` y `AppContext`

#### `src/components/Shared/BacklitSilhouette.tsx`
**Función**: Silueta con retroiluminación
**Props**: source, intensity
**Características**:
- Efecto de contraluz
- Silueta difuminada
- Luz ambiental
- Atmósfera misteriosa


#### `src/components/Shared/SoundwaveSeparator.tsx`
**Función**: Separador con forma de onda
**Props**: amplitude, frequency
**Características**:
- Línea decorativa
- Forma de onda sonora
- Animación opcional
- Estilo minimalista

---

### Componentes Individuales


#### `src/components/CategoryRow.tsx`
**Función**: Fila de categorías y motor de carrusel premium (Perfect Movement).
**Props**: sessions, cardVariant, accentColor
**Características**:
- Snapping centrado (`ITEM_WIDTH = 0.75`).
- Navegación asistida (Flechas glassmorphic en `top: 216px`).
- Optimización con `FlashList` y `React.memo`.


#### `src/components/GuestBanner.tsx`
**Función**: Banner para usuarios invitados
**Props**: onUpgrade
**Características**:
- Mensaje de modo invitado
- Llamada a la acción de registro
- Información de limitaciones
- Botón de registro


#### `src/components/SessionPreviewModal.tsx`
**Función**: Modal de previsualización de sesión
**Props**: session, visible, onStart
**Características**:
- Vista previa antes de iniciar
- Descripción detallada
- Comentarios
- Sesiones relacionadas
- Botón de inicio

#### `src/components/SleepTimerModal.tsx`
**Función**: Modal de temporizador para dormir
**Props**: visible, onSet, options
**Características**:
- Opciones de tiempo predefinidas
- Slider personalizado
- Volumen gradual
- Acción al finalizar (pausar/cerrar app)

#### `src/components/Shared/SoundwaveSeparator.tsx`
**Función**: Divisor oficial de secciones de borde a borde.
**Props**: fullWidth, accentColor, title
**Características**:
- Reemplaza íntegramente al antiguo `SoundWaveHeader.tsx`.
- Soporta renderizado sin márgenes laterales para diseño premium.
- Texto centrado y tipografía `Caveat`.

#### `src/components/SoundWaveHeader.tsx` [OBSOLETO]
**Estado**: Eliminado / En proceso de limpieza. Sustituido por `SoundwaveSeparator.tsx`.
- Efecto visual sonoro
- Minimalista

#### `src/components/SpeedControlModal.tsx`
**Función**: Modal de control de velocidad
**Props**: currentSpeed, onChange, visible
**Características**:
- Opciones de velocidad (0.5x - 2x)
- Slider continuo
- Preview del cambio
- Cancelar/Confirmar


---

## Navegación

### `src/navigation/AppNavigator.tsx`
**Función**: Navigator principal (Stack Navigator)
**Estructura**:
- Stack de onboarding (Welcome → Login/Register)
- Stack principal con Tabs (MainTabs)
- Stacks anidados para secciones específicas
- Configuración de headers
- Transiciones personalizadas

**Rutas principales**:
- OnboardingStack
- Preloader → Compass
- MainTabs (Bottom Tab Navigator)
- LibraryStack
- PremiumStack

### `src/navigation/TabNavigator.tsx`
**Función**: Navigator de pestañas inferior
**Tabs disponibles**:
1. **Home** - Pantalla principal
2. **Library** - Biblioteca de contenido
3. **Academy** - Academia CBT
4. **Community** - Comunidad social
5. **Profile** - Perfil de usuario

**Características**:
- CustomTabBar personalizado
- Iconos animados
- Badges de notificación
- Ocultar en ciertas pantallas

### `src/navigation/CustomTabBar.tsx`
**Función**: Tab bar personalizado
**Características**:
- Diseño único
- Animaciones de selección
- Efectos de presión
- Colores según tema
- Botón central destacado (opcional)

---

## Servicios

### `src/services/AcademyService.ts`
**Función**: Gestión de la academia CBT
**Métodos**:
- `getCourses()` - Obtener todos los cursos
- `getCourseById(id)` - Detalle de curso
- `enrollInCourse(courseId)` - Inscribirse
- `updateProgress(courseId, progress)` - Actualizar progreso
- `getQuizzes(courseId)` - Obtener cuestionarios
- `submitQuiz(quizId, answers)` - Enviar respuestas

### `src/services/analyticsService.ts`
**Función**: Analytics y métricas de usuario
**Métodos**:
- `getUserStats(userId)` - Estadísticas globales (totalMinutes, sessionsCount, streak, resilienceScore)
- `getTodayStats(userId)` - Minutos y sesiones del día
- `getWeeklyActivity(userId)` - Actividad por día de la semana
- `getCategoryDistribution(userId)` - Distribución de categorías consumidas
- `recordSession(userId, sessionId, duration, mood)` - Registrar sesión completada

### `src/services/AudioEngineService.ts`
**Función**: Motor de audio multi-capa (Clase Singleton)
**Capas**: voice, soundscape, binaural, elements
**Métodos principales**:
- `initialize()` - Configurar modo background
- `loadSession(config)` - Cargar sesión con sus 4 capas de audio
- `playAll()` / `pauseAll()` - Control sincronizado de todas las capas
- `playSelectedLayers(layers)` - Reproducción selectiva
- `setLayerVolume(layer, volume)` / `getVolumes()` - Control de volumen por capa
- `fadeOut(durationMs)` - Fade out suave (por defecto 3000ms)
- `swapSoundscape(id)` / `swapBinaural(id)` - Hot-swap de capas sin detener otras
- `preloadCues(messages)` / `playVoiceCue(type)` - Sistema de instrucciones de voz
- `startSilentAudio()` / `stopSilentAudio()` - "Silent Audio Trick" para mantener JS activo en background
- `unloadAll()` - Liberación de recursos
- `setStatusCallback(callback)` - Master Clock para UI
**Nota**: `loadProVoice()` está desactivado en producción (ahorro 99% TTS).

### `src/services/AuthService.ts`
**Función**: Autenticación de usuarios
**Métodos**:
- `signUp(email, password, name)` - Registro
- `signIn(email, password)` - Login
- `signInWithGoogle()` - Google OAuth
- `signOut()` - Cerrar sesión
- `resetPassword(email)` - Recuperar contraseña
- `getCurrentUser()` - Usuario actual
- `onAuthStateChange(callback)` - Listener de auth

### `src/services/BioSignalProcessor.ts`
**Función**: Procesamiento de señales biométricas
**Métodos**:
- `processFrame(frame)` - Procesar frame de cámara
- `calculateBPM(frames)` - Calcular ritmo cardíaco
- `analyzeHRV(data)` - Analizar variabilidad
- `getStressLevel(hrv)` - Nivel de estrés
- `startScan()` - Iniciar escaneo
- `stopScan()` - Detener escaneo

### `src/services/CacheService.ts`
**Función**: Gestión de caché dual (Zero-Egress Shield)
**Arquitectura**:
- **Persistente** (`documentDirectory/paziify_assets/`) → Audio y Soundscapes (NUNCA se borran)
- **Volátil** (`cacheDirectory/paziify_cache/`) → Imágenes (limpiables)
**Métodos**:
- `get(url, type)` - Obtener recurso (descarga si no existe, devuelve path local)
- `clearVolatileCache()` - Borrar solo caché de imágenes
- `getCacheSize()` - Tamaño total (persistente + volátil)
**Características**:
- Hash MD5 de URLs para nombres de archivo
- Descarga atómica (temporal → mover)
- Headers de autenticación Supabase automáticos
- Fallback a URL remota si la descarga falla

### `src/services/CardioService.ts`
**Función**: Gestión de datos de cardio (Local & Zero-Egress)
**Métodos**:
- `saveSession(metrics)` - Guardar nueva sesión
- `getHistory()` - Recuperar historial local
- `getLatestBaselines()` - Obtener métricas base recientes
- `clearHistory()` - Borrar datos locales
**Características**:
- Persistencia en AsyncStorage
- Separación de contextos (baseline vs post_session)

### `src/services/contentService.ts`
**Función**: Gestión de contenido dinámico (5 sub-servicios exportados)

**`sessionsService`**:
- `getAll()` - Todas las sesiones de meditación
- `getById(id)` / `getByLegacyId(legacyId)` - Búsqueda por ID
- `getByCategory(category)` - Filtro por categoría
- `getDaily()` - Sesión diaria recomendada

**`soundscapesService`**:
- `getAll()` - Con fallback local para Zero Egress
- `getById(id)` - Con prioridad local

**`audiobooksService`**:
- `getAll()`, `getByCategory()`, `getFeatured()`, `getById()`, `search(query)`

**`storiesService`**:
- `getAll()`, `getByCategory()`, `getFeatured()`, `getById()`, `search(query)`
- `populateStories()` - Poblar desde datos de Mentes Maestras

**`favoritesService`** (Cloud + Offline):
- `add(userId, contentType, contentId)` / `remove()` → Supabase
- `isFavorited(userId, contentType, contentId)` → Check
- `getFavoriteAudiobooks(userId)` / `getFavoriteStories(userId)` → Con cache AsyncStorage offline

**`contentService`**:
- `getRandomCategoryImage(mode)` - Imagen aleatoria según intención (healing/growth)

### `src/services/LocalAnalyticsService.ts`
**Función**: Analytics locales (sin conexión)
**Métodos**:
- `storeEvent(event)` - Almacenar evento
- `syncEvents()` - Sincronizar con servidor
- `getLocalStats()` - Estadísticas locales
- `clearOldEvents()` - Limpiar antiguos

### `src/services/playbackStorage.ts`
**Función**: Almacenamiento de progreso de reproducción
**Métodos**:
- `saveProgress(id, position)` - Guardar posición
- `getProgress(id)` - Obtener posición
- `clearProgress(id)` - Limpiar progreso
- `getAllProgress()` - Todo el progreso

### `src/services/supabaseClient.ts`
**Función**: Cliente de Supabase
**Características**:
- Configuración de conexión
- Headers personalizados
- Manejo de errores
- Reintentos automáticos

---

## Contextos

### `src/context/AppContext.tsx`
**Función**: Contexto principal de la aplicación
**Estado (`UserState`)**:
- `id`, `name`, `email`, `avatarUrl` - Identidad
- `isRegistered`, `isGuest` - Estado de autenticación
- `streak`, `resilienceScore`, `totalMinutes` - Métricas
- `isDailySessionDone`, `hasMissedDay` - Ritual diario
- `lifeMode: 'growth' \| 'healing'` - Sintonización persistida
- `activeChallenge: ActiveChallenge \| null` - Programa activo
- `hasAcceptedMonthlyChallenge` - Flag de reto mensual
- `favoriteSessionIds`, `completedSessionIds`, `completedLessons` - Progreso
- `dailyGoalMinutes`, `weeklyGoalMinutes` - Objetivos
- `lastEntryDate`, `lastSessionDate` - Tracking temporal
- `settings` - Notificaciones (morning, night, streak, quiet hours)

**Métodos**:
- `updateUserState(updates)` - Actualizar estado parcial
- `toggleFavorite(sessionId)` - Añadir/Quitar favorito
- `signInWithGoogle()` - Google OAuth
- `continueAsGuest()` / `exitGuestMode()` - Modo invitado
- `markEntryAsDone()` - Marcar entrada diaria
- `signOut()` - Cerrar sesión

**Integraciones**:
- Supabase Auth + perfil automático
- AsyncStorage para persistencia local
- Reminders programados (`scheduleDailyMeditationReminder`)
- Primera entrada del día (`isFirstEntryOfDay`)

### `src/context/AudioPlayerContext.tsx`
**Función**: Contexto del reproductor de audio
**Estado**:
- `currentTrack` - Pista actual
- `isPlaying` - Estado de reproducción
- `position` - Posición actual
- `duration` - Duración total
- `rate` - Velocidad de reproducción
- `volume` - Volumen
- `queue` - Cola de reproducción
- `history` - Historial

**Métodos**:
- `play(track)` - Reproducir pista
- `pause()` - Pausar
- `resume()` - Reanudar
- `stop()` - Detener
- `next()` - Siguiente
- `previous()` - Anterior
- `seek(position)` - Buscar
- `setRate(rate)` - Velocidad
- `addToQueue(track)` - Añadir a cola
- `clearQueue()` - Limpiar cola

**Integraciones**:
- AudioEngineService
- playbackStorage (persistencia)
- Notificaciones de reproducción

---

## Panel de Administración

### Estructura del Admin
```
admin/
├── src/
│   ├── components/
│   │   ├── Breadcrumb.tsx
│   │   ├── Layout.tsx
│   │   ├── MediaUploader.tsx
│   │   └── SideMenu.tsx
│   ├── pages/
│   │   ├── academy/
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   ├── list.tsx
│   │   │   └── show.tsx
│   │   ├── audiobooks/
│   │   ├── meditation-sessions/
│   │   ├── real-stories/
│   │   └── soundscapes/
│   └── providers/
│       ├── auth.ts
│       ├── constants.ts
│       ├── data.ts
│       └── supabase-client.ts
├── package.json
└── vite.config.ts
```

### Tecnologías del Admin
- **Framework**: React 19.1.0
- **Admin Framework**: Refine (gestión de datos)
- **UI Library**: Ant Design v5
- **Backend**: Supabase como data provider
- **Build Tool**: Vite

### Funcionalidades del Admin
- **Gestión de cursos CBT**: Crear, editar, eliminar cursos
- **Gestión de meditaciones**: Subir audio, gestionar metadatos
- **Gestión de audiolibros**: Upload de contenido, capítulos
- **Gestión de historias**: Contenido narrativo
- **Gestión de soundscapes**: Sonidos ambientales
- **Usuarios**: Visualización (no edición directa por seguridad)
- **Analytics**: Dashboard de métricas

---

## Base de Datos (Supabase)

### Migraciones SQL

#### `supabase/migrations/20260125_audiobooks_stories.sql`
**Contenido**:
- Tabla `audiobooks` (id, title, author, description, cover_url, audio_url, duration, chapters)
- Tabla `stories` (id, title, content, category, duration, narrator, tags)
- Relaciones y constraints

#### `supabase/migrations/20260205_cms_content_v2.sql`
**Contenido**:
- Tabla `meditation_sessions` (id, title, description, audio_url, duration, category_id, instructor_id, difficulty)
- Tabla `categories` (id, name, icon, color, description)
- Tabla `instructors` (id, name, bio, avatar_url)
- Tabla `user_progress` (user_id, content_id, progress, completed_at)
- Políticas RLS (Row Level Security)

#### `supabase/migrations/20260209_soundscapes.sql`
**Contenido**:
- Tabla `soundscapes` (id, title, description, audio_url, cover_url, category, duration, tags)
- Tabla `mixes` (user_id, soundscape_ids, volumes, created_at)
- Índices para búsqueda

### Seeds

#### `supabase/seeds/audiobooks_initial.sql`
**Contenido**:
- Datos iniciales de audiolibros populares
- Libros de autoayuda y mindfulness
- URLs de audio y portadas

#### `supabase/seeds/seed_soundscapes.sql`
**Contenido**:
- Soundscapes base (Lluvia, Bosque, Olas, Viento, Fuego)
- URLs de audio
- Metadatos y etiquetas

---

## Hooks Personalizados

### `src/hooks/useContent.ts`
**Función**: Obtención de contenido con React Query
**Hooks exportados**:
- `useSessions()` - Sesiones de meditación
- Integración con `sessionsService` de `contentService.ts`

> **Nota**: La lógica de auth, audio player, progreso, rachas y notificaciones está integrada directamente en `AppContext`, `AudioPlayerContext` y los servicios, no en hooks separados.

---

## Utilidades

### `src/utils/notifications.ts`
**Función**: Configuración de notificaciones push
**Exporta**:
- `requestPermissions()` - Solicitar permisos
- `scheduleLocalNotification()` - Programar local
- `scheduleDailyMeditationReminder()` - Recordatorio diario
- `cancelNotification()` - Cancelar
- `setNotificationHandler()` - Manejador

### `src/utils/notifications.web.ts`
**Función**: Stub de notificaciones para plataforma web
**Exporta**: Mismas funciones que `notifications.ts` pero como no-ops

### `src/utils/storage.ts`
**Función**: Wrappers para AsyncStorage
**Exporta**:
- `setItem(key, value)` - Guardar
- `getItem(key)` - Obtener
- `removeItem(key)` - Eliminar
- `clear()` - Limpiar todo
- `multiGet(keys)` - Múltiples

### `src/utils/rgbExtraction.ts`
**Función**: Extracción de datos RGB de frames de cámara para Cardio Scan (rPPG)
**Exporta**:
- `extractRGBFromFrame(pixels, pixelFormat)` - Extracción real con soporte YUV y RGB (worklet)
- `extractRGBFallback(width, height)` - Fallback cuando `toArrayBuffer()` no está disponible

---

## Tipos TypeScript

### `src/types/index.ts`
**Contenido**:
- `User` - Interfaz de usuario
- `Meditation` - Interfaz de meditación
- `Audiobook` - Interfaz de audiolibro
- `Story` - Interfaz de historia
- `Course` - Interfaz de curso CBT
- `Session` - Interfaz de sesión
- `Category` - Interfaz de categoría
- `Progress` - Interfaz de progreso
- Enums y tipos auxiliares

---

## Constantes

### `src/constants/theme.ts`
**Contenido**:
- Colores principales
- Colores de estado (success, error, warning)
- Tipografía (fuentes, tamaños)
- Espaciado
- Border radius
- Sombras

### `src/constants/categories.ts`
**Contenido**:
- Categorías de meditación predefinidas
- Colores asociados
- Iconos
- Descripciones

### `src/constants/challenges.ts`
**Contenido**: Fuente única de verdad del Sistema de Evolución
- `ChallengeInfo` interface (id, title, type, days, description, benefits, sessionSlug, colors, icon)
- `CHALLENGES` Record con 5 programas:
  - `paziify-master` (Desafío, 30d, Indigo)
  - `senda-calma` (Reto, 7d, Teal)
  - `senda-foco` (Reto, 7d, Amber)
  - `sprint-sos` (Misión, 3d, Rojo)
  - `pausa-express` (Misión, 3d, Violeta)

### `src/constants/oasisExperiments.ts`
**Contenido**: Infraestructura de Feature Flags (Gate)
- Rutas PDS controladas por variable de entorno o Role
- Activa o desactiva las vistas experimentales
- Determina qué usuarios ven la experiencia premium (role === 'admin')

### `src/constants/images.ts`
**Contenido**:
- Importaciones de imágenes
- Placeholders
- Icons
- URLs de assets remotos

### `src/constants/visualThemes.ts`
**Contenido**:
- Temas visuales para sesiones de meditación
- Gradientes e intensidades por modo

---

## Datos Estáticos (`src/data/`)

| Archivo | Tamaño | Propósito |
|---------|--------|----------|
| `sessionsData.ts` | 153 KB | 119 sesiones de meditación con URLs, configs y metadatos |
| `academyData.ts` | 49 KB | 10 cursos CBT con módulos y lecciones |
| `realStories.ts` | 51 KB | Historias de Mentes Maestras |
| `quizData.ts` | 12 KB | Preguntas de evaluación para cursos |
| `soundscapesData.ts` | 12 KB | Paisajes sonoros y ondas binaurales |
| `audiobooksData.ts` | 3 KB | Catálogo de audiolibros |
| `socialData.ts` | 1 KB | Datos de comunidad |
| `newSessionsGenerated.json` | 113 KB | JSON de generación masiva (migración) |
| `real_stories_data.sql` | 40 KB | Script SQL de semillas para historias |

### `app.json`
**Configuración**:
- Nombre y slug de la app
- Versión y versión de build
- Orientación (portrait)
- Icono y splash screen
- Plugins de Expo (Firebase, Notificaciones, etc.)
- Esquema de URL
- iOS y Android config
- Actualizaciones OTA

### `eas.json`
**Configuración de builds**:
- Perfiles de build (development, preview, production)
- Credentials
- Automatización
- Env vars

---

## Scripts Útiles

### `/Utils/backup-db.bat`
**Función**: Script de backup de base de datos

### `/Utils/setup-env.ps1`
**Función**: Script de configuración inicial

### `/scripts/seed-data.sql`
**Función**: Script SQL de datos de prueba

---

## Resumen de Flujos Principales

### Flujo de Onboarding
1. WelcomeScreen → Presentación
2. Login/RegisterScreen → Autenticación
3. NotificationSettings → Permisos
4. CompassScreen → Inicio de experiencia

### Flujo de Meditación
1. Home/Library → Selección
2. SessionDetailScreen → Preparación
3. BreathingTimer → Inicio guiado
4. SessionEndScreen → Finalización
5. Actualización de stats y streak

### Flujo de Academia CBT
1. CBTAcademyScreen → Listado de cursos
2. AcademyCourseDetailScreen → Detalle
3. QuizScreen → Evaluación
4. Progreso guardado en Supabase

### Flujo de Audio
1. Selección de contenido
2. MiniPlayer aparece automáticamente
3. AudioPlayerScreen (expandido)
4. Persistencia de progreso
5. Background audio support

---

## Notas de Desarrollo

### Convenciones
- **Nombres de archivos**: PascalCase para componentes, camelCase para utilidades
- **Exportaciones**: Preferir export default para componentes
- **Estilos**: StyleSheet.create() con naming consistente
- **Types**: Todas las interfaces en `src/types/`

### Buenas Prácticas
- Separación de responsabilidades (screens vs components)
- Custom hooks para lógica reutilizable
- Services para operaciones de API
- Context para estado global
- Persistencia local para UX offline

### Optimizaciones
- React.memo para componentes pesados
- useMemo/useCallback donde sea necesario
- Lazy loading de pantallas
- Imágenes optimizadas
- Caché de requests con React Query

---

*Documento actualizado el 26 de Febrero de 2026*  
*Versión del proyecto: 2.34.0 (PDS v3.0)*  
*Total de pantallas: 32*  
*Total de componentes: 50+*  
*Total de servicios: 12*
