# 🛡️ Guía Maestra Android: Mantenimiento y Build (Paziify)

Esta es la guía definitiva para gestionar el entorno Android de Paziify. Cubre desde la limpieza profunda hasta la publicación en la Play Store.

---

## 📋 Resumen de Operaciones

| Acción | Propósito | Comando / Método |
|---|---|---|
| **Limpieza Local** | Liberar espacio y corregir errores | Manual (`node_modules`, `build`) |
| **Desarrollo** | Probar cambios rápidos | `npx expo start --dev-client` |
| **Build Producción (EAS)** | **RECOMENDADO:** APK/AAB sin fallos | `eas build --platform android --profile production` |
| **Build APK (LOCAL)** | *Avanzado:* Debugging C++ en PC | `cd C:\MISCOS~1\Proyectos\Paziify\android ; .\gradlew assembleRelease` |

---

## 1. 🧹 Mantenimiento y Regeneración (Cero Corrupción)

Usa este proceso si la app no compila, si has cambiado dependencias nativas o si el proyecto pesa demasiado (>2GB).

### Paso A: Limpieza Manual
Borra estas carpetas desde el explorador de archivos:
*   `node_modules`
*   `android/app/build`

### Paso B: Reinstalación y Sincronización
```bash
npm install
npx expo prebuild
```

### Paso C: Verificación de Firma (Informativo)
Normalmente, Expo preserva estos cambios, pero es vital **verificar** que `android/gradle.properties` contiene estas líneas antes de compilar:
```properties
android.enablePngCrunchInReleaseBuilds=false
PAZIIFY_RELEASE_STORE_FILE=release.keystore
PAZIIFY_RELEASE_KEY_ALIAS=997ef1661bb0b93650ab6ab2779401c4
PAZIIFY_RELEASE_STORE_PASSWORD=650ad395bced8f9f9395b2d1c39025f5
PAZIIFY_RELEASE_KEY_PASSWORD=f4f6c702824bcccf892f63c4992151f9
```

---

## 2. ☁️ Compilación en la Nube con EAS (Recomendado y a prueba de fallos)

Si dentro de 1 mes, o 1 año, necesitas generar un nuevo APK o AAB, **usa siempre esta vía**. Al compilar en los servidores Limpios de Linux de Expo, te vacunas contra problemas de Windows (rutas con espacios, versiones de Java obsoletas, cachés nativas muertas de compilaciones de hace meses).

### Paso 0: Subir la Versión (Muy Importante)
Antes de generar un nuevo AAB para subir a Google Play, **siempre** debes incrementar el número de versión interno.
Abre el archivo `app.json` y suma +1 al parametro `versionCode` dentro del bloque `android`:
```json
"android": {
  "package": "com.pakocalahorro.paziify",
  "versionCode": 5, // <- Sube esto a 6, 7, etc...
}
```

### Paso 1: Dependencias Globales
Asegúrate de tener instalada la CLI de EAS y estar logueado con la cuenta de la organización (`cakodesignss`).
```bash
npm install -g eas-cli
eas login
```

### Paso 2: El Comando Maestro (Sin tocar C++)
En la carpeta principal del proyecto (`C:\Mis Cosas\Proyectos\Paziify`), abre una terminal cualquiera (no hace falta ruta corta ni trucos):
```bash
eas build --platform android --profile production
```

> [!TIP]
> **¿APK o AAB?**
> Por defecto, el perfil `production` suele generar un archivo `.aab` (listo para Google Play). Si lo que quieres es un archivo instalable `.apk` para probarlo en tu dispositivo, Expo tiene preconfigurado el perfil *preview* para ello:
> ```bash
> eas build --platform android --profile preview
> ```

**Beneficios Automáticos:**
1. Ignorará las carpetas corruptas locales (`node_modules` y `android`).
2. Sincronizará el certificado de tu app con Google Play (Keystore).
3. Compilará limpiamente todo el C++ y te dará un enlace directo para descargar el archivo intacto a tu escritorio al terminar la cola gratuita.

---

## 3. 📦 Generación de Compilados Local (Método Offline / Avanzado)

> [!WARNING]
> Usar este método **solo** si tienes prisa por generar un APK de pruebas sin esperar la cola de EAS (minutos frente a horas) o necesitas rastrear un bug nativo en consola. Este entorno es propenso a roturas de caché.

### FASE 1: Preparar el Entorno (Ruta Corta 8.3)
Ejecuta esto en **PowerShell** (como Administrador). 
> [!IMPORTANT]
> Usaremos `C:\MISCOS~1` para evitar que los espacios de "Mis Cosas" rompan el compilador de C++.

