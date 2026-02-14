# Guía de Build Local (APK) - Paziify

Debido al uso de librerías nativas avanzadas como `@shopify/react-native-skia` (que requiere un runtime específico), las pruebas en Android deben realizarse mediante un APK generado localmente. **Expo Go no es compatible con el renderizado Skia en dispositivos Android.**

---

## 🚀 Proceso de Generación del APK

### 1. Requisitos Previos
- **Android Studio** instalado y configurado.
- **Java JDK 17+**.
- Dispositivo físico Android conectado via USB (con Depuración USB activada).

### 2. Preparación del Proyecto
Asegúrate de que las dependencias nativas están vinculadas:
```bash
npx expo prebuild
```
*Este comando genera la carpeta `/android` nativa si no existe.*

### 3. Solución: Build en "Sandbox" (Para rutas con espacios)

Si el build falla por espacios en la ruta (ej. `Mis Cosas`), usa este protocolo:

1. **Crear el Enlace**: Cierra VS Code y abre PowerShell como **Administrador**:
   ```powershell
   New-Item -ItemType Junction -Path "C:\Paziify" -Target "C:\Mis Cosas\Proyectos\Paziify"
   ```

2. **Ejecutar el Build**: En una terminal nueva:
   ```powershell
   cd C:\Paziify\android
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   .\gradlew assembleDebug
   ```

3. **Revertir**: Una vez generado el APK, borra el enlace (esto NO borra tus archivos):
   ```powershell
   cmd /c rmdir "C:\Paziify"
   ```

El archivo resultante estará en:
`C:\Mis Cosas\Proyectos\Paziify\android\app\build\outputs\apk\debug\app-debug.apk`

### 4. Instalación en el Dispositivo
Puedes arrastrar el APK al móvil o usar ADB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🛠️ Desarrollo Continuo (Fast Refresh)

Una vez instalada la app nativa en el móvil:
1. Inicia el servidor de Metro en el PC:
   ```bash
   npx expo start --dev-client
2. Abre la app **Paziify** en tu móvil.
3. Se conectará automáticamente al servidor de desarrollo y podrás ver los cambios en tiempo real (incluyendo el Orbe Skia).

---

## ⚠️ Consideraciones Importantes
- **Caché**: Si realizas cambios en el código de Skia y no se reflejan, pulsa `r` en la terminal de Expo para recargar el bundle.
- **Versión Skia**: Mantener siempre la versión compatible con el SDK de Expo actual para evitar fallos de compilación en Gradle.

---
*Documentado: 27 de Enero de 2026 - Milestone 3 Documentation*
