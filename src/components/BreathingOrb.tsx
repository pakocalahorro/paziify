import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { theme } from '../constants/theme';

interface BreathingOrbProps {
    isActive: boolean;
    duration?: number; // seconds per cycle
    color?: string;
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({
    isActive,
    duration = 8,
    color = theme.colors.primary,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.6)).current;
    const phaseRef = useRef<'inhale' | 'exhale'>('inhale');

    useEffect(() => {
        if (isActive) {
            startBreathingAnimation();
        } else {
            stopBreathingAnimation();
        }
    }, [isActive]);

    const startBreathingAnimation = () => {
        const breathCycle = () => {
            // Inhale
            phaseRef.current = 'inhale';
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1.5,
                    duration: (duration / 2) * 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: (duration / 2) * 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Exhale
                phaseRef.current = 'exhale';
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: (duration / 2) * 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.6,
                        duration: (duration / 2) * 1000,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (isActive) {
                        breathCycle();
                    }
                });
            });
        };

        breathCycle();
    };

    const stopBreathingAnimation = () => {
        scaleAnim.setValue(1);
        opacityAnim.setValue(0.6);
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.orb,
                    {
                        backgroundColor: color,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            />
            {isActive && (
                <Text style={styles.instruction}>
                    {phaseRef.current === 'inhale' ? 'Inhala' : 'Exhala'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    orb: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    instruction: {
        marginTop: theme.spacing.lg,
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
});

export default BreathingOrb;
