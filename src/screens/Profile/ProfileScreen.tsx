import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
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
import { analyticsService, UserStats } from '../../services/analyticsService';
import { CardioService, CardioResult } from '../../services/CardioService';
import ResilienceTree from '../../components/Profile/ResilienceTree';
import { adminHooks } from '../../utils/oasisExperiments';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import WidgetTutorialModal from '../../components/Challenges/WidgetTutorialModal';
import { OasisChart } from '../../components/Oasis/OasisChart';
import { OasisCalendar } from '../../components/Oasis/OasisCalendar';
import { getDominantMode } from '../../constants/categories';

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
    const [activity, setActivity] = useState<{ day: string; minutes: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [dominantMode, setDominantMode] = useState<'healing' | 'growth'>('healing');
    const [todayBaseline, setTodayBaseline] = useState<CardioResult | null>(null);

    const visualMode = userState.lifeMode || (isNightMode ? 'healing' : 'growth');
    const [showWidgetTutorial, setShowWidgetTutorial] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            if (user?.id) {
                setLoading(true);
                const fetchedStats = await analyticsService.getUserStats(user.id);
                const distribution = await analyticsService.getCategoryDistribution(user.id);
                const fetchedActivity = await analyticsService.getWeeklyActivity(user.id);
                const baseline = await CardioService.getTodayBaseline();

                setStats(fetchedStats);
                setActivity(fetchedActivity);
                setTodayBaseline(baseline);

                // Determine dominant mode for Aura using centralized logic
                setDominantMode(getDominantMode(distribution));

                setLoading(false);
            } else if (isGuest) {
                setLoading(false);
            }
        };

        loadStats();
    }, [user, isGuest]);

    const motivationalMessage = useMemo(() => {
        if (isGuest) return "Inicia sesión para guardar tu florecer.";
        if (!userState.activeChallenge) return "Cada día de calma hace florecer tu paz interior.";
        
        const { daysCompleted, totalDays } = userState.activeChallenge;
        const progress = daysCompleted / totalDays;
        
        if (daysCompleted === 0) return "¡Hoy es un gran día para encender tu primera luz!";
        if (progress < 0.4) return "¡Tu paz está empezando a florecer! Sigue así.";
        if (progress < 0.7) return "¡Brillante! Estás integrando la calma en tu vida.";
        if (progress < 1) return "¡Casi lo tienes! Tu árbol irradia una energía increíble.";
        return "¡Felicidades! Has completado tu reto y tu paz es plena.";
    }, [userState.activeChallenge, isGuest]);

    const displayStats = useMemo(() => stats || {
        totalMinutes: 0,
        sessionsCount: 0,
        currentStreak: userState.streak || 0,
        resilienceScore: userState.resilienceScore || 50
    }, [stats, userState]);

    return (
        <OasisScreen
            header={
                <OasisHeader
                    path={['Oasis']}
                    title="Mi Perfil"
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                        if (index === 1) (navigation as any).navigate('ProfileTab', { screen: Screen.PROFILE });
                    }}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    activeChallengeType={userState.activeChallenge?.type as any}
                />
            }
            themeMode={dominantMode as any}
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
                            <Text style={styles.motivationalText}>
                                {motivationalMessage.toUpperCase()}
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
                    </BlurView>

                    {/* Estadísticas de Camino de Paz */}
                    <View style={styles.sectionHeader}>
                        <View style={styles.titleWithInfo}>
                            <Text style={styles.sectionTitle}>Tu Camino de Paz</Text>
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
                                <Text style={styles.bentoValue}>
                                    {
                                        displayStats.totalMinutes < 60
                                            ? `${displayStats.totalMinutes} min`
                                            : `${Math.floor(displayStats.totalMinutes / 60)}h ${displayStats.totalMinutes % 60}m`
                                    }
                                </Text>
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
                                </View>
                                <Ionicons name="pulse" size={18} color={theme.colors.primary} />
                            </View>
                            <OasisCalendar
                                data={activity}
                                variant={dominantMode === 'healing' ? 'healing' : 'growth'}
                            />
                        </BlurView>
                    </View>

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
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    motivationalText: {
        marginTop: 15,
        fontSize: 11,
        fontWeight: '900',
        color: '#FFD700', // Gold Yellow to match the lights
        textAlign: 'center',
        paddingHorizontal: 20,
        letterSpacing: 0.5,
        lineHeight: 16,
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
