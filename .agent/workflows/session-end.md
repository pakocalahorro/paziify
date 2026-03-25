---
description: Guardar el progreso de la sesión actual (Protocolo PCO Optimizado)
---

# Workflow: Session End (Protocolo v4.1 - PCO Activo) 🛡️

El guardián de la base de conocimiento del proyecto. Se ejecuta bajo el **Protocolo de Confirmación Obligatoria (PCO)**.

> [!CAUTION]
> **REGLA DE ORO (PCO)**: El agente NO PUEDE editar archivos ni ejecutar comandos de Git hasta que el CEO/CTO no apruebe explícitamente el paso 2 (Propuesta de Cierre).

## FASE 1: ANÁLISIS Y PLANIFICACIÓN (NO DESTRUCTIVA)

### 1. Auditoría de Fidelidad Total 🔍
- Revisa el historial de archivos modificados (`git status`) para identificar CADA archivo que ha sido tocado hoy.
- Lee `task.md` y `walkthrough.md`.

### 2. Generación de Borrador y HARD STOP 🛑
1. **Redacta en memoria** el contenido para la Nota de Sesión.  
   **REGLA DE EFICIENCIA**: Si el archivo `walkthrough.md` ya ha sido completado con gran detalle técnico durante el sprint, **USA ESE MISMO CONTENIDO ÍNTEGRO** para crear la Nota de Sesión. No lo resumas.
2. **Excepciones Documentales (Carga Ligera):** Evalúa si *realmente* alguna guía maestra (`structure.md`, `user_manual.md`, `database.md`, etc.) quedó absolutamente desfasada. Si los cambios son menores u ordinarios, **NO PROPONGAS** actualizar las guías maestras para evitar fatiga administrativa y "Burnout".
3. **HARD STOP (`notify_user`)**: Usa `notify_user` presentando al CTO:
   - Archivos modificados detectados.
   - El texto que usarás para la nota de sesión (`docs/sessions/MM-YY/YYYY-MM-DD_descripcion.md`).
   - *Solo si aplica rigurosamente*, qué guías maestras aisladas se deben actualizar.
4. Finaliza preguntando de forma clara: **"¿Me das permiso para proceder con esta ejecución en disco y Git, Sr. CTO?"**.
5. **ESPERA LA CONFIRMACIÓN**.

---

## FASE 2: EJECUCIÓN (SÓLO TRAS APROBACIÓN)

### 3. Ejecución en Disco 📝
   Una vez aprobado, ejecuta:
   1. Crea la **nota de sesión** en la subcarpeta del **mes actual y año** dentro de `docs/sessions/` (ej: `docs/sessions/03-26/YYYY-MM-DD_...`).
   2. Actualiza tu `walkthrough.md` o guías maestras *solo* si el CTO aprobó esa carga extra en el Paso 2.

### 4. Consolidación Final y Push ☁️
   1. Actualiza `package.json` a la nueva versión (SemVer) si se acordó subir de versión en la fase previa.
   2. Ejecuta `git add .` y el `git commit -m="..."` correspondiente.
   3. Ejecuta `git tag vX.X.X` coincidente (solo si hubo salto de versión).
   4. Ejecuta `git push` y (de aplicar) `git push --tags`.
   5. Notifica al CTO que el código y el conocimiento están asegurados en Origin.