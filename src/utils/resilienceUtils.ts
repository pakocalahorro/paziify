export interface ResilienceLevel {
    id: number;
    name: string;
    color: string;
    text: string;
    points: number;
}

export const LEVEL_DATA: ResilienceLevel[] = [
    { id: 1, name: 'Shamatha', color: '#FF8C00', text: 'Calma Inicial', points: 0 },
    { id: 2, name: 'Vipassana', color: '#00BFFF', text: 'Visión Clara', points: 100 },
    { id: 3, name: 'Metta', color: '#32CD32', text: 'Amor Bondadoso', points: 200 },
    { id: 4, name: 'Bodhi', color: '#8A2BE2', text: 'Despertar', points: 300 },
    { id: 5, name: 'Zen Absoluto', color: '#FFD700', text: 'Paz Infinita', points: 400 }
];

export const calculateResilienceLevel = (lightPoints: number) => {
    const points = lightPoints || 0;
    const currentLevel = Math.min(Math.floor(points / 100) + 1, 5);
    const progressInLevel = currentLevel >= 5 ? 100 : points % 100;
    const activeLevelData = LEVEL_DATA[currentLevel - 1];

    return {
        currentLevel,
        progressInLevel,
        activeLevelData,
        LEVEL_DATA
    };
};
