import React, { useState, useEffect, useCallback } from 'react';
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
import { BarChart } from 'react-native-chart-kit';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { CardioService, CardioResult } from '../../services/CardioService';
import { analyticsService, DailyActivity } from '../../services/analyticsService';
import { generateWeeklyInsight } from '../../utils/weeklyInsight';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 48;

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, Screen.WEEKLY_REPORT>;
};

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Map a CardioResult[] (one per day, oldest→newest) to a 7-slot HRV array
function buildHrvWeekData(scans: CardioResult[]): { values: number[]; diagnoses: string[] } {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
    weekStart.setHours(0, 0, 0, 0);

    const values: number[] = new Array(7).fill(0);
    const diagnoses: string[] = new Array(7).fill('none');

    scans.forEach(scan => {
        const d = new Date(scan.timestamp);
        const dayIndex = Math.floor((d.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
            // Use latest scan of the day (scans are newest-first in getHistory)
            if (values[dayIndex] === 0) {
                values[dayIndex] = scan.hrv;
                diagnoses[dayIndex] = scan.diagnosis;
            }
        }
    });

    return { values, diagnoses };
}

function buildActivityWeekData(activity: DailyActivity[]): number[] {
    return activity.map(d => Math.round(d.minutes));
}

const diagnosisColor: Record<string, string> = {
    equilibrio: '#10B981',
    agotamiento: '#F59E0B',
    sobrecarga: '#EF4444',
    none: 'rgba(255,255,255,0.06)',
};

const WeeklyReportScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, user } = useApp();

    const [loading, setLoading] = useState(true);
    const [scans, setScans] = useState<CardioResult[]>([]);
    const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
    const [weeklyMinutes, setWeeklyMinutes] = useState(0);
    const [activeDays, setActiveDays] = useState(0);
    const [bestHrv, setBestHrv] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [cardioScans, activity] = await Promise.all([
                    CardioService.getHistory(30),
                    user?.id ? analyticsService.getWeeklyActivity(user.id) : Promise.resolve([]),
                ]);
                setScans(cardioScans);
                setWeeklyActivity(activity);

                const mins = activity.reduce((acc, d) => acc + d.minutes, 0);
                setWeeklyMinutes(Math.round(mins));
                setActiveDays(activity.filter(d => d.minutes > 0).length);

                const best = cardioScans.length > 0 ? Math.max(...cardioScans.map(s => s.hrv)) : 0;
                setBestHrv(Math.round(best));
            } catch (e) {
                console.log('[WeeklyReport] Error loading data:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user?.id]);

    const { values: hrvValues, diagnoses } = buildHrvWeekData(scans);
    const activityValues = buildActivityWeekData(weeklyActivity);
    const dailyGoal = userState.dailyGoalMinutes || 20;

    const insight = generateWeeklyInsight(scans, weeklyMinutes, userState.streak, userState.name);

    const chartConfig = {
        backgroundColor: 'transparent',
        backgroundGradientFrom: '#0F172A',
        backgroundGradientTo: '#0F172A',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
        labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
        barPercentage: 0.6,
    };

    const hasHrvData = hrvValues.some(v => v > 0);
    const hasActivityData = activityValues.some(v => v > 0);

    return (
        <View style={styles.root}>
            <BackgroundWrapper nebulaMode="healing" />

            {/* Safe area top blur */}
            <BlurView intensity={90} tint="dark" style={[styles.safeBlur, { height: insets.top }]} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 80 }]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reporte Semanal</Text>
                    <View style={{ width: 36 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Cargando tu semana...</Text>
                    </View>
                ) : (
                    <>
                        {/* ① KPI Resumen */}
                        <View style={styles.kpiRow}>
                            <KpiCard icon="🔥" value={`${userState.streak}`} label="días racha" />
                            <KpiCard icon="⏱" value={`${weeklyMinutes}`} label="min esta sem." />
                            <KpiCard icon="🧘" value={`${activeDays}`} label="días activos" />
                            <KpiCard
                                icon="💓"
                                value={bestHrv > 0 ? `${bestHrv}` : '—'}
                                label="mejor HRV"
                            />
                        </View>

                        {/* ② Actividad Semanal */}
                        <SectionHeader title="Actividad Semanal" icon="time-outline" />
                        <BlurView intensity={20} tint="dark" style={styles.chartCard}>
                            {hasActivityData ? (
                                <>
                                    <BarChart
                                        data={{
                                            labels: DAY_LABELS,
                                            datasets: [{
                                                data: activityValues.map(v => v === 0 ? 0.1 : v),
                                                colors: activityValues.map(v =>
                                                    (opacity: number) => v >= dailyGoal
                                                        ? `rgba(16,185,129,${opacity})`
                                                        : `rgba(212,175,55,${opacity * 0.7})`
                                                ),
                                            }],
                                        }}
                                        width={CHART_WIDTH - 32}
                                        height={180}
                                        chartConfig={chartConfig}
                                        yAxisLabel=""
                                        yAxisSuffix="m"
                                        style={styles.chart}
                                        fromZero
                                        withCustomBarColorFromData
                                        flatColor
                                    />
                                    <Text style={styles.chartLegend}>
                                        <Text style={{ color: '#10B981' }}>■</Text> Meta superada{'  '}
                                        <Text style={{ color: '#D4AF37' }}>■</Text> En progreso
                                    </Text>
                                </>
                            ) : (
                                <EmptyState message="Completa sesiones para ver tu actividad diaria" />
                            )}
                        </BlurView>

                        {/* ③ Bio-Ritmo HRV */}
                        <SectionHeader title="Bio-Ritmo Semanal" icon="pulse-outline" accent="#10B981" />
                        <BlurView intensity={20} tint="dark" style={styles.chartCard}>
                            {hasHrvData ? (
                                <>
                                    {/* HRV custom bars coloreadas por diagnosis */}
                                    <View style={styles.hrvBarsContainer}>
                                        {hrvValues.map((val, i) => {
                                            const maxHrv = Math.max(...hrvValues.filter(v => v > 0), 1);
                                            const heightPct = val > 0 ? Math.max(val / maxHrv, 0.08) : 0.05;
                                            const color = val > 0 ? diagnosisColor[diagnoses[i]] : 'rgba(255,255,255,0.06)';
                                            return (
                                                <View key={i} style={styles.hrvBarItem}>
                                                    <Text style={styles.hrvBarValue}>{val > 0 ? val : ''}</Text>
                                                    <View style={styles.hrvBarTrack}>
                                                        <LinearGradient
                                                            colors={[color, `${color.slice(0, -2)}0.4)`]}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 0, y: 1 }}
                                                            style={[styles.hrvBarFill, { flex: heightPct }]}
                                                        />
                                                        <View style={{ flex: 1 - heightPct }} />
                                                    </View>
                                                    <Text style={styles.hrvBarLabel}>{DAY_LABELS[i]}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                    <Text style={styles.chartLegend}>
                                        <Text style={{ color: '#10B981' }}>■</Text> Equilibrio{'  '}
                                        <Text style={{ color: '#F59E0B' }}>■</Text> Agotamiento{'  '}
                                        <Text style={{ color: '#EF4444' }}>■</Text> Sobrecarga
                                    </Text>
                                </>
                            ) : (
                                <EmptyState
                                    message="Sin escaneos esta semana"
                                    cta="Escanear ahora"
                                    onCta={() => navigation.navigate(Screen.CARDIO_SCAN)}
                                />
                            )}
                        </BlurView>

                        {/* ④ Stats rápidos */}
                        <BlurView intensity={15} tint="dark" style={styles.statsRow}>
                            <StatLine label="Tiempo total histórico" value={`${Math.round((userState.totalMinutes || 0) / 60)}h ${(userState.totalMinutes || 0) % 60}m`} />
                            <View style={styles.statDivider} />
                            <StatLine label="Racha actual" value={`${userState.streak} días`} />
                            <View style={styles.statDivider} />
                            <StatLine label="Escaneos esta semana" value={`${scans.filter(s => {
                                const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
                                return new Date(s.timestamp) > weekAgo;
                            }).length} escaneos`} />
                        </BlurView>

                        {/* ⑤ Insight Dinámico */}
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
                    </>
                )}
            </ScrollView>
        </View>
    );
};

// --- Sub-components ---

const KpiCard: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
    <BlurView intensity={20} tint="dark" style={styles.kpiCard}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiValue}>{value}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
    </BlurView>
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

