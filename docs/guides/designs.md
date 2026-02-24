# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.31.0) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.31.0** introduce el **Santuario de Alta Fidelidad** y el sistema de **Enfoque en Misión**.

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
- **Tipografía**: **Oswald** (Headings) y **Inter/System** (Cuerpo técnico).

---

## 7. Optimización de Safe Areas
- **Bottom Elevation**: Elevación de carruseles a **+100px** para evitar colisiones con el menú flotante.

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

**Sistema Tipográfico Corporativo Dual (Outfit + Satisfy)**:
- **La Estructura (`@expo-google-fonts/outfit`)**: Tipografía geométrica, moderna y extremadamente legible que reemplaza a las antiguas sans-serif en los títulos principales (ej. `fontFamily: 'Outfit_800ExtraBold'`, `Outfit_900Black`). Su peso aporta robustez técnica y seriedad de grado médico.
- **La Alma (`@expo-google-fonts/satisfy`)**: Tipografía manuscrita introducida para dar un carácter humano, íntimo y personal a la app. Otorga el matiz "Boutique/Editorial".
- **Norma de Uso Dual**: `Satisfy` actúa EXCLUSIVAMENTE como "Firma" o "Prefijo" (tamaño grande 22-36px, sin pesos gruesos) flotando justo por encima de la "Estructura" maciza que proporciona `Outfit`. Esta será la base para todos los futuros refinamientos de UI corporativa de Paziify.

**Dashboard Compacto de Analíticas**:
- Agrupación de métricas de Salud (Diarias/Semanales) en un "Glassmorphism oscurecido" (`rgba(2, 6, 23, 0.4)`, Intensity 70).
- Side-by-side Layout: Componentes visuales gemelos (ZenMeters contiguos) con rotulación de texto aglomerado al estilo widget nativo (`12 m Hoy`).

---

*Última revisión: 24 de Febrero de 2026 - Versión 2.31.0 (Evolution Focus)*
