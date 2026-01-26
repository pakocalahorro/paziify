import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Image } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface LiquidOrbProps {
    color: string;
    size?: number;
    breathing?: boolean;
    mode?: 'healing' | 'growth';
    isPressed?: boolean;
}

const LiquidOrb: React.FC<LiquidOrbProps> = ({ color, size = 200, breathing = true, mode = 'healing', isPressed = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pressScaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (breathing) {
            // Organic scale breathing
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.05,
                        duration: 4000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.98,
                        duration: 4000,
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
                    duration: 15000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Vertical floating
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: -15,
                        duration: 6000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 15,
                        duration: 6000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [breathing]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        if (isPressed) {
            Animated.spring(pressScaleAnim, {
                toValue: 0.85,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(pressScaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }).start();
        }
    }, [isPressed]);

    return (
        <Animated.View
            style={{
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                    { translateY: floatAnim },
                    { scale: pressScaleAnim }
                ]
            }}
        >
            {/* Outer Aura / Glow */}
            <Animated.View
                style={[
                    styles.absolute,
                    {
                        width: size * 1.5,
                        height: size * 1.5,
                        transform: [{ scale: scaleAnim }],
                        opacity: Animated.multiply(opacityAnim, 0.4)
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="auraGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
                            <Stop offset="60%" stopColor={color} stopOpacity="0.2" />
                            <Stop offset="100%" stopColor={color} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="50" fill="url(#auraGrad)" />
                </Svg>
            </Animated.View>

            {/* Main Body */}
            <Animated.View
                style={[
                    { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' },
                    {
                        transform: [{ scale: scaleAnim }, { rotate: spin }],
                        opacity: opacityAnim,
                        elevation: 20,
                        shadowColor: color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 20,
                    }
                ]}
            >
                {mode === 'healing' ? (
                    <Image
                        source={require('../../assets/sanctuary/healing_orb.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                ) : (
                    <Svg height="100%" width="100%" viewBox="0 0 100 100">
                        <Defs>
                            <RadialGradient id="plasmaGrad" cx="30%" cy="30%" rx="70%" ry="70%">
                                <Stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                                <Stop offset="20%" stopColor="#FFD700" stopOpacity="1" />
                                <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                                <Stop offset="100%" stopColor="#78350F" stopOpacity="0.8" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="50" cy="50" r="50" fill="url(#plasmaGrad)" />
                    </Svg>
                )}
            </Animated.View>

            {/* Surface Reflections / Specular Highlights */}
            <Animated.View
                style={[
                    styles.absolute,
                    {
                        width: size,
                        height: size,
                        transform: [{ scale: scaleAnim }],
                        opacity: 0.6
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="reflectGrad" cx="35%" cy="30%" rx="40%" ry="25%">
                            <Stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
                            <Stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <Circle cx="50" cy="50" r="50" fill="url(#reflectGrad)" />
                </Svg>
            </Animated.View>

            {/* Inner Sparkle / Core */}
            <Animated.View
                style={[
                    styles.absolute,
                    {
                        width: size * 0.3,
                        height: size * 0.3,
                        opacity: Animated.multiply(opacityAnim, 0.9)
                    }
                ]}
            >
                <View style={[
                    styles.core,
                    {
                        backgroundColor: '#FFF',
                        width: '100%',
                        height: '100%',
                        borderRadius: size,
                        shadowColor: '#FFF',
                        shadowRadius: 10,
                        shadowOpacity: 1,
                        elevation: 10,
                    }
                ]} />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
    },
    core: {
        opacity: 0.4,
    }
});

export default LiquidOrb;
