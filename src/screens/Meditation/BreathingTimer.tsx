import React, { useState, useEffect } from 'react';
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
import { MEDITATION_SESSIONS } from '../../data/sessionsData';
import { SOUNDSCAPES, BINAURAL_WAVES, Soundscape, BinauralWave } from '../../data/soundscapesData';
import ThemedBreathingOrb from '../../components/Meditation/ThemedBreathingOrb';
import { VISUAL_THEMES, DEFAULT_THEME, type ThemeId } from '../../constants/visualThemes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

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

const SessionBriefingModal = ({ visible, session, onConfirm, onCancel }: any) => {
    const insets = useSafeAreaInsets();
    if (!visible || !session) return null;
    return (
        <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            <View style={[styles.modalContent, { height: height * 0.82 }]}>
                <LinearGradient
                    colors={[session.color + '40', '#111420']}
                    style={styles.briefingGradient}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Preparación de Sesión</Text>
                        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.briefingScroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.briefingScrollContent}
                    >
                        <View style={styles.briefingTop}>
                            <View style={[styles.briefingBadge, { backgroundColor: session.color }]}>
                                <Text style={styles.briefingBadgeText}>{session.category.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.briefingTitle}>{session.title}</Text>
                            <Text style={styles.briefingDesc}>{session.description}</Text>
                        </View>

                        <View style={styles.briefingSection}>
                            <Text style={styles.sectionLabel}>OBJETIVO CIENTÍFICO</Text>
                            <Text style={styles.sectionText}>{session.scientificBenefits}</Text>
                        </View>

                        <View style={styles.briefingSectionText}>
                            <Ionicons name="information-circle-outline" size={20} color={theme.colors.accent} />
                            <Text style={[styles.sectionText, { color: theme.colors.accent, marginLeft: 8, fontWeight: '700', flex: 1 }]}>
                                {session.practiceInstruction}
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={[styles.briefingFooter, { paddingBottom: insets.bottom + 24 }]}>
                        <View style={styles.rhythmPreview}>
                            <Text style={styles.sectionLabel}>RITMO DE RESPIRACIÓN</Text>
                            <View style={styles.rhythmRow}>
                                <View style={styles.rhythmItem}><Text style={styles.rhythmVal}>{session.breathingPattern.inhale}s</Text><Text style={styles.rhythmSub}>Inhala</Text></View>
                                {session.breathingPattern.hold > 0 && <View style={styles.rhythmItem}><Text style={styles.rhythmVal}>{session.breathingPattern.hold}s</Text><Text style={styles.rhythmSub}>Mantén</Text></View>}
                                <View style={styles.rhythmItem}><Text style={styles.rhythmVal}>{session.breathingPattern.exhale}s</Text><Text style={styles.rhythmSub}>Exhala</Text></View>
                                {session.breathingPattern.holdPost > 0 && <View style={styles.rhythmItem}><Text style={styles.rhythmVal}>{session.breathingPattern.holdPost}s</Text><Text style={styles.rhythmSub}>Pausa</Text></View>}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.startBtn} onPress={onConfirm}>
                            <Text style={styles.startBtnText}>EMPEZAR PRÁCTICA</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
};

