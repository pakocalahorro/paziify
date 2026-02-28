import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { analyticsService, UserStats, DailyActivity } from '../../services/analyticsService';
import { CardioService, CardioResult } from '../../services/CardioService';
import ResilienceTree from '../../components/Profile/ResilienceTree';
import { adminHooks } from '../../utils/oasisExperiments';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import WidgetTutorialModal from '../../components/Challenges/WidgetTutorialModal';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.PROFILE
>;

interface Props {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, signOut, user, isGuest, updateUserState, isNightMode } = useApp();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [dominantMode, setDominantMode] = useState<'healing' | 'growth' | 'neutral'>('neutral');
    const [todayBaseline, setTodayBaseline] = useState<CardioResult | null>(null);

    const visualMode = userState.lifeMode || (isNightMode ? 'healing' : 'growth');
    const [showWidgetTutorial, setShowWidgetTutorial] = useState(false);

    const dayLabels: Record<string, string> = {
        '0': 'D', '1': 'L', '2': 'M', '3': 'X', '4': 'J', '5': 'V', '6': 'S'
    };

    useEffect(() => {
        const loadStats = async () => {
            if (user?.id) {
                setLoading(true);
                const fetchedStats = await analyticsService.getUserStats(user.id);
                const distribution = await analyticsService.getCategoryDistribution(user.id);
                const activity = await analyticsService.getWeeklyActivity(user.id);
                const baseline = await CardioService.getTodayBaseline();

                setStats(fetchedStats);
                setDailyActivity(activity);
                setTodayBaseline(baseline);

                // Determine dominant mode for Aura
                const healingCount = distribution
                    .filter(d => ['anxiety', 'sleep', 'health', 'wellness', 'stress', 'ansiedad', 'sueño', 'salud'].includes(d.category))
                    .reduce((acc, curr) => acc + curr.count, 0);

                const growthCount = distribution
                    .filter(d => ['professional', 'growth', 'career', 'relationships', 'leadership', 'success', 'carrera', 'exito'].includes(d.category))
                    .reduce((acc, curr) => acc + curr.count, 0);

                if (healingCount > growthCount) setDominantMode('healing');
                else if (growthCount > healingCount) setDominantMode('growth');
                else setDominantMode('neutral');

                setLoading(false);
            } else if (isGuest) {
                setLoading(false);
            }
        };

        loadStats();
    }, [user, isGuest]);

    const displayStats = useMemo(() => stats || {
        totalMinutes: 0,
        sessionsCount: 0,
        currentStreak: userState.streak || 0,
        resilienceScore: userState.resilienceScore || 50
    }, [stats, userState]);

    const formatDifficultyLevel = (level: number | undefined) => {
        if (!level) return 'Básico';
        if (level === 1) return 'Principiante';
        if (level === 2) return 'Intermedio';
        if (level === 3) return 'Avanzado';
        return 'Zen';
    };

    return (
        <OasisScreen
            header={
                <OasisHeader
                    path={['Oasis']}
                    title="Mi Perfil"
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                    }}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    activeChallengeType={userState.activeChallenge?.type as any}
                />
            }
            themeMode={dominantMode === 'neutral' ? (visualMode === 'healing' ? 'healing' : 'growth') : (dominantMode as any)}
            showSafeOverlay={false}
            disableContentPadding={true}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.contentPadding}>
                    {/* Resilience Tree Section */}
                    <BlurView intensity={40} tint="dark" style={styles.treeSection}>
                        <TouchableOpacity
                            style={styles.infoIconContainer}
                            onPress={() => Alert.alert(
                                userState.activeChallenge ? "Tu Reto Activo" : "Tu Florecer Mensual",
                                userState.activeChallenge
                                    ? `Estás en el camino de "${userState.activeChallenge.title}". Cada sesión completa hace brillar tu árbol.`
                                    : "Cada día que meditas enciendes una nueva luz en tu árbol. Completa el ciclo de 30 días para integrar el hábito de la paz."
                            )}
                        >
                            <Ionicons name="information-circle-outline" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>

                        <ResilienceTree
                            daysPracticed={userState.activeChallenge ? userState.activeChallenge.daysCompleted : displayStats.currentStreak}
                            totalSteps={userState.activeChallenge ? userState.activeChallenge.totalDays : 30}
                            size={250}
                            isGuest={isGuest}
                        />
                        <View style={styles.treeLabels}>
                            <Text style={styles.treeScore}>
                                {userState.activeChallenge
                                    ? `${userState.activeChallenge.daysCompleted}/${userState.activeChallenge.totalDays}`
                                    : `${displayStats.currentStreak}/30`}
                            </Text>
                            <Text style={styles.treeSubtext}>
                                {userState.activeChallenge ? "Días completados" : "Días de Calma este mes"}
                            </Text>
                        </View>

                        {userState.activeChallenge && (
                            <TouchableOpacity
                                style={[styles.guestCTA, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}
                                onPress={() => {
                                    Alert.alert(
                                        "Abandonar Misión",
                                        "¿Seguro que quieres abandonar este reto? El progreso visual de este reto se perderá, aunque tus estadísticas globales se mantendrán.",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            {
                                                text: "Abandonar",
                                                style: "destructive",
                                                onPress: () => updateUserState({ activeChallenge: null })
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Text style={[styles.guestCTAText, { color: '#EF4444' }]}>Abandonar Misión</Text>
                                <Ionicons name="close-circle" size={14} color="#EF4444" />
                            </TouchableOpacity>
                        )}

                        {isGuest && !userState.activeChallenge && (
                            <TouchableOpacity
                                style={styles.guestCTA}
                                onPress={() => navigation.navigate(Screen.WELCOME)}
                            >
                                <Text style={styles.guestCTAText}>Regístrate para el Reto Mensual</Text>
                                <Ionicons name="arrow-forward" size={14} color={theme.colors.accent} />
                            </TouchableOpacity>
                        )}
                    </BlurView>

                    {/* Estadísticas de Camino de Paz */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.titleWithInfo}>
                            <Text style={styles.sectionTitle}>Tu Camino de Paz</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Tu Camino", "Aquí puedes ver el tiempo total que has dedicado a tu bienestar y tu constancia acumulada.")}>
                                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(Screen.NOTIFICATION_SETTINGS)}
                            style={styles.settingsAction}
                        >
                            <Ionicons name="settings-outline" size={18} color={theme.colors.primary} />
                            <Text style={styles.settingsActionText}>AJUSTES</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsBento}>
                        <View style={styles.bentoRow}>
                            <BlurView intensity={35} tint="dark" style={styles.bentoSmall}>
                                <Text style={styles.bentoLabel}>Presencia Total</Text>
                                <Text style={styles.bentoValue}>{Math.round(displayStats.totalMinutes / 60)}h</Text>
                                <Text style={styles.bentoSubtitle}>Tiempo dedicado</Text>
                            </BlurView>
                            <BlurView intensity={35} tint="dark" style={styles.bentoSmall}>
                                <Text style={styles.bentoLabel}>Constancia</Text>
                                <Text style={styles.bentoValue}>{displayStats.currentStreak}</Text>
                                <Text style={styles.bentoSubtitle}>Días en Calma</Text>
                            </BlurView>
                        </View>

                        <View style={styles.bentoRow}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => navigation.navigate(Screen.WEEKLY_REPORT)}
                            >
                                <BlurView intensity={45} tint="dark" style={[styles.bentoWide, styles.weeklyReportButton]}>
                                    <View style={styles.reportRow}>
                                        <View style={styles.reportInfo}>
                                            <View style={styles.reportTitleRow}>
                                                <Ionicons name="sparkles" size={18} color={theme.colors.primary} />
                                                <Text style={styles.reportLabel}>Sinfonía de Bienestar</Text>
                                            </View>
                                            <Text style={styles.reportTitle}>Tu Reporte Semanal</Text>
                                            <Text style={styles.reportSubtitle}>Bio-Ritmo • Tendencias • Insights</Text>
                                        </View>
                                        <View style={styles.reportArrow}>
                                            <Ionicons name="arrow-forward-circle" size={42} color={theme.colors.primary} />
                                        </View>
                                    </View>
                                </BlurView>
                            </TouchableOpacity>
                        </View>

                        <BlurView intensity={35} tint="dark" style={styles.bentoWide}>
                            <View style={styles.bentoWideHeader}>
                                <View style={styles.titleWithInfo}>
                                    <View>
                                        <Text style={styles.bentoLabel}>Tu Ritmo de Calma</Text>
                                        <Text style={styles.bentoSubtitle}>Tu evolución semanal</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => Alert.alert("Ritmo de Calma", "Este gráfico muestra cómo distribuyes tu práctica a lo largo de la semana. Te ayuda a identificar tus mejores días para meditar.")}>
                                        <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.4)" style={{ marginLeft: 6, marginTop: -15 }} />
                                    </TouchableOpacity>
                                </View>
                                <Ionicons name="pulse" size={18} color={theme.colors.primary} />
                            </View>
                            <View style={styles.miniChart}>
                                {dailyActivity.map((day, i) => {
                                    const goal = userState.dailyGoalMinutes || 20;
                                    const percent = Math.min((day.minutes / goal) * 100, 100);

                                    const dateObj = new Date(day.day.includes('T') ? day.day : `${day.day}T12:00:00`);
                                    const dayNum = dateObj.getDay();
                                    const label = dayLabels[dayNum.toString()];

                                    return (
                                        <View key={i} style={styles.barContainer}>
                                            <View style={[
                                                styles.miniBar,
                                                {
                                                    height: `${Math.max(10, percent)}%`,
                                                    backgroundColor: percent >= 100 ? theme.colors.primary : theme.colors.accent
                                                }
                                            ]} />
                                            <Text style={styles.barLabel}>{label}</Text>
                                        </View>
                                    );
                                })}
                                {dailyActivity.length === 0 && (
                                    <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center', width: '100%' }}>Comienza a meditar para ver tu ritmo</Text>
                                )}
                            </View>
                        </BlurView>
                    </View>

                    {/* Badges Section */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.titleWithInfo}>
                            <Text style={styles.sectionTitle}>Esencias de Calma</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Esencias", "Son cualidades que vas integrando en tu vida a través de tu compromiso con la meditación.")}>
                                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setShowWidgetTutorial(true)}>
                            <Text style={styles.seeAll}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.badgesList}
                    >
                        <View style={styles.badgeCard}>
                            <View style={[styles.badgeIcon, { backgroundColor: `${theme.colors.primary}30` }]}>
                                <Ionicons name="leaf" size={24} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.badgeLabel}>Pionero</Text>
                        </View>
                        <View style={styles.badgeCard}>
                            <View style={[styles.badgeIcon, { backgroundColor: `${theme.colors.accent}30` }]}>
                                <Ionicons name="flame" size={24} color={theme.colors.accent} />
                            </View>
                            <Text style={styles.badgeLabel}>Fuego Interior</Text>
                        </View>
                        <View style={[styles.badgeCard, { opacity: 0.4 }]}>
                            <View style={[styles.badgeIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                <Ionicons name="medal-outline" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.badgeLabel}>???</Text>
                        </View>
                    </ScrollView>

                    {/* BOTONES DE ACCIÓN */}
                    <View style={styles.actionsContainer}>
                        {!isGuest && (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => {
                                    Alert.alert(
                                        "Cerrar Sesión",
                                        "¿Estás seguro de que quieres salir?",
                                        [
                                            { text: "Cancelar", style: "cancel" },
                                            { text: "Salir", style: "destructive", onPress: signOut }
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="log-out-outline" size={18} color={theme.colors.textMuted} />
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.versionText}>Paziify v3.0.0 • Oasis Edition</Text>

                        {/* THE ADMIN GATE */}
                        {adminHooks.useIsAdmin() && (
                            <TouchableOpacity
                                style={{ marginTop: 24, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
                                onPress={() => navigation.navigate(Screen.OASIS_SHOWCASE)}
                            >
                                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>
                                    ✨ OASIS SHOWCASE (ADMIN)
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <WidgetTutorialModal
                isVisible={showWidgetTutorial}
                onClose={() => setShowWidgetTutorial(false)}
            />
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentPadding: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
    },
    treeSection: {
        borderRadius: 32,
        padding: 30,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
    },
    infoIconContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    treeLabels: {
        alignItems: 'center',
        marginTop: 10,
    },
    treeScore: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -1,
    },
    treeSubtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        marginTop: 2,
    },
    guestCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 20,
        gap: 8,
    },
    guestCTAText: {
        color: theme.colors.accent,
        fontSize: 12,
        fontWeight: '800',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    titleWithInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    statsBento: {
        gap: 12,
        marginBottom: 30,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    bentoSmall: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    bentoWide: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    bentoLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bentoValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        marginVertical: 4,
    },
    bentoSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    weeklyReportButton: {
        backgroundColor: 'rgba(45, 212, 191, 0.05)',
        borderColor: 'rgba(45, 212, 191, 0.2)',
    },
    reportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reportInfo: {
        gap: 4,
    },
    reportTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    reportLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
    },
    reportSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    reportArrow: {
        opacity: 0.8,
    },
    bentoWideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    miniChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 60,
        paddingTop: 10,
    },
    barContainer: {
        alignItems: 'center',
        gap: 6,
        width: `${100 / 7}%`,
    },
    miniBar: {
        width: 8,
        borderRadius: 4,
    },
    barLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.2)',
    },
    seeAll: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    badgesList: {
        gap: theme.spacing.md,
        paddingRight: 40,
    },
    badgeCard: {
        alignItems: 'center',
        gap: 8,
        width: 100,
    },
    badgeIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    badgeLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
    },
    actionsContainer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    logoutText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    versionText: {
        fontSize: 10,
        color: theme.colors.textMuted,
        opacity: 0.5,
    },
    settingsAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    settingsActionText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 1,
    },
});

export default ProfileScreen;
