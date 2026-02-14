import { Ionicons } from '@expo/vector-icons';

export interface Category {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    key: string;
}

export const CONTENT_CATEGORIES: Category[] = [
    { label: 'Todo', icon: 'apps-outline', color: '#646CFF', key: 'all' },
    { label: 'Calma SOS', icon: 'water-outline', color: '#66DEFF', key: 'calmasos' },
    { label: 'Mindfulness', icon: 'leaf-outline', color: '#66BB6A', key: 'mindfulness' },
    { label: 'Sueño', icon: 'moon-outline', color: '#9575CD', key: 'sueno' },
    { label: 'Resiliencia', icon: 'fitness-outline', color: '#FF6B9D', key: 'resiliencia' },
    { label: 'Rendimiento', icon: 'flash-outline', color: '#FBBF24', key: 'rendimiento' },
    { label: 'Despertar', icon: 'sunny-outline', color: '#FFA726', key: 'despertar' },
    { label: 'Salud', icon: 'medkit-outline', color: '#2DD4BF', key: 'salud' },
    { label: 'Hábitos', icon: 'calendar-outline', color: '#A78BFA', key: 'habitos' },
    { label: 'Emocional', icon: 'heart-outline', color: '#FF8A80', key: 'emocional' },
    { label: 'Niños', icon: 'happy-outline', color: '#FFD54F', key: 'kids' },
];
