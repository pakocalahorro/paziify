# 🛡️ Guía Maestra Android: Paziify (Mantenimiento y Build)

Esta guía contiene los pasos exactos para mantener el entorno limpio y generar los archivos de la aplicación.

---

## 1. 🧹 MANTENIMIENTO (Limpieza)

### A. Limpieza Rápida (Recomendada antes de cada Build)
Borra la carpeta `android/app/build`. Esto evita conflictos con archivos antiguos sin afectar al resto del proyecto.

### B. Reset Total (Solo si hay errores graves o cambios en plugins)
Borra `node_modules`, `android` y `.expo`.
```bash
npm install --legacy-peer-deps
npx expo prebuild --clean
```

---

## 2. 📦 GENERACIÓN DE COMPILADOS (Local)

Sigue estos 3 pasos en **PowerShell** (Administrador) para preparar y ejecutar cualquier build.

### FASE 1: Preparar el Entorno
```powershell
# 1. Crear el enlace a la ruta sin espacios (Solo la primera vez)
cmd /c mklink /J C:\Paziify "C:\Mis Cosas\Proyectos\Paziify"

# 2. Entrar en la ruta de trabajo
cd C:\Paziify\android

# 3. Configurar Java
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

### FASE 2: Elegir tipo de Build

#### 📱 Opción A: APK de Pruebas (Debug)
Para instalar y probar funciones rápidamente.
```powershell
.\gradlew assembleDebug
```
*   **Resultado**: `android\app\build\outputs\apk\debug\app-debug.apk`

#### 🛡️ Opción B: APK de Producción (Release)
Para probar la app **exactamente** como irá a la tienda (Firma real).
```powershell
.\gradlew clean
.\gradlew assembleRelease
```
*   **Resultado**: `android\app\build\outputs\apk\release\app-release.apk`

#### 🚀 Opción C: AAB para Play Store (Definitivo)
1.  **Sube la versión**: En `app.json`, aumenta en +1 el `versionCode`.
2.  **Lanza el build**:
```powershell
.\gradlew clean
.\gradlew bundleRelease
```
*   **Resultado**: `android\app\build\outputs\bundle\release\app-release.aab`

---

## 3. ⚡️ ITERACIÓN RÁPIDA (Side-loading del Bundle)

Si el error es de JavaScript (ej. `ReferenceError` en el hilo `mqt_v_js`), no necesitas recompilar el APK. Puedes inyectar el nuevo código en segundos:

### Paso 1: Generar el Bundle
```powershell
npx react-native bundle --platform android --dev false --entry-file index.ts --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

### Paso 2: Inyectar en el dispositivo (ADB)
```powershell
# 1. Subir a temporal
adb push android/app/src/main/assets/index.android.bundle /data/local/tmp/index.android.bundle

# 2. Copiar a la carpeta de la app (Requiere APK debuggable o permisos)
adb shell "run-as com.pakocalahorro.paziify cp /data/local/tmp/index.android.bundle /data/data/com.pakocalahorro.paziify/files/index.android.bundle"
```

### Paso 3: Reiniciar App
```powershell
adb shell am force-stop com.pakocalahorro.paziify
adb shell am start -n com.pakocalahorro.paziify/.MainActivity
```
*   **Tiempo estimado**: 10-15 segundos.
*   **Limitación**: Solo para cambios en JS (no archivos nativos).

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### A. Archivos bloqueados (EBUSY)
Si Windows no te deja borrar carpetas porque "hay un proceso usándolas":
1. Cierra **Android Studio**.
2. Ejecuta: `.\gradlew --stop`
3. Cierra cualquier terminal con Metro (`npx expo start`) abierto.

### B. Atasco en C++ o Error en 'clean' (Bomba Atómica)
Si `.\gradlew clean` falla (como hoy por las rutas) o la compilación se queda congelada:
```powershell
# Borrado manual de carpetas de compilación
Remove-Item -Recurse -Force build, app/build, app/.cxx -ErrorAction SilentlyContinue

# Borrado de cachés de módulos nativos (opcional)
Remove-Item -Recurse -Force "..\node_modules\react-native-reanimated\android\build", "..\node_modules\@react-native-async-storage\async-storage\android\build" -ErrorAction SilentlyContinue
```
**Nota**: Usa esto solo si el `clean` estándar falla. Una vez estabilizado en `C:\Paziify`, no lo necesitarás habitualmente.

---

## ⚠️ NOTAS TÉCNICAS (v2.47.0)
*   **Memoria**: Gradle usa **4GB de RAM** y 1GB Metaspace (fijado en `gradle.properties`).
*   **Assets**: **PROHIBIDO** assets pesados en local. Todo en **Supabase**.
*   **Firma**: Automatizada con `@cakodesigns__paziify.jks`.
*   **Babel**: No incluir `react-native-worklets/plugin` (causa duplicidad).

---
*Actualizado: 13 de Marzo de 2026*
