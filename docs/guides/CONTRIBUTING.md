# 🛑 PROTOCOLO DE TRABAJO PAZIIFY: ZERO DEFECTS (PLATINO)

¡Bienvenido! Para mantener Paziify como una App de clase mundial, seguimos este protocolo obligatorio e innegociable. **Cualquier incumplimiento será detectado y bloqueado automáticamente por los robots.**

## 1. 🧬 Protocolo JIT (Just-In-Time) - BLOQUEO FORZOSO
**Si modificas el código de cualquier pantalla (`src/screens/`), el sistema BLOQUEARÁ tu commit si no has cumplido lo siguiente:**
1. **Registro Inicial**: Ejecutar `npm run test:ojo` antes de tocar la pantalla.
2. **Edición Quirúrgica**: Realizar los cambios de código.
3. **Validación y Acta**: Ejecutar `npm run test:ojo` para validar. Si el cambio es correcto, ejecutar `npm run test:update` para sellar la nueva firma.
⚠️ **Nota**: Si Husky detiene tu commit, es porque has tocado una pantalla sin el escudo previo o sin actualizar la firma digital.

## 2. 🖥️ Blindaje de Lógica Admin
Cualquier cambio en la lógica del **Panel Admin** (`/admin`) debe superar los tests de integridad:
- No se permiten guardados en Supabase sin audio válido, autor o duraciones coherentes.
- Ejecuta `npm test` dentro de la carpeta `/admin` para validar. El robot de GitHub impedirá el Merge si esto falla.

## 3. 🛡️ Gobernanza en GitHub (Aduana de Control)
La rama `main` está blindada. Ningún Pull Request será aceptado sin el **Check Verde** de los 3 robots:
- 🧠 **Cerebro**: Lógica del servicio de contenidos.
- 🏗️ **App Build**: Integridad del compilado Expo.
- 🖥️ **Admin Build**: Integridad del panel de gestión.

## 5. ⚡ Integridad del Runtime (Bridgeless)
Para evitar el crash fatal observados en la v2.48.0, la app utiliza un sistema de polyfills forzoso.
- **Regla de Oro**: `import './src/polyfills';` debe ser la **primera línea absoluta** de `index.ts`.
- **Bloqueo**: Husky impedirá cualquier commit que altere este orden.
- **Lectura Obligatoria**: [POLYFILLS_BRIDGE_FIX.md](file:///c:/Mis%20Cosas/Proyectos/Paziify/docs/guides/POLYFILLS_BRIDGE_FIX.md).

---
### 🛠️ Comandos de Emergencia y Utilidades
* `npm run reset:paziify`: Borra tus cambios actuales y vuelve al punto de salud total.
* `npm run test:ojo`: Ejecuta el sensor de integridad visual (El Ojo).
* `npm run test:update`: Actualiza las firmas JSON (Snapshot update) - **Solo tras validar cambios**.
* `npm test`: Ejecuta los robots de lógica de la App.
