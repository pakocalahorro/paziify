---
description: Guardar el progreso de la sesión actual (Protocolo de Alta Fidelidad)
---

# Workflow: Session End (Protocolo v3.0) 🛡️

Este workflow es el guardián de la base de conocimiento del proyecto. Se ejecuta para garantizar que **ni un solo detalle técnico o visual** se pierda entre versiones.

## Pasos Obligatorios:

### 1. Auditoría de Fidelidad Total (INVESTIGACIÓN CIEGA) 🔍
   - **No confíes en tu memoria**: El historial de chat puede ser muy largo. Realiza una búsqueda obligatoria de términos clave de la sesión.
   - **Análisis de Registros**: Si es posible, revisa el historial de archivos modificados (`git status` o herramientas de lectura de logs) para identificar CADA archivo que ha sido tocado hoy.
   - **Checklist de "Reliquias"**: Identifica:
     - **Métricas Visuales**: Tiempos (ms), opacidades, pesos de fuente, colores hex, letter-spacing.
     - **Lógica de Flujo**: Condiciones de navegación (`if/else`), triggers diarios, resets de estado.
     - **Identidad Corporativa**: ¿Se unificaron pantallas? ¿Se cambiaron logos o cabeceras?
     - **Bug Fixes Específicos**: Registrar la causa raíz y la solución técnica exacta.
   - **Cotejo de Artefactos**: Leer `task.md` y `walkthrough.md`. Si una tarea está marcada como `[x]`, DEBE aparecer con detalle técnico en los documentos finales.

### 2. Creación de la Nota de Sesión (Acta de Entrega) 📝
   - Archivo: `docs/sessions/YYYY-MM-DD_descripcion.md`
   - **Requisito**: Dividir por "Hitos Críticos". Cada hito debe explicar el **POR QUÉ** del cambio, no solo el qué.
   - **Double-Check**: Coteja la nota contra tus apuntes del paso 1.

### 3. Revisar linea a linea y actualizar documentos para que reflejen la realidad del proyecto (OBLIGATORIO) 🌊
   Para cada cambio identificado, **ACTUALIZA** en este orden:
   1. **`walkthrough.md`**: La radiografía técnica 1:1. Incluye `render_diffs` de los puntos calientes.
   2. **`README.md`**: Si hay nueva versión o features clave.
   3. **`docs/guides/structure.md`**: **[NUEVO]** Si se añadieron/modificaron pantallas, componentes, servicios o navegación.
   4. **`docs/guides/user_manual.md`**: Si cambia el flujo de usuario o la interfaz.
   5. **`docs/guides/designs.md`**: Si hay nuevos componentes o cambios estéticos.
   6. **`docs/guides/database.md`**: Si hubo cambios en Supabase o lógica de datos.

### 3.5. Verificación Mecánica de Guías (ANTI-OLVIDO) 🔒
   **NO confíes en tu memoria. Ejecuta estos checks OBLIGATORIAMENTE:**

   1. **Archivos nuevos vs structure.md**: Ejecutar `git diff --name-only` y para CADA archivo nuevo/modificado en `src/screens/`, `src/components/`, `src/services/`, `src/constants/`, `src/hooks/`, `src/utils/` o `src/data/`, verificar que aparece documentado en `structure.md`. Si no → añadirlo.

   2. **Versión unificada**: Ejecutar grep de versión en las 5 guías:
      ```powershell
      Select-String -Path "docs/guides/*.md" -Pattern "v[0-9]+\.[0-9]+\.[0-9]+"
      ```
      → Todas deben coincidir con la versión de `package.json`. Si alguna no coincide → actualizarla.

   3. **Hooks y Utils reales**: Cruzar los archivos existentes en `src/hooks/` y `src/utils/` contra lo documentado en `structure.md`. Eliminar fantasmas, añadir lo nuevo.

   4. **Tipos nuevos**: Si `src/types/index.ts` fue modificado durante la sesión, verificar que `structure.md` refleja los tipos actuales.

   5. **Fecha de revisión**: Actualizar la línea `*Última revisión:*` al final de CADA guía que se haya tocado.

### 4. Reconciliación Cruzada (Garantía CEO) ✅
   - Hazte la pregunta: **"¿Si el CEO revisa esto con su papel y boli, encontrará todo lo que hemos hablado hoy?"**.
   - Si detectas vacíos, vuelve al paso 1. No cierres la sesión hasta que el Walkthrough sea indistinguible del historial real.

### 4.5. Confirmación Obligatoria (STOP) 🛑
   - **Antes de realizar cualquier commit o tag**, debes usar `notify_user` para presentar el resumen final de cambios.
   - **ESPERA** explícitamente a que el usuario diga "Sí", "Procede" o similar. No asumas permiso tácito.

### 5. Consolidación de Git 💾
   - **Versión**: Actualizar `package.json` (SemVer).
   - **Commit**: Mensaje profesional con los hitos resumidos.
   - **Tagging**: Crear `git tag vX.X.X` coincidente. Sin tag de versión, el ecosistema de documentación se considera desfasado.

---
*Este protocolo es innegociable para asegurar la continuidad del proyecto Paziify.*