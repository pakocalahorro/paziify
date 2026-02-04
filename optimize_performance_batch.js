const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const mapping = require('./performance_mapping');

const inputDir = './temp_rendimiento/';
const outputDir = './src/assets/meditation/webp-optimized/';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processBatch() {
    console.log('Iniciando optimización de Rendimiento (Bloque 1)...');

    for (const item of mapping) {
        const inputPath = path.join(inputDir, item.temp);
        const outputPath = path.join(outputDir, item.final);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️ Archivo no encontrado: ${item.temp}`);
            continue;
        }

        let quality = 80;
        let buffer;
        let sizeKB;

        do {
            buffer = await sharp(inputPath)
                .resize(800, 800, { fit: 'cover' })
                .webp({ quality })
                .toBuffer();

            sizeKB = buffer.length / 1024;
            if (sizeKB > 80) {
                quality -= 5;
            }
        } while (sizeKB > 80 && quality > 10);

        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Procesado: ${item.final} (${Math.round(sizeKB)}KB, Calidad: ${quality})`);
    }

    console.log('🚀 ¡Optimización parcial completada!');
}

processBatch();
