// MOCKS DE INFRAESTRUCTURA (Node-Friendly)
const mockSupabase = {
    from: jest.fn(() => ({
        select: jest.fn(() => ({
            order: jest.fn(() => ({
                range: jest.fn(() => Promise.resolve({ data: [], error: null }))
            })),
            eq: jest.fn(() => ({
                select: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
        }))
    }))
};

jest.mock('../services/supabaseClient', () => ({ supabase: mockSupabase }));
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

// Mock de React Native para evitar carga de binarios
jest.mock('react-native', () => ({
    Platform: { OS: 'ios', select: (o) => o.ios },
    NativeModules: {},
}), { virtual: true });

describe('Cerebro: ContentService (Lógica de Negocio)', () => {
    const { sessionsService, adaptSession } = require('../services/contentService');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Adaptador de Datos (Supabase V2 -> UI)', () => {
        it('debe convertir campos snake_case a camelCase correctamente', () => {
            const dbData = {
                id: '123',
                title: 'Calma Total',
                duration_minutes: 20,
                category: 'calma'
            };
            const result = adaptSession(dbData);
            expect(result.durationMinutes).toBe(20);
            expect(result.title).toBe('Calma Total');
        });

        it('debe aplicar valores por defecto para campos faltantes', () => {
            const dbData = { id: '123', title: 'Test' };
            const result = adaptSession(dbData);
            expect(result.category).toBe('calmasos');
            expect(result.difficultyLevel).toBe('beginner');
        });
    });

    describe('Servicio de Sesiones (Resiliencia)', () => {
        it('debe activar el Modo Resiliencia si Supabase devuelve un error', async () => {
            // Configuramos el mock para que falle
            mockSupabase.from.mockImplementationOnce(() => ({
                select: jest.fn(() => ({
                    order: jest.fn(() => Promise.resolve({ data: null, error: { message: 'DB Down' } }))
                }))
            }));

            const sessions = await sessionsService.getAll();
            expect(sessions.length).toBeGreaterThan(0); // Debe devolver MEDITATION_SESSIONS (fallback)
            expect(sessions[0]).toHaveProperty('id');
        });
    });
});
