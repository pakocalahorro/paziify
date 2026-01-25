import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface LiquidOrbProps {
    color: string;
    size?: number;
    breathing?: boolean;
}

const LiquidOrb: React.FC<LiquidOrbProps> = ({ color, size = 200, breathing = true }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (breathing) {
            // Organic scale breathing
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 3500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 3500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Opacity pulse for "glowing" feel
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.7,
                        duration: 3000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Subtle rotation for the gradient alignment
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 12000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [breathing]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer Glow Layer */}
            <Animated.View
                style={[
                    styles.absolute,
                    {
                        width: size * 1.2,
                        height: size * 1.2,
                        transform: [{ scale: scaleAnim }],
                        opacity: Animated.multiply(opacityAnim, 0.3)
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="glowGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.6" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="50" fill="url(#glowGrad)" />
                </Svg>
            </Animated.View>

            {/* Main Orb Body */}
            <Animated.View
                style={[
                    { width: size, height: size },
                    {
                        transform: [{ scale: scaleAnim }, { rotate: spin }],
                        opacity: opacityAnim
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="mainGrad" cx="40%" cy="40%" rx="60%" ry="60%">
                            <Stop offset="0%" stopColor="#FFF" stopOpacity="0.3" />
                            <Stop offset="40%" stopColor={color} stopOpacity="0.9" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="45" fill="url(#mainGrad)" />
                </Svg>
            </Animated.View>

            {/* Core "Mass" Layer */}
            <Animated.View
                style={[
                    styles.absolute,
                    {
                        width: size * 0.4,
                        height: size * 0.4,
                        opacity: 0.9
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="30" fill="#FFF" opacity={0.15} />
                    <Circle cx="50" cy="50" r="15" fill="#FFF" opacity={0.2} />
                </Svg>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
    }
});

export default LiquidOrb;
