const fs = require('fs');
const path = require('path');

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

const CONTENT_PATH = 'src/data/sessionsData.ts';
const VOICE_TRACKS_DIR = 'assets/voice-tracks';
const TARGET_DIR = 'assets/voice-tracks-renamed';

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR);
}

const content = fs.readFileSync(CONTENT_PATH, 'utf-8');
const arrayMatch = content.match(/export const MEDITATION_SESSIONS: MeditationSession\[\] = \[([\s\S]*?)\];/);

if (!arrayMatch) {
    console.error('Could not find sessions array');
    process.exit(1);
}

const sessionsStr = arrayMatch[1];
const sessionBlocks = [];
let depth = 0;
let current = "";
let inString = false;

for (let i = 0; i < sessionsStr.length; i++) {
    const char = sessionsStr[i];
    if (char === '"') inString = !inString;
    if (!inString) {
        if (char === '{') { if (depth === 0) current = ""; depth++; }
        if (char === '}') depth--;
    }
    current += char;
    if (!inString && depth === 0 && char === '}' && current.trim()) {
        sessionBlocks.push(current);
        current = "";
    }
}

console.log(`Processing ${sessionBlocks.length} sessions...`);

sessionBlocks.forEach((block, index) => {
    const idMatch = block.match(/"id":\s*"([^"]+)"/);
    const titleMatch = block.match(/"title":\s*"([^"]+)"/);
    const catMatch = block.match(/"category":\s*"([^"]+)"/);
    const creatorMatch = block.match(/"creatorName":\s*"([^"]+)"/);

    if (!idMatch || !titleMatch) return;

    const id = idMatch[1];
    const title = titleMatch[1];
    const category = catMatch ? catMatch[1] : 'calmasos';
    const guideName = creatorMatch ? creatorMatch[1] : 'Aria';

    let displayCategory = category === 'ansiedad' ? 'calmasos' : category;
    displayCategory = displayCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize 'sueño' to 'sueno'

    // Original source filename
    let sourceFile = `${id}_voices.mp3`;

    // New target filename (matching sync_sessions logic)
    const num = (index + 1).toString().padStart(3, '0');
    const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

    let targetFileName = "";
    if (technicalIds.includes(id)) {
        targetFileName = `${displayCategory}_tecnica_${num}_${sanitizedTitle}.mp3`;
    } else {
        const guideFolder = guideName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        targetFileName = `${displayCategory}_${guideFolder}_${num}_${sanitizedTitle}.mp3`;
    }

    const sourcePath = path.join(VOICE_TRACKS_DIR, sourceFile);
    const targetPath = path.join(TARGET_DIR, targetFileName);

    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ [${num}] ${sourceFile} -> ${targetFileName}`);
    } else {
        console.warn(`❌ [${num}] Source not found: ${sourcePath}`);
    }
});

console.log(`\n✨ Done! New files are in: ${TARGET_DIR}`);
console.log(`🚀 Next step: Upload all files from ${TARGET_DIR} to Supabase bucket 'meditation-voices'`);
