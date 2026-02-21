const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/newSessionsGenerated.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Mapping for category-based folders
const CATEGORY_MAP = {
    'ansiedad': 'calmasos',
    'calmasos': 'calmasos',
    'despertar': 'despertar',
    'sueno': 'sueno',
    'mindfulness': 'mindfulness',
    'resiliencia': 'resiliencia',
    'salud': 'salud',
    'rendimiento': 'rendimiento',
    'emocional': 'emocional',
    'kids': 'kids',
    'habitos': 'habitos'
};

const processedData = data.map(session => {
    const category = session.category.toLowerCase();
    const folder = CATEGORY_MAP[category] || 'general';

    // Extract ID (first 2 digits) and clean title
    const idNum = session.id.split('_')[0].padStart(4, '0');
    const cleanTitle = session.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-h0-9]/g, "-") // Simplified but similar to sync_sessions_v4
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const fileName = `${idNum}-${cleanTitle}`;

    if (session.audioLayers && session.audioLayers.voiceTrack) {
        session.audioLayers.voiceTrack = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/${folder}/${fileName}.mp3`;
    }

    // Update thumbnail if exists
    if (session.thumbnailUrl) {
        session.thumbnailUrl = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/${folder}/${fileName}.webp`;
    }

    return session;
});

fs.writeFileSync(filePath, JSON.stringify(processedData, null, 2));
console.log('✅ newSessionsGenerated.json rectified with Oasis strategy.');
