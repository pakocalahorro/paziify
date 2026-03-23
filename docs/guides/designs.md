# Guía Maestra de Diseño Visual - Concepto "Oasis" 🎨

Esta guía define el ADN visual de Paziify. Esta versión consolida el rediseño inmersivo "Edge-to-Edge" en los flujos de Onboarding, la vista de Evolución estructurada, las animaciones activas dinámicas del **Master Header**, y la integración del Carrusel Inteligente de Favoritos de la Home.

---

## 1. El Flujo Espiritual (UX Zen) ... [Mantenido] ...

---

## 2. Componentes Inteligentes (Skia & Reanimated)
- **Luces de Navidad (v2.51.0)**: El Árbol de Resiliencia utiliza orbes reactivos con efecto "respiración".
  - **Color**: Amarillo Oro (`#FFD700`).
  - **Dinámica**: Radio base 8, Blur 60. Pulsación escala 0.8 -> 1.2 vía `withRepeat` y `withSequence`.
  - **Reactividad**: Obligatorio pasar `DerivedValue` directamente a las props de Skia (`cx`, `cy`, `r`, `blur`) para evitar congelación de frames.
- **Header Evolución**: Botón ampliado a **125px** con `adjustsFontSizeToFit` para garantizar legibilidad de misiones largas.

---

## 3. Estética Bento & Capa Editorial
La Home y el Perfil se rigen por la organización celular y la transparencia.
- **Bento Grid**: Organización en tarjetas de cristal con fondos de **fotografía real (WebP)**.
- **Optimización Expo-Image**: Renderizado nativo con caché en disco para navegación Zero-Egress.
- **Jerarquía Técnica**: Hemos simplificado la carga de audio eliminando archivos descriptivos. El diseño ahora busca la eficiencia: 1 archivo técnico por lección, eliminando errores de visualización 400.

---

## 4. Identidad Corporativa y Catálogos Unificados 🏗️⚖️
- **Arquitectura de Activos Unificada**: Todas las lecciones de la Academia siguen el patrón `{moduleId}-{indice}.mp3`. Esto asegura una visualización limpia e inmediata en el reproductor.
- **Ratio de Carátulas**: Se mantiene el ratio **1.35** para coherencia visual absoluta en todos los catálogos (Meditación, Academia, Audiolibros).

---

## 5. El Menú Flotante (CustomTabBar) 🛸
- **Concepto**: Isla de cristal suspendida sobre el `insets.bottom`.
- **StarCore**: Orbe respiratorio central con feedback dinámico según el `life_mode`.

---

## 4. Onboarding inmersivo "Edge-to-Edge"
Las pantallas de entrada (`Welcome`, `Login`, `SpiritualPreloader`) rompen con la topología de tarjetas. Utilizan los fondos de vídeo o renderizados inmersivos al 100% de la pantalla, inhabilitando las bandas de contención negras (Safe Area). El vídeo base del proceso de login continúa reproduciéndose fluidamente entre el registro inicial y el inicio de sesión.

## 5. El Master Header Dinámico (OasisHeader)
La cabecera maestra universal reacciona al estado global del usuario con transiciones de alta fidelidad:
- **Estado Base:** Botón "✨ Evolución" con pastilla Glassmorphism sutil.
- **Estado Activo (Desafío en curso):** El texto cambia a "✔ ACTIVO". La pastilla se vuelve transparente de alta intensidad (`tint="dark"` de BlurView) y un fino aro de luz con el color temático del reto "sangra" sutilmente alrededor del mismo con transiciones a 60FPS procesadas por Skia/Reanimated.

---

## 6. Paleta de Color Bio-Luminiscente
- **Healing**: Emerald Green (`#2DD4BF`) / Cyan / Deep Obsidian.
- **Growth**: Solar Yellow (`#FBBF24`) / Golden White / Deep Obsidian.
- **Tipografía**: **Outfit** (Headings) y **Inter/System** (Cuerpo técnico).

---

## 7. Optimización de Bordes y Jerarquía
- **True Full-Width**: Eliminación total de paddings estructurales en `CategoryRow` y `SoundwaveSeparator` para permitir que el diseño inmersivo ocupe el 100% del ancho del dispositivo.
- **Carrusel de Resultados (v2.37.0)**:
  - **Motor Perfect Movement**: Uso de `ITEM_WIDTH = 0.75` para snapping central perfecto.
  - **Asistencia Premium**: Botones de flecha izquierda/derecha glassmorphic filtrados por `BlurView` y situados en **top: 216px** (centro matemático de la imagen de 200px).
