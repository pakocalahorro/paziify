# Estructura del Proyecto Paziify

## Ãndice
1. [VisiÃ³n General](#visiÃ³n-general)
2. [Stack TecnolÃ³gico](#stack-tecnolÃ³gico)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Pantallas (Screens)](#pantallas-screens)
5. [Componentes](#componentes)
6. [NavegaciÃ³n](#navegaciÃ³n)
7. [Servicios](#servicios)
8. [Contextos](#contextos)
9. [Panel de AdministraciÃ³n](#panel-de-administraciÃ³n)
10. [Base de Datos](#base-de-datos)

---

## VisiÃ³n General

**Paziify** es una aplicaciÃ³n mÃ³vil de bienestar, mindfulness y salud mental desarrollada con React Native y Expo. La app ofrece meditaciones guiadas, audiolibros, terapia cognitivo-conductual (CBT), bio-feedback y una experiencia de santuario espiritual inmersivo.

**VersiÃ³n**: 2.44.0 (Admin Roles Stabilization)
**Ãšltima actualizaciÃ³n**: 6 de Marzo de 2026

**Historial Reciente**:
- **v2.44.0**: ReparaciÃ³n CrÃ­tica de Guardado (RLS Admin Fix) y Shadow Sync Architectura para Panel Admin.
- **v2.39.0**: Favoritos Unificados, SincronizaciÃ³n OasisCard (Admin Sync) y Hotfixes de Audio.

---

## Stack TecnolÃ³gico

### Core
- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Lenguaje**: TypeScript 5.9
- **NavegaciÃ³n**: React Navigation v7
- **Estado**: Context API + TanStack Query (React Query)

### Backend & AutenticaciÃ³n
- **BaaS**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Google OAuth

### UI/UX
- **Animaciones**: React Native Reanimated 4.1 + React Native Skia 2.2
- **Iconos**: Expo Vector Icons (Ionicons)
- **Componentes UI**: React Native Paper

### Funcionalidades Nativas
- **Audio**: Expo AV
- **CÃ¡mara**: Vision Camera + Expo Camera
- **Notificaciones**: Expo Notifications
- **Almacenamiento**: AsyncStorage + MMKV

---

## Estructura de Directorios

```
C:\Mis Cosas\Proyectos\Paziify TEST\
â”œâ”€â”€ admin/                      # Panel de administraciÃ³n
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/         # Componentes UI (Refine)
â”‚   â”‚   â”œâ”€â”€ constants/          # [NEW] Constantes unificadas (meditation-constants.ts)
â”‚   â”‚   â”œâ”€â”€ pages/              # PÃ¡ginas de gestiÃ³n
â”‚   â”‚   â””â”€â”€ providers/          # Providers (auth, data)
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ android/                    # CÃ³digo nativo Android
â”œâ”€â”€ assets/                     # Recursos estÃ¡ticos
â”‚   â”œâ”€â”€ fonts/                  # Fuentes tipogrÃ¡ficas
â”‚   â”œâ”€â”€ icon.png                # Icono de la app
â”‚   â”œâ”€â”€ splash.png              # Pantalla de splash
â”‚   â””â”€â”€ zen-hum.mp3             # Sonidos base
â”œâ”€â”€ docs/                       # DocumentaciÃ³n
â”‚   â”œâ”€â”€ academy/                # DocumentaciÃ³n de la academia
â”‚   â”œâ”€â”€ guides/                 # GuÃ­as de desarrollo
â”‚   â”œâ”€â”€ plans/                  # Planes y roadmaps
â”‚   â”œâ”€â”€ scripts/                # Scripts de meditaciÃ³n
â”‚   â”œâ”€â”€ tutorials/              # [NEW] Tutoriales de diseÃ±o y uso
â”‚   â””â”€â”€ sessions/               # Registro de sesiones
â”œâ”€â”€ scripts/                    # Scripts SQL y utilidades
â”œâ”€â”€ src/                        # CÃ³digo fuente principal
â”‚   â”œâ”€â”€ assets/                 # Assets optimizados
â”‚   â”œâ”€â”€ components/             # Componentes reutilizables
â”‚   â”‚   â”œâ”€â”€ Challenges/         # [NEW] Modales de reto
â”‚   â”œâ”€â”€ constants/              # Constantes (temas, categorÃ­as, retos)
â”‚   â”‚   â”œâ”€â”€ challenges.ts       # [NEW] Maestro de retos y slugs
â”‚   â”‚   â”œâ”€â”€ guides.ts           # [NEW] Fuente de verdad de avatares de guÃ­as (Aria, Ã‰ter...)
â”‚   â”œâ”€â”€ context/                # Contextos de React
â”‚   â”œâ”€â”€ data/                   # Datos estÃ¡ticos y mocks
â”‚   â”œâ”€â”€ hooks/                  # Custom hooks
â”‚   â”œâ”€â”€ lib/                    # Configuraciones de librerÃ­as
â”‚   â”œâ”€â”€ navigation/             # NavegaciÃ³n
â”‚   â”œâ”€â”€ screens/                # Pantallas de la app
â”‚   â”œâ”€â”€ services/               # Servicios (API, auth, etc.)
â”‚   â”œâ”€â”€ types/                  # Definiciones TypeScript
â”‚   â””â”€â”€ utils/                  # Utilidades
â”œâ”€â”€ supabase/                   # ConfiguraciÃ³n Supabase
â”‚   â”œâ”€â”€ migrations/             # Migraciones SQL
â”‚   â””â”€â”€ seeds/                  # Datos iniciales
â””â”€â”€ Utils/                      # Scripts de utilidad
```

---

## Pantallas (Screens)

### 1. Academy - Academia CBT

#### `src/screens/Academy/AcademyCourseDetailScreen.tsx`
**FunciÃ³n**: Pantalla de detalle de curso CBT
**Contenido**:
- VisualizaciÃ³n del contenido del curso (lecciones, videos, textos)
- Progreso del curso
- NavegaciÃ³n entre mÃ³dulos
- Quiz interactivo al finalizar cada lecciÃ³n

#### `src/screens/Academy/CBTAcademyScreen.tsx`
**FunciÃ³n**: Pantalla principal de la Academia
**Contenido**:
- Listado de cursos CBT disponibles
- CategorÃ­as de cursos (Ansiedad, EstrÃ©s, Autoestima, etc.)
- Progreso general del usuario
- Certificados obtenidos
- Recomendaciones personalizadas

#### `src/screens/Academy/CBTDetailScreen.tsx`
**FunciÃ³n**: Detalle de un curso especÃ­fico
**Contenido**:
- DescripciÃ³n del curso
- Instructor y duraciÃ³n
- Lecciones incluidas
- Valoraciones y reviews
- BotÃ³n de inscripciÃ³n/inicio

#### `src/screens/Academy/QuizScreen.tsx`
**FunciÃ³n**: Pantalla de cuestionarios
**Contenido**:
- Preguntas de opciÃ³n mÃºltiple
- RetroalimentaciÃ³n inmediata
- PuntuaciÃ³n y resultados
- Guardado de progreso

---

### 2. BackgroundSound - Sonidos Ambientales

#### `src/screens/BackgroundSound/BackgroundPlayerScreen.tsx`
**FunciÃ³n**: Reproductor de sonidos ambientales
**Contenido**:
- Controles de reproducciÃ³n (play/pause)
- Ajuste de volumen
- Temporizador de apagado automÃ¡tico
- Mezcla de sonidos
- VisualizaciÃ³n de ondas sonoras

#### `src/screens/BackgroundSound/BackgroundSoundScreen.tsx`
**FunciÃ³n**: CatÃ¡logo de sonidos ambientales
**Contenido**:
- Grid de soundscapes (Lluvia, Bosque, Olas, etc.)
- Filtros por categorÃ­a
- Favoritos
- PrevisualizaciÃ³n
- Descarga offline

#### `src/screens/BackgroundSound/components/SoundscapeCard.tsx`
**FunciÃ³n**: Tarjeta de visualizaciÃ³n de soundscape
**Contenido**:
- Imagen representativa
- TÃ­tulo y descripciÃ³n breve
- Indicador de duraciÃ³n
- BotÃ³n de reproducciÃ³n rÃ¡pida
- Icono de favorito

---

### 3. Bio - Bio-feedback CardÃ­aco (Cardio Scan v2)

#### `src/screens/Bio/CardioScanScreen.tsx`
**FunciÃ³n**: Escaneo cardÃ­aco PPG usando cÃ¡mara + flash
**Pipeline**: CalibraciÃ³n (3s) â†’ Countdown â†’ MediciÃ³n progresiva (~30s) â†’ Resultado
**Contenido**:
- Vista previa de la cÃ¡mara (Vision Camera)
- GuÃ­a visual de colocaciÃ³n del dedo (esquemÃ¡tico lente + flash)
- Fase de calibraciÃ³n obligatoria (3s de seÃ±al "good")
- Indicador de progreso basado en calidad (no tiempo)
- DiagnÃ³stico contextualizado por edad del perfil de salud
- normalizeHRV conectado al flujo de resultados
- Debug overlay solo en `__DEV__`
- Acepta `context: 'baseline' | 'post_session'` y `sessionData`

#### `src/screens/Bio/CardioResultScreen.tsx`
**FunciÃ³n**: Pantalla de resultados del escaneo cardÃ­aco
**Variantes**:
- **Baseline** (pre-sesiÃ³n): Vista ligera con BPM + HRV + badge "âœ“ Bio-ritmo registrado" + CTA "Comenzar SesiÃ³n â–¶" â†’ `BREATHING_TIMER`
- **Post-sesiÃ³n**: Comparativa ANTESâ†’DESPUÃ‰S con deltas de BPM y VFC
- **Standalone** (sin programa): Arquetipos positivos (Sol Naciente, Guerrero en Reposo, Marea Calma) + Sanar/Crecer
- **Con programa activo**: "TU MISIÃ“N DE HOY" + sesiÃ³n del dÃ­a + mensaje motivacional adaptado
**Contenido**:
- Tags descriptivos completos (ej: "TU LUZ INTERIOR ES ESTABLE Y BRILLANTE")
- Historial Bio-Ritmo: mini-grÃ¡fica barras HRV 7 dÃ­as (D L M X J V S)
- Disclaimer mÃ©dico: "âš•ï¸ Esta mediciÃ³n es orientativa..."
- Fondo de sesiÃ³n via `ImageBackground` cuando `sessionData.thumbnailUrl` disponible
- BotÃ³n "Volver a Inicio" (post-session)

#### `src/services/BioSignalProcessor.ts`
**FunciÃ³n**: Motor de procesamiento PPG (algoritmos POS + Legacy Green)
**Pipeline**: Captura RGB @30Hz â†’ Bandpass Filter (0.7-4 Hz) â†’ DetecciÃ³n de picos â†’ MAD Filter â†’ MÃ©tricas
**Features v2**:
- Smart Filter: rechaza saltos >40 BPM entre lecturas
- Timestamps reales (no asume 33.33ms/frame)
- Bandpass filter antes de detecciÃ³n de picos
- DuraciÃ³n ~30s (progressDelta 0.08)
- normalizeHRV por edad y gÃ©nero

#### `src/services/CardioService.ts`
**FunciÃ³n**: Servicio de persistencia y consulta de escaneos cardÃ­acos
**MÃ©todos principales**:
- `saveScan()`: Guarda escaneo en AsyncStorage
- `getHistory(limit)`: Ãšltimos N escaneos para grÃ¡fica de evoluciÃ³n
- `getTodayBaseline()`: Ãšltimo baseline del dÃ­a para comparativa pre/post

---

### 4. Content - Contenido Multimedia

#### `src/screens/Content/AudiobookPlayerScreen.tsx`
**FunciÃ³n**: Reproductor de audiolibros
**Contenido**:
- Portada del audiolibro
- Controles de reproducciÃ³n (play/pause, siguiente, anterior)
- Control de velocidad (0.5x - 2x)
- Barra de progreso
- CapÃ­tulos y marcadores
- Temporizador de apagado
- Modo sleep

#### `src/screens/Content/AudiobooksScreen.tsx`
**FunciÃ³n**: CatÃ¡logo de audiolibros
**Contenido**:
- Grid de audiolibros disponibles
- CategorÃ­as (Autoayuda, Mindfulness, PsicologÃ­a)
- Buscar y filtrar
- Continuar escuchando
- Nuevos lanzamientos
- Populares

#### `src/screens/Content/StoriesScreen.tsx`
**FunciÃ³n**: Biblioteca de historias
**Contenido**:
- Historias para dormir/relajaciÃ³n
- CategorÃ­as (FantasÃ­a, Naturaleza, Viajes)
- DuraciÃ³n estimada
- Dificultad/nivel de atenciÃ³n
- Recomendaciones

#### `src/screens/Content/StoryDetailScreen.tsx`
**FunciÃ³n**: Detalle de una historia
**Contenido**:
- Sinopsis
- Autor/narrador
- DuraciÃ³n
- Tags y temÃ¡ticas
- Valoraciones
- BotÃ³n de reproducciÃ³n
- Historias relacionadas

---

### 5. Home - Pantalla Principal

#### `src/screens/Home/HomeScreen.tsx`
**FunciÃ³n**: Dashboard principal de la app (Premium Editorial Layout)
**Contenido**:
- Saludo personalizado (TipografÃ­a manuscrita `Satisfy`)
- "Tu Estado": Dashboard compacto y unificado de analÃ­ticas diarias y semanales con orbes `ZenMeter`
- "Tus Favoritos": [NEW v2.39.0] Motor de agregaciÃ³n inteligente que unifica Meditaciones, Audiolibros y Academia en un solo lugar (Persistencia Supabase).
- "Tu PrÃ¡ctica": Dosis Diaria en layout "Out-of-box" (Extracto de tÃ­tulo y subtÃ­tulo externo a la imagen)
- "Consejos del dÃ­a": BentoGrid modular temÃ¡tico (FormaciÃ³n, Relatos, Binaurales, Audiolibros)
- Progreso de rachas (streaks) e indicador de Actividad Semanal
- Mini reproductor global flotante (`GlobalMiniPlayer.tsx`) con protocolo de auto-stop.

---

### 6. Meditation - MeditaciÃ³n

#### `src/screens/Meditation/BreathingTimer.tsx`
**FunciÃ³n**: Motor de sesiÃ³n de meditaciÃ³n (Audio Engine + Visual Sync)
**Contenido**:
- AnimaciÃ³n del orbe de respiraciÃ³n (`ThemedBreathingOrb`)
- Master Clock sincronizado con audio (posiciÃ³n real del track)
- Patrones de respiraciÃ³n configurables con Visual Sync
- Audio Engine de 4 capas (voz, soundscape, binaural, elementos)
- SelecciÃ³n de temas visuales (Cosmos, Cave, Forest, Temple)
- Panel de configuraciÃ³n desplegable con controles de volumen
- Modo Inmersivo (cambia gradiente de fondo)
- Auto-start con countdown de 3s
- Pasa `thumbnailUrl` a `SessionEndScreen` para continuidad visual

#### `src/screens/Meditation/LibraryScreen.tsx`
**FunciÃ³n**: Biblioteca de meditaciones
**Contenido**:
- Colecciones de meditaciones
- CategorÃ­as (Dormir, Ansiedad, Enfoque, etc.)
- Meditaciones favoritas
- Descargadas para offline
- Historial

#### `src/screens/Meditation/MeditationCatalogScreen.tsx`
**FunciÃ³n**: CatÃ¡logo completo de meditaciones
**Contenido**:
- Todos los contenidos organizados
- Filtros avanzados (duraciÃ³n, categorÃ­a, instructor)
- BÃºsqueda
- Ordenar por popularidad, fecha, duraciÃ³n
- Preview de audio

#### `src/screens/Meditation/SessionDetailScreen.tsx`
**FunciÃ³n**: Detalle de sesiÃ³n de meditaciÃ³n
**Contenido**:
- DescripciÃ³n completa
- Instructor
- DuraciÃ³n y dificultad
- Tags y beneficios
- Iniciar sesiÃ³n
- AÃ±adir a favoritos

#### `src/screens/Meditation/SessionEndScreen.tsx`
**FunciÃ³n**: Pantalla de satisfacciÃ³n post-meditaciÃ³n
**Contenido**:
- Fondo de sesiÃ³n via `ImageBackground` + gradiente oscuro
- Selector de estado de Ã¡nimo (5 emociones)
- OpciÃ³n de compartir/comentar
- Footer unificado: `â™¥ Verificar` (â†’ post_session scan) + `â–¶ Continuar` (â†’ Home)
- Ambos botones `flex: 1` (50/50) con animaciÃ³n heartbeat en botÃ³n rojo
- ResilienceTree para retos activos
- ActualizaciÃ³n de racha y estadÃ­sticas

#### `src/screens/Meditation/TransitionTunnel.tsx`
**FunciÃ³n**: TransiciÃ³n visual entre sesiones
**Contenido**:
- AnimaciÃ³n de tÃºnel/tÃºnel de luz
- Efectos visuales inmersivos
- PreparaciÃ³n para la siguiente actividad
- Frases motivacionales

---

### 7. Onboarding - Bienvenida y Registro

#### `src/screens/Onboarding/LoginScreen.tsx`
**FunciÃ³n**: Inicio de sesiÃ³n
**Contenido**:
- Formulario email/contraseÃ±a
- Login con Google OAuth
- Recuperar contraseÃ±a
- Enlace a registro
- Modo invitado

#### `src/screens/Onboarding/NotificationSettings.tsx`
**FunciÃ³n**: Ajustes de Perfil (PropÃ³sito, Salud, Notificaciones, Sistema)
**Contenido**:
- **Mi PropÃ³sito**: GestiÃ³n de metas diarias y semanales con controles +/-.
- **Mi Perfil de Salud**: Auto-sync de edad, gÃ©nero, altura y peso.
- **Notificaciones Inteligentes**: Rutina maÃ±ana/noche, protecciÃ³n de racha y zona de calma.
- **Cuenta**: Acceso a cierre de sesiÃ³n unificado.
- **EstÃ©tica**: Oasis Design (Glassmorphism, micro-bordes, tipografÃ­a premium).

#### `src/screens/Onboarding/RegisterScreen.tsx`
**FunciÃ³n**: Registro de nuevos usuarios
**Contenido**:
- Formulario de registro (nombre, email, contraseÃ±a)
- Registro con Google
- TÃ©rminos y condiciones
- Privacidad
- ValidaciÃ³n de email

#### `src/screens/Onboarding/WelcomeScreen.tsx`
**FunciÃ³n**: Pantalla de bienvenida
**Contenido**:
- PresentaciÃ³n de la app
- Beneficios principales
- Slider de caracterÃ­sticas
- Call-to-action (registro/login)
- Testimonios

---

### 8. Premium - SuscripciÃ³n

#### `src/screens/Premium/PaywallScreen.tsx`
**FunciÃ³n**: Pantalla de conversiÃ³n a premium
**Contenido**:
- Planes de suscripciÃ³n (mensual/anual)
- Beneficios del premium
- Precios y promociones
- Prueba gratuita
- Restaurar compras
- TÃ©rminos de suscripciÃ³n
- Comparativa free vs premium

---

### 9. Profile - Perfil de Usuario

#### `src/screens/Profile/ProfileScreen.tsx`
**FunciÃ³n**: Dashboard de Progreso y EvoluciÃ³n
**Contenido**:
- **Header**: Logout (izq), Ajustes (der).
- **Tu Camino de Paz**: Acceso unificado "Ver Reporte Semanal" con diseÃ±o Bento.
- **Ãrbol de Resiliencia**: VisualizaciÃ³n de crecimiento de retos activos.
- **Ritmo de Calma**: GrÃ¡fico de barras de actividad semanal.
- **Esencias**: ColecciÃ³n de badges obtenidos.

#### `src/screens/Profile/WeeklyReportScreen.tsx`
**FunciÃ³n**: Reporte semanal de bienestar
**Contenido**:
- GrÃ¡fico de actividad semanal
- Minutos de meditaciÃ³n
- Sesiones completadas
- Racha actual y rÃ©cord
- Comparativa con semana anterior
- Insights y recomendaciones
- Compartir progreso

---

### 10. Sanctuary - Santuario Espiritual

#### `src/screens/Sanctuary/CompassScreen.tsx`
**FunciÃ³n**: BrÃºjula espiritual/selector de experiencias
**Contenido**:
- Interfaz de selecciÃ³n de experiencias
- Modos disponibles (MeditaciÃ³n, RespiraciÃ³n, ExploraciÃ³n)
- VisualizaciÃ³n tipo brÃºjula
- Animaciones con Skia
- Acceso a diferentes ambientes

#### `src/screens/Sanctuary/SpiritualPreloader.tsx`
**FunciÃ³n**: Pantalla de carga inmersiva
**Contenido**:
- Animaciones con shaders y Skia
- Efectos atmosfÃ©ricos
- Indicadores de carga elegantes
- Transiciones suaves
- Frases inspiradoras

---

### 11. Challenges - Sistema de EvoluciÃ³n

#### `src/screens/Challenges/EvolutionCatalogScreen.tsx`
**FunciÃ³n**: CatÃ¡logo de programas de evoluciÃ³n personal
**Contenido**:
- Grid de programas disponibles (DesafÃ­os, Retos, Misiones)
- SelecciÃ³n y activaciÃ³n de un programa
- Modal de detalle (`ChallengeDetailsModal`) con beneficios
- IntegraciÃ³n con `challenges.ts` como fuente Ãºnica de verdad
- NavegaciÃ³n: `animation: 'slide_from_bottom'`

---

### 12. Social - Comunidad

#### `src/screens/Social/CommunityScreen.tsx`
**FunciÃ³n**: Pantalla de comunidad
**Contenido**:
- Feed de actividad de la comunidad
- Logros de otros usuarios (anÃ³nimos)
- Retos grupales
- Foro de discusiÃ³n
- Compartir progreso
- Eventos en vivo
- ModeraciÃ³n y normas

---

## Componentes

### Componentes Oasis (PDS v3.0)

#### `src/components/Oasis/OasisInput.tsx`
**FunciÃ³n**: Campo de texto premium
**Props**: label, error, leftIcon, rightIcon
**CaracterÃ­sticas**:
- Glassmorphism con BlurView
- Label flotante animado (Reanimated)
- Haptics al enfocar

#### `src/components/Oasis/OasisToggle.tsx`
**FunciÃ³n**: Switch animado premium
**Props**: value, onValueChange
**CaracterÃ­sticas**:
- Switch con retroalimentaciÃ³n hÃ¡ptica
- AnimaciÃ³n suave de color y posiciÃ³n
- Borde glassmorphism translÃºcido

#### `src/components/Oasis/OasisSkeleton.tsx`
**FunciÃ³n**: Esqueleto de carga inmersivo
**Props**: width, height, borderRadius
**CaracterÃ­sticas**:
- AnimaciÃ³n de shimmer continua
- Fondos de gradiente que simulan cristal
- Usado para skeleton states en catÃ¡logos

### Componentes de Retos (Sistema de EvoluciÃ³n)

#### `src/components/Challenges/ChallengeDetailsModal.tsx`
**FunciÃ³n**: Modal informativo de programas con diseÃ±o premium
**Props**: visible, onClose, challenge (ChallengeInfo), onActivate, hideActivateButton
**Contenido**:
- TÃ­tulo, duraciÃ³n y descripciÃ³n del reto
- Listado de beneficios con iconos de color dinÃ¡mico
- BotÃ³n CTA con gradiente por programa
- Efectos de desenfoque premium (BlurView intensity 90)
- Border radius 32, borde semitransparente

#### `src/components/Challenges/WidgetTutorialModal.tsx`
**FunciÃ³n**: Tutorial para aÃ±adir widget nativo al escritorio
**Props**: isVisible, onClose
**Contenido**:
- Mockup visual del widget
- Pasos diferenciados por plataforma (iOS vs Android)
- DiseÃ±o premium con BlurView
- Instrucciones paso a paso numeradas

### Componentes de Home


#### `src/components/Home/BentoGrid.tsx`
**FunciÃ³n**: Grid de accesos rÃ¡pidos estilo Bento
**Props**: items (array de BentoCard)
**CaracterÃ­sticas**:
- Layout adaptativo (2-3 columnas)
- Espaciado uniforme
- Scroll horizontal opcional
- Diferentes tamaÃ±os de tarjetas

#### `src/components/Home/PurposeModal.tsx`
**FunciÃ³n**: Modal para establecer intenciÃ³n diaria
**Props**: visible, onClose, onSave
**CaracterÃ­sticas**:
- Entrada de texto
- Sugerencias predefinidas
- Guardar propÃ³sito del dÃ­a
- Recordatorios de propÃ³sito

#### `src/components/Home/StatsCard.tsx`
**FunciÃ³n**: Tarjeta de estadÃ­sticas
**Props**: title, value, icon, trend
**CaracterÃ­sticas**:
- Valor principal destacado
- Comparativa con perÃ­odo anterior
- Icono representativo
- Color segÃºn tendencia


---

### Componentes de Layout

#### `src/components/Layout/BackgroundWrapper.tsx`
**FunciÃ³n**: Contenedor con fondo personalizado
**Props**: children, type, colors
**CaracterÃ­sticas**:
- Gradientes dinÃ¡micos
- Fondos animados
- Patrones SVG
- AdaptaciÃ³n a tema

---

### Componentes de MeditaciÃ³n

#### `src/components/Meditation/BorderEffects/`
**Contenido**: Efectos de borde para sesiones
**CaracterÃ­sticas**:
- Animaciones de luz
- Bordes pulsantes
- Efectos de energÃ­a

#### `src/components/Meditation/ProBreathingOrb.tsx`
**FunciÃ³n**: Orbe de respiraciÃ³n profesional
**Props**: phase, duration, size
**CaracterÃ­sticas**:
- AnimaciÃ³n suave con Reanimated
- Fases: inhalar, retener, exhalar, pausa
- Personalizable (tamaÃ±o, color, velocidad)
- Efectos visuales avanzados

#### `src/components/Meditation/ReanimatedTest.tsx`
**FunciÃ³n**: Componente de prueba para animaciones
**Props**: - 
**CaracterÃ­sticas**:
- Demo de capacidades de Reanimated
- Worklets de animaciÃ³n
- Interacciones gestuales

#### `src/components/Meditation/SkiaTest.tsx`
**FunciÃ³n**: Componente de prueba para Skia
**Props**: -
**CaracterÃ­sticas**:
- Demo de renderizado con Skia
- Shaders personalizados
- Alto rendimiento grÃ¡fico

#### `src/components/Meditation/ThemedBreathingOrb.tsx`
**FunciÃ³n**: Orbe de respiraciÃ³n con temas
**Props**: theme, breathingPattern
**CaracterÃ­sticas**:
- MÃºltiples temas visuales
- Patrones de respiraciÃ³n configurables
- Colores dinÃ¡micos
- Efectos de partÃ­culas

---

### Componentes de GamificaciÃ³n

#### `src/components/Gamification/GameContainer.tsx`
**FunciÃ³n**: Orquestador de mini-juegos de mindfulness
**Props**: mode ('healing' \| 'growth'), onClose, onComplete
**CaracterÃ­sticas**:
- Pantalla de selecciÃ³n de juego
- Estados: selection â†’ playing â†’ result
- Resultados con puntuaciÃ³n y feedback

#### `src/components/Gamification/NebulaBreathGame.tsx`
**FunciÃ³n**: Mini-juego de respiraciÃ³n nebular
**CaracterÃ­sticas**:
- MecÃ¡nica de timing con respiraciÃ³n
- Efectos de partÃ­culas y nebulosa

#### `src/components/Gamification/OrbFlowGame.tsx`
**FunciÃ³n**: Mini-juego de flujo de orbes
**CaracterÃ­sticas**:
- MecÃ¡nica de gestos tÃ¡ctiles
- Orbes de energÃ­a que fluyen en pantalla

---

### Componentes de Perfil

#### `src/components/Profile/AuraBackground.tsx`
**FunciÃ³n**: Fondo tipo aura para perfil
**Props**: colors, intensity
**CaracterÃ­sticas**:
- Gradientes orgÃ¡nicos
- AnimaciÃ³n de flujo
- Colores personalizables
- Efecto de profundidad

#### `src/components/Profile/ResilienceTree.tsx`
**FunciÃ³n**: Ãrbol visual de resiliencia
**Props**: growth, stages
**CaracterÃ­sticas**:
- VisualizaciÃ³n del crecimiento personal
- Ramas que crecen con el progreso
- Hojas que representan logros
- AnimaciÃ³n de crecimiento

---

### Componentes Bio (Cardio Scan)

#### `src/components/Bio/CalibrationRing.tsx`
**FunciÃ³n**: Anillo de progreso animado para calibraciÃ³n
**Props**: score (0-100), ready (boolean)
**CaracterÃ­sticas**:
- Anillo SVG animado con Reanimated
- Color dinÃ¡mico: ðŸ”´ rojo (<60), ðŸŸ¡ amarillo (60-79), ðŸŸ¢ verde (â‰¥80)
- Muestra porcentaje numÃ©rico
- Estado textual: "AJUSTA" / "CASI" / "âœ“ Ã“PTIMO"
- AnimaciÃ³n suave de 300ms

#### `src/components/Bio/CountdownOverlay.tsx`
**FunciÃ³n**: Overlay de cuenta regresiva (3-2-1)
**Props**: count (number), visible (boolean)
**CaracterÃ­sticas**:
- Overlay fullscreen con fondo oscuro
- NÃºmero grande con animaciÃ³n pulse
- Mensaje: "Â¡Perfecto! Iniciando..."
- SubtÃ­tulo: "MantÃ©n el dedo quieto"
- Feedback hÃ¡ptico en cada segundo

#### `src/components/Bio/QualityAlert.tsx`
**FunciÃ³n**: Alerta flotante durante mediciÃ³n
**Props**: visible (boolean), message (string)
**CaracterÃ­sticas**:
- Slide-down animation desde arriba
- DiseÃ±o tipo toast con icono âš ï¸
- Fondo amarillo con borde naranja
- Sombra y elevaciÃ³n
- Desaparece automÃ¡ticamente cuando calidad mejora

---

### Componentes del Santuario


#### `src/components/Sanctuary/PortalBackground.tsx`
**FunciÃ³n**: Fondo tipo portal
**Props**: depth, rotation
**CaracterÃ­sticas**:
- Efecto de tÃºnel/portal
- Perspectiva 3D
- AnimaciÃ³n de rotaciÃ³n
- Sentido de inmersiÃ³n

#### `src/components/Sanctuary/StarCore.tsx`
**FunciÃ³n**: NÃºcleo estelar
**Props**: brightness, pulses
**CaracterÃ­sticas**:
- Centro luminoso
- Pulsos de energÃ­a
- Rayos de luz
- Efecto de estrella

#### `src/components/Sanctuary/SunriseBackground.tsx`
**FunciÃ³n**: Fondo de amanecer
**Props**: progress, colors
**CaracterÃ­sticas**:
- Gradiente de amanecer
- Sol naciente
- Nubes y atmÃ³sfera
- TransiciÃ³n de colores

---

### Componentes Compartidos

#### `src/components/Player/GlobalMiniPlayer.tsx`
**FunciÃ³n**: Mini reproductor persistente sobre la TabBar
**CaracterÃ­sticas**:
- Flota en todas las pantallas principales
- Renderiza tanto Audiobooks como BackgroundSounds
- AnimaciÃ³n de FadeInDown y blur intenso
- Botones de control con feedback hÃ¡ptico
- Sincronizado dinÃ¡micamente con `AudioPlayerContext` y `AppContext`

#### `src/components/Shared/BacklitSilhouette.tsx`
**FunciÃ³n**: Silueta con retroiluminaciÃ³n
**Props**: source, intensity
**CaracterÃ­sticas**:
- Efecto de contraluz
- Silueta difuminada
- Luz ambiental
- AtmÃ³sfera misteriosa


#### `src/components/Shared/SoundwaveSeparator.tsx`
**FunciÃ³n**: Separador con forma de onda
**Props**: amplitude, frequency
**CaracterÃ­sticas**:
- LÃ­nea decorativa
- Forma de onda sonora
- AnimaciÃ³n opcional
- Estilo minimalista

---

### Componentes Individuales


#### `src/components/CategoryRow.tsx`
**FunciÃ³n**: Fila de categorÃ­as y motor de carrusel premium (Perfect Movement).
**Props**: sessions, cardVariant, accentColor
**CaracterÃ­sticas**:
- Snapping centrado (`ITEM_WIDTH = 0.75`).
- NavegaciÃ³n asistida (Flechas glassmorphic en `top: 216px`).
- InyecciÃ³n de persistencia global para manejar `onFavoritePress` y estado en tiempo real de Supabase.
- OptimizaciÃ³n con `FlashList` y `React.memo`.


#### `src/components/GuestBanner.tsx`
**FunciÃ³n**: Banner para usuarios invitados
**Props**: onUpgrade
**CaracterÃ­sticas**:
- Mensaje de modo invitado
- Llamada a la acciÃ³n de registro
- InformaciÃ³n de limitaciones
- BotÃ³n de registro


#### `src/components/SessionPreviewModal.tsx`
**FunciÃ³n**: Modal de previsualizaciÃ³n de sesiÃ³n
**Props**: session, visible, onStart
**CaracterÃ­sticas**:
- Vista previa antes de iniciar
- DescripciÃ³n detallada
- Comentarios
- Sesiones relacionadas
- BotÃ³n de inicio

#### `src/components/SleepTimerModal.tsx`
**FunciÃ³n**: Modal de temporizador para dormir
**Props**: visible, onSet, options
**CaracterÃ­sticas**:
- Opciones de tiempo predefinidas
- Slider personalizado
- Volumen gradual
- AcciÃ³n al finalizar (pausar/cerrar app)

#### `src/components/Shared/SoundwaveSeparator.tsx`
**FunciÃ³n**: Divisor oficial de secciones de borde a borde.
**Props**: fullWidth, accentColor, title
**CaracterÃ­sticas**:
- Reemplaza Ã­ntegramente al antiguo `SoundWaveHeader.tsx`.
- Soporta renderizado sin mÃ¡rgenes laterales para diseÃ±o premium.
- Texto centrado y tipografÃ­a `Caveat`.

#### `src/components/SoundWaveHeader.tsx` [OBSOLETO]
**Estado**: Eliminado / En proceso de limpieza. Sustituido por `SoundwaveSeparator.tsx`.
- Efecto visual sonoro
- Minimalista

#### `src/components/SpeedControlModal.tsx`
**FunciÃ³n**: Modal de control de velocidad
**Props**: currentSpeed, onChange, visible
**CaracterÃ­sticas**:
- Opciones de velocidad (0.5x - 2x)
- Slider continuo
- Preview del cambio
- Cancelar/Confirmar


---

## NavegaciÃ³n

**CaracterÃ­sticas**:
- CustomTabBar personalizado
- Iconos animados
- Badges de notificaciÃ³n
- Ocultar en ciertas pantallas

### `src/navigation/CustomTabBar.tsx`
**FunciÃ³n**: Tab bar personalizado
**CaracterÃ­sticas**:
- DiseÃ±o Ãºnico
- Animaciones de selecciÃ³n
- Efectos de presiÃ³n
- Colores segÃºn tema
- BotÃ³n central destacado (opcional)

---

## Servicios

### `src/services/AcademyService.ts`
**FunciÃ³n**: GestiÃ³n de la academia CBT
**MÃ©todos**:
- `getCourses()` - Obtener todos los cursos
- `getCourseById(id)` - Detalle de curso
- `enrollInCourse(courseId)` - Inscribirse
- `updateProgress(courseId, progress)` - Actualizar progreso
- `getQuizzes(courseId)` - Obtener cuestionarios
- `submitQuiz(quizId, answers)` - Enviar respuestas

### `src/services/analyticsService.ts`
**FunciÃ³n**: Analytics y mÃ©tricas de usuario
**MÃ©todos**:
- `getUserStats(userId)` - EstadÃ­sticas globales (totalMinutes, sessionsCount, streak, resilienceScore)
- `getTodayStats(userId)` - Minutos y sesiones del dÃ­a
- `getWeeklyActivity(userId)` - Actividad por dÃ­a de la semana
- `getCategoryDistribution(userId)` - DistribuciÃ³n de categorÃ­as consumidas
- `recordSession(userId, sessionId, duration, mood)` - Registrar sesiÃ³n completada

### `src/services/AudioEngineService.ts`
**FunciÃ³n**: Motor de audio multi-capa (Clase Singleton)
**Capas**: voice, soundscape, binaural, elements
**MÃ©todos principales**:
- `initialize()` - Configurar modo background
- `loadSession(config)` - Cargar sesiÃ³n con sus 4 capas de audio
- `playAll()` / `pauseAll()` - Control sincronizado de todas las capas
- `playSelectedLayers(layers)` - ReproducciÃ³n selectiva
- `setLayerVolume(layer, volume)` / `getVolumes()` - Control de volumen por capa
- `fadeOut(durationMs)` - Fade out suave (por defecto 3000ms)
- `swapSoundscape(id)` / `swapBinaural(id)` - Hot-swap de capas sin detener otras
- `preloadCues(messages)` / `playVoiceCue(type)` - Sistema de instrucciones de voz
- `startSilentAudio()` / `stopSilentAudio()` - "Silent Audio Trick" para mantener JS activo en background
- `unloadAll()` - LiberaciÃ³n de recursos
- `setStatusCallback(callback)` - Master Clock para UI
**Nota**: `loadProVoice()` estÃ¡ desactivado en producciÃ³n (ahorro 99% TTS).

### `src/services/AuthService.ts`
**FunciÃ³n**: AutenticaciÃ³n de usuarios
**MÃ©todos**:
- `signUp(email, password, name)` - Registro
- `signIn(email, password)` - Login
- `signInWithGoogle()` - Google OAuth
- `signOut()` - Cerrar sesiÃ³n
- `resetPassword(email)` - Recuperar contraseÃ±a
- `getCurrentUser()` - Usuario actual
- `onAuthStateChange(callback)` - Listener de auth

### `src/services/BioSignalProcessor.ts`
**FunciÃ³n**: Procesamiento de seÃ±ales biomÃ©tricas
**MÃ©todos**:
- `processFrame(frame)` - Procesar frame de cÃ¡mara
- `calculateBPM(frames)` - Calcular ritmo cardÃ­aco
- `analyzeHRV(data)` - Analizar variabilidad
- `getStressLevel(hrv)` - Nivel de estrÃ©s
- `startScan()` - Iniciar escaneo
- `stopScan()` - Detener escaneo

### `src/services/CacheService.ts`
**FunciÃ³n**: GestiÃ³n de cachÃ© dual (Zero-Egress Shield)
**Arquitectura**:
- **Persistente** (`documentDirectory/paziify_assets/`) â†’ Audio y Soundscapes (NUNCA se borran)
- **VolÃ¡til** (`cacheDirectory/paziify_cache/`) â†’ ImÃ¡genes (limpiables)
**MÃ©todos**:
- `get(url, type)` - Obtener recurso (descarga si no existe, devuelve path local)
- `clearVolatileCache()` - Borrar solo cachÃ© de imÃ¡genes
- `getCacheSize()` - TamaÃ±o total (persistente + volÃ¡til)
**CaracterÃ­sticas**:
- Hash MD5 de URLs para nombres de archivo
- Descarga atÃ³mica (temporal â†’ mover)
- Headers de autenticaciÃ³n Supabase automÃ¡ticos
- Fallback a URL remota si la descarga falla

### `src/services/CardioService.ts`
**FunciÃ³n**: GestiÃ³n de datos de cardio (Local & Zero-Egress)
**MÃ©todos**:
- `saveSession(metrics)` - Guardar nueva sesiÃ³n
- `getHistory()` - Recuperar historial local
- `getLatestBaselines()` - Obtener mÃ©tricas base recientes
- `clearHistory()` - Borrar datos locales
**CaracterÃ­sticas**:
- Persistencia en AsyncStorage
- SeparaciÃ³n de contextos (baseline vs post_session)

### `src/services/contentService.ts`
**FunciÃ³n**: GestiÃ³n de contenido dinÃ¡mico (5 sub-servicios exportados)

**`sessionsService`**:
- `getAll()` - Todas las sesiones de meditaciÃ³n
- `getById(id)` / `getByLegacyId(legacyId)` - BÃºsqueda por ID
- `getByCategory(category)` - Filtro por categorÃ­a
- `getDaily()` - SesiÃ³n diaria recomendada

**`soundscapesService`**:
- `getAll()` - Con fallback local para Zero Egress
- `getById(id)` - Con prioridad local

**`audiobooksService`**:
- `getAll()`, `getByCategory()`, `getFeatured()`, `getById()`, `search(query)`

**`storiesService`**:
- `getAll()`, `getByCategory()`, `getFeatured()`, `getById()`, `search(query)`
- `populateStories()` - Poblar desde datos de Mentes Maestras

**`favoritesService`** (Cloud + Offline):
- `add(userId, contentType, contentId)` / `remove()` â†’ Supabase
- `isFavorited(userId, contentType, contentId)` â†’ Check
- `getFavoriteAudiobooks(userId)` / `getFavoriteStories(userId)` â†’ Con cache AsyncStorage offline

**`contentService`**:
- `getRandomCategoryImage(mode)` - Imagen aleatoria segÃºn intenciÃ³n (healing/growth)

### `src/services/LocalAnalyticsService.ts`
**FunciÃ³n**: Analytics locales (sin conexiÃ³n)
**MÃ©todos**:
- `storeEvent(event)` - Almacenar evento
- `syncEvents()` - Sincronizar con servidor
- `getLocalStats()` - EstadÃ­sticas locales
- `clearOldEvents()` - Limpiar antiguos

### `src/services/playbackStorage.ts`
**FunciÃ³n**: Almacenamiento de progreso de reproducciÃ³n
**MÃ©todos**:
- `saveProgress(id, position)` - Guardar posiciÃ³n
- `getProgress(id)` - Obtener posiciÃ³n
- `clearProgress(id)` - Limpiar progreso
- `getAllProgress()` - Todo el progreso

### `src/services/supabaseClient.ts`
**FunciÃ³n**: Cliente de Supabase
**CaracterÃ­sticas**:
- ConfiguraciÃ³n de conexiÃ³n
- Headers personalizados
- Manejo de errores
- Reintentos automÃ¡ticos

---

## Contextos

### `src/context/AppContext.tsx`
**FunciÃ³n**: Contexto principal de la aplicaciÃ³n
**Estado (`UserState`)**:
- `id`, `name`, `email`, `avatarUrl` - Identidad
- `isRegistered`, `isGuest` - Estado de autenticaciÃ³n
- `streak`, `resilienceScore`, `totalMinutes` - MÃ©tricas
- `isDailySessionDone`, `hasMissedDay` - Ritual diario
- `lifeMode: 'growth' \| 'healing'` - SintonizaciÃ³n persistida
- `activeChallenge: ActiveChallenge \| null` - Programa activo
- `hasAcceptedMonthlyChallenge` - Flag de reto mensual
- `favoriteSessionIds`, `completedSessionIds`, `completedLessons` - Progreso
- `dailyGoalMinutes`, `weeklyGoalMinutes` - Objetivos
- `lastEntryDate`, `lastSessionDate` - Tracking temporal
- `settings` - Notificaciones (morning, night, streak, quiet hours)

**MÃ©todos**:
- `updateUserState(updates)` - Actualizar estado parcial
- `toggleFavorite(sessionId)` - AÃ±adir/Quitar favorito
- `signInWithGoogle()` - Google OAuth
- `continueAsGuest()` / `exitGuestMode()` - Modo invitado
- `markEntryAsDone()` - Marcar entrada diaria
- `signOut()` - Cerrar sesiÃ³n

**Integraciones**:
- Supabase Auth + perfil automÃ¡tico
- AsyncStorage para persistencia local
- Reminders programados (`scheduleDailyMeditationReminder`)
- Primera entrada del dÃ­a (`isFirstEntryOfDay`)

### `src/context/AudioPlayerContext.tsx`
**FunciÃ³n**: Contexto del reproductor de audio
**Estado**:
- `currentTrack` - Pista actual
- `isPlaying` - Estado de reproducciÃ³n
- `position` - PosiciÃ³n actual
- `duration` - DuraciÃ³n total
- `rate` - Velocidad de reproducciÃ³n
- `volume` - Volumen
- `queue` - Cola de reproducciÃ³n
- `history` - Historial

**MÃ©todos**:
- `play(track)` - Reproducir pista
- `pause()` - Pausar
- `resume()` - Reanudar
- `stop()` - Detener
- `next()` - Siguiente
- `previous()` - Anterior
- `seek(position)` - Buscar
- `setRate(rate)` - Velocidad
- `addToQueue(track)` - AÃ±adir a cola
- `clearQueue()` - Limpiar cola

**Integraciones**:
- AudioEngineService
- playbackStorage (persistencia)
- Notificaciones de reproducciÃ³n

---

## Panel de AdministraciÃ³n

### Estructura del Admin
```
admin/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Breadcrumb.tsx
â”‚   â”‚   â”œâ”€â”€ Layout.tsx
â”‚   â”‚   â”œâ”€â”€ MediaUploader.tsx
â”‚   â”‚   â””â”€â”€ SideMenu.tsx
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ academy/
â”‚   â”‚   â”‚   â”œâ”€â”€ create.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ edit.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ list.tsx
â”‚   â”‚   â”‚   â””â”€â”€ show.tsx
â”‚   â”‚   â”œâ”€â”€ audiobooks/
â”‚   â”‚   â”œâ”€â”€ meditation-sessions/
â”‚   â”‚   â”œâ”€â”€ real-stories/
â”‚   â”‚   â””â”€â”€ soundscapes/
â”‚   â””â”€â”€ providers/
â”‚       â”œâ”€â”€ auth.ts
â”‚       â”œâ”€â”€ constants.ts
â”‚       â”œâ”€â”€ data.ts
â”‚       â””â”€â”€ supabase-client.ts
â”œâ”€â”€ package.json
â””â”€â”€ vite.config.ts
```

### TecnologÃ­as del Admin
- **Framework**: React 19.1.0
- **Admin Framework**: Refine (gestiÃ³n de datos)
- **UI Library**: Ant Design v5
- **Backend**: Supabase como data provider
- **Build Tool**: Vite

### Funcionalidades del Admin
- **GestiÃ³n de cursos CBT**: Crear, editar, eliminar cursos
- **GestiÃ³n de meditaciones**: Subir audio, gestionar metadatos
- **GestiÃ³n de audiolibros**: Upload de contenido, capÃ­tulos
- **GestiÃ³n de historias**: Contenido narrativo
- **GestiÃ³n de soundscapes**: Sonidos ambientales
- **Usuarios**: VisualizaciÃ³n (no ediciÃ³n directa por seguridad)
- **Analytics**: Dashboard de mÃ©tricas

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
- PolÃ­ticas RLS (Row Level Security)

#### `supabase/migrations/20260209_soundscapes.sql`
**Contenido**:
- Tabla `soundscapes` (id, title, description, audio_url, cover_url, category, duration, tags)
- Tabla `mixes` (user_id, soundscape_ids, volumes, created_at)
- Ãndices para bÃºsqueda

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
**FunciÃ³n**: ObtenciÃ³n de contenido con React Query
**Hooks exportados**:
- `useSessions()` - Sesiones de meditaciÃ³n
- IntegraciÃ³n con `sessionsService` de `contentService.ts`

> **Nota**: La lÃ³gica de auth, audio player, progreso, rachas y notificaciones estÃ¡ integrada directamente en `AppContext`, `AudioPlayerContext` y los servicios, no en hooks separados.

---

## Utilidades

### `src/utils/notifications.ts`
**FunciÃ³n**: ConfiguraciÃ³n de notificaciones push
**Exporta**:
- `requestPermissions()` - Solicitar permisos
- `scheduleLocalNotification()` - Programar local
- `scheduleDailyMeditationReminder()` - Recordatorio diario
- `cancelNotification()` - Cancelar
- `setNotificationHandler()` - Manejador

### `src/utils/notifications.web.ts`
**FunciÃ³n**: Stub de notificaciones para plataforma web
**Exporta**: Mismas funciones que `notifications.ts` pero como no-ops

### `src/utils/storage.ts`
**FunciÃ³n**: Wrappers para AsyncStorage
**Exporta**:
- `setItem(key, value)` - Guardar
- `getItem(key)` - Obtener
- `removeItem(key)` - Eliminar
- `clear()` - Limpiar todo
- `multiGet(keys)` - MÃºltiples

### `src/utils/rgbExtraction.ts`
**FunciÃ³n**: ExtracciÃ³n de datos RGB de frames de cÃ¡mara para Cardio Scan (rPPG)
**Exporta**:
- `extractRGBFromFrame(pixels, pixelFormat)` - ExtracciÃ³n real con soporte YUV y RGB (worklet)
- `extractRGBFallback(width, height)` - Fallback cuando `toArrayBuffer()` no estÃ¡ disponible

---

## Tipos TypeScript

### `src/types/index.ts`
**Contenido**:
- `User` - Interfaz de usuario
- `Meditation` - Interfaz de meditaciÃ³n
- `Audiobook` - Interfaz de audiolibro
- `Story` - Interfaz de historia
- `Course` - Interfaz de curso CBT
- `Session` - Interfaz de sesiÃ³n
- `Category` - Interfaz de categorÃ­a
- `Progress` - Interfaz de progreso
- Enums y tipos auxiliares

---

## Constantes

### `src/constants/theme.ts`
**Contenido**:
- Colores principales
- Colores de estado (success, error, warning)
- TipografÃ­a (fuentes, tamaÃ±os)
- Espaciado
- Border radius
- Sombras

### `src/constants/categories.ts`
**Contenido**:
- CategorÃ­as de meditaciÃ³n predefinidas
- Colores asociados
- Iconos
- Descripciones

### `src/constants/challenges.ts`
**Contenido**: Fuente Ãºnica de verdad del Sistema de EvoluciÃ³n
- `ChallengeInfo` interface (id, title, type, days, description, benefits, sessionSlug, colors, icon)
- `CHALLENGES` Record con 5 programas:
  - `paziify-master` (DesafÃ­o, 30d, Indigo)
  - `senda-calma` (Reto, 7d, Teal)
  - `senda-foco` (Reto, 7d, Amber)
  - `sprint-sos` (MisiÃ³n, 3d, Rojo)
  - `pausa-express` (MisiÃ³n, 3d, Violeta)

### `src/constants/oasisExperiments.ts`
**Contenido**: Infraestructura de Feature Flags (Gate)
- Rutas PDS controladas por variable de entorno o Role
- Activa o desactiva las vistas experimentales
- Determina quÃ© usuarios ven la experiencia premium (role === 'admin')

### `src/constants/images.ts`
**Contenido**:
- Importaciones de imÃ¡genes
- Placeholders
- Icons
- URLs de assets remotos

### `src/constants/visualThemes.ts`
**Contenido**:
- Temas visuales para sesiones de meditaciÃ³n
- Gradientes e intensidades por modo

---

## Datos EstÃ¡ticos (`src/data/`)

| Archivo | TamaÃ±o | PropÃ³sito |
|---------|--------|----------|
| `sessionsData.ts` | 153 KB | 119 sesiones de meditaciÃ³n con URLs, configs y metadatos |
| `academyData.ts` | 49 KB | 10 cursos CBT con mÃ³dulos y lecciones |
| `realStories.ts` | 51 KB | Historias de Mentes Maestras |
| `quizData.ts` | 12 KB | Preguntas de evaluaciÃ³n para cursos |
| `soundscapesData.ts` | 12 KB | Paisajes sonoros y ondas binaurales |
| `audiobooksData.ts` | 3 KB | CatÃ¡logo de audiolibros |
| `socialData.ts` | 1 KB | Datos de comunidad |
| `newSessionsGenerated.json` | 113 KB | JSON de generaciÃ³n masiva (migraciÃ³n) |
| `real_stories_data.sql` | 40 KB | Script SQL de semillas para historias |

### `app.json`
**ConfiguraciÃ³n**:
- Nombre y slug de la app
- VersiÃ³n y versiÃ³n de build
- OrientaciÃ³n (portrait)
- Icono y splash screen
- Plugins de Expo (Firebase, Notificaciones, etc.)
- Esquema de URL
- iOS y Android config
- Actualizaciones OTA

### `eas.json`
**ConfiguraciÃ³n de builds**:
- Perfiles de build (development, preview, production)
- Credentials
- AutomatizaciÃ³n
- Env vars

---

## Scripts Ãštiles

### `/Utils/backup-db.bat`
**FunciÃ³n**: Script de backup de base de datos

### `/Utils/setup-env.ps1`
**FunciÃ³n**: Script de configuraciÃ³n inicial

### `/scripts/seed-data.sql`
**FunciÃ³n**: Script SQL de datos de prueba

---

## Resumen de Flujos Principales

### Flujo de Onboarding
1. WelcomeScreen â†’ PresentaciÃ³n
2. Login/RegisterScreen â†’ AutenticaciÃ³n
3. NotificationSettings â†’ Permisos
4. CompassScreen â†’ Inicio de experiencia

### Flujo de MeditaciÃ³n
1. Home/Library â†’ SelecciÃ³n
2. SessionDetailScreen â†’ PreparaciÃ³n
3. BreathingTimer â†’ Inicio guiado
4. SessionEndScreen â†’ FinalizaciÃ³n
5. ActualizaciÃ³n de stats y streak

### Flujo de Academia CBT
1. CBTAcademyScreen â†’ Listado de cursos
2. AcademyCourseDetailScreen â†’ Detalle
3. QuizScreen â†’ EvaluaciÃ³n
4. Progreso guardado en Supabase

### Flujo de Audio
1. SelecciÃ³n de contenido
2. MiniPlayer aparece automÃ¡ticamente
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

### Buenas PrÃ¡cticas
- SeparaciÃ³n de responsabilidades (screens vs components)
- Custom hooks para lÃ³gica reutilizable
- Services para operaciones de API
- Context para estado global
- Persistencia local para UX offline

### Optimizaciones
- React.memo para componentes pesados
- useMemo/useCallback donde sea necesario
- Lazy loading de pantallas
- ImÃ¡genes optimizadas
- CachÃ© de requests con React Query

---

*Documento actualizado el 26 de Febrero de 2026*  
*VersiÃ³n del proyecto: 2.34.0 (PDS v3.0)*  
*Total de pantallas: 32*  
*Total de componentes: 50+*  
*Total de servicios: 12*

### 9. Panel de AdministraciÃn (CMS)

El CMS de Paziify estÃ¡ construido sobre **Refine + Ant Design**. Su misiÃn es permitir al equipo de contenido gestionar el catÃ¡logo sin conocimientos tÃcnicos.

#### Arquitectura " Shadow Sync\ (v2.44.0)
Debido a la migraciÃn de contenidos a campos JSONB (para mayor flexibilidad), el Panel utiliza un sistema de **SincronizaciÃn en la Sombra**:
1. **Carga**: Al editar, un useEffect extrae los valores anidados de metadata y udio_config y los coloca en campos planos del formulario.
2. **EdiciÃn**: El usuario interactua con campos de texto y selectores normales.
3. **TransformaciÃn**: El mÃtodo handleOnFinish (en el useForm de Refine) reconstruye los objetos JSON antes de la peticiÃn PATCH a Supabase.

#### Restricciones de Seguridad (RLS)
El Panel exige que el usuario tenga el rol dmin definido en la tabla public.profiles. Los cambios realizados por usuarios sin este rol serÃ¡n rechazados silenciosamente por las polÃticas de Supabase, devolviendo un 200 OK sin persistencia real.

---
*Ãšltima revisiÃn: 6 de Marzo de 2026 - VersiÃn 2.44.0*
\n### Reglas de Escalabilidad de CompilaciÃ³n (v2.46.0+)\n- **PROHIBIDO EL USO DE 
eact-native-worklets-core**: Bajo la Nueva Arquitectura y Reanimated v4+, usar siempre la nomenclatura 
eact-native-worklets.\n- **DESPLIEGUES DE PRODUCCIÃ“N (EAS CLOUD)**: Compilaciones destinadas a la Play Store DEBEN obligatoriamente ejecutarse bajo el servicio de Expo (eas build --profile production) para evadir el embudo corrupto de cachÃ©s C++ locales y problemas intrÃ­nsecos de de la mÃ¡quina host local.
