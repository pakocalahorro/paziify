const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const artifactsDir = 'C:\\Users\\Paco.PCCASA\\.gemini\\antigravity\\brain\\9c8c5f20-7c93-46cf-b658-63e6be85b604';
const outputDir = 'C:\\Mis Cosas\\Proyectos\\paziify-images\\meditation-thumbnails\\webp-optimized';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const mapping = [
    ['mindfulness_monitorizacion_abierta_base_1770216471514.png', 'mind_open_optimized.webp'],
    ['mindfulness_anclaje_respiracion_base_1770216496478.png', 'mind_breath_optimized.webp'],
    ['mindfulness_mente_cielo_base_retry_1770216538512.png', 'mind_sky_optimized.webp'],
    ['mindfulness_anapanasati_vela_base_1770216511436.png', '31_mindfulness_respiracion_optimized.webp'],
    ['mindfulness_escaner_corporal_base_1770216555646.png', '32_escaner_corporal_optimized.webp'],
    ['mindfulness_observador_pensamientos_base_1770216570883.png', '33_observador_pensamientos_optimized.webp'],
    ['mindfulness_observador_imparcial_base_1770216602684.png', '34_observador_imparcial_optimized.webp'],
    ['mindfulness_sonidos_ondas_base_1770216617032.png', '35_mindfulness_sonidos_optimized.webp'],
    ['mindfulness_consciencia_sensaciones_base_1770216636957.png', '36_consciencia_sensaciones_optimized.webp'],
    ['mindfulness_caminata_consciente_base_1770216662806.png', '37_caminata_consciente_optimized.webp'],
    ['mindfulness_pausa_pensamientos_base_1770216677746.png', '38_pausa_pensamientos_optimized.webp'],
    ['mindfulness_vipassana_bosque_base_1770216693384.png', '39_vipassana_cuerpo_optimized.webp'],
    ['mindfulness_presencia_ahora_base_1770216713744.png', '40_presencia_ahora_optimized.webp']
];

async function optimize() {
    for (const [inputName, outputName] of mapping) {
        const inputPath = path.join(artifactsDir, inputName);
        const outputPath = path.join(outputDir, outputName);

        try {
            await sharp(inputPath)
                .resize(800, 800, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 80 })
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            console.log(`Optimized: ${outputName} (${(stats.size / 1024).toFixed(2)} KB)`);
        } catch (err) {
            console.error(`Error optimizing ${inputName}:`, err);
        }
    }
}

optimize();
