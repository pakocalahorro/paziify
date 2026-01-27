import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Canvas,
    Circle,
    Blur,
    Group,
    RadialGradient,
    vec,
} from '@shopify/react-native-skia';
import Animated, {
    useDerivedValue,
    SharedValue,
} from 'react-native-reanimated';

interface StarCoreProps {
    progress: SharedValue<number>;
    size?: number;
}

const StarCore: React.FC<StarCoreProps> = ({ progress, size = 100 }) => {
    const center = size / 2;

    const color = useDerivedValue(() => {
        if (progress.value < 0) {
            // Mix white to Teal
            return ['#FFFFFF', '#2DD4BF'];
        } else {
            // Mix white to Gold
            return ['#FFFFFF', '#FBBF24'];
        }
    });

    return (
        <View style={{ width: size, height: size }}>
            <Canvas style={styles.canvas}>
                <Group>
                    {/* Main Core */}
                    <Circle cx={center} cy={center} r={size * 0.15} color="white">
                        <Blur blur={4} />
                    </Circle>

                    {/* Outer Glow */}
                    <Circle cx={center} cy={center} r={center}>
                        <RadialGradient
                            c={vec(center, center)}
                            r={center}
                            colors={['rgba(255,255,255,0.8)', 'transparent']}
                        />
                    </Circle>
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
    },
});

export default StarCore;
