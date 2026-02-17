# 🎨 Guía: Generación Manual de Imágenes (Glassmorphic Zen)

Esta guía documenta los estándares visuales para generar manualmente las portadas de audiolibros y sesiones de meditación, asegurando que encajen perfectamente en la estética "Glassmorphic Zen" de la aplicación.

## 📐 Especificaciones Técnicas

### Dimensiones y Formato
*   **Relación de Aspecto**: Vertical **2:3** (Estándar de Portada).
*   **Resolución Recomendada**: **1024x1536 px** (Calidad Alta) o **512x768 px** (Optimizado).
*   **Formato**: PNG o JPG (80% calidad).

### Estilo Visual (Glassmorphic Zen)
El estilo se caracteriza por:
*   **Fondo Negro Obsidiana**: Para fundirse con el modo oscuro de la app.
*   **Elementos Bioluminiscentes**: Colores neón (cian, esmeralda, magenta) que brillan.
*   **Formas Abstractas**: Evitar fotorealismo humano complejo; preferir formas orgánicas, humo, fluidos o cristales.

---

## 🤖 Prompt Recomendado (Midjourney v6 / DALL-E 3)

Usa este prompt base y modifica solo el concepto central para mantener la consistencia en todo el catálogo.

> **Prompt:**
> `surreal meditation abstract art, [TU CONCEPTO AQUI], bioluminescent fluid shapes, obsidian black background, emerald green and cyan neon lighting, 3d glass render, ethereal atmosphere, 8k resolution, minimalist zen composition --ar 2:3 --v 6.0`

### Ejemplos de Conceptos (`[TU CONCEPTO AQUI]`):
*   **Calma/Ansiedad**: "calm ocean waves", "gentle smoke swirls", "floating feather".
*   **Rendimiento/Foco**: "floating geometric crystal", "laser focus beam", "symmetrical structure".
*   **Sueño**: "ancient tree roots", "moonlight reflections", "suspended particles".
*   **Resiliencia**: "strong mountain silhouette", "glowing core", "shield energy".

---

## ⚠️ Notas de Integración
*   Las imágenes se subirán al bucket `meditation-thumbnails` o `audiobook-thumbnails` de Supabase.
*   La aplicación aplicará automáticamente esquinas redondeadas y efectos de desenfoque (`BlurView`), por lo que no es necesario aplicar bordes o marcos en la imagen original.
