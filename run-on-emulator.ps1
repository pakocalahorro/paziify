# Script para esperar a que el emulador esté listo y ejecutar Expo
# Ejecutar con: .\run-on-emulator.ps1

Write-Host "🚀 Esperando a que el emulador esté listo..." -ForegroundColor Cyan

# Configurar variables de entorno
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"

# Esperar a que el emulador se conecte
$maxAttempts = 60  # 60 intentos = 2 minutos
$attempt = 0
$deviceFound = $false

while ($attempt -lt $maxAttempts -and -not $deviceFound) {
    $attempt++
    Write-Host "Intento $attempt/$maxAttempts..." -ForegroundColor Yellow
    
    $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices | Select-String "emulator"
    
    if ($devices) {
        Write-Host "✅ ¡Emulador detectado!" -ForegroundColor Green
        $deviceFound = $true
    }
    else {
        Start-Sleep -Seconds 2
    }
}

if (-not $deviceFound) {
    Write-Host "❌ El emulador no se conectó después de 2 minutos" -ForegroundColor Red
    Write-Host "Por favor, verifica que el emulador esté corriendo" -ForegroundColor Yellow
    exit 1
}

# Esperar a que el emulador termine de arrancar completamente
Write-Host "⏳ Esperando a que el sistema Android termine de arrancar..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verificar que el emulador está listo
$bootComplete = $false
$bootAttempts = 0
$maxBootAttempts = 30

while ($bootAttempts -lt $maxBootAttempts -and -not $bootComplete) {
    $bootAttempts++
    $bootStatus = & "$env:ANDROID_HOME\platform-tools\adb.exe" shell getprop sys.boot_completed 2>$null
    
    if ($bootStatus -eq "1") {
        Write-Host "✅ Sistema Android listo!" -ForegroundColor Green
        $bootComplete = $true
    }
    else {
        Write-Host "Esperando boot completo... ($bootAttempts/$maxBootAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $bootComplete) {
    Write-Host "⚠️ El emulador tardó más de lo esperado en arrancar" -ForegroundColor Yellow
    Write-Host "Intentando ejecutar Expo de todos modos..." -ForegroundColor Yellow
}

# Ejecutar Expo
Write-Host "`n🎯 Iniciando Expo..." -ForegroundColor Cyan
Write-Host "Presiona 'a' cuando aparezca el menú de Expo para abrir en Android`n" -ForegroundColor Green

npx expo start

Write-Host "`n✅ Expo iniciado" -ForegroundColor Green
Write-Host "La app debería abrirse automáticamente en el emulador" -ForegroundColor Cyan
