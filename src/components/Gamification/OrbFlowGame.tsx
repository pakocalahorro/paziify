import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    cancelAnimation,
    runOnJS,
    Easing
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const LANE_WIDTH = width / 3;
const TOP_OFFSET = 120; // Start higher up
const WIN_SCORE = 20; // Increased to 20

interface OrbFlowProps {
    onComplete: () => void;
    onFail?: () => void;
}

const OrbFlowGame: React.FC<OrbFlowProps> = ({ onComplete, onFail }) => {
    // Game State
    const [gameScore, setGameScore] = useState(0); // For UI Render
    const score = useSharedValue(0);
    const hasStarted = useSharedValue(0);
    const playerScale = useSharedValue(1);

    // Orb (Target) Animation
    const orbY = useSharedValue(-TOP_OFFSET);
    const orbLane = useSharedValue(1);

    // Player Animation
    const playerX = useSharedValue(width / 2 - 25);
    const contextX = useSharedValue(0);

    // Speed Control (Duration decreases as score increases)
    const getDuration = (currentScore: number) => {
        'worklet';
        const baseDuration = 2000;
        const minDuration = 600; // Faster at the end
        // Decrease by 70ms per point (20 * 70 = 1400 -> 2000-1400 = 600ms)
        return Math.max(minDuration, baseDuration - (currentScore * 70));
    };

    const handleWin = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
    };

    const handleFail = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (onFail) onFail();
        else onComplete();
    };

    const handleCatch = (newScore: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setGameScore(newScore);
    };

    // Game Loop
    useEffect(() => {
        const dropOrb = () => {
            'worklet';
            cancelAnimation(orbY);

            // Generate new lane
            orbY.value = -TOP_OFFSET;
            orbLane.value = Math.floor(Math.random() * 3);

            // Calculate speed based on score
            const duration = getDuration(score.value);

            orbY.value = withTiming(height + 100, { duration: duration, easing: Easing.linear }, (finished) => {
                if (finished) {
                    // Orb reached bottom without being cancelled (caught)
                    // This is a MISS
                    runOnJS(handleFail)();
                }
            });
        };

        const dropOrbWrapper = () => {
            dropOrb();
        };

        // Start Loop
        dropOrbWrapper();

        const interval = setInterval(() => {
            // Collision Logic
            const orbYVal = orbY.value;
            const playerCenter = playerX.value + 25;
            const playerLaneIndex = Math.floor(playerCenter / LANE_WIDTH);
            const targetLane = orbLane.value;

            // Hit Window
            if (orbYVal > height - 150 && orbYVal < height - 50) {
                if (playerLaneIndex === targetLane) {
                    // CAUGHT!
                    score.value += 1;
                    runOnJS(handleCatch)(score.value); // Update UI and Haptics

                    // Visual Feedback
                    playerScale.value = withSequence(
                        withTiming(1.5, { duration: 100 }),
                        withTiming(1, { duration: 100 })
                    );

                    // Hide Orb immediately
                    orbY.value = height + 200;
                    cancelAnimation(orbY);

                    // Check Win
                    if (score.value >= WIN_SCORE) {
                        clearInterval(interval);
                        runOnJS(handleWin)();
                    } else {
                        // Next Orb
                        runOnJS(dropOrbWrapper)();
                    }
                }
            }
        }, 30); // 30ms check interval

        return () => {
            clearInterval(interval);
            cancelAnimation(orbY);
        };
    }, []);

    // PAN GESTURE (Drag)
    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextX.value = playerX.value;
            hasStarted.value = 1;
        })
        .onUpdate((event) => {
            let newX = contextX.value + event.translationX;
            // Clamp to screen
            if (newX < 0) newX = 0;
            if (newX > width - 50) newX = width - 50;
            playerX.value = newX;
        });

    const animatedPlayerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: playerX.value },
            { scale: playerScale.value }
        ]
    }));

    const animatedOrbStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: orbLane.value * LANE_WIDTH + LANE_WIDTH / 2 - 20 },
            { translateY: orbY.value }
        ]
    }));

    const instructionsStyle = useAnimatedStyle(() => ({
        opacity: withTiming(hasStarted.value ? 0 : 1)
    }));

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.touchArea}>
                    {/* Lanes */}
                    <View style={styles.laneMarker} />
                    <View style={[styles.laneMarker, { left: LANE_WIDTH * 2 }]} />

                    {/* Player */}
                    <Animated.View style={[styles.player, animatedPlayerStyle]}>
                        <Ionicons name="flash" size={30} color="#FBBF24" />
                    </Animated.View>

                    {/* Orb */}
                    <Animated.View style={[styles.orb, animatedOrbStyle]}>
                        <View style={styles.orbCore} />
                    </Animated.View>

                    {/* Instructions Overlay */}
                    <Animated.View style={[styles.instructions, instructionsStyle]} pointerEvents="none">
                        <Text style={styles.instructionText}>DESLIZA DEDO</Text>
                        <Text style={styles.subText}>Atrapa {WIN_SCORE} esferas de energía</Text>
                    </Animated.View>

                    {/* Score */}
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{gameScore}/{WIN_SCORE}</Text>
                    </View>
                </View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    touchArea: {
        flex: 1,
    },
    laneMarker: {
        position: 'absolute',
        left: LANE_WIDTH,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    player: {
        position: 'absolute',
        bottom: 100,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FBBF24',
        shadowColor: "#FBBF24",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    orb: {
        position: 'absolute',
        top: 0,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orbCore: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
        shadowColor: '#FFF',
        shadowRadius: 12,
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 0 },
    },
    scoreContainer: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
    },
    scoreText: {
        color: '#FBBF24',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
    },
    instructions: {
        position: 'absolute',
        top: '40%',
        width: '100%',
        alignItems: 'center',
        zIndex: 5,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 10,
    },
    subText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default OrbFlowGame;
