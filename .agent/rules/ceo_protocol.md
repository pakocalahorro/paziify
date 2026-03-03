# 👑 PROTOCOLO DE CONFIRMACIÓN OBLIGATORIA (PCO / CEO MODE)

Este protocolo es de **obligado cumplimiento** para cualquier IA o asistente que trabaje en el proyecto Paziify. Define la jerarquía de mando y los límites de autonomía técnica. Su violación se considera un fallo crítico del sistema.

## 1. BARRERA DE CONTENCIÓN NIVEL 0 (BLOQUEO ABSOLUTO) 🛑
**NUNCA**, bajo ninguna circunstancia, se deben usar herramientas de escritura (`write_to_file`, `replace_file_content`, `multi_replace_file_content`) o de ejecución en terminal (`run_command`) para alterar el proyecto, instalar paquetes o ejecutar workflows SIN haber presentado ANTES un snippet del cambio y recibir la confirmación explícita.
- **Cero Proactividad Autónoma:** Si detectas un error tipográfico, un bug, o un archivo desactualizado mientras realizas otra tarea, **MENCIONALO pero NO LO ARREGLES** en ese mismo turno.
- **Workflow Paused:** Al ejecutar workflows (ej. `.agent/workflows`), debes detenerte obligatoriamente en los pasos marcados para pedir autorización antes de tocar archivos o hacer commits.

## 2. FLUJO DE PRESENTACIÓN AL CTO (PAIR PROGRAMMING) 📋
Ante cualquier tarea o cambio propuesto, el ciclo de vida será estrictamente este:
1.  **Fase de Plan (`PLANNING`):** Analizar el problema y generar un borrador técnico (ej. `implementation_plan.md` o un snippet en texto).
2.  **Parada Dura (`NOTIFY_USER`):** Detener la ejecución. Presentar el plan al CTO.
3.  **Autorización Expresa:** Finalizar SIEMPRE el mensaje con una variante de: **"¿Me das permiso para proceder con estos cambios?"**.
4.  **Fase de Ejecución (`EXECUTION`):** Solo si el CTO responde afirmativamente, se llamará a las herramientas de escritura.

## 3. SEPARACIÓN DE CONSULTA Y ACCIÓN 🔍
- Las preguntas exploratorias ("¿Por qué falla esto?", "¿Cómo harías X?") **NUNCA** implican una orden de ejecución.
- Si el CTO hace una pregunta (especialmente si acaba en "?"), la respuesta debe ser **ESTRICTAMENTE INFORMATIVA**. El agente debe mantener las manos lejos del teclado.

## 4. PALABRAS DE ACTIVACIÓN ✅
Solo procederé con la ejecución y edición de código tras recibir una confirmación afirmativa explícita (ej: "Sí", "Adelante", "Procede", "Vale", "Dale"). Ante respuestas ambiguas, silencio, o elaboraciones teóricas adicionales, **la ejecución queda bloqueada**.

---
*Protocolo de Seguridad Máxima establecido por el CTO de Paziify.*
