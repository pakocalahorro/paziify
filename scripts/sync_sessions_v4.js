const fs = require('fs');

const CONTENT_PATH = 'src/data/sessionsData.ts';
const content = fs.readFileSync(CONTENT_PATH, 'utf-8');

const technicalIds = [
    'anx_478', 'anx_box', 'anx_sigh', 'wake_bellows', 'wake_sun',
    'sleep_nsdr', 'sleep_478_night', 'mind_open', 'mind_breath',
    'res_stoic', 'res_gratitude', 'res_vagus', 'anx_sos',
    'anx_calm_ocean', 'sleep_yoganidra', 'sleep_soft_rain',
    'wake_espresso', 'mind_sky'
];

const mapping = {
    'calm': 'Aria',
    'standard': 'Ziro',
    'deep': 'Éter',
    'energizing': 'Gaia',
    'kids': 'Gaia'
};

const guideCredentials = {
    'Aria': 'Guía Especialista en Mindfulness',
    'Ziro': 'Guía de Resiliencia y Enfoque',
    'Éter': 'Guía de Sueño y Alivio Profundo',
    'Gaia': 'Guía de Energía y Conexión',
    'Paziify Team': 'Protocolo Técnico Paziify'
};

function sanitize(text) {
    return text.toLowerCase()
        .replace(/ñ/g, 'n') // Explicitly handle ñ
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, '-')    // Replace any non-alphanumeric with a dash
        .replace(/^-+|-+$/g, '');       // Trim dashes from start and end
}

// 1. Extract prefix and suffix around the main array
const arrayHeader = 'export const MEDITATION_SESSIONS: MeditationSession[] = [';
const arrayFooter = '];';

const startIndex = content.indexOf(arrayHeader);
const endIndex = content.lastIndexOf(arrayFooter);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find array delimiters');
    process.exit(1);
}

const prefix = content.substring(0, startIndex + arrayHeader.length);
const suffix = content.substring(endIndex);
const innerContent = content.substring(startIndex + arrayHeader.length, endIndex);

const sessions = [];
let depth = 0;
let start = -1;
let inString = false;
let escape = false;

for (let i = 0; i < innerContent.length; i++) {
    const char = innerContent[i];
    if (char === '"' && !escape) inString = !inString;
    if (char === '\\' && !escape) escape = true; else escape = false;

    if (!inString) {
        if (char === '{') {
            if (depth === 0) start = i;
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0) {
                sessions.push(innerContent.substring(start, i + 1));
            }
        }
    }
}

const updatedSessions = sessions.map((s, index) => {
    const idMatch = s.match(/"id":\s*"([^"]+)"/);
    const titleMatch = s.match(/"title":\s*"([^"]+)"/);
    const catMatch = s.match(/"category":\s*"([^"]+)"/);
    const styleMatch = s.match(/"voiceStyle":\s*"([^"]+)"/);

    if (!idMatch) return s;

    const id = idMatch[1];
    const title = titleMatch[1];
    let category = catMatch ? catMatch[1] : 'calmasos';
    if (category === 'ansiedad') category = 'calmasos';
    const style = styleMatch ? styleMatch[1] : 'standard';
    const isTechnical = technicalIds.includes(id);

    let guide = '';
    if (isTechnical) {
        guide = 'Paziify Team';
    } else {
        guide = mapping[style] || 'Ziro';
        if (category === 'sueño') guide = 'Éter';
        if (category === 'despertar') guide = 'Gaia';
        if (category === 'mindfulness') guide = 'Aria';
        if (category === 'kids') guide = 'Gaia';
    }

    const num = (index + 1).toString().padStart(3, '0');
    const sanitizedTitle = sanitize(title);

    // Also sanitize category prefix for URL
    const sanitizedCategory = sanitize(category);

    const tag = isTechnical ? 'tecnica' : sanitize(guide);
    const fileName = `${sanitizedCategory}_${tag}_${num}_${sanitizedTitle}.mp3`;
    const url = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/${fileName}`;

    let updated = s;
    updated = updated.replace(/"category":\s*"ansiedad"/, `"category": "calmasos"`);
    updated = updated.replace(/"creatorName":\s*".*?"/, `"creatorName": "${guide}"`);
    updated = updated.replace(/"creatorCredentials":\s*".*?"/, `"creatorCredentials": "${guideCredentials[guide]}"`);
    updated = updated.replace(/"voiceTrack":\s*"(.*?)"/, `"voiceTrack": "${url}"`);
    if (isTechnical && !updated.includes('"isTechnical":')) {
        updated = updated.replace(/"visualSync":/, `"isTechnical": true,\n    "visualSync":`);
    }
    return updated;
});

const finalContent = prefix + "\n  " + updatedSessions.join(',\n  ') + "\n" + suffix;
fs.writeFileSync(CONTENT_PATH, finalContent, 'utf-8');

// Update reports
const auditReportPath = 'docs/guides/audit_report_sessions.md';
const renameGuidePath = 'docs/guides/supabase_rename_guide.md';

let report = '# Informe de Reorganización: Técnicas vs Guiadas (v2 - No Ñ)\n\n';
report += '## Sesiones Técnicas (Core Paziify)\n';
report += '| ID | Título | Sub-categoría | Nomenclatura |\n';
report += '|----|--------|---------------|--------------|\n';

const renameTable = [];

updatedSessions.forEach((s) => {
    const id = s.match(/"id":\s*"([^"]+)"/)[1];
    const title = s.match(/"title":\s*"([^"]+)"/)[1];
    const category = s.match(/"category":\s*"([^"]+)"/)[1];
    const guide = s.match(/"creatorName":\s*".*?"/)[0].split('"')[3];
    const url = s.match(/"voiceTrack":\s*"(.*?)"/)[1];
    const fileName = url.split('/').pop();
    const isTechnical = technicalIds.includes(id);

    renameTable.push({ old: `${id}_voices.mp3`, new: fileName, isTechnical, id, title, category, guide });
});

renameTable.filter(s => s.isTechnical).forEach(s => {
    report += `| ${s.id} | ${s.title} | ${s.category} | \`${s.new}\` |\n`;
});

report += '\n## Sesiones Guiadas (Biblioteca Premium)\n';
report += '| ID | Título | Guía | Nomenclatura |\n';
report += '|----|--------|------|--------------|\n';
renameTable.filter(s => !s.isTechnical).forEach(s => {
    report += `| ${s.id} | ${s.title} | **${s.guide}** | \`${s.new}\` |\n`;
});

fs.writeFileSync(auditReportPath, report, 'utf8');

let renameMd = '# Guía de Renombrado en Supabase (v2 - Sin Ñ en archivos)\n\n| Archivo Original | Nuevo Nombre |\n|------------------|--------------|\n';
renameTable.forEach(row => {
    renameMd += `| ${row.old} | ${row.new} |\n`;
});
fs.writeFileSync(renameGuidePath, renameMd, 'utf8');

console.log('🚀 Final synchronization complete. All "ñ" removed from storage URLs.');
