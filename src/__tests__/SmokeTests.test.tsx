import React from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import BentoGrid from '../components/Home/BentoGrid';
import { OasisCard } from '../components/Oasis/OasisCard';

describe('Smoke Test: Componentes Base', () => {

    it('BentoGrid se renderiza sin crashear', () => {
        const tree = renderer.create(
            <BentoGrid>
                <View><Text>Test Child</Text></View>
            </BentoGrid>
        ).toJSON();
        expect(tree).toBeDefined();
    });

    it('OasisCard se renderiza sin crashear', () => {
        const tree = renderer.create(
            <OasisCard
                title="Sesión de Prueba"
                superTitle="Práctica"
                subtitle="Descripción de prueba"
                accentColor="#2DD4BF"
                variant="default"
            />
        ).toJSON();
        expect(tree).toBeDefined();
    });

});
