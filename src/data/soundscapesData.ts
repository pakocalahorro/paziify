export interface Soundscape {
    id: string;
    name: string;
    description: string;
    audioFile: any; // require() para archivos locales
    icon: string; // Ionicons name
    color: string;
    image: string; // New: Background image URL
    recommendedFor: string[];
}

const SB_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/';
const SB_IMG_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/';

export const SOUNDSCAPES: Soundscape[] = [
    {
        id: 'forest_meditation',
        name: 'Bosque Profundo',
        description: 'Atmósfera natural y tranquila',
        audioFile: { uri: `${SB_URL}forest_meditation.mp3` },
        icon: 'leaf',
        color: '#4A6741',
        image: `${SB_IMG_URL}forest-sunrise.webp`, // Hypothetical mapping based on "Forest"
        recommendedFor: ['mindfulness', 'mañana'],
    },
    {
        id: 'atlantic_loop',
        name: 'Océano Atlántico',
        description: 'Olas constantes del océano',
        audioFile: { uri: `${SB_URL}atlantic_loop.mp3` },
        icon: 'water',
        color: '#1A1A2E',
        image: `${SB_IMG_URL}ocean-calm.webp`,
        recommendedFor: ['sueño', 'noche'],
    },
    {
        id: 'bird_relaxation',
        name: 'Jardín de Aves',
        description: 'Canto de pájaros y naturaleza',
        audioFile: { uri: `${SB_URL}bird_relaxtion.mp3` },
        icon: 'rainy',
        color: '#4A90E2',
        image: `${SB_IMG_URL}nature-birds.webp`,
        recommendedFor: ['sueño', 'ansiedad', 'foco'],
    },
    {
        id: 'deep_meditative',
        name: 'Estado Profundo',
        description: 'Pad ambiental profundo',
        audioFile: { uri: `${SB_URL}deep_meditative_state.mp3` },
        icon: 'water',
        color: '#2DD4BF',
        image: `${SB_IMG_URL}deep-focus.webp`,
        recommendedFor: ['relajación', 'meditación'],
    },
    {
        id: 'meditation_bowls',
        name: 'Cuencos Sagrados',
        description: 'Sonidos de cuencos armónicos',
        audioFile: { uri: `${SB_URL}meditation_bowls.mp3` },
        icon: 'notifications',
        color: '#00B4D8',
        image: `${SB_IMG_URL}tibetan-bowls.webp`,
        recommendedFor: ['foco', 'energía'],
    },
    {
        id: 'tibetan_bowl',
        name: 'Vibración Tibetana',
        description: 'Vibración tibetana pura',
        audioFile: { uri: `${SB_URL}tibetan_singing_bowl.mp3` },
        icon: 'notifications-circle',
        color: '#ADB5BD',
        image: `${SB_IMG_URL}tibetan-monk.webp`,
        recommendedFor: ['calma', 'meditación'],
    },
    {
        id: 'ethereal_voices',
        name: 'Voces Etéreas',
        description: 'Voces suaves del santuario',
        audioFile: { uri: `${SB_URL}sanctuary_ethereal_voices.mp3` },
        icon: 'flame',
        color: '#FF6B35',
        image: `${SB_IMG_URL}ethereal-light.webp`,
        recommendedFor: ['cozy', 'invierno'],
    },
    {
        id: 'athmo_motion',
        name: 'Cosmos',
        description: 'Pad de movimiento y relax',
        audioFile: { uri: `${SB_URL}athmo_motion_pad.mp3` },
        icon: 'planet',
        color: '#8A2BE2',
        image: `${SB_IMG_URL}cosmos-stars.webp`,
        recommendedFor: ['relajación', 'sueño'],
    },
    {
        id: 'lotus_peace',
        name: 'Paz de Loto',
        description: 'Nemaavla Lotus - Calma pura',
        audioFile: { uri: `${SB_URL}nemaavla_lotus.mp3` },
        icon: 'rose',
        color: '#9B59B6',
        image: `${SB_IMG_URL}lotus-flower.webp`,
        recommendedFor: ['meditación', 'espiritualidad'],
    },
    {
        id: 'moon_stretched',
        name: 'Luna Mística',
        description: 'Vibración lunar expandida',
        audioFile: { uri: `${SB_URL}synodic_moon_stretched.mp3` },
        icon: 'moon',
        color: '#87CEEB',
        image: `${SB_IMG_URL}moon-night.webp`,
        recommendedFor: ['paz', 'calma'],
    },
    {
        id: 'wind_chimes',
        name: 'Viento Suave',
        description: 'Chimes, aves y naturaleza viva',
        audioFile: { uri: `${SB_URL}wind_chimes_birds_squirrel.mp3` },
        icon: 'musical-notes',
        color: '#27AE60',
        image: `${SB_IMG_URL}wind-chimes.webp`,
        recommendedFor: ['naturaleza', 'mindfulness'],
    },
    {
        id: 'sirens_call_a',
        name: 'Canto de Sirena',
        description: 'Ambiente acuático misterioso',
        audioFile: { uri: `${SB_URL}bigvegie_sirens_call_a.mp3` },
        icon: 'pulse',
        color: '#4A90E2',
        image: `${SB_IMG_URL}underwater-blue.webp`,
        recommendedFor: ['sueño', 'visualización'],
    },
    {
        id: 'sirens_call_b',
        name: 'Profundidad Marina',
        description: 'Variante B del ambiente acuático',
        audioFile: { uri: `${SB_URL}bigvegie_sirens_call_b.mp3` },
        icon: 'infinite',
        color: '#2C3E50',
        image: `${SB_IMG_URL}deep-ocean.webp`,
        recommendedFor: ['meditación', 'expansión'],
    },
    {
        id: 'meditative_motion',
        name: 'Flujo Continuo',
        description: 'Pad rítmico para meditar',
        audioFile: { uri: `${SB_URL}meditative_athmo_motionpad.mp3` },
        icon: 'heart',
        color: '#FF9F43',
        image: `${SB_IMG_URL}warm-light.webp`,
        recommendedFor: ['relajación', 'paz'],
    },
];

