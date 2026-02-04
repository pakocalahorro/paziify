const fs = require('fs');
const path = require('path');

const filePath = './src/data/sessionsData.ts';
const supabaseBaseUrl = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/';

const mapping = {
    'res_gratitude': 'resiliencia_tecnica_011_gratitud-recableado.webp',
    'res_vagus': 'resiliencia_tecnica_012_tonificacion-del-vago.webp',
    '41_ciudadela': 'resiliencia_eter_090_la-ciudadela-interior.webp',
    '42_cambio': 'resiliencia_eter_091_gestion-del-cambio.webp',
    '43_gratitud': 'resiliencia_eter_092_gratitud-radical.webp',
    '44_transformar_fracaso': 'resiliencia_eter_093_transformar-el-fracaso.webp', // Ajustado ID real
    '45_observador_tormenta': 'resiliencia_eter_094_el-observador-de-la-tormenta.webp', // Ajustado ID real
    '46_fortaleza_adversidad': 'resiliencia_eter_095_fortaleza-ante-la-adversidad.webp', // Ajustado ID real
    '47_autocompasion_error': 'resiliencia_eter_096_autocompasion-ante-el-error.webp', // Ajustado ID real
    '48_desaprender_juicio': 'resiliencia_eter_097_desaprender-el-juicio.webp', // Ajustado ID real
    '49_ecuanimidad_caos': 'resiliencia_eter_098_ecuanimidad-en-el-caos.webp', // Ajustado ID real
    '50_previsualizacion_males': 'resiliencia_eter_099_previsualizacion-de-males.webp' // Ajustado ID real
};

function updateLinks() {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [sessionId, fileName] of Object.entries(mapping)) {
        const fullUrl = `${supabaseBaseUrl}${fileName}`;

        // Buscamos el bloque de la sesión por ID
        const sessionStartRegex = new RegExp(`"id":\\s*"${sessionId}"`, 'g');
        const match = sessionStartRegex.exec(content);

        if (match) {
            const startIndex = match.index;
            // Buscamos el final del objeto actual (el próximo }, que no sea de audioLayers o breathingPattern)
            // Para simplificar, buscaremos el campo "practiceInstruction" que suele ir al final
            const practiceRegex = /"practiceInstruction":\s*"[^"]*"/;
            const subContent = content.substring(startIndex);
            const practiceMatch = practiceRegex.exec(subContent);

            if (practiceMatch) {
                const practiceEndIndex = startIndex + practiceMatch.index + practiceMatch[0].length;

                // Comprobamos si ya tiene thumbnailUrl justo después
                const restOfObject = content.substring(practiceEndIndex, practiceEndIndex + 200);
                if (restOfObject.includes('"thumbnailUrl"')) {
                    // Reemplazamos el existente
                    const thumbRegex = /"thumbnailUrl":\s*"[^"]*"/;
                    const thumbMatch = thumbRegex.exec(restOfObject);
                    const oldText = thumbMatch[0];
                    const newText = `"thumbnailUrl": "${fullUrl}"`;
                    content = content.substring(0, practiceEndIndex) + restOfObject.replace(oldText, newText) + content.substring(practiceEndIndex + 200);
                    console.log(`✅ Actualizado: ${sessionId}`);
                } else {
                    // Insertamos uno nuevo después de practiceInstruction
                    const insertion = `,\n    "thumbnailUrl": "${fullUrl}"`;
                    content = content.substring(0, practiceEndIndex) + insertion + content.substring(practiceEndIndex);
                    console.log(`✨ Insertado: ${sessionId}`);
                }
            } else {
                console.log(`⚠️ No se pudo encontrar practiceInstruction para ${sessionId}`);
            }
        } else {
            console.log(`❌ No se encontró la sesión con ID: ${sessionId}`);
        }
    }

    fs.writeFileSync(filePath, content);
}

updateLinks();
