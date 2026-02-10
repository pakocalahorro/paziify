# 📖 Guía de Funcionalidad - Manual de Usuario (v2.3.0) 💎

Bienvenido a la guía oficial de **Paziify v2.3**. Esta versión introduce la **Academia Paziify**, la arquitectura **Offline-First**, sincronización total con la nube y el **Catálogo Maestro** de 10 categorías.

---

## 1. Onboarding Zen (Acceso Flexible) 🚪
**Pantalla:** `WelcomeScreen` -> `RegisterScreen` / `LoginScreen`
Paziify prioriza tu entrada al bienestar:
- **Continuar con Google**: Acceso instantáneo y seguro. Tu progreso (minutos, favoritos, historial) se sincroniza automáticamente.
- **Explorar como Invitado (Ghost Mode)**: Acceso directo sin registros.
    - *Advertencia*: Tu progreso es 100% efímero (se guarda en RAM). Si cierras la app o cambias de dispositivo, perderás tus rachas y favoritos. ¡Vincúlate a Google para guardar!
- **Modo Offline (Nuevo)**: Tu contenido visitado se guarda automáticamente. Si pierdes la conexión, podrás seguir accediendo a:
    - Catálogo completo (visto recientemente).
    - Audiolibros e Historias cacheadas.
    - *Nota*: Si intentas iniciar una sesión nueva sin internet y sin haberla descargado, verás una alerta amigable.

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
- **Navegación Intuitiva (Estilo Netflix)**: Explora el contenido mediante filas horizontales deslizables organizadas por temáticas. Usa el botón "Ver Todo" debajo de cada título para entrar en una vista de lista vertical detallada de esa categoría.
- **Jerarquía Visual Clara**:
    - **DESTACADOS**: Sección superior con "Meditaciones Técnicas" (Core), "Sesiones Rápidas" (Poster) y "Mejor Valoradas" (Wide).
    - **EXPLORA POR CATEGORÍAS**: Sección general con las 10 áreas temáticas.
    - **Separadores "Soundwave"**: Líneas de energía ondulatorias generadas proceduralmente (Skia) que "respiran" y dividen las secciones. Los títulos utilizan un efecto de **Retroiluminación (Backlit)** para máxima legibilidad sobre el fondo animado.
- **Contenido Fresco (Smart Shuffle)**: Cada vez que abres la app, el orden de las sesiones técnicas y categorías cambia sutilmente para que siempre descubras algo nuevo, manteniendo tus Favoritos y Novedades siempre a mano.
- **Categorización Maestra (10 Temáticas)**: El catálogo ahora se organiza en 10 áreas reales del bienestar: *Calma SOS, Mindfulness, Sueño, Resiliencia, Rendimiento, Despertar, Salud, Hábitos, Emocional* y *Niños*. Cada una con su color e iconografía distintiva.
- **Identidad de Guías**: Disfruta de la personalidad vocal única de nuestros 4 guías (Aria, Ziro, Éter y Gaia) en sus especialidades correspondientes.
- **Tarjetas de Cristal**: Diseño transparente con fondos inmersivos que se integran con el ambiente.
- **Guía Háptica**: Vibraciones inteligentes para meditar sin mirar la pantalla (Doble pulso al inhalar, Vibración profunda al exhalar).
- **Motor de Audio Multi-Capa**: Personaliza tu experiencia mezclando Voz, Paisaje Sonoro y Ondas Binaurales.
- **Sincronización Grado Médico (v1.8.0)**: El orbe y las instrucciones de voz ahora respiran al unísono con una precisión de 16ms, sin importar la velocidad de la sesión.
- **Inicio Zen (Countdown)**: Al pulsar play, una transición suave con cuenta atrás "3-2-1" prepara tu mente antes de que suene el primer audio.
- **Aura de Latido (Heartbeat)**: Durante la sesión, el temporizador emite un pulso visual rítmico ("Aura") que imita un corazón en calma, reforzando la relajación visual.
- **Adiós a las Pausas**: Interfaz limpia sin botones intrusivos. Toca cualquier parte de la pantalla para revelar los controles cuando los necesites.

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
- **Tarjeta Informativa**: Ahora puedes ver de un vistazo quién narra la historia (con su avatar) y la duración total antes de empezar.
- **Reproductor Persistente**: Escucha tus libros mientras navegas por otras partes de la aplicación.
- **Mini Player Flotante**: Un control discreto aparece sobre el menú inferior para pausar o cerrar el audio sin volver a la pantalla completa.
- **Funciones Pro**: Velocidad variable (0.5x-2.0x), Sleep Timer y marcadores de posición automáticos.

