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
        let category = catMatch ? catMatch[1] : 'general';
        const style = styleMatch ? styleMatch[1] : 'standard';

        // Transform category 'ansiedad' to 'calmasos' for file naming
        const displayCategory = category === 'ansiedad' ? 'calmasos' : category;

        const isTechnical = technicalIds.includes(id);
        let assignedGuide = '';
        let newFileName = '';

        const num = (index + 1).toString().padStart(3, '0');
        const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

        if (isTechnical) {
            assignedGuide = 'Sistema (Técnica)';
            newFileName = `${displayCategory}_tecnica_${num}_${sanitizedTitle}.mp3`;
        } else {
            assignedGuide = mapping[style] || 'Ziro';
            if (category === 'sueño') assignedGuide = 'Éter';
            if (category === 'despertar') assignedGuide = 'Gaia';
            if (category === 'mindfulness') assignedGuide = 'Aria';
            if (category === 'kids') assignedGuide = 'Gaia';

            newFileName = `${displayCategory}_${assignedGuide.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_${num}_${sanitizedTitle}.mp3`;
        }

        audit.push({
            id,
            title,
            category: displayCategory,
            guide: assignedGuide,
            isTechnical,
            newFileName
        });
    } catch (e) { }
});

let report = '# Informe de Reorganización: Técnicas vs Guiadas\n\n';
report += '## Sesiones Técnicas (Core Paziify)\n';
report += '| ID | Título | Sub-categoría | Nomenclatura |\n';
report += '|----|--------|---------------|--------------|\n';
audit.filter(s => s.isTechnical).forEach(s => {
    report += `| ${s.id} | ${s.title} | ${s.category} | \`${s.newFileName}\` |\n`;
});

report += '\n## Sesiones Guiadas (Biblioteca Premium)\n';
report += '| ID | Título | Guía | Nomenclatura |\n';
report += '|----|--------|------|--------------|\n';
audit.filter(s => !s.isTechnical).forEach(s => {
    report += `| ${s.id} | ${s.title} | **${s.guide}** | \`${s.newFileName}\` |\n`;
});

report += `\n**Resumen:** Técnicas (${audit.filter(s => s.isTechnical).length}) | Guiadas (${audit.filter(s => !s.isTechnical).length}) | Total: ${audit.length}`;

fs.writeFileSync('docs/guides/audit_report_sessions.md', report, { encoding: 'utf8' });
console.log('🚀 Report written to docs/guides/audit_report_sessions.md with UTF-8 encoding');
