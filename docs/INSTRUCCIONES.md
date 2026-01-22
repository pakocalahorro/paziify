# 📱 Instrucciones Rápidas - Ejecutar App en Emulador

## Estado Actual
- ✅ Emulador `Pixel_5_API_33` iniciándose
- ✅ Expo corriendo en terminal
- ⏳ Esperando conexión del emulador (2-3 minutos)

## Qué Hacer Ahora

### Opción 1: Esperar Automáticamente (Recomendado)
1. **Espera 2-3 minutos** - El emulador está arrancando
2. **Verás una ventana del emulador** aparecer en tu pantalla
3. **Expo detectará automáticamente** el emulador cuando esté listo
4. **La app se instalará automáticamente** en el emulador

### Opción 2: Verificar Manualmente
Si después de 3 minutos no pasa nada:

1. **Verifica que el emulador está corriendo:**
   - Deberías ver una ventana del emulador Android en tu pantalla
   - Si no la ves, ejecuta: `.\start-emulator.ps1`

2. **Verifica la conexión:**
   ```powershell
   $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
   & "$env:ANDROID_HOME\platform-tools\adb.exe" devices
   ```
   Deberías ver algo como:
   ```
   List of devices attached
   emulator-5554    device
   ```

3. **En la terminal de Expo:**
   - Presiona `a` para abrir en Android
   - O presiona `r` para recargar

## Qué Esperar

Cuando el emulador esté listo:
1. 📱 Verás la pantalla de inicio de Android
2. 📦 Expo instalará la app automáticamente
3. 🚀 La app Paziify se abrirá mostrando el HomeScreen

## Si Hay Problemas

### El emulador no aparece
```powershell
# Reiniciar emulador
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd Pixel_5_API_33
```

### Expo no detecta el emulador
```powershell
# Reiniciar ADB
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
& "$env:ANDROID_HOME\platform-tools\adb.exe" kill-server
& "$env:ANDROID_HOME\platform-tools\adb.exe" start-server

# En la terminal de Expo, presiona 'a'
```

### La app no se instala
```powershell
# En la terminal de Expo:
# Presiona 'Shift + a' para seleccionar dispositivo manualmente
```

---

**⏱️ Tiempo estimado:** 2-3 minutos para el primer arranque del emulador
