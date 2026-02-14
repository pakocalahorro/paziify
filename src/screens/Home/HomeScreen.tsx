import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useSessions, useAudiobooks, useStories, useAcademyModules, useSoundscapes } from '../../hooks/useContent';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import BentoGrid from '../../components/Home/BentoGrid';
import BentoCard from '../../components/Home/BentoCard';
import ZenMeter from '../../components/Home/ZenMeter';
import StatsCard from '../../components/Home/StatsCard';
import WeeklyChart from '../../components/Home/WeeklyChart';
import { analyticsService } from '../../services/analyticsService';
import PurposeModal from '../../components/Home/PurposeModal';

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
    };

    // Selection Logic for Bento Cards (Recommendations)
    const recommendations = useMemo(() => {
        if (!allSessions || !allBooks || !allStories || !academyModules || !allSoundscapes) return null;

        // 1. Daily Dose: Find first session of preferred category based on mode
        const targetCats = visualMode === 'healing'
            ? ['calmasos', 'sueno', 'mindfulness', 'emocional', 'salud', 'kids']
            : ['resiliencia', 'rendimiento', 'despertar', 'habitos'];

        const dailySession = allSessions.find(s => targetCats.includes(s.category as string)) || allSessions[0];

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
    }, [allSessions, allBooks, allStories, academyModules, allSoundscapes, visualMode]);

    const dailyGoal = userState.dailyGoalMinutes || 20;
    const weeklyGoal = userState.weeklyGoalMinutes || 150;
    const dailyProgress = Math.min(todayStats.minutes / dailyGoal, 1);
    const weeklyProgress = Math.min(weeklyStats.minutes / weeklyGoal, 1);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <BackgroundWrapper nebulaMode={visualMode === 'healing' ? 'healing' : 'growth'} />

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
                <PurposeModal
                    isVisible={showPurposeModal}
                    onAccept={handleAcceptChallenge}
                    onClose={() => setShowPurposeModal(false)}
                />
                {/* HEADER... (mantener igual) */}
                <View style={styles.header}>
                    <View style={styles.greetingRow}>
                        <Text style={styles.greeting}>{greeting}</Text>
                        <TouchableOpacity
                            style={styles.retoButton}
                            onPress={() => {
                                if (userState.hasAcceptedMonthlyChallenge) {
                                    navigation.navigate(Screen.PROFILE as any);
                                } else {
                                    setShowPurposeModal(true);
                                }
                            }}
                        >
                            <Ionicons
                                name={userState.hasAcceptedMonthlyChallenge ? "checkmark-circle" : "sparkles-outline"}
                                size={14}
                                color="#FFF"
                            />
                            <Text style={styles.retoButtonText}>
                                {userState.hasAcceptedMonthlyChallenge ? "Reto Activado" : "Reto Paziify"}
                            </Text>
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

                {/* CAPA 1: DOBLE ZENMETER (HOY Y SEMANA) */}
                <View style={styles.dualZenSection}>
                    <View style={styles.zenContainer}>
                        <ZenMeter progress={dailyProgress} size={110} label="HOY" />
                    </View>
                    <View style={styles.zenContainer}>
                        <ZenMeter progress={weeklyProgress} size={110} label="SEMANA" />
                    </View>
                </View>

                {/* CAPA 2: LOGRO (RESUMEN CRISTAL) */}
                <View style={styles.statsRow}>
                    <StatsCard
                        title="HOY"
                        value={todayStats.minutes}
                        unit="min"
                        icon="time"
                        color={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                    />
                    <StatsCard
                        title="ESTA SEMANA"
                        value={weeklyStats.minutes}
                        unit="min"
                        icon="stats-chart"
                        color={theme.colors.primary}
                    />
                </View>

                {/* CAPA 3: EL RITMO (GRÁFICO) */}
                <View style={styles.rhythmSection}>
                    <WeeklyChart
                        data={weeklyStats.activity}
                        color={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                    />
                </View>

                {/* BENTO GRID 3.0 */}
                <View style={styles.gridSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>RECOMENDACIONES PAZIIFY</Text>
                    </View>
                    <BentoGrid>
                        {/* Dosis Diaria - Large Card */}
                        <BentoCard
                            title="DOSIS DIARIA"
                            subtitle={recommendations?.daily?.title || "Cargando..."}
                            variant="large"
                            icon="sparkles"
                            ctaText="Entrar ahora"
                            backgroundImage={recommendations?.daily?.thumbnail_url || require('../../assets/meditation/webp-optimized/resiliencia_tecnica_010_base_v2_1770219645522.webp')}
                            onPress={() => recommendations?.daily && navigation.navigate(Screen.SESSION_DETAIL, {
                                sessionId: recommendations.daily.id,
                                sessionData: recommendations.daily
                            })}
                        >
                            <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                <BlurView intensity={40} tint="light" style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                                    <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>TU GUÍA</Text>
                                </BlurView>
                            </View>
                        </BentoCard>

                        {/* Stories -> HISTORIAS (Real Story) IN BENTO */}
                        <BentoCard
                            title="HISTORIAS"
                            subtitle={recommendations?.stories?.title || "Relatos que inspiran"}
                            icon="book"
                            largeIcon={true}
                            variant="medium"
                            backgroundImage={recommendations?.stories?.thumbnail_url || require('../../assets/meditation/webp-optimized/resiliencia_eter_090_la-ciudadela-interior.webp')}
                            onPress={() => recommendations?.stories && navigation.navigate(Screen.STORY_DETAIL, {
                                storyId: recommendations.stories.id,
                                story: recommendations.stories
                            })}
                        />

                        {/* Sounds -> MÚSICA AMBIENTAL */}
                        <BentoCard
                            title="MÚSICA AMBIENTAL"
                            subtitle={recommendations?.sounds?.name || "Sintonía Delta"}
                            icon="play"
                            largeIcon={true}
                            variant="medium"
                            backgroundImage={recommendations?.sounds?.image_url || recommendations?.sounds?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"}
                            onPress={() => recommendations?.sounds && navigation.navigate(Screen.BACKGROUND_PLAYER, {
                                soundscapeId: recommendations.sounds.id,
                                soundscape: recommendations.sounds
                            })}
                        />
                    </BentoGrid>
                </View>

                {/* ACADEMIA PAZIIFY SECTION */}
                <View style={styles.featuredSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>ACADEMIA PAZIIFY</Text>
                        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate(Screen.CBT_ACADEMY as any)}>
                            <Text style={styles.seeAllText}>Entrar</Text>
                            <Ionicons name="chevron-forward" size={14} color="#2DD4BF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.featuredCard}
                        onPress={() => recommendations?.academy && navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                            courseId: recommendations.academy.id,
                            courseData: recommendations.academy
                        })}
                    >
                        <Image
                            source={{ uri: typeof recommendations?.academy?.image === 'string' ? recommendations.academy.image : "https://images.unsplash.com/photo-1434031211b08-39916fcad442?w=800" }}
                            style={styles.featuredImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredOverlay}
                        />
                        <View style={styles.featuredInfo}>
                            <View style={[styles.categoryTag, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                                <Text style={[styles.categoryTagText, { color: '#A855F7' }]}>CURSO RECOMENDADO</Text>
                            </View>
                            <Text style={styles.featuredTitle}>{recommendations?.academy?.title || "Manejo del Estrés"}</Text>
                            <Text style={styles.featuredSubtitle}>{recommendations?.academy?.description || "Aprende herramientas cognitivas."}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Audiobooks Section */}
                <View style={[styles.featuredSection, { marginTop: 30 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AUDIOLIBROS DESTACADOS</Text>
                        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Library' as any)}>
                            <Text style={styles.seeAllText}>Ver todo</Text>
                            <Ionicons name="chevron-forward" size={14} color="#2DD4BF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.featuredCard}
                        onPress={() => recommendations?.audiobook && navigation.navigate(Screen.AUDIOBOOK_PLAYER, {
                            audiobookId: recommendations.audiobook.id,
                            audiobook: recommendations.audiobook
                        })}
                    >
                        <Image
                            source={{ uri: recommendations?.audiobook?.image_url || 'https://paziify.app/placeholder-audiobook.jpg' }} // Fallback for audiobook cover
                            style={styles.featuredImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.featuredOverlay}
                        />
                        <View style={styles.featuredInfo}>
                            <View style={styles.categoryTag}>
                                <Text style={styles.categoryTagText}>RECOMENDADO</Text>
                            </View>
                            <Text style={styles.featuredTitle}>{recommendations?.audiobook?.title || "La Mente en Calma"}</Text>
                            <Text style={styles.featuredSubtitle}>{recommendations?.audiobook?.author || "Paziify"}</Text>
                        </View>
                    </TouchableOpacity>
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
    retoButtonText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        flex: 1,
    },
    dualZenSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    zenContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    rhythmSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
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
    featuredCard: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    featuredInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    categoryTag: {
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    categoryTagText: {
        fontSize: 10,
        color: '#2DD4BF',
        fontWeight: '900',
        letterSpacing: 1,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 2,
    },
    featuredSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
});

export default HomeScreen;
