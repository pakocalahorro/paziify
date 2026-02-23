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
import ResilienceTree from '../../components/Profile/ResilienceTree';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
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

                setStats(fetchedStats);
                setDailyActivity(activity);

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

    return (
        <View style={styles.root}>
            <BackgroundWrapper nebulaMode={visualMode === 'healing' ? 'healing' : 'growth'} />
            <StatusBar barStyle="light-content" />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerSpacer} />
                        <Text style={styles.headerTitle}>Tu Evolución</Text>
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => navigation.navigate(Screen.NOTIFICATION_SETTINGS)}
                        >
                            <Ionicons name="settings-outline" size={22} color={theme.colors.textMain} />
                        </TouchableOpacity>
                    </View>

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

                        <TouchableOpacity
                            style={[styles.guestCTA, { marginTop: userState.activeChallenge ? 8 : 16, backgroundColor: 'rgba(100, 108, 255, 0.1)', borderColor: 'rgba(100, 108, 255, 0.2)' }]}
                            onPress={() => setShowWidgetTutorial(true)}
                        >
                            <Ionicons name="apps-outline" size={14} color={theme.colors.primary} />
                            <Text style={[styles.guestCTAText, { color: theme.colors.primary }]}>Instalar Zen Widget</Text>
                        </TouchableOpacity>

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

                    {/* SECCIÓN DE PROPÓSITO */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.titleWithInfo}>
                            <Text style={styles.sectionTitle}>Tu Propósito</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Tu Propósito", "Ajusta tus metas diarias y semanales para que se adapten a tu ritmo de vida actual.")}>
                                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        </View>
                        <Ionicons name="compass-outline" size={18} color={theme.colors.primary} />
                    </View>

                    <BlurView intensity={20} tint="dark" style={styles.goalPanel}>
                        <View style={styles.goalRow}>
                            <View>
                                <Text style={styles.goalLabel}>META DIARIA</Text>
                                <View style={styles.goalValueContainer}>
                                    <TouchableOpacity
                                        onPress={() => updateUserState({ dailyGoalMinutes: Math.max((userState.dailyGoalMinutes || 20) - 5, 5) })}
                                        style={styles.goalButton}
                                    >
                                        <Ionicons name="remove" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                    <Text style={styles.goalValue}>{userState.dailyGoalMinutes || 20}m</Text>
                                    <TouchableOpacity
                                        onPress={() => updateUserState({ dailyGoalMinutes: (userState.dailyGoalMinutes || 20) + 5 })}
                                        style={styles.goalButton}
                                    >
                                        <Ionicons name="add" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.goalDivider} />
                            <View>
                                <Text style={styles.goalLabel}>META SEMANAL</Text>
                                <View style={styles.goalValueContainer}>
                                    <TouchableOpacity
                                        onPress={() => updateUserState({ weeklyGoalMinutes: Math.max((userState.weeklyGoalMinutes || 150) - 10, 30) })}
                                        style={styles.goalButton}
                                    >
                                        <Ionicons name="remove" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                    <Text style={styles.goalValue}>{userState.weeklyGoalMinutes || 150}m</Text>
                                    <TouchableOpacity
                                        onPress={() => updateUserState({ weeklyGoalMinutes: (userState.weeklyGoalMinutes || 150) + 10 })}
                                        style={styles.goalButton}
                                    >
                                        <Ionicons name="add" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </BlurView>

                    {/* Estadísticas de Camino de Paz */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.titleWithInfo}>
                            <Text style={styles.sectionTitle}>Tu Camino de Paz</Text>
                            <TouchableOpacity onPress={() => Alert.alert("Tu Camino", "Aquí puedes ver el tiempo total que has dedicado a tu bienestar y tu constancia acumulada.")}>
                                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.statsBento}>
                        <View style={styles.bentoRow}>
                            <BlurView intensity={15} tint="light" style={styles.bentoSmall}>
                                <Text style={styles.bentoLabel}>Presencia Total</Text>
                                <Text style={styles.bentoValue}>{Math.round(displayStats.totalMinutes / 60)}h</Text>
                                <Text style={styles.bentoSubtitle}>Tiempo dedicado</Text>
                            </BlurView>
                            <BlurView intensity={15} tint="light" style={styles.bentoSmall}>
                                <Text style={styles.bentoLabel}>Constancia</Text>
                                <Text style={styles.bentoValue}>{displayStats.currentStreak}</Text>
                                <Text style={styles.bentoSubtitle}>Días en Calma</Text>
                            </BlurView>
                        </View>

                        <BlurView intensity={10} tint="dark" style={styles.bentoWide}>
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
                                                    height: `${Math.max(10, percent)}%`, // At least 10% height
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
                        <TouchableOpacity onPress={() => {/* Show all */ }}>
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

                    {/* Actions */}
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
                                <Ionicons name="log-out-outline" size={20} color={theme.colors.textMuted} />
                                <Text style={styles.logoutText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.versionText}>Paziify v2.5.0 • Oasis Design</Text>
                    </View>
                </ScrollView>
            </View>
            <WidgetTutorialModal
                isVisible={showWidgetTutorial}
                onClose={() => setShowWidgetTutorial(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
    },
    headerSpacer: {
        width: 44,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.textMain,
        letterSpacing: 0.5,
    },
    settingsButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    treeSection: {
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden',
    },
    treeLabels: {
        marginTop: 10,
        alignItems: 'center',
    },
    treeScore: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.textMain,
    },
    treeSubtext: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    guestCTA: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    guestCTAText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.accent,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    titleWithInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoIconContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    goalPanel: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginBottom: theme.spacing.lg,
        overflow: 'hidden',
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goalLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        marginBottom: 6,
        textAlign: 'center',
    },
    goalValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    goalValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        minWidth: 45,
        textAlign: 'center',
    },
    goalButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    statsBento: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xxl,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    bentoSmall: {
        flex: 1,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    bentoWide: {
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    bentoLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    bentoValue: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.textMain,
    },
    bentoSubtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    bentoWideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    miniChart: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    barContainer: {
        alignItems: 'center',
        gap: 6,
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
        marginTop: theme.spacing.xxl,
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
});

export default ProfileScreen;
