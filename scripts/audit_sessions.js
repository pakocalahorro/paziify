const fs = require('fs');

// We don't import directly to avoid TS/ESM issues in a raw script if not configured
const content = fs.readFileSync('src/data/sessionsData.ts', 'utf-8');

// Primitive extraction of sessions
// We look for objects between { and } inside the MEDITATION_SESSIONS array
const sessionRegex = /\{[\s\S]*?"id":\s*"([\w_]+)"[\s\S]*?"title":\s*"(.*?)"[\s\S]*?"category":\s*"(.*?)"[\s\S]*?"voiceStyle":\s*"(.*?)"[\s\S]*?creatorName":\s*"(.*?)"[\s\S]*?\}/g;

let matches;
const sessions = [];
while ((matches = sessionRegex.exec(content)) !== null) {
    sessions.push({
        id: matches[1],
        title: matches[2],
        category: matches[3],
        voiceStyle: matches[4],
        currentCreator: matches[5]
    });
}

const mapping = {
    'calm': 'Aria',
    'standard': 'Ziro',
    'deep': 'Éter',
    'energizing': 'Ziro', // Standardized to Ziro for now as we don't have a specific 5th name
    'kids': 'Gaia'
};

console.log('| ID | Título | Categoría | Guía Sugerido | Nuevo Nombre Archivo |');
console.log('|----|--------|-----------|---------------|----------------------|');

sessions.forEach((s, index) => {
    const guide = mapping[s.voiceStyle] || 'Éter';
    const num = (index + 1).toString().padStart(2, '0');
    // Sanitize title for filename
    const sanitizedTitle = s.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
    const newName = `${s.category}_${guide.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_${num}_${sanitizedTitle}.mp3`;

    console.log(`| ${s.id} | ${s.title} | ${s.category} | **${guide}** | \`${newName}\` |`);
});

console.log(`\nTotal sesiones auditadas: ${sessions.length}`);
