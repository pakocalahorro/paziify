# 🫀 Cardio Scan & Bio-Feedback Strategy - Paziify v3.0

## 1. Análisis de Mercado y Competencia

### Lo que hacen los líderes
*   **Welltory**: Líder en medición de HRV (Variabilidad de la Frecuencia Cardíaca) mediante cámara. Se enfoca en "Estrés vs Energía".
*   **Google Fit / Apple Health**: Medición básica de BPM (Latidos por minuto) para registro histórico.
*   **Elite HRV**: Enfoque deportivo/técnico.

### La Oportunidad de Paziify (Diferenciación)
Mientras la competencia te da *datos fríos* ("Tu estrés es alto"), Paziify te dará *soluciones inmediatas* ("Tu energía es baja, vamos a elevarla con esta respiración de fuego").
**No somos un monitor médico, somos un espejo del alma.**

---

## 2. Estrategia de Datos: ¿Qué podemos medir?

Usando la tecnología **PPG (Fotopletismografía)** con la cámara y flash del móvil:

### ✅ Datos Viables y Fiables
1.  **BPM (Heart Rate)**: Frecuencia cardíaca promedio.
2.  **Coherencia Cardíaca (R-R Intervals / SDNN)**: Ritmo de latidos. Si es caótico = Estrés / Ansiedad. Si es suave = Calma. (Este es nuestro "Gold Value").

### ⚠️ Datos Experimentales / Poco Fiables (Descartados por ahora)
*   **Oxígeno (SpO2)**: Requiere calibración de luz roja/infrarroja que la mayoría de móviles no tienen. Datos engañosos.
*   **Tensión Arterial**: Matemáticamente imposible de deducir solo con óptica sin calibración previa con tensiómetro.

### 🔮 La "Métrica Paziify" (Nuestra Propuesta)
En lugar de abrumar con términos médicos, crearemos el **"Índice de Resonancia"**:
*   Combina BPM + Estabilidad del Ritmo (SDNN).
*   **El Diagnóstico Inteligente ("Smart Compass")**:
    *   🔴 **Caos** (Estrés alto) -> **Recomendación Fuerte: SANAR**.
    *   🟡 **Drenado** (Energía baja) -> **Recomendación Fuerte: CRECER (Energía)**.
    *   🟢 **Fluido** (Equilibrado) -> **Libre Elección** (Sugerencia: *Mentes Maestras* o *Profundizar*).

---

## 3. Experiencia de Usuario (UX) - El Ritual del Escaneo

1.  **Acceso Místico**: Botón central (Orb) -> Opción "Escanear Aura/Bio".
2.  **Interacción Táctil**:
    *   El usuario pone el dedo sobre la cámara.
    *   La linterna se enciende (Torch on).
    *   **Feedback Visual**: El Orbe central de la pantalla se vuelve rojo y "late" al ritmo real de tu corazón detectado. **(Wow Effect)**.
3.  **Resultado & Acción (El "Nudge" Recomendado)**:
    *   **Filosofía**: Mantenemos la libertad (Sanar/Crecer) pero **iluminamos el camino**.
    *   **Pantalla de Resultado**: Reutiliza el diseño dual del Santuario.
    *   **Header Diagnóstico**: "Tu Resonancia: Caos (Estrés Alto)".
    *   **La Sugerencia Visual**:
        *   Si se recomienda **SANAR**: La tarjeta "Sanar" brilla/late y tiene un borde destacado. La tarjeta "Crecer" se mantiene visible pero con opacidad reducida (dimmed).
        *   **Texto de Apoyo**: "Según tu escaneo, tu cuerpo pide calma."
    *   **Interacción**: El usuario puede ignorar la sugerencia y pulsar la otra opción si lo desea, pero la interfaz le empuja suavemente a lo correcto.

---

## 4. El Ciclo de Feedback (Cierre del Círculo)

### A. Estadísticas (Largo Plazo)
*   **Dónde**: Perfil -> Gráficas Semanales.
*   **Qué**: "Evolución de tu Resonancia".
*   **Valor**: Ver cómo Paziify reduce tus episodios de "Caos" a lo largo del mes.

### B. Escaneo Post-Sesión (Validación Inmediata)
*   **El Dilema**: Pedir un escaneo después de meditar puede "romper el Zen" (luz flash, tecnología).
*   **La Solución Inteligente**:
    *   **Prohibido en Sueño**: Nunca pedir escaneo tras una sesión de dormir (la luz despierta).
    *   **Recomendado en Rendimiento/SOS**: Al terminar una sesión de "Calma SOS", mostrar un botón sutil: *"¿Verificar efecto?"*.
    *   **El Resultado Comparativo**: Mostrar un "Antes/Después" visual. "Entraste en Caos 🔴 -> Sales en Fluido 🟢". **(Validación definitiva del producto)**.

---

## 5. Plan de Implementación Técnica

### Fase 1: Motor de Escaneo (Core)
*   **Librería**: `react-native-vision-camera` (ya instalada en v4.7.3).
*   **Procesamiento**: Frame Processor (Worklet) que detecta el cambio de color rojo promedio en el centro de la imagen a 30-60fps.
*   **Algoritmo**: Implementación de filtro paso banda y detección de picos en JS/Worklet para calcular intervalo R-R en tiempo real.

### Fase 2: Integración UI (`CustomTabBar.tsx` & `CardioScanScreen.tsx`)
*   Sustituir el placeholder "PRÓXIMAMENTE" por la navegación a la nueva pantalla de escaneo.
*   Conectar el `frameProcessor` con una animación de `react-native-reanimated` para que la UI pulse en tiempo real.

### Fase 3: Lógica de Negocio
*   Interpretar los intervalos R-R para determinar el "Estado Paziify".
*   Vincular con el `ContentService` para recomendar sesiones por ID de categoría.

## 5. Hoja de Ruta (Roadmap)
1.  **Prototipo (Hoy)**: Lograr que el botón central active la cámara, encienda el flash y muestre la pulsación visual (aunque el dato sea simulado o crudo).
2.  **Refinamiento**: Limpiar la señal (filtros de ruido) y calcular HRV básica.
3.  **Producto**: Diseño de la pantalla de resultados y recomendación de contenido.

---

¿Cuál es tu feedback sobre este enfoque centrado en la **"Resonancia" y la Acción Inmediata** en lugar de solo datos médicos?
