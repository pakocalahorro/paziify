
// Aduana de Integridad: Meditación
// Este test protege contra el guardado de datos incompletos que romperían la App móvil.

interface MeditationSession {
    title: string;
    audio_url: string;
    category: string;
    description: string;
    duration: number;
    author: string;
}

const validateMeditationIntegrity = (session: Partial<MeditationSession>) => {
    const errors: string[] = [];

    if (!session.title || session.title.trim().length < 3) errors.push("Título inválido (mín. 3 caracters)");
    if (!session.audio_url || !session.audio_url.startsWith('http')) errors.push("URL de audio obligatoria y debe ser absoluta");
    if (!session.category) errors.push("La categoría es obligatoria para los filtros de la App");
    if (typeof session.duration !== 'number' || session.duration <= 0) errors.push("La duración debe ser un número positivo");
    if (!session.author) errors.push("El autor/instructor es obligatorio");

    return {
        isValid: errors.length === 0,
        errors
    };
};

describe('Aduana Admin: Integridad de Meditaciones', () => {

    test('Debe aprobar una meditación perfecta', () => {
        const perfectMed = {
            title: 'Meditación Matutina',
            audio_url: 'https://paziify.com/audio/matutina.mp3',
            category: 'sueño',
            duration: 600,
            author: 'Paziify Guru',
            description: 'Inicia tu día con calma.'
        };

        const result = validateMeditationIntegrity(perfectMed);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    test('Debe rechazar meditaciones sin audio o con duración inválida', () => {
        const brokenMed = {
            title: 'Me', // Corto
            audio_url: 'solo-un-nombre.mp3', // No absoluta
            category: '', // Vacia
            duration: -1, // Negativa
            author: '' // Vacio
        };

        const result = validateMeditationIntegrity(brokenMed);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain("Título inválido (mín. 3 caracters)");
        expect(result.errors).toContain("URL de audio obligatoria y debe ser absoluta");
        expect(result.errors).toContain("La categoría es obligatoria para los filtros de la App");
        expect(result.errors).toContain("La duración debe ser un número positivo");
        expect(result.errors).toContain("El autor/instructor es obligatorio");
    });
});
