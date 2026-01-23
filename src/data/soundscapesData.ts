export interface Soundscape {
    id: string;
    name: string;
    description: string;
    audioFile: any; // require() para archivos locales
    icon: string; // Ionicons name
    color: string;
    recommendedFor: string[];
}

export const SOUNDSCAPES: Soundscape[] = [
    {
        id: 'rain_soft',
        name: 'Lluvia Suave',
        description: 'Lluvia constante sin truenos',
        audioFile: require('../assets/audio/soundscapes/rain_soft_30min.mp3'),
        icon: 'rainy',
        color: '#4A90E2',
        recommendedFor: ['sueño', 'ansiedad', 'foco'],
    },
    {
        id: 'ocean_calm',
        name: 'Océano Tranquilo',
        description: 'Olas suaves en la playa',
        audioFile: require('../assets/audio/soundscapes/ocean_calm_30min.mp3'),
        icon: 'water',
        color: '#2DD4BF',
        recommendedFor: ['relajación', 'meditación'],
    },
    {
        id: 'forest_day',
        name: 'Bosque Diurno',
        description: 'Pájaros, hojas, brisa',
        audioFile: require('../assets/audio/soundscapes/gentle-landscapes_30min.mp3'),
        icon: 'leaf',
        color: '#4A6741',
        recommendedFor: ['mindfulness', 'mañana'],
    },
    {
        id: 'forest_night',
        name: 'Bosque Nocturno',
        description: 'Grillos, búhos, viento',
        audioFile: require('../assets/audio/soundscapes/night_crickets_30min.mp3'),
        icon: 'moon',
        color: '#1A1A2E',
        recommendedFor: ['sueño', 'noche'],
    },
    {
        id: 'fireplace',
        name: 'Fuego de Chimenea',
        description: 'Crepitar de leña',
        audioFile: null,
        icon: 'flame',
        color: '#FF6B35',
        recommendedFor: ['cozy', 'invierno'],
    },
    {
        id: 'river_mountain',
        name: 'Río de Montaña',
        description: 'Agua corriente',
        audioFile: null,
        icon: 'water',
        color: '#00B4D8',
        recommendedFor: ['foco', 'energía'],
    },
    {
        id: 'wind_soft',
        name: 'Viento Suave',
        description: 'Brisa constante',
        audioFile: null,
        icon: 'cloud',
        color: '#ADB5BD',
        recommendedFor: ['calma', 'meditación'],
    },
    {
        id: 'silence',
        name: 'Silencio',
        description: 'Sin soundscape',
        audioFile: null,
        icon: 'volume-mute',
        color: '#495057',
        recommendedFor: ['puristas'],
    },
    {
        id: 'nebula',
        name: 'Nebulosa',
        description: 'Armonía y relajación espacial',
        audioFile: require('../assets/audio/soundscapes/nebula_harmony_30min.mp3'),
        icon: 'planet',
        color: '#8A2BE2',
        recommendedFor: ['relajación', 'sueño'],
    },
    {
        id: 'night_birds',
        name: 'Aves Nocturnas',
        description: 'Sonidos de aves en la noche',
        audioFile: require('../assets/audio/soundscapes/night_birds_30min.mp3'),
        icon: 'moon',
        color: '#2C3E50',
        recommendedFor: ['sueño', 'relajación'],
    },
    {
        id: 'spiritual',
        name: 'Espiritual',
        description: 'Conexión profunda',
        audioFile: require('../assets/audio/soundscapes/spiritual-soundscape_30min.mp3'),
        icon: 'rose',
        color: '#9B59B6',
        recommendedFor: ['meditación', 'espiritualidad'],
    },
    {
        id: 'better_life',
        name: 'Vida Plena',
        description: 'Energía positiva',
        audioFile: require('../assets/audio/soundscapes/better_life_30min.mp3'),
        icon: 'sunny',
        color: '#F1C40F',
        recommendedFor: ['energía', 'mañana'],
    },
    {
        id: 'heavenly',
        name: 'Cielo',
        description: 'Calma celestial',
        audioFile: require('../assets/audio/soundscapes/heavenly_calm_30min.mp3'),
        icon: 'cloudy-night',
        color: '#87CEEB',
        recommendedFor: ['paz', 'calma'],
    },
    {
        id: 'organic',
        name: 'Orgánico',
        description: 'Sonidos naturales profundos',
        audioFile: require('../assets/audio/soundscapes/organic_meditation_40min.mp3'),
        icon: 'leaf',
        color: '#27AE60',
        recommendedFor: ['naturaleza', 'mindfulness'],
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
        audioFile: require('../assets/audio/binaurals/432hz_30min.mp3'),
        icon: 'pulse',
        color: '#D4AF37',
        recommendedFor: ['meditación general'],
    },
    {
        id: '528hz',
        name: '528 Hz',
        frequency: '528 Hz',
        description: 'Transformación y sanación',
        audioFile: null,
        icon: 'pulse',
        color: '#50C878',
        recommendedFor: ['meditación profunda'],
    },
    {
        id: 'alpha_waves',
        name: 'Ondas Alpha',
        frequency: '8-12 Hz',
        description: 'Relajación consciente',
        audioFile: require('../assets/audio/binaurals/alpha_waves_30min.mp3'),
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
