---
description: Guardar el progreso de la sesión actual (Protocolo de Alta Fidelidad - PCO)
---

# Workflow: Session End (Protocolo v4.0 - PCO Activo) 🛡️

Este workflow es el guardián de la base de conocimiento del proyecto. Se ejecuta bajo el **Protocolo de Confirmación Obligatoria (PCO)**.

> [!CAUTION]
> **REGLA DE ORO (PCO)**: El agente NO PUEDE editar archivos ni ejecutar comandos de Git hasta que el CEO/CTO no apruebe explícitamente el paso 2 (Propuesta de Cierre).

## FASE 1: ANÁLISIS Y PLANIFICACIÓN (NO DESTRUCTIVA)

### 1. Auditoría de Fidelidad Total (INVESTIGACIÓN CIEGA) 🔍
- Realiza una búsqueda obligatoria de términos clave de la sesión en el historial de chat o herramientas.
- Revisa el historial de archivos modificados (`git status`) para identificar CADA archivo que ha sido tocado hoy.
- Lee `task.md` y `walkthrough.md`. Si una tarea está marcada como `[x]`, DEBE aparecer con detalle técnico en los documentos finales.

### 2. Generación de Borrador y HARD STOP 🛑
1. **Redacta en memoria** (o en un bloque de código markdown de respuesta) el contenido para la Nota de Sesión (`docs/sessions/YYYY-MM-DD_descripcion.md`). Divide por "Hitos Críticos" y explica el POR QUÉ del cambio.
2. **Propuesta de Cambios en Documentación:** Enumera textualmente qué otras guías requieren cambios debido a la sesión (`structure.md`, `user_manual.md`, `designs.md`, `database.md`, `audio.md`) detallando exactamente *qué nueva sección o regla vas a añadir a cada una*.
   *(Nota: No debes buscar ni actualizar números de versión tipo v2.x.x dentro de estos archivos. La versión la dicta el Tag de Git).*
3. **HARD STOP (`notify_user`)**: Usa la herramienta `notify_user` presentando al CTO:
   - El resumen del paso 1 (Archivos modificados detectados).
   - El texto literal que propones para la nueva nota de sesión.
   - El listado de guías adicionales que propones actualizar y qué vas a poner en ellas.
4. Finaliza el mensaje de `notify_user` preguntando: **"¿Me das permiso para proceder con esta ejecución, Sr. CTO?"**.
5. **ESPERA**. Si el usuario responde con dudas, acláralas. **SÓLO CONTINÚA A LA FASE 2 SI DICE EXPLÍCITAMENTE "SÍ", "PROCEDE", "ADELANTE".**

---

## FASE 2: EJECUCIÓN (SÓLO TRAS APROBACIÓN)

### 3. Ejecución de Tareas de Documentación 📝
   Una vez aprobado, ejecuta con `write_to_file` o `replace_file_content`:
   1. Crea la nueva nota de sesión en `docs/sessions/`.
   2. Actualiza CADA archivo guía acordado en el Paso 2 con la nueva información de lógica o diseño.
   3. Añade la entrada correspondiente al `walkthrough.md` con `render_diffs` si aplicara.

### 4. Consolidación Final y Git 💾
   1. Actualiza `package.json` a la nueva versión (SemVer) definida.
   2. **Garantía Zero Defects**: Ejecutar `npm run test:ojo` (y `update` si aplica) para asegurar que el blindaje permitirá el commit.
   3. Ejecuta `git add` y el commit profesional con los hitos resumidos.
   4. Ejecuta `git tag vX.X.X` coincidente. Sin tag de versión, el ecosistema de documentación se considera desfasado.

---
*Este protocolo bloquea la iniciativa destructiva y exige revisión humana.*