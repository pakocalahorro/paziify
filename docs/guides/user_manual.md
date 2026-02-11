# 📖 Guía de Funcionalidad - Manual de Usuario (v2.6.5) 💎

Bienvenido a la guía oficial de **Paziify v2.6.5**. Esta versión introduce el **Spiritual Flow**, el **Reto Mensual de 30 Días**, la **Sincronización 100% Nube (Favoritos, Historial y Ajustes)**, el modo de vida **Sanar vs Crecer** persistente y el rediseño **Perfil 3.0**.

---

## 1. Onboarding Zen y Flujo Espiritual (Fricción Cero) 🚪
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

## 3. La Nueva Biblioteca Unificada 📚
**Pantalla:** `LibraryScreen` -> Hubs de Contenido
La Biblioteca es ahora un portal visualmente coherente con tres pilares fundamentales que comparten la estética "Glassmorphic Zen":

### 🧘 Sesiones de Meditación (Experiencia v2.0)
- **Navegación Intuitiva (Estilo Netflix)**: Explora el contenido mediante filas horizontales deslizables organizadas por temáticas. Usa el botón "Ver Todo" debajo de cada título para entrar en una vista de lista vertical detallada de esa categoría.
- **Jerarquía Visual Clara**:
    - **DESTACADOS**: Sección superior con "Meditaciones Técnicas" (Core), "Sesiones Rápidas" (Poster) y "Mejor Valoradas" (Wide).
    - **EXPLORA POR CATEGORÍAS**: Sección general con las 10 áreas temáticas.
- **Separadores "Soundwave"**: Líneas de energía ondulatorias generadas proceduralmente (Skia) que "respiran" y dividen las secciones. Los títulos utilizan un efecto de **Retroiluminación (Backlit)** para máxima legibilidad sobre el fondo animado.
- **Contenido Fresco (Smart Shuffle)**: Cada vez que abres la app, el orden de las sesiones técnicas y categorías cambia sutilmente para que siempre descubras algo nuevo.
- **Categorización Maestra (10 Temáticas)**: El catálogo ahora se organiza en 10 áreas reales del bienestar: *Calma SOS, Mindfulness, Sueño, Resiliencia, Rendimiento, Despertar, Salud, Hábitos, Emocional* y *Niños*.
- **Identidad de Guías**: Disfruta de la personalidad vocal única de nuestros 4 guías (Aria, Ziro, Éter y Gaia).
- **Tarjetas de Cristal**: Diseño transparente con fondos inmersivos que se integran con el ambiente.
- **Guía Háptica**: Vibraciones inteligentes para meditar sin mirar la pantalla (Doble pulso al inhalar, Vibración profunda al exhalar).
- **Motor de Audio Multi-Capa**: Personaliza tu experiencia mezclando Voz, Paisaje Sonoro y Ondas Binaurales.
- **Sincronización Grado Médico (v1.8.0)**: El orbe y las instrucciones de voz ahora respiran al unísono con una precisión de 16ms.

#### 🎨 Sistema de Temas Visuales (v1.7.0)
Paziify ahora te permite personalizar completamente la atmósfera visual de tus sesiones de meditación:
- **4 Temas Únicos** con fondos de alta calidad (1920x1080):
  - 🌌 **Cosmos Místico**: Nebulosa espacial verde/azul.
  - ⛩️ **Templo Zen**: Interior minimalista, tonos cálidos.
  - 🌲 **Bosque Místico**: Bosque al amanecer, orbe verde natural.
  - 💧 **Cueva Cristalina**: Cueva natural con gotas y orbe cian refrescante.

---

## 4. El Reproductor Premium 💎
**Componente:** `AudiobookPlayer` / `MeditationPlayer` / `MiniPlayer`
- **Mini Player**: Nuevo componente flotante que te acompaña mientras exploras la app, permitiendo control total sin interrupciones.
- **Glassmorphism**: Controles transparentes que flotan sobre portadas artísticas.
- **Retroiluminación Dinámica**: El fondo del reproductor se adapta a los colores de la sesión.

---

## 5. El Panel de Control Adaptativo (Home 3.0)
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