const EmptyState: React.FC<{ message: string; cta?: string; onCta?: () => void }> = ({ message, cta, onCta }) => (
    <View style={styles.emptyState}>
        <Ionicons name="analytics-outline" size={32} color="rgba(255,255,255,0.15)" />
        <Text style={styles.emptyText}>{message}</Text>
        {cta && onCta && (
            <TouchableOpacity style={styles.ctaButton} onPress={onCta}>
                <Ionicons name="heart-outline" size={14} color="#10B981" />
                <Text style={styles.ctaText}>{cta}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#020617' },
    safeBlur: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
    scrollContent: { paddingHorizontal: 20 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
    },
    backButton: { width: 36, height: 36, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },
    loadingContainer: { alignItems: 'center', paddingTop: 80, gap: 16 },
    loadingText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },

    // KPI
    kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
    kpiCard: {
        flex: 1, alignItems: 'center', paddingVertical: 14,
        borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden', gap: 2,
    },
    kpiIcon: { fontSize: 18 },
    kpiValue: { fontSize: 20, fontWeight: '900', color: '#FFF' },
    kpiLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '700', textAlign: 'center' },

    // Section header
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center',
        gap: 6, marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
    },

    // Charts
    chartCard: {
        borderRadius: 20, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
        overflow: 'hidden',
    },
    chart: { borderRadius: 12 },
    chartLegend: {
        fontSize: 10, color: 'rgba(255,255,255,0.35)',
        textAlign: 'center', marginTop: 8, fontWeight: '600',
    },

    // HRV custom bars
    hrvBarsContainer: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 4 },
    hrvBarItem: { flex: 1, alignItems: 'center', gap: 4 },
    hrvBarValue: { fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: '700' },
    hrvBarTrack: { flex: 1, width: '80%', flexDirection: 'column-reverse' },
    hrvBarFill: { borderRadius: 4, minHeight: 4 },
    hrvBarLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },

    // Stats row
    statsRow: {
        borderRadius: 20, padding: 16, marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
        overflow: 'hidden', gap: 10,
    },
    statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
    statValue: { fontSize: 14, fontWeight: '800', color: '#FFF' },
    statDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },

    // Insight
    insightCard: {
        borderRadius: 20, padding: 20, marginBottom: 16,
        borderWidth: 1, overflow: 'hidden',
    },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    insightIcon: { fontSize: 22 },
    insightTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 0.3 },
    insightBody: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },

    // Empty state
    emptyState: { alignItems: 'center', gap: 10, paddingVertical: 20 },
    emptyText: { fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
    ctaButton: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 16,
        paddingVertical: 8, borderRadius: 20, borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.25)', marginTop: 4,
    },
    ctaText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
});

export default WeeklyReportScreen;
