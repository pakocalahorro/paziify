import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface NebulaBackgroundProps {
    mode?: 'healing' | 'growth';
}

const NebulaBackground: React.FC<NebulaBackgroundProps> = ({ mode = 'healing' }) => {
    const layer1X = useRef(new Animated.Value(0)).current;
    const layer1Y = useRef(new Animated.Value(0)).current;
    const layer2X = useRef(new Animated.Value(0)).current;
    const layer2Y = useRef(new Animated.Value(0)).current;
    const pulseOpacity = useRef(new Animated.Value(0.6)).current;

    const colors = mode === 'healing'
        ? ['#020617', '#0F172A', '#1E1B4B'] // Ultra dark blue palette
        : ['#0c0a09', '#1c1917', '#451a03']; // Ultra dark earth palette

    const accentColor1 = mode === 'healing' ? '#4f46e5' : '#ea580c';
    const accentColor2 = mode === 'healing' ? '#818cf8' : '#fbbf24';

    useEffect(() => {
        const createLoop = (val: Animated.Value, to: number, duration: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, { toValue: to, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                    Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                ])
            ).start();
        };

        createLoop(layer1X, -60, 20000);
        createLoop(layer1Y, -80, 25000);
        createLoop(layer2X, 60, 22000);
        createLoop(layer2Y, -60, 28000);

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseOpacity, { toValue: 0.9, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseOpacity, { toValue: 0.5, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={colors} style={StyleSheet.absoluteFillObject} />

            <Animated.View style={[styles.nebulaLayer, { transform: [{ translateX: layer1X }, { translateY: layer1Y }], opacity: pulseOpacity }]}>
                <LinearGradient
                    colors={['transparent', accentColor1, 'transparent']}
                    style={{ flex: 1, borderRadius: 1000 }}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                />
            </Animated.View>

            <Animated.View style={[styles.nebulaLayer, { transform: [{ translateX: layer2X }, { translateY: layer2Y }], opacity: Animated.multiply(pulseOpacity, 0.6) }]}>
                <LinearGradient
                    colors={['transparent', accentColor2, 'transparent']}
                    style={{ flex: 1, borderRadius: 1000 }}
                    start={{ x: 0.8, y: 0.2 }}
                    end={{ x: 0.2, y: 0.8 }}
                />
            </Animated.View>

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
    nebulaLayer: {
        position: 'absolute',
        width: width * 1.8,
        height: height * 1.8,
        top: -height * 0.4,
        left: -width * 0.4,
        opacity: 0.5,
    }
});

export default NebulaBackground;
