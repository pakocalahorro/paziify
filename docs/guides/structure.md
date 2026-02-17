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

**Versión**: 2.11.0

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
│   └── sessions/               # Registro de sesiones
├── scripts/                    # Scripts SQL y utilidades
├── src/                        # Código fuente principal
│   ├── assets/                 # Assets optimizados
│   ├── components/             # Componentes reutilizables
│   ├── constants/              # Constantes (temas, categorías)
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

### 3. Bio - Bio-feedback Cardíaco

#### `src/screens/Bio/CardioResultScreen.tsx`
**Función**: Pantalla de resultados del escaneo cardíaco
**Contenido**:
- Ritmo cardíaco detectado
- Gráfico de variabilidad (HRV)
- Análisis de estrés
- Recomendaciones basadas en resultados
- Historial de mediciones
- Exportar datos

#### `src/screens/Bio/CardioScanScreen.tsx`
**Función**: Escaneo cardíaco usando la cámara
**Contenido**:
- Vista previa de la cámara
- Guía de colocación del dedo
- Indicador de progreso del escaneo
- Señal en tiempo real
- Calidad de la señal
- Cancelar/Detener escaneo

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
**Función**: Dashboard principal de la app
**Contenido**:
- Saludo personalizado
- ZenMeter (nivel de bienestar)
- BentoGrid con accesos rápidos
- Recomendaciones diarias
- Sesiones recientes
- Progreso de rachas (streaks)
- Mini reproductor si hay audio activo
- Notificaciones

---

### 6. Meditation - Meditación

#### `src/screens/Meditation/BreathingTimer.tsx`
**Función**: Temporizador de respiración guiada
**Contenido**:
- Animación del orbe de respiración
- Patrones de respiración (4-7-8, caja, etc.)
- Temporizador configurable
- Sonidos guía
- Guía visual e instrucciones

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
- Comentarios de usuarios
- Iniciar sesión
- Añadir a favoritos

#### `src/screens/Meditation/SessionEndScreen.tsx`
**Función**: Pantalla de finalización de sesión
**Contenido**:
- Mensaje de felicitación
- Estadísticas de la sesión (tiempo, calidad)
- Puntuación de experiencia
- Compartir logro
- Recomendación de siguiente sesión
- Actualización de racha

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
**Función**: Configuración de notificaciones
**Contenido**:
- Permiso de notificaciones push
- Configurar recordatorios diarios
- Horario de meditación
- Recordatorios de racha
- Notificaciones de contenido nuevo

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
**Función**: Perfil del usuario
**Contenido**:
- Avatar y nombre de usuario
- Estadísticas personales (sesiones, tiempo, racha)
- Configuración de cuenta
- Preferencias
- Suscripción actual
- Centro de ayuda
- Cerrar sesión
- Eliminar cuenta

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

### 11. Social - Comunidad

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

### Componentes de Home

#### `src/components/Home/BentoCard.tsx`
**Función**: Tarjeta individual del grid Bento
**Props**: title, icon, color, onPress, badge
**Características**:
- Diseño minimalista
- Icono centrado
- Título descriptivo
- Indicador de notificaciones (badge)
- Animación al presionar

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

#### `src/components/Home/WeeklyChart.tsx`
**Función**: Gráfico de actividad semanal
**Props**: data (array de días/valores)
**Características**:
- Gráfico de barras
- Días de la semana
- Animación de entrada
- Tooltip al presionar
- Color según objetivo cumplido

#### `src/components/Home/ZenMeter.tsx`
**Función**: Indicador de nivel de bienestar
**Props**: level (0-100), label
**Características**:
- Visualización circular o gauge
- Gradiente de colores (rojo → verde)
- Número central
- Etiqueta descriptiva
- Animación suave

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

#### `src/components/Sanctuary/AtmosphereShader.tsx`
**Función**: Shader atmosférico con Skia
**Props**: time, mood
**Características**:
- Efectos atmosféricos dinámicos
- Cambio según estado de ánimo
- Animación continua
- Alto rendimiento

