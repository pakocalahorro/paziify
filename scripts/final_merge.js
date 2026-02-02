const fs = require('fs');
const path = require('path');

const NEW_SESSIONS_FILE = path.join(__dirname, '../src/data/newSessionsGenerated.json');
const SESSIONS_DATA_FILE = path.join(__dirname, '../src/data/sessionsData.ts');

const originalSessions = [
    {
        id: 'anx_478',
        title: 'Respiración 4-7-8',
        description: 'El "sedante natural" del sistema nervioso diseñado por el Dr. Andrew Weil.',
        scientificBenefits: 'Al forzar una exhalación el doble de larga que la inhalación, obligamos al nervio vago a enviar una señal de calma al corazón, reduciendo el cortisol en sangre.',
        durationMinutes: 5,
        category: 'ansiedad',
        moodTags: ['pánico', 'estrés', 'nervios'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/anx_478_voices.mp3',
            defaultBinaural: 'theta_waves',
            defaultSoundscape: 'bird_relaxation'
        },
        breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 },
        voiceStyle: 'deep',
        creatorName: 'Dr. Michael Chen',
        creatorCredentials: 'Neurocientífico, PhD',
        isPremium: false,
        color: '#FF6B6B',
        practiceInstruction: 'Cierra los ojos y déjate guiar por la voz y las vibraciones.',
    },
    {
        id: 'anx_box',
        title: 'Respiración Cuadrada (Box Breathing)',
        description: 'Técnica utilizada por Navy Seals para mantener la calma bajo fuego.',
        scientificBenefits: 'Sincroniza el ritmo cardíaco con la presión arterial (coherencia cardiovascular), permitiendo que el cerebro racional (neocórtex) mantenga el control sobre el emocional (amígdala).',
        durationMinutes: 4,
        category: 'ansiedad',
        moodTags: ['presión', 'calma', 'enfoque'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/anx_box_voices.mp3',
            defaultBinaural: 'alpha_waves',
            defaultSoundscape: 'moon_stretched'
        },
        breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 },
        voiceStyle: 'standard',
        creatorName: 'Sarah Jenkins',
        creatorCredentials: 'Performance Coach',
        isPremium: false,
        color: '#FF6B6B',
        practiceInstruction: 'Enfócate en el orbe o mantén los ojos cerrados sintiendo el ritmo constante.',
    },
    {
        id: 'anx_sigh',
        title: 'Suspiro Cíclico',
        description: 'La forma más rápida de bajar la frecuencia cardíaca según Stanford.',
        scientificBenefits: 'Investigaciones del Dr. Andrew Huberman demuestran que el suspiro cíclico descarga el exceso de CO2 de los pulmones de forma más eficiente que cualquier otra técnica.',
        durationMinutes: 3,
        category: 'ansiedad',
        moodTags: ['estrés agudo', 'pánico', 'alivio'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: { voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/anx_sigh_voices.mp3', defaultSoundscape: 'ethereal_voices' },
        breathingPattern: { inhale: 2, hold: 1, exhale: 6, holdPost: 0 },
        voiceStyle: 'deep',
        creatorName: 'Dr. David Spiegel',
        creatorCredentials: 'Psiquiatra, Stanford Medicine',
        isPremium: true,
        color: '#FF6B6B',
        practiceInstruction: 'Realiza una doble inhalación por la nariz y un suspiro largo por la boca.',
    },
    {
        id: 'wake_bellows',
        title: 'Respiración de Fuelle (Bhastrika)',
        description: 'Genera energía interna y despierta tu claridad mental instantánea.',
        scientificBenefits: 'Al realizar respiraciones rítmicas e intensas, aumentamos la tasa de intercambio de gases en los pulmones, elevando el estado de alerta del cerebro y eliminando la niebla mental matutina sin cafeína.',
        durationMinutes: 3,
        category: 'despertar',
        moodTags: ['energía', 'foco', 'mañana'],
        timeOfDay: 'mañana',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/wake_bellows_voices.mp3',
            defaultBinaural: 'gamma_waves',
            defaultSoundscape: 'meditation_bowls'
        },
        breathingPattern: { inhale: 2, hold: 0.5, exhale: 2, holdPost: 0.5 },
        voiceStyle: 'energizing',
        creatorName: 'Ananda Gupta',
        creatorCredentials: 'Maestro de Pranayama',
        isPremium: false,
        color: '#FFD93D',
        practiceInstruction: 'Mantén los ojos abiertos y sigue el orbe para sincronizar tu energía.',
    },
    {
        id: 'wake_sun',
        title: 'Aliento de Fuego (Kapalbhati)',
        description: 'Purifica tus pulmones y activa tu metabolismo con exhalaciones rítmicas.',
        scientificBenefits: 'Esta técnica de "limpieza de cráneo" estimula el nervio frénico y masajea los órganos abdominales, forzando la renovación del aire residual de los pulmones y aumentando la vitalidad basal.',
        durationMinutes: 5,
        category: 'despertar',
        moodTags: ['despertar', 'fuerza', 'claridad'],
        timeOfDay: 'mañana',
        difficultyLevel: 'avanzado',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/wake_sun_voices.mp3',
            defaultBinaural: 'beta_waves',
            defaultSoundscape: 'sirens_call_a'
        },
        breathingPattern: { inhale: 1.5, hold: 0, exhale: 0.5, holdPost: 1 },
        voiceStyle: 'energizing',
        creatorName: 'Yogi Vini',
        creatorCredentials: 'Especialista en Hatha Yoga',
        isPremium: true,
        color: '#FFD93D',
        practiceInstruction: 'Ojos abiertos enfocados en un punto o el orbe. Exhalaciones vigorosas.',
    },
    {
        id: 'sleep_nsdr',
        title: 'NSDR (Non-Sleep Deep Rest)',
        description: 'Protocolo de descanso profundo para recuperar el cerebro sin dormir.',
        scientificBenefits: 'Utiliza el escaneo corporal para entrar en un estado de hipnagogia (limbo entre vigilia y sueño), donde el cerebro repara circuitos dopaminérgicos dañados por el estrés.',
        durationMinutes: 10,
        category: 'sueño',
        moodTags: ['fatiga', 'descanso', 'siesta'],
        timeOfDay: 'tarde',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sleep_nsdr_voices.mp3',
            defaultBinaural: 'delta_waves',
            defaultSoundscape: 'lotus_peace'
        },
        breathingPattern: { inhale: 6, hold: 0, exhale: 6, holdPost: 0 },
        voiceStyle: 'deep',
        creatorName: 'Dr. Andrew Huberman',
        creatorCredentials: 'Neurobiólogo, Stanford',
        isPremium: false,
        color: '#4A90E2',
        practiceInstruction: 'Cierra los ojos. Escucha el escaneo corporal y relájate profundamente.',
    },
    {
        id: 'sleep_478_night',
        title: '4-7-8 Nocturno',
        description: 'La variante optimizada para inducción al sueño profundo.',
        scientificBenefits: 'La retención de 7 segundos permite que la hemoglobina se cargue de oxígeno mientras el CO2 se acumula ligeramente, lo que induce una somnolencia natural y segura.',
        durationMinutes: 10,
        category: 'sueño',
        moodTags: ['insomnio', 'sueño', 'paz'],
        timeOfDay: 'noche',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sleep_478_night_voices.mp3',
            defaultBinaural: 'delta_waves',
            defaultSoundscape: 'atlantic_loop'
        },
        breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdPost: 0 },
        voiceStyle: 'deep',
        creatorName: 'Dr. Andrew Weil',
        creatorCredentials: 'Fundador de Medicina Integrativa',
        isPremium: true,
        color: '#4A90E2',
        practiceInstruction: 'Ojos cerrados. Deja que la exhalación sea un alivio total.',
    },
    {
        id: 'mind_open',
        title: 'Monitorización Abierta',
        description: 'Aprende a ser el observador de tus pensamientos sin juzgar.',
        scientificBenefits: 'Reduce la conectividad en la Red Neuronal por Defecto (DMN), disminuyendo la rumiación sobre el pasado y la preocupación por el futuro.',
        durationMinutes: 15,
        category: 'mindfulness',
        moodTags: ['rumiación', 'presencia', 'paz'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mind_open_voices.mp3',
            defaultBinaural: 'alpha_waves',
            defaultSoundscape: 'forest_meditation'
        },
        breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Jon Kabat-Zinn',
        creatorCredentials: 'Fundador del MBSR',
        isPremium: true,
        color: '#9B59B6',
        practiceInstruction: 'Cierra los ojos y observa tus pensamientos como nubes pasando.',
    },
    {
        id: 'mind_breath',
        title: 'Anclaje en la Respiración',
        description: 'La técnica fundamental de atención plena paso a paso.',
        scientificBenefits: 'Fortalece la corteza prefrontal dorsolateral, mejorando la capacidad de redirigir la atención voluntariamente tras una distracción.',
        durationMinutes: 10,
        category: 'mindfulness',
        moodTags: ['atención', 'calma', 'presente'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mind_breath_voices.mp3',
            defaultBinaural: 'alpha_waves',
            defaultSoundscape: 'wind_chimes'
        },
        breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Laura Sánchez',
        creatorCredentials: 'Instructora MBSR',
        isPremium: false,
        color: '#9B59B6',
        practiceInstruction: 'Ojos cerrados. Siente el aire entrar y salir por tus fosas nasales.',
    },
    {
        id: 'res_stoic',
        title: 'Visualización Negativa (Estoicismo)',
        description: 'Inmunízate contra las dificultades del día mediante la anticipación.',
        scientificBenefits: 'Utiliza el principio de "pre-exposición cognitiva" para reducir la respuesta galvánica de la piel ante eventos estresantes reales imprevistos.',
        durationMinutes: 8,
        category: 'resiliencia',
        moodTags: ['fortaleza', 'estoicismo', 'preparación'],
        timeOfDay: 'mañana',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/res_stoic_voices.mp3',
            defaultBinaural: 'alpha_waves',
            defaultSoundscape: 'meditative_motion'
        },
        breathingPattern: { inhale: 4, hold: 2, exhale: 4, holdPost: 2 },
        voiceStyle: 'standard',
        creatorName: 'Marcus Aurelius (Adapt.)',
        creatorCredentials: 'Filosofía Práctica TCC',
        isPremium: true,
        color: '#FF9F43',
        practiceInstruction: 'Enfócate en la voz. Visualiza los desafíos con serenidad y ojos cerrados.',
    },
    {
        id: 'res_gratitude',
        title: 'Gratitud: Re-cableado de Sesgos',
        description: 'Entrena tu cerebro para detectar lo positivo por encima del peligro.',
        scientificBenefits: 'La práctica activa de la gratitud aumenta la densidad de materia gris en la corteza cingulada anterior, el área encargada de la empatía y el control emocional.',
        durationMinutes: 10,
        category: 'resiliencia',
        moodTags: ['optimismo', 'ánimo', 'felicidad'],
        timeOfDay: 'noche',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/res_gratitude_voices.mp3',
            defaultBinaural: '528hz',
            defaultSoundscape: 'forest_meditation'
        },
        breathingPattern: { inhale: 5, hold: 0, exhale: 5, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Dr. Carlos Méndez',
        creatorCredentials: 'Psicólogo Clínico, PhD',
        isPremium: false,
        color: '#FF9F43',
        practiceInstruction: 'Ojos cerrados. Evoca tres momentos de gratitud mientras respiras.',
    },
    {
        id: 'res_vagus',
        title: 'Tonificación del Vago',
        description: 'Gimnasia interna para tu sistema nervioso parasimpático.',
        scientificBenefits: 'Combina micro-movimientos de ojos con respiración controlada para liberar la compresión del nervio vago en la base del cráneo.',
        durationMinutes: 6,
        category: 'resiliencia',
        moodTags: ['sistema nervioso', 'paz', 'salud'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/res_vagus_voices.mp3',
            defaultBinaural: 'theta_waves',
            defaultSoundscape: 'theta_state'
        },
        breathingPattern: { inhale: 4, hold: 0, exhale: 6, holdPost: 0 },
        voiceStyle: 'standard',
        creatorName: 'Stanley Rosenberg',
        creatorCredentials: 'Terapeuta Craneosacral',
        isPremium: true,
        color: '#FF9F43',
        practiceInstruction: 'Ojos suavemente cerrados. Sigue las instrucciones para liberar tensión.',
    },
    {
        id: 'anx_sos',
        title: 'S.O.S. Rescate de Pánico',
        description: 'Intervención de emergencia para detener ataques de pánico mediante hiper-regulación.',
        scientificBenefits: 'Saturación deliberada del sistema vestibular para forzar el cese de la respuesta de lucha o huida.',
        durationMinutes: 2,
        category: 'ansiedad',
        moodTags: ['pánico', 'crisis', 'ayuda'],
        timeOfDay: 'cualquiera',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/anx_sos_voices.mp3',
            defaultBinaural: 'theta_waves',
            defaultSoundscape: 'athmo_motion'
        },
        breathingPattern: { inhale: 2, hold: 2, exhale: 4, holdPost: 0 },
        voiceStyle: 'standard',
        creatorName: 'Dra. Elena Ruiz',
        creatorCredentials: 'Psicóloga de Emergencias',
        isPremium: false,
        color: '#FF6B6B',
        practiceInstruction: 'Sigue el orbe visualmente si te ayuda a anclarte en el presente.',
    },
    {
        id: 'anx_calm_ocean',
        title: 'Calma Oceánica',
        description: 'Respiración rítmica síncrona con las mareas.',
        scientificBenefits: 'La sincronía con ritmos naturales (0.1Hz) induce coherencia cardíaca instantánea.',
        durationMinutes: 7,
        category: 'ansiedad',
        moodTags: ['paz', 'ritmo', 'calma'],
        timeOfDay: 'tarde',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/anx_calm_ocean_voices.mp3',
            defaultSoundscape: 'atlantic_loop'
        },
        breathingPattern: { inhale: 5, hold: 0, exhale: 5, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Julian Ray',
        creatorCredentials: 'Especialista en Sonoterapia',
        isPremium: true,
        color: '#FF6B6B',
        practiceInstruction: 'Cierra los ojos e imagina el vaivén de las olas con tu respiración.',
    },
    {
        id: 'sleep_yoganidra',
        title: 'Yoga Nidra Directo',
        description: 'El sueño psíquico de los yoguis para una recuperación total en minutos.',
        scientificBenefits: 'Lleva al cerebro a las ondas Delta profundas sin necesidad de sueño R.E.M. completo.',
        durationMinutes: 20,
        category: 'sueño',
        moodTags: ['insomnio', 'agotamiento', 'sueño'],
        timeOfDay: 'noche',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sleep_yoganidra_voices.mp3',
            defaultBinaural: 'delta_waves',
            defaultSoundscape: 'moon_stretched'
        },
        breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdPost: 4 },
        voiceStyle: 'deep',
        creatorName: 'Swami Veda',
        creatorCredentials: 'Maestro de Yoga Nidra',
        isPremium: true,
        color: '#4A90E2',
        practiceInstruction: 'Ojos cerrados. Entra en el descanso profundo sin dormirte.',
    },
    {
        id: 'sleep_soft_rain',
        title: 'Lluvia Mental',
        description: 'Visualización de limpieza para calmar el pensamiento rumiante antes de dormir.',
        scientificBenefits: 'El ruido rosa de la lluvia reduce la variabilidad del pulso facilitando el inicio del sueño.',
        durationMinutes: 15,
        category: 'sueño',
        moodTags: ['mente agitada', 'noche', 'paz'],
        timeOfDay: 'noche',
        difficultyLevel: 'principiante',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/sleep_soft_rain_voices.mp3',
            defaultSoundscape: 'bird_relaxation'
        },
        breathingPattern: { inhale: 6, hold: 0, exhale: 6, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Dra. Lisa Miller',
        creatorCredentials: 'Clínica del Sueño',
        isPremium: false,
        color: '#4A90E2',
        practiceInstruction: 'Cierra los ojos y déjate llevar por el sonido de la lluvia.',
    },
    {
        id: 'wake_espresso',
        title: 'Espresso Mental',
        description: 'Sustituye el café con un protocolo de hiper-alerta de 2 minutos.',
        scientificBenefits: 'Estimulamos el locus coeruleus mediante una respiración rítmica y continua, lo que libera norepinefrina de forma natural para combatir la fatiga de media tarde sin "crash" posterior.',
        durationMinutes: 2,
        category: 'despertar',
        moodTags: ['energía', 'foco', 'fatiga'],
        timeOfDay: 'tarde',
        difficultyLevel: 'intermedio',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/wake_espresso_voices.mp3',
            defaultBinaural: 'gamma_waves',
            defaultSoundscape: 'meditation_bowls'
        },
        breathingPattern: { inhale: 2, hold: 0, exhale: 2, holdPost: 0 },
        voiceStyle: 'energizing',
        creatorName: 'Coach Mark',
        creatorCredentials: 'Biohacker Coach',
        isPremium: false,
        color: '#FFD93D',
        practiceInstruction: 'Sigue el ritmo del orbe. Mantente activo y alerta.',
    },
    {
        id: 'mind_sky',
        title: 'Mente como el Cielo',
        description: 'Visualización avanzada para disolver nubes de preocupación.',
        scientificBenefits: 'Entrena la desidentificación cognitiva, clave en terapias de tercera generación.',
        durationMinutes: 12,
        category: 'mindfulness',
        moodTags: ['claridad', 'visión', 'paz'],
        timeOfDay: 'mañana',
        difficultyLevel: 'avanzado',
        sessionType: 'guided_pure',
        isCustomizable: false,
        audioLayers: {
            voiceTrack: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-voices/mind_sky_voices.mp3',
            defaultSoundscape: 'ethereal_voices'
        },
        breathingPattern: { inhale: 4, hold: 0, exhale: 4, holdPost: 0 },
        voiceStyle: 'calm',
        creatorName: 'Zen Master Kim',
        creatorCredentials: 'Abad del Monasterio Shoin',
        isPremium: true,
        color: '#9B59B6',
        practiceInstruction: 'Cierra los ojos y expande tu consciencia como el cielo infinito.',
    }
];

