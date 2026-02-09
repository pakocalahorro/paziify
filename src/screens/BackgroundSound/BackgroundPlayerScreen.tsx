import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Switch,
    Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Circle, vec, Group } from "@shopify/react-native-skia";
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList, Screen } from '../../types';
import { SOUNDSCAPES, BINAURAL_WAVES } from '../../data/soundscapesData';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

type Props = NativeStackScreenProps<RootStackParamList, Screen.BACKGROUND_PLAYER>;

const { width, height } = Dimensions.get('window');

// --- Simple Particle System (Dust/Stars) ---
const ParticleSystem: React.FC<{ count?: number }> = ({ count = 30 }) => {
    // const clock = useClock(); <--- Removed this line in spirit by replacing with nothing

    // Create random initial positions and velocities
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.1,
        }));
    }, [count]);

    // Animate logic in UI thread via Skia
    // Note: detailed animation logic skipped for brevity/reliability in this snippet, 
    // simply rendering static pleasing particles for V1 to ensure stability.
    // In a full implementation, we'd use useComputedValue to update positions based on clock.

    return (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p, i) => (
                <Circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={p.r}
                    color={`rgba(255, 255, 255, ${p.opacity})`}
                />
            ))}
        </Canvas>
    );
};

const BackgroundPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
    const { soundscapeId } = route.params;
    const insets = useSafeAreaInsets();
    const {
        loadTrack,
        play,
        pause,
        isPlaying,
        currentTrack,
        loadBinauralLayer,
        setExternalAudioActive
    } = useAudioPlayer();

    const [activeBinauralId, setActiveBinauralId] = useState<string | null>(null);
    const [isMixerOpen, setIsMixerOpen] = useState(false);

    // Find data
    const soundscape = useMemo(() =>
        SOUNDSCAPES.find(s => s.id === soundscapeId),
        [soundscapeId]);

    // Initial Load
    useEffect(() => {
        if (soundscape) {
            // Load as an infinite track
            loadTrack({
                id: soundscape.id,
                title: soundscape.name,
                author: 'Paziify Ambientes',
                cover: { uri: soundscape.image },
                audioUrl: soundscape.audioFile.uri,
                duration: 0,
                isInfinite: true
            });
        }
    }, [soundscapeId]);

    // Handle Binaural Layer
    useEffect(() => {
        if (activeBinauralId) {
            const wave = BINAURAL_WAVES.find(w => w.id === activeBinauralId);
            if (wave?.audioFile?.uri) {
                loadBinauralLayer(wave.audioFile.uri);
            } else {
                // Explicitly unload if no audio file (e.g. pending ones)
                loadBinauralLayer(null);
            }
        } else {
            loadBinauralLayer(null);
        }
    }, [activeBinauralId]);

    if (!soundscape) return null;

    const togglePlay = () => {
        if (isPlaying) pause();
        else play();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* 1. Immersive Background */}
            <ImageBackground
                source={{ uri: soundscape.image }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            >
                {/* Dark Overlay */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

                {/* Skia Particles */}
                <ParticleSystem count={40} />

                {/* 2. Main UI */}
                <View style={[styles.mainContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.iconBtn}
                        >
                            <Ionicons name="chevron-down" size={32} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Ambiente Activo</Text>
                        <TouchableOpacity style={styles.iconBtn}>
                            {/* Timer placeholder */}
                            <Ionicons name="timer-outline" size={28} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Center Info */}
                    <View style={styles.centerInfo}>
                        <Text style={styles.soundTitle}>{soundscape.name}</Text>
                        <Text style={styles.soundDesc}>{soundscape.description}</Text>

                        {/* Play Button */}
                        <TouchableOpacity
                            style={styles.playBtn}
                            onPress={togglePlay}
                            activeOpacity={0.8}
                        >
                            <BlurView intensity={30} tint="light" style={styles.playBlur}>
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={48}
                                    color="#FFF"
                                    style={{ marginLeft: isPlaying ? 0 : 4 }}
                                />
                            </BlurView>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls / Mixer */}
                    <View style={styles.bottomControls}>
                        <TouchableOpacity
                            style={[styles.mixerBtn, isMixerOpen && styles.mixerBtnActive]}
                            onPress={() => setIsMixerOpen(!isMixerOpen)}
                        >
                            <Ionicons name="options" size={24} color="#FFF" />
                            <Text style={styles.mixerText}>Mezclador Binaural</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mixer Sheet (Conditional) */}
                    {isMixerOpen && (
                        <BlurView intensity={80} tint="dark" style={styles.mixerSheet}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mixerList}>
                                {BINAURAL_WAVES.map((wave) => {
                                    const isActive = activeBinauralId === wave.id;
                                    const isAvailable = !!wave.audioFile; // Disable if no audio

                                    return (
                                        <TouchableOpacity
                                            key={wave.id}
                                            style={[
                                                styles.waveCard,
                                                isActive && { borderColor: wave.color, backgroundColor: 'rgba(255,255,255,0.1)' },
                                                !isAvailable && { opacity: 0.5 }
                                            ]}
                                            onPress={() => isAvailable && setActiveBinauralId(isActive ? null : wave.id)}
                                            disabled={!isAvailable}
                                        >
                                            <View style={[styles.waveIcon, { backgroundColor: isActive ? wave.color : '#333' }]}>
                                                <Ionicons name="pulse" size={20} color="#FFF" />
                                            </View>
                                            <Text style={styles.waveName}>{wave.name}</Text>
                                            <Text style={styles.waveFreq}>{wave.frequency}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </BlurView>
                    )}
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    centerInfo: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    soundTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    soundDesc: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 40,
        fontWeight: '500',
    },
    playBtn: {
        borderRadius: 50,
        overflow: 'hidden',
    },
    playBlur: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    bottomControls: {
        paddingHorizontal: 30,
        paddingBottom: 20,
        alignItems: 'center',
    },
    mixerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 10,
    },
    mixerBtnActive: {
        backgroundColor: '#FFF',
    },
    mixerText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    mixerSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 180,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        paddingVertical: 20,
    },
    mixerList: {
        paddingHorizontal: 20,
        gap: 12,
        alignItems: 'center',
    },
    waveCard: {
        width: 100,
        height: 130,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    waveIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    waveName: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    waveFreq: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
    }
});

export default BackgroundPlayerScreen;
