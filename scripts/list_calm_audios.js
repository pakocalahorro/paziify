const fs = require('fs');
const path = require('path');

const SCRIPTS_ROOT = 'docs/scripts';
const OUTPUT_DIR = 'assets/voice-tracks';

function getCalmFiles() {
    const calmFiles = [];
    const walk = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.md')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                let style = 'calm';

                // Mimicking the logic in generate_guided_audio.py
                if (content.toLowerCase().includes('energ') ||
                    content.toLowerCase().includes('foco') ||
                    content.toLowerCase().includes('poder') ||
                    content.toLowerCase().includes('rendimiento')) {
                    style = 'standard';
                }
                if (content.toLowerCase().includes('sueño') ||
                    content.toLowerCase().includes('descanso') ||
                    content.toLowerCase().includes('resiliencia') ||
                    content.toLowerCase().includes('avanzado')) {
                    style = 'deep';
                }
                if (fullPath.toLowerCase().includes('kids') || content.toLowerCase().includes('niños')) {
                    style = 'kids';
                }

                if (style === 'calm') {
                    const audioName = path.basename(file, '.md') + '_voices.mp3';
                    calmFiles.push(audioName);
                }
            }
        }
    };

    walk(SCRIPTS_ROOT);
    return calmFiles;
}

const list = getCalmFiles();
console.log('--- AUDIOS GENERADOS CON VOZ FEMENINA CALM (F5) ---');
list.forEach(f => console.log(f));
console.log(`Total: ${list.length} audios.`);