#### `src/components/Sanctuary/LiquidOrb.tsx`
**Función**: Orbe líquido animado
**Props**: color, size, intensity
**Características**:
- Simulación de fluidos
- Deformación orgánica
- Reflejos y sombras
- Interacción táctil

#### `src/components/Sanctuary/MagicalNexus.tsx`
**Función**: Centro mágico de energía
**Props**: energy, connections
**Características**:
- Nodo central con energía pulsante
- Conexiones a otros elementos
- Partículas flotantes
- Efectos de luz

#### `src/components/Sanctuary/NebulaBackground.tsx`
**Función**: Fondo de nebulosa
**Props**: colors, speed
**Características**:
- Efecto de nebulosa espacial
- Colores vibrantes
- Movimiento lento y orgánico
- Profundidad de campo

#### `src/components/Sanctuary/NoiseBackground.tsx`
**Función**: Fondo con ruido/perlin noise
**Props**: opacity, scale
**Características**:
- Textura de ruido
- Movimiento sutil
- Añade textura visual
- Optimizado con shaders

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

#### `src/components/Shared/BacklitSilhouette.tsx`
**Función**: Silueta con retroiluminación
**Props**: source, intensity
**Características**:
- Efecto de contraluz
- Silueta difuminada
- Luz ambiental
- Atmósfera misteriosa

#### `src/components/Shared/MiniPlayer.tsx`
**Función**: Mini reproductor persistente
**Props**: track, onExpand, controls
**Características**:
- Siempre visible durante reproducción
- Controles básicos (play/pause)
- Información de la pista
- Expandir a pantalla completa
- Colapsar al finalizar

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

#### `src/components/AudiobookCard.tsx`
**Función**: Tarjeta de audiolibro
**Props**: book, onPress, progress
**Características**:
- Portada del libro
- Título y autor
- Progreso de lectura
- Rating
- Duración total

#### `src/components/BreathingOrb.tsx`
**Función**: Orbe de respiración básico
**Props**: pattern, isPlaying
**Características**:
- Expansión y contracción
- Guía visual de respiración
- Colores calmantes
- Simple y efectivo

#### `src/components/CategoryRow.tsx`
**Función**: Fila de categorías
**Props**: categories, onSelect
**Características**:
- Scroll horizontal
- Chips de categoría
- Selección múltiple
- Indicador de activo

#### `src/components/CourseCard.tsx`
**Función**: Tarjeta de curso
**Props**: course, progress, onPress
**Características**:
- Imagen del curso
- Título y descripción
- Barra de progreso
- Instructor
- Duración estimada

#### `src/components/GGAssistant.tsx`
**Función**: Asistente virtual "Guía Galáctica"
**Props**: message, actions
**Características**:
- Avatar animado
- Burbujas de mensaje
- Sugerencias de acción
- Personalidad amigable
- Contexto conversacional

#### `src/components/GuestBanner.tsx`
**Función**: Banner para usuarios invitados
**Props**: onUpgrade
**Características**:
- Mensaje de modo invitado
- Llamada a la acción de registro
- Información de limitaciones
- Botón de registro

#### `src/components/SessionCard.tsx`
**Función**: Tarjeta de sesión de meditación
**Props**: session, duration, category
**Características**:
- Imagen representativa
- Título y categoría
- Duración
- Dificultad
- Instructor
- Botón de reproducción

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
**Caracteridades**:
- Opciones de tiempo predefinidas
- Slider personalizado
- Volumen gradual
- Acción al finalizar (pausar/cerrar app)

#### `src/components/SoundWaveHeader.tsx`
**Función**: Header con animación de ondas
**Props**: title, subtitle
**Características**:
- Título con ondas animadas
- Subtítulo opcional
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

#### `src/components/StoryCard.tsx`
**Función**: Tarjeta de historia
**Props**: story, onPress
**Características**:
- Ilustración
- Título y extracto
- Tiempo de lectura
- Categoría
- Valoración

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
**Función**: Analytics y métricas
**Métodos**:
- `trackEvent(event, params)` - Trackear eventos
- `trackScreen(screen)` - Trackear navegación
- `setUserProperties(props)` - Propiedades de usuario
- `logSession(duration)` - Registrar sesión

