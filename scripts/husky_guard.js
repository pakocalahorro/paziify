const { execSync } = require('child_process');

/**
 * Paziify Husky Guard - ESCUDO DE PLATINO
 * El compromiso Zero Defects ya no es un aviso, es una ley técnica.
 */
try {
    const changedFiles = execSync('git diff --cached --name-only').toString();

    if (changedFiles.includes('src/screens/')) {
        console.log('\x1b[31m%s\x1b[0m', '\n❌ [PAZIIFY GUARD]: BLOQUEO DE SEGURIDAD ACTIVADO.');
        console.log('\x1b[33m%s\x1b[0m', 'Se han detectado cambios en archivos de pantalla (src/screens/).');
        console.log('\x1b[36m%s\x1b[0m', 'LEY ZERO DEFECTOS: El commit ha sido ABORTADO.');
        console.log('PARA CONTINUAR: Debes generar y validar el Snapshot JSON estructural previo.');
        console.log('Consulta el protocolo forzoso en: docs/guides/CONTRIBUTING.md\n');

        // BLOQUEO FORZOSO: Salida con error para detener el commit.
        process.exit(1);
    }
} catch (e) {
    if (e.status === 1) process.exit(1);
    // Silencio para otros errores menores de git
}