- **Mapeo de Datos Puro**: Ahora `CategoryRow` mapea limpiamente la propiedad `subtitle={item.description}`, permitiendo que Audiolibros y Academia muestren sinopsis descriptivas debajo de la imagen sin concatenaciones forzadas.
- **Modelo Único OasisCard**:
  - **Altura Estándar**: Coherencia absoluta con altura de imagen de **200px** en todos los carruseles (Home, Meditación, Audiolibros y Academia).
  - **Insignia de Guía**: Avatares circulares de 18px situados en la base de la imagen con nombre de autor.
  - **Asimilación Visual de Colecciones**: Los elementos marcados como favoritos hacen latir el icono del corazón en color rojo Rubí (`#FF6B6B`), con su carrusel unificado heredando este mismo *accentColor*.
- **Bottom Elevation**: Mantenemos elevación de carruseles a **+100px** para evitar colisiones con el menú flotante.

---

## 8. Ergonomía de Reproductores (Safe Area)
Para evitar colisiones con las barras de navegación del sistema (Android Home Bar o iOS Indicator), los botones de acción inferior en reproductores deben usar siempre un margen dinámico:
```tsx
marginBottom: Math.max(30, insets.bottom + 20)
```
Este patrón es obligatorio para pantallas de reproducción como `AudiobookPlayerScreen` y `BackgroundPlayerScreen`.

## 9. Filtros Inmersivos (Patrón Oasis)
El filtrado de catálogos no debe usar etiquetas fijas superiores. Se debe delegar al icono `onFilterPress` del `OasisHeader` para desplegar un `Modal` tipo `BottomSheet` con `BlurView` oscuro, bordes redondeados (30px) y tipografía `Outfit_900Black`.

### 11. Panel Admin Premium 🛠️
El CMS ha sido diseñado para una gestión técnica sin fricciones:

*   **Portadas HDR (Listado)**: Miniaturas de **80px** con componente `Image` de Ant Design que permite previsualización clicable en pantalla completa.
*   **Persistent Layout**: Uso de `localStorage` para recordar el ancho de las columnas (resizable) y el número de elementos por página (`pageSize`).
*   **Jerarquía de Datos**: El campo **Slug** tiene prioridad visual absoluta, ubicado por encima del Título para facilitar la identificación técnica.
*   **MediaUploader Out-of-box**: Componente especializado que permite la subida a subcarpetas, estandariza nombres a ASCII y gestiona la eliminación de archivos antiguos automáticamente.
*   **Preview Integrado**: Botones de Play/Stop en los formularios para validar binaurales y paisajes sonoros instantáneamente.
*   **Selectores de Coherencia**: Mapas de constantes que vinculan IDs técnicos con etiquetas amigables (ej: "Ondas Alpha (Enfoque)" -> `alpha_waves`).

---

## 13. Santuario de Alta Fidelidad 🏛️
El Santuario (modal de sintonización) ha sido rediseñado para priorizar claridad y disciplina:

| Propiedad | Valor |
|-----------|-------|
| **Opacidad del fondo** | 98% (`rgba(15, 23, 42, 0.98)`) |
| **Border Radius** | 40 |
| **Título dinámico** | `PROGRAMA "[NOMBRE]" ACTIVADO` |
| **Modos bloqueados** | Sanar/Crecer deshabilitados visualmente durante reto activo |
| **Guía Biblioteca** | Bloque con background `rgba(0,0,0,0.4)`, padding 16, gap 12 |
| **Tipografía misión** | `Caveat_700Bold` en títulos |

### 13.5 El Estándar Oasis Unificado (Premium Modals v2.50.0)
Para modales de alto impacto (ej. `WelcomeTourModal`, `PurposeModal`), se utiliza un esquema de coherencia absoluta:
- **Fondo**: Deep Marine Opaque (`#16222A`) con gradientes `Sunrise`.
- **Borde**: Blanco Sólido de **2px** con efecto de cristal.
- **Aura**: BlurView nativo (vía `expo-blur`) con `tint="dark"` de alta intensidad.
- **Elevación**: `elevation: 15` (Android) para garantizar la separación de capas sobre el fondo desenfocado.
- **Jerarquía**: El rediseño del `PurposeModal` ahora comparte esta misma envolvente táctil del tour principal, eliminando la discrepancia oro/negro previa.

---

## 14. Paleta de Evolución 🎨
Cada programa del Sistema de Evolución tiene gradientes propios para identidad visual instantánea:

| Programa | Tipo | Gradiente | Icono |
|----------|------|-----------|-------|
| Desafío Paziify | Desafío (30d) | `#6366F1` → `#4F46E5` (Indigo) | trophy |
| Senda de la Calma | Reto (7d) | `#2DD4BF` → `#0D9488` (Teal) | leaf |
| Senda del Foco | Reto (7d) | `#FBBF24` → `#D97706` (Amber) | flash |
| Sprint SOS | Misión (3d) | `#EF4444` → `#B91C1C` (Rojo) | fitness |
| Pausa Express | Misión (3d) | `#8B5CF6` → `#6D28D9` (Violeta) | infinite |

