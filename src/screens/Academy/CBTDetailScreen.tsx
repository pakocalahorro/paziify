import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { Audio } from 'expo-av';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ACADEMY_LESSONS, Lesson } from '../../data/academyData';
import { AcademyService } from '../../services/AcademyService';
import CacheService from '../../services/CacheService';

type CBTDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.CBT_DETAIL
>;

type CBTDetailScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.CBT_DETAIL
>;

interface Props {
    navigation: CBTDetailScreenNavigationProp;
    route: CBTDetailScreenRouteProp;
}

const CBTDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { lessonId } = route.params;
    const { userState, updateUserState } = useApp();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoadingLesson, setIsLoadingLesson] = useState(true);

    // Audio State
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await AcademyService.getLessonById(lessonId);
                setLesson(data);
            } catch (error) {
                console.error("Error fetching lesson:", error);
            } finally {
                setIsLoadingLesson(false);
            }
        };
        fetchLesson();
    }, [lessonId]);

    // Unload sound on unmount or new lesson
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Load sound when audio_url is available
    useEffect(() => {
        const loadAudio = async () => {
            if (lesson?.audio_url) {
                try {
                    setIsLoadingAudio(true);

                    // Resolve local path from Cache (Zero-Egress)
                    // lesson.audio_url can be a string (URL) or an object (require)
                    const audioSource = typeof lesson.audio_url === 'string'
                        ? { uri: await CacheService.get(lesson.audio_url, 'audio') }
                        : lesson.audio_url;

                    const { sound: newSound } = await Audio.Sound.createAsync(
                        audioSource,
                        { shouldPlay: false }
                    );
                    // Setup callback for playback ended
                    newSound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            setIsPlaying(false);
                            newSound.setPositionAsync(0); // Reset to start
                        }
                    });
                    setSound(newSound);
                } catch (error) {
                    console.error("[CBTDetail] Critical Error loading sound:", error);
                    console.log("[CBTDetail] Problematic URL:", lesson.audio_url);
                    setIsPlaying(false);
                } finally {
                    setIsLoadingAudio(false);
                }
            }
        };

        loadAudio();
    }, [lesson?.audio_url]);


    const handlePlayPause = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };


    if (isLoadingLesson) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: 'white', marginTop: 20 }}>Cargando lección...</Text>
            </View>
        );
    }

    if (!lesson) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lección no encontrada</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isCompleted = userState.completedLessons?.includes(lessonId);

    const handleComplete = () => {
        if (!isCompleted) {
            const currentCompleted = userState.completedLessons || [];
            updateUserState({
                completedLessons: [...currentCompleted, lessonId],
                resilienceScore: Math.min(userState.resilienceScore + 5, 100),
            });
        }
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
                    <Text style={styles.headerSubtitle}>{lesson.duration}</Text>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={22} color={theme.colors.textMuted} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Audio Player Section */}
                {lesson.audio_url && (
                    <View style={styles.audioPlayerContainer}>
                        <View style={styles.audioIconContainer}>
                            <Ionicons name="headset" size={32} color={theme.colors.primary} />
                        </View>
                        <View style={styles.audioControls}>
                            <Text style={styles.audioLabel}>Escuchar Lección</Text>
                            <Text style={styles.audioSubLabel}>{lesson.duration} • Voz de Aria</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={handlePlayPause}
                            disabled={isLoadingAudio}
                        >
                            {isLoadingAudio ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={24}
                                    color="#FFF"
                                    style={{ marginLeft: isPlaying ? 0 : 2 }} // Optic center
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                <Markdown style={markdownStyles}>
                    {lesson.content.trim()}
                </Markdown>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.completeButton, isCompleted && styles.completedButton]}
                        onPress={handleComplete}
                    >
                        <Text style={styles.buttonText}>
                            {isCompleted ? 'Lección Completada' : 'Marcar como Terminada'}
                        </Text>
                        {!isCompleted && (
                            <Text style={styles.rewardText}>+5 resiliencia</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const markdownStyles: any = {
    body: {
        color: theme.colors.textMain,
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        color: theme.colors.textMain,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
    },
    heading2: {
        color: theme.colors.textMain,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 24,
    },
    paragraph: {
        marginBottom: 16,
    },
    strong: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    blockquote: {
        backgroundColor: 'rgba(74, 103, 65, 0.1)',
        borderLeftColor: theme.colors.primary,
        borderLeftWidth: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 16,
        borderRadius: 4,
    },
    bullet_list: {
        marginBottom: 16,
    },
    list_item: {
        marginBottom: 8,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerInfo: {
        flex: 1,
        marginHorizontal: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    headerSubtitle: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    shareButton: {
        padding: 4,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    audioPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    audioIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(74, 103, 65, 0.2)', // Primary with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    audioControls: {
        flex: 1,
    },
    audioLabel: {
        color: theme.colors.textMain,
        fontWeight: '700',
        fontSize: 16,
    },
    audioSubLabel: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    footer: {
        marginTop: theme.spacing.xxl,
        marginBottom: theme.spacing.xl,
    },
    completeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    rewardText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    errorText: {
        color: theme.colors.textMain,
        fontSize: 18,
    },
    backLink: {
        color: theme.colors.primary,
        marginTop: 16,
        fontSize: 16,
    },
});

export default CBTDetailScreen;
