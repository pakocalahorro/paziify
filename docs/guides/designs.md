# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.37.0) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.37.0** (Oasis 3.0 Standardization) consolida la visión del **Master Header**, el diseño de secciones **True Full-Width** y la estandarización del **Modelo Único OasisCard**.

---

## 1. El Flujo Espiritual (UX Zen) ... [Mantenido] ...

---

## 2. Componentes Inteligentes (Skia & Reanimated) ... [Mantenido] ...

---

## 3. Estética Bento & Capa Editorial
La Home y el Perfil se rigen por la organización celular y la transparencia.
- **Bento Grid**: Organización en tarjetas de cristal con fondos de **fotografía real (WebP)**.
- **Optimización Expo-Image**: Renderizado nativo con caché en disco para navegación Zero-Egress.
- **Jerarquía Técnica (v2.8.10)**: Hemos simplificado la carga de audio eliminando archivos descriptivos. El diseño ahora busca la eficiencia: 1 archivo técnico por lección, eliminando errores de visualización 400.

---

## 4. Identidad Corporativa y Catálogos Unificados 🏗️⚖️
- **Arquitectura de Activos Unificada**: Todas las lecciones de la Academia siguen el patrón `{moduleId}-{indice}.mp3`. Esto asegura una visualización limpia e inmediata en el reproductor.
- **Ratio de Carátulas**: Se mantiene el ratio **1.35** para coherencia visual absoluta en todos los catálogos (Meditación, Academia, Audiolibros).

---

## 5. El Menú Flotante (CustomTabBar) 🛸
- **Concepto**: Isla de cristal suspendida sobre el `insets.bottom`.
- **StarCore**: Orbe respiratorio central con feedback dinámico según el `life_mode`.

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
- **Modelo Único OasisCard**:
  - **Altura Estándar (v2.37.0)**: Coherencia absoluta con altura de imagen de **200px** en todos los carruseles (Home, Meditación, Audiolibros y Academia).
  - **Insignia de Guía**: Avatares circulares de 18px situados en la base de la imagen con nombre de autor.
- **Bottom Elevation**: Mantenemos elevación de carruseles a **+100px** para evitar colisiones con el menú flotante.

---

### 11. Panel Admin Premium (v2.30.5) 🛠️
El CMS ha sido diseñado para una gestión técnica sin fricciones:

*   **Portadas HDR (Listado)**: Miniaturas de **80px** con componente `Image` de Ant Design que permite previsualización clicable en pantalla completa.
*   **Persistent Layout**: Uso de `localStorage` para recordar el ancho de las columnas (resizable) y el número de elementos por página (`pageSize`).
*   **Jerarquía de Datos**: El campo **Slug** tiene prioridad visual absoluta, ubicado por encima del Título para facilitar la identificación técnica.
*   **MediaUploader Out-of-box**: Componente especializado que permite la subida a subcarpetas, estandariza nombres a ASCII y gestiona la eliminación de archivos antiguos automáticamente.
*   **Preview Integrado**: Botones de Play/Stop en los formularios para validar binaurales y paisajes sonoros instantáneamente.
*   **Selectores de Coherencia**: Mapas de constantes que vinculan IDs técnicos con etiquetas amigables (ej: "Ondas Alpha (Enfoque)" -> `alpha_waves`).

---

## 13. Santuario de Alta Fidelidad (v2.31.0) 🏛️
El Santuario (modal de sintonización) ha sido rediseñado para priorizar claridad y disciplina:

| Propiedad | Valor |
|-----------|-------|
| **Opacidad del fondo** | 98% (`rgba(15, 23, 42, 0.98)`) |
| **Border Radius** | 40 |
| **Título dinámico** | `PROGRAMA "[NOMBRE]" ACTIVADO` |
| **Modos bloqueados** | Sanar/Crecer deshabilitados visualmente durante reto activo |
| **Guía Biblioteca** | Bloque con background `rgba(0,0,0,0.4)`, padding 16, gap 12 |
| **Tipografía misión** | `Caveat_700Bold` en títulos |

---

## 14. Paleta de Evolución (v2.31.0) 🎨
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

## 12. Estilo Premium Editorial (v2.13.0) 📖
Para evitar la sobrecarga cognitiva y el aspecto genérico de "grid de tarjetas", la Home Screen adopta un diseño tipo catálogo de arte o portada de revista:

**Formato "Out-of-box"**:
- Títulos y descripciones se extraen fuera del contenedor de la tarjeta fotográfica.
- La tarjeta queda como un lienzo limpio con *Badges* minimalistas y un enorme CTA centrado.
- Alturas unificadas (ej: 200px) para mantener un *scroll* armónico en todas las secciones independientes.

**Sistema Tipográfico Corporativo Dual (Outfit + Caveat)**:
- **La Estructura (`@expo-google-fonts/outfit`)**: Tipografía geométrica, moderna y extremadamente legible que reemplaza a las antiguas sans-serif en los títulos principales (ej. `fontFamily: 'Outfit_800ExtraBold'`, `Outfit_900Black`). Su peso aporta robustez técnica y seriedad de grado médico.
- **La Alma (`@expo-google-fonts/caveat`)**: Tipografía manuscrita que da un carácter humano, íntimo y personal a la app. Otorga el matiz "Boutique/Editorial".
- **Norma de Uso Dual**: `Caveat_700Bold` actúa EXCLUSIVAMENTE como "Firma" o "Prefijo" (tamaño grande 22-36px) flotando justo por encima de la "Estructura" maciza que proporciona `Outfit`. Esta será la base para todos los futuros refinamientos de UI corporativa de Paziify.

**Dashboard Compacto de Analíticas**:
- Agrupación de métricas de Salud (Diarias/Semanales) en un "Glassmorphism oscurecido" (`rgba(2, 6, 23, 0.4)`, Intensity 70).
- Side-by-side Layout: Componentes visuales gemelos (ZenMeters contiguos) con rotulación de texto aglomerado al estilo widget nativo (`12 m Hoy`).

---

## 16. Cardio Scan v2 — Diseño Premium (v2.32.0) 🩺

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

---

## 17. Oasis Settings & Profile Redesign (v2.34.0) 🌿
Rediseño integral para maximizar la claridad y reducir la fricción.

### Perfil (ProfileScreen)
- **Fusión de Reportes**: Unificación de botones en "Ver Reporte Semanal".
- **Composición**: Bento grid con `BlurView` y `Ionicons sparkles` para el acceso al reporte.
- **Header ergonómico**: Logout (izq) y Ajustes (der).

### Ajustes (SettingsScreen)
- **Glassmorphism Groups**: Secciones agrupadas en contenedores con `backgroundColor: 'rgba(255, 255, 255, 0.03)'` y `borderWidth: 1`.
- **Health Auto-Sync**: Eliminación de botones de guardado; sincronización inmediata con feedback visual en inputs.
### Gráficas y Datos (Oasis Analytics)
- **Barra de Actividad/Bio-Ritmo**: Se ha unificado el diseño de barras crecientes con `LinearGradient`.
- **Temática**: No se usan gráficos externos; se prefiere la visualización nativa con estados de "Meta" (Verde) y "Progreso" (Dorado).

- **Controles +/-**: Para metas diarias/semanales con `goalButton` de 32x32px.

---

## 18. Paziify Design System (PDS) v3.0 - "Oasis Edition" (v2.34.0) 🪐
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

*Última revisión: 2 de Marzo de 2026 - Versión 2.37.0 (PDS 3.0 Standardization Edition)*
