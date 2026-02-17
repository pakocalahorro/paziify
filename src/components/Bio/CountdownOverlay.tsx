import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface CountdownOverlayProps {
    count: number;        // 3, 2, 1
    visible: boolean;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count, visible }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 200 });
            scale.value = withSequence(
                withTiming(1.3, { duration: 150, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 150, easing: Easing.in(Easing.ease) })
            );
        } else {
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [count, visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.countdownContainer, animatedStyle]}>
                <Text style={styles.countdownText}>{count}</Text>
            </Animated.View>
            <Text style={styles.messageText}>¡Perfecto! Iniciando...</Text>
            <Text style={styles.subtitleText}>Mantén el dedo quieto</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    countdownContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    countdownText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    messageText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#10B981',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#9CA3AF',
    },
});
