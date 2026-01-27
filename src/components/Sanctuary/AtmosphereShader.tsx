import React, { useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
    SharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface AtmosphereShaderProps {
    progress: SharedValue<number>; // -1 (Healing) to 1 (Growth)
}

const atmosphereSource = Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec2 iResolution;
uniform float iProgress; // -1 to 1

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    // Much brighter base colors to avoid black screen
    vec3 neutralColor = vec3(0.05, 0.1, 0.2); // Visible blue
    vec3 healingColor = vec3(0.1, 0.4, 0.35); // Teal glow
    vec3 growthColor = vec3(0.4, 0.3, 0.1);  // Amber glow
    
    vec3 baseColor;
    if (iProgress < 0.0) {
        baseColor = mix(neutralColor, healingColor, abs(iProgress));
    } else {
        baseColor = mix(neutralColor, growthColor, iProgress);
    }
    
    // Add dynamic noise directly in shader
    float n = hash(uv + fract(iTime * 0.1));
    baseColor += n * 0.03;
    
    // Light pulse in the center area
    float dist = length(uv - 0.5);
    float glow = exp(-dist * 2.0) * 0.1;
    baseColor += glow;
    
    return vec4(baseColor, 1.0);
}
`)!;

const AtmosphereShader: React.FC<AtmosphereShaderProps> = ({ progress }) => {
    const iTime = useSharedValue(0);

    React.useEffect(() => {
        iTime.value = withRepeat(
            withTiming(10, { duration: 20000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const uniforms = useDerivedValue(() => {
        return {
            iTime: iTime.value,
            iResolution: [width, height],
            iProgress: progress.value,
        };
    });

    return (
        <Canvas style={StyleSheet.absoluteFill}>
            <Fill>
                <RuntimeShader source={atmosphereSource} uniforms={uniforms} />
            </Fill>
        </Canvas>
    );
};

export default AtmosphereShader;
