// Visual themes configuration for meditation experience
export const VISUAL_THEMES = {
    cosmos: {
        id: 'cosmos',
        name: 'Cosmos Místico',
        icon: 'planet-outline',
        background: require('../../assets/backgrounds/cosmos.png'),
        gradient: ['rgba(10,5,30,0.7)', 'rgba(5,10,25,0.95)'],
        orbGlow: '#10b981', // Green emerald
        borderEffect: 'particles',
        particleColor: '#FFFFFF'
    },
    temple: {
        id: 'temple',
        name: 'Templo Zen',
        icon: 'flame-outline',
        background: require('../../assets/backgrounds/temple.png'),
        gradient: ['rgba(30,20,10,0.6)', 'rgba(20,15,10,0.9)'],
        orbGlow: '#F59E0B', // Golden amber
        borderEffect: 'flames',
        particleColor: '#FCD34D'
    },
    forest: {
        id: 'forest',
        name: 'Bosque Natural',
        icon: 'leaf-outline',
        background: require('../../assets/backgrounds/forest.png'),
        gradient: ['rgba(5,20,15,0.7)', 'rgba(10,15,20,0.9)'],
        orbGlow: '#84CC16', // Lime green
        borderEffect: 'fireflies',
        particleColor: '#ECFCCB'
    },
    cave: {
        id: 'cave',
        name: 'Cueva Mística',
        icon: 'water-outline',
        background: require('../../assets/backgrounds/cave.png'),
        gradient: ['rgba(15,10,30,0.7)', 'rgba(10,5,25,0.95)'],
        orbGlow: '#60A5FA', // Blue water
        borderEffect: 'droplets',
        particleColor: '#DBEAFE'
    }
};

export type ThemeId = keyof typeof VISUAL_THEMES;

export const DEFAULT_THEME: ThemeId = 'cosmos';
