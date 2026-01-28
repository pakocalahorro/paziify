import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    Image,
    StatusBar,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { theme } from '../../constants/theme';
import { audiobooksService, favoritesService } from '../../services/contentService';
import { getPlaybackPosition, savePlaybackSpeed, getPlaybackSpeed } from '../../services/playbackStorage';
import SpeedControlModal from '../../components/SpeedControlModal';
import SleepTimerModal from '../../components/SleepTimerModal';
import { useApp } from '../../context/AppContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

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

const { width } = Dimensions.get('window');

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

    // Global Audio Context
    const {
        sound,
        isPlaying,
        currentTrack,
        position,
        duration,
        isBuffering,
        loadTrack,
        play,
        pause,
        seekTo,
        skipForward,
        skipBackward
    } = useAudioPlayer();

    const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New features state
    const [isFavorite, setIsFavorite] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
    const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);

    const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Load audiobook metadata
    useEffect(() => {
        const fetchAudiobook = async () => {
            try {
                setLoading(true);
                const data = await audiobooksService.getById(audiobookId);
                if (!data) {
                    setError('Audiolibro no encontrado');
                    return;
                }
                setAudiobook(data);

                // Get saved position for initial load
                const savedPos = await getPlaybackPosition(data.id);
                const initialPos = savedPos ? savedPos.position : 0;

                // Removed auto-load. Track will be loaded on user interaction (Play button).
                // Just ensuring we have the correct cover source for potential loading later.

            } catch (err) {
                console.error('Error loading audiobook:', err);
                setError('Error al cargar el audiolibro');
            } finally {
                setLoading(false);
            }
        };

        if (audiobookId) {
            // If we are already playing THIS track, just use current state, otherwise fetch and load
            if (currentTrack?.id === audiobookId && audiobook === null) {
                // We might need to fetch metadata just for UI labels/favorite status if not passed fully in context
                // But for now let's re-fetch safely to ensure robust UI
                fetchAudiobook();
            } else {
                fetchAudiobook();
            }
        }
    }, [audiobookId]);

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

    // New logic: Only load/play when USER presses play
    const togglePlayback = async () => {
        if (!audiobook) return;

        // Case 1: This track is already loaded in the global player
        if (currentTrack?.id === audiobook.id) {
            if (isPlaying) {
                await pause();
            } else {
                await play();
            }
        }
        // Case 2: Different track (or no track) is loaded. Load this one now.
        else {
            const coverSource = BOOK_COVERS[audiobook.title] || BOOK_COVERS[audiobook.category] || require('../../assets/covers/growth.png');

            // Get saved position
            const savedPos = await getPlaybackPosition(audiobook.id);
            const initialPos = savedPos ? savedPos.position : 0;

            await loadTrack({
                id: audiobook.id,
                title: audiobook.title,
                author: audiobook.author,
                cover: coverSource,
                audioUrl: audiobook.audioUrl || audiobook.audio_url || '', // handling potential property name diffs
                duration: 0
            }, initialPos);

            // Wait a tiny bit for state update if needed, but loadTrack is async so should be good
            await play();
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
                            onPress={togglePlayback}
                            style={styles.playBtn}
                            disabled={loading} // Only disable if fetching metadata
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
                            <Text style={[styles.actionLabel, sleepTimerSeconds ? { color: '#FFA726' } : undefined]}>
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
                onSetTimer={(minutes) => setSleepTimerSeconds(minutes * 60)}
                activeTimer={sleepTimerSeconds}
                onCancelTimer={() => setSleepTimerSeconds(null)}
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
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    artworkWrapper: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        marginTop: 5,
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
        marginTop: 10,
        gap: 4,
        marginBottom: 5,
    },
    titleRow: {
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 2,
    },
    author: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
    },
    narratorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    narrator: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    controlsGlass: {
        width: '100%',
        borderRadius: 28,
        padding: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 15,
        marginBottom: 10,
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
