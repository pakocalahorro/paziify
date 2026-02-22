import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Dimensions,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
    Animated,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { IMAGES } from '../../constants/images';
import { useApp } from '../../context/AppContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import AudioEngineService from '../../services/AudioEngineService';
import { sessionsService, adaptSession, soundscapesService } from '../../services/contentService'; // Import services
// import { MEDITATION_SESSIONS } from '../../data/sessionsData'; // Remove static usage
import { SOUNDSCAPES, BINAURAL_WAVES, Soundscape, BinauralWave } from '../../data/soundscapesData';
import ThemedBreathingOrb from '../../components/Meditation/ThemedBreathingOrb';
import { VISUAL_THEMES, DEFAULT_THEME, type ThemeId } from '../../constants/visualThemes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Default Coherence Breathing pattern for guided meditations without visual sync
const ATMOSPHERIC_PATTERN = {
    inhale: 6,
    hold: 0,
    exhale: 6,
    holdPost: 0
};

// Technical sessions use a voice track with fixed timestamps.
// We use a global offset to compensate for UI processing delay.
const SYNC_OFFSET = 0.35; // Anticipate by 350ms so title appears before voice

// The recorded voice tracks add speech duration (approx 0.72s per word) to the cycle.
const SPEECH_PER_WORD = 0.72;


type BreathingTimerScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.BREATHING_TIMER
>;

type BreathingTimerScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.BREATHING_TIMER
>;

interface Props {
    navigation: BreathingTimerScreenNavigationProp;
    route: BreathingTimerScreenRouteProp;
}

