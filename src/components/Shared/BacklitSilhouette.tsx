import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Circle, Group, Blur, RadialGradient, vec } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    iconName?: string;
    glowColor?: string;
    size?: number;
}

const BacklitSilhouette: React.FC<Props> = ({
    iconName = "leaf-outline",
    glowColor = "rgba(45, 212, 191, 0.5)",
    size = 140
}) => {
    const pulse = useSharedValue(0.4);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const glowRadiusVal = useDerivedValue(() => (size * 0.42) + pulse.value * (size * 0.28));
    const center = size / 2 + 10;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Canvas style={[styles.canvas, { width: size + 20, height: size + 20 }]}>
                <Group>
                    <Circle cx={center} cy={center} r={glowRadiusVal}>
                        <RadialGradient
                            c={vec(center, center)}
                            r={glowRadiusVal}
                            colors={[glowColor, 'transparent']}
                        />
                        <Blur blur={25} />
                    </Circle>
                </Group>
            </Canvas>
            <View style={styles.iconWrapper}>
                <Ionicons
                    name={iconName as any}
                    size={size * 0.42}
                    color="rgba(45, 212, 191, 0.4)"
                    style={styles.icon}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    canvas: {
        position: 'absolute',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        zIndex: 2,
    },
});

export default BacklitSilhouette;
