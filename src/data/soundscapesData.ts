export interface Soundscape {
    id: string;
    slug?: string; // Optional for DB mapping
    name: string;
    description: string;
    audioFile: any; // require() para archivos locales
    icon: string; // Ionicons name
    color: string;
    image: string; // New: Background image URL
    recommendedFor: string[];
    isPremium: boolean;
}

const SB_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/';
const SB_BINAURAL_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/binaurals/';
const SB_IMG_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/';

export const SOUNDSCAPES: Soundscape[] = [
    {
        id: 'forest_meditation',
        name: 'Bosque Profundo',
        description: 'Atmósfera natural y tranquila',
        audioFile: { uri: `${SB_URL}forest_meditation.mp3` },
        icon: 'leaf',
        color: '#4A6741',
        image: `${SB_IMG_URL}mindfulness/0008-monitorizacion-abierta.webp`,
        recommendedFor: ['mindfulness', 'mañana'],
        isPremium: false,
    },
    {
        id: 'atlantic_loop',
        name: 'Océano Atlántico',
        description: 'Olas constantes del océano',
        audioFile: { uri: `${SB_URL}atlantic_loop.mp3` },
        icon: 'water',
        color: '#1A1A2E',
        image: `${SB_IMG_URL}calmasos/0014-calma-oceanica.webp`,
        recommendedFor: ['sueño', 'noche'],
        isPremium: false,
    },
    {
        id: 'bird_relaxation',
        name: 'Jardín de Aves',
        description: 'Canto de pájaros y naturaleza',
        audioFile: { uri: `${SB_URL}bird_relaxtion.mp3` }, // Manteniendo errata del storage
        icon: 'paw',
        color: '#4A90E2',
        image: `${SB_IMG_URL}calmasos/0001-respiracion-4-7-8.webp`,
        recommendedFor: ['sueño', 'ansiedad', 'foco'],
        isPremium: false,
    },
    {
        id: 'deep_meditative',
        name: 'Estado Profundo',
        description: 'Pad ambiental profundo',
        audioFile: { uri: `${SB_URL}deep_meditative_state.mp3` },
        icon: 'wifi',
        color: '#2DD4BF',
        image: `${SB_IMG_URL}calmasos/0013-s-o-s-rescate-de-panico.webp`,
        recommendedFor: ['relajación', 'meditación'],
        isPremium: false,
    },
    {
        id: 'meditation_bowls',
        name: 'Cuencos Sagrados',
        description: 'Sonidos de cuencos armónicos',
        audioFile: { uri: `${SB_URL}meditation_bowls.mp3` },
        icon: 'notifications',
        color: '#00B4D8',
        image: `${SB_IMG_URL}calmasos/0002-respiracion-cuadrada-box-breathing.webp`,
        recommendedFor: ['foco', 'energía'],
        isPremium: false,
    },
    {
        id: 'tibetan_bowl',
        name: 'Vibración Tibetana',
        description: 'Vibración tibetana pura',
        audioFile: { uri: `${SB_URL}tibetan_singing_bowl.mp3` },
        icon: 'notifications-circle',
        color: '#ADB5BD',
        image: `${SB_IMG_URL}resiliencia/0010-visualizacion-negativa-estoicismo.webp`,
        recommendedFor: ['calma', 'meditación'],
        isPremium: false,
    },
    {
        id: 'ethereal_voices',
        name: 'Voces Etéreas',
        description: 'Voces suaves del santuario',
        audioFile: { uri: `${SB_URL}sanctuary_ethereal_voices.mp3` },
        icon: 'cloud',
        color: '#FF6B35',
        image: `${SB_IMG_URL}resiliencia/0092-gratitud-radical.webp`,
        recommendedFor: ['relajación', 'paz'],
        isPremium: false,
    },
    {
        id: 'lotus_peace',
        name: 'Paz de Loto',
        description: 'Calma pura y espiritual',
        audioFile: { uri: `${SB_URL}nemaavla_lotus.mp3` },
        icon: 'rose',
        color: '#9B59B6',
        image: `${SB_IMG_URL}resiliencia/0011-gratitud-re-cableado-de-sesgos.webp`,
        recommendedFor: ['meditación', 'espiritualidad'],
        isPremium: false,
    },
    {
        id: 'moon_stretched',
        name: 'Luna Mística',
        description: 'Vibración lunar expandida',
        audioFile: { uri: `${SB_URL}synodic_moon_stretched.mp3` },
        icon: 'moon',
        color: '#87CEEB',
        image: `${SB_IMG_URL}sueno/0113-respiracion-de-la-luna-chandra-bhedana.webp`,
        recommendedFor: ['paz', 'calma'],
        isPremium: false,
    },
    {
        id: 'wind_chimes',
        name: 'Viento Suave',
        description: 'Chimes y naturaleza viva',
        audioFile: { uri: `${SB_URL}wind_chimes_birds_squirrel.mp3` },
        icon: 'musical-notes',
        color: '#27AE60',
        image: `${SB_IMG_URL}mindfulness/0074-mindfulness-en-los-sonidos.webp`,
        recommendedFor: ['naturaleza', 'mindfulness'],
        isPremium: false,
    },
    {
        id: 'sirens_call_a',
        name: 'Canto de Sirena',
        description: 'Ambiente acuático misterioso',
        audioFile: { uri: `${SB_URL}bigvegie_sirens_call_a.mp3` },
        icon: 'pulse',
        color: '#4A90E2',
        image: `${SB_IMG_URL}mindfulness/0071-escaner-corporal-para-el-dia.webp`,
        recommendedFor: ['sueño', 'visualización'],
        isPremium: false,
    },
    {
        id: 'sirens_call_b',
        name: 'Profundidad Marina',
        description: 'Ambiente acuático profundo',
        audioFile: { uri: `${SB_URL}bigvegie_sirens_call_b.mp3` },
        icon: 'infinite',
        color: '#2C3E50',
        image: `${SB_IMG_URL}mindfulness/0075-consciencia-de-las-sensaciones-el-mapa-vivo.webp`,
        recommendedFor: ['meditación', 'expansión'],
        isPremium: false,
    },
    {
        id: 'mountain_river',
        name: 'Montaña y Río',
        description: 'Agua fluyendo entre montañas',
        audioFile: { uri: `${SB_URL}mountains_rivers_water.mp3` },
        icon: 'mount-outline',
        color: '#27AE60',
        image: `${SB_IMG_URL}sueno/0112-el-lago-de-la-calma.webp`,
        recommendedFor: ['naturaleza', 'paz'],
        isPremium: false,
    },
    {
        id: 'night_crickets',
        name: 'Noche de Grillos',
        description: 'Serenata nocturna en el campo',
        audioFile: { uri: `${SB_URL}night_cricket_ambience.mp3` },
        icon: 'moon',
        color: '#1A1A2E',
        image: `${SB_IMG_URL}sueno/0110-preparacion-para-el-ensueno.webp`,
        recommendedFor: ['sueño', 'noche'],
        isPremium: false,
    },
    {
        id: 'daylight',
        name: 'Luz del Día',
        description: 'Claridad mental y energía solar',
        audioFile: { uri: `${SB_URL}daylight.mp3` },
        icon: 'sunny',
        color: '#FFCC00',
        image: `${SB_IMG_URL}mindfulness/0009-anclaje-en-la-respiracion.webp`,
        recommendedFor: ['mañana', 'energía'],
        isPremium: true,
    },
    {
        id: 'dunes',
        name: 'Dunas de Arena',
        description: 'Viento cálido del desierto',
        audioFile: { uri: `${SB_URL}dunes.mp3` },
        icon: 'sunny-outline',
        color: '#EDC9AF',
        image: `${SB_IMG_URL}resiliencia/0007-dicotomia-de-control.webp`,
        recommendedFor: ['paz', 'calma'],
        isPremium: true,
    },
    {
        id: 'wandering',
        name: 'Vagabundeo',
        description: 'Mente libre y expansión',
        audioFile: { uri: `${SB_URL}wandering.mp3` },
        icon: 'walk',
        color: '#A29BFE',
        image: `${SB_IMG_URL}mindfulness/0076-consciencia-del-estado-mental.webp`,
        recommendedFor: ['creatividad', 'exploración'],
        isPremium: true,
    },
    {
        id: 'slow_world',
        name: 'Mundo Lento',
        description: 'Relajación profunda global',
        audioFile: { uri: `${SB_URL}slow_world_relax.mp3` },
        icon: 'timer',
        color: '#636E72',
        image: `${SB_IMG_URL}resiliencia/0005-amor-fati.webp`,
        recommendedFor: ['relajación', 'no-doing'],
        isPremium: true,
    },
    {
        id: 'snow_thawing',
        name: 'Nieve Derretida',
        description: 'Sonido suave de deshielo',
        audioFile: { uri: `${SB_URL}snow_thawing.mp3` },
        icon: 'snow',
        color: '#DFE6E9',
        image: `${SB_IMG_URL}sueno/0111-la-nube-de-la-distension.webp`,
        recommendedFor: ['invierno', 'paz'],
        isPremium: true,
    },
    {
        id: 'relaxing_bg',
        name: 'Fondo Relax',
        description: 'Música ambiental suave',
        audioFile: { uri: `${SB_URL}sounds_relaxing-backgroundmusic.mp3` },
        icon: 'musical-note',
        color: '#74B9FF',
        image: `${SB_IMG_URL}resiliencia/0091-la-sala-de-espera.webp`,
        recommendedFor: ['fondo', 'lectura'],
        isPremium: true,
    },
];

