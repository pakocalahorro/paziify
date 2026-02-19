# Estrategia de Gamificación y Bio-Feedback (Fase 2)

## 1. Visión: "El Espejo del Alma"
El Cardio Scan no es un examen médico, es un "espejo" del estado actual del sistema nervioso. El objetivo no es juzgar (bien/mal), sino **validar y redirigir**.

### Filosofía de Diagnóstico Positivo
Usaremos **Arquetipos de Energía** en lugar de términos clínicos para el diagnóstico.

| Rango HRV/BPM | Diagnóstico Técnico | Arquetipo (Feedback) | Mensaje Motivador |
| :--- | :--- | :--- | :--- |
| **Bajo HRV** | Sobrecarga / Estrés | **Guerrero en Reposo** | "Tu energía ha estado protegiéndote. Es momento de bajar la guardia y recargar." |
| **Bajo BPM** | Agotamiento / Fatiga | **Marea Calma** | "El mar se retira para volver con fuerza. Tu cuerpo pide nutrición y suavidad hoy." |
| **Alto HRV** | Equilibrio / Flow | **Sol Naciente** | "Tu luz interior está brillante y estable. Es el momento perfecto para expandirte." |

### 🔒 Protocolo de Escaneo Inmutable
**IMPORTANTE**: El mecanismo de escaneo actual (CardioScanScreen v2, calibración RGB, 3 fases) **NO SE TOCA**.
*   El flujo nuevo comienza **EXCLUSIVAMENTE** en la pantalla de Resultados.
*   Hasta que no se muestra el resultado final, la experiencia es idéntica a la actual.

---

## 2. Gamificación Terapéutica (Los 2 Juegos)
El usuario "juega" para transitar de su estado actual al estado deseado antes de entrar a las sesiones.

### Juego A: "Nebula Breath" (Para Sanar/Calmar)
*Diseñado para usuarios con Arquetipo 'Guerrero en Reposo' (Sobrecarga).*
*   **Mecánica**: Un orbe de partículas (Skia) que responde a la respiración (simulada o guiada).
*   **Objetivo**: Sincronizar toques suaves con la expansión/contracción del orbe para "limpiar" la bruma de la pantalla.
*   **Metafora**: Limpiar el ruido mental.
*   **Tech**: Reanimated + Skia Particles.
*   **Duración**: 30-45 segundos.

### Juego B: "Orb Flow" (Para Crecer/Activar)
*Diseñado para usuarios con Arquetipo 'Sol Naciente' o 'Marea Calma' (para activar).*
*   **Mecánica**: Un "runner" infinito vertical simple donde el usuario guía una luz evitando obstáculos suaves o recolectando "sparks" de energía.
*   **Objetivo**: Mantener el "flow" y el ritmo.
*   **Tech**: Reanimated (Layout Animations) + Haptics rítmicos.
*   **Duración**: 45-60 segundos.

---

## 3. Arquitectura de Datos (Zero Egress & Privacidad)

### ¿Subir a Supabase? **NO (Por defecto)**
Siguiendo la filosofía de privacidad de Paziify, los datos biométricos crudos (rPPG arrays, milisegundos de latidos) **NUNCA** deben salir del dispositivo.

### Estrategia Híbrida
1.  **Almacenamiento Local (Source of Truth)**
    *   `AsyncStorage` (o SQLite futuro) guarda el historial completo: `{ date, bpm, hrv, raw_score, diagnosis }`.
    *   Permite gráficas detalladas en el Perfil sin latencia ni coste de servidor.

2.  **Sincronización Mínima (Para Gamificación Social/Perfil Nube)**
    *   Solo subimos un **"Daily Check-in"** ligero a una nueva tabla `user_daily_status` (o campo JSON en `profiles`).
    *   Payload: `{ mood: 'healing', energy_level: 70, timestamp: NOW }`.
    *   *Sin datos médicos*, solo el "estado" para personalizar la Home en otros dispositivos.

### Integración en Perfil
*   **Nueva Sección**: "Tu Ritmo Vital".
*   **Gráfica**: Curva de HRV de los últimos 7 días (leída de local).
*   **Correlación**: Superponer "Días de Meditación" vs "Nivel de Energía" para mostrar al usuario cómo la práctica mejora su biología.

---

## 4. Plan de Implementación

### Paso 1: Refinar Diagnóstico (UX)
*   Modificar `CardioResultScreen` para usar los nuevos Arquetipos y Copies.
*   Mejorar las tarjetas de "Sanar" vs "Crecer" para que sean la entrada a los juegos.

### Paso 2: Infraestructura de Datos
*   Crear `CardioService.ts` (Local Storage).
*   Integrar lectura de historial en `ProfileScreen`.

### Paso 3: Desarrollo de Juegos (Mini-Games)
*   Crear componentes aislados `NebulaBreathGame` y `OrbFlowGame`.
*   Implementar lógica de "Game Loop" sencilla (Start -> Play -> Win/End -> Navigate Home).

### Paso 4: Cierre del Ciclo
*   Asegurar que al terminar el juego, la Home (`HomeScreen`) reciba el parámetro `mode` ('healing'/'growth') y filtre el contenido automáticamente (ya soportado por `updateUserState`).

---

## 5. Ventaja Competitiva (El "Por qué Paziify")

¿Por qué esto nos diferencia de **Calm/Headspace** (Líderes de Contenido) y **Welltory/Oura** (Líderes de Datos)?

| Característica | 🧘‍♂️ Calm / Insight Timer | 📊 Welltory / Apps Salud | 💎 **Paziify (Nuestra Propuesta)** |
| :--- | :--- | :--- | :--- |
| **Input** | Subjetivo ("¿Cómo te sientes?") | Objetivo (Datos Crudos) | **Híbrido** (Biometría Real + Contexto Emocional) |
| **Diagnóstico** | Nulo o Básico | Clínico / Frío ("Estás estresado") | **Positivo / Arquetípico** ("Tu cuerpo te protege") |
| **Acción Inmediata** | Buscar una sesión de 10 min | Consejos de texto ("Descansa hoy") | **Micro-Dosis (Juego 60s)** para cambiar tu estado *ya* |
| **Privacidad** | Nube (Tracking de uso) | Nube (Tus datos de salud viajan) | **Zero Egress** (Tu corazón se queda en tu móvil) |

### El "Paziify Loop" Único
La mayoría de apps son lineales. Nosotros creamos un bucle virtuoso:
1.  **👀 Ver**: Escaneo biométrico preciso (v2).
2.  **🧠 Entender**: Diagnóstico sin culpa (Arquetipos).
3.  **⚡ Cambiar**: Juego terapéutico para *shift* fisiológico inmediato.
4.  **🧘‍♂️ Profundizar**: Sesión de meditación personalizada según el resultado.

### 🚫 Decisión Estratégica: No "Modo Arcade"
Hemos decidido deliberadamente **NO** incluir una sección de "Juegos" en la biblioteca por ahora.
*   **Razón**: Paziify es una herramienta de transformación, no de entretenimiento casual.
*   **Exclusividad**: Los juegos son "medicina" recetada post-escáner. Su valor reside en ser una intervención puntual y necesaria, no un pasatiempo.
*   **Futuro**: Si la demanda es alta, se evaluará un "Laboratorio Zen", pero por ahora mantenemos el foco en el *loop* terapéutico.

**Conclusión**: No solo les decimos que están estresados (como la competencia), les damos la herramienta lúdica para cambiarlo *en menos de 1 minuto* antes de siquiera empezar a meditar.
