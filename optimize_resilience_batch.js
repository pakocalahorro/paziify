const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './temp_resilience/';
const outputDir = './src/assets/meditation/webp-optimized/';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
    const files = fs.readdirSync(inputDir).filter(f => f.startsWith('resiliencia_') && f.endsWith('.png'));

    console.log(`Encontrados ${files.length} archivos para optimizar...`);

    for (const file of files) {
        const baseName = file.replace('_base.png', '').replace('.png', '');
        const outputPath = path.join(outputDir, `${baseName}.webp`);

        try {
            await sharp(path.join(inputDir, file))
                .resize(800, 800, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 80 })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            const sizeKB = Math.round(stats.size / 1024);
            console.log(`✅ Optimizado: ${file} -> ${baseName}.webp (${sizeKB}KB)`);
        } catch (err) {
            console.error(`❌ Error optimizando ${file}:`, err);
        }
    }
}

optimizeImages();
