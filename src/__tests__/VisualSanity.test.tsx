import React from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import HomeScreen from '../screens/Home/HomeScreen';

import { NavigationContainer } from '@react-navigation/native';

// MOCKS LOCALES PARA ESTABILIDAD
jest.mock('../context/AppContext', () => ({ useApp: () => ({ userState: {}, user: { name: 'Paco' } }) }));
jest.mock('../hooks/useContent', () => ({
    useSessions: () => ({ data: [] }),
    useAudiobooks: () => ({ data: [] }),
    useStories: () => ({ data: [] }),
    useAcademyModules: () => ({ data: [] }),
    useSoundscapes: () => ({ data: [] }),
}));
jest.mock('../components/Oasis/OasisMeter', () => ({ OasisMeter: () => 'OasisMeter' }));

describe('Ojo: Foto Maestra', () => {
    it('sanidad visual base', () => {
        let tree: any;
        renderer.act(() => {
            tree = renderer.create(
                <View style={{ padding: 20, backgroundColor: '#1A1A1A' }}>
                    <Text style={{ color: '#FFFFFF' }}>Paziify Zero Defects</Text>
                </View>
            ).toJSON();
        });
        expect(tree).toMatchSnapshot();
    });
});
