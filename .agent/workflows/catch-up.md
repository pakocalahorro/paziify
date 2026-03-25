---
description: Ponerse al día con el estado del proyecto (Optimizado PCO)
---

# Workflow: Catch Up (Versión Lazy & PCO) 🚀

Este workflow se ejecuta al iniciar una nueva sesión para ponerse al corriente del estado del proyecto sin saturar la ventana de contexto y respetando el Protocolo de Confirmación Obligatoria (PCO).

## Pasos de Inicialización:

1. **Sondeo de Bitácora (Lectura Ligera)**
   - Navegar a `docs/sessions/` y entrar en la subcarpeta del **mes actual** (ej: `03-26`).
   - Leer ÚNICAMENTE la nota de sesión más reciente.
   - Identificar rápidamente: Qué se logró y qué quedó pendiente.

2. **Git Check & Sync** 
   - Ejecuta `git status` y `git log -1` para confirmar en qué commit y rama nos encontramos.

3. **Carga Perezosa de Contexto (Lazy Loading) 🧠**
   - **NO LEAS** las guías de arquitectura enteras (`structure.md`, `audio.md`, etc.) por defecto.
   - Solo cuando el CTO te asigne una tarea específica, usa herramientas de búsqueda (`grep_search` o lee Knowledge Items) sobre la carpeta `docs/guides/` para obtener contexto *exclusivo* de los archivos o módulos que vas a tocar.
   - *Excepción:* Ten presente siempre la regla fundamental: NUNCA hacer commits o modificar archivos sin permiso (PCO Nivel 0).

4. **Health Check Pasivo (No Destructivo) 🛡️**
   - **PROHIBIDO** ejecutar `npm install` o modificar paquetes sin permiso explícito del CTO.
   - Confirma visualmente que no hay errores tipográficos masivos en consola si el CTO te muestra logs, o ejecuta un test de sanidad básico (`npm run test:ojo`) **SOLO SI** el CTO te pide auditar la estabilidad inicial.

5. **Reporte Rápido al CTO**
   - Presenta un informe de 4 líneas indicando:
     - Última sesión leída.
     - Rama actual de Git.
     - "Sistemas preparados bajo reglas PCO. ¿Qué misión abordamos hoy?"