### 🌟 Historias Reales: Mentes Maestras
- **Biografías Inspiradoras**: Descubre cómo la meditación transformó la vida de figuras históricas y contemporáneas (Steve Jobs, Marco Aurelio, Kobe Bryant).
- **Formato Editorial**: Historias estructuradas en "El Desafío", "El Descubrimiento" y "La Transformación".
- **Identidad Visual**: Tarjetas con nombres destacados y roles profesionales para máxima inspiración.
- **Categorización Inteligente**: Filtra por Ansiedad, Resiliencia o Crecimiento con soporte visual temático.
- **Estética Unificada**: Tarjetas y cabeceras siguen el mismo diseño premium que las meditaciones.

---


### 🎵 Música & Ambientes (Espacios Sonoros)
**Nuevo en v2.4**: Un santuario sonoro diseñado para el enfoque profundo, el sueño reparador o la simple relajación.
- **Paisajes Infinitos**: Bucles de alta fidelidad (Bosque, Lluvia, Cosmos) que nunca se detienen.
- **Mezclador Binaural**: Personaliza tu experiencia añadiendo capas de frecuencias cerebrales:
    - *432 Hz*: Armonía universal.
    - *Alpha*: Para relajación consciente y creatividad.
    - *Theta*: Para meditación profunda.
- **Visuales Vivos**: Cada paisaje cuenta con un fondo animado sutilmente (polvo estelar, partículas) generado en tiempo real para no distraer.
- **Modo Background**: El audio continúa reproduciéndose aunque salgas de la app o bloquees la pantalla.

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
- **¿Compartimos la experiencia?**: Al finalizar una sesión, verás una invitación elegante para compartir cómo te sientes.
- **Reflexiones**: Escribe o selecciona tu estado de ánimo ("Mood Index") para registrar tu viaje emocional y ver cómo otros se sintieron con esa misma sesión.

---

## 7. Panel de Administración (Gestión de Contenido) ⚙️
**Acceso:** `http://localhost:5173` (Entorno Local)

Paziify ahora cuenta con un Panel de Administración robusto para gestionar el catálogo musical y de audio sin tocar código.

### 🎧 Gestión de Audiolibros
- **Crear/Editar**: Formulario completo con subida de archivos (mp3/jpg) directa a la nube.
- **Validación Automática**: El sistema verifica que los archivos se suban correctamente antes de guardar.
- **Reproducción**: Los audios subidos aparecen inmediatamente en la app móvil.

### 🧘 Gestión de Meditaciones (CMS Paziify v2.4)
- **Vista Visual**: El listado muestra las portadas reales en lugar de IDs, facilitando la identificación.
- **Filtros Inteligentes (Power Search)**:
    - Haz clic en el icono de **embudo** en las columnas "Category" o "Guide" para filtrar el catálogo rápidamente. Ideal para auditorías masivas.
- **Edición Completa (JSONB Direct)**:
    - **Cambio de Guía**: Asigna sesiones a Aria, Ziro, Éter o Gaia.
    - **Categorización**: Mueve sesiones entre categorías de forma instantánea.
    - **Control Técnico**: Gestión de `breathing_pattern` y `audio_layers` sin tocar código.
