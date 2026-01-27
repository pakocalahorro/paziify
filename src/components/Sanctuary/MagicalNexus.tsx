import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Canvas,
    Fill,
    RuntimeShader,
    Skia,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    useDerivedValue,
    withRepeat,
    withTiming,
    Easing,
    useAnimatedStyle,
    SharedValue,
} from 'react-native-reanimated';

interface MagicalNexusProps {
    progress: SharedValue<number>; // -1 (Healing) to 1 (Growth)
    size?: number;
}

const nexusSource = Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec2 iResolution;
uniform float iProgress;

vec4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float d = length(uv);
    
    // Core glow
    float core = smoothstep(0.15, 0.0, d);
    
    // Pulse
    float pulse = sin(iTime * 2.0) * 0.02 + 0.98;
    float ring = smoothstep(0.2 * pulse, 0.18 * pulse, d) * smoothstep(0.15 * pulse, 0.17 * pulse, d);
    
    vec3 col = vec3(1.0); // Neutral white
    if (iProgress < 0.0) col = mix(col, vec3(0.2, 0.9, 0.8), abs(iProgress));
    else col = mix(col, vec3(1.0, 0.8, 0.2), iProgress);
    
    float alpha = core + ring * 0.5;
    return vec4(col * alpha, alpha * 0.9);
}
`)!;

const MagicalNexus: React.FC<MagicalNexusProps> = ({ progress, size = 300 }) => {
    const iTime = useSharedValue(0);

    React.useEffect(() => {
        iTime.value = withRepeat(
            withTiming(2 * Math.PI, { duration: 10000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const uniforms = useDerivedValue(() => {
        return {
            iTime: iTime.value,
            iResolution: [size, size],
            iProgress: progress.value,
        };
    });

    const animatedStyle = useAnimatedStyle(() => ({
        width: size,
        height: size,
        transform: [
            { scale: 1 + Math.abs(progress.value) * 0.2 }
        ],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Canvas style={styles.canvas}>
                <Fill>
                    <RuntimeShader source={nexusSource} uniforms={uniforms} />
                </Fill>
            </Canvas>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    canvas: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default MagicalNexus;