function merge() {
    const newSessions = JSON.parse(fs.readFileSync(NEW_SESSIONS_FILE, 'utf-8'));

    // Convert newSessions to a map to avoid duplicates if any (though they have different IDs)
    const combined = [...originalSessions];
    const existingIds = new Set(originalSessions.map(s => s.id));

    newSessions.forEach(s => {
        if (!existingIds.has(s.id)) {
            combined.push(s);
        }
    });

    const fileStart = `export interface AudioLayers {
  voice?: any;
  voiceTrack?: string; // Pre-recorded voice track URL (for background execution)
  defaultSoundscape?: string;
  defaultBinaural?: string;
  defaultElements?: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;

  // Categorización
  category: 'ansiedad' | 'despertar' | 'sueño' | 'mindfulness' | 'resiliencia' | 'salud' | 'rendimiento' | 'emocional' | 'kids' | 'habitos';
  moodTags: string[];
  timeOfDay: 'mañana' | 'tarde' | 'noche' | 'cualquiera';
  difficultyLevel: 'principiante' | 'intermedio' | 'avanzado';

  // Tipo de sesión
  sessionType: 'guided_pure' | 'guided_customizable' | 'ambient_only';
  isCustomizable: boolean;

  // Audio
  audioLayers: AudioLayers;

  // Creador
  creatorName: string;
  creatorCredentials: string;

  // Respaldo Científico
  scientificBenefits: string;
  breathingPattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdPost: number;
  };
  voiceStyle: 'calm' | 'energizing' | 'deep' | 'standard';

  // Freemium
  isPremium: boolean;

  // UI
  color: string;
  practiceInstruction: string;
}

export const MEDITATION_SESSIONS: MeditationSession[] = `;

    const fileEnd = `;

export const getSessionsByCategory = (category: string) => {
  return MEDITATION_SESSIONS.filter(s => s.category === category);
};

export const getSessionsByMood = (mood: string) => {
  return MEDITATION_SESSIONS.filter(s => s.moodTags.includes(mood));
};

export const getFreeSessionsCount = () => {
  return MEDITATION_SESSIONS.filter(s => !s.isPremium).length;
};

export const getPremiumSessionsCount = () => {
  return MEDITATION_SESSIONS.filter(s => s.isPremium).length;
};
`;

    const finalContent = `${fileStart}${JSON.stringify(combined, null, 2)}${fileEnd}`;

    fs.writeFileSync(SESSIONS_DATA_FILE, finalContent);
    console.log('🚀 Final migration complete! sessionsData.ts restored and expanded to 119 sessions.');
}

merge();