- **MediaUploader Inteligente**:
    - Sube nuevas versiones de voz o portadas con pre-visualización.
    - El sistema detecta archivos existentes y gestiona el reemplazo en Supabase Storage, manteniendo los buckets limpios.

### 🖼️ Notas sobre Imágenes & Estética
- El panel espera imágenes verticales (2:3) para mantener la consistencia estética "Glassmorphic Zen".
- **Prioridad de Carga**: Si subes una imagen desde el Admin, la app móvil la priorizará automáticamente sobre las imágenes predefinidas de categoría.

---

## 8. La Academia Paziify (Nuevo v2.3.0) 🎓
**Pantalla:** `AcademyScreen` -> `CourseDetail` -> `LessonPlayer`

La Academia es el módulo educativo estructurado de Paziify, diseñado para el aprendizaje profundo y el desarrollo personal a través de cursos secuenciales.

### Catálogo Maestro (10 Cursos)
Hemos estructurado el conocimiento en 10 pilares fundamentales:
1.  **Fundamentos CBT**: Terapia Cognitivo-Conductual para el día a día.
2.  **Autoestima de Acero**: Construyendo confianza indestructible.
3.  **Relaciones Conscientes**: Comunicación y empatía en pareja/familia.
4.  **Productividad Zen**: Hacer más con menos estrés (Flow).
5.  **Liderazgo Empático**: Gestión de equipos desde la calma.
6.  **Finanzas Zen**: Relación saludable con el dinero.
7.  **Mindfulness Avanzado**: Más allá de la respiración.
8.  **Sueño Profundo**: Ciencia y práctica del descanso reparador.
9.  **Nutrición Consciente**: Alimentación para el cuerpo y la mente.
10. **Crianza Zen**: Educar desde el amor y la paciencia.

### Estructura de Aprendizaje
- **Cursos**: Contenedores temáticos con identidad visual única (Tipografía Oswald).
- **Módulos**: Bloques lógicos que agrupan lecciones.
- **Lecciones**: Unidades de contenido mixtas (Texto + Audio Guía TTS).
    - *Progreso Lineal*: Debes completar las lecciones en orden.
    - *Audio Guía*: Cada lección incluye una versión narrada por nuestros guías IA para aprender en movimiento.

### Sistema de Certificación 🏆
- **Quiz Final**: Al completar todas las lecciones de un curso, se desbloquea el Examen Final.
- **Evaluación**: Preguntas de opción múltiple para validar lo aprendido.
- **Certificado**: Al aprobar, obtienes un certificado digital en tu perfil que valida tu maestría en esa área.

### Identidad Visual "Academy"
- **Tipografía de Impacto**: Uso exclusivo de la fuente **Oswald** para títulos, transmitiendo autoridad y modernidad.
- **Tarjetas Skia Avanzadas**:
    - **Hollow (Ansiedad/CBT)**: Bordes brillantes con interior transparente, simbolizando claridad.
    - **Solid (Profesional)**: Bloques de color sólido para categorías de negocios y productividad.
    - **Duotone (Salud)**: Combinación de dos tonos armónicos para temas de bienestar físico.

---

## Checklist de Verificación de Usuario ✅
- [x] ¿Sientes la vibración al cargar energía en la Brújula?
- [x] ¿El Mini Player aparece correctamente sobre el menú inferior?
- [x] ¿Puedes completar una lección de la Academia y ver tu progreso avanzar?
- [x] ¿Los títulos de los cursos se ven con la tipografía Oswald (impacto)?
- [x] ¿Puedes cambiar entre los 4 temas visuales durante una sesión de meditación?
- [x] ¿El modo inmersivo (☀️/🌙) alterna correctamente la opacidad del fondo?

---

*Última revisión: 9 de Febrero de 2026 - v2.3.0 (Academy & Cloud Sync)*
