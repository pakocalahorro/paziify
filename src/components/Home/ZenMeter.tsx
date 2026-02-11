import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
    Canvas,
    Circle,
    Path,
    Skia,
    Group,
    SweepGradient,
    vec,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    useDerivedValue,
    Easing,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface ZenMeterProps {
    progress: number; // 0 to 1
    size?: number;
    label?: string;
}

const ZenMeter: React.FC<ZenMeterProps> = ({ progress, size = 150, label = "ZEN" }) => {
    const radius = size / 2 - 10;
    const strokeWidth = 12;
    const center = size / 2;

    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [progress]);

    const path = useDerivedValue(() => {
        const p = Skia.Path.Make();
        p.addArc({ x: 10, y: 10, width: size - 20, height: size - 20 }, -90, 360 * animatedProgress.value);
        return p;
    });

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Canvas style={styles.canvas}>
                {/* Background Ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    color="rgba(255,255,255,0.05)"
                />

                {/* Progress Ring */}
                <Group>
                    <Path
                        path={path}
                        style="stroke"
                        strokeWidth={strokeWidth}
                        strokeCap="round"
                    >
                        <SweepGradient
                            c={vec(center, center)}
                            colors={[theme.colors.primary, theme.colors.accent, theme.colors.primary]}
                        />
                    </Path>
                </Group>
            </Canvas>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    canvas: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: theme.colors.textMuted,
        letterSpacing: 2,
    },
    percentage: {
        fontSize: 24,
        fontWeight: '900',
        color: theme.colors.textMain,
    },
});

export default ZenMeter;
