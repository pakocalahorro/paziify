# 🛡️ Guía Maestra Android: Mantenimiento y Build (Paziify)

Esta es la guía definitiva para gestionar el entorno Android de Paziify. Cubre desde la limpieza profunda hasta la publicación en la Play Store.

---

## 📋 Resumen de Operaciones

| Acción | Propósito | Comando / Método |
|---|---|---|
| **Limpieza** | Liberar espacio y corregir errores | Manual (`node_modules`, `build`) |
| **Desarrollo** | Probar cambios rápidos | `npx expo start --dev-client` |
| **Debug APK** | Instalar en móvil físico | `.\gradlew assembleDebug` |
| **Release AAB**| Publicar en Play Store | `.\gradlew bundleRelease` |

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

## 2. 📦 Generación de Compilados (Build)

### FASE 1: Preparar el Entorno (Común)
Ejecuta esto en **PowerShell** (como Administrador). 
> [!IMPORTANT]
> Si la carpeta `C:\Paziify` ya existe y da error, consulta la sección de **Solución de Problemas** abajo.

```powershell
# 1. Crear Sandbox y entrar
New-Item -ItemType Junction -Path "C:\Paziify" -Target "C:\Mis Cosas\Proyectos\Paziify"
cd C:\Paziify\android

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

#### Opción B: Generar AAB (Play Store)
Usa esto para generar el archivo final para Google Play:
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

### FASE 4: Salida y Limpieza
Borra el enlace simbólico al terminar (es seguro, no borra tus archivos):
```powershell
cmd /c rmdir "C:\Paziify"
```

---

## 🛠️ Solución de Problemas (Troubleshooting)

### Error: "El directorio no está vacío" o no deja crear el Sandbox
Si al ejecutar la FASE 1 recibes errores de acceso o de que la carpeta ya existe, haz un reset total:
1. **Sal de la unidad C:\Paziify** (ve a `C:\` o cierra el terminal).
2. Ejecuta esto para forzar la limpieza:
```powershell
Remove-Item -Path "C:\Paziify" -Force -Recurse
```
3. Vuelve a ejecutar la **FASE 1**.

### Error: "JAVA_HOME is not set"
Este error ocurre si abres una pestaña nueva de PowerShell. Debes volver a ejecutar:
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

---

## ⚠️ Notas Técnicas (v2.44.0)
*   **Ruta de salida AAB**: `android\app\build\outputs\bundle\release\app-release.aab`
*   **PNG Crunching**: Siempre en `false` para evitar errores AAPT2.
*   **Versiones**: SDK 54 / React 18.3.1 / RN 0.76.7.

---
*Actualizado: 8 de Marzo de 2026*