const SoundSelectorControl = ({ label, icon, value, isLocked, onValueChange, onPressSelector, color }: any) => {
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
                    <Ionicons name={icon} size={20} color={isLocked ? 'rgba(255,255,255,0.2)' : color} />
                    <Text style={[styles.selectorLabel, isLocked && { color: 'rgba(255,255,255,0.3)' }]}>{label}</Text>
                </View>
                {!isLocked && <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />}
                {isLocked && <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.2)" />}
            </TouchableOpacity>

            <View style={styles.volumeWrapper}>
                <Ionicons name="volume-low" size={12} color="rgba(255,255,255,0.2)" />
                <TouchableOpacity
                    style={styles.sliderTrack}
                    activeOpacity={1}
                    onPressIn={handlePanGesture}
                    onPress={handlePanGesture}
                >
                    <View style={styles.trackBase}>
                        <View style={[styles.trackFill, { width: `${value * 100}%`, backgroundColor: isLocked ? 'rgba(255,255,255,0.1)' : color }]} />
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
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [currentSession, setCurrentSession] = useState<any>(null);

    // Countdown and Interaction State
    const [showBriefingModal, setShowBriefingModal] = useState(false);
    const [isCountingStart, setIsCountingStart] = useState(false);
    const [isCountingEnd, setIsCountingEnd] = useState(false);
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

        if (!isActive && !isCountingStart) {
            pulse.start();
        } else {
            pulse.stop();
            pulseAnim.setValue(1);
        }

        return () => pulse.stop();
    }, [isActive, isCountingStart]);

    const [volumes, setVolumes] = useState({
        voice: 0.35,
        soundscape: 0.7,
        binaural: 0.4,
        elements: 0.5,
    });

    const [selectedSoundscape, setSelectedSoundscape] = useState<Soundscape | null>(null);
    const [selectedBinaural, setSelectedBinaural] = useState<BinauralWave | null>(null);

    const [showSoundscapeModal, setShowSoundscapeModal] = useState(false);
    const [showBinauralModal, setShowBinauralModal] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>(DEFAULT_THEME);
    const [isImmersiveMode, setIsImmersiveMode] = useState(false);
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);

    useEffect(() => {
        const initSession = async () => {
            try {
                const sessionId = (route.params as any)?.sessionId || 'anx_478';
                const session = MEDITATION_SESSIONS.find(s => s.id === sessionId);

                if (session) {
                    setCurrentSession(session);

                    const messages: Record<string, string> = {
                        inhale: 'Inhala suavemente',
                        hold: 'Mantén el aire',
                        exhale: 'Exhala liberando tensión',
                        holdPost: 'Pausa y descansa'
                    };

                    // Auto-select based on session defaults
                    const ssId = session.audioLayers.defaultSoundscape;
                    const bwId = session.audioLayers.defaultBinaural;

                    const ss = SOUNDSCAPES.find(s => s.id === ssId) || SOUNDSCAPES[0];
                    const bw = BINAURAL_WAVES.find(b => b.id === bwId) || BINAURAL_WAVES[0];

                    setSelectedSoundscape(ss);
                    setSelectedBinaural(bw);

                    // Force the actual session duration
                    setTimeLeft(session.durationMinutes * 60);

                    // Load audio layers + Preload Voice Cues
                    await Promise.all([
                        AudioEngineService.loadSession({
                            soundscape: ss.id,
                            binaural: bw.id,
                            elements: session.audioLayers.defaultElements,
                        }),
                        AudioEngineService.preloadCues(messages)
                    ]);

                    // Set initial volumes from session defaults 
                    await AudioEngineService.setLayerVolume('soundscape', 0.6);
                    await AudioEngineService.setLayerVolume('binaural', 0.4);

                    setIsAudioLoaded(true);
                }
            } catch (error) {
                console.error('Error initializing session:', error);
            }
        };
        initSession();

        return () => {
            AudioEngineService.unloadAll();
        };
    }, [route.params]);

    // Breathing Logic Effect
    useEffect(() => {
        let phaseInterval: NodeJS.Timeout;

        if (isActive && currentSession) {
            const pattern = currentSession.breathingPattern;
            let currentTimer = 0;

            const runPhase = () => {
                const { inhale, hold, exhale, holdPost } = pattern;
                const totalCycle = inhale + hold + exhale + holdPost;

                const cycleTimer = (currentTimer % totalCycle * 10) / 10; // Precision to 0.1s

                if (cycleTimer < inhale) {
                    setPhase('inhale');
                    setPhaseProgress(cycleTimer / inhale);
                } else if (cycleTimer < inhale + hold) {
                    setPhase('hold');
                    setPhaseProgress(1);
                } else if (cycleTimer < inhale + hold + exhale) {
                    setPhase('exhale');
                    setPhaseProgress(1 - (cycleTimer - inhale - hold) / exhale);
                } else {
                    setPhase('holdPost');
                    setPhaseProgress(0);
                }

                currentTimer += 0.1;
            };

            phaseInterval = setInterval(runPhase, 100);
        } else {
            setPhase('inhale');
            setPhaseProgress(0);
        }

        return () => clearInterval(phaseInterval);
    }, [isActive, currentSession]);

    // Unified Guiding Logic (Smart Guiding)
    const cycleRef = React.useRef(0);
    const lastPlayedPhase = React.useRef<string | null>(null);

    useEffect(() => {
        if (isActive && currentSession) {
            const pattern = currentSession.breathingPattern;
            const totalCycleTime = pattern.inhale + pattern.hold + pattern.exhale + pattern.holdPost;

            // Smart Guiding Rules (Pacing logic):
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

                if (shouldSpeak) {
                    const messages: Record<string, string> = {
                        inhale: 'Inhala',
                        hold: 'Mantén',
                        exhale: 'Exhala',
                        holdPost: 'Pausa'
                    };

                    if (totalCycleTime < 6.0) {
                        AudioEngineService.playVoiceCue(phase, currentSession.voiceStyle, messages[phase]);
                    } else {
                        const longMessages: Record<string, string> = {
                            inhale: 'Inhala suavemente',
                            hold: 'Mantén el aire',
                            exhale: 'Exhala liberando tensión',
                            holdPost: 'Pausa y descansa'
                        };
                        AudioEngineService.playVoiceCue(phase, currentSession.voiceStyle, longMessages[phase]);
                    }
                }

                // Haptic Feedback for physical guidance (Eyes-closed support)
                try {
                    switch (phase) {
                        case 'inhale':
                            // Double impact for Inhale (Stronger signal)
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            break;
                        case 'hold':
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            break;
                        case 'exhale':
                            // Deep vibration for Exhale
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            break;
                        case 'holdPost':
                            Haptics.selectionAsync();
                            break;
                    }
                } catch (e) {
                    // Silently ignore if haptics fail
                }

                // Increment cycle counter when we start a new inhale
                if (phase === 'inhale' && lastPlayedPhase.current !== 'inhale') {
                    cycleRef.current += 1;
                }

                lastPlayedPhase.current = phase;
            }
        } else {
            cycleRef.current = 0;
            lastPlayedPhase.current = null;
        }
    }, [phase, isActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            AudioEngineService.pauseAll();
            startPostSessionCountdown();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startPreSessionCountdown = () => {
        if (!currentSession) return;
        setShowBriefingModal(true);
    };

    const confirmBriefing = () => {
        setShowBriefingModal(false);
        setIsCountingStart(true);
        setCountdownValue(3);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        let val = 3;
        const countInt = setInterval(() => {
            val -= 1;
            if (val > 0) {
                setCountdownValue(val);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } else {
                clearInterval(countInt);
                setIsCountingStart(false);
                toggleTimer(); // This will play audio and set isActive
            }
        }, 1000);
    };

    const startPostSessionCountdown = () => {
        setIsCountingEnd(true);
        setCountdownValue(3);

        // No longer counting 3-2-1 at the end, just showing "Session Completed"
        setTimeout(() => {
            setIsCountingEnd(false);
            navigation.navigate(Screen.SESSION_END);
        }, 2000);
    };

    const toggleTimer = async () => {
        if (!isAudioLoaded || isCountingStart || isCountingEnd) return;
        try {
            if (isActive) {
                await AudioEngineService.pauseAll();
            } else {
                await AudioEngineService.playAll();
            }
            setIsActive(!isActive);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.error('Error toggling audio:', error);
        }
    };

    const handleRestart = async () => {
        setIsActive(false);
        setTimeLeft(currentSession?.durationMinutes * 60 || 600);
        setPhase('inhale');
        setPhaseProgress(0);
        try {
            await AudioEngineService.pauseAll();
            // We could add a 'reset' to AudioEngine if needed, but pause is enough for now
            // since initSession will reload on next param change or we can manual reload
        } catch (error) {
            console.error('Error restarting:', error);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    const handleVolumeChange = async (layer: 'soundscape' | 'binaural' | 'elements' | 'voice', value: number) => {
        setVolumes(prev => ({ ...prev, [layer]: value }));
        await AudioEngineService.setLayerVolume(layer, value);
    };

    const handleSoundscapeChange = async (item: Soundscape) => {
        setSelectedSoundscape(item);
        await AudioEngineService.swapSoundscape(item.id, isActive);
    };

    const handleBinauralChange = async (item: BinauralWave) => {
        setSelectedBinaural(item);
        await AudioEngineService.swapBinaural(item.id, isActive);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={true} />
                <ImageBackground
                    source={VISUAL_THEMES[selectedTheme].background}
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
                                    <Text style={styles.sessionStatus}>{isActive ? 'REPRODUCIENDO' : 'PAUSADO'}</Text>
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
                                    onPress={(!isActive && !isCountingStart && !isCountingEnd) ? startPreSessionCountdown : toggleTimer}
                                >
                                    <ThemedBreathingOrb
                                        size={width * 0.75}
                                        active={isActive && !isCountingEnd && !isCountingStart}
                                        phase={phase === 'holdPost' ? 'hold' : phase}
                                        theme={selectedTheme}
                                    />

                                    <View style={styles.orbContentOverlay}>
                                        <View style={styles.orbInner}>
                                            {(isCountingStart || isCountingEnd) ? (
                                                <View style={styles.countdownBox}>
                                                    <Text style={styles.countdownNumber}>{countdownValue}</Text>
                                                    <Text style={styles.countdownSub}>
                                                        {isCountingStart ? 'EMPIEZA' : 'COMPLETADA'}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <>
                                                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

                                                    {/* Pause Controls Overlay */}
                                                    {!isActive && timeLeft < (currentSession?.durationMinutes * 60) && (
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

                                                    {isActive && (
                                                        <Text style={styles.phaseLabel}>
                                                            {phase === 'inhale' ? 'Inhala' :
                                                                phase === 'hold' ? 'Mantén' :
                                                                    phase === 'exhale' ? 'Exhala' : 'Pausa'}
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.instructionText}>
                                    {isActive ? (
                                        phase === 'inhale' ? 'Inhala por la nariz...' :
                                            phase === 'hold' ? 'Mantén el aire...' :
                                                phase === 'exhale' ? 'Exhala suavemente...' : 'Prepárate...'
                                    ) : (
                                        isCountingStart ? 'Prepárate...' :
                                            (timeLeft < (currentSession?.durationMinutes * 60) ? 'Sesión pausada' : 'Pulsa el círculo para iniciar')
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
                                            {isPanelExpanded ? 'OCULTAR CONTROLES' : 'CONTROLES DE AUDIO'}
                                        </Text>
                                    </TouchableOpacity>

                                    {isPanelExpanded && (
                                        <>
                                            {/* Visual Theme Selector */}
                                            <View style={styles.themesSection}>
                                                <Text style={styles.sectionLabel}>AMBIENTE VISUAL</Text>
                                                <View style={styles.themesRow}>
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
                                                                onPress={() => setSelectedTheme(themeId)}
                                                                activeOpacity={0.7}
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
                                                onValueChange={(val: number) => handleVolumeChange('voice', val)}
                                            />

                                            <SoundSelectorControl
                                                label={selectedSoundscape?.name || "Ambiente"}
                                                icon={selectedSoundscape?.icon || "leaf"}
                                                value={volumes.soundscape}
                                                color={selectedSoundscape?.color || "#4A90E2"}
                                                onPressSelector={() => setShowSoundscapeModal(true)}
                                                isLocked={false}
                                                onValueChange={(val: number) => handleVolumeChange('soundscape', val)}
                                            />

                                            <SoundSelectorControl
                                                label={selectedBinaural?.name || "Frecuencia"}
                                                icon={selectedBinaural?.icon || "pulse"}
                                                value={volumes.binaural}
                                                color={selectedBinaural?.color || "#2DD4BF"}
                                                onPressSelector={() => isPremium ? setShowBinauralModal(true) : navigation.navigate(Screen.PAYWALL)}
                                                isLocked={!isPremium}
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
                    data={SOUNDSCAPES}
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

                <SessionBriefingModal
                    visible={showBriefingModal}
                    session={currentSession}
                    onCancel={() => setShowBriefingModal(false)}
                    onConfirm={confirmBriefing}
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
    selectorLabel: { color: '#FFF', fontSize: 15, fontWeight: '600' },

    volumeWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sliderTrack: { flex: 1, height: 20, justifyContent: 'center' },
    trackBase: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
    trackFill: { height: '100%', borderRadius: 2 },

    playbackRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 },
    btnSecondary: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    btnPlay: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2DD4BF', justifyContent: 'center', alignItems: 'center', shadowColor: '#2DD4BF', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },

    // Modal Styles
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

    // Briefing Modal Styles
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

    // Theme Selector Styles
    themesSection: { marginBottom: 16 },
    themesRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    themeButton: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 2, borderColor: 'transparent' },
    themeButtonSelected: { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)' },
    themeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    themeName: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', textAlign: 'center' },
    themeNameSelected: { color: '#FFF', fontWeight: '700' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },
});

export default BreathingTimer;
