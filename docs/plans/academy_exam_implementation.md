# 🎓 Plan de Implementación: Examen Final Academy

## Objetivo
Implementar el flujo de "Examen Final" para el curso "Domina tu Ansiedad". El examen se desbloquea solo cuando todas las lecciones están completadas.

## 🏗️ Cambios Propuestos

### 1. Datos del Examen (`src/data/quizData.ts`)
Crear una nueva estructura de datos para manejar preguntas y respuestas.
```typescript
export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

export interface CourseQuiz {
    courseId: string;
    title: string;
    questions: QuizQuestion[];
    passingScore: number; // e.g., 4 pour 5 questions
}
```

### 2. Nueva Pantalla: `QuizScreen.tsx`
*   **Estado**: `currentQuestionIndex`, `score`, `showResult`.
*   **UI**:
    *   Barra de progreso.
    *   Tarjeta de pregunta grande.
    *   Opciones seleccionables.
    *   **Feedback inmediato**: Color verde/rojo al seleccionar.
*   **Finalización**:
    *   Si aprueba (>80%): Muestra Certificado (Lottie Confetti + Tarjeta Dorada).
    *   Si falla: Botón "Reintentar".

### 3. Integración en `CBTAcademyScreen`
*   Añadir el item "🏆 EXAMEN FINAL" al final de la lista de lecciones del módulo.
*   **Lógica de Bloqueo**:
    *   `isLocked = completedLessons.length < totalLessons`.
    *   Visualmente deshabilitado y con candado si está bloqueado.

### 4. Certificados (`userState`)
*   Actualizar `userState` para persistir `completedCourses` o `earnedCertificates`.

---

## 🧪 Plan de Pruebas
1.  **Verificar Bloqueo**:
    *   Entrar en Academy con usuario nuevo.
    *   Confirmar que el Examen tiene candado.
2.  **Verificar Desbloqueo**:
    *   Marcar las 5 lecciones de "Ansiedad" como completadas.
    *   Confirmar que el Examen se activa.
3.  **Flujo de Examen**:
    *   Responder preguntas incorrectamente -> Pantalla de fallo.
    *   Responder correctamente -> Pantalla de Éxito + Confeti.
