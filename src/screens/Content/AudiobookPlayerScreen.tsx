import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Alert,
    ImageBackground,
    Image,
    StatusBar,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { theme } from '../../constants/theme';
import { audiobooksService, favoritesService } from '../../services/contentService';
import { savePlaybackPosition, getPlaybackPosition, savePlaybackSpeed, getPlaybackSpeed } from '../../services/playbackStorage';
import SpeedControlModal from '../../components/SpeedControlModal';
import SleepTimerModal from '../../components/SleepTimerModal';
import { useApp } from '../../context/AppContext';

type AudiobookPlayerScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.AUDIOBOOK_PLAYER
>;

type AudiobookPlayerScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.AUDIOBOOK_PLAYER
>;

interface Props {
    navigation: AudiobookPlayerScreenNavigationProp;
    route: AudiobookPlayerScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const BOOK_COVERS: Record<string, any> = {
    'Meditations': require('../../assets/covers/meditations.png'),
    'The Conquest of Fear': require('../../assets/covers/conquest_fear.png'),
    'Little Women': require('../../assets/covers/little_women.png'),
    'As a Man Thinketh': require('../../assets/covers/mind_power.png'),
    'anxiety': require('../../assets/covers/anxiety.png'),
    'health': require('../../assets/covers/health.png'),
    'growth': require('../../assets/covers/growth.png'),
    'professional': require('../../assets/covers/professional.png'),
};

const AudiobookPlayerScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { audiobookId } = route.params as { audiobookId: string };
    const { userState } = useApp();

    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    // New features state
    const [isFavorite, setIsFavorite] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
    const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);

    const playbackStatusRef = useRef<any>(null);
    const isMountedRef = useRef(true);
    const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
    const positionSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Refs for synchronization in cleanup
    const isPlayingRef = useRef(false);
    const positionRef = useRef(0);
    const durationRef = useRef(0);
    const soundRef = useRef<Audio.Sound | null>(null);

    // Fade animation
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Keep refs in sync with state for cleanup functions
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
    useEffect(() => { positionRef.current = position; }, [position]);
    useEffect(() => { durationRef.current = duration; }, [duration]);
    useEffect(() => { soundRef.current = sound; }, [sound]);

    // Load audiobook
    useEffect(() => {
        loadAudiobook();
    }, [audiobookId]);

    // Setup audio when audiobook is loaded
    useEffect(() => {
        if (audiobook) {
            setupAudio();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [audiobook]);

    // Track component mount status
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Cleanup sound on unmount or change
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Handle screen focus - pause and save position when leaving
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                const currentSound = soundRef.current;
                const currentIsPlaying = isPlayingRef.current;
                const currentPosition = positionRef.current;
                const currentDuration = durationRef.current;

                if (currentSound && audiobook) {
                    if (currentIsPlaying) {
                        currentSound.pauseAsync();
                    }
                    if (currentPosition > 0 && currentDuration > 0) {
                        savePlaybackPosition(audiobook.id, currentPosition, currentDuration);
                    }
                }
            };
        }, [audiobook])
    );

    // Load favorite status
    useEffect(() => {
        if (audiobook && userState.id) {
            loadFavoriteStatus();
        }
    }, [audiobook, userState.id]);

    // Load saved playback speed
    useEffect(() => {
        loadSavedSpeed();
    }, []);

    // Load saved position when audio is ready
    useEffect(() => {
        if (sound && audiobook) {
            loadSavedPosition();
        }
    }, [sound, audiobook]);

    // Auto-save position every 5 seconds while playing
    useEffect(() => {
        if (isPlaying && audiobook) {
            positionSaveIntervalRef.current = setInterval(() => {
                if (position > 0 && duration > 0) {
                    savePlaybackPosition(audiobook.id, position, duration);
                }
            }, 5000);
        } else {
            if (positionSaveIntervalRef.current) {
                clearInterval(positionSaveIntervalRef.current);
            }
        }

        return () => {
            if (positionSaveIntervalRef.current) {
                clearInterval(positionSaveIntervalRef.current);
            }
        };
    }, [isPlaying, position, duration, audiobook]);

    // Sleep timer countdown
    useEffect(() => {
        if (sleepTimerSeconds !== null && sleepTimerSeconds > 0) {
            sleepTimerRef.current = setTimeout(() => {
                setSleepTimerSeconds((prev) => {
                    if (prev === null) return null;
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        if (sound) sound.pauseAsync();
                        return null;
                    }
                    return newValue;
                });
            }, 1000);
        }
        return () => {
            if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
        };
    }, [sleepTimerSeconds]);

    const loadAudiobook = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await audiobooksService.getById(audiobookId);
            if (!data) {
                setError('Audiolibro no encontrado');
                return;
            }
            setAudiobook(data);
        } catch (err) {
            console.error('Error loading audiobook:', err);
            setError('Error al cargar el audiolibro');
        } finally {
            setLoading(false);
        }
    };

    const setupAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audiobook!.audio_url },
                { shouldPlay: false },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
        } catch (err) {
            console.error('Error setting up audio:', err);
            setError('Error al cargar el audio');
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!isMountedRef.current) return;
        playbackStatusRef.current = status;
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            setIsBuffering(status.isBuffering);
            positionRef.current = status.positionMillis;
            durationRef.current = status.durationMillis || 0;
            isPlayingRef.current = status.isPlaying;
        }
        if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
            isPlayingRef.current = false;
            positionRef.current = 0;
            if (audiobook) savePlaybackPosition(audiobook.id, 0, status.durationMillis || 0);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;
        try {
            if (isPlaying) await sound.pauseAsync(); else await sound.playAsync();
        } catch (err) {
            console.error('Error toggling play/pause:', err);
        }
    };

    const seekTo = async (value: number) => {
        if (!sound) return;
        try {
            await sound.setPositionAsync(value);
        } catch (err) {
            console.error('Error seeking:', err);
        }
    };

    const skipForward = async () => {
        if (!sound || !playbackStatusRef.current) return;
        const newPosition = Math.min(playbackStatusRef.current.positionMillis + 15000, duration);
        await seekTo(newPosition);
    };

    const skipBackward = async () => {
        if (!sound || !playbackStatusRef.current) return;
        const newPosition = Math.max(playbackStatusRef.current.positionMillis - 15000, 0);
        await seekTo(newPosition);
    };

    const loadFavoriteStatus = async () => {
        if (!userState.id || !audiobook) return;
        try {
            const isFav = await favoritesService.isFavorited(userState.id, 'audiobook', audiobook.id);
            setIsFavorite(isFav);
        } catch (error) {
            console.error('Error loading favorite status:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!userState.id || !audiobook) return;
        try {
            if (isFavorite) {
                await favoritesService.remove(userState.id, 'audiobook', audiobook.id);
                setIsFavorite(false);
            } else {
                await favoritesService.add(userState.id, 'audiobook', audiobook.id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'No se pudo actualizar favoritos');
        }
    };

    const loadSavedSpeed = async () => {
        try {
            const savedSpeed = await getPlaybackSpeed();
            setPlaybackSpeed(savedSpeed);
        } catch (error) {
            console.error('Error loading saved speed:', error);
        }
    };

    const handleSpeedChange = async (speed: number) => {
        if (!sound) return;
        try {
            await sound.setRateAsync(speed, true);
            setPlaybackSpeed(speed);
            await savePlaybackSpeed(speed);
        } catch (error) {
            console.error('Error changing speed:', error);
        }
    };

    const handleSleepTimer = (minutes: number) => {
        setSleepTimerSeconds(minutes * 60);
    };

    const cancelSleepTimer = () => {
        setSleepTimerSeconds(null);
        if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };

    const loadSavedPosition = async () => {
        if (!audiobook || !sound) return;
        try {
            const savedPosition = await getPlaybackPosition(audiobook.id);
            if (savedPosition && savedPosition.position > 0) {
                if (savedPosition.position < savedPosition.duration * 0.95) {
                    await sound.setPositionAsync(savedPosition.position);
                }
            }
        } catch (error) {
            console.error('Error loading saved position:', error);
        }
    };

    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !audiobook) {
        return (
            <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
                <Text style={styles.errorText}>{error || 'Audiolibro no encontrado'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const coverSource = BOOK_COVERS[audiobook.title] || BOOK_COVERS[audiobook.category] || require('../../assets/covers/growth.png');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Blur Artwork */}
            <View style={StyleSheet.absoluteFill}>
                <ImageBackground source={coverSource} style={styles.bgImage} blurRadius={40}>
                    <LinearGradient
                        colors={['rgba(5,8,16,0.6)', 'rgba(5,8,16,0.95)']}
                        style={StyleSheet.absoluteFill}
                    />
                </ImageBackground>
            </View>

            {/* Header */}
            <View style={[styles.navHeader, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>REPRODUCIENDO</Text>
                <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
                    <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? '#FF6B9D' : '#FFFFFF'} />
                </TouchableOpacity>
            </View>

            <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
                {/* Artwork */}
                <View style={styles.artworkWrapper}>
                    <Image source={coverSource} style={styles.artworkImage} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.3)']} style={styles.artworkShadow} />
                </View>

                {/* Info */}
                <View style={styles.infoWrapper}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={2}>{audiobook.title}</Text>
                        <Text style={styles.author}>de {audiobook.author}</Text>
                    </View>
                    <View style={styles.narratorRow}>
                        <Ionicons name="mic-outline" size={14} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.narrator}>Voz por {audiobook.narrator}</Text>
                    </View>
                </View>

                {/* Controls Area (Glass) */}
                <BlurView intensity={30} tint="dark" style={styles.controlsGlass}>
                    {/* Slider */}
                    <View style={styles.sliderSection}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration}
                            value={position}
                            onSlidingComplete={seekTo}
                            minimumTrackTintColor={theme.colors.primary}
                            maximumTrackTintColor="rgba(255,255,255,0.1)"
                            thumbTintColor="#FFFFFF"
                        />
                        <View style={styles.timeRow}>
                            <Text style={styles.timeText}>{formatTime(position)}</Text>
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        </View>
                    </View>

                    {/* Main Actions */}
                    <View style={styles.mainControls}>
                        <TouchableOpacity onPress={skipBackward} style={styles.skipBtn}>
                            <Ionicons name="refresh-outline" size={28} color="#FFFFFF" style={{ transform: [{ rotateY: '180deg' }] }} />
                            <Text style={styles.skipLabel}>15</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayPause}
                            style={styles.playBtn}
                            disabled={isBuffering}
                        >
                            <LinearGradient colors={['#646CFF', '#4F56D9']} style={styles.playGradient}>
                                {isBuffering ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Ionicons name={isPlaying ? "pause" : "play"} size={44} color="#FFFFFF" />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={skipForward} style={styles.skipBtn}>
                            <Ionicons name="refresh-outline" size={28} color="#FFFFFF" />
                            <Text style={styles.skipLabel}>15</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Secondary Actions */}
                    <View style={styles.footerActions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSpeedModal(true)}>
                            <Ionicons name="speedometer-outline" size={20} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.actionLabel}>{playbackSpeed}x</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSleepTimerModal(true)}>
                            <Ionicons name="moon-outline" size={20} color={sleepTimerSeconds ? '#FFA726' : 'rgba(255,255,255,0.6)'} />
                            <Text style={[styles.actionLabel, sleepTimerSeconds && { color: '#FFA726' }]}>
                                {sleepTimerSeconds ? formatTime(sleepTimerSeconds * 1000) : 'Temporizador'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Animated.View>

            {/* Modals */}
            <SpeedControlModal
                visible={showSpeedModal}
                currentSpeed={playbackSpeed}
                onClose={() => setShowSpeedModal(false)}
                onSelectSpeed={handleSpeedChange}
            />
            <SleepTimerModal
                visible={showSleepTimerModal}
                onClose={() => setShowSleepTimerModal(false)}
                onSetTimer={handleSleepTimer}
                activeTimer={sleepTimerSeconds}
                onCancelTimer={cancelSleepTimer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050810',
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    artworkWrapper: {
        width: width * 0.72,
        height: width * 0.95,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginTop: 20,
    },
    artworkImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    artworkShadow: {
        ...StyleSheet.absoluteFillObject,
    },
    infoWrapper: {
        alignItems: 'center',
        marginTop: 30,
        gap: 8,
    },
    titleRow: {
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    author: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
    },
    narratorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    narrator: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    controlsGlass: {
        width: '100%',
        borderRadius: 32,
        padding: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 40,
    },
    sliderSection: {
        width: '100%',
        marginBottom: 24,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    timeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '700',
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    skipBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    skipLabel: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: '900',
        color: '#FFFFFF',
        top: 18,
    },
    playBtn: {
        width: 86,
        height: 86,
        borderRadius: 43,
        overflow: 'hidden',
        elevation: 8,
    },
    playGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    actionLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '800',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 15,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
});

export default AudiobookPlayerScreen;
