import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import NebulaBreathGame from './NebulaBreathGame';
import OrbFlowGame from './OrbFlowGame';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface GameContainerProps {
    mode: 'healing' | 'growth';
    onClose: () => void;
    onComplete: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ mode, onClose, onComplete }) => {
    const insets = useSafeAreaInsets();
    const [gameState, setGameState] = useState<'instructions' | 'countdown' | 'playing' | 'won' | 'failed'>('instructions');
    const [countdown, setCountdown] = useState(3);

    const startGame = () => {
        setGameState('countdown');
    };

    // Countdown Logic
    useEffect(() => {
        if (gameState === 'countdown') {
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setGameState('playing');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameState]);

    const handleGameComplete = () => {
        setGameState('won');
        setTimeout(onComplete, 3000); // Close after showing success
    };

    const handleGameFail = () => {
        setGameState('failed');
        // Gentle exit after 4 seconds
        setTimeout(onClose, 4000);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Game Engine (Only render when playing to save resources/prevent early start) */}
                {gameState === 'playing' && (
                    <View style={styles.gameLayer}>
                        {mode === 'healing' ? (
                            <NebulaBreathGame onComplete={handleGameComplete} />
                        ) : (
                            <OrbFlowGame onComplete={handleGameComplete} onFail={handleGameFail} />
                        )}
                    </View>
                )}

                {/* INSTRUCTIONS OVERLAY */}
                {gameState === 'instructions' && (
                    <BlurView intensity={80} tint="dark" style={styles.overlay}>
                        <Animated.View entering={ZoomIn.duration(400)} style={styles.card}>
                            <Ionicons
                                name={mode === 'healing' ? "leaf" : "flash"}
                                size={60}
                                color={theme.colors.primary}
                                style={{ marginBottom: 20 }}
                            />
                            <Text style={styles.instructionsTitle}>
                                {mode === 'healing' ? 'SANA TU ENERGÍA' : 'EXPANDE TU FLUJO'}
                            </Text>
                            <Text style={styles.instructionsText}>
                                {mode === 'healing'
                                    ? "Usa tu respiración para disipar la niebla mental.\n\nMantén pulsado para inhalar."
                                    : "Mueve el orbe deslizando el dedo.\n\nCaptura 10 esferas de energía para crecer."}
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={startGame}>
                                <Text style={styles.startButtonText}>COMENZAR</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </BlurView>
                )}

                {/* COUNTDOWN OVERLAY */}
                {gameState === 'countdown' && (
                    <View style={styles.overlayCentered}>
                        <Animated.Text
                            key={countdown}
                            entering={ZoomIn}
                            exiting={FadeOut}
                            style={styles.countdownText}
                        >
                            {countdown}
                        </Animated.Text>
                    </View>
                )}

                {/* SUCCESS OVERLAY */}
                {gameState === 'won' && (
                    <BlurView intensity={90} tint="dark" style={styles.overlay}>
                        <Animated.View entering={ZoomIn} style={styles.card}>
                            <Ionicons name="trophy" size={80} color="#FFD700" />
                            <Text style={[styles.instructionsTitle, { color: '#FFD700', marginTop: 20 }]}>
                                ¡ENHORABUENA!
                            </Text>
                            <Text style={styles.instructionsText}>
                                Has completado tu viaje de {mode === 'healing' ? 'sanación' : 'crecimiento'}.
                            </Text>
                        </Animated.View>
                    </BlurView>
                )}

                {/* FAILED (GENTLE) OVERLAY */}
                {gameState === 'failed' && (
                    <BlurView intensity={90} tint="dark" style={styles.overlay}>
                        <Animated.View entering={ZoomIn} style={styles.card}>
                            <Ionicons name="heart" size={80} color={theme.colors.primary} />
                            <Text style={[styles.instructionsTitle, { marginTop: 20 }]}>
                                No pasa nada
                            </Text>
                            <Text style={styles.instructionsText}>
                                Tu energía sigue creciendo. Lo importante es intentarlo.
                            </Text>
                            <Text style={[styles.instructionsText, { fontSize: 14, opacity: 0.6 }]}>
                                Volviendo al inicio...
                            </Text>
                        </Animated.View>
                    </BlurView>
                )}

                {/* Close Button (Always visible except results) */}
                {(gameState !== 'won' && gameState !== 'failed') && (
                    <View style={[styles.header, { top: insets.top }]}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <BlurView intensity={20} tint="dark" style={styles.blurBtn}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    gameLayer: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 20,
    },
    closeButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    blurBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
    },
    overlayCentered: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
    },
    card: {
        backgroundColor: '#1A1A2E',
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    instructionsTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 15,
        textAlign: 'center',
    },
    instructionsText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    countdownText: {
        fontSize: 120,
        fontWeight: '900',
        color: '#FFF',
        textShadowColor: 'rgba(255,255,255,0.5)',
        textShadowRadius: 20,
    }
});

export default GameContainer;
