# 📖 Guía de Funcionalidad - Manual de Usuario (v2.8.0) 💎

Bienvenido a la guía oficial de **Paziify v2.8.0**. Esta versión introduce la tecnología **Zero-Egress Caching**, la infraestructura para **Cardio Scan**, y una optimización visual total mediante **expo-image**.

---

## 1. Zero-Egress Caching (Navegación sin Gastar Datos) 🛡️
Paziify v2.8 introduce un motor de caché inteligente que protege tu plan de datos:
- **Carga Instantánea**: Una vez que escuchas una sesión o ves una carátula, la app la guarda en tu móvil para siempre.
- **Modo Offline Automático**: Si pierdes la conexión, todo el contenido que ya hayas visitado seguirá disponible sin esperas.
- **Optimización de Almacenamiento**: La app gestiona automáticamente el espacio, eliminando archivos innecesarios cuando el móvil lo requiere.

---

## 2. Preparación para Cardio Scan y Bio-Feedback 🚀
Hemos instalado la infraestructura necesaria para el futuro del bienestar interactivo:
- **VisionCamera Integration**: Paziify ya es capaz de detectar cambios sutiles mediante la cámara del móvil (próximamente: Escaneo de Cardio).
- **Privacidad**: Recuerda que la cámara solo se activa bajo tu consentimiento explícito para funciones de diagnóstico.

---

## 3. Onboarding Zen y Flujo Espiritual ... [Omitido por brevedad para el walkthrough, ver versiones anteriores] ...

---

*Última revisión: 13 de Febrero de 2026 - Versión 2.8.0 (Zero-Egress Update)*
**Pantalla:** `WelcomeScreen` -> `SpiritualPreloader` -> `CompassScreen` -> `HomeScreen`

Paziify v2.6 ha simplificado el viaje del usuario para maximizar la introspección:
- **Paso 1: Spiritual Preloader (Cerebro de Navegación)**: La app te recibe con una pausa de 3.5 segundos. Este preloader decide inteligentemente tu destino:
    - **Primera entrada del día**: Te lleva a la **Brújula (Nexus)** para establecer tu intención.
    - **Entradas sucesivas**: Te dirige directamente a la **Home**, respetando tu tiempo.
- **Paso 2: Brújula Adaptativa (Nexus)**: Selección directa de intención (Sanar/Crecer) con feedback háptico y visual.
- **Sincronización 100% Cloud**: Todo tu progreso se guarda en Supabase. Si cambias de dispositivo, tu Oasis te sigue intacto.
- **Modo Offline**: Tu contenido visitado se guarda localmente para acceso sin red.

---

## 2. El Santuario Mágico (Adaptive Nexus) ✨
**Pantalla:** `CompassScreen`
Hemos transformado la Brújula Interior en una experiencia interactiva mágica de alta velocidad:
- **Orbes Orgánicos Hiperrealistas**:
    - **Sanar (Emerald Heart)**: Un orbe cristalino que late al ritmo de tu respiración.
    - **Crecer (Solar Plasma)**: Energía solar dorada para vitalidad.
- **Feedback Sensorial**: Al elegir un modo, el orbe genera una **explosión de luz y vibración háptica** que confirma tu intención espiritual.
- **Acceso Directo**: Tras la elección, la app te lleva directamente a tu Home personalizada mediante una transición suave.

---

## 3. Identidad Corporativa Unificada (Biblioteca y Academia) 📚⚖️
**Pantalla:** `LibraryScreen` / `CBTAcademyScreen` / `AudiobooksScreen`
Paziify v2.7 introduce un lenguaje visual unificado para todos sus catálogos, eliminando la fricción de navegación:
- **Diseño Maestro de Catálogo**: Todas las bibliotecas (Meditación, Academia, Audiolibros) utilizan ahora el sistema **Soundwave Carousel**.
- **SoundWaveHeader**: Una cabecera rítmica que "respira" mientras exploras tu santuario.
- **Tarjetas Optimizadas**: Carátulas con ratio **1.35** que permiten una mayor visibilidad del contenido en pantallas verticales.
- **Tipografía Skia**: Títulos artísticos dinámicos que cambian según el "vibe" de la categoría (Hollow, Glow, Duotone).

---

## 4. El Menú de Navegación Flotante 🛸💎
**Componente:** `CustomTabBar`
Hemos rediseñado el Menú Principal para ser una **Isla de Cristal** ergonómica:
- **Efecto Orbital (Santuario)**: El botón central late orgánicamente y muestra el núcleo de tu energía actual (Sanar/Crecer).
- **Navegación Ergonómica**: El menú flota sobre el contenido y se ajusta automáticamente a las áreas seguras de tu dispositivo (Safe Areas).
- **Glassmorphism 3.0**: Blur de alta intensidad para una legibilidad perfecta sobre cualquier fondo nebula.

---

## 5. El Reproductor Premium y Mini Player 💎
- **Bento Grid Vision**: La Home se organiza ahora en una cuadrícula de cristal estética que utiliza **imágenes reales** como fondo de las tarjetas (Academia, Historias, Música).
- **ZenMeters Dinámicos**: Indicadores circulares de progreso que se ajustan en tiempo real según las metas (minutos/día) definidas en tu perfil.
- **Sugerencias Inteligentes**: El contenido se adapta a tu modo (Sanar/Crecer) y a la hora del día (Día/Noche).
- **Capa Editorial (`SessionDetailScreen`)**: Al seleccionar contenido del Bento o la Dosis Diaria, accederás a una vista previa con el nombre del guía, duración y descripción mística antes de comenzar.
- **Botón Reto Paziify**: Acceso directo en la cabecera (texto blanco sobre oro). Es un elemento **dinámico**: cambia a "Reto Activado" una vez has aceptado el desafío de 30 días.

---

## 6. El Reto Mensual: 30 Días de Luz 🌟
**Pantalla:** `HomeScreen` -> `PurposeModal` -> `ProfileScreen`
- **El Reto Paziify**: Un compromiso de 30 días para forjar una mente resiliente.
- **Árbol de Resiliencia Orgánico**: En tu perfil, un árbol vivo crece contigo. Cada día de racha enciende una de las **30 luces de neón**. El árbol nace con un 15% de plenitud como base de motivación.
- **Sincronización 100% Cloud**: Tu posición en el reto, tus favoritos y tus ajustes se guardan en Supabase. Si cambias de dispositivo, tu árbol y tus luces te siguen intactos.

---

## 7. Rediseño Integral: Perfil 3.0 👤
- **Estética de Cristal**: Uso intensivo de transparencias y BlurView para una sensación premium.
- **Lenguaje Espiritual**: Secciones renombradas ("Tu Camino de Paz", "Tu Ritual de Calma").
- **Alfabetización de Bienestar**: Iconos **ⓘ** con explicaciones modales sobre Racha, Resiliencia Score y Metas.
- **Cerebro de la App**: Desde el perfil configuras tus metas de meditación diarias y semanales, que recalibran la inteligencia de toda la aplicación.

---

## 8. Panel de Administración (Gestión de Contenido) ⚙️
**Acceso:** `http://localhost:5173` (Entorno Local)

Paziify ahora cuenta con un Panel de Administración robusto para gestionar el catálogo musical y de audio sin tocar código.
- **Gestión de Audiolibros**: Creación, edición y subida de media a Supabase Storage.
- **Filtros Inteligentes**: Auditoría masiva por categoría y guía.
- **Control Técnico**: Gestión de patrones de respiración y capas de audio.

---
*Última revisión: 11 de Febrero de 2026 - Versión 2.6.5 (Spiritual Update)*
