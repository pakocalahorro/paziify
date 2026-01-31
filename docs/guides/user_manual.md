# 📖 Guía de Funcionalidad - Manual de Usuario (v1.7.0 Visual Theme System) 💎

Bienvenido a la guía oficial de **Paziify v1.7**. Esta versión introduce un **Sistema de Temas Visuales Personalizables** para meditación, además de consolidar la integración de **Google Auth** y las **Sugerencias Inteligentes**.

---

## 1. Onboarding Zen (Acceso Flexible) 🚪
**Pantalla:** `WelcomeScreen` -> `RegisterScreen` / `LoginScreen`
Paziify prioriza tu entrada al bienestar:
- **Continuar con Google**: Acceso instantáneo y seguro. Tu progreso (minutos, favoritos, historial) se sincroniza automáticamente.
- **Explorar como Invitado**: Acceso directo sin registros. Tu progreso es efímero y se borrará al cerrar la app a menos que vincules tu cuenta.

---

## 2. El Santuario Mágico (Experiencia Inicial) ✨
**Pantalla:** `CompassScreen` -> `ManifestoScreen`
Hemos transformado la Brújula Interior en una experiencia interactiva mágica:
- **Orbes 3D Hiperrealistas**:
    - **Sanar (Emerald Heart)**: Un orbe de cristal esmeralda con energía bio-luminiscente que late al ritmo de tu respiración.
    - **Crecer (Solar Plasma)**: Un orbe de energía solar dorada para vitalidad y foco.
- **Interacción Explosiva**: Al tocar un orbe, este carga energía (vibración háptica) y al soltar, genera una **explosión espiritual** de luz que despeja tu camino.
- **Atmósfera Cósmica**: Fondo con sistema de partículas (stardust) y movimiento fluido que crea profundidad espacial real.

---

## 3. La Nueva Biblioteca Unificada 📚
**Pantalla:** `LibraryScreen` -> Hubs de Contenido
La Biblioteca es ahora un portal visualmente coherente con tres pilares fundamentales que comparten la estética "Glassmorphic Zen":

### 🧘 Sesiones de Meditación (Experiencia v2.0)
- **Tarjetas de Cristal**: Nuevo diseño transparente con fondos inmersivos que se integran con el ambiente.
- **Guía Háptica**: Vibraciones inteligentes para meditar sin mirar la pantalla (Doble pulso al inhalar, Vibración profunda al exhalar).
- **Motor de Audio Multi-Capa**: Personaliza tu experiencia mezclando Voz, Paisaje Sonoro y Ondas Binaurales.

#### 🎨 Sistema de Temas Visuales (v1.7.0)
Paziify ahora te permite personalizar completamente la atmósfera visual de tus sesiones de meditación:

- **4 Temas Únicos** con fondos de alta calidad (1920x1080):
  - 🌌 **Cosmos Místico**: Nebulosa espacial verde/azul con orbe esmeralda brillante
  - ⛩️ **Templo Zen**: Interior minimalista con velas y orbe naranja cálido
  - 🌲 **Bosque Místico**: Bosque al amanecer con orbe verde lima natural
  - 💧 **Cueva Cristalina**: Cueva natural con gotas y orbe cian refrescante

- **Orbe Temático Adaptativo**: El orbe de respiración cambia de color según el tema seleccionado, manteniendo sincronización perfecta con las fases de respiración (inhalar/exhalar/sostener).

- **Selector de Temas**: Accede al selector deslizando hacia arriba el panel de audio durante tu sesión. Verás 4 botones circulares con iconos temáticos. El tema activo se indica visualmente con un borde destacado.

- **Modo Inmersivo ☀️/🌙**: Botón toggle en la esquina superior derecha que alterna entre:
  - **Modo Meditación** (🌙 default): Fondo oscurecido al 60% con gradiente profundo para concentración
  - **Modo Inmersivo** (☀️): Fondo al 100% de opacidad con gradiente sutil para experiencia visual completa

- **Performance Premium**: Todas las animaciones mantienen 60 FPS con transiciones suaves entre temas.

### 🎧 Audiolibros (Clásicos del Bienestar)
- **Reproductor Persistente**: Escucha tus libros mientras navegas por otras partes de la aplicación.
- **Mini Player Flotante**: Un control discreto aparece sobre el menú inferior para pausar o cerrar el audio sin volver a la pantalla completa.
- **Funciones Pro**: Velocidad variable (0.5x-2.0x), Sleep Timer y marcadores de posición automáticos.

### 🌟 Historias Reales
- **Lectura Inspiradora**: Testimonios de superación en formato texto.
- **Categorización Inteligente**: Filtra por Ansiedad, Resiliencia o Crecimiento con soporte visual temático.
- **Estética Unificada**: Tarjetas y cabeceras siguen el mismo diseño premium que las meditaciones.

---

## 4. El Reproductor Premium 💎
**Componente:** `AudiobookPlayer` / `MeditationPlayer` / `MiniPlayer`
- **Mini Player**: Nuevo componente flotante que te acompaña mientras exploras la app, permitiendo control total sin interrupciones.
- **Glassmorphism**: Controles transparentes que flotan sobre portadas artísticas.
- **Retroiluminación Dinámica**: El fondo del reproductor se adapta a los colores de la sesión.

---

## 5. El Panel de Control Adaptativo (Home)
- **Atmósfera Respiratoria**: La nebulosa de fondo pulsa rítmicamente.
- **Sugerencias Inteligentes**: El contenido se adapta a tu estado actual. Si elegiste "Sanar", verás recomendaciones para ansiedad y sueño. Si elegiste "Crecer", verás contenido sobre liderazgo y carrera.
- **Disponibilidad 24/7**: Las sugerencias ahora son visibles tanto en el vibrante Modo Día como en el relajante Modo Noche.
- **Diseño Unificado**: Cabeceras con iconos retroiluminados (`BacklitSilhouette`) y tipografía jerarquizada en todas las pantallas.

---

## 6. Comunidad y Feedback Social
- **Dar Paz 🍃**: Envía apoyo a otros usuarios de la comunidad.
- **Reflexiones**: Comparte tu estado de ánimo al finalizar cada sesión para inspirar a otros.

---

## Checklist de Verificación de Usuario ✅
- [x] ¿Sientes la vibración al cargar energía en la Brújula?
- [x] ¿Puedes seguir escuchando un audiolibro mientras buscas una meditación?
- [x] ¿El Mini Player aparece correctamente sobre el menú inferior?
- [x] ¿Las tarjetas de meditación e historias tienen el mismo estilo de vidrio transparente?
- [x] ¿Las portadas de los audiolibros se ven nítidas y artísticas?
- [x] ¿Puedes cambiar entre los 4 temas visuales durante una sesión de meditación?
- [x] ¿El orbe cambia de color al seleccionar un tema diferente?
- [x] ¿El modo inmersivo (☀️/🌙) alterna correctamente la opacidad del fondo?
- [x] ¿Los fondos de alta calidad se ven nítidos y sin pixelación?

---
---
*Última revisión: 30 de Enero de 2026 - v1.7.0 (Visual Theme System)*
