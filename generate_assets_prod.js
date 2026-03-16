
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_SOURCE = "C:\\Mis Cosas\\Proyectos\\Paziify-files\\logo_paziify.png";
const ASSETS_DIR = path.join(__dirname, 'assets');

async function generateAssets() {
    console.log('--- Iniciando generación de assets de producción ---');
    
    try {
        if (!fs.existsSync(LOGO_SOURCE)) {
            throw new Error(`Logo de origen no encontrado en: ${LOGO_SOURCE}`);
        }
        if (!fs.existsSync(ASSETS_DIR)) {
            fs.mkdirSync(ASSETS_DIR, { recursive: true });
        }

        // 1. icon.png (1024x1024)
        console.log('Generando icon.png...');
        await sharp(LOGO_SOURCE)
            .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(ASSETS_DIR, 'icon.png'));

        // 2. adaptive-icon.png (1024x1024)
        console.log('Generando adaptive-icon.png...');
        await sharp(LOGO_SOURCE)
            .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));

        // 3. splash-icon.png (2048x2048)
        console.log('Generando splash-icon.png...');
        await sharp(LOGO_SOURCE)
            .resize(2048, 2048, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));

        // 4. favicon.png (48x48)
        console.log('Generando favicon.png...');
        await sharp(LOGO_SOURCE)
            .resize(48, 48)
            .toFile(path.join(ASSETS_DIR, 'favicon.png'));

        console.log('--- Assets generados con éxito en /assets ---');
    } catch (error) {
        console.error('Error generando assets:', error.message);
        process.exit(1);
    }
}

generateAssets();
