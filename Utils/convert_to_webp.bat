@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo      CONVERTIDOR A WEBP (Paziify)
echo ===================================================
echo.

set "FILE_PATH="

:: 1. Si se arrastro el archivo sobre el icono del .bat
if not "%~1"=="" set "FILE_PATH=%~1"

:: 2. Si no, pedirlo por pantalla
if "%FILE_PATH%"=="" (
    echo Por favor, arrastra aqui tu imagen JPG/PNG.
    echo.
    set /p "FILE_PATH=> "
)

:: Limpieza basica de comillas
if defined FILE_PATH (
    set "FILE_PATH=%FILE_PATH:"=%"
)

if "%FILE_PATH%"=="" goto error

echo.
echo Procesando...
echo.
cd..
python scripts/img_to_webp.py "%FILE_PATH%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Asegurate de tener Pillow instalado:
    echo pip install Pillow
    echo.
) else (
    echo.
    echo [EXITO] Imagen convertida.
)

echo.
pause
exit /b

:error
echo [ERROR] No has indicado ningun archivo.
pause
