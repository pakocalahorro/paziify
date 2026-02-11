import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
    Canvas,
    Fill,
    LinearGradient,
    vec,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    useDerivedValue,
    interpolateColor,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface AuraBackgroundProps {
    mode?: 'healing' | 'growth' | 'neutral';
    children: React.ReactNode;
}

const AuraBackground: React.FC<AuraBackgroundProps> = ({ mode = 'neutral', children }) => {
    const transition = useSharedValue(mode === 'healing' ? 0 : mode === 'growth' ? 1 : 0.5);

    useEffect(() => {
        const target = mode === 'healing' ? 0 : mode === 'growth' ? 1 : 0.5;
        transition.value = withTiming(target, { duration: 1500 });
    }, [mode]);

    const colors = useDerivedValue(() => {
        const c1 = interpolateColor(
            transition.value,
            [0, 0.5, 1],
            ['#0F2027', '#0A0E1A', '#2C3E50'] // Deep base colors
        );
        const c2 = interpolateColor(
            transition.value,
            [0, 0.5, 1],
            ['#203A43', '#161B22', '#3498DB'] // Mid tones
        );
        const c3 = interpolateColor(
            transition.value,
            [0, 0.5, 1],
            ['#2C5364', '#1A237E', '#2980B9'] // Highlights
        );
        return [c1, c2, c3];
    });

    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                <Canvas style={styles.canvas}>
                    <Fill>
                        <LinearGradient
                            start={vec(0, 0)}
                            end={vec(width, height)}
                            colors={colors}
                        />
                    </Fill>
                </Canvas>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    canvas: {
        flex: 1,
    },
});

export default AuraBackground;
