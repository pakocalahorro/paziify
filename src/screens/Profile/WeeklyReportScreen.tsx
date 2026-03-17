import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CardioService, CardioResult } from '../../services/CardioService';
import { analyticsService } from '../../services/analyticsService';
import { generateWeeklyInsight } from '../../utils/weeklyInsight';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import { OasisChart } from '../../components/Oasis/OasisChart';
import { OasisCalendar } from '../../components/Oasis/OasisCalendar';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, Screen.WEEKLY_REPORT>;
};

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Weekly Report v3.0
 * Includes Weekly/Monthly toggle and expanded insights.
 */
const WeeklyReportScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, user } = useApp();

    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
    const [scans, setScans] = useState<CardioResult[]>([]);
    const [activity, setActivity] = useState<{ day: string; minutes: number }[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState({
        minutes: 0,
        activeDays: 0,
        bestHrv: 0
    });

    useEffect(() => {
        const loadData = async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                const [cardioScans, fetchedActivity] = await Promise.all([
                    CardioService.getHistory(timeRange === 'weekly' ? 7 : 31),
                    timeRange === 'weekly'
                        ? analyticsService.getWeeklyActivity(user.id)
                        : analyticsService.getMonthlyActivity(user.id, currentMonth, currentYear),
                ]);

                setScans(cardioScans);
                setActivity(fetchedActivity);

                const mins = fetchedActivity.reduce((acc: number, d) => acc + d.minutes, 0);
                const best = cardioScans.length > 0 ? Math.max(...cardioScans.map((s: CardioResult) => s.hrv)) : 0;

                setStats({
                    minutes: Math.round(mins),
                    activeDays: fetchedActivity.filter((d) => d.minutes > 0).length,
                    bestHrv: Math.round(best)
                });
            } catch (e) {
                console.log('[WeeklyReport] Error loading data:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user?.id, timeRange, currentMonth, currentYear]);

    const handlePrevMonth = () => {
        setLoading(true);
        setCurrentMonth(prev => {
            if (prev === 0) {
                setCurrentYear(curr => curr - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const handleNextMonth = () => {
        setLoading(true);
        setCurrentMonth(prev => {
            if (prev === 11) {
                setCurrentYear(curr => curr + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    const getMonthName = (m: number) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[m];
    };

    const dailyGoal = userState.dailyGoalMinutes || 20;
    const insight = generateWeeklyInsight(scans, stats.minutes, userState.streak, userState.name);

    return (
        <OasisScreen
            header={
                <OasisHeader
                    path={['Oasis', 'Mi Perfil']}
                    title="Reporte de Calma"
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    activeChallengeType={userState.activeChallenge?.type as any}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                        if (index === 1) (navigation as any).navigate('ProfileTab', { screen: Screen.PROFILE });
                    }}
                />
            }
            themeMode="healing"
            showSafeOverlay={false}
            disableContentPadding={true}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 40 }
                ]}
            >
                {/* Selector de Rango */}
                <View style={styles.rangeSelector}>
                    <TouchableOpacity
                        style={[styles.rangeBtn, timeRange === 'weekly' && styles.rangeBtnActive]}
                        onPress={() => setTimeRange('weekly')}
                    >
                        <Text style={[styles.rangeText, timeRange === 'weekly' && styles.rangeTextActive]}>SEMANAL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.rangeBtn, timeRange === 'monthly' && styles.rangeBtnActive]}
                        onPress={() => setTimeRange('monthly')}
                    >
                        <Text style={[styles.rangeText, timeRange === 'monthly' && styles.rangeTextActive]}>MENSUAL</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Sincronizando con tu Oasis...</Text>
                    </View>
                ) : (
                    <>
                        {/* KPI Resumen */}
                        <View style={styles.kpiRow}>
                            <KpiCard icon="flame" color="#FBBF24" value={`${userState.streak}`} label="días racha" />
                            <KpiCard icon="time" color={theme.colors.primary} value={`${stats.minutes}`} label={timeRange === 'weekly' ? "min semana" : "min mes"} />
                            <KpiCard icon="leaf" color="#2DD4BF" value={`${stats.activeDays}`} label="días activos" />
                            <KpiCard icon="pulse" color="#10B981" value={stats.bestHrv > 0 ? `${stats.bestHrv}` : '—'} label="mejor hrv" />
                        </View>

                        {/* Actividad */}
                        <SectionHeader title={timeRange === 'weekly' ? "Actividad Semanal" : "Actividad Mensual"} icon="time-outline" />
                        <View style={styles.chartCard}>
                            <BlurView intensity={70} tint="dark" style={styles.chartBlur}>
                                {timeRange === 'weekly' ? (
                                    <OasisChart
                                        data={(() => {
                                            const result = [];
                                            const today = new Date();
                                            // Calculate offset to last Monday
                                            // Sunday is 0, Monday is 1... Saturday is 6
                                            const dayOfWeek = today.getDay();
                                            const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                            const monday = new Date(today);
                                            monday.setDate(today.getDate() - diffToMonday);

                                            for (let i = 0; i < 7; i++) {
                                                const d = new Date(monday);
                                                d.setDate(monday.getDate() + i);
                                                const dateStr = d.toISOString().split('T')[0];
                                                const match = activity.find(a => a.day.startsWith(dateStr));

                                                const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
                                                result.push({
                                                    day: days[d.getDay()],
                                                    minutes: match ? match.minutes : 0
                                                });
                                            }
                                            return result;
                                        })()}
                                        height={180}
                                        isMonthly={false}
                                    />
                                ) : (
                                    <OasisCalendar
                                        data={activity}
                                        variant="healing"
                                        monthTitle={`${getMonthName(currentMonth)} ${currentYear}`}
                                        onPrevMonth={handlePrevMonth}
                                        onNextMonth={handleNextMonth}
                                    />
                                )}
                                <Text style={styles.chartLegend}>
                                    {timeRange === 'weekly'
                                        ? "Tu presencia diaria esta semana (de Lunes a Domingo)."
                                        : `Tu evolución de calma durante ${getMonthName(currentMonth)}.`}
                                </Text>
                            </BlurView>
                            <View style={styles.innerGlassBorder} pointerEvents="none" />
                        </View>

                        {/* Bio-Ritmo HRV (Simplificado para reporte unificado) */}
                        <SectionHeader title="Bio-Ritmo HRV" icon="pulse-outline" accent="#10B981" />
                        <View style={styles.chartCard} >
                            <BlurView intensity={70} tint="dark" style={styles.chartBlur}>
                                {timeRange === 'weekly' ? (
                                    <OasisChart
                                        data={(() => {
                                            const grouped: Record<string, number> = {};
                                            scans.forEach(s => {
                                                const d = s.timestamp.split('T')[0];
                                                grouped[d] = Math.max(grouped[d] || 0, s.hrv);
                                            });

                                            const result = [];
                                            const today = new Date();
                                            const dayOfWeek = today.getDay();
                                            const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                            const monday = new Date(today);
                                            monday.setDate(today.getDate() - diffToMonday);

                                            for (let i = 0; i < 7; i++) {
                                                const d = new Date(monday);
                                                d.setDate(monday.getDate() + i);
                                                const dateStr = d.toISOString().split('T')[0];
                                                const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
                                                result.push({
                                                    day: days[d.getDay()],
                                                    minutes: grouped[dateStr] || 0
                                                });
                                            }
                                            return result;
                                        })()}
                                        height={150}
                                        color="#10B981"
                                        isMonthly={false}
                                    />
                                ) : (
                                    <OasisCalendar
                                        data={(() => {
                                            const grouped: Record<string, number> = {};
                                            scans.forEach(s => {
                                                const d = s.timestamp.split('T')[0];
                                                grouped[d] = Math.max(grouped[d] || 0, s.hrv);
                                            });
                                            // Convert to OasisCalendar format
                                            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                            const result = [];
                                            for (let i = 1; i <= daysInMonth; i++) {
                                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                                                result.push({
                                                    day: dateStr,
                                                    minutes: grouped[dateStr] || 0
                                                });
                                            }
                                            return result;
                                        })()}
                                        variant="healing"
                                        type="hrv"
                                        monthTitle={`${getMonthName(currentMonth)} ${currentYear}`}
                                        onPrevMonth={handlePrevMonth}
                                        onNextMonth={handleNextMonth}
                                    />
                                )}
                                <Text style={styles.chartLegend}>
                                    {timeRange === 'weekly'
                                        ? "Tu recuperación (HRV) esta semana. Más alto = Más calma."
                                        : "Tendencia mensual de recuperación biométrica (HRV)."}
                                </Text>
                            </BlurView>
                            <View style={styles.innerGlassBorder} pointerEvents="none" />
                        </View>

                        {/* Insight Dinámico */}
                        <View style={[styles.insightCard, { borderColor: `${insight.color}30` }]}>
                            <LinearGradient
                                colors={[`${insight.color}12`, 'transparent']}
                                style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.insightHeader}>
                                <Text style={styles.insightIcon}>{insight.icon}</Text>
                                <Text style={[styles.insightTitle, { color: insight.color }]}>{insight.title}</Text>
                            </View>
                            <Text style={styles.insightBody}>{insight.body}</Text>
                        </View>

                        {/* Stats rápidos */}
                        <BlurView intensity={30} tint="dark" style={styles.statsRow}>
                            <StatLine label="Tiempo total histórico" value={`${Math.round((userState.totalMinutes || 0) / 60)}h ${(userState.totalMinutes || 0) % 60}m`} />
                            <View style={styles.statDivider} />
                            <StatLine label="Racha actual" value={`${userState.streak} días`} />
                            <View style={styles.statDivider} />
                            <StatLine label="Sesiones completadas" value={`${userState.completedSessionIds?.length || 0}`} />
                        </BlurView>
                    </>
                )}
            </ScrollView>
        </OasisScreen>
    );
};

// --- Sub-components ---

const KpiCard: React.FC<{ icon: string; value: string; label: string; color?: string }> = ({ icon, value, label, color = theme.colors.primary }) => (
    <View style={styles.kpiCardContainer}>
        <BlurView intensity={70} tint="dark" style={styles.kpiCard}>
            <Ionicons name={icon as any} size={18} color={color} style={{ marginBottom: 4 }} />
            <Text style={styles.kpiValue}>{value}</Text>
            <Text style={styles.kpiLabel}>{label.toUpperCase()}</Text>
        </BlurView>
        <View style={styles.innerGlassBorder} pointerEvents="none" />
    </View>
);

const SectionHeader: React.FC<{ title: string; icon: string; accent?: string }> = ({ title, icon, accent = theme.colors.primary }) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={16} color={accent} />
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
);

const StatLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.statLine}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    loadingContainer: { alignItems: 'center', paddingTop: 80, gap: 16 },
    loadingText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },

    rangeSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        gap: 4,
    },
    rangeBtn: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 8,
    },
    rangeBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    rangeText: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1,
    },
    rangeTextActive: {
        color: '#FFF',
    },

    kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
    kpiCardContainer: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    kpiCard: {
        alignItems: 'center', paddingVertical: 14,
        borderRadius: 16,
        overflow: 'hidden', gap: 2,
    },
    kpiIcon: { fontSize: 18 },
    kpiValue: { fontSize: 20, fontWeight: '900', color: '#FFF' },
    kpiLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textAlign: 'center' },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    sectionTitle: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5 },

    chartCard: {
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    chartBlur: {
        padding: 16,
    },
    innerGlassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        borderTopColor: 'rgba(255,255,255,0.25)',
        borderLeftColor: 'rgba(255,255,255,0.18)',
    },
    chartLegend: {
        fontSize: 10, color: 'rgba(255,255,255,0.35)',
        textAlign: 'center', marginTop: 12, fontWeight: '600',
        paddingHorizontal: 10,
    },

    statsRow: {
        borderRadius: 20, padding: 20, marginBottom: 24,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden', gap: 12,
    },
    statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
    statValue: { fontSize: 14, fontWeight: '800', color: '#FFF' },
    statDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

    insightCard: {
        borderRadius: 24, padding: 24, marginBottom: 24,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden'
    },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    insightIcon: { fontSize: 24 },
    insightTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
    insightBody: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
});

export default WeeklyReportScreen;
