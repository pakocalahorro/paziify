# Guía Maestra de Diseño Visual - Concepto "Oasis" (v2.30.5) 🎨

Esta guía define el ADN visual de Paziify. La versión **v2.30.5** introduce la **Evolución Premium** de contenido y herramientas administrativas profesionales.

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

*Última revisión: 21 de Febrero de 2026 - Master Audit v2.30.0 (Premium Evolution)*