### ChallengeDetailsModal
- **BlurView**: Intensity 90, tint dark
- **Border**: 1px `rgba(255,255,255,0.1)`, radius 32
- **CTA**: Gradiente lineal horizontal con colores del programa
- **Icono**: Contenedor circular 70px, background con opacidad 20%

---

## 15. Gamificación Visual (Mini-juegos) 🎮
Componentes de mini-juegos accesibles desde el Santuario:
- **GameContainer**: Orquestador con estados de selección, juego y resultado
- **NebulaBreathGame**: Mecánica de respiración con partículas de nebulosa
- **OrbFlowGame**: Flujo de orbes con interacción gestual
- **Tema visual**: Se adapta al `lifeMode` (healing = emerald, growth = solar)

---

## 12. Estilo Premium Editorial 📖
Para evitar la sobrecarga cognitiva y el aspecto genérico de "grid de tarjetas", la Home Screen adopta un diseño tipo catálogo de arte o portada de revista:

**Formato "Out-of-box"**:
- Títulos y descripciones se extraen fuera del contenedor de la tarjeta fotográfica.
- La tarjeta queda como un lienzo limpio con *Badges* minimalistas y un enorme CTA centrado.
- Alturas unificadas (ej: 200px) para mantener un *scroll* armónico en todas las secciones independientes.
- **Regla de Carruseles (v2.53.0)**: Los contenedores de `CategoryRow` deben tener una `minHeight: 400px` para acomodar cabeceras `OasisCard` y evitar colapsos visuales.
- **Margen de Bento Grid**: Espaciado de `marginTop: 10/20` obligatorio entre separadores de onda y tarjetas para evitar solapamientos de títulos.

**Sistema Tipográfico Corporativo Dual (Outfit + Caveat)**:
- **La Alma (`@expo-google-fonts/caveat`)**: Tipografía manuscrita que da un carácter humano, íntimo y personal a la app. Otorga el matiz "Boutique/Editorial".
- **Norma de Uso Dual (v2.43.0)**: 
  - **`Caveat_700Bold`**: Actúa EXCLUSIVAMENTE como "Firma" o título "Hero" de alto impacto. Se aplica en `SessionDetailScreen` (40px), `BackgroundPlayerScreen` (38px) y `LibraryScreen` (34px).
  - **`Outfit`**: Tipografía estructural obligatoria para toda la interfaz funcional, botones y métricas. Reemplaza cualquier uso de pesos numéricos (`fontWeight`) antiguos.
- **Carga de Fuentes**: `App.tsx` debe cargar `Caveat_400Regular` para textos secundarios de autoría y `Caveat_700Bold` para títulos.

**Dashboard Compacto de Analíticas**:
- Agrupación de métricas de Salud (Diarias/Semanales) en un "Glassmorphism oscurecido" (`rgba(2, 6, 23, 0.4)`, Intensity 70).
- Side-by-side Layout: Componentes visuales gemelos (ZenMeters contiguos) con rotulación de texto aglomerado al estilo widget nativo (`12 m Hoy`).

---

## 16. Cardio Scan v2 — Diseño Premium 🩺

### Pipeline Visual
Flujo: Botón INICIAR → Calibración (anillo de progreso 3s) → Countdown → Medición (~30s con barra de calidad) → Resultado

### Arquetipos Positivos (El Espejo del Alma)
| Diagnóstico | Arquetipo | Tag | Color | BG |
|---|---|---|---|---|
| sobrecarga | Guerrero en Reposo | TU CUERPO HA LUCHADO GRANDES BATALLAS, PERMÍTETE SANAR | `#EF4444` | `#1A0808` |
| agotamiento | Marea Calma | TU ENERGÍA ESTÁ BAJA PARA VOLVER CON FUERZA | `#FBBF24` | `#1A1500` |
| equilibrio | Sol Naciente | TU LUZ INTERIOR ES ESTABLE Y BRILLANTE | `#10B981` | `#061812` |

### Historial Bio-Ritmo
- Mini-gráfica de barras HRV 7 días
- Días: D L M X J V S (lookup manual `getDay()`)
- Barra actual: `#10B981`, anteriores: `rgba(255,255,255,0.15)`

### Patrón de Footer Unificado (Modal + Satisfacción)
```
[ ♥ Escanear/Verificar ]  [ ▶ Comenzar/Continuar ]
```
- Ambos botones `flex: 1` (50/50 exacto)
- Botón rojo: `rgba(255, 75, 75, 0.12)`, border `rgba(255, 75, 75, 0.3)`, animación heartbeat (Reanimated `withRepeat` escala 1→1.08)
- Botón verde: `rgba(45, 212, 191, 0.25)`, border `rgba(45, 212, 191, 0.5)`
- Height: 56px, borderRadius: 16

