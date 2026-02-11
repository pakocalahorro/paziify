import React, { useMemo, useEffect } from 'react';
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
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface StarCoreProps {
    progress: SharedValue<number>;
    size?: number;
}

const StarCore: React.FC<StarCoreProps> = ({ progress, size = 100 }) => {
    // We increase the drawing area to 2x the size to avoid clipping the ripples
    const canvasSize = size * 2;
    const center = canvasSize / 2;
    const wave1 = useSharedValue(0);
    const wave2 = useSharedValue(0);
    const wave3 = useSharedValue(0);
    const wave4 = useSharedValue(0);

    useEffect(() => {
        // ... (animations stay the same)
        wave1.value = withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
            -1,
            false
        );

        setTimeout(() => {
            wave2.value = withRepeat(
                withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
                -1,
                false
            );
        }, 1000);

        setTimeout(() => {
            wave3.value = withRepeat(
                withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
                -1,
                false
            );
        }, 2000);

        setTimeout(() => {
            wave4.value = withRepeat(
                withTiming(1, { duration: 4000, easing: Easing.out(Easing.quad) }),
                -1,
                false
            );
        }, 3000);
    }, []);

    const colors = useDerivedValue(() => {
        if (progress.value < -0.2) {
            return ['#FFFFFF', '#2DD4BF']; // Healing (Teal)
        } else if (progress.value > 0.2) {
            return ['#FFFFFF', '#FBBF24']; // Growth (Gold)
        }
        return ['#FFFFFF', '#FFFFFF']; // Neutral
    });

    const renderWave = (sharedValue: SharedValue<number>, index: number) => {
        // Rings start from the edge of the white core (size * 0.15)
        const minRadius = size * 0.15;
        const maxRadius = index === 3 ? size * 0.85 : size * 0.55;

        const radius = useDerivedValue(() =>
            minRadius + sharedValue.value * (maxRadius - minRadius)
        );
        const opacity = useDerivedValue(() => (1 - sharedValue.value) * 0.6);

        // Alternate Neon Colors: Violet (#A855F7) and Neon Green (#22C55E)
        const waveColor = index % 2 === 1 ? '#22C55E' : '#A855F7';

        return (
            <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                color={waveColor}
                opacity={opacity.value}
                style="stroke"
                strokeWidth={2}
            >
                <Blur blur={3} />
            </Circle>
        );
    };

    return (
        <View style={{ width: size, height: size }}>
            <Canvas
                style={{
                    position: 'absolute',
                    width: canvasSize,
                    height: canvasSize,
                    left: -(canvasSize - size) / 2,
                    top: -(canvasSize - size) / 2
                }}
            >
                {/* Background Atmosphere */}
                <Circle cx={center} cy={center} r={size * 0.45}>
                    <RadialGradient
                        c={vec(center, center)}
                        r={size * 0.45}
                        colors={['rgba(255,255,255,0.05)', 'transparent']}
                    />
                </Circle>

                <Group>
                    {[wave1, wave2, wave3, wave4].map((wave, i) => renderWave(wave, i))}

                    <Circle cx={center} cy={center} r={size * 0.15} color="white">
                        <Blur blur={4} />
                    </Circle>

                    <Circle cx={center} cy={center} r={size * 0.4}>
                        <RadialGradient
                            c={vec(center, center)}
                            r={size * 0.4}
                            colors={[colors.value[0], 'transparent']}
                        />
                        <Blur blur={12} />
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
