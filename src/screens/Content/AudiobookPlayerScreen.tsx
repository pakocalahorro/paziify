import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Dimensions,
    Animated,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { theme } from '../../constants/theme';
import { audiobooksService, favoritesService } from '../../services/contentService';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useApp } from '../../context/AppContext';
import { savePlaybackPosition, getPlaybackPosition, savePlaybackSpeed, getPlaybackSpeed } from '../../services/playbackStorage';

const { width } = Dimensions.get('window');

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

const AudiobookPlayerScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { audiobookId } = route.params;
    const { userState } = useApp();
    const {
        isPlaying,
        currentTrack,
        position,
        duration,
        loadTrack,
        play,
        pause,
        seekTo,
        skipForward,
        skipBackward,
        sound
    } = useAudioPlayer();

    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSleepTimer, setShowSleepTimer] = useState(false);
    const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);
    const [savedState, setSavedState] = useState<{ position: number; duration: number } | null>(null);

    // Load saved position for visual display when not playing
    useEffect(() => {
        if (audiobook?.id) {
            getPlaybackPosition(audiobook.id).then((pos) => {
                if (pos) setSavedState(pos);
            });
        }
    }, [audiobook]);

    // Hooks moved to top
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

    const formatTime = (millis: number) => {
        const totalSeconds = millis / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchAudiobook = async () => {
            if (!audiobookId) return;
            try {
                const data = await audiobooksService.getById(audiobookId);
                if (!data) {
                    setError('Audiolibro no encontrado');
                } else {
                    setAudiobook(data);
                }
            } catch (err) {
                console.error('Error fetching audiobook:', err);
                setError('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        // [ZERO EGRESS 2.0] Prioritize object passed via navigation
        if (route.params.audiobook) {
            console.log('[AUDIOBOOK_PLAYER] Using navigation audiobook data (Zero Egress)');
            setAudiobook(route.params.audiobook);
            setLoading(false);
        } else if (audiobookId) {
            fetchAudiobook();
        }
    }, [audiobookId, route.params.audiobook]);

    // Animation when loaded
    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    // Load favorite status
    useEffect(() => {
        if (audiobook && userState.id) {
            favoritesService.isFavorited(userState.id, 'audiobook', audiobook.id)
                .then(setIsFavorite)
                .catch(console.error);
        }
    }, [audiobook, userState.id]);

    // Load saved playback speed
    useEffect(() => {
        getPlaybackSpeed().then(setPlaybackSpeed).catch(console.error);
    }, []);

    // Helper: Sleep Timer
    useEffect(() => {
        if (sleepTimerSeconds !== null && sleepTimerSeconds > 0) {
            sleepTimerRef.current = setTimeout(() => {
                setSleepTimerSeconds((prev) => {
                    if (prev === null) return null;
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        pause(); // Pause global player
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

    const togglePlayback = async () => {
        if (!audiobook) return;

        // Case 1: This track is already loaded
        if (currentTrack?.id === audiobook.id) {
            if (isPlaying) {
                await pause();
            } else {
                await play();
            }
        }
        // Case 2: New track
        else {
            setLoading(true);
            try {
                let coverSource = { uri: audiobook.image_url };
                if (typeof audiobook.image_url === 'number') {
                    coverSource = audiobook.image_url;
                }

                const initialPos = await getPlaybackPosition(audiobook.id);
                // Fix: Extract position from PlaybackPosition object or default to 0
                const startPosition = initialPos?.position || 0;

                await loadTrack({
                    id: audiobook.id,
                    title: audiobook.title,
                    author: audiobook.author,
                    cover: coverSource,
                    audio_url: audiobook.audio_url, // Standardized property
                    duration: 0
                }, startPosition, true);

                // Replaced: await play(); 
                // loadTrack(..., true) already handles playback with the fresh sound instance.
            } catch (err) {
                console.error('Error toggling playback:', err);
            } finally {
                setLoading(false);
            }
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
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !audiobook) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
                <Text style={styles.errorText}>{error || 'Error desconocido'}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
                    <Text style={styles.retryText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Hooks moved to top
    // [Fix 6] Smart Progress Logic
    // If this book is REALLY playing, use global state.
    // If not, use saved state to avoid showing Background Music progress.
    const isCurrentBookActive = currentTrack?.id === audiobook?.id;

    const displayPosition = isCurrentBookActive ? position : (savedState?.position || 0);
    const displayDuration = isCurrentBookActive ? duration : (savedState?.duration || 1); // Avoid div by 0
    const displayProgress = displayDuration > 0 ? displayPosition / displayDuration : 0;

    const handleSeek = (val: number) => {
        const targetMillis = val * displayDuration;
        if (isCurrentBookActive) {
            seekTo(targetMillis);
        } else {
            // Optional: If user slides while not playing, we could auto-play from there?
            // For now, let's just update visual or ignore to keep it simple/safe.
            // If we seek global context, it would seek the background music!
            // So strictly ignore or loadTrack. Let's ignore to prevent accidental music jumps.
            console.log('Seek ignored - Book not active');
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Image (Blurred) */}
            <Image
                source={typeof audiobook.image_url === 'number' ? audiobook.image_url : { uri: audiobook.image_url }}
                style={StyleSheet.absoluteFill}
                blurRadius={20}
            />
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="chevron-down" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Audiolibro</Text>
                    <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={26}
                            color={isFavorite ? theme.colors.primary : "#FFF"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Cover Art */}
                <View style={styles.coverContainer}>
                    <Image
                        source={typeof audiobook.image_url === 'number' ? audiobook.image_url : { uri: audiobook.image_url }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>{audiobook.title}</Text>
                    <Text style={styles.author}>{audiobook.author}</Text>
                    {audiobook.narrator && (
                        <Text style={styles.narrator}>Narrado por {audiobook.narrator}</Text>
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
                        disabled={!isCurrentBookActive && (!savedState || savedState.duration === 0)}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
                        <Text style={styles.timeText}>{formatTime(displayDuration)}</Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity onPress={() => skipBackward()} style={styles.controlButton}>
                        <Ionicons name="play-back" size={32} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={togglePlayback} style={styles.playPauseButton}>
                        <Ionicons
                            name={isPlaying && currentTrack?.id === audiobook.id ? "pause" : "play"}
                            size={48}
                            color="#000"
                            style={!isPlaying ? { marginLeft: 4 } : {}}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => skipForward()} style={styles.controlButton}>
                        <Ionicons name="play-forward" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Footer Options */}
                <View style={styles.footerOptions}>
                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => setShowSpeedMenu(true)}
                    >
                        <Ionicons name="speedometer-outline" size={20} color="#FFF" />
                        <Text style={styles.optionText}>{playbackSpeed}x</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => setShowSleepTimer(true)}
                    >
                        <Ionicons
                            name="time-outline"
                            size={20}
                            color={sleepTimerSeconds ? theme.colors.primary : "#FFF"}
                        />
                        <Text style={[styles.optionText, sleepTimerSeconds ? { color: theme.colors.primary } : {}]}>
                            {sleepTimerSeconds ? `${Math.ceil(sleepTimerSeconds / 60)}m` : 'Timer'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="list-outline" size={20} color="#FFF" />
                        <Text style={styles.optionText}>Capítulos</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Speed Selection Modal */}
            <Modal
                visible={showSpeedMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSpeedMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSpeedMenu(false)}
                >
                    <BlurView intensity={60} tint="dark" style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Velocidad de Reproducción</Text>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                style={[styles.modalOption, playbackSpeed === speed && styles.modalOptionActive]}
                                onPress={() => {
                                    handleSpeedChange(speed);
                                    setShowSpeedMenu(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, playbackSpeed === speed && styles.modalOptionTextActive]}>
                                    {speed}x {speed === 1 ? '(Normal)' : ''}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </BlurView>
                </TouchableOpacity>
            </Modal>

            {/* Sleep Timer Modal */}
            <Modal
                visible={showSleepTimer}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSleepTimer(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSleepTimer(false)}
                >
                    <BlurView intensity={60} tint="dark" style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Temporizador de Apagado</Text>
                        {[
                            { label: 'Desactivado', value: null },
                            { label: '15 minutos', value: 15 * 60 },
                            { label: '30 minutos', value: 30 * 60 },
                            { label: '45 minutos', value: 45 * 60 },
                            { label: '1 hora', value: 60 * 60 },
                        ].map((option) => (
                            <TouchableOpacity
                                key={option.label}
                                style={[styles.modalOption, sleepTimerSeconds === option.value && styles.modalOptionActive]}
                                onPress={() => {
                                    setSleepTimerSeconds(option.value);
                                    setShowSleepTimer(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, sleepTimerSeconds === option.value && styles.modalOptionTextActive]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
    },
    retryText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
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
        marginVertical: 40,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        paddingHorizontal: 40,
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    author: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    narrator: {
        color: '#FFF',
        fontSize: 14,
        opacity: 0.6,
    },
    sliderContainer: {
        paddingHorizontal: 30,
        marginBottom: 30,
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
        marginBottom: 50,
    },
    controlButton: {
        padding: 20,
    },
    playPauseButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
    },
    footerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    optionItem: {
        alignItems: 'center',
        opacity: 0.8,
    },
    optionText: {
        color: '#FFF',
        fontSize: 10,
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOption: {
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalOptionActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    modalOptionText: {
        color: '#FFF',
        fontSize: 16,
    },
    modalOptionTextActive: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default AudiobookPlayerScreen;
