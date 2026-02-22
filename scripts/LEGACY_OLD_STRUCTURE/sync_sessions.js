const fs = require('fs');

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
    'Sistema (Técnica)': 'Protocolo Técnico Paziify'
};

const CONTENT_PATH = 'src/data/sessionsData.ts';
let content = fs.readFileSync(CONTENT_PATH, 'utf-8');

// Isolate the array content
const arrayMatch = content.match(/export const MEDITATION_SESSIONS: MeditationSession\[\] = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
    console.error('Could not find MEDITATION_SESSIONS array');
    process.exit(1);
}

let sessionsArrayStr = arrayMatch[1];

// We'll use a more precise split and rebuild to avoid regex explosion
const sessions = [];
let depth = 0;
let currentSession = "";
let inString = false;
let escape = false;

// Start from inside the [ and end before the ]
for (let i = 0; i < sessionsArrayStr.length; i++) {
    const char = sessionsArrayStr[i];

    if (char === '"' && !escape) inString = !inString;
    if (char === '\\' && !escape) escape = true; else escape = false;

    if (!inString) {
        if (char === '{') {
            if (depth === 0) currentSession = ""; // Reset at start of object
            depth++;
        }
        if (char === '}') depth--;
    }

    currentSession += char;

    if (!inString && depth === 0 && char === '}' && currentSession.includes('{')) {
        sessions.push(currentSession);
        currentSession = "";
    }
}

const updatedSessions = sessions.map((sessionStr, index) => {
    const idMatch = sessionStr.match(/"id":\s*"([^"]+)"/);
    const titleMatch = sessionStr.match(/"title":\s*"([^"]+)"/);
    const catMatch = sessionStr.match(/"category":\s*"([^"]+)"/);
    const styleMatch = sessionStr.match(/"voiceStyle":\s*"([^"]+)"/);

    if (!idMatch) return sessionStr;

    const id = idMatch[1];
    const title = titleMatch[1];
    const category = catMatch ? catMatch[1] : 'calmasos';
    const style = styleMatch ? styleMatch[1] : 'standard';
    const isTechnical = technicalIds.includes(id);

    // Logic for guide and filename
    let assignedGuide = '';
    let displayCategory = category === 'ansiedad' ? 'calmasos' : category;
    displayCategory = displayCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize 'sueño' to 'sueno'
    displayCategory = displayCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize 'sueño' to 'sueno'

    if (isTechnical) {
        assignedGuide = 'Paziify Team'; // System voice but under Team
        const num = (index + 1).toString().padStart(3, '0');
        const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
        const fileName = `${displayCategory}_tecnica_${num}_${sanitizedTitle}.mp3`;
        const url = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/${fileName}`;

        let updated = sessionStr.replace(/"creatorName":\s*".*?"/, `"creatorName": "${assignedGuide}"`);
        updated = updated.replace(/"creatorCredentials":\s*".*?"/, `"creatorCredentials": "${guideCredentials['Sistema (Técnica)']}"`);
        updated = updated.replace(/"voiceTrack":\s*".*?"/, `"voiceTrack": "${url}"`);
        updated = updated.replace(/"category":\s*"ansiedad"/, `"category": "calmasos"`);

        if (!updated.includes('"isTechnical": true')) {
            updated = updated.replace(/"visualSync":/, `"isTechnical": true,\n    "visualSync":`);
        }
        return updated;
    } else {
        // IDENTITY RESCUE LOGIC:
        // 1. ZIRO (Masculine - Standard/Rendimiento) -> Sessions 080-089 and style 'standard'
        // 2. GAIA (Femenine - Kids/Energizing) -> Category 'kids' or 'despertar'
        // 3. ÉTER (Masculine - Deep/Sueño) -> Category 'sueño' or IDs 090-099
        // 4. ARIA (Femenine - Calm/Mindfulness) -> All others

        const num = (index + 1).toString().padStart(3, '0');
        const sessionNum = parseInt(num);

        if (category === 'kids') {
            assignedGuide = 'Gaia';
        } else if (category === 'despertar' || (sessionNum >= 30 && sessionNum <= 39)) {
            assignedGuide = 'Gaia';
        } else if (category === 'sueño' || (sessionNum >= 110 && sessionNum <= 119) || (sessionNum >= 6 && sessionNum <= 7)) {
            assignedGuide = 'Éter';
        } else if (category === 'resiliencia' || (sessionNum >= 90 && sessionNum <= 99) || (sessionNum >= 14 && sessionNum <= 16)) {
            assignedGuide = 'Éter'; // Correction: Resiliencia is Éter
        } else if (sessionNum >= 80 && sessionNum <= 89) {
            assignedGuide = 'Ziro'; // Rendimiento is Ziro
        } else if (sessionNum >= 100 && sessionNum <= 109) {
            assignedGuide = 'Aria'; // Salud is Aria
        } else if (style === 'standard') {
            assignedGuide = 'Ziro';
        } else if (style === 'deep') {
            assignedGuide = 'Éter';
        } else {
            assignedGuide = 'Aria';
        }

        const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
        const fileName = `${displayCategory}_${assignedGuide.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_${num}_${sanitizedTitle}.mp3`;
        const url = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/${fileName}`;

        let updated = sessionStr.replace(/"creatorName":\s*".*?"/, `"creatorName": "${assignedGuide}"`);
        updated = updated.replace(/"creatorCredentials":\s*".*?"/, `"creatorCredentials": "${guideCredentials[assignedGuide]}"`);
        updated = updated.replace(/"voiceTrack":\s*".*?"/, `"voiceTrack": "${url}"`);
        updated = updated.replace(/"category":\s*"ansiedad"/, `"category": "calmasos"`);
        return updated;
    }
});

const finalArrayStr = `[\n  ${updatedSessions.join(',\n  ')}\n]`;
const finalContent = content.replace(arrayMatch[1], finalArrayStr);

fs.writeFileSync(CONTENT_PATH, finalContent, 'utf-8');
console.log('✨ All 119 sessions updated in sessionsData.ts');
