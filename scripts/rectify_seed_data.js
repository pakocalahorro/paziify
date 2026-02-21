const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scripts/seed_data.json');
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

const processedSessions = data.sessions.map(session => {
    const category = session.category.toLowerCase();
    const folder = CATEGORY_MAP[category] || 'general';

    // Normalize filename logic
    let fileName = '';

    // Try to guess filename from current URL if possible, or build from title
    if (session.audioLayers && session.audioLayers.voiceTrack) {
        const urlPart = session.audioLayers.voiceTrack.split('/').pop();
        fileName = urlPart.replace('.mp3', '');
    } else {
        const idNum = session.id.includes('_') ? session.id.split('_')[0].padStart(4, '0') : '0000';
        const cleanTitle = session.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-h0-9]/g, "-")
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        fileName = `${idNum}-${cleanTitle}`;
    }

    if (session.audioLayers && session.audioLayers.voiceTrack) {
        session.audioLayers.voiceTrack = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/${folder}/${fileName}.mp3`;
    }

    if (session.thumbnailUrl && session.thumbnailUrl.includes('supabase')) {
        session.thumbnailUrl = `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/${folder}/${fileName}.webp`;
    }

    return session;
});

data.sessions = processedSessions;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('✅ seed_data.json rectified with Oasis strategy.');
