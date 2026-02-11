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
    const { isNightMode, userState } = useApp();

    // If there is a custom background selected in Compass, it should override everything
    // We use NebulaBackground as the base container for custom images because it supports blurring and overlays
    const showCustomBackground = !!userState.lastSelectedBackgroundUri;

    return (
        <View style={StyleSheet.absoluteFill}>
            {showCustomBackground || isNightMode ? (
                <NebulaBackground
                    mode={userState.lifeMode || nebulaMode}
                    customBackgroundImage={userState.lastSelectedBackgroundUri}
                />
            ) : (
                <SunriseBackground />
            )}
            {children}
        </View>
    );
};

export default BackgroundWrapper;
