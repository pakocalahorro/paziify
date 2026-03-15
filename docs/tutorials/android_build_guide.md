# 🛡️ Guía Maestra Android: Paziify (Mantenimiento y Build)

Esta es la **"Constitución" técnica** de Paziify para Android. Combina la sabiduría de todas las sesiones previas para garantizar que cualquier build (APK o AAB) sea exitoso, incluso con los desafíos de rutas de Windows.

---

## 📋 Resumen de Operaciones Rápidas

| Acción | Propósito | Comando |
|---|---|---|
| **Limpieza Profunda** | Resetear el entorno nativo | `Remove-Item android, .expo` y `npx expo prebuild` |
| **Limpieza Rápida** | Corregir errores de compilación | **Paso 1** del Protocolo Local (Super Clean) |
| **Generar APK (Test)** | Instalar en tu móvil | **Paso 3** del Protocolo Local (`assembleDebug`) |
| **Generar AAB (Nube)** | Subir a Google Play (EAS) | `eas build --platform android --profile production` |
| **Servidor Dev** | Ver cambios en tiempo real | `npx expo start --dev-client` |

---

## 1. 🧹 MANTENIMIENTO Y RECONSTRUCCIÓN

Usa estos comandos si el entorno está "sucio", has cambiado plugins en `app.json` o si la carpeta `android` da errores inexplicables.

### A. Reset Total (Bomba Atómica)
Si necesitas borrar todo y empezar de cero (excepto tus archivos de código):
1. Borra `node_modules`, `android` y `.expo`.
2. Ejecuta en PowerShell: 
```powershell
npm install --legacy-peer-deps
npx expo prebuild --clean
```

### B. Mantenimiento de Git
Limpia archivos no rastreados que puedan estorbar:
```bash
git clean -fdX
```

---

## 2. 📦 PROTOCOLO LOCAL "ANTI-ESPACIOS" (Inmune a "Mis Cosas")

El gran problema de Windows es el espacio en la carpeta "Mis Cosas". Para compilar C++ (Reanimated, Nitro) hay que usar este flujo de 3 pasos **OBLIGATORIO**.

### ⏱️ PASO 1: Super Clean (Limpiar Rastros)
Desde la carpeta **`C:\Paziify\android`**:
```powershell
# 1. Entrar en la ruta corta (Garantiza que CMake no lea espacios)
cd C:\MISCOS~1\PROYEC~1\PAZIIFY\android

# 2. Detener procesos y borrar carpetas rebeldes manualmente
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew --stop ; Remove-Item -Recurse -Force build, app/build, app/.cxx -ErrorAction SilentlyContinue
```

### ⏱️ PASO 2: Sincronizar Inmaculadamente
```powershell
cd ..
npx expo prebuild --clean
```
*Este comando regenera los archivos nativos basándose en tu `app.json` actual (iconos, colores de barras, etc.).*

### ⏱️ PASO 3: Ejecutar Compilación
```powershell
cd android
.\gradlew assembleDebug      # APK de Pruebas (Debug)
.\gradlew assembleRelease    # APK Real (Release)
.\gradlew bundleRelease      # AAB Final (Play Store)
```

---

## 3. ☁️ COMPILACIÓN EN LA NUBE (EAS Build)

**RECOMENDADO PARA RELEASES FINALES.** Evita cualquier problema de tu PC compilando en servidores Linux limpios.

### Paso 1: Subir Versión (Obligatorio para AAB)
En `app.json`, aumenta en +1 el `versionCode` dentro del bloque `android`.

### Paso 2: Lanzar Build
```bash
# Para subir a la tienda (AAB)
eas build --platform android --profile production

# Para probar APK de producción (Instalable)
eas build --platform android --profile preview
```

---

## 4. 🌐 DESARROLLO Y SERVIDOR (Metro)

Para que el APK Debug cargue el código o para iterar rápido:
1. Abre una terminal en **`C:\Paziify`**.
2. Ejecuta:
```powershell
npx expo start --dev-client
```
*Si cambias lógica en JS y no lo ves, pulsa `r` en la terminal o usa `npx expo start --dev-client --clear`.*

---

## 🛠️ SOLUCIÓN DE PROBLEMAS (VADEMÉCUM)

### A. JAVA_HOME no se reconoce
Recuerda que cada vez que cierras la terminal, Windows "olvida" dónde está Java. Ejecuta siempre:
`$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"`

### B. Error en CMake (add_subdirectory given source "C:/Mis Cosas")
Causa: Has ejecutado un comando desde la ruta con espacios.
Solución: Vuelve al **PROTOCOLO LOCAL (Paso 1)** usando `C:\MISCOS~1`.

### C. Error EBUSY (Archivo bloqueado)
Indica que Android Studio o Metro tienen el archivo "secuestrado".
1. Cierra Android Studio.
2. Ejecuta `.\gradlew --stop`.
3. Reinicia la acción de borrado.

### D. Firma de la App (Keystore)
Verifica siempre que en `android/gradle.properties` existan las variables `PAZIIFY_RELEASE_STORE_FILE` y sus passwords antes de un `assembleRelease`.

---
*Actualizado: 14 de Marzo de 2026 (Versión Consolidada)*
