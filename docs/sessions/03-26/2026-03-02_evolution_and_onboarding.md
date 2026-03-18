# Sesión: Rediseño Evolución PDS 3.0 & Sincronización Onboarding
**Fecha:** 2026-03-02
**Versión:** v2.38.0

## Resumen Ejecutivo
Esta sesión se centró en aplicar los estándares de lujo "Oasis Edition" (PDS 3.0) a dos áreas críticas que habían quedado rezagadas: la pantalla de Evolución (donde residen los desafíos) y el flujo de Onboarding inicial.

## Hitos Críticos

### 1. Cabecera Maestra Reactiva (OasisHeader)
- **Problema:** El botón superior derecho siempre decía "✨ EVOLUCIÓN", sin importar si el usuario estaba inmerso en un desafío o no. No había *feedback* visual activo.
- **Solución Técnica:** Se modificó `OasisHeader.tsx` para suscribirse a `activeChallengeType` desde el `AppContext`.
  - Cuando hay un reto activo, el texto cambia a "✔ ACTIVO".
  - Se implementó una animación Premium de "Glassmorphism Activo": el fondo interior del botón pasó de sólido a transparente (`BlurView tint="dark"`), permitiendo que un anillo de luz dinámico ("Snake LED") del color temático del reto (Teal, Purple o Amber) resplandezca por detrás del cristal, creando un efecto de luz "sangrando" elegante sin ser intrusivo.

### 2. Estabilización de la Pantalla Evolución
- **Problema 1 (Navegación Rota):** Al volver de Evolución a Home mediante las migas de pan, la app crasheaba `(NAVIGATE was not handled)`.
  - **Solución:** Se movió la ruta `EVOLUTION_CATALOG` del root `AppNavigator` al `TabNavigator` anidado, y se corrigió el ruteo interno `(navigation.navigate('MainTabs', { screen: Screen.HOME }))`.
- **Problema 2 (Aislamiento):** La pantalla no mostraba la barra inferior de navegación.
  - **Solución:** Al anidarla en `TabNavigator`, forzamos la renderización del menú. Se parcheó `CustomTabBar.tsx` filtrando manualmente `Screen.EVOLUTION_CATALOG` para que no dubujara un icono fantasma innecesario en el dock, mientras mantenía la visibilidad.

### 3. Onboarding "Edge-to-Edge"
- **Problema:** Tras la pantalla majestuosa Welcome (de vídeo), la pantalla `LoginScreen` transicionaba a un fondo negro genérico "cortando" la inmersión de lujo, agrabado por la banda negra "SafeTop" oscura reservada para la barra de estado en pantallas de lectura.
- **Solución Inmersiva:**
  - Se replicó el motor de vídeo/gradiente inmersivo desde `WelcomeScreen` a `LoginScreen` asegurando que el fondo "no parpadea ni desaparece" al cambiar de ruta, sino que sigue fluyendo detrás del formulario.
  - Se modificó el núcleo de `OasisScreen.tsx` (`showSafeOverlay={false}`) para extirpar la banda negra protectora en las 3 pantallas de entrada: Welcome, Login y SpiritualPreloader, logrando cobertura total del dispositivo "Edge-to-Edge".
- **Refinamiento UX (Copys Psicólogicos):** Se diferenciaron los botones a "Empezar mi viaje" (Google - Alta) y "Visitar Santuario" + el apéndice de texto fijo "(CUENTA DE INVITADO)". Para el portal de retorno se usó "Continuar con Google".
- **Spiritual Preloader V3:** Se modernizó la transición de carga (`SpiritualPreloader.tsx`). Se extirpó el antiguo fondo por un `OasisScreen` negro profundo puro, e inyectando las tipografías corporativas de lujo (`Outfit` ultraligera y `Caveat` para comillas).

## Próximos Pasos (Siguiente Sesión)
- Maquetar el interior de la Pantalla Evolución reemplazando el largo ScrollView por el concepto Flex All-in-One: 1/2 pantalla Hero Desafío Central, 1/4 Scroll Retos y 1/4 Grid Mision rápida.
