---
description: Guardar el progreso de la sesión actual (Protocolo de Alta Fidelidad)
---

# Workflow: Session End (Protocolo v3.0) 🛡️

Este workflow es el guardián de la base de conocimiento del proyecto. Se ejecuta para garantizar que **ni un solo detalle técnico o visual** se pierda entre versiones.

## Pasos Obligatorios:

### 1. Auditoría de Fidelidad Total (INVESTIGACIÓN PROFUNDA) 🔍
   - **Línea a Línea**: Leer toda la conversación del chat. Identificar:
     - **Métricas Visuales**: Tiempos (ms), opacidades, pesos de fuente, colores hex, letter-spacing.
     - **Lógica de Flujo**: Condiciones de navegación (`if/else`), triggers diarios, resets de estado.
     - **Refinamientos Estéticos**: Cambios en "feeling", glassmorphism, efectos de partículas.
     - **Bug Fixes Específicos**: Registrar la causa raíz y la solución técnica exacta (no solo el título).
   - **Cotejo de Artefactos**: Leer `task.md` y `walkthrough.md` previos. Cada `[x]` debe tener una explicación técnica en la nota de sesión.

### 2. Creación de la Nota de Sesión (Registro Histórico) 📝
   - Archivo: `docs/sessions/YYYY-MM-DD_descripcion.md`
   - **Requisito**: Si hay cambios masivos, dividir por "Hitos Críticos" (ej: Hito 1: Flujo Espiritual, Hito 2: Cloud Sync).
   - **Detalle Técnico**: Incluir snippets de lógica crítica o configuraciones de Supabase/Storage si fueron modificadas.

### 3. Sincronización en Cascada de Documentos de Ayuda (OBLIGATORIO) 🌊
   Para cada cambio identificado en el paso 1, **DEBES** actualizar el manual correspondiente:
   - **`walkthrough.md`**: El "Documento Maestro". Debe ser una radiografía técnica 1:1 de los hitos de hoy.
   - **`README.md`**: Actualizar Versión (vX.X.X), Resumen de novedades y Roadmap.
   - **`docs/guides/user_manual.md`**: Actualizar capturas de pasos, flujos de usuario y advertencias de uso.
   - **`docs/guides/database.md`**: Detallar nuevas columnas, triggers, RLS y cambios en diccionarios JSONB.
   - **`docs/guides/designs.md`**: Registrar nuevos componentes Skia/Reanimated, principios estéticos y paletas de color.
   - **`docs/guides/audio.md`**: Actualizar parámetros TTS, motor de mezcla o auditoría de catálogo.

### 4. Reconciliación Cruzada (Double Check) ✅
   - Pregúntate: "¿Si pierdo el chat ahora mismo, podría reconstruir exactamente el comportamiento de la app leyendo estos documentos?"
   - Si la respuesta es NO, vuelve al paso 3.
   - **CEO Audit Vision**: Verificar que el "alma" del cambio (ej: el motivo espiritual de una pausa de 3.5s) esté documentado, no solo la variable `TIMEOUT = 3500`.

### 5. Consolidación de Git 💾
   - **Versión**: Actualizar `package.json` coherente con la magnitud de los cambios.
   - **Commit**: Mensaje descriptivo y profesional.
   - **Tagging (VITAL)**: Crear `git tag vX.X.X` coincidente. Sin tag, la sesión no se considera cerrada técnicamente.

---
*Este protocolo es innegociable para asegurar la continuidad del proyecto Paziify.*