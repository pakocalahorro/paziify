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
import StatsCard from '../../components/Home/StatsCard';
import OasisCard from '../../components/Oasis/OasisCard';
import { analyticsService } from '../../services/analyticsService';
import PurposeModal from '../../components/Home/PurposeModal';
import SoundWaveHeader from '../../components/SoundWaveHeader';
import { CHALLENGES } from '../../constants/challenges';
import { ChallengeDetailsModal } from '../../components/Challenges/ChallengeDetailsModal';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Screen.HOME>;

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <BackgroundWrapper
                nebulaMode={visualMode === 'healing' ? 'healing' : 'growth'}
                remoteImageUri={dynamicBackgroundUri}
            />

            {/* BARRA DE CRISTAL FIJA (TOP SAFE AREA) */}
            <BlurView
                intensity={90}
                tint="dark"
                style={[styles.safeHeaderBlur, { height: insets.top }]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 100 }]}
            >
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
                {/* HEADER... (mantener igual) */}
                {userState.activeChallenge ? (
                    <View style={styles.headerFullWidth}>
                        <BlurView
                            intensity={80}
                            tint="dark"
                            style={styles.headerFullWidthGlass}
                        >
                            {/* Glass Reflection Shimmer */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />

                            {/* "Verde Clarito" Base Tint */}
                            <View style={[
                                styles.headerInnerTint,
                                { backgroundColor: 'rgba(45, 212, 191, 0.18)' }
                            ]} />

                            <View style={styles.headerContent}>
                                <View style={styles.greetingRow}>
                                    <View>
                                        <Text style={styles.dayText}>DÍA {(userState.activeChallenge.daysCompleted || 0) + 1}</Text>
                                        <Text style={[styles.challengeTitle, { fontFamily: 'Caveat_700Bold' }]}>
                                            {userState.activeChallenge.title}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity
                                            style={[styles.retoButton, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}
                                            onPress={() => setShowChallengeInfo(true)}
                                        >
                                            <Ionicons name="information-circle-outline" size={18} color="#FFF" />
                                        </TouchableOpacity>

                                        {/* Hidden Showcase Button for Dev Testing */}
                                        <TouchableOpacity
                                            style={[styles.retoButton, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}
                                            onPress={() => navigation.navigate(Screen.OASIS_SHOWCASE as any)}
                                        >
                                            <Ionicons name="color-palette-outline" size={18} color="#2DD4BF" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.retoButton}
                                            onPress={() => navigation.navigate(Screen.PROFILE as any)}
                                        >
                                            <Ionicons name="checkmark-circle" size={14} color="#FFF" />
                                            <Text style={styles.retoButtonText}>PROGRESO</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.userProfileRow}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate(Screen.PROFILE as any)}
                                        style={styles.avatarContainer}
                                    >
                                        <View style={styles.ringOverlay}>
                                            <Svg width={54} height={54} viewBox="0 0 54 54">
                                                <Circle
                                                    cx="27"
                                                    cy="27"
                                                    r="25"
                                                    stroke="rgba(255,255,255,0.1)"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                                <Circle
                                                    cx="27"
                                                    cy="27"
                                                    r="25"
                                                    stroke={
                                                        userState.activeChallenge.type === 'desafio' ? '#6366F1' :
                                                            userState.activeChallenge.type === 'reto' ? '#2DD4BF' : '#EF4444'
                                                    }
                                                    strokeWidth="3"
                                                    strokeDasharray={`${2 * Math.PI * 25}`}
                                                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - (userState.activeChallenge.daysCompleted / userState.activeChallenge.totalDays))}`}
                                                    strokeLinecap="round"
                                                    fill="none"
                                                    transform="rotate(-90 27 27)"
                                                />
                                            </Svg>
                                        </View>
                                        <Image
                                            source={{ uri: userState.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                                            style={styles.avatar}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.userName} numberOfLines={1}>{userState.name || 'Pazificador'}</Text>
                                </View>

                                <View style={styles.progressLineContainer}>
                                    <LinearGradient
                                        colors={[
                                            userState.activeChallenge.type === 'desafio' ? '#6366F1' :
                                                userState.activeChallenge.type === 'reto' ? '#2DD4BF' : '#EF4444',
                                            'transparent'
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[
                                            styles.progressLine,
                                            { width: `${(userState.activeChallenge.daysCompleted / userState.activeChallenge.totalDays) * 100}%` }
                                        ]}
                                    />
                                </View>
                            </View>
                        </BlurView>
                    </View>
                ) : (
                    <View style={styles.header}>
                        <View style={styles.greetingRow}>
                            <Text style={styles.greeting}>{greeting}</Text>
                            <Animated.View style={animatedButtonStyle}>
                                <TouchableOpacity
                                    style={styles.retoButton}
                                    onPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG)}
                                >
                                    <Ionicons name="sparkles-outline" size={14} color="#FFF" />
                                    <Text style={styles.retoButtonText}>ACTIVA TU EVOLUCIÓN</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Hidden Showcase Button for Dev Testing */}
                            <TouchableOpacity
                                style={[styles.retoButton, { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 8 }]}
                                onPress={() => navigation.navigate(Screen.OASIS_SHOWCASE as any)}
                            >
                                <Ionicons name="color-palette-outline" size={20} color="#2DD4BF" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userProfileRow}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(Screen.PROFILE as any)}
                                style={styles.avatarContainer}
                            >
                                <Image
                                    source={{ uri: userState.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                                    style={styles.avatar}
                                />
                            </TouchableOpacity>
                            <Text style={styles.userName} numberOfLines={1}>{userState.name || 'Pazificador'}</Text>
                        </View>
                    </View>
                )}

                {/* ÁREA 1: TU ESTADO (DASHBOARD COMPACTO) */}
                <View style={styles.dashboardSection}>
                    <View style={styles.dashboardCard}>
                        <BlurView intensity={70} tint="dark" style={styles.dashboardBlur}>
                            <View style={styles.dashboardContent}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>{Math.round(dailyProgress * 100)}%</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1 }}>HOY</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>{Math.round(weeklyProgress * 100)}%</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1 }}>SEM</Text>
                                    </View>
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

                {/* ÁREA 2: FOCO PRINCIPAL (HERO CARD DE DOSIS DIARIA) */}
                <View style={{ marginBottom: 32 }}>
                    <SoundWaveHeader
                        title={userState.activeChallenge ? "Tu misión de hoy" : "Tu práctica de hoy"}
                        accentColor={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                    />

                    <View style={styles.featuredSection}>
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: '#A0AEC0', marginBottom: -8 }}>
                                {userState.activeChallenge ? userState.activeChallenge.type.toUpperCase() : "Meditación"}
                            </Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.daily?.title || "Cargando..."}
                            </Text>
                        </View>

                        <View style={[styles.featuredCardWrapper, { shadowColor: visualMode === 'healing' ? '#2DD4BF' : '#FBBF24' }]}>
                            <TouchableOpacity
                                style={styles.featuredCard}
                                activeOpacity={0.9}
                                onPress={() => recommendations?.daily && navigation.navigate(Screen.SESSION_DETAIL, {
                                    sessionId: recommendations.daily.id,
                                    sessionData: recommendations.daily
                                })}
                            >
                                <Image
                                    source={{ uri: typeof recommendations?.daily?.thumbnail_url === 'string' ? recommendations.daily.thumbnail_url : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" }}
                                    style={styles.featuredImage}
                                    transition={500}
                                    cachePolicy="memory-disk"
                                />
                                <LinearGradient
                                    colors={visualMode === 'healing'
                                        ? ['rgba(0,0,0,0.0)', 'rgba(2, 6, 23, 0.4)', 'rgba(15, 23, 42, 0.95)']
                                        : ['rgba(0,0,0,0.0)', 'rgba(9, 9, 11, 0.5)', 'rgba(217, 119, 6, 0.85)']}
                                    style={styles.featuredOverlay}
                                />
                                <View style={[styles.featuredInnerBorder, { borderRadius: 24 }]} pointerEvents="none" />

                                {/* Info inside card -> Centered content */}
                                <View style={[styles.featuredInfo, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <Ionicons name="play" size={24} color="#FFF" style={{ marginRight: 10, marginLeft: 6 }} />
                                        <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase' }}>Comenzar</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Subtitle Below */}
                        <Text style={[styles.featuredSubtitle, { textAlign: 'left', marginTop: 16, paddingHorizontal: 4, opacity: 0.8 }]} numberOfLines={2}>
                            {recommendations?.daily?.description || "Tu sesión recomendada para hoy."}
                        </Text>
                    </View>
                </View>

                {/* ÁREA 3: ARSENAL TERAPÉUTICO (BENTO GRID UNIFICADO) */}
                <View style={{ paddingBottom: 40 }}>
                    <SoundWaveHeader
                        title="Consejos del día"
                        accentColor={visualMode === 'healing' ? '#8B5CF6' : '#2DD4BF'}
                    />

                    <View style={styles.gridSection}>
                        {/* 1. ACADEMIA PAZIIFY (Bento Wide Top) */}
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: '#A855F7', marginBottom: -8 }}>Curso</Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.academy?.title || "Manejo del Estrés"}
                            </Text>
                        </View>

                        <View style={[styles.featuredCardWrapper, { shadowColor: '#A855F7' }]}>
                            <TouchableOpacity
                                style={styles.featuredCard}
                                activeOpacity={0.9}
                                onPress={() => recommendations?.academy && navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                                    courseId: recommendations.academy.id,
                                    courseData: recommendations.academy
                                })}
                            >
                                <Image
                                    source={{ uri: typeof recommendations?.academy?.image === 'string' ? recommendations.academy.image : "https://images.unsplash.com/photo-1434031211b08-39916fcad442?w=800" }}
                                    style={styles.featuredImage}
                                    transition={500}
                                    cachePolicy="memory-disk"
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)', 'rgba(67, 20, 119, 0.9)']}
                                    style={styles.featuredOverlay}
                                />
                                <View style={styles.featuredInnerBorder} pointerEvents="none" />

                                {/* Info inside card -> Centered content */}
                                <View style={[styles.featuredInfo, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <View style={{ marginBottom: 16, overflow: 'hidden', borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <BlurView intensity={50} tint="light" style={[styles.badgeBlur, { paddingHorizontal: 16, paddingVertical: 8 }]}>
                                            <Ionicons name="school-outline" size={14} color="#FFFFFF" style={styles.badgeIconStyle} />
                                            <Text style={[styles.badgeText, { fontSize: 10 }]}>FORMACIÓN</Text>
                                        </BlurView>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <Ionicons name="play" size={24} color="#FFF" style={{ marginRight: 10, marginLeft: 6 }} />
                                        <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase' }}>Accede al curso</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Subtitle Below */}
                        <Text style={[styles.featuredSubtitle, { textAlign: 'left', marginTop: 16, marginBottom: 32, paddingHorizontal: 4, opacity: 0.8 }]} numberOfLines={2}>
                            {recommendations?.academy?.description || "Aprende herramientas cognitivas."}
                        </Text>

                        {/* 2. Audiolibros - Hero Card */}
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: theme.colors.primary, marginBottom: -8 }}>Audiolibro</Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.audiobook?.title || "El poder del Ahora"}
                            </Text>
                        </View>

                        <View style={[styles.featuredCardWrapper, { shadowColor: theme.colors.primary }]}>
                            <TouchableOpacity
                                style={styles.featuredCard}
                                activeOpacity={0.9}
                                onPress={() => recommendations?.audiobook && navigation.navigate(Screen.AUDIOBOOK_PLAYER, {
                                    audiobookId: recommendations.audiobook.id,
                                    audiobook: recommendations.audiobook
                                })}
                            >
                                <Image
                                    source={{ uri: recommendations?.audiobook?.image_url || 'https://paziify.app/placeholder-audiobook.jpg' }}
                                    style={styles.featuredImage}
                                    transition={500}
                                    cachePolicy="memory-disk"
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)', `rgba(2, 6, 23, 0.95)`]}
                                    style={styles.featuredOverlay}
                                />
                                <View style={styles.featuredInnerBorder} pointerEvents="none" />

                                {/* Info inside card -> Centered content */}
                                <View style={[styles.featuredInfo, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <View style={{ marginBottom: 16, overflow: 'hidden', borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <BlurView intensity={50} tint="light" style={[styles.badgeBlur, { paddingHorizontal: 16, paddingVertical: 8 }]}>
                                            <Ionicons name="headset-outline" size={14} color="#FFFFFF" style={styles.badgeIconStyle} />
                                            <Text style={[styles.badgeText, { fontSize: 10 }]}>AUDIOLIBRO</Text>
                                        </BlurView>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <Ionicons name="play" size={24} color="#FFF" style={{ marginRight: 10, marginLeft: 6 }} />
                                        <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase' }}>Accede al audiolibro</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Subtitle Below */}
                        <Text style={[styles.featuredSubtitle, { textAlign: 'left', marginTop: 16, marginBottom: 32, paddingHorizontal: 4, opacity: 0.8 }]} numberOfLines={2}>
                            {recommendations?.audiobook?.author || "Eckhart Tolle"}
                        </Text>

                        {/* 3. Historias (Silhouette Card) */}
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: '#38BDF8', marginBottom: -8 }}>Relato</Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.stories?.title || "Elías y el Mar"}
                            </Text>
                        </View>

                        <View style={[styles.featuredCardWrapper, { shadowColor: '#38BDF8' }]}>
                            <TouchableOpacity
                                style={styles.featuredCard}
                                activeOpacity={0.9}
                                onPress={() => recommendations?.stories && navigation.navigate(Screen.STORY_DETAIL, {
                                    storyId: recommendations.stories.id,
                                    story: recommendations.stories
                                })}
                            >
                                <Image
                                    source={{ uri: "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/true_stories_background.webp" }}
                                    style={styles.featuredImage}
                                    transition={500}
                                    cachePolicy="memory-disk"
                                />
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                                    style={styles.featuredOverlay}
                                />
                                <View style={styles.featuredInnerBorder} pointerEvents="none" />

                                {/* Info inside card -> Centered content */}
                                <View style={[styles.featuredInfo, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <View style={{ marginBottom: 16, overflow: 'hidden', borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <BlurView intensity={50} tint="light" style={[styles.badgeBlur, { paddingHorizontal: 16, paddingVertical: 8 }]}>
                                            <Ionicons name="book-outline" size={14} color="#FFFFFF" style={styles.badgeIconStyle} />
                                            <Text style={[styles.badgeText, { fontSize: 10 }]}>RELATO</Text>
                                        </BlurView>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }}>
                                        <Ionicons name="play" size={24} color="#FFF" style={{ marginRight: 10, marginLeft: 6 }} />
                                        <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1.5, textTransform: 'uppercase' }}>Leer relato</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Subtitle Below */}
                        <Text style={[styles.featuredSubtitle, { textAlign: 'left', marginTop: 16, marginBottom: 32, paddingHorizontal: 4, opacity: 0.8 }]} numberOfLines={2}>
                            {"Una historia real de superación personal."}
                        </Text>

                        {/* 4. Sonidos (Literal Vinyl Player) */}
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: '#10B981', marginBottom: -8 }}>Música ambiente</Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.sounds?.title || "Frecuencia de Sanación"}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <OasisCard
                                superTitle="SONIDO"
                                title=""
                                subtitle="Música ambiente"
                                imageUri={recommendations?.sounds?.image_url || recommendations?.sounds?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"}
                                onPress={() => recommendations?.sounds && navigation.navigate(Screen.BACKGROUND_PLAYER, {
                                    soundscapeId: recommendations.sounds.id,
                                    soundscape: recommendations.sounds
                                })}
                                icon="play-circle"
                                badgeText="SONIDO"
                                actionText="Escuchar"
                                actionIcon="play"
                                variant="hero"
                                accentColor="#10B981"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    // NUEVOS ESTILOS DASHBOARD COMPACTO
    dashboardSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    dashboardCard: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(2, 6, 23, 0.4)', // Darker base color for better contrast
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
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
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    featuredSection: {
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
    featuredTitle: {
        fontSize: 24,
        fontFamily: 'Outfit_900Black',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -1,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    featuredSubtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: 'rgba(255,255,255,0.7)',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});

export default HomeScreen;
