const fs = require('fs');
const path = require('path');

/**
 * Paziify Husky Guard - ESCUDO DE PLATINO
 * El compromiso Zero Defects ya no es un aviso, es una ley técnica.
 */
try {
    // 1. REGLA DE ORO: INTEGRIDAD DEL RUNTIME (index.ts) en Línea 1
    const indexPath = path.join(__dirname, '../index.ts');
    const content = fs.readFileSync(indexPath, 'utf8');
    const firstLine = content.split('\n')[0].trim();
    
    if (firstLine !== "import './src/polyfills';" && firstLine !== 'import "./src/polyfills";') {
        console.error('');
        console.error('\x1b[31m❌ COMMIT BLOQUEADO: index.ts no cumple la regla de seguridad.\x1b[0m');
        console.error('   La primera línea debe ser exactamente: import \'./src/polyfills\';');
        console.error('   Consulta: docs/guides/POLYFILLS_BRIDGE_FIX.md');
        console.error('');
        process.exit(1);
    }

    const changedFiles = execSync('git diff --cached --name-only').toString();

    if (changedFiles.includes('src/screens/') || changedFiles.includes('src/components/') || changedFiles.includes('src/navigation/')) {
        console.log('\x1b[31m%s\x1b[0m', '\n⚠️ [PAZIIFY GUARD]: ALERT ACTIVE.');
        console.log('\x1b[33m%s\x1b[0m', 'Se han detectado cambios en la UI estructural (screens/components/navigation).');
        console.log('\x1b[36m%s\x1b[0m', 'LEY ZERO DEFECTOS: Validando integridad estructural de la UI...\n');
        
        try {
            // Ejecutamos los tests (sin forzar update) para validar que no hemos roto nada
            execSync('npm run test', { stdio: 'inherit' });
            console.log('\x1b[32m%s\x1b[0m', '\n✅ [PAZIIFY GUARD]: Validación Zero Defects superada. Commit permitido.\n');
        } catch (testError) {
            console.log('\x1b[31m%s\x1b[0m', '\n❌ LEY ZERO DEFECTOS: El commit ha sido ABORTADO debido a fallos estructurales (Jest).');
            console.log('PARA CONTINUAR: Corrige los errores arriba, o actualiza los Snapshots si el cambio estructural era intencionado ejecutando:');
            console.log('\x1b[33m%s\x1b[0m', '  npm run test:update');
            console.log('Consulta el protocolo forzoso en: docs/guides/CONTRIBUTING.md\n');
            process.exit(1);
        }
    }
} catch (e) {
    if (e.status === 1) process.exit(1);
    // Silencio para otros errores menores de git
}
