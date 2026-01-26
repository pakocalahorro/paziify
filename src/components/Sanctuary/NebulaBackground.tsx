import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface NebulaBackgroundProps {
    mode?: 'healing' | 'growth';
}

const PARTICLE_COUNT = 35;

const NebulaBackground: React.FC<NebulaBackgroundProps> = ({ mode = 'healing' }) => {
    const layer1X = useRef(new Animated.Value(0)).current;
    const layer1Y = useRef(new Animated.Value(0)).current;
    const layer2X = useRef(new Animated.Value(0)).current;
    const layer2Y = useRef(new Animated.Value(0)).current;
    const pulseOpacity = useRef(new Animated.Value(0.6)).current;

    const colors = (mode === 'healing'
        ? ['#050810', '#0D1117', '#1E1B4B']
        : ['#0C0A09', '#292524', '#451A03']) as [string, string, string];

    const accentColor1 = mode === 'healing' ? '#4F46E5' : '#EA580C';
    const accentColor2 = mode === 'healing' ? '#818CF8' : '#FBBF24';

    // Particle system data
    const particles = useMemo(() => {
        return Array.from({ length: PARTICLE_COUNT }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            anim: new Animated.Value(0),
            duration: Math.random() * 5000 + 4000,
            delay: Math.random() * 5000,
        }));
    }, [mode]);

    useEffect(() => {
        const createLoop = (val: Animated.Value, to: number, duration: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, { toValue: to, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                    Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                ])
            ).start();
        };

        createLoop(layer1X, -40, 25000);
        createLoop(layer1Y, -60, 30000);
        createLoop(layer2X, 40, 28000);
        createLoop(layer2Y, -40, 32000);

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseOpacity, { toValue: 0.85, duration: 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseOpacity, { toValue: 0.45, duration: 10000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();

        // Animate particles
        particles.forEach(p => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(p.delay),
                    Animated.timing(p.anim, {
                        toValue: 1,
                        duration: p.duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.anim, {
                        toValue: 0,
                        duration: p.duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    })
                ])
            ).start();
        });
    }, [particles]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={colors} style={StyleSheet.absoluteFillObject} />

            {/* Nebula Layers */}
            <Animated.View style={[styles.nebulaLayer, { transform: [{ translateX: layer1X }, { translateY: layer1Y }], opacity: pulseOpacity }]}>
                <LinearGradient
                    colors={['transparent', `${accentColor1}40`, 'transparent']}
                    style={{ flex: 1, borderRadius: 1000 }}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                />
            </Animated.View>

            <Animated.View style={[styles.nebulaLayer, { transform: [{ translateX: layer2X }, { translateY: layer2Y }], opacity: Animated.multiply(pulseOpacity, 0.7) }]}>
                <LinearGradient
                    colors={['transparent', `${accentColor2}30`, 'transparent']}
                    style={{ flex: 1, borderRadius: 1000 }}
                    start={{ x: 0.8, y: 0.2 }}
                    end={{ x: 0.2, y: 0.8 }}
                />
            </Animated.View>

            {/* Particle System (Stardust) */}
            {particles.map((p, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.particle,
                        {
                            left: p.x,
                            top: p.y,
                            width: p.size,
                            height: p.size,
                            opacity: p.anim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0.7, 0]
                            }),
                            transform: [{
                                translateY: p.anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -40]
                                })
                            }]
                        }
                    ]}
                />
            ))}

            {/* Depth Gradient Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0.5, y: 0.2 }}
                end={{ x: 0.5, y: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
    nebulaLayer: {
        position: 'absolute',
        width: width * 1.6,
        height: height * 1.6,
        top: -height * 0.3,
        left: -width * 0.3,
    },
    particle: {
        position: 'absolute',
        backgroundColor: '#FFF',
        borderRadius: 50,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    }
});

export default NebulaBackground;
