# 🎨 Plan de Refactorización: UI Academia

## Objetivo
Transformar la interfaz de la Academia para que sea idéntica a la de Audiolibros:
1.  **Pantalla Principal (Catálogo)**: Carrusel/Lista de Cursos (Módulos) con diseño visual rico.
2.  **Pantalla de Detalle (Curso)**: Lista de lecciones (lo que antes era la pantalla principal).
3.  **Tarjetas de Curso**: Diseño similar a `AudiobookCard` pero con botón "ENTRAR".

## 🏗️ Cambios Propuestos

### 1. Nuevos Componentes
*   **`CourseCard.tsx`**:
    *   Basado en `AudiobookCard.tsx`.
    *   Muestra Título, Descripción breve, Icono/Imagen.
    *   Botón principal: "ENTRAR" (Navega a detalle).
    *   Indicador de progreso si es posible.

### 2. Renombrar y Crear Pantallas
*   **`AcademyCatalogScreen.tsx`** (Nueva `CBTAcademyScreen`):
    *   Clon de `AudiobooksScreen`.
    *   Usa `ACADEMY_MODULES` como fuente de datos.
    *   Elimina filtros complejos si son pocos cursos, o los adapta.
    *   Navega a `AcademyCourseDetail`.
*   **`AcademyCourseDetailScreen.tsx`** (Refactorización):
    *   Contiene la lógica actual de listar lecciones.
    *   Filtra `ACADEMY_LESSONS` por `moduleId` recibido en params.
    *   Muestra el header del módulo y sus lecciones.

### 3. Modificaciones de Navegación (`types/index.ts`, `AppNavigator.tsx`)
*   Añadir `ACADEMY_COURSE_DETAIL` a los tipos.
*   Registrar la nueva pantalla en el Stack.

### 4. Datos (`academyData.ts`)
*   Añadir propiedades visuales a `ACADEMY_MODULES` si faltan (ej. `gradientColors`, `image` si queremos usar imágenes reales o manter `icon`). Se usará un gradiente por defecto si no hay imagen.

---

## 🧪 Plan de Verificación
1.  **Navegación**:
    *   Home -> Academia (debe mostrar Carrusel de Cursos).
    *   Click en "Fundamentos TCC" -> Debe ir a lista de lecciones.
    *   Click en "Atrás" -> Vuelve al carrusel.
2.  **Visual**:
    *   Verificar que el fondo y tema coinciden con Audiolibros.
    *   Verificar animaciones de entrada.
