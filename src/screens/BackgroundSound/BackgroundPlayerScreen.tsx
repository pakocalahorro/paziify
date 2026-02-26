import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Dimensions,
    Alert,
    Animated
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Canvas, Circle, BlurMask } from "@shopify/react-native-skia";
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList, Screen } from '../../types';
import { SOUNDSCAPES, BINAURAL_WAVES } from '../../data/soundscapesData';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { soundscapesService } from '../../services/contentService';
import { ActivityIndicator } from 'react-native';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';

type Props = NativeStackScreenProps<RootStackParamList, Screen.BACKGROUND_PLAYER>;

const { width, height } = Dimensions.get('window');

// --- Dynamic Reactive Particle System ---
const ParticleSystem: React.FC<{ mode?: 'alpha' | 'theta' | 'delta' | 'none' }> = ({ mode = 'none' }) => {
    const particleCount = mode === 'alpha' ? 50 : 30;
    const particles = useMemo(() => {
        return new Array(particleCount).fill(0).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: mode === 'theta' ? Math.random() * 5 + 3 : Math.random() * 3 + 1.5,
            opacity: mode === 'delta' ? 0.05 : Math.random() * 0.4 + 0.1,
            speed: Math.random() * 0.5 + 0.2, // Movement speed
        }));
    }, [particleCount, mode]);

    if (mode === 'delta') return null;

    return (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p, i) => (
                <Circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={p.r}
                    color={`rgba(255, 255, 255, ${p.opacity})`}
                >
                    {mode === 'theta' && <BlurMask blur={4} style="normal" />}
                    {mode === 'alpha' && <BlurMask blur={1} style="normal" />}
                </Circle>
            ))}
        </Canvas>
    );
};

const TIMER_PRESETS = [5, 10, 15, 30, 45, 60];

const BackgroundPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
    const { soundscapeId } = route.params;
    const insets = useSafeAreaInsets();
    const {
        loadTrack,
        play,
        pause,
        isPlaying,
        loadBinauralLayer,
        currentTrack,
    } = useAudioPlayer();

    const [activeBinauralId, setActiveBinauralId] = useState<string | null>(null);
    const [isMixerOpen, setIsMixerOpen] = useState(false);
    const [soundscape, setSoundscape] = useState<any | null>(null);
    const [loadingSoundscape, setLoadingSoundscape] = useState(true);

    // Timer State
    const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
    const [isTimerSelectorOpen, setIsTimerSelectorOpen] = useState(false);

    // Reactive Atmosphere States
    const auraOpacity = useRef(new Animated.Value(0)).current;

    // Fetch data from service
    useEffect(() => {
        const fetchSoundscape = async () => {
            setLoadingSoundscape(true);
            try {
                // [ZERO EGRESS 2.0] Prioritize object passed via navigation
                if (route.params.soundscape) {
                    console.log('BackgroundPlayerScreen: Using navigation soundscape (Zero Egress)');
                    setSoundscape(route.params.soundscape);
                    setLoadingSoundscape(false);
                    return;
                }

                // Fallback: Fetch by ID (uses the new service-level fallback)
                const data = await soundscapesService.getById(soundscapeId);
                console.log('BackgroundPlayerScreen: Fetched soundscape:', data?.name || 'Local Found');
                if (data) {
                    setSoundscape(data);
                }
            } catch (err) {
                console.error('Error fetching soundscape:', err);
            } finally {
                setLoadingSoundscape(false);
            }
        };
        fetchSoundscape();
    }, [soundscapeId]);

    const activeBinaural = useMemo(() =>
        BINAURAL_WAVES.find(w => w.id === activeBinauralId),
        [activeBinauralId]);

    const atmosphereMode = useMemo(() => {
        if (!activeBinauralId) return 'none';
        if (activeBinauralId.includes('alpha')) return 'alpha';
        if (activeBinauralId.includes('theta')) return 'theta';
        if (activeBinauralId.includes('delta')) return 'delta';
        return 'none';
    }, [activeBinauralId]);

    // Aura Animation
    useEffect(() => {
        Animated.timing(auraOpacity, {
            toValue: activeBinauralId ? 1 : 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [activeBinauralId]);

    // Initial Load
    useEffect(() => {
        if (soundscape && (!currentTrack || currentTrack.id !== soundscape.id)) {
            console.log('Loading track in player:', soundscape.name, soundscape.audioFile?.uri);
            loadTrack({
                id: soundscape.id,
                title: soundscape.name,
                author: 'Paziify Ambientes',
                cover: { uri: soundscape.image },
                audio_url: soundscape.audioFile?.uri,
                duration: 0,
                isInfinite: true
            }, 0, true); // shouldPlay = true
        }
    }, [soundscape, currentTrack?.id, loadTrack]);

    // Handle Binaural Layer
    useEffect(() => {
        if (activeBinauralId) {
            const wave = BINAURAL_WAVES.find(w => w.id === activeBinauralId);
            if (wave?.audioFile?.uri) {
                loadBinauralLayer(wave.audioFile.uri);
            } else {
                loadBinauralLayer(null);
            }
        } else {
            loadBinauralLayer(null);
        }
    }, [activeBinauralId]);

    // Focus Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerSeconds !== null && timerSeconds > 0 && isPlaying) {
            interval = setInterval(() => {
                setTimerSeconds(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (timerSeconds === 0) {
            pause();
            setTimerSeconds(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Sesión Finalizada", "El tiempo de enfoque ha terminado.");
        }

        return () => clearInterval(interval);
    }, [timerSeconds, isPlaying]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!soundscape || loadingSoundscape) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <BackgroundWrapper nebulaMode="growth" />
                <ActivityIndicator size="large" color="#2DD4BF" />
                <Text style={{ color: '#FFF', marginTop: 20, opacity: 0.6 }}>Armonizando ambiente...</Text>
            </View>
        );
    }

    const togglePlay = () => {
        if (isPlaying) pause();
        else play();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSetTimer = (minutes: number) => {
        setTimerSeconds(minutes * 60);
        setIsTimerSelectorOpen(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Atmósfera Styles
    const getBgOverlayOpacity = () => {
        if (atmosphereMode === 'theta') return 0.7;
        if (atmosphereMode === 'delta') return 0.85;
        return 0.4;
    };

    const getAuraColor = () => {
        if (atmosphereMode === 'alpha') return 'rgba(0, 255, 255, 0.15)';
        if (atmosphereMode === 'theta') return 'rgba(128, 0, 128, 0.1)';
        if (atmosphereMode === 'delta') return 'rgba(0, 0, 128, 0.2)';
        return 'transparent';
    };

    if (loadingSoundscape || !soundscape) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <BackgroundWrapper nebulaMode="healing" />
                <ActivityIndicator size="large" color="#FFF" />
                {!soundscape && !loadingSoundscape && (
                    <Text style={{ color: '#FFF', marginTop: 10 }}>Error al cargar ambiente.</Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={[StyleSheet.absoluteFill, { backgroundColor: soundscape.color || '#000' }]} />

            {/* Optimized Background Image (expo-image for persistent cache) */}
            <Image
                source={{ uri: soundscape.image }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={1000}
                cachePolicy="memory-disk"
            />

            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: getAuraColor(), opacity: auraOpacity }
                ]}
            />

            <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${getBgOverlayOpacity()})` }]} />

            <ParticleSystem mode={atmosphereMode as any} />

            <View style={[styles.mainContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-down" size={32} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Ambiente Activo</Text>
                        {timerSeconds !== null && (
                            <Text style={styles.timerCountdown}>{formatTime(timerSeconds)}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.iconBtn, timerSeconds !== null && styles.iconBtnActive]}
                        onPress={() => setIsTimerSelectorOpen(!isTimerSelectorOpen)}
                    >
                        <Ionicons
                            name={timerSeconds !== null ? "timer" : "timer-outline"}
                            size={28}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Timer Selector */}
                {isTimerSelectorOpen && (
                    <View style={styles.timerSelectorContainer}>
                        <BlurView intensity={90} tint="dark" style={styles.timerSelector}>
                            <Text style={styles.selectorTitle}>Temporizador de Enfoque</Text>
                            <View style={styles.presetsGrid}>
                                {TIMER_PRESETS.map(mins => (
                                    <TouchableOpacity
                                        key={mins}
                                        style={styles.presetOption}
                                        onPress={() => handleSetTimer(mins)}
                                    >
                                        <Text style={styles.presetText}>{mins}m</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={[styles.presetOption, { backgroundColor: 'rgba(255, 0, 0, 0.2)' }]}
                                    onPress={() => {
                                        setTimerSeconds(null);
                                        setIsTimerSelectorOpen(false);
                                    }}
                                >
                                    <Text style={[styles.presetText, { color: '#FF6B6B' }]}>Off</Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </View>
                )}

                {/* Center Content */}
                <View style={styles.centerInfo}>
                    <Text style={styles.soundTitle}>{soundscape.name}</Text>
                    <Text style={styles.soundDesc}>{soundscape.description}</Text>

                    <TouchableOpacity
                        style={styles.playPauseButtonContainer}
                        onPress={togglePlay}
                        activeOpacity={0.8}
                    >
                        <BlurView intensity={50} tint="light" style={styles.playPauseBlur}>
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={44}
                                color="#FFF"
                                style={{ marginLeft: isPlaying ? 0 : 4 }}
                            />
                        </BlurView>
                    </TouchableOpacity>

                    {activeBinaural && (
                        <View style={styles.activeWaveIndicator}>
                            <Ionicons name="pulse" size={16} color={activeBinaural.color} />
                            <Text style={[styles.activeWaveText, { color: activeBinaural.color }]}>
                                {activeBinaural.name} Activo
                            </Text>
                        </View>
                    )}
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <TouchableOpacity
                        style={[styles.mixerBtn, isMixerOpen && styles.mixerBtnActive]}
                        onPress={() => {
                            setIsMixerOpen(!isMixerOpen);
                            setIsTimerSelectorOpen(false);
                        }}
                    >
                        <Ionicons name="options" size={24} color={isMixerOpen ? "#000" : "#FFF"} />
                        <Text style={[styles.mixerText, { color: isMixerOpen ? "#000" : "#FFF" }]}>
                            {isMixerOpen ? "Cerrar Mezclador" : "Mezclador Binaural"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isMixerOpen && (
                    <BlurView intensity={80} tint="dark" style={styles.mixerSheet}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mixerList}>
                            {BINAURAL_WAVES.map((wave) => {
                                const isActive = activeBinauralId === wave.id;
                                const isAvailable = !!wave.audioFile;

                                return (
                                    <TouchableOpacity
                                        key={wave.id}
                                        style={[
                                            styles.waveCard,
                                            isActive && { borderColor: wave.color, backgroundColor: 'rgba(255,255,255,0.1)' },
                                            !isAvailable && { opacity: 0.3 }
                                        ]}
                                        onPress={() => {
                                            if (isAvailable) {
                                                setActiveBinauralId(isActive ? null : wave.id);
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            }
                                        }}
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
        height: 80,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    timerCountdown: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 4,
        fontVariant: ['tabular-nums'],
    },
    iconBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: '#FFF',
    },
    centerInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    activeWaveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    activeWaveText: {
        fontSize: 12,
        fontWeight: '600',
    },
    soundTitle: {
        fontSize: 40,
        fontWeight: '800',
        fontFamily: 'Satisfy_400Regular', // PDS v3.0 Title Typography
        color: '#FFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    soundDesc: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 30,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 24,
    },
    playPauseButtonContainer: {
        elevation: 10,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        marginVertical: 20,
    },
    playPauseBlur: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    bottomControls: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        alignItems: 'center',
    },
    mixerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 35,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        gap: 12,
    },
    mixerBtnActive: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    mixerText: {
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    mixerSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
        paddingVertical: 30,
    },
    mixerList: {
        paddingHorizontal: 25,
        gap: 15,
        alignItems: 'center',
    },
    waveCard: {
        width: 110,
        height: 140,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    waveIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    waveName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    waveFreq: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '500',
    },
    timerSelectorContainer: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    timerSelector: {
        borderRadius: 25,
        padding: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    selectorTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    presetOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        minWidth: 60,
        alignItems: 'center',
    },
    presetText: {
        color: '#FFF',
        fontWeight: '600',
    }
});

export default BackgroundPlayerScreen;
