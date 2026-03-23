import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../screens/Home/HomeScreen';
import { useApp } from '../context/AppContext';

// MOCKS DE CONTEXTO
jest.mock('../context/AppContext', () => ({
    useApp: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

// MOCKS DE COMPONENTES INTERNOS (Aggeressive Shallowing)
jest.mock('../components/Layout/BackgroundWrapper', () => 'BackgroundWrapper');
jest.mock('../components/Home/BentoGrid', () => 'BentoGrid');
jest.mock('../components/Oasis/OasisCard', () => ({ OasisCard: 'OasisCard' }));
jest.mock('../components/Oasis/OasisMeter', () => ({ OasisMeter: 'OasisMeter' }));
jest.mock('../components/Oasis/OasisChart', () => ({ OasisChart: 'OasisChart' }));
jest.mock('../components/Oasis/OasisCalendar', () => ({ OasisCalendar: 'OasisCalendar' }));
jest.mock('../components/Home/PurposeModal', () => 'PurposeModal');
jest.mock('../components/Modals/ModePickerModal', () => 'ModePickerModal');
jest.mock('../components/Shared/SoundwaveSeparator', () => 'SoundwaveSeparator');
jest.mock('../components/Challenges/ChallengeDetailsModal', () => ({ ChallengeDetailsModal: 'ChallengeDetailsModal' }));
jest.mock('../components/Oasis/OasisScreen', () => ({ OasisScreen: 'OasisScreen' }));
jest.mock('../components/Oasis/OasisHeader', () => ({ OasisHeader: 'OasisHeader' }));
jest.mock('../components/CategoryRow', () => 'CategoryRow');

// MOCKS DE HOOKS DE CONTENIDO
jest.mock('../hooks/useContent', () => ({
    useSessions: () => ({ data: [], isLoading: false }),
    useAudiobooks: () => ({ data: [], isLoading: false }),
    useStories: () => ({ data: [], isLoading: false }),
    useAcademyModules: () => ({ data: [], isLoading: false }),
    useSoundscapes: () => ({ data: [], isLoading: false }),
}));

describe('🛡️ Paziify: El Ojo (Screens Structural Integrity)', () => {
    const mockAppState = {
        userState: {
            name: 'Test User',
            streak: 5,
            resilienceScore: 75,
            isPlusMember: false,
            favoriteSessionIds: [],
            settings: {
                notificationMorning: true,
            }
        },
        isLoading: false,
        isNightMode: false,
        isFirstEntryOfDay: true,
        updateUserState: jest.fn(),
        toggleFavorite: jest.fn(),
    };

    beforeEach(() => {
        (useApp as jest.Mock).mockReturnValue(mockAppState);
    });

    test('HomeScreen ADN (Firma Estructural)', () => {
        // Rendereamos HomeScreen. Gracias a los mocks, esto es puro texto estructural.
        let tree: any;
        renderer.act(() => {
            tree = renderer.create(<HomeScreen />).toJSON();
        });
        expect(tree).toMatchSnapshot();
    });
});
