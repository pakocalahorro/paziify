# Fix Crítico: Polyfills de Web APIs para React Native 0.81 (Hermes + Bridgeless)

## Contexto

Este documento explica un problema crítico de arranque resuelto en la versión 2.47.0 de Paziify, y los cambios aplicados para solucionarlo. Es **lectura obligatoria** antes de modificar el sistema de inicialización de la app o actualizar dependencias clave como Supabase o React Native.

---

## El Problema

Al publicar la app en producción (APK/AAB firmado), la aplicación crasheaba inmediatamente al arrancar con el siguiente error en logcat:

```
E ReactNativeJS: [runtime not ready]: ReferenceError: Property 'FormData' doesn't exist
F libc: Fatal signal 6 (SIGABRT)
```

El error no ocurría en desarrollo (Metro bundler) porque Metro inyecta estos globals automáticamente. En producción con Hermes + Bridgeless, el bundle JS se ejecuta en un entorno más estricto donde estas APIs **no están disponibles de forma inmediata**.

### ¿Por qué ocurre esto?

React Native 0.81 introdujo el modo **Bridgeless** (Nueva Arquitectura), que ejecuta el runtime de JS de forma más aislada. En este modo, los globals de Web APIs estándar como `FormData`, `Headers`, `fetch`, `queueMicrotask`, etc., no se inicializan antes de que el bundle JS comience a ejecutarse.

**Supabase** (y otras librerías de red) intentan usar estas APIs en el momento de su importación — es decir, en el scope raíz del módulo, fuera de cualquier función. Esto provoca el crash antes de que la app pueda renderizar nada.

### Cadena de globals que fallaban (en orden de descubrimiento)

1. `FormData`
2. `Headers`
3. `Request`, `Response`, `fetch`
4. `queueMicrotask`
5. `structuredClone`, `AbortController`, `TextEncoder`, `TextDecoder`, `Blob`, `FileReader`

---

## La Solución

### Principio técnico

Los `import` de ESModules se **elevan (hoisting)** al inicio del archivo y se ejecutan **en orden de aparición**. Esto significa que si `./src/polyfills` es el primer import de `index.ts`, sus efectos estarán aplicados antes de que cualquier otra librería se inicialice.

### Archivos modificados

#### 1. `index.ts`

```typescript
import './src/polyfills'; // ← DEBE ser siempre la primera línea
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

> ⚠️ **IMPORTANTE:** Si alguna vez se añade un import antes de `./src/polyfills`, la app puede volver a crashear en producción.

#### 2. `src/polyfills.ts` (archivo nuevo)

```typescript
import 'react-native-url-polyfill/auto';

// FormData
try {
  if (typeof global.FormData === 'undefined') {
    const RNFormData = require('react-native/Libraries/Network/FormData');
    global.FormData = RNFormData.default ?? RNFormData;
  }
} catch (e) {}

// Headers, Request, Response, fetch
try {
  const fetchModule = require('react-native/Libraries/Network/fetch');
  if (typeof global.Headers === 'undefined') global.Headers = fetchModule.Headers;
  if (typeof global.Request === 'undefined') global.Request = fetchModule.Request;
  if (typeof global.Response === 'undefined') global.Response = fetchModule.Response;
  if (typeof global.fetch === 'undefined') global.fetch = fetchModule.fetch;
} catch (e) {}

// queueMicrotask
if (typeof global.queueMicrotask === 'undefined') {
  global.queueMicrotask = (callback) => Promise.resolve().then(callback);
}

// structuredClone
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// AbortController
try {
  if (typeof global.AbortController === 'undefined') {
    const { AbortController } = require('react-native/Libraries/Network/AbortController');
    global.AbortController = AbortController;
  }
} catch (e) {}

// TextEncoder / TextDecoder
try {
  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('react-native/Libraries/Blob/FileReader');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
} catch (e) {}

// Blob
try {
  if (typeof global.Blob === 'undefined') {
    global.Blob = require('react-native/Libraries/Blob/Blob').default;
  }
} catch (e) {}

// FileReader
try {
  if (typeof global.FileReader === 'undefined') {
    global.FileReader = require('react-native/Libraries/Blob/FileReader').default;
  }
} catch (e) {}
```

#### 3. `src/services/supabaseClient.ts`

Se eliminó la línea `import 'react-native-url-polyfill/auto'` que existía al inicio de este archivo, ya que ahora se gestiona de forma centralizada en `polyfills.ts`.

---

## Por qué se usan `try/catch`

Las rutas internas de React Native (`react-native/Libraries/Network/fetch`, etc.) son APIs privadas que podrían cambiar en futuras versiones. Los bloques `try/catch` garantizan que si una ruta deja de existir, el polyfill se omite silenciosamente en lugar de provocar un nuevo crash. En ese caso, React Native probablemente ya exponga el global de otra forma.

## Por qué NO se usa `formdata-polyfill` (npm)

El paquete `formdata-polyfill` fue el primer intento de solución pero resultó incompatible con el motor Hermes en builds de producción. La solución correcta es usar el `FormData` interno de React Native, que ya está compilado y disponible en el bundle nativo.

---

## Cómo diagnosticar si vuelve a ocurrir

Si en una futura versión la app vuelve a crashear al arrancar, ejecutar:

```powershell
& "C:\...\adb.exe" logcat *:E | Select-String "ReactNativeJS", "Fatal"
```

Buscar líneas con `[runtime not ready]: ReferenceError: Property 'X' doesn't exist`. El nombre de la propiedad indica el global que falta, que debe añadirse a `polyfills.ts`.

### Método rápido para iterar sin rebuild completo

Para probar cambios en `polyfills.ts` sin esperar 30 minutos de compilación:

```powershell
# 1. Regenerar solo el bundle JS
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# 2. Subir el bundle al dispositivo
adb push android/app/src/main/assets/index.android.bundle /data/local/tmp/index.android.bundle
adb shell "run-as com.pakocalahorro.paziify cp /data/local/tmp/index.android.bundle /data/data/com.pakocalahorro.paziify/files/index.android.bundle"

# 3. Reiniciar la app
adb shell am force-stop com.pakocalahorro.paziify
adb shell am start -n com.pakocalahorro.paziify/.MainActivity
```

Tarda ~15 segundos. Solo funciona para cambios JS — si hay cambios nativos, se necesita build completo.

---

## Contexto del stack técnico

Este fix es necesario por la combinación específica de:

- **React Native 0.81** con Nueva Arquitectura (Bridgeless)
- **Hermes** como motor JS
- **Supabase** inicializado en scope de módulo
- **Vision Camera v5-beta + Nitro Modules** que requieren Bridgeless
- **Node.js v20 (LTS)** en la CI para soportar funciones modernas de JavaScript (ej. `toReversed`) requeridas por el empaquetador de Metro en RN 0.81.

Esta arquitectura fue elegida deliberadamente para el módulo **CardioScan** de Paziify, que procesa señales PPG a 30fps con jitter inferior a 1ms para cálculos de HRV/RMSSD de precisión médica. Degradar a la arquitectura Bridge clásica reduciría la precisión de las mediciones de forma inaceptable para el propósito de la app.

---

*Documento generado tras el proceso de estabilización de la versión 5.0.0 — Marzo 2026*