### `src/services/AudioEngineService.ts`
**Función**: Motor de audio principal
**Métodos**:
- `loadAudio(source)` - Cargar audio
- `play()` - Reproducir
- `pause()` - Pausar
- `seek(position)` - Buscar posición
- `setRate(rate)` - Cambiar velocidad
- `setVolume(volume)` - Ajustar volumen
- `mixAudio(sources)` - Mezclar múltiples fuentes

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
**Función**: Gestión de caché
**Métodos**:
- `set(key, value, ttl)` - Guardar en caché
- `get(key)` - Obtener de caché
- `remove(key)` - Eliminar
- `clear()` - Limpiar todo
- `isExpired(key)` - Verificar expiración

### `src/services/contentService.ts`
**Función**: Gestión de contenido dinámico
**Métodos**:
- `getMeditations()` - Obtener meditaciones
- `getAudiobooks()` - Obtener audiolibros
- `getStories()` - Obtener historias
- `getCategories()` - Obtener categorías
- `searchContent(query)` - Buscar
- `getRecommendations()` - Recomendaciones

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
**Estado**:
- `user` - Usuario actual (guest/registrado)
- `isAuthenticated` - Estado de autenticación
- `isGuest` - Modo invitado
- `settings` - Configuraciones de usuario
- `favorites` - Contenidos favoritos
- `stats` - Estadísticas del usuario
- `streak` - Racha actual
- `notifications` - Configuración de notificaciones

**Métodos**:
- `setUser(user)` - Establecer usuario
- `updateSettings(settings)` - Actualizar configuraciones
- `toggleFavorite(id)` - Añadir/Quitar favorito
- `updateStats(stats)` - Actualizar estadísticas
- `resetStreak()` - Reiniciar racha
- `syncWithSupabase()` - Sincronizar con backend

**Integraciones**:
- Supabase Auth
- AsyncStorage para persistencia
- Event listeners de autenticación

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

### `src/hooks/useAuth.ts`
**Función**: Manejo de autenticación
**Retorna**: user, isAuthenticated, login, logout, register

### `src/hooks/useAudioPlayer.ts`
**Función**: Control del reproductor
**Retorna**: currentTrack, isPlaying, play, pause, seek, etc.

### `src/hooks/useContent.ts`
**Función**: Obtención de contenido
**Retorna**: meditations, audiobooks, stories, loading, error

### `src/hooks/useProgress.ts`
**Función**: Seguimiento de progreso
**Retorna**: progress, updateProgress, completedSessions

### `src/hooks/useStreak.ts`
**Función**: Gestión de rachas
**Retorna**: currentStreak, bestStreak, checkIn, resetStreak

### `src/hooks/useNotifications.ts`
**Función**: Gestión de notificaciones
**Retorna**: scheduleNotification, cancelNotification, getScheduled

---

## Utilidades

### `src/utils/notifications.ts`
**Función**: Configuración de notificaciones push
**Exporta**:
- `requestPermissions()` - Solicitar permisos
- `scheduleLocalNotification()` - Programar local
- `cancelNotification()` - Cancelar
- `setNotificationHandler()` - Manejador

### `src/utils/storage.ts`
**Función**: Wrappers para AsyncStorage
**Exporta**:
- `setItem(key, value)` - Guardar
- `getItem(key)` - Obtener
- `removeItem(key)` - Eliminar
- `clear()` - Limpiar todo
- `multiGet(keys)` - Múltiples

### `src/utils/formatters.ts`
**Función**: Formateo de datos
**Exporta**:
- `formatDuration(seconds)` - Formatear tiempo
- `formatDate(date)` - Formatear fecha
- `formatNumber(num)` - Formatear números

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

### `src/constants/images.ts`
**Contenido**:
- Importaciones de imágenes
- Placeholders
- Icons
- URLs de assets remotos

---

## Configuración de Expo

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

*Documento generado el 16 de febrero de 2026*
*Versión del proyecto: 2.10.0*
*Total de pantallas: 30+*
*Total de componentes: 40+*
*Total de servicios: 10+*