const fs = require('fs');

const content = fs.readFileSync('src/data/sessionsData.ts', 'utf-8');

// Match all session objects by looking for the blocks between { and } in the array
// We'll split the file by the array start and end to isolate the data
const arrayStart = content.indexOf('export const MEDITATION_SESSIONS');
const arrayEnd = content.lastIndexOf('];');
const sessionsArrayStr = content.substring(arrayStart, arrayEnd);

// Standardize guides
const mapping = {
    'calm': 'Aria',
    'standard': 'Ziro',
    'deep': 'Éter',
    'energizing': 'Gaia',
    'kids': 'Gaia'
};

const guideByVoice = {
    'es-ES-Wavenet-F': 'Aria',
    'es-ES-Neural2-G': 'Ziro',
    'es-ES-Studio-F': 'Éter',
    'es-ES-Wavenet-H': 'Gaia'
};

// Capture sessions using a simple block matcher
const sessionBlocks = sessionsArrayStr.split(/\},?\s*\{/);

const audit = [];

sessionBlocks.forEach((block, index) => {
    try {
        const idMatch = block.match(/"id":\s*"([^"]+)"/);
        const titleMatch = block.match(/"title":\s*"([^"]+)"/);
        const catMatch = block.match(/"category":\s*"([^"]+)"/);
        const styleMatch = block.match(/"voiceStyle":\s*"([^"]+)"/);
        const creatorMatch = block.match(/"creatorName":\s*"([^"]+)"/);

        if (!idMatch || !titleMatch) return;

        const id = idMatch[1];
        const title = titleMatch[1];
        const category = catMatch ? catMatch[1] : 'general';
        const style = styleMatch ? styleMatch[1] : 'standard';

        // Logical guide assignment
        let assignedGuide = mapping[style] || 'Ziro';
        if (category === 'sueño') assignedGuide = 'Éter';
        if (category === 'despertar') assignedGuide = 'Gaia';
        if (category === 'mindfulness') assignedGuide = 'Aria';
        if (category === 'kids') assignedGuide = 'Gaia';

        const num = (index + 1).toString().padStart(3, '0');
        const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

        const newFileName = `${category}_${assignedGuide.toLowerCase()}_${num}_${sanitizedTitle}.mp3`;

        audit.push({
            id,
            title,
            category,
            guide: assignedGuide,
            newFileName
        });
    } catch (e) { }
});

console.log('| ID | Título | Categoría | Guía Asignado | Nuevo Nombre Archivo |');
console.log('|----|--------|-----------|---------------|----------------------|');
audit.forEach(s => {
    console.log(`| ${s.id} | ${s.title} | ${s.category} | **${s.guide}** | \`${s.newFileName}\` |`);
});

console.log(`\nTotal sesiones auditadas: ${audit.length}`);
