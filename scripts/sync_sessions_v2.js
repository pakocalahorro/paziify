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

// 2. Parse sessions from innerContent
// We use a robust parser to find objects
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

console.log(`Found ${sessions.length} sessions to update.`);

// 3. Update each session
const updatedSessions = sessions.map((s, index) => {
    // Extract metadata
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
    const sanitizedTitle = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');

    const tag = isTechnical ? 'tecnica' : guide.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const fileName = `${category}_${tag}_${num}_${sanitizedTitle}.mp3`;
    const url = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/${fileName}`;

    let updated = s;

    // Replace values
    updated = updated.replace(/"category":\s*"ansiedad"/, `"category": "calmasos"`);
    updated = updated.replace(/"creatorName":\s*".*?"/, `"creatorName": "${guide}"`);
    updated = updated.replace(/"creatorCredentials":\s*".*?"/, `"creatorCredentials": "${guideCredentials[guide]}"`);
    updated = updated.replace(/"voiceTrack":\s*".*?"/, `"voiceTrack": "${url}"`);

    // Ensure isTechnical is present if needed
    if (isTechnical && !updated.includes('"isTechnical":')) {
        updated = updated.replace(/"visualSync":/, `"isTechnical": true,\n    "visualSync":`);
    }

    return updated;
});

// 4. Rebuild the file
const finalContent = prefix + "\n  " + updatedSessions.join(',\n  ') + "\n" + suffix;

// Double check prefix/suffix didn't get messed up
if (finalContent.length < 50000) { // Safety check
    console.error("Critical: Resulting file is too small. Aborting.");
    process.exit(1);
}

fs.writeFileSync(CONTENT_PATH, finalContent, 'utf-8');
console.log('✅ Success: Updated all 119 sessions with new naming and guides.');
