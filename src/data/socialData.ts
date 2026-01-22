export interface Post {
    id: string;
    userName: string;
    content: string;
    timestamp: string;
    supportCount: number;
    category: 'achievement' | 'support' | 'thought';
}

export const COMMUNITY_POSTS: Post[] = [
    {
        id: 'post-1',
        userName: 'Elena M.',
        content: 'Hoy he completado mi racha de 7 días. ¡Me siento mucho más en control de mis pensamientos! ✨',
        timestamp: 'Hace 2h',
        supportCount: 24,
        category: 'achievement',
    },
    {
        id: 'post-2',
        userName: 'Marcos R.',
        content: 'La técnica del 3-3-3 me ha salvado de un ataque de ansiedad en el metro. Gracias Paziify.',
        timestamp: 'Hace 4h',
        supportCount: 15,
        category: 'support',
    },
    {
        id: 'post-3',
        userName: 'Lucía G.',
        content: 'Recuerda: No eres tus pensamientos, eres quien los observa. Que tengáis un día en calma. 🧘‍♀️',
        timestamp: 'Hace 5h',
        supportCount: 42,
        category: 'thought',
    },
    {
        id: 'post-4',
        userName: 'Javier S.',
        content: '¿Alguien más está haciendo el curso de Fundamentos TCC? La lección sobre el ciclo del pensamiento es reveladora.',
        timestamp: 'Hace 8h',
        supportCount: 8,
        category: 'support',
    },
];
