import React from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import HomeScreen from '../screens/Home/HomeScreen';

// MOCKS LOCALES PARA ESTABILIDAD
jest.mock('../../context/AppContext', () => ({ useApp: () => ({ userState: {}, user: { name: 'Paco' } }) }));
jest.mock('../../hooks/useContent', () => ({
    useSessions: () => ({ data: [] }),
    useAudiobooks: () => ({ data: [] }),
    useStories: () => ({ data: [] }),
    useAcademyModules: () => ({ data: [] }),
    useSoundscapes: () => ({ data: [] }),
}));

describe('Ojo: Foto Maestra', () => {
    it('captura la HomeScreen base', () => {
        const tree = renderer.create(<HomeScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('sanidad visual base', () => {
        const tree = renderer.create(
            <View style={{ padding: 20, backgroundColor: '#1A1A1A' }}>
                <Text style={{ color: '#FFFFFF' }}>Paziify Zero Defects</Text>
            </View>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