export interface BinauralWave {
    id: string;
    name: string;
    frequency: string;
    description: string;
    audioFile: any;
    icon: string;
    color: string;
    recommendedFor: string[];
}

export const BINAURAL_WAVES: BinauralWave[] = [
    {
        id: '432hz',
        name: '432 Hz',
        frequency: '432 Hz',
        description: 'Armonía universal',
        audioFile: { uri: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/binaurals/432hz.mp3' },
        icon: 'pulse',
        color: '#D4AF37',
        recommendedFor: ['meditación general'],
    },
    {
        id: '528hz',
        name: '528 Hz',
        frequency: '528 Hz',
        description: 'Transformación y sanación',
        audioFile: null, // Pending upload
        icon: 'pulse',
        color: '#50C878',
        recommendedFor: ['meditación profunda'],
    },
    {
        id: 'alpha_waves',
        name: 'Ondas Alpha',
        frequency: '8-12 Hz',
        description: 'Relajación consciente',
        audioFile: { uri: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/binaurals/Alpha_waves.mp3' },
        icon: 'pulse',
        color: '#2DD4BF',
        recommendedFor: ['foco', 'creatividad'],
    },
    {
        id: 'theta_waves',
        name: 'Ondas Theta',
        frequency: '4-8 Hz',
        description: 'Meditación profunda',
        audioFile: null,
        icon: 'pulse',
        color: '#4A90E2',
        recommendedFor: ['sueño', 'visualización'],
    },
    {
        id: 'delta_waves',
        name: 'Ondas Delta',
        frequency: '0.5-4 Hz',
        description: 'Sueño profundo',
        audioFile: null,
        icon: 'pulse',
        color: '#1A1A2E',
        recommendedFor: ['insomnio'],
    },
];

export interface Element {
    id: string;
    name: string;
    description: string;
    audioFile: any;
    icon: string;
    color: string;
    behavior: string;
}

export const ELEMENTS: Element[] = [
    {
        id: 'tibetan_bowls',
        name: 'Campanas Tibetanas',
        description: 'Cada 3-5 min (aleatorio)',
        audioFile: null,
        icon: 'notifications',
        color: '#D4AF37',
        behavior: 'random_3_5_min',
    },
    {
        id: 'singing_bowls',
        name: 'Cuencos Cantores',
        description: 'Cada 5-7 min',
        audioFile: null,
        icon: 'notifications-circle',
        color: '#50C878',
        behavior: 'random_5_7_min',
    },
    {
        id: 'gong',
        name: 'Gong',
        description: 'Inicio/Fin de sesión',
        audioFile: null,
        icon: 'disc',
        color: '#FF6B35',
        behavior: 'start_end',
    },
    {
        id: 'chimes',
        name: 'Chimes',
        description: 'Cada 2-3 min',
        audioFile: null,
        icon: 'musical-notes',
        color: '#2DD4BF',
        behavior: 'random_2_3_min',
    },
];
