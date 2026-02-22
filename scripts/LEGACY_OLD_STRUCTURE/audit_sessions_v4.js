const fs = require('fs');

const content = fs.readFileSync('src/data/sessionsData.ts', 'utf-8');

const technicalIds = [
    'anx_478', 'anx_box', 'anx_sigh', 'wake_bellows', 'wake_sun',
    'sleep_nsdr', 'sleep_478_night', 'mind_open', 'mind_breath',
    'res_stoic', 'res_gratitude', 'res_vagus', 'anx_sos',
    'anx_calm_ocean', 'sleep_yoganidra', 'sleep_soft_rain',
    'wake_espresso', 'mind_sky'
];

const arrayStart = content.indexOf('export const MEDITATION_SESSIONS');
const arrayEnd = content.lastIndexOf('];');
const sessionsArrayStr = content.substring(arrayStart, arrayEnd);
const sessionBlocks = sessionsArrayStr.split(/\},?\s*\{/);

const audit = [];
const mapping = {
    'calm': 'Aria',
    'standard': 'Ziro',
    'deep': 'Éter',
    'energizing': 'Gaia',
    'kids': 'Gaia'
};

sessionBlocks.forEach((block, index) => {
    try {
        const idMatch = block.match(/"id":\s*"([^"]+)"/);
        const titleMatch = block.match(/"title":\s*"([^"]+)"/);
        const catMatch = block.match(/"category":\s*"([^"]+)"/);
        const styleMatch = block.match(/"voiceStyle":\s*"([^"]+)"/);

        if (!idMatch || !titleMatch) return;

        const id = idMatch[1];
        const title = titleMatch[1];
        const category = catMatch ? catMatch[1] : 'general';
        const style = styleMatch ? styleMatch[1] : 'standard';

        const isTechnical = technicalIds.includes(id);
        let assignedGuide = '';
        let newFileName = '';

        const num = (index + 1).toString().padStart(3, '0');
        const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

        if (isTechnical) {
            assignedGuide = 'Sistema (Técnica)';
            // Pattern: [seccion]_tecnica_[num]_[titulo].mp3
            newFileName = `${category}_tecnica_${num}_${sanitizedTitle}.mp3`;
        } else {
            assignedGuide = mapping[style] || 'Ziro';
            if (category === 'sueño') assignedGuide = 'Éter';
            if (category === 'despertar') assignedGuide = 'Gaia';
            if (category === 'mindfulness') assignedGuide = 'Aria';
            if (category === 'kids') assignedGuide = 'Gaia';

            // Pattern: [seccion]_[guia]_[num]_[titulo].mp3
            newFileName = `${category}_${assignedGuide.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_${num}_${sanitizedTitle}.mp3`;
        }

        audit.push({
            id,
            title,
            category,
            guide: assignedGuide,
            isTechnical,
            newFileName
        });
    } catch (e) { }
});

console.log('# Informe de Reorganización: Técnicas vs Guiadas (V4)\n');
console.log('## Sesiones Técnicas (Core Paziify)');
console.log('| ID | Título | Sub-categoría | Nomenclatura (Simplificada) |');
console.log('|----|--------|---------------|-----------------------------|');
audit.filter(s => s.isTechnical).forEach(s => {
    console.log(`| ${s.id} | ${s.title} | ${s.category} | \`${s.newFileName}\` |`);
});

console.log('\n## Sesiones Guiadas (Biblioteca Premium)');
console.log('| ID | Título | Guía | Nomenclatura |');
console.log('|----|--------|------|--------------|');
audit.filter(s => !s.isTechnical).forEach(s => {
    console.log(`| ${s.id} | ${s.title} | **${s.guide}** | \`${s.newFileName}\` |`);
});

console.log(`\n**Resumen:** Técnicas (${audit.filter(s => s.isTechnical).length}) | Guiadas (${audit.filter(s => !s.isTechnical).length}) | Total: ${audit.length}`);