export interface BinauralWave {
    id: string;
    name: string;
    description?: string; // Optional description
    frequency: string;
    color: string;
    icon: string; // Added for UI compatibility
    audioFile: any;
}

export const BINAURAL_WAVES: BinauralWave[] = [
    {
        id: 'alpha_waves',
        name: 'Ondas Alpha',
        description: 'Foco y creatividad',
        frequency: '8-13 Hz',
        color: '#2DD4BF',
        icon: 'pulse',
        audioFile: { uri: `${SB_BINAURAL_URL}Alpha_waves.mp3` }
    },
    {
        id: 'beta_waves',
        name: 'Ondas Beta',
        description: 'Alerta y concentración',
        frequency: '13-30 Hz',
        color: '#F59E0B',
        icon: 'flash',
        audioFile: { uri: `${SB_BINAURAL_URL}binaural_beta.mp3` }
    },
    {
        id: 'theta_waves',
        name: 'Ondas Theta',
        description: 'Relajación profunda',
        frequency: '4-8 Hz',
        color: '#A855F7',
        icon: 'water',
        audioFile: { uri: `${SB_BINAURAL_URL}binaural_theta.mp3` }
    },
    {
        id: 'delta_waves',
        name: 'Ondas Delta',
        description: 'Sueño reparador',
        frequency: '0.5-4 Hz',
        color: '#3B82F6',
        icon: 'moon',
        audioFile: { uri: `${SB_BINAURAL_URL}binaural_delta.mp3` }
    },
    {
        id: 'gamma_waves',
        name: 'Ondas Gamma',
        description: 'Alto rendimiento mental',
        frequency: '30-100 Hz',
        color: '#10B981',
        icon: 'speedometer',
        audioFile: { uri: `${SB_BINAURAL_URL}binaural_gamma.mp3` }
    },
    {
        id: '432hz',
        name: 'Sintonía 432Hz',
        description: 'Frecuencia de la naturaleza',
        frequency: '432 Hz',
        color: '#6366F1',
        icon: 'earth',
        audioFile: { uri: `${SB_BINAURAL_URL}432hz.mp3` }
    },
    {
        id: 'solfeggio_396',
        name: 'Solfeggio 396Hz',
        description: 'Liberación de miedos',
        frequency: '396 Hz',
        color: '#EF4444',
        icon: 'shield-checkmark',
        audioFile: { uri: `${SB_BINAURAL_URL}solfeggio_396hz.mp3` }
    },
    {
        id: '528hz',
        name: 'Solfeggio 528Hz',
        description: 'Transformación y milagros',
        frequency: '528 Hz',
        color: '#EC4899',
        icon: 'heart',
        audioFile: { uri: `${SB_BINAURAL_URL}solfeggio_528hz.mp3` }
    },
    {
        id: 'solfeggio_639',
        name: 'Solfeggio 639Hz',
        description: 'Conexión y relaciones',
        frequency: '639 Hz',
        color: '#8B5CF6',
        icon: 'people',
        audioFile: { uri: `${SB_BINAURAL_URL}solfeggio_639hz.mp3` }
    },
    {
        id: 'solfeggio_963',
        name: 'Solfeggio 963Hz',
        description: 'Conciencia superior',
        frequency: '963 Hz',
        color: '#D946EF',
        icon: 'infinite',
        audioFile: { uri: `${SB_BINAURAL_URL}solfeggio_963hz.mp3` }
    }
];

export const ELEMENTS: any[] = [
    // Temporarily disabled until storage sync
];

