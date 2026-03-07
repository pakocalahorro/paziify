# Handoff: Generación del AAB para Google Play Store

**Fecha:** 7 de Marzo de 2026  
**Estado:** Trabajo en progreso — se necesita continuar  
**Objetivo:** Generar el archivo `.aab` de Paziify para subirlo al track de Pruebas Internas de Google Play

---

## 🔴 Estado Actual del Proyecto (Punto de partida)

El proyecto está en un estado **intermedio e inestable**. En la sesión anterior se realizó un downgrade de SDK 55 → SDK 54 que está a medio completar. **PRIMER PASO OBLIGATORIO**: restaurar un estado limpio y funcional.

### Versiones en package.json ahora mismo
- `expo`: `~54.0.0` (SDK 54)
- `react`: `19.1.0`
- `react-native`: `0.81.5`

### Problemas pendientes
1. `npx expo prebuild` falla con `PluginError: Unable to resolve` (probablemente por `react-native-vision-camera` plugin TypeScript)
2. La carpeta `android/` existe localmente pero fue generada con SDK 55 / RN 0.83 — hay un mismatch con el JS actual de SDK 54
3. El archivo `app.json` tiene el plugin `withGradleFix.js` eliminado de la lista de plugins

---

## 🟢 Opción Recomendada: Build Local con Gradle (NO usar EAS)

EAS Build tiene un bug en su template para SDK 55 / RN 0.83 que impide la compilación. La solución alternativa y probada es **compilar localmente con Gradle**.

### Por qué funciona
La app ya genera correctamente el APK de debug localmente con este proceso (usando un symlink para evitar el error de espacios en la ruta). El mismo proceso sirve para generar el `.aab` de release.

---

## 📋 Plan de Acción Completo

### FASE 0 — Restaurar estado limpio (OBLIGATORIO)

Decidir entre estas dos opciones y ejecutar solo una:

**Opción A — Volver a SDK 55 (más reciente, más riesgo de bugs de EAS)**
```bash
npm install expo@~55.0.0 --legacy-peer-deps
npx expo install --fix -- --legacy-peer-deps
```

**Opción B — Asegurar SDK 54 y buscar causa del fallo de prebuild (recomendada)**
```bash
# Limpiar node_modules y reinstalar limpio
rm -rf node_modules
npm install --legacy-peer-deps
# Luego intentar prebuild
npx expo prebuild --platform android --no-install
```

Si prebuild falla con el mismo `PluginError: Unable to resolve` en SDK 54:
- El culpable probable es `react-native-vision-camera@^4.7.3` — su plugin puede requerir TypeScript nativo que SDK 54 no soporta
- Solución: bajar vision-camera a la última versión compatible con SDK 54:
```bash
npx expo install react-native-vision-camera@~4.5.0
```

---

### FASE 1 — Regenerar android/ con Prebuild Limpio

Una vez que prebuild funcione:

```bash
npx expo prebuild --platform android --no-install
```

Cuando pregunte si limpiar el proyecto existente, decir **Y**.

#### CRÍTICO: Aplicar el fix en build.gradle

Después del prebuild, abrir `android/app/build.gradle` y:

**Fix 1**: Buscar la línea con `enableBundleCompression` y comentarla:
```groovy
// enableBundleCompression = false  ← así debe quedar (comentada)
```

**Fix 2**: Buscar la línea `codegenDir = ...` y asegurarse de que tenga `.getParentFile()`:
```groovy
// CORRECTO - con .getParentFile():
codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()

// MAL - sin .getParentFile():
codegenDir = new File([...].execute(null, rootDir).text.trim()).getAbsoluteFile()
```

---

### FASE 2 — Configurar la Firma de Release

El `.aab` de producción necesita estar firmado con un keystore.

#### Opción A — Usar el keystore de EAS (recomendado)

```bash
npx eas-cli credentials
```

Seleccionar:
- Platform: Android
- Profile: production
- Ver / descargar el keystore

Guardar el archivo `.jks` (por ejemplo en `C:\Paziify-keystore\release.jks`)

#### Opción B — Crear un nuevo keystore local

```bash
keytool -genkey -v -keystore android/app/release.keystore -alias paziify -keyalg RSA -keysize 2048 -validity 10000
```

⚠️ Si creas un keystore nuevo, la primera versión que subas a Play Store quedará vinculada a él. Guárdalo en lugar seguro.

