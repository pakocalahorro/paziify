import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import NebulaBackground from '../Sanctuary/NebulaBackground';
import SunriseBackground from '../Sanctuary/SunriseBackground';

interface Props {
    children?: React.ReactNode;
    nebulaMode?: 'healing' | 'growth';
    remoteImageUri?: string | null;
}

const BackgroundWrapper: React.FC<Props> = ({ children, nebulaMode = 'healing', remoteImageUri }) => {
    const { isNightMode, userState } = useApp();

    // Prioritize explicitly passed remote image (like category background), then user preference, then night mode background
    const finalCustomBackground = remoteImageUri || userState.lastSelectedBackgroundUri;
    const showCustomBackground = !!finalCustomBackground;

    return (
        <View style={StyleSheet.absoluteFill}>
            {showCustomBackground || isNightMode ? (
                <NebulaBackground
                    mode={userState.lifeMode || nebulaMode}
                    customBackgroundImage={finalCustomBackground || undefined}
                />
            ) : (
                <SunriseBackground />
            )}
            {children}
        </View>
    );
};

export default BackgroundWrapper;