// --- Internal Components ---

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
                                    <Ionicons name={item.icon} size={20} color="#FFF" />
                                </View>
                                <View style={styles.optionInfo}>
                                    <Text style={styles.optionName}>{item.name}</Text>
                                    <Text style={styles.optionDesc} numberOfLines={1}>{item.description}</Text>
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
        const sliderWidth = width - 100;
        const newValue = Math.max(0, Math.min(1, locationX / sliderWidth));
        onValueChange(newValue);
    };

    return (
        <View style={styles.controlContainer}>
            <TouchableOpacity
                style={styles.selectorRow}
                onPress={onPressSelector}
                activeOpacity={0.7}
                disabled={isLocked}
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
                    {!isLocked && !onToggle && <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />}
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

// --- Screen Component ---

const BreathingTimer: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const { setExternalAudioActive } = useAudioPlayer(); // Context hook
    // Unified Session State Machine
    type SessionStatus = 'IDLE' | 'INTRO' | 'COUNTDOWN' | 'ACTIVE' | 'PAUSED' | 'ENDING' | 'COMPLETED';
    const [sessionState, setSessionState] = useState<SessionStatus>('IDLE');

    const [timeLeft, setTimeLeft] = useState(0);
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [currentSession, setCurrentSession] = useState<any>(null);
    const sessionRef = useRef<any>(null);
    const [enabledLayers, setEnabledLayers] = useState({
        voice: true,
        soundscape: true,
        binaural: true,
        customTheme: false,
    });


    const totalDuration = useRef<number>(0);

    // Interaction State
    const [countdownValue, setCountdownValue] = useState(3);

    // Aura/Heartbeat Animation
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    // Breathing Phase State
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdPost'>('inhale');
    const [phaseProgress, setPhaseProgress] = useState(0);

    // Unlocked premium for testing
    const isPremium = true;

    // Manage External Audio State (e.g. pause ambient music)
    useEffect(() => {
        setExternalAudioActive(true);
        return () => {
            setExternalAudioActive(false);
        };
    }, []);

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        if (sessionState === 'IDLE' || sessionState === 'PAUSED') {
            pulse.start();
        } else {
            pulse.stop();
            pulseAnim.setValue(1);
        }

        return () => pulse.stop();
    }, [sessionState]);

    const [volumes, setVolumes] = useState({
        voice: 0.35,
        soundscape: 0.7,
        binaural: 0.4,
        elements: 0.5,
    });

    const [selectedSoundscape, setSelectedSoundscape] = useState<Soundscape | null>(null);
    const [selectedBinaural, setSelectedBinaural] = useState<BinauralWave | null>(null);

    const [availableSoundscapes, setAvailableSoundscapes] = useState<Soundscape[]>(SOUNDSCAPES);
    const [showSoundscapeModal, setShowSoundscapeModal] = useState(false);
    const [showBinauralModal, setShowBinauralModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>(DEFAULT_THEME);
    const [isImmersiveMode, setIsImmersiveMode] = useState(false);
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);


    // Fetch all available soundscapes for the modal (Dynamic CMS)
    useEffect(() => {
        const fetchSoundscapes = async () => {
            try {
                const data = await soundscapesService.getAll();
                if (data && data.length > 0) {
                    setAvailableSoundscapes(data);
                }
            } catch (err) {
                console.error('[BREATHING_TIMER] Error fetching soundscapes for modal:', err);
            }
        };
        fetchSoundscapes();
    }, []);


    useEffect(() => {
        const initSession = async () => {
            try {
                const sessionId = (route.params as any)?.sessionId || 'anx_478';
                const passedData = (route.params as any)?.sessionData;

                console.log(`[BREATHING_TIMER] initSession ID: ${sessionId}`);

                // Fetch dynamic session
                let session;

                if (passedData) {
                    console.log('[BREATHING_TIMER] Data Source: Navigation (Zero Egress Pattern)');
                    session = adaptSession(passedData);
                } else {
                    console.log('[BREATHING_TIMER] Data Source: DB Service (Attempting fetch)');
                    const dbSession = await sessionsService.getById(sessionId);
                    if (dbSession) {
                        session = adaptSession(dbSession);
                    } else {
                        console.log('[BREATHING_TIMER] Data Source: Legacy Fallback');
                        // Fallback to legacy look up if not found in DB
                        const { MEDITATION_SESSIONS } = require('../../data/sessionsData');
                        session = MEDITATION_SESSIONS.find((s: any) => s.id === sessionId);
                    }
                }

                if (session) {
                    setCurrentSession(session);
                    sessionRef.current = session;

                    // CRITICAL: Initialize Master Timer (Restored after regression)
                    const durationInSeconds = session.durationMinutes * 60;
                    totalDuration.current = durationInSeconds;
                    setTimeLeft(durationInSeconds);
                    console.log(`[BREATHING_TIMER] Timer initialized to ${durationInSeconds}s`);

                    const messages: Record<string, string> = {
                        inhale: 'Inhala',
                        hold: 'Mantén',
                        exhale: 'Exhala'
                    };

                    // Auto-select based on session defaults (Dynamic resolution for CMS)
                    const ssId = session.audioLayers.defaultSoundscape;
                    const bwId = session.audioLayers.defaultBinaural;

                    // Support for "None" option: only fetch if ID is truthy
                    const ss = ssId ? (await soundscapesService.getById(ssId) || SOUNDSCAPES[0]) : null;
                    const bw = bwId ? (BINAURAL_WAVES.find(b => b.id === bwId) || BINAURAL_WAVES[0]) : null;

                    setSelectedSoundscape(ss);
                    setSelectedBinaural(bw);

                    // Auto-select Visual Theme based on category (UX Restoration)
                    const cat = (session.category || 'calmasos').toLowerCase();
                    if (cat === 'ansiedad' || cat === 'calma sos') {
                        setSelectedTheme('cosmos');
                    } else if (cat === 'sueño') {
                        setSelectedTheme('cave');
                    } else if (cat === 'despertar' || cat === 'habitos') {
                        setSelectedTheme('forest');
                    } else if (cat === 'mindfulness' || cat === 'rendimiento') {
                        setSelectedTheme('temple');
                    } else {
                        setSelectedTheme('cosmos');
                    }

                    // Set initial volumes and layers based on session type
                    const isGuided = !session.visualSync;
                    const initialVolumes = {
                        voice: 0.5,
                        soundscape: isGuided ? 0.25 : 0.6,
                        binaural: 0.3,
                        elements: 0.5,
                    };

                    setVolumes(initialVolumes);
                    setEnabledLayers({
                        voice: true,
                        soundscape: !!ssId, // "OFF" if none selected
                        binaural: !!bwId && !isGuided, // "OFF" if none or guided
                        customTheme: false
                    });

                    // Load audio layers
                    console.log('[BREATHING_TIMER] Starting Audio Engine Load...');
                    await AudioEngineService.loadSession({
                        voiceTrack: session.audioLayers?.voiceTrack,
                        soundscape: ss?.id,
                        binaural: bw?.id,
                        elements: session.audioLayers?.defaultElements,
                    });
                    console.log('[BREATHING_TIMER] Audio Engine Load COMPLETED');

                    // Preload voice cues if needed
                    if (!isGuided && !session.audioLayers.voiceTrack) {
                        await AudioEngineService.preloadCues(messages);
                    }

                    // Apply initial volumes to engine
                    await AudioEngineService.setLayerVolume('voice', initialVolumes.voice);
                    await AudioEngineService.setLayerVolume('soundscape', initialVolumes.soundscape);
                    await AudioEngineService.setLayerVolume('binaural', isGuided ? 0 : initialVolumes.binaural);
                    await AudioEngineService.setLayerVolume('elements', initialVolumes.elements);

                    setIsAudioLoaded(true);
                } else {
                    throw new Error('Session not found or offline');
                }
            } catch (error) {
                console.log('Error initializing session (expected if offline):', error);
                Alert.alert(
                    'Error de Conexión',
                    'No se ha podido cargar el audio. Por favor, verifica tu conexión a internet para continuar.',
                    [{ text: 'Entendido', onPress: () => navigation.goBack() }]
                );
            }
        };
        initSession();


        return () => {
            AudioEngineService.unloadAll();
        };
    }, [route.params]);

    // --- MASTER CLOCK SYNCHRONIZATION ---
    useEffect(() => {
        AudioEngineService.setStatusCallback((status) => {
            if (status.isLoaded && status.isPlaying && sessionState === 'ACTIVE') {
                let elapsed = status.positionMillis / 1000;

                // 1. Apply micro-adjustment if present (Calibration for the 18 core sessions)
                if (currentSession?.visualSync && currentSession?.audioAdjustmentFactor) {
                    elapsed = elapsed / currentSession.audioAdjustmentFactor;
                }

                // 2. Update Time Left (Master Clock - from raw position for accuracy)
                const rawElapsed = status.positionMillis / 1000;
                const newTimeLeft = Math.max(0, totalDuration.current - rawElapsed);
                setTimeLeft(newTimeLeft);

                if (status.didJustFinish || newTimeLeft <= 0) {
                    setSessionState('ENDING');
                    return;
                }

                // 3. Update Breathing Phase & Progress (Adjusted for visual sync mode)
                if (sessionRef.current) {
                    const isSynced = sessionRef.current.visualSync;
                    const pattern = isSynced ? sessionRef.current.breathingPattern : ATMOSPHERIC_PATTERN;

                    // The audio files are ADDITIVE: Speech length adds to the total cycle.
                    // Each vocalized phase lasts [pattern_duration + speech_duration]
                    const speechDelay = isSynced ? SPEECH_PER_WORD : 0;

                    const inhaleLimit = pattern.inhale + (pattern.inhale > 0 ? speechDelay : 0);
                    const holdLimit = inhaleLimit + pattern.hold + (pattern.hold > 0 ? speechDelay : 0);
                    const exhaleLimit = holdLimit + pattern.exhale + (pattern.exhale > 0 ? speechDelay : 0);
                    // holdPost doesn't have a vocal cue in our current scripts
                    const holdPostLimit = exhaleLimit + pattern.holdPost;

                    const totalTrackCycle = holdPostLimit;
                    const adjustedElapsed = (elapsed + SYNC_OFFSET) % totalTrackCycle;

                    if (adjustedElapsed < inhaleLimit) {
                        setPhase('inhale');
                        const phaseTime = pattern.inhale > 0 ? pattern.inhale : 1;
                        setPhaseProgress(Math.min(1, adjustedElapsed / phaseTime));
                    } else if (adjustedElapsed < holdLimit) {
                        setPhase('hold');
                        setPhaseProgress(1);
                    } else if (adjustedElapsed < exhaleLimit) {
                        setPhase('exhale');
                        const timeInPhase = adjustedElapsed - holdLimit;
                        const phaseTime = pattern.exhale > 0 ? pattern.exhale : 1;
                        setPhaseProgress(Math.max(0, 1 - (timeInPhase / phaseTime)));
                    } else {
                        // Merging HoldPost with Exhale visual state as requested
                        setPhase('holdPost');
                        setPhaseProgress(0);
                    }
                }
            }
        });

        return () => {
            AudioEngineService.setStatusCallback(null);
        };
    }, [sessionState, currentSession]);

    // ZEN AUTO-START LOGIC
    useEffect(() => {
        if (isAudioLoaded && sessionState === 'IDLE') {
            setSessionState('COUNTDOWN');
            setCountdownValue(3);
        }
    }, [isAudioLoaded, sessionState]);

    useEffect(() => {
        let timer: any;
        if (sessionState === 'COUNTDOWN' && countdownValue > 0) {
            timer = setInterval(() => {
                setCountdownValue(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        startSession();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [sessionState]);

    const startSession = async () => {
        if (sessionState === 'ACTIVE' || sessionState === 'ENDING') return;

        try {
            setSessionState('ACTIVE');
            totalDuration.current = sessionRef.current?.durationMinutes * 60 || 600;
            setTimeLeft(totalDuration.current);

            // Play all enabled layers simultaneously
            const layersToPlay: any[] = ['voice', 'soundscape', 'elements'];
            if (enabledLayers.binaural) layersToPlay.push('binaural');

            await AudioEngineService.playSelectedLayers(layersToPlay);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Error starting session:', error);
        }
    };

    // Unified Guiding Logic (Smart Guiding)
    const cycleRef = React.useRef(0);
    const lastPlayedPhase = React.useRef<string | null>(null);

    useEffect(() => {
        if (sessionState === 'ACTIVE' && currentSession) {
            // Only perform voice cues and haptic breath guidance if visualSync is enabled
            // For guided meditations, the voice track handles the pacing
            if (!currentSession.visualSync) return;

            const pattern = currentSession.breathingPattern;
            const totalCycleTime = pattern.inhale + pattern.hold + pattern.exhale + pattern.holdPost;

            // ... (rest of smart guiding logic)
            let guideFrequency = 1;
            let showAllPhases = true;

            if (totalCycleTime < 4.0) {
                guideFrequency = 8;
                showAllPhases = false;
            } else if (totalCycleTime < 6.0) {
                guideFrequency = 4;
                showAllPhases = false;
            }

            const isLeadCycle = (cycleRef.current % guideFrequency) === 0;

            if (phase !== lastPlayedPhase.current) {
                // Determine if we should speak in this phase
                let shouldSpeak = false;
                if (isLeadCycle) {
                    if (showAllPhases) shouldSpeak = true;
                    else if (phase === 'inhale' || (phase === 'exhale' && totalCycleTime >= 4.0)) {
                        shouldSpeak = true;
                    }
                }

                if (shouldSpeak && phase !== 'holdPost') {
                    const messages: Record<string, string> = {
                        inhale: 'Inhala',
                        hold: 'Mantén',
                        exhale: 'Exhala'
                    };

                    // Only use dynamic voice cues if there's no pre-recorded track
                    if (!currentSession.audioLayers.voiceTrack) {
                        AudioEngineService.playVoiceCue(phase, currentSession.voiceStyle, messages[phase]);
                    }
                }

                // Haptic Feedback for physical guidance
                try {
                    switch (phase) {
                        case 'inhale':
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            break;
                        case 'hold':
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            break;
                        case 'exhale':
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            break;
                        case 'holdPost':
                            Haptics.selectionAsync();
                            break;
                    }
                } catch (e) { }

                if (phase === 'inhale' && lastPlayedPhase.current !== 'inhale') {
                    cycleRef.current += 1;
                }
                lastPlayedPhase.current = phase;
            }
        } else {
            cycleRef.current = 0;
            lastPlayedPhase.current = null;
        }
    }, [phase, sessionState, currentSession]);


    const toggleTimer = async () => {
        if (!isAudioLoaded || sessionState === 'ENDING') return;

        try {
            if (sessionState === 'IDLE' || sessionState === 'COUNTDOWN') {
                // Manual override or auto-trigger
                await startSession();
            } else if (sessionState === 'ACTIVE') {
                setSessionState('PAUSED');
                await AudioEngineService.pauseAll();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else if (sessionState === 'PAUSED') {
                await AudioEngineService.playAll();
                setSessionState('ACTIVE');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch (error) {
            console.error('Error toggling session:', error);
        }
    };


    const handleRestart = async () => {
        setSessionState('IDLE');
        setTimeLeft(sessionRef.current?.durationMinutes * 60 || 600);
        setPhase('inhale');
        setPhaseProgress(0);

        try {
            await AudioEngineService.pauseAll();
        } catch (error) {
            console.error('Error restarting:', error);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        pulseAnim.setValue(1);
    };


    useEffect(() => {
        if (sessionState === 'ENDING') {
            AudioEngineService.pauseAll();
            setCountdownValue(3);
            setTimeout(() => {
                setSessionState('COMPLETED');
                navigation.navigate(Screen.SESSION_END, {
                    sessionId: sessionRef.current?.id || 'unknown',
                    durationMinutes: sessionRef.current?.durationMinutes || 1
                });
            }, 2000);
        }
    }, [sessionState]);

    const handleVolumeChange = async (layer: 'soundscape' | 'binaural' | 'elements' | 'voice', value: number) => {
        setVolumes(prev => ({ ...prev, [layer]: value }));
        await AudioEngineService.setLayerVolume(layer, value);
    };

    const handleSoundscapeChange = async (item: Soundscape) => {
        setSelectedSoundscape(item);
        await AudioEngineService.swapSoundscape(item.id, sessionState === 'ACTIVE');
    };

    const handleBinauralChange = async (item: BinauralWave) => {
        setSelectedBinaural(item);
        await AudioEngineService.swapBinaural(item.id, sessionState === 'ACTIVE');
    };

    const formatTime = (seconds: number) => {
        const totalSecs = Math.floor(Math.max(0, seconds));
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleLayer = async (layer: 'voice' | 'soundscape' | 'binaural' | 'customTheme') => {
        const newState = !enabledLayers[layer];
        setEnabledLayers(prev => ({ ...prev, [layer]: newState }));

        if (layer !== 'customTheme') {
            await AudioEngineService.setLayerVolume(layer, newState ? volumes[layer] : 0);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={true} />
                <ImageBackground
                    source={(enabledLayers.customTheme || !currentSession?.thumbnailUrl) ? VISUAL_THEMES[selectedTheme].background : { uri: currentSession.thumbnailUrl }}
                    style={styles.background}
                    imageStyle={{ opacity: isImmersiveMode ? 1.0 : 0.6 }}
                    resizeMode="cover"
                    resizeMethod="resize"
                >
                    <LinearGradient
                        colors={isImmersiveMode ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)'] : VISUAL_THEMES[selectedTheme].gradient as any}
                        style={styles.gradient}
                    >
                        <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>

                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                                </TouchableOpacity>
                                <View style={styles.headerInfo}>
                                    <Text style={styles.sessionStatus}>{sessionState === 'ACTIVE' ? 'REPRODUCIENDO' : 'PAUSADO'}</Text>
                                    <Text style={styles.sessionTitle}>Respiración Consciente</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setIsImmersiveMode(!isImmersiveMode)}
                                >
                                    <Ionicons
                                        name={isImmersiveMode ? "moon" : "sunny"}
                                        size={24}
                                        color={isImmersiveMode ? "#FCD34D" : "#FFF"}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Visual Timer */}
                            <View style={styles.mainContent}>

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.orbContainer}
                                    onPress={toggleTimer}
                                >

                                    <ThemedBreathingOrb
                                        size={width * 0.8}
                                        phase={phase === 'holdPost' ? 'hold' : phase}
                                        theme={selectedTheme}
                                        customColor={enabledLayers.customTheme ? VISUAL_THEMES[selectedTheme].orbGlow : currentSession?.color}
                                        active={sessionState === 'ACTIVE'}
                                    />
                                    <View style={styles.orbContentOverlay}>
                                        <View style={styles.orbInner}>
                                            {(sessionState === 'COUNTDOWN' || sessionState === 'ENDING') ? (
                                                <View style={styles.countdownBox}>
                                                    <Text style={styles.countdownNumber}>{countdownValue}</Text>
                                                    <Text style={styles.countdownSub}>
                                                        {sessionState === 'COUNTDOWN' ? 'EMPIEZA' : 'COMPLETADA'}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <>
                                                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

                                                    {/* Pause Controls Overlay */}
                                                    {sessionState === 'PAUSED' && timeLeft < (currentSession?.durationMinutes * 60) && (
                                                        <View style={styles.pauseOverlay}>
                                                            <TouchableOpacity
                                                                style={styles.pauseBtnMain}
                                                                onPress={toggleTimer}
                                                            >
                                                                <Ionicons name="play" size={40} color="#FFF" />
                                                                <Text style={styles.pauseBtnText}>CONTINUAR</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={styles.pauseBtnSub}
                                                                onPress={handleRestart}
                                                            >
                                                                <Ionicons name="refresh" size={20} color="rgba(255,255,255,0.6)" />
                                                                <Text style={styles.pauseBtnSubText}>REINICIAR</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}

                                                    {sessionState === 'ACTIVE' && currentSession?.visualSync && (
                                                        <Text style={styles.phaseLabel}>
                                                            {phase === 'inhale' ? 'Inhala' :
                                                                phase === 'hold' ? 'Mantén' : 'Exhala'}
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.instructionText}>
                                    {sessionState === 'ACTIVE' ? (
                                        currentSession?.visualSync ? (
                                            phase === 'inhale' ? 'Inhala por la nariz...' :
                                                phase === 'hold' ? 'Mantén el aire...' : 'Exhala suavemente...'
                                        ) : 'Déjate guiar por la voz...'
                                    ) : (
                                        sessionState === 'COUNTDOWN' ? 'Prepárate...' :
                                            (!isAudioLoaded ? 'Preparando tu espacio...' :
                                                (timeLeft < (currentSession?.durationMinutes * 60) && sessionState === 'PAUSED' ? 'Sesión pausada' : 'Pulsa el círculo para iniciar'))
                                    )}
                                </Text>
                            </View>

                            {/* Audio Controls Panel */}
                            <PanGestureHandler
                                onGestureEvent={(event) => {
                                    const { translationY } = event.nativeEvent;
                                    // Swipe down to collapse (translationY > 0)
                                    // Swipe up to expand (translationY < 0)
                                    if (Math.abs(translationY) > 50) {
                                        if (translationY > 0 && isPanelExpanded) {
                                            setIsPanelExpanded(false);
                                        } else if (translationY < 0 && !isPanelExpanded) {
                                            setIsPanelExpanded(true);
                                        }
                                    }
                                }}
                            >
                                <View style={[styles.controlsPanel, { paddingBottom: insets.bottom + 24 }]}>
                                    <TouchableOpacity
                                        onPress={() => setIsPanelExpanded(!isPanelExpanded)}
                                        style={styles.handleContainer}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.handle} />
                                        <Text style={styles.handleLabel}>
                                            {isPanelExpanded ? 'OCULTAR CONFIGURACIÓN' : 'CONFIGURACIÓN'}
                                        </Text>
                                    </TouchableOpacity>

                                    {isPanelExpanded && (
                                        <>
                                            {/* Visual Theme Selector */}
                                            <View style={styles.themesSection}>
                                                <View style={styles.sectionHeaderRow}>
                                                    <Text style={styles.sectionLabel}>AMBIENTE VISUAL</Text>
                                                    <TouchableOpacity
                                                        onPress={() => toggleLayer('customTheme')}
                                                        style={[styles.toggleBtnSmall, enabledLayers.customTheme ? { backgroundColor: VISUAL_THEMES[selectedTheme].orbGlow } : styles.toggleBtnOff]}
                                                    >
                                                        <View style={[styles.toggleCircleSmall, enabledLayers.customTheme ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.themesRow, !enabledLayers.customTheme && { opacity: 0.4 }]}>
                                                    {(Object.keys(VISUAL_THEMES) as ThemeId[]).map((themeId) => {
                                                        const theme = VISUAL_THEMES[themeId];
                                                        const isSelected = selectedTheme === themeId;
                                                        return (
                                                            <TouchableOpacity
                                                                key={themeId}
                                                                style={[
                                                                    styles.themeButton,
                                                                    isSelected && styles.themeButtonSelected
                                                                ]}
                                                                onPress={() => {
                                                                    setSelectedTheme(themeId);
                                                                    if (!enabledLayers.customTheme) setEnabledLayers(prev => ({ ...prev, customTheme: true }));
                                                                }}
                                                                activeOpacity={0.7}
                                                                disabled={!enabledLayers.customTheme}
                                                            >
                                                                <View style={[
                                                                    styles.themeIcon,
                                                                    { backgroundColor: theme.orbGlow }
                                                                ]}>
                                                                    <Ionicons name={theme.icon as any} size={20} color="#FFF" />
                                                                </View>
                                                                <Text style={[
                                                                    styles.themeName,
                                                                    isSelected && styles.themeNameSelected
                                                                ]}>{theme.name}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>

                                            <View style={styles.divider} />

                                            <SoundSelectorControl
                                                label="Guía de Voz"
                                                icon="mic"
                                                value={volumes.voice}
                                                color="#F59E0B"
                                                onPressSelector={() => { }}
                                                isLocked={false}
                                                isEnabled={enabledLayers.voice}
                                                onToggle={() => toggleLayer('voice')}
                                                onValueChange={(val: number) => handleVolumeChange('voice', val)}
                                            />

                                            <SoundSelectorControl
                                                label={selectedSoundscape?.name || "Ambiente"}
                                                icon={selectedSoundscape?.icon || "leaf"}
                                                value={volumes.soundscape}
                                                color={selectedSoundscape?.color || "#4A90E2"}
                                                onPressSelector={() => setShowSoundscapeModal(true)}
                                                isLocked={false}
                                                isEnabled={enabledLayers.soundscape}
                                                onToggle={() => toggleLayer('soundscape')}
                                                onValueChange={(val: number) => handleVolumeChange('soundscape', val)}
                                            />

                                            <SoundSelectorControl
                                                label={selectedBinaural?.name || "Frecuencia"}
                                                icon={selectedBinaural?.icon || "pulse"}
                                                value={volumes.binaural}
                                                color={selectedBinaural?.color || "#2DD4BF"}
                                                onPressSelector={() => isPremium ? setShowBinauralModal(true) : navigation.navigate(Screen.PAYWALL)}
                                                isLocked={!isPremium}
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
                    </LinearGradient>
                </ImageBackground>

                {/* Custom Modals */}
                <SelectionModal
                    visible={showSoundscapeModal}
                    onClose={() => setShowSoundscapeModal(false)}
                    title="Sonido Ambiente"
                    data={availableSoundscapes}
                    currentId={selectedSoundscape?.id}
                    onSelect={handleSoundscapeChange}
                />

                <SelectionModal
                    visible={showBinauralModal}
                    onClose={() => setShowBinauralModal(false)}
                    title="Ondas Binaurales"
                    data={BINAURAL_WAVES}
                    currentId={selectedBinaural?.id}
                    onSelect={handleBinauralChange}
                />

            </View >
        </GestureHandlerRootView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070A15' },
    background: { flex: 1 },
    gradient: { flex: 1 },
    mainWrapper: { flex: 1 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    headerInfo: { alignItems: 'center' },
    sessionStatus: { color: '#2DD4BF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
    sessionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', opacity: 0.9 },

    mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    auraCircle: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width,
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        shadowColor: theme.colors.accent,
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    orbContainer: {
        width: width * 0.75,
        height: width * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    orbContentOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    orbInner: { width: '85%', height: '85%', justifyContent: 'center', alignItems: 'center' },
    timerText: { color: '#FFF', fontSize: 64, fontWeight: '200', letterSpacing: 2 },
    phaseLabel: { color: theme.colors.accent, fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
    instructionText: { color: 'rgba(255,255,255,0.4)', fontSize: 16, marginTop: 40, fontWeight: '400', textAlign: 'center' },

    countdownBox: { alignItems: 'center' },
    countdownNumber: { color: theme.colors.accent, fontSize: 72, fontWeight: '800' },
    countdownSub: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginTop: -10 },

    pauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(7,10,21,0.85)',
        borderRadius: width,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    pauseBtnMain: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pauseBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginTop: 8,
    },
    pauseBtnSub: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    pauseBtnSubText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 6,
        letterSpacing: 1,
    },


    controlsPanel: { backgroundColor: 'rgba(17,20,32,0.92)', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    handleContainer: { alignItems: 'center', marginBottom: 16 },
    handle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 8 },
    handleLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },

    controlContainer: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, marginBottom: 12 },
    selectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    selectorRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    selectorLabel: { color: '#FFF', fontSize: 15, fontWeight: '600' },

    toggleBtn: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
    toggleBtnSmall: { width: 36, height: 20, borderRadius: 10, padding: 2, justifyContent: 'center' },
    toggleBtnOff: { backgroundColor: 'rgba(255,255,255,0.1)' },
    toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' },
    toggleCircleSmall: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFF' },

    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    themesSection: { marginBottom: 20 },
    themesRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    themeButton: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 2, borderColor: 'transparent' },
    themeButtonSelected: { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' },
    themeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    themeName: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', textAlign: 'center' },
    themeNameSelected: { color: '#FFF', fontWeight: '700' },

    volumeWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sliderTrack: { flex: 1, height: 20, justifyContent: 'center' },
    trackBase: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
    trackFill: { height: '100%', borderRadius: 2 },

    playbackRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 },
    btnSecondary: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    btnPlay: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2DD4BF', justifyContent: 'center', alignItems: 'center', shadowColor: '#2DD4BF', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },

    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, justifyContent: 'flex-end' },
    modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)' },
    modalContent: { backgroundColor: '#111420', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: height * 0.65, width: '100%', overflow: 'hidden' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    closeBtn: { padding: 4 },
    modalScroll: { flex: 1, padding: 16 },
    optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    optionCardSelected: { borderColor: '#2DD4BF', backgroundColor: 'rgba(45,212,191,0.05)' },
    optionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    optionInfo: { flex: 1 },
    optionName: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 2 },
    optionDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },

    briefingGradient: { flex: 1 },
    briefingTop: { padding: 24, paddingBottom: 12 },
    briefingBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
    briefingBadgeText: { color: '#000', fontSize: 10, fontWeight: '900' },
    briefingTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 12 },
    briefingDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 24 },
    briefingSection: { marginTop: 24 },
    briefingSectionText: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', marginTop: 20, padding: 16, borderRadius: 20 },
    sectionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
    sectionText: { color: '#FFF', fontSize: 15, lineHeight: 22 },
    rhythmPreview: { marginTop: 10 },
    rhythmRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    rhythmItem: { alignItems: 'center' },
    rhythmVal: { color: '#FFF', fontSize: 24, fontWeight: '700' },
    rhythmSub: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', marginTop: 4 },
    briefingScroll: { flex: 1 },
    briefingScrollContent: { paddingHorizontal: 24, paddingBottom: 20 },
    briefingFooter: { padding: 24, paddingTop: 12, backgroundColor: '#111420', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    startBtn: { backgroundColor: theme.colors.accent, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowColor: theme.colors.accent, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8, marginTop: 20 },
    startBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },

    entryOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    entryMessage: {
        fontSize: 24,
        fontWeight: '300',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: 1,
        fontStyle: 'italic',
        maxWidth: '80%',
    },
});

export default BreathingTimer;
