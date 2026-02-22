export const MEDITATION_CATEGORIES = [
    { label: 'Calma SOS', value: 'calmasos' },
    { label: 'Mindfulness', value: 'mindfulness' },
    { label: 'Sueño', value: 'sueno' },
    { label: 'Resiliencia', value: 'resiliencia' },
    { label: 'Rendimiento', value: 'rendimiento' },
    { label: 'Despertar', value: 'despertar' },
    { label: 'Salud', value: 'salud' },
    { label: 'Hábitos', value: 'habitos' },
    { label: 'Emocional', value: 'emocional' },
    { label: 'Paziify Kids', value: 'kids' },
];

export const PAZIIFY_GUIDES = [
    { label: 'Aria', value: 'Aria' },
    { label: 'Ziro', value: 'Ziro' },
    { label: 'Éter', value: 'Éter' },
    { label: 'Gaia', value: 'Gaia' },
];

export const TIME_OF_DAY_OPTIONS = [
    { label: 'Mañana', value: 'mañana' },
    { label: 'Tarde', value: 'tarde' },
    { label: 'Noche', value: 'noche' },
    { label: 'Cualquiera', value: 'cualquiera' },
];

export const DIFFICULTY_LEVELS = [
    { label: 'Principiante', value: 'principiante' },
    { label: 'Intermedio', value: 'intermedio' },
    { label: 'Avanzado', value: 'avanzado' },
];
const SB_BINAURAL_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/binaurals/';

export const BINAURAL_BEATS = [
    { label: 'Ondas Alpha (Enfoque)', value: 'alpha_waves', url: `${SB_BINAURAL_URL}Alpha_waves.mp3` },
    { label: 'Ondas Beta (Concentración)', value: 'beta_waves', url: `${SB_BINAURAL_URL}binaural_beta.mp3` },
    { label: 'Ondas Theta (Meditación)', value: 'theta_waves', url: `${SB_BINAURAL_URL}binaural_theta.mp3` },
    { label: 'Ondas Delta (Sueño)', value: 'delta_waves', url: `${SB_BINAURAL_URL}binaural_delta.mp3` },
    { label: 'Ondas Gamma (Alerta)', value: 'gamma_waves', url: `${SB_BINAURAL_URL}binaural_gamma.mp3` },
    { label: 'Frecuencia 432Hz (Paz)', value: '432hz', url: `${SB_BINAURAL_URL}432hz.mp3` },
    { label: 'Solfeggio 396Hz (Liberación)', value: 'solfeggio_396', url: `${SB_BINAURAL_URL}solfeggio_396hz.mp3` },
    { label: 'Solfeggio 528Hz (Sanación)', value: '528hz', url: `${SB_BINAURAL_URL}solfeggio_528hz.mp3` },
    { label: 'Solfeggio 639Hz (Conexión)', value: 'solfeggio_639', url: `${SB_BINAURAL_URL}solfeggio_639hz.mp3` },
    { label: 'Solfeggio 963Hz (Conciencia)', value: 'solfeggio_963', url: `${SB_BINAURAL_URL}solfeggio_963hz.mp3` },
];
