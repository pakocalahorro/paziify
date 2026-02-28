import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolateColor
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { Svg, Circle } from 'react-native-svg';
import { useSessions, useAudiobooks, useStories, useAcademyModules, useSoundscapes } from '../../hooks/useContent';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import BentoGrid from '../../components/Home/BentoGrid';
import OasisCard from '../../components/Oasis/OasisCard';
import { OasisMeter } from '../../components/Oasis/OasisMeter';
import { analyticsService } from '../../services/analyticsService';
import PurposeModal from '../../components/Home/PurposeModal';
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';
import { CHALLENGES } from '../../constants/challenges';
import { ChallengeDetailsModal } from '../../components/Challenges/ChallengeDetailsModal';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Screen.HOME>;

const formatDifficultyLevel = (level?: string) => {
    if (!level) return undefined;
    const lower = level.toLowerCase();
    if (lower === 'beginner' || lower === 'principiante') return 'Principiante';
    if (lower === 'intermediate' || lower === 'intermedio') return 'Intermedio';
    if (lower === 'advanced' || lower === 'avanzado') return 'Avanzado';
    return level;
};

const HomeScreen: React.FC = ({ navigation: _nav }: any) => {
    const navigation = _nav as HomeScreenNavigationProp;
    const insets = useSafeAreaInsets();
    const route = useRoute<RouteProp<RootStackParamList, Screen.HOME>>();
    const { user, userState, isNightMode, updateUserState } = useApp();

    const [todayStats, setTodayStats] = useState({ minutes: 0, sessionCount: 0 });
    const [weeklyStats, setWeeklyStats] = useState<{ minutes: number; sessionCount: number; activity: { day: string; minutes: number }[] }>({
        minutes: 0,
        sessionCount: 0,
        activity: []
    });

    const visualMode = userState.lifeMode || route.params?.mode || (isNightMode ? 'healing' : 'growth');
    const [greeting, setGreeting] = useState('');
    const [showPurposeModal, setShowPurposeModal] = useState(false);
    const [showChallengeInfo, setShowChallengeInfo] = useState(false);

    // Pulse Animation for CTA
    const pulseScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);

    useEffect(() => {
        if (!userState.activeChallenge) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 1200 }),
                    withTiming(1, { duration: 1200 })
                ),
                -1,
                true
            );
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 1200 }),
                    withTiming(0.4, { duration: 1200 })
                ),
                -1,
                true
            );
        } else {
            pulseScale.value = 1;
            pulseOpacity.value = 0.4;
        }
    }, [userState.activeChallenge]);

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
        borderColor: `rgba(212, 175, 55, ${pulseOpacity.value + 0.1})`,
        shadowOpacity: pulseOpacity.value,
    }));

    // Data Fetching
    const { data: allSessions } = useSessions();
    const { data: allBooks } = useAudiobooks();
    const { data: allStories } = useStories();
    const { data: academyModules } = useAcademyModules();
    const { data: allSoundscapes } = useSoundscapes();

    useFocusEffect(
        useCallback(() => {
            const loadStats = async () => {
                if (user?.id) {
                    const [today, weekly] = await Promise.all([
                        analyticsService.getTodayStats(user.id),
                        analyticsService.getWeeklyActivity(user.id)
                    ]);
                    setTodayStats(today);

                    const totalWeeklyMinutes = weekly.reduce((acc, curr) => acc + curr.minutes, 0);
                    // As we don't have sessionCount by day easily without more queries,
                    // let's estimate or just show minutes for now.
                    setWeeklyStats({
                        minutes: Math.round(totalWeeklyMinutes),
                        sessionCount: weekly.filter(d => d.minutes > 0).length, // Days active
                        activity: weekly
                    });
                }
            };
            loadStats();
        }, [user])
    );

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Buenos días');
        else if (hour < 20) setGreeting('Buenas tardes');
        else setGreeting('Buenas noches');
    }, []);

    // Show Purpose Modal if not accepted yet
    useEffect(() => {
        if (!userState.hasAcceptedMonthlyChallenge && user) {
            const timer = setTimeout(() => {
                setShowPurposeModal(true);
            }, 1500); // Small delay for better UX
            return () => clearTimeout(timer);
        }
    }, [userState.hasAcceptedMonthlyChallenge, user]);

    const handleAcceptChallenge = () => {
        updateUserState({ hasAcceptedMonthlyChallenge: true });
        setShowPurposeModal(false);
        navigation.navigate(Screen.EVOLUTION_CATALOG);
    };

    // Selection Logic for Bento Cards (Recommendations)
    const recommendations = useMemo(() => {
        if (!allSessions || !allBooks || !allStories || !academyModules || !allSoundscapes) return null;

        // 1. Daily Dose: Prioritize Active Challenge Session
        let dailySession = allSessions[0];

        if (userState.activeChallenge) {
            const challengeSession = allSessions.find(s => s.legacy_id === userState.activeChallenge?.currentSessionSlug || s.id === userState.activeChallenge?.currentSessionSlug);
            if (challengeSession) {
                dailySession = challengeSession;
            } else {
                // Fallback to mode-based if challenge session not found
                const targetCats = visualMode === 'healing'
                    ? ['calmasos', 'sueno', 'mindfulness', 'emocional', 'salud', 'kids']
                    : ['resiliencia', 'rendimiento', 'despertar', 'habitos'];
                dailySession = allSessions.find(s => targetCats.includes(s.category as string)) || allSessions[0];
            }
        } else {
            const targetCats = visualMode === 'healing'
                ? ['calmasos', 'sueno', 'mindfulness', 'emocional', 'salud', 'kids']
                : ['resiliencia', 'rendimiento', 'despertar', 'habitos'];
            dailySession = allSessions.find(s => targetCats.includes(s.category as string)) || allSessions[0];
        }

        // 2. Academy: Recommended course (AcademyModule) matching mode
        const academyModule = academyModules.find(m =>
            visualMode === 'healing'
                ? ['basics', 'health', 'sleep', 'family'].includes(m.category || '')
                : ['professional', 'growth', 'anxiety'].includes(m.category || '')
        ) || academyModules[0];

        // 3. Ambient Music (Sounds): Use real soundscapes
        const ambientSound = allSoundscapes.find(s =>
            visualMode === 'healing'
                ? ['relax', 'nature', 'sleep'].some(c => s.name?.toLowerCase().includes(c))
                : ['focus', 'energy', 'creative'].some(c => s.name?.toLowerCase().includes(c))
        ) || allSoundscapes[0];

        // 4. Real Stories: Based on mode
        const realStory = allStories.find(st =>
            visualMode === 'healing'
                ? ['ansiedad', 'duelo', 'salud'].some(c => st.category?.toLowerCase().includes(c))
                : ['growth', 'leadership', 'success', 'superacion'].some(c => st.category?.toLowerCase().includes(c))
        ) || allStories[0];

        // 5. Featured Audiobook
        const featuredBook = allBooks.find(b => b.is_featured) || allBooks[0];

        return {
            daily: dailySession,
            academy: academyModule,
            sounds: ambientSound,
            stories: realStory,
            audiobook: featuredBook
        };
    }, [allSessions, allBooks, allStories, academyModules, allSoundscapes, visualMode, userState.activeChallenge]);

    // 6. Dynamic Background Logic (Vanguard Tier)
    const dynamicBackgroundUri = useMemo(() => {
        // Fallback Master Constants
        const fallbacks = {
            healing: [
                'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_forest.webp',
                'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_temple.webp'
            ],
            growth: [
                'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_cave.webp',
                'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_cosmos.webp'
            ]
        };

        // If the Orb or previous navigation explicitly set a background, use it!
        if (userState.lastSelectedBackgroundUri) {
            return userState.lastSelectedBackgroundUri;
        }

        if (allSessions && allSessions.length > 0) {
            // Target categories map
            const targetCats = visualMode === 'healing'
                ? ['calmasos', 'sueno', 'mindfulness', 'emocional', 'salud', 'kids']
                : ['resiliencia', 'rendimiento', 'despertar', 'habitos'];

            // Find ALL sessions matching the current mega-category with a valid image
            const matchingSessions = allSessions.filter(s =>
                targetCats.includes(s.category as string) &&
                s.thumbnail_url &&
                s.thumbnail_url.startsWith('http')
            );

            if (matchingSessions.length > 0) {
                // Pick a random session from the matching ones to extract its background image
                const randomSession = matchingSessions[Math.floor(Math.random() * matchingSessions.length)];
                return randomSession.thumbnail_url || null;
            }
        }

        // If no sessions match (or still loading), pick a random fallback guaranteed
        const randomFallbackIndex = Math.floor(Math.random() * 2);
        return visualMode === 'healing' ? fallbacks.healing[randomFallbackIndex] : fallbacks.growth[randomFallbackIndex];
    }, [visualMode, allSessions, userState.lastSelectedBackgroundUri]);

    const dailyGoal = userState.dailyGoalMinutes || 20;
    const weeklyGoal = userState.weeklyGoalMinutes || 150;
    const dailyProgress = Math.min(todayStats.minutes / dailyGoal, 1);
    const weeklyProgress = Math.min(weeklyStats.minutes / weeklyGoal, 1);

    console.log('[HomeScreen Debug] visualMode:', visualMode);
    console.log('[HomeScreen Debug] allSessions length:', allSessions?.length);
    console.log('[HomeScreen Debug] dynamicBackgroundUri:', dynamicBackgroundUri);

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="Home"
                    path={["Oasis"]}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState?.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG)}
                    onProfilePress={() => navigation.navigate(Screen.PROFILE)}
                    onAdminPress={() => navigation.navigate(Screen.OASIS_SHOWCASE)}
                    activeChallengeType={userState.activeChallenge?.type as any}
                />
            }
            themeMode={visualMode === 'healing' ? 'healing' : 'growth'}
            remoteImageUri={dynamicBackgroundUri}
            showSafeOverlay={false}
            disableContentPadding={true}
        >
            <StatusBar barStyle="light-content" />

            <View style={{ paddingBottom: insets.bottom + 40 }}>
                <ChallengeDetailsModal
                    visible={showChallengeInfo}
                    challenge={userState.activeChallenge ? CHALLENGES[userState.activeChallenge.id] : null}
                    onClose={() => setShowChallengeInfo(false)}
                    hideActivateButton
                />

                <PurposeModal
                    isVisible={showPurposeModal}
                    onAccept={handleAcceptChallenge}
                    onClose={() => setShowPurposeModal(false)}
                />

                {/* ÁREA 1: TU ESTADO (DASHBOARD COMPACTO) */}
                <View style={styles.dashboardSection}>
                    <View style={styles.dashboardCard}>
                        <BlurView intensity={70} tint="dark" style={styles.dashboardBlur}>
                            <View style={styles.dashboardContent}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <OasisMeter
                                        progress={dailyProgress}
                                        size={70}
                                        label="HOY"
                                        accentColor={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                                    />
                                    <OasisMeter
                                        progress={weeklyProgress}
                                        size={70}
                                        label="SEM"
                                        accentColor={theme.colors.primary}
                                    />
                                </View>
                                <View style={styles.dashboardSeparator} />
                                <View style={[styles.dashboardStats, { justifyContent: 'center', gap: 12, marginLeft: 8 }]}>
                                    <View style={styles.dashboardStatItem}>
                                        <Ionicons name="time" size={18} color={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'} />
                                        <Text style={styles.dashboardStatValue}>
                                            {todayStats.minutes} <Text style={styles.dashboardStatUnit}>m Hoy</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.dashboardStatItem}>
                                        <Ionicons name="stats-chart" size={18} color={theme.colors.primary} />
                                        <Text style={styles.dashboardStatValue}>
                                            {weeklyStats.minutes} <Text style={styles.dashboardStatUnit}>m Sem</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* ACTIVIDAD SEMANAL COMPACTA (DOTS) */}
                            {weeklyStats.activity && weeklyStats.activity.length > 0 && (
                                <View style={styles.weeklyDotsContainer}>
                                    {weeklyStats.activity.map((item, index) => {
                                        const dateObj = new Date(item.day.includes('T') ? item.day : `${item.day}T12:00:00`);
                                        const dayNum = dateObj.getDay().toString();
                                        const dayLabels: Record<string, string> = {
                                            '1': 'L', '2': 'M', '3': 'X', '4': 'J', '5': 'V', '6': 'S', '0': 'D'
                                        };
                                        const label = dayLabels[dayNum] || '';
                                        const isActive = item.minutes > 0;

                                        const today = new Date();
                                        const isToday = dateObj.getDate() === today.getDate() &&
                                            dateObj.getMonth() === today.getMonth() &&
                                            dateObj.getFullYear() === today.getFullYear();

                                        return (
                                            <View key={index} style={styles.dotItem}>
                                                <View style={[
                                                    styles.activityDot,
                                                    isActive ? {
                                                        backgroundColor: visualMode === 'healing' ? '#2DD4BF' : '#FBBF24',
                                                        shadowColor: visualMode === 'healing' ? '#2DD4BF' : '#FBBF24',
                                                        shadowOpacity: 0.6,
                                                        shadowRadius: 4,
                                                        elevation: 3
                                                    } : {
                                                        backgroundColor: 'rgba(255,255,255,0.06)'
                                                    },
                                                    isToday && { borderWidth: 1, borderColor: '#FFF' }
                                                ]} />
                                                <Text style={[
                                                    styles.dotLabel,
                                                    isActive && { color: 'rgba(255,255,255,0.8)' },
                                                    isToday && { color: '#FFF', fontWeight: '900' }
                                                ]}>{label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </BlurView>
                        <View style={styles.innerGlassBorder} pointerEvents="none" />
                    </View>
                </View>

                <SoundwaveSeparator
                    title={userState.activeChallenge ? "Tu misión de hoy" : "Tu práctica de hoy"}
                    accentColor={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                />

                <View style={styles.featuredSection}>
                    <OasisCard
                        superTitle={userState.activeChallenge ? userState.activeChallenge.type : "Meditación"}
                        title={recommendations?.daily?.title || "Cargando..."}
                        subtitle={recommendations?.daily?.description || "Tu sesión recomendada para hoy."}
                        imageUri={(recommendations?.daily as any)?.thumbnail_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"}
                        onPress={() => recommendations?.daily && navigation.navigate(Screen.SESSION_DETAIL, {
                            sessionId: recommendations?.daily?.id,
                            sessionData: recommendations?.daily
                        })}
                        badgeText={(recommendations?.daily as any)?.is_premium ? "PREMIUM" : "LIBRE"}
                        duration={(recommendations?.daily as any)?.duration_minutes ? `${(recommendations?.daily as any).duration_minutes} min` : undefined}
                        level={formatDifficultyLevel((recommendations?.daily as any)?.difficulty_level)}
                        variant="default"
                        accentColor={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                        actionText="Comenzar"
                        actionIcon="play"
                    />
                </View>
            </View>

            {/* ÁREA 3: ARSENAL TERAPÉUTICO (BENTO GRID UNIFICADO) */}
            <View style={{ paddingBottom: 40, width: '100%', marginTop: -20 }}>
                <SoundwaveSeparator
                    title="Consejos del día"
                    accentColor={visualMode === 'healing' ? '#8B5CF6' : '#2DD4BF'}
                />

                <View style={styles.gridSection}>
                    {/* 1. ACADEMIA PAZIIFY (Bento Wide Top) */}
                    {/* Title Above */}
                    <View style={{ marginBottom: 24 }}>
                        <OasisCard
                            superTitle="Academia"
                            title={recommendations?.academy?.title || "Manejo del Estrés"}
                            subtitle={recommendations?.academy?.description || "Aprende herramientas cognitivas."}
                            imageUri={(recommendations?.academy as any)?.image || "https://images.unsplash.com/photo-1434031211b08-39916fcad442?w=800"}
                            onPress={() => recommendations?.academy && navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                                courseId: recommendations?.academy?.id || '',
                                courseData: recommendations?.academy
                            })}
                            badgeText="CURSO"
                            variant="default"
                            accentColor="#A855F7"
                            actionText="Ver"
                            actionIcon="school"
                        />
                    </View>

                    {/* 2. Audiolibros - Hero Card */}
                    {/* Title Above */}
                    <View style={{ marginBottom: 24 }}>
                        <OasisCard
                            superTitle="Audiolibro"
                            title={recommendations?.audiobook?.title || "El poder del Ahora"}
                            subtitle={recommendations?.audiobook?.author || "Eckhart Tolle"}
                            imageUri={(recommendations?.audiobook as any)?.image_url || 'https://paziify.app/placeholder-audiobook.jpg'}
                            onPress={() => recommendations?.audiobook && navigation.navigate(Screen.AUDIOBOOK_PLAYER, {
                                audiobookId: recommendations?.audiobook?.id || '',
                                audiobook: recommendations?.audiobook
                            })}
                            badgeText="AUDIOLIBRO"
                            duration={(recommendations?.audiobook as any)?.duration_minutes ? `${(recommendations?.audiobook as any).duration_minutes} min` : undefined}
                            variant="default"
                            accentColor={theme.colors.primary}
                            actionText="Oír"
                            actionIcon="headset"
                        />
                    </View>

                    {/* 3. Historias (Silhouette Card) */}
                    {/* Title Above */}
                    <View style={{ marginBottom: 24 }}>
                        <OasisCard
                            superTitle="Relato"
                            title={recommendations?.stories?.title || "Elías y el Mar"}
                            subtitle={"Una historia real de superación personal."}
                            imageUri="https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/true_stories_background.webp"
                            onPress={() => recommendations?.stories && navigation.navigate(Screen.STORY_DETAIL, {
                                storyId: recommendations?.stories?.id || '',
                                story: recommendations?.stories
                            })}
                            badgeText="RELATO"
                            duration={(recommendations?.stories as any)?.reading_time_minutes ? `${(recommendations?.stories as any).reading_time_minutes} min` : undefined}
                            variant="default"
                            accentColor="#38BDF8"
                            actionText="Leer"
                            actionIcon="book"
                        />
                    </View>

                    {/* 4. Sonidos (Literal Vinyl Player) */}
                    <View style={{ marginBottom: 16 }}>
                        <OasisCard
                            superTitle="Música ambiente"
                            title={recommendations?.sounds?.title || "Frecuencia de Sanación"}
                            subtitle="Sonidos inmersivos para tu práctica."
                            imageUri={recommendations?.sounds?.image_url || recommendations?.sounds?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"}
                            onPress={() => recommendations?.sounds && navigation.navigate(Screen.BACKGROUND_PLAYER, {
                                soundscapeId: recommendations.sounds.id,
                                soundscape: recommendations.sounds
                            })}
                            badgeText="SONIDO"
                            variant="default"
                            accentColor="#10B981"
                            actionText="Oír"
                            actionIcon="musical-notes"
                        />
                    </View>
                </View>
            </View>
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        // paddingBottom moved to inline for dynamic insets
    },
    safeHeaderBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(2, 6, 23, 0.5)', // Added base opacity
    },
    headerFullWidth: {
        width: '100%',
        marginBottom: 24,
    },
    headerFullWidthGlass: {
        width: '100%',
        overflow: 'hidden',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(255,255,255,0.15)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(2, 6, 23, 0.25)',
    },
    headerInnerTint: {
        ...StyleSheet.absoluteFillObject,
    },
    headerContent: {
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    retoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.25)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(212, 175, 55, 0.5)',
        gap: 6,
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    userProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 22,
        color: '#FFF',
        flex: 1,
        fontFamily: 'Caveat_700Bold',
    },
    dashboardSection: {
        width: '100%',
        paddingHorizontal: 0,
        marginBottom: 32,
    },
    dashboardCard: {
        width: width - 40,
        alignSelf: 'center',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    dashboardBlur: {
        padding: 16,
    },
    dashboardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dashboardZen: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardSeparator: {
        width: 1,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 16,
    },
    dashboardStats: {
        flex: 1,
        justifyContent: 'space-around',
    },
    dashboardStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dashboardStatValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        marginLeft: 8,
    },
    dashboardStatUnit: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    dashboardStatLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
        marginLeft: 8,
        flex: 1,
        textAlign: 'right',
    },
    weeklyDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
    },
    dotItem: {
        alignItems: 'center',
        gap: 6,
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.3)',
    },
    innerGlassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        borderTopColor: 'rgba(255,255,255,0.25)',
        borderLeftColor: 'rgba(255,255,255,0.18)',
    },
    statsSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    statsLabels: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    gridSection: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    featuredSection: {
        width: '100%',
        paddingHorizontal: 20,
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        fontSize: 12,
        color: '#2DD4BF',
        fontWeight: '700',
        marginRight: 4,
    },
    featuredCardWrapper: {
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderRadius: 24,
    },
    featuredCard: {
        height: 200, // Slightly taller for more presence
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    featuredInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderTopColor: 'rgba(255,255,255,0.35)',
        borderLeftColor: 'rgba(255,255,255,0.2)',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredInfo: {
        ...StyleSheet.absoluteFillObject,
        padding: 20,
        justifyContent: 'flex-end',
    },
    heroBadgeContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20, // Circular/Pill
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    badgeBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 6,
    },
    badgeIconStyle: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    retoButtonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    dayText: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
    },
    challengeTitle: {
        fontSize: 22,
        color: '#FFF',
        marginTop: -2,
    },
    ringOverlay: {
        position: 'absolute',
        top: -4,
        left: -4,
        zIndex: 1,
    },
    progressLineContainer: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressLine: {
        height: '100%',
        borderRadius: 1,
    },
});

export default HomeScreen;
