# Script para iniciar emulador Android
# Ejecutar con: .\start-emulator.ps1

Write-Host "🚀 Iniciando emulador Android..." -ForegroundColor Cyan

# Configurar variables de entorno
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\emulator"

# Iniciar emulador
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd Pixel_5_API_33 -no-snapshot-load

Write-Host "✅ Emulador iniciado" -ForegroundColor Green
