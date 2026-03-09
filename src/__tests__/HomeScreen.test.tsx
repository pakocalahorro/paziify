import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../screens/Home/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

// MOCKS DE INFRAESTRUCTURA
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('expo-image', () => ({ Image: 'Image' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));
jest.mock('expo-blur', () => ({ BlurView: 'BlurView' }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));

// MOCK DEL CONTEXTO DE LA APP
jest.mock('../../context/AppContext', () => ({
    useApp: () => ({
        user: { name: 'Test User' },
        userState: { lifeMode: 'growth' },
        isNightMode: false,
        updateUserState: jest.fn(),
        toggleFavorite: jest.fn(),
    }),
}));

// MOCK DE HOOKS DE CONTENIDO
jest.mock('../../hooks/useContent', () => ({
    useSessions: () => ({ data: [], isLoading: false }),
    useAudiobooks: () => ({ data: [], isLoading: false }),
    useStories: () => ({ data: [], isLoading: false }),
    useAcademyModules: () => ({ data: [], isLoading: false }),
    useSoundscapes: () => ({ data: [], isLoading: false }),
}));

// MOCK DE NAVEGACIÓN
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

// MOCK DE COMPONENTES DE PAZIIFY (Aislamiento Agresivo para estabilidad)
jest.mock('../../components/Layout/BackgroundWrapper', () => ({ default: ({ children }: any) => children }));
jest.mock('../../components/Home/BentoGrid', () => ({ default: () => 'BentoGrid' }));
jest.mock('../../components/Oasis/OasisCard', () => ({ OasisCard: () => 'OasisCard' }));
jest.mock('../../components/Oasis/OasisMeter', () => ({ OasisMeter: () => 'OasisMeter' }));
jest.mock('../../components/Oasis/OasisChart', () => ({ OasisChart: () => 'OasisChart' }));
jest.mock('../../components/Oasis/OasisCalendar', () => ({ OasisCalendar: () => 'OasisCalendar' }));
jest.mock('../../components/Home/PurposeModal', () => ({ default: () => 'PurposeModal' }));
jest.mock('../../components/Shared/SoundwaveSeparator', () => ({ default: () => 'SoundwaveSeparator' }));
jest.mock('../../components/CategoryRow', () => ({ default: () => 'CategoryRow' }));
jest.mock('../../components/Oasis/OasisScreen', () => ({ OasisScreen: ({ children }: any) => children }));
jest.mock('../../components/Oasis/OasisHeader', () => ({ OasisHeader: () => 'OasisHeader' }));
jest.mock('../../components/Challenges/ChallengeDetailsModal', () => ({ ChallengeDetailsModal: () => 'ChallengeDetailsModal' }));

describe('<HomeScreen /> Snapshot Aislado', () => {
    it('se renderiza la estructura base correctamente', () => {
        const tree = renderer.create(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
