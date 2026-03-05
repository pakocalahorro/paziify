/**
 * Definición centralizada de categorías y su asociación con los modos de Paziify.
 * Esto asegura que el Aura, el Árbol y las analíticas estén sincronizados.
 */

export type LifeMode = 'healing' | 'growth';

export const CATEGORY_MODE_MAP: Record<string, LifeMode> = {
    // Modo Sanación (Healing) - Enfoque en Calma, Sueño y Salud
    'calmasos': 'healing',
    'sueno': 'healing',
    'salud': 'healing',
    'emocional': 'healing',
    'kids': 'healing',
    'habitos': 'healing',
    'mindfulness': 'healing',

    // Modo Crecimiento (Growth) - Enfoque en Rendimiento y Despertar
    'rendimiento': 'growth',
    'despertar': 'growth',
    'resiliencia': 'growth',
};

/**
 * Determina el modo dominante basado en una distribución de categorías.
 */
export const getDominantMode = (distribution: Record<string, number>): LifeMode => {
    let healingScore = 0;
    let growthScore = 0;

    Object.entries(distribution).forEach(([category, count]) => {
        const mode = CATEGORY_MODE_MAP[category] || 'healing'; // Default to healing
        if (mode === 'healing') healingScore += count;
        else growthScore += count;
    });

    return growthScore > healingScore ? 'growth' : 'healing';
};
