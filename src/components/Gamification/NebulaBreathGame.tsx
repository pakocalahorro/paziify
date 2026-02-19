import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Canvas, Circle, Group, Blur, Paint } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue, cancelAnimation, withSequence, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface NebulaBreathProps {
    onComplete: () => void;
}

const NebulaBreathGame: React.FC<NebulaBreathProps> = ({ onComplete }) => {
    // Game State
    const progress = useSharedValue(0); // 0 to 1 (Cleanliness)
    const isBreathing = useSharedValue(0); // 0 (Exhale) to 1 (Inhale)

    // Animation Timer (Replaces Skia Clock)
    const time = useSharedValue(0);

    // Continuous Animation Loop
    useEffect(() => {
        time.value = withRepeat(
            withTiming(1000, { duration: 10000, easing: Easing.linear }),
            -1,
            false
        );
        return () => cancelAnimation(time);
    }, []);

    // Interaction Gesture (Long Press to Breathe/Clean)
    const longPress = Gesture.LongPress()
        .minDuration(100)
        .onStart(() => {
            'worklet';
            isBreathing.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        })
        .onFinalize(() => {
            'worklet';
            isBreathing.value = withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            // Add progress on exhale/release cycle
            if (progress.value < 1) {
                const newProgress = progress.value + 0.2;
                progress.value = withTiming(newProgress, { duration: 1000 }, (finished) => {
                    if (finished && newProgress >= 0.95) {
                        runOnJS(handleWin)();
                    }
                });
            }
        });

    const handleWin = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
    };

    // Derived Values for Animations
    const fogOpacity = useDerivedValue(() => 1 - progress.value);

    // Pulse effect: Base + Sine wave
    const fogRadius = useDerivedValue(() => {
        return 150 + Math.sin(time.value / 1000 * Math.PI * 2) * 20;
    });

    const breathRadius = useDerivedValue(() => {
        return 50 + (isBreathing.value * 100);
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={longPress}>
                <View style={styles.touchArea}>
                    <Canvas style={styles.canvas}>
                        <Group>
                            {/* Background Aura */}
                            <Paint color="#1e293b" />
                            <Circle cx={width / 2} cy={height / 2} r={width} />

                            {/* Nebula Fog (Disappears as progress increases) */}
                            <Group opacity={fogOpacity}>
                                <Blur blur={20} />
                                <Circle
                                    cx={width / 2}
                                    cy={height / 2}
                                    r={fogRadius}
                                    color="#64748b"
                                    opacity={0.5}
                                />
                                <Circle
                                    cx={width / 2 - 50}
                                    cy={height / 2 - 50}
                                    r={100}
                                    color="#475569"
                                    opacity={0.3}
                                />
                            </Group>

                            {/* Breath Core (Expands when holding) */}
                            <Circle
                                cx={width / 2}
                                cy={height / 2}
                                r={breathRadius}
                                color="#2DD4BF"
                            >
                                <Blur blur={10} />
                            </Circle>
                        </Group>
                    </Canvas>

                    <View style={styles.instructions}>
                        <Text style={styles.text}>Mantén pulsado para inhalar y disipar la niebla</Text>
                    </View>
                </View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    touchArea: {
        flex: 1,
    },
    canvas: {
        flex: 1,
    },
    instructions: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        alignItems: 'center',
    },
    text: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default NebulaBreathGame;
