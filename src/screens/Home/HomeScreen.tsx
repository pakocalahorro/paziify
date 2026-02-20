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
import { useSessions, useAudiobooks, useStories, useAcademyModules, useSoundscapes } from '../../hooks/useContent';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import BentoGrid from '../../components/Home/BentoGrid';
import BentoCard from '../../components/Home/BentoCard';
import ZenMeter from '../../components/Home/ZenMeter';
import StatsCard from '../../components/Home/StatsCard';
import WeeklyChart from '../../components/Home/WeeklyChart';
import { analyticsService } from '../../services/analyticsService';
import PurposeModal from '../../components/Home/PurposeModal';
import SoundWaveHeader from '../../components/SoundWaveHeader';

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

                {/* ÁREA 1: TU ESTADO (DASHBOARD COMPACTO) */}
                <View style={styles.dashboardSection}>
                    <View style={styles.dashboardCard}>
                        <BlurView intensity={70} tint="dark" style={styles.dashboardBlur}>
                            <View style={styles.dashboardContent}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <ZenMeter progress={dailyProgress} size={75} label="HOY" />
                                    <ZenMeter progress={weeklyProgress} size={75} label="SEM" />
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
                        title="Tu práctica de hoy"
                        accentColor={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'}
                    />

                    <View style={styles.featuredSection}>
                        {/* Title Above */}
                        <View style={{ marginBottom: 16, paddingHorizontal: 4 }}>
                            <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 36, color: '#A0AEC0', marginBottom: -8 }}>Meditación</Text>
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
                            <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 36, color: '#A855F7', marginBottom: -8 }}>Curso</Text>
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
                            <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 36, color: theme.colors.primary, marginBottom: -8 }}>Audiolibro</Text>
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
                            <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 36, color: '#38BDF8', marginBottom: -8 }}>Relato</Text>
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
                            <Text style={{ fontFamily: 'Satisfy_400Regular', fontSize: 36, color: '#10B981', marginBottom: -8 }}>Música ambiente</Text>
                            <Text style={[styles.featuredTitle, { fontSize: 20, textAlign: 'left', marginBottom: 0 }]} numberOfLines={2} adjustsFontSizeToFit>
                                {recommendations?.sounds?.title || "Frecuencia de Sanación"}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <BentoCard
                                title={""} // Title handled externally now
                                icon="play"
                                largeIcon={false}
                                variant="vinyl"
                                badgeText="SONIDO"
                                mood={visualMode === 'healing' ? 'healing' : 'growth'}
                                backgroundImage={recommendations?.sounds?.image_url || recommendations?.sounds?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"}
                                onPress={() => recommendations?.sounds && navigation.navigate(Screen.BACKGROUND_PLAYER, {
                                    soundscapeId: recommendations.sounds.id,
                                    soundscape: recommendations.sounds
                                })}
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
        fontSize: 22,
        color: '#FFF',
        flex: 1,
        fontFamily: 'Satisfy_400Regular',
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
