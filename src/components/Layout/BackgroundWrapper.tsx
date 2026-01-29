import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import NebulaBackground from '../Sanctuary/NebulaBackground';
import SunriseBackground from '../Sanctuary/SunriseBackground';

interface Props {
    children?: React.ReactNode;
    nebulaMode?: 'healing' | 'growth';
}

const BackgroundWrapper: React.FC<Props> = ({ children, nebulaMode = 'healing' }) => {
    const { isNightMode } = useApp();

    return (
        <View style={StyleSheet.absoluteFill}>
            {isNightMode ? (
                <NebulaBackground mode={nebulaMode} />
            ) : (
                <SunriseBackground />
            )}
            {children}
        </View>
    );
};

export default BackgroundWrapper;
