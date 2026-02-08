# 🎓 Academia Paziify: Exámenes y Certificaciones 🏆

Sí, habrá exámenes, pero **no pueden ser aburridos**.
En una app de bienestar, un examen no es una prueba de estrés, es una **Celebración del Conocimiento**.

---

## 1. La Estrategia "Micro-Dosis" vs "Examen Final"

### A. Quiz Rápido (Opcional por Lección) ⚡
Al final de cada audio/lección, mostramos **1 sola pregunta** sencilla.
*   **Objetivo**: Verificar atención y dar un pequeño chute de dopamina.
*   **Formato**: Tarjeta simple. "Verdadero o Falso".
*   **Feedback Inmediato**: "¡Correcto! Entendiste el concepto de la Amígdala."

### B. El Examen Final (Al terminar el Curso) 🎓
Al completar la última lección, se desbloquea el **"Desafío Final"**.
*   **Consta de**: 5-10 preguntas de selección múltiple.
*   **Dificultad**: Media-Baja. Queremos que aprueben, no que se frustren.
*   **Requisito**: Acertar el 80% para obtener el certificado.

---

## 2. La Recompensa: Gamificación Real 🏅

Aquí es donde convertimos el "Examen" en un activo de retención.

### 📜 El "Diploma Digital"
Al aprobar el examen, generamos una pantalla de "Graduación":
*   Efecto de Confeti (Lottie Animation).
*   Tarjeta Dorada brillante con:
    *   Nombre del Usuario.
    *   Curso ("Maestría en Ansiedad").
    *   Fecha.
*   **Botón de Compartir**: Diseñado para Instagram Stories. *"¡Acabo de certificarme en Gestión de Estrés con Paziify!"*. (Publicidad gratis).

### 🛡️ Insignias en el Perfil
El examen desbloquea un **Badge Permanente** en la sección de estadísticas del usuario (ej. una medalla de "Guerrero Estoico" o "Maestro Zen").

---

## 3. Implementación Técnica (Coste Bajo)

No necesitamos un motor de exámenes complejo.

**Base de Datos (Supabase - Nueva tabla `course_quizzes`)**:
```sql
CREATE TABLE course_quizzes (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  questions JSONB -- Array de preguntas: [{q: "...", options: ["A", "B"], correct: 0}]
);
```

**UI**:
Reutilizamos el componente de tarjetas (`SessionCard`) para mostrar las preguntas una a una.

---

## ✅ Conclusión
Los exámenes son **críticos** para darle valor percibido al curso. Transforman "escuchar unos audios" en "completar una formación".

**Propuesta**:
Incluir un **Examen Final de 5 preguntas** en nuestro Curso Piloto de Ansiedad.
