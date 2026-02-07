@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo      GENERADOR DE AUDIO MANUAL - PAZIIFY
echo ===================================================

set "FILE_PATH="

:: 1. Si se arrastro el archivo sobre el icono del .bat
if not "%~1"=="" set "FILE_PATH=%~1"

:: 2. Si no, pedirlo por pantalla
if "%FILE_PATH%"=="" (
    echo.
    echo Por favor, arrastra aqui tu archivo .txt y pulsa Enter.
    echo (O pega la ruta completa)
    echo.
    set /p "FILE_PATH=> "
)

:: Limpieza basica de comillas (por si acaso)
set "FILE_PATH=%FILE_PATH:"=%"
set "FILE_PATH=%FILE_PATH:'=%"
set "FILE_PATH=%FILE_PATH:&=%"

:: Trim simple de espacio inicial (comun en PowerShell drag/drop)
if "%FILE_PATH:~0,1%"==" " set "FILE_PATH=%FILE_PATH:~1%"

if "%FILE_PATH%"=="" goto error

echo.
echo Archivo seleccionado: "%FILE_PATH%"
echo.

set "PERSONA=aria"
set /p "PERSONA=Elige guia (aria, ziro, eter, gaia) [default: aria]: "

:: Definir directorio de salida fijo
set "OUTPUT_DIR=C:\Mis Cosas\Proyectos\paziify-audio\audiobooks"
for %%F in ("%FILE_PATH%") do set "FILENAME=%%~nF"
set "OUTPUT_FILE=%OUTPUT_DIR%\%FILENAME%.mp3"

echo.
echo Generando audio...
echo Input: "%FILE_PATH%"
echo Output: "%OUTPUT_FILE%"
echo Guia: %PERSONA%
echo.

python scripts/generate_audiobook.py "%FILE_PATH%" "%OUTPUT_FILE%" --persona %PERSONA%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [EXITO] Audio generado correctamente.
) else (
    echo.
    echo [ERROR] Algo salio mal.
)
echo.
pause
exit /b

:error
echo [ERROR] No has indicado ningun archivo.
pause
exit /b