```powershell
# 1. Entrar usando la ruta corta (sin espacios)
cd C:\MISCOS~1\Proyectos\Paziify\android

# 2. Configurar Java (Obligatorio en cada nueva sesión)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

---

### FASE 2: Elegir Tipo de Compilación

#### Opción A: Generar APK (Pruebas Locales)
Usa esto para instalar Paziify en tu móvil directamente:
```powershell
.\gradlew clean
.\gradlew assembleDebug
```
*   **Resultado**: `android\app\build\outputs\apk\debug\app-debug.apk`

#### Opción B: Generar APK de Producción (Validación de Seguridad)
Usa esto para probar la app EXACTAMENTE como irá a la tienda, pero en formato instalable:
```powershell
.\gradlew clean
.\gradlew assembleRelease
```
*   **Resultado**: `android\app\build\outputs\apk\release\app-release.apk`
*   **Garantía**: Si este APK se instala y abre correctamente en tu móvil, el AAB de la Opción C es 100% seguro para subir a Google Play.

#### Opción C: Generar AAB (Play Store)
Usa esto para generar el archivo final para Google Play:

> [!CAUTION]
> **Subir la Versión Interna**
> Antes de ejecutar el comando, asegúrate de haber sumado +1 al valor `versionCode` en tu archivo `app.json` (bloque `android`), de lo contrario Google Play rechazará el archivo por versión duplicada.

```powershell
.\gradlew clean
.\gradlew bundleRelease
```
*   **Resultado**: `android\app\build\outputs\bundle\release\app-release.aab`

---

### FASE 3: Lanzar el Servidor de Desarrollo
Una vez instalado el APK en el móvil, necesitas el servidor para que la app cargue el código:
```powershell
# 1. Volver a la raíz del proyecto (desde android)
cd ..

# 2. Iniciar servidor
npx expo start --dev-client
```

---

### FASE 4: Salida
Simplemente cierra la terminal. No es necesario desmontar nada ya que estamos usando una ruta física real.

---

## 🛠️ Solución de Problemas (Troubleshooting)

### Error: "No se reconoce C:\MISCOS~1"
Si Windows dice que la ruta no existe, es posible que tu sistema use un número diferente.
Las rutas cortas reales encontradas para el proyecto son:
- **Ruta del Proyecto**: `C:\MISCOS~1\PROYEC~1\Paziify`
- **Ruta de Android**: `C:\MISCOS~1\PROYEC~1\Paziify\android`

Para verificar tu ruta corta real, ejecuta:
```powershell
cmd /c "for %I in ("C:\Mis Cosas") do @echo %~sI"
# Debería devolver C:\MISCOS~1
```
O, para una ruta específica:
```powershell
(New-Object -ComObject Scripting.FileSystemObject).GetFolder('C:\Mis Cosas\Proyectos\Paziify').ShortPath
```
Usa el resultado que te devuelva en lugar de `C:\MISCOS~1` o `C:\MISCOS~1\PROYEC~1\Paziify`.

### Error: "JAVA_HOME is not set"
Este error ocurre si abres una pestaña nueva de PowerShell. Debes volver a ejecutar:
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

### Error: "EBUSY: resource busy or locked"
Este error ocurre cuando Windows no puede renombrar o borrar archivos (especialmente en `node_modules`) porque están "atrapados" por otro proceso (Android Studio, Gradle o Metro).

**Cuándo aplicarlo**: Si falla `npm install` o si un comando de borrado da "Acceso denegado".

**Solución**:
1. Cierra **Android Studio**.
2. Mata los procesos de Gradle en segundo plano:
   ```powershell
   .\gradlew --stop
   ```
3. Cierra cualquier otro terminal con Metro (`npx expo start`) abierto.
4. Reintenta el comando.

### Atasco en Compilación o Cachés C++ Corruptas (React Native nativo)
Si el comando local de Gradle falla con errores misteriosos en el paso `configureCMakeRelWithDebInfo`, o se queda atascado durante horas reconstruyendo dependencias nativas (Reanimated, Gesture Handler, Vision Camera).

**Causa**: Las herramientas de compilación C++ en Windows a menudo retienen referencias a módulos antiguos o corruptos en las carpetas ocultas `.cxx`. El comando estándar `./gradlew clean` habitualmente ignora estas carpetas, rompiendo toda la cadena de construcción futura.

**La Solución Genérica (Bomba Atómica de Caché):**
Lanza este comando en PowerShell para decapitar físicamente las carpetas `.cxx` y `build` conflictivas de los módulos más problemáticos en C++:
```powershell
Remove-Item -Recurse -Force "node_modules\react-native-reanimated\android\.cxx", "node_modules\react-native-reanimated\android\build", "node_modules\react-native-gesture-handler\android\.cxx", "node_modules\react-native-gesture-handler\android\build" -ErrorAction SilentlyContinue
```
**Resucitar Compilación**: Tras volar esas carpetas, **NO** uses `clean` de nuevo. Lanza directamente `.\gradlew assembleRelease` para obligar a Gradle a recalcular solo ese C++ purgado y aprovechar la caché sana del resto del proyecto, cortando los tiempos de espera a una fracción minúscula.

## ⚠️ Notas Técnicas (v2.45.0)
*   **Nueva Arquitectura**: Habilitada (`newArchEnabled=true`).
*   **Ruta de salida AAB**: `android\app\build\outputs\bundle\release\app-release.aab`
*   **PNG Crunching**: Siempre en `false` para evitar errores AAPT2.
*   **Versiones**: SDK 54 / React 19 / RN 0.81.5 / Reanimated v4 (Alpha).
*   **Blindaje**: ProGuard activo para proteger la Nueva Arquitectura y Reanimated.

---
*Actualizado: 10 de Marzo de 2026*
