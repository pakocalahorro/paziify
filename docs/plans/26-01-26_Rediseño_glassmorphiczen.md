# 🎨 Plan de Rediseño: Glassmorphic Zen

Este plan detalla la transformación visual de los hubs de contenido (Meditación, Audiolibros e Historias) hacia una estética premium enfocada en la profundidad, la calma y el modernismo.

## 🌌 Visión Visual: "Glassmorphism"
El concepto se basa en interfaces translúcidas con desenfoque de fondo (`BlurView`), bordes sutiles y gradientes vivos pero suaves, creando una sensación de "capas" y profundidad.

---

## 🚀 Fase 1: Historias Reales (Prueba de Concepto)

### 1. Componente `StoryCard` (Glass Overhaul)
- **Fondo**: `BlurView` con opacidad del 10-15%.
- **Bordes**: Grosor de `1px` con gradiente blanco translúcido para simular brillo en el cristal.
- **Sombra**: Sombra difusa (`elevation: 0` en Android, `shadowBlur: 20` en iOS) para elevar la tarjeta.

### 2. Pantalla `StoriesScreen` (Hero Experience)
- **Top Hero Section**: Un carrusel horizontal con historias destacadas que usan imágenes IA de gran formato.
- **Gradientes Dinámicos**: El fondo de la pantalla tendrá un gradiente sutil que cambia suavemente según la categoría seleccionada (ej: Naranja suave para Ansiedad, Verde menta para Salud).
- **Categorías con Iconos Premium**: Iconos que se iluminan y escalan ligeramente al ser seleccionados.

### 3. Animaciones "Staggered"
- Entrada de la lista con retrasos progresivos usando `Animated.parallel` y `delay`.
- Efectos de escala al presionar tarjetas.

---

## 🛠️ Detalles Técnicos de Implementación

### Componentes Clave:
- `@react-native-community/blur`: Para efectos de cristal realistas.
- `expo-linear-gradient`: Para fondos dinámicos.
- `react-native-reanimated`: Para transiciones fluidas entre categorías.

### Assets:
- Generación de portadas de categoría usando IA (DALL-E/Midjourney style).
- Unificación de paleta de colores HSL.

---

## 📅 Roadmap

1. **Día 1**: Rediseño de `StoryCard` y `StoriesScreen`.
2. **Día 2**: Aplicar el sistema a `AudiobooksScreen`.
3. **Día 3**: Rediseño de `MeditationCatalogScreen`.
4. **Día 4**: Pulido final y micro-interacciones.

---

## ✅ Éxito del Diseño
El usuario debe sentir que la aplicación es:
1. **Premium**: Merece la suscripción Plus.
2. **Zen**: Transmite paz y orden.
3. **Viva**: Responde al tacto y al movimiento de forma elegante.
