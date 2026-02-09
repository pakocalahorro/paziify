# Script para crear emulador Android para Paziify
# Ejecutar con: .\create-emulator.ps1

Write-Host "🔧 Configurando emulador Android para Paziify..." -ForegroundColor Cyan

# Configurar variables de entorno
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\cmdline-tools\latest\bin"

Write-Host "✅ ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green

# Verificar que avdmanager existe
$avdmanager = "$env:ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat"
if (-not (Test-Path $avdmanager)) {
    # Intentar ubicación alternativa
    $avdmanager = "$env:ANDROID_HOME\tools\bin\avdmanager.bat"
    if (-not (Test-Path $avdmanager)) {
        Write-Host "❌ Error: No se encontró avdmanager" -ForegroundColor Red
        Write-Host "📝 Necesitas instalar Android Command Line Tools" -ForegroundColor Yellow
        Write-Host "   Descarga desde: https://developer.android.com/studio#command-tools" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ avdmanager encontrado" -ForegroundColor Green

# Crear emulador
Write-Host "`n🚀 Creando emulador Pixel_5_API_33..." -ForegroundColor Cyan

$createCommand = @"
echo no | "$avdmanager" create avd -n Pixel_5_API_33 -k "system-images;android-33;google_apis;x86_64" -d pixel_5
"@

Invoke-Expression $createCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Emulador creado exitosamente!" -ForegroundColor Green
    Write-Host "`n📱 Para iniciar el emulador, ejecuta:" -ForegroundColor Cyan
    Write-Host "   .\start-emulator.ps1" -ForegroundColor White
} else {
    Write-Host "`n❌ Error al crear emulador" -ForegroundColor Red
    Write-Host "Código de salida: $LASTEXITCODE" -ForegroundColor Yellow
}
