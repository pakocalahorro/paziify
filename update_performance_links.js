const fs = require('fs');
const path = require('path');

const filePath = './src/data/sessionsData.ts';
const supabaseBaseUrl = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/';

const mapping = {
    '51_flow_state': 'rendimiento_ziro_080_flow-state-inmersion-total.webp',
    '52_concentracion_laser': 'rendimiento_ziro_081_concentracion-laser.webp',
    '53_preparacion_creatividad': 'rendimiento_ziro_082_preparacion-para-la-creatividad.webp',
    '54_enfoque_estudiar': 'rendimiento_ziro_083_enfoque-antes-de-estudiar.webp'
};

function updateLinks() {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [sessionId, fileName] of Object.entries(mapping)) {
        const fullUrl = `${supabaseBaseUrl}${fileName}`;

        const idStr = `"id": "${sessionId}"`;
        const idIndex = content.indexOf(idStr);

        if (idIndex !== -1) {
            const nextPractice = content.indexOf('"practiceInstruction":', idIndex);
            if (nextPractice !== -1) {
                const lineEnd = content.indexOf('\n', nextPractice);
                const absoluteEnd = lineEnd !== -1 ? lineEnd : nextPractice + 50;

                // Check if already has thumbnailUrl
                const snippet = content.substring(absoluteEnd, absoluteEnd + 200);
                if (!snippet.includes('"thumbnailUrl"')) {
                    const insertion = `,\n    "thumbnailUrl": "${fullUrl}"`;
                    content = content.substring(0, absoluteEnd) + insertion + content.substring(absoluteEnd);
                    console.log(`✨ Insertado: ${sessionId}`);
                } else {
                    // Replace existing
                    const thumbStart = snippet.indexOf('"thumbnailUrl":');
                    const nextLine = snippet.indexOf('\n', thumbStart);
                    const absoluteThumbStart = absoluteEnd + thumbStart;
                    const absoluteThumbEnd = nextLine !== -1 ? absoluteEnd + nextLine : absoluteEnd + thumbStart + 100;

                    const newEntry = `"thumbnailUrl": "${fullUrl}"`;
                    content = content.substring(0, absoluteThumbStart) + newEntry + content.substring(absoluteThumbEnd);
                    console.log(`✅ Actualizado: ${sessionId}`);
                }
            }
        } else {
            console.log(`❌ No se encontró la sesión: ${sessionId}`);
        }
    }

    fs.writeFileSync(filePath, content);
}

updateLinks();