### Fondo de Sesión Consistente
Todas las pantallas del flujo de meditación usan la `thumbnailUrl` de la sesión:
- `SessionPreviewModal`: Imagen hero de la sesión
- `BreathingTimer`: `ImageBackground` con tema visual
- `CardioResultScreen`: `ImageBackground` opacity 0.3 + gradiente `rgba(10,10,10,0.5→0.9→#0A0A0A)`
- `SessionEndScreen`: `ImageBackground` opacity 0.3 + gradiente oscuro

### 16.5 Visualización de Favoritos (v2.39.0)
- **Icono Heart**: Latido con `withRepeat` y escala suave. Color: Rojo Rubí (`#FF6B6B`).
- **Carrusel Home**: Hereda el `accentColor` del elemento predominante. Layout "Out-of-box" para mostrar la sinopsis (description) sincronizada desde el Panel Admin.

---

## 17. Oasis Settings & Profile Redesign 🌿
Rediseño integral para maximizar la claridad y reducir la fricción.

### Perfil (ProfileScreen)
- **Fusión de Reportes**: Unificación de botones en "Ver Reporte Semanal".
- **Composición**: Bento grid con `BlurView` y `Ionicons sparkles` para el acceso al reporte.
- **Header ergonómico**: Logout (izq) y Ajustes (der).

### Ajustes (SettingsScreen)
- **Glassmorphism Groups**: Secciones agrupadas en contenedores con `backgroundColor: 'rgba(255, 255, 255, 0.03)'` y `borderWidth: 1`.
### Oasis Analytics v4.0 (Premium Standard)
- **Bordes**: Siempre 1.5px con color `rgba(255,255,255,0.15)`.
- **Fondo**: `BlurView` intensidad 70 (Tint: dark).
- **Layout**: Uso obligatorio de `onLayout` para componentes de 7 columnas (Calendarios) para garantizar precisión milimétrica.
- **Tipografía**: Etiquetas de métricas en formato "Header" (Uppercase, Outfit Bold/Semibold).
- **Inicio de Semana**: Lunes (L) absoluto.
- **Barra de Actividad/Bio-Ritmo**: Se ha unificado el diseño de barras crecientes con `LinearGradient`.
- **Temática**: No se usan gráficos externos; se prefiere la visualización nativa con estados de "Meta" (Verde) y "Progreso" (Dorado).

- **Controles +/-**: Para metas diarias/semanales con `goalButton` de 32x32px.

---

## 18. Paziify Design System (PDS) v3.0 - "Oasis Edition" 🪐
La culminación del rediseño de Paziify se basa en el PDS v3.0, caracterizado por tres pilares fundamentales que dictan la estética de todas las pantallas:

### 1. Profundidad a través de Glassmorphism (BlurViews)
- Adiós a los fondos grises y negros sólidos (`#1E293B`, `#0F172A`). Las tarjetas, modales y reproductores utilizan ahora `BlurView` nativos (vía `expo-blur`) con `tint="dark"` y niveles de `intensity` variables:
  - **Paneles base**: `intensity={15-20}`
  - **Reproductores flotantes/Widgets**: `intensity={35-45}`
  - **Modales superpuestos**: `intensity={70-90}`
- Los bordes se refinan con un trazo sutil de `borderWidth: 1` y `borderColor: 'rgba(255,255,255,0.05 a 0.15)'`.

### 2. Tipografía "Premium Editorial"
- Se eleva la jerarquía de las cabeceras principales mediante la fuente secundaria decorativa `Satisfy_400Regular`.
- Se mantiene `Outfit` para dar carácter moderno a las cards y `Inter` para la legibilidad del texto en párrafos.

### 3. "The Floating Island" (GlobalMiniPlayer)
- Incorpora animaciones de entrada (`FadeInDown.springify()`) y feedback háptico en cada interacción de reproducción, unificando Audiolibros, Historias y Sonidos de Fondo bajo la misma sombrilla.

### 4. Navegación Narrativa (Master Header)
- El encabezado superior actúa como un hilo conductor que elimina la desorientación. Incluye breadcrumbs interactivos y la identidad del usuario (Avatar/Nombre) en un marco de cristal persistente.
- El botón de ajustes se desplaza al cuerpo del perfil para preservar el header exclusivamente para la navegación y la evolución.

---

---

### 5. El Árbol de Resonancia (PDS 4.0 Vision)
Propuesta estratégica que sustituye el contador matemático (X/30) por una iluminación respiratoria basada en el `ResilienceScore` (0-100), eliminando el estrés de los reseteos mensuales.

---

*Última revisión: 23 de Marzo de 2026 - Versión 2.53.0 (Zero Defects Oasis 3.0)*