#### Configurar la firma en Gradle

Crear o editar `android/gradle.properties` añadiendo:
```properties
MYAPP_UPLOAD_STORE_FILE=release.keystore
MYAPP_UPLOAD_KEY_ALIAS=paziify
MYAPP_UPLOAD_STORE_PASSWORD=TU_PASSWORD_AQUI
MYAPP_UPLOAD_KEY_PASSWORD=TU_PASSWORD_AQUI
```

En `android/app/build.gradle`, dentro del bloque `android { ... }`, añadir la configuración de firma:
```groovy
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ...resto de configuración existente
    }
}
```

---

### FASE 3 — Generar el AAB Localmente

Usar el mismo proceso que el APK de debug (symlink para evitar espacios en la ruta).

**Paso 1** — PowerShell como Administrador:
```powershell
New-Item -ItemType Junction -Path "C:\Paziify" -Target "C:\Mis Cosas\Proyectos\Paziify"
```

**Paso 2** — Compilar el AAB:
```powershell
cd C:\Paziify\android
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew bundleRelease
```

**Paso 3** — Eliminar el symlink (NO borra archivos):
```powershell
cmd /c rmdir "C:\Paziify"
```

**El .aab resultante estará en:**
```
C:\Mis Cosas\Proyectos\Paziify\android\app\build\outputs\bundle\release\app-release.aab
```

---

### FASE 4 — Subir a Google Play

1. Ir a [Google Play Console](https://play.google.com/console) → Paziify
2. Crear release → **Pruebas internas**
3. Subir el archivo `app-release.aab`
4. El icono 512×512 para la ficha de la tienda está en:
   ```
   C:\Mis Cosas\Proyectos\Paziify-files\playstore-icon-512.png
   ```

---

## 📁 Archivos Clave

| Archivo | Propósito |
|---|---|
| `android/app/build.gradle` | Build script — aquí van los dos fixes críticos |
| `android/gradle.properties` | Configuración de firma de release |
| `app.json` | Configuración Expo — NO tiene withGradleFix plugin (fue eliminado) |
| `eas.json` | Configuración EAS — actualmente limpio, sin prebuildCommand |
| `plugins/withGradleFix.js` | Plugin de parche (NO está registrado en app.json) |
| `scripts/fix-gradle.js` | Script alternativo de parche para build.gradle |
| `Paziify-files/playstore-icon-512.png` | Icono para Play Store |

---

## ❌ Lo que NO funciona y por qué

### EAS Build (cloud)
**Comando:** `npx eas-cli build --platform android --profile production`  
**Error:** `Cannot find module '.../codegen/package.json/lib/cli/combine/combine-js-to-schema-cli.js'`  
**Causa:** Bug en el template de EAS para Expo SDK 55 / RN 0.83. El servidor EAS genera un `codegenDir` que apunta al fichero `package.json` en lugar del directorio que lo contiene. Los intentos de parchearlo con Config Plugin (`withAppBuildGradle`) y `prebuildCommand` no tuvieron efecto en el servidor.

### Expo SDK 55 + prebuild local
`expo prebuild` con SDK 55 funciona localmente, pero el `enableBundleCompression` en el template genera error. Esto se resuelve manualmente en `build.gradle`.

### Config Plugin `withGradleFix.js`
Intentado pero con SDK 54 causa `PluginError: Unable to resolve` en el resolver de plugins. Con SDK 55 el plugin se ejecuta pero el `codegenDir` en EAS que usa el servidor es diferente al local y no se parchea correctamente.

---

## ✅ Lo que SÍ funciona

- **APK de debug local**: `.\gradlew assembleDebug` con el symlink — **100% funcional**
- **Desarrollo diario**: `npx expo start --dev-client` — funciona con app nativa en el móvil
- **Supabase, base de datos, backend**: sin cambios, todo operativo
- **Iconos**: actualizados con el logo oficial de Paziify (paloma luminosa azul/púrpura)

---

## 🔑 Credenciales Necesarias

- **EAS / Expo**: cuenta `cakodesigns` en expo.dev
- **Google Play Console**: cuenta asociada a Paziify
- **Keystore EAS**: se puede descargar con `npx eas-cli credentials` → Android → production

---
*Handoff generado: 7 de Marzo de 2026*
