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
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Canvas, Circle, BlurMask } from "@shopify/react-native-skia";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

import { RootStackParamList, Screen } from '../../types';
import { SOUNDSCAPES, BINAURAL_WAVES, Soundscape, BinauralWave } from '../../data/soundscapesData';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { soundscapesService } from '../../services/contentService';
import { ActivityIndicator } from 'react-native';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import { theme } from '../../constants/theme';
import AudioEngineService from '../../services/AudioEngineService';

// --- Default States ---
const DEFAULT_BINAURAL_ID = BINAURAL_WAVES[0].id;

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
            {particles.map((p: any, i: number) => (
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

// --- Internal Components (Unified with Meditation Design) ---

const SelectionModal = ({ visible, onClose, title, data, onSelect, currentId }: any) => {
    if (!visible) return null;

    return (
        <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 40 }}>
                    {data.map((item: any) => {
                        const isSelected = item.id === currentId;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <View style={[styles.optionIcon, { backgroundColor: item.color }]}>
                                    <Ionicons name={item.icon || 'pulse'} size={20} color="#FFF" />
                                </View>
                                <View style={styles.optionInfo}>
                                    <Text style={styles.optionName}>{item.name}</Text>
                                    <Text style={styles.optionDesc} numberOfLines={1}>{item.description || item.frequency}</Text>
                                </View>
                                {isSelected && <Ionicons name="checkmark-circle" size={24} color="#2DD4BF" />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const SoundSelectorControl = ({ label, icon, value, isLocked, onValueChange, onPressSelector, color, isEnabled = true, onToggle }: any) => {
    const handlePanGesture = (event: any) => {
        if (isLocked) return;
        const { locationX } = event.nativeEvent;
        const sliderWidth = width - 104; // Adjust based on padding
        const newValue = Math.max(0, Math.min(1, locationX / sliderWidth));
        onValueChange(newValue);
    };

    return (
        <View style={styles.controlContainer}>
            <TouchableOpacity
                style={styles.selectorRow}
                onPress={onPressSelector}
                activeOpacity={0.7}
                disabled={isLocked || !onPressSelector}
            >
                <View style={styles.selectorLeft}>
                    <Ionicons name={icon} size={20} color={!isEnabled || isLocked ? 'rgba(255,255,255,0.2)' : color} />
                    <Text style={[styles.selectorLabel, (!isEnabled || isLocked) && { color: 'rgba(255,255,255,0.3)' }]}>{label}</Text>
                </View>
                <View style={styles.selectorRight}>
                    {onToggle && (
                        <TouchableOpacity
                            onPress={onToggle}
                            style={[
                                styles.toggleBtn,
                                isEnabled ? { backgroundColor: color } : styles.toggleBtnOff
                            ]}
                        >
                            <View style={[styles.toggleCircle, isEnabled ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                        </TouchableOpacity>
                    )}
                    {!isLocked && onPressSelector && <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />}
                    {isLocked && <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.2)" />}
                </View>
            </TouchableOpacity>

            <View style={[styles.volumeWrapper, !isEnabled && { opacity: 0.3 }]}>
                <Ionicons name="volume-low" size={12} color="rgba(255,255,255,0.2)" />
                <TouchableOpacity
                    style={styles.sliderTrack}
                    activeOpacity={1}
                    onPressIn={handlePanGesture}
                    onPress={handlePanGesture}
                >
                    <View style={styles.trackBase}>
                        <View style={[styles.trackFill, { width: `${value * 100}%`, backgroundColor: !isEnabled || isLocked ? 'rgba(255,255,255,0.1)' : color }]} />
                    </View>
                </TouchableOpacity>
                <Ionicons name="volume-high" size={12} color="rgba(255,255,255,0.2)" />
            </View>
        </View>
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
        loadBinauralLayer,
        currentTrack,
        position,
        duration,
        seekTo,
        skipBackward,
        skipForward,
        sound,
        setBinauralVolume
    } = useAudioPlayer();

    const [activeBinauralId, setActiveBinauralId] = useState<string | null>(null);
    const [isMixerOpen, setIsMixerOpen] = useState(false);
    const [soundscape, setSoundscape] = useState<any | null>(null);
    const [loadingSoundscape, setLoadingSoundscape] = useState(true);

    // Mixer Layers State (Unified)
    const [volumes, setVolumes] = useState({
        soundscape: 0.7,
        binaural: 0.4,
    });
    const [enabledLayers, setEnabledLayers] = useState({
        soundscape: true,
        binaural: false,
    });

    const [showBinauralModal, setShowBinauralModal] = useState(false);

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
            }, 0, false); // shouldPlay = false
        }
    }, [soundscape, currentTrack?.id, loadTrack]);

    // Handle Mixer Volume & Toggles in real-time
    const handleVolumeChange = async (layer: 'soundscape' | 'binaural', val: number) => {
        setVolumes((prev: any) => ({ ...prev, [layer]: val }));
        if (layer === 'soundscape') {
            if (sound) await sound.setVolumeAsync(val);
        } else {
            // Binaural layer is managed by context via setBinauralVolume
            if (activeBinauralId) {
                await setBinauralVolume(val);
            }
        }
        Haptics.selectionAsync();
    };

    const toggleLayer = async (layer: 'soundscape' | 'binaural') => {
        const newState = !enabledLayers[layer as keyof typeof enabledLayers];
        setEnabledLayers((prev: any) => ({ ...prev, [layer]: newState }));

        // El useEffect se encargará de load/unload según el estado reactivo
        if (layer === 'soundscape') {
            if (sound) await sound.setVolumeAsync(newState ? volumes.soundscape : 0);
        } else if (layer === 'binaural' && newState && !activeBinauralId) {
            setActiveBinauralId(DEFAULT_BINAURAL_ID);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleBinauralSelect = async (wave: BinauralWave) => {
        setActiveBinauralId(wave.id);
        if (enabledLayers.binaural) {
            await loadBinauralLayer(wave.audioFile.uri!);
            await setBinauralVolume(volumes.binaural);
        }
    };

    // Handle Binaural Layer (Single Source of Truth)
    useEffect(() => {
        const syncLayer = async () => {
            if (enabledLayers.binaural && activeBinauralId) {
                const wave = BINAURAL_WAVES.find(w => w.id === activeBinauralId);
                if (wave?.audioFile?.uri) {
                    console.log('Syncing Binaural:', wave.name);
                    await loadBinauralLayer(wave.audioFile.uri);
                    await setBinauralVolume(volumes.binaural);
                }
            } else if (!enabledLayers.binaural) {
                // Si la capa está desactivada, forzamos descarga absoluta
                await loadBinauralLayer(null);
            }
        };
        syncLayer();
    }, [activeBinauralId, enabledLayers.binaural]);

    // Focus Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerSeconds !== null && timerSeconds > 0 && isPlaying) {
            interval = setInterval(() => {
                setTimerSeconds((prev: number | null) => (prev !== null ? prev - 1 : null));
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


    const isCurrentTrackActive = currentTrack?.id === soundscape?.id;
    const displayPosition = isCurrentTrackActive ? position : 0;
    const displayDuration = isCurrentTrackActive ? duration : 1;
    const displayProgress = displayDuration > 0 ? displayPosition / displayDuration : 0;

    const handleSeek = (val: number) => {
        const targetMillis = val * displayDuration;
        if (isCurrentTrackActive) {
            seekTo(targetMillis);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    blurRadius={20}
                />

                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: getAuraColor(), opacity: auraOpacity }
                    ]}
                />

                <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(0,0,0,${getBgOverlayOpacity()})` }]} />

                <ParticleSystem mode={atmosphereMode as any} />

                <View style={[styles.mainContent, { paddingTop: insets.top }]}>

                    {/* Header (Mismo estilo que Audiobook) */}
                    <View style={[styles.header, { paddingTop: insets.top }]}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="chevron-back" size={32} color="#FFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitleBase}>Sonido de Fondo</Text>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setIsTimerSelectorOpen(!isTimerSelectorOpen)}
                        >
                            <Ionicons
                                name={timerSeconds !== null ? "timer" : "timer-outline"}
                                size={28}
                                color={timerSeconds !== null ? theme.colors.primary : "#FFF"}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Cover Art Centenario como en Audiobook */}
                    <View style={[styles.coverContainer, { marginTop: height * 0.05 }]}>
                        <Image
                            source={{ uri: soundscape.image }}
                            style={styles.coverImage}
                            contentFit="cover"
                        />
                        {timerSeconds !== null && (
                            <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                                <Text style={styles.timerCountdown}>{formatTime(timerSeconds)}</Text>
                            </View>
                        )}
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

                    {/* Info Text */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.title} numberOfLines={2}>{soundscape.name}</Text>
                        <Text style={styles.author}>{soundscape.description}</Text>

                        {activeBinaural && (
                            <View style={styles.narratorBadge}>
                                <Ionicons name="pulse" size={12} color={activeBinaural.color} />
                                <Text style={[styles.narrator, { color: activeBinaural.color }]}>
                                    {activeBinaural.name}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Progress Slider */}
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            value={displayProgress}
                            onSlidingComplete={handleSeek}
                            minimumTrackTintColor={theme.colors.primary}
                            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                            thumbTintColor={theme.colors.primary}
                            disabled={!isCurrentTrackActive}
                        />
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
                            <Text style={styles.timeText}>{formatTime(displayDuration)}</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity onPress={() => skipBackward()} style={styles.controlButton}>
                            <BlurView intensity={30} tint="light" style={styles.smallControlBlur}>
                                <Ionicons name="play-back" size={24} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={togglePlay} style={styles.playPauseButtonContainer} activeOpacity={0.8}>
                            <BlurView intensity={50} tint="light" style={styles.playPauseBlur}>
                                <Ionicons
                                    name={isPlaying && isCurrentTrackActive ? "pause" : "play"}
                                    size={44}
                                    color="#FFF"
                                    style={!isPlaying ? { marginLeft: 4 } : {}}
                                />
                            </BlurView>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => skipForward()} style={styles.controlButton}>
                            <BlurView intensity={30} tint="light" style={styles.smallControlBlur}>
                                <Ionicons name="play-forward" size={24} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>
                    </View>

                    {/* Audio Controls Panel */}
                    <PanGestureHandler
                        onGestureEvent={(event) => {
                            const { translationY } = event.nativeEvent;
                            if (Math.abs(translationY) > 50) {
                                if (translationY > 0 && isMixerOpen) {
                                    setIsMixerOpen(false);
                                } else if (translationY < 0 && !isMixerOpen) {
                                    setIsMixerOpen(true);
                                }
                            }
                        }}
                    >
                        <View style={[styles.controlsPanel, { paddingBottom: insets.bottom + 24 }]}>
                            <TouchableOpacity
                                onPress={() => setIsMixerOpen(!isMixerOpen)}
                                style={styles.handleContainer}
                                activeOpacity={0.7}
                            >
                                <View style={styles.handle} />
                                <Text style={styles.handleLabel}>
                                    {isMixerOpen ? 'OCULTAR CONFIGURACIÓN' : 'CONFIGURACIÓN'}
                                </Text>
                            </TouchableOpacity>

                            {isMixerOpen && (
                                <>
                                    <SoundSelectorControl
                                        label="Ambiente Principal"
                                        icon={soundscape.icon || "leaf"}
                                        value={volumes.soundscape}
                                        color={soundscape.color || "#4A90E2"}
                                        isEnabled={enabledLayers.soundscape}
                                        onToggle={() => toggleLayer('soundscape')}
                                        onValueChange={(val: number) => handleVolumeChange('soundscape', val)}
                                    />

                                    <View style={styles.divider} />

                                    <SoundSelectorControl
                                        label={activeBinaural?.name || "Binaural (Desactivado)"}
                                        icon="pulse"
                                        value={volumes.binaural}
                                        color={activeBinaural?.color || "#2DD4BF"}
                                        onPressSelector={() => setShowBinauralModal(true)}
                                        isEnabled={enabledLayers.binaural}
                                        onToggle={() => toggleLayer('binaural')}
                                        onValueChange={(val: number) => handleVolumeChange('binaural', val)}
                                    />

                                    <View style={{ height: 20 }} />
                                </>
                            )}
                        </View>
                    </PanGestureHandler>

                </View>

                {/* Custom Modals (Moved Outside mainContent, following Meditation Pattern) */}
                <SelectionModal
                    visible={showBinauralModal}
                    onClose={() => setShowBinauralModal(false)}
                    title="Ondas Binaurales"
                    data={BINAURAL_WAVES}
                    currentId={activeBinauralId}
                    onSelect={handleBinauralSelect}
                />
            </View>
        </GestureHandlerRootView>
    );
};

// Nuevos Estilos Unificados
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#070A15',
    },
    mainContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        zIndex: 10,
    },
    headerTitleBase: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerCountdown: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    // Layout Audiobook
    coverContainer: {
        flex: 1,
        maxHeight: width - 40,
        width: width - 40,
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginVertical: 20,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        paddingHorizontal: 40,
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    author: {
        fontFamily: 'Caveat_400Regular', // Caveat font applied
        color: theme.colors.primary,
        fontSize: 24,
        marginBottom: 10,
    },
    narratorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    narrator: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sliderContainer: {
        paddingHorizontal: 30,
        marginBottom: height * 0.12, // Elevado para no solapar con el mezclador
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    timeText: {
        color: '#FFF',
        fontSize: 12,
        opacity: 0.6,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: height * 0.30, // Elevado significativamente para máxima holgura
    },
    controlButton: {
        padding: 10,
    },
    smallControlBlur: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    playPauseButtonContainer: {
        marginHorizontal: 30,
        elevation: 10,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    playPauseBlur: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },

    // Unified Mixer Panel Styles
    controlsPanel: {
        backgroundColor: 'rgba(17,20,32,0.92)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    handleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 8,
    },
    handleLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 16,
    },
    controlContainer: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
    },
    selectorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    selectorLabel: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    selectorRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    toggleBtn: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
        justifyContent: 'center',
    },
    toggleBtnOff: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
    },
    volumeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sliderTrack: {
        flex: 1,
        height: 20,
        justifyContent: 'center',
    },
    trackBase: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
    },
    trackFill: {
        height: '100%',
        borderRadius: 2,
    },

    // Selection Modal Styles
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2000,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    modalContent: {
        backgroundColor: '#111420',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: height * 0.7,
        width: '100%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 4,
    },
    modalScroll: {
        flex: 1,
        padding: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    optionCardSelected: {
        borderColor: '#2DD4BF',
        backgroundColor: 'rgba(45,212,191,0.05)',
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionInfo: {
        flex: 1,
    },
    optionName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
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
