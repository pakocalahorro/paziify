import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
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
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface LiquidOrbProps {
    color: string;
    size?: number;
    breathing?: boolean;
    mode?: 'healing' | 'growth';
    isPressed?: boolean;
}

const source = Skia.RuntimeEffect.Make(`
uniform float iTime;
uniform vec2 iResolution;
uniform vec3 iColor;
uniform float iPressed;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.y;
    vec2 center = vec2(0.5 * iResolution.x/iResolution.y, 0.5);
    float d = length(uv - center);
    
    float pulse = sin(iTime * 2.0) * 0.05 + 0.95;
    float alpha = smoothstep(0.48 * pulse, 0.1, d);
    
    vec3 color = iColor;
    if (iPressed > 0.5) {
        color = mix(color, vec3(1.0), 0.3 * iPressed);
    }
    
    // Add a slight glow in the center
    float glow = 0.02 / (d + 0.01);
    color += glow * 0.2;
    
    return vec4(color, alpha * 0.9);
}
`)!;

const LiquidOrb: React.FC<LiquidOrbProps> = ({ color: colorStr, size = 200, isPressed = false }) => {
    const iTime = useSharedValue(0);
    const pressedShared = useSharedValue(0);
    const scaleShared = useSharedValue(1);
    const floatShared = useSharedValue(0);

    const rgbColor = useMemo(() => {
        const c = colorStr.replace('#', '');
        return [
            parseInt(c.substring(0, 2), 16) / 255,
            parseInt(c.substring(2, 4), 16) / 255,
            parseInt(c.substring(4, 6), 16) / 255
        ];
    }, [colorStr]);

    useEffect(() => {
        iTime.value = withRepeat(withTiming(10, { duration: 15000, easing: Easing.linear }), -1, false);
        scaleShared.value = withRepeat(withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.sin) }), -1, true);
        floatShared.value = withRepeat(withTiming(8, { duration: 4000, easing: Easing.inOut(Easing.sin) }), -1, true);
    }, []);

    useEffect(() => {
        pressedShared.value = withTiming(isPressed ? 1 : 0, { duration: 250 });
    }, [isPressed]);

    const uniforms = useDerivedValue(() => {
        return {
            iTime: iTime.value,
            iResolution: [size, size],
            iColor: rgbColor,
            iPressed: pressedShared.value,
        };
    });

    const animatedStyle = useAnimatedStyle(() => ({
        width: size,
        height: size,
        transform: [
            { translateY: floatShared.value },
            { scale: scaleShared.value * (1 - pressedShared.value * 0.1) }
        ]
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Canvas style={styles.canvas}>
                <Fill>
                    <RuntimeShader source={source} uniforms={uniforms} />
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

export default LiquidOrb;
