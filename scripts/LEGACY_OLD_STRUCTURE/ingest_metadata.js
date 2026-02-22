const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '../docs/scripts');
const OUTPUT_FILE = path.join(__dirname, '../src/data/sessionsData.ts');

const CATEGORY_MAP = {
    'calma_sos': 'ansiedad',
    'despertar_energia': 'despertar',
    'sueno_descanso': 'sueño',
    'mindfulness_presencia': 'mindfulness',
    'resiliencia_poder': 'resiliencia',
    'salud_cuerpo': 'salud',
    'rendimiento_foco': 'rendimiento',
    'inteligencia_emocional': 'emocional',
    'kids_familia': 'kids',
    'habitos_estilo_vida': 'habitos'
};

const COLOR_MAP = {
    'ansiedad': '#FF6B6B',
    'despertar': '#FFD93D',
    'sueño': '#4A90E2',
    'mindfulness': '#9B59B6',
    'resiliencia': '#FF9F43',
    'salud': '#2ECC71',
    'rendimiento': '#E67E22',
    'emocional': '#F1C40F',
    'kids': '#1ABC9C',
    'habitos': '#34495E'
};

function extractMetadata(content, filePath) {
    const titleMatch = content.match(/^# Guion de Meditación: (.*)/m);
    const objectiveMatch = content.match(/^\*\*Objetivo\*\*:\s*(.*)/m);
    const categoryName = path.basename(path.dirname(filePath));
    const fileName = path.basename(filePath, '.md');

    // Extract last timestamp for duration
    const timestamps = content.match(/\((\d+):(\d+)( - (\d+):(\d+))?\)/g);
    let duration = 5; // Default
    if (timestamps) {
        const last = timestamps[timestamps.length - 1];
        const parts = last.match(/(\d+):(\d+)/);
        if (parts) {
            duration = Math.ceil(parseInt(parts[1]) + parseInt(parts[2]) / 60);
        }
    }

    const category = CATEGORY_MAP[categoryName] || 'mindfulness';

    return {
        id: fileName, // Using filename as ID for consistency with audio
        title: titleMatch ? titleMatch[1].trim() : fileName,
        description: objectiveMatch ? objectiveMatch[1].trim() : 'Sesión guiada profesional.',
        durationMinutes: duration,
        category: category,
        moodTags: [category],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: `https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/${fileName}_voices.mp3`,
            defaultSoundscape: 'meditation_bowls'
        },
        creatorName: 'Paziify Team',
        creatorCredentials: 'Mindfulness Specialists',
        scientificBenefits: 'Basado en protocolos clínicos de regulación emocional y bio-feedback.',
        breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
        voiceStyle: 'calm',
        isPremium: false,
        color: COLOR_MAP[category] || '#9B59B6',
        practiceInstruction: 'Cierra los ojos y déjate guiar por la voz.'
    };
}

function generate() {
    console.log('📖 Parsing scripts...');
    const result = [];
    const directories = fs.readdirSync(SCRIPTS_DIR);

    directories.forEach(dir => {
        const dirPath = path.join(SCRIPTS_DIR, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                result.push(extractMetadata(content, filePath));
            });
        }
    });

    console.log(`✅ Extracted ${result.length} sessions.`);

    // Read the original file to preserve the interface and old sessions
    const originalContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    const interfacePart = originalContent.split('export const MEDITATION_SESSIONS')[0];
    const footerPart = originalContent.split('];')[originalContent.split('];').length - 1];

    const newFileContent = `${interfacePart}export const MEDITATION_SESSIONS: MeditationSession[] = ${JSON.stringify(result, null, 2)};${footerPart}`;

    // Note: We'll actually do a more surgical replacement to keep the original 18 if needed, 
    // but the user's expansion plan is 100 sessions. Let's merge them.

    // For now, I'll print the first object to verify
    console.log('Sample Object:', result[0]);

    // I will write this to a temporary file for the user to see before overwriting the core data
    fs.writeFileSync(path.join(__dirname, '../src/data/newSessionsGenerated.json'), JSON.stringify(result, null, 2));
}

generate();
