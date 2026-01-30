import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
    Canvas,
    Circle,
    Group,
    RadialGradient,
    vec,
} from '@shopify/react-native-skia';
import {
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { VISUAL_THEMES, type ThemeId } from '../../constants/visualThemes';

const { width } = Dimensions.get('window');

interface Props {
    size?: number;
    active?: boolean;
    phase?: 'inhale' | 'exhale' | 'hold' | 'ready';
    theme?: ThemeId;
}

const ThemedBreathingOrb: React.FC<Props> = ({
    size = width * 0.75,
    active = true,
    phase = 'ready',
    theme = 'cosmos',
}) => {
    const themeConfig = VISUAL_THEMES[theme];

    // Animación de escala del orbe (respiración)
    const orbScale = useSharedValue(1);
    const pulse = useSharedValue(0);

    useEffect(() => {
        // Pulso sutil continuo
        pulse.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, []);

    useEffect(() => {
        // Escala del orbe según fase de respiración
        const config = { duration: 4000, easing: Easing.inOut(Easing.ease) };
        if (phase === 'inhale') {
            orbScale.value = withTiming(1.3, config);
        } else if (phase === 'exhale') {
            orbScale.value = withTiming(0.7, config);
        } else if (phase === 'hold') {
            orbScale.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
        } else {
            orbScale.value = withTiming(1, { duration: 1000 });
        }
    }, [phase]);

    const center = vec(size / 2, size / 2);
    const BASE_RADIUS = size / 3.2;
    const currentRadius = useDerivedValue(() => BASE_RADIUS * orbScale.value);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Canvas style={styles.canvas}>
                <Group>
                    {/* Orbe base oscuro */}
                    <Circle c={center} r={currentRadius}>
                        <RadialGradient
                            c={center}
                            r={currentRadius}
                            colors={['#000000', '#0a0a0a', 'transparent']}
                            positions={[0, 0.7, 1]}
                        />
                    </Circle>

                    {/* Brillo interior (color según tema) */}
                    <Circle c={center} r={useDerivedValue(() => currentRadius.value * 0.6)}>
                        <RadialGradient
                            c={center}
                            r={useDerivedValue(() => currentRadius.value * 0.6)}
                            colors={[themeConfig.orbGlow, 'transparent']}
                            positions={[0, 1]}
                        />
                    </Circle>

                    {/* Núcleo brillante pulsante */}
                    <Circle c={center} r={useDerivedValue(() => currentRadius.value * 0.3 * (1 + pulse.value * 0.15))}>
                        <RadialGradient
                            c={center}
                            r={useDerivedValue(() => currentRadius.value * 0.3)}
                            colors={['rgba(255,255,255,0.8)', 'transparent']}
                            positions={[0, 1]}
                        />
                    </Circle>

                    {/* Efectos de borde - Versión simplificada sin efectos por ahora */}
                    {/* TODO: Implementar efectos de forma segura */}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
    canvas: { flex: 1, width: '100%', height: '100%' },
});

export default ThemedBreathingOrb;
