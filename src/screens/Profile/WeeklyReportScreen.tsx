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
import { OasisLineChart } from '../../components/Oasis/OasisLineChart';
import { calculateResilienceLevel } from '../../utils/resilienceUtils';
import ResilienceTree from '../../components/Profile/ResilienceTree';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, Screen.WEEKLY_REPORT>;
};

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
    const [activity, setActivity] = useState<any[]>([]); // Para la gráfica (Pattern o Mensual)
    const [realWeeklyActivity, setRealWeeklyActivity] = useState<any[]>([]); // Para KPIs semanales reales
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
                // Fetch basic data
                const [cardioScans, fetchedActivity, weeklyReal] = await Promise.all([
                    CardioService.getHistory(timeRange === 'weekly' ? 7 : 31),
                    timeRange === 'weekly'
                        ? analyticsService.getWeekdayHistoricalPattern(user.id)
                        : analyticsService.getMonthlyActivity(user.id, currentMonth, currentYear),
                    timeRange === 'weekly' 
                        ? analyticsService.getWeeklyActivity(user.id) 
                        : Promise.resolve([])
                ]);

                setScans(cardioScans);
                setActivity(fetchedActivity);
                if (timeRange === 'weekly') setRealWeeklyActivity(weeklyReal);

                // Calcular mins para KPIs basados en datos REALES (no promedios)
                const sourceForKpis = timeRange === 'weekly' ? weeklyReal : fetchedActivity;
                const mins = sourceForKpis.reduce((acc: number, d) => acc + d.minutes, 0);
                const best = cardioScans.length > 0 ? Math.max(...cardioScans.map((s: CardioResult) => s.hrv)) : 0;

                setStats({
                    minutes: Math.round(mins),
                    activeDays: sourceForKpis.filter((d) => d.minutes > 0).length,
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
    const lightPoints = userState.resilienceLight || 0;
    const { currentLevel, activeLevelData } = calculateResilienceLevel(lightPoints);

    // Helper para fecha local (evita desfases UTC)
    const toLocalDateStr = (d: Date) => {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Helper para obtener los 7 días de la semana actual (Lunes a Domingo)
    const currentWeekDays = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);
        monday.setHours(12, 0, 0, 0);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(d);
        }
        return days;
    }, []);
    
    // Preparar datos para HRV Diferencial (D-3)
    const hrvBaselineData = useMemo(() => {
        if (timeRange === 'monthly') {
            return [1, 2, 3, 4].map(week => {
                const scansWeek = scans.filter(s => {
                    const d = new Date(s.timestamp);
                    const isPost = (s as any).scan_context === 'post_session' || s.context === 'post_session';
                    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && !isPost) {
                        const day = d.getDate();
                        if (week === 1 && day <= 7) return true;
                        if (week === 2 && day > 7 && day <= 14) return true;
                        if (week === 3 && day > 14 && day <= 21) return true;
                        if (week === 4 && day > 21) return true;
                    }
                    return false;
                });
                const avg = scansWeek.length > 0 ? scansWeek.reduce((acc, s) => acc + s.hrv, 0) / scansWeek.length : null;
                return { label: `S${week}`, value: avg ? Math.round(avg) : null };
            });
        }
        return currentWeekDays.map(d => {
            const dateStr = toLocalDateStr(d);
            const scansDay = scans.filter(s => {
                const isPost = (s as any).scan_context === 'post_session' || s.context === 'post_session';
                return toLocalDateStr(new Date(s.timestamp)) === dateStr && !isPost;
            });
            const avg = scansDay.length > 0 ? scansDay.reduce((acc, s) => acc + s.hrv, 0) / scansDay.length : null;
            return { label: DAY_NAMES[d.getDay()], value: avg ? Math.round(avg) : null };
        });
    }, [scans, currentWeekDays, timeRange, currentMonth, currentYear]);

    const hrvPostData = useMemo(() => {
        if (timeRange === 'monthly') {
            return [1, 2, 3, 4].map(week => {
                const scansWeek = scans.filter(s => {
                    const d = new Date(s.timestamp);
                    const isPost = (s as any).scan_context === 'post_session' || s.context === 'post_session';
                    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && isPost) {
                        const day = d.getDate();
                        if (week === 1 && day <= 7) return true;
                        if (week === 2 && day > 7 && day <= 14) return true;
                        if (week === 3 && day > 14 && day <= 21) return true;
                        if (week === 4 && day > 21) return true;
                    }
                    return false;
                });
                const avg = scansWeek.length > 0 ? scansWeek.reduce((acc, s) => acc + s.hrv, 0) / scansWeek.length : null;
                return { label: `S${week}`, value: avg ? Math.round(avg) : null };
            });
        }
        return currentWeekDays.map(d => {
            const dateStr = toLocalDateStr(d);
            const scansDay = scans.filter(s => {
                const isPost = (s as any).scan_context === 'post_session' || s.context === 'post_session';
                return toLocalDateStr(new Date(s.timestamp)) === dateStr && isPost;
            });
            const avg = scansDay.length > 0 ? scansDay.reduce((acc, s) => acc + s.hrv, 0) / scansDay.length : null;
            return { label: DAY_NAMES[d.getDay()], value: avg ? Math.round(avg) : null };
        });
    }, [scans, currentWeekDays, timeRange, currentMonth, currentYear]);

    // Preparar datos para Mood Score (C-7)
    const moodData = useMemo(() => {
        if (timeRange === 'monthly') {
            return [1, 2, 3, 4].map(week => {
                const actWeek = activity.filter(a => {
                    const parts = a.day.split('-');
                    if (parts.length === 3) {
                        const day = parseInt(parts[2], 10);
                        if (week === 1 && day <= 7) return true;
                        if (week === 2 && day > 7 && day <= 14) return true;
                        if (week === 3 && day > 14 && day <= 21) return true;
                        if (week === 4 && day > 21) return true;
                    }
                    return false;
                });
                const validMoods = actWeek.filter(a => a.avgMood !== undefined && a.avgMood > 0);
                const avg = validMoods.length > 0 ? validMoods.reduce((acc, a) => acc + a.avgMood, 0) / validMoods.length : null;
                return { label: `S${week}`, value: avg };
            });
        }
        return currentWeekDays.map(d => {
            const dateStr = toLocalDateStr(d);
            const match = activity.find(a => a.day.startsWith(dateStr));
            return {
                label: DAY_NAMES[d.getDay()], 
                value: (match?.avgMood !== undefined && match.avgMood > 0) ? match.avgMood : null 
            };
        });
    }, [activity, currentWeekDays, timeRange]);

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
                        if (index === 1) navigation.goBack(); // Resuelve la caída de performance manteniendo la caché del bottom tab
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
                        {/* HERO: Celebración de Prestigio */}
                        <View style={[styles.heroCard, { borderColor: activeLevelData.color + '40' }]}>
                            <LinearGradient
                                colors={[activeLevelData.color + '15', 'transparent']}
                                style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.heroContent}>
                                <View style={styles.heroTextContent}>
                                    <Text style={styles.heroTitle}>Eres Nivel {currentLevel}</Text>
                                    <Text style={[styles.heroSubtitle, { color: activeLevelData.color }]}>
                                        {activeLevelData.name.toUpperCase()}
                                    </Text>
                                    <Text style={styles.heroBody}>
                                        {timeRange === 'weekly' 
                                            ? "Tu constancia semanal ha llenado de luz tus raíces."
                                            : "Tu dedicación mensual fortalece tu oasis interior."}
                                    </Text>
                                </View>
                                <View style={[styles.heroTreeContainer, { overflow: 'visible' }]}>
                                    <View style={{ transform: [{ scale: 0.65 }], width: 160, alignItems: 'center', justifyContent: 'center' }}>
                                        <ResilienceTree size={160} lightPoints={lightPoints} hideBlooms={false} isStatic={true} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* KPI Resumen */}
                        <View style={styles.kpiRow}>
                            <KpiCard icon="flame" color="#FBBF24" value={`${userState.streak}`} label="días racha" />
                            <KpiCard icon="time" color={theme.colors.primary} value={`${stats.minutes}`} label={timeRange === 'weekly' ? "min semana" : "min mes"} />
                            <KpiCard icon="leaf" color="#2DD4BF" value={`${stats.activeDays}`} label="días activos" />
                            <KpiCard icon="pulse" color="#10B981" value={stats.bestHrv > 0 ? `${stats.bestHrv}` : '—'} label="mejor hrv" />
                        </View>

                        {/* Actividad / Patrones */}
                        <SectionHeader title={timeRange === 'weekly' ? "Media Histórica Diaria (min)" : "Actividad Mensual"} icon="stats-chart-outline" />
                        <View style={styles.chartCard}>
                            <BlurView intensity={70} tint="dark" style={styles.chartBlur}>
                                {timeRange === 'weekly' ? (
                                    <OasisChart
                                    data={currentWeekDays.map(d => {
                                        const dateStr = toLocalDateStr(d);
                                        const match = activity.find(a => a.day.startsWith(dateStr));
                                        return {
                                            day: DAY_NAMES[d.getDay()],
                                            minutes: match ? match.minutes : 0,
                                            isChallenge: match ? match.isChallenge : false 
                                        };
                                    })}
                                    height={180}
                                    isMonthly={false}
                                    target={dailyGoal}
                                    infoText="Esta gráfica analiza tu historial completo para mostrar cuánto tiempo sueles dedicar a meditar según el día de la semana. Te ayuda a identificar qué días tienes más disponibilidad o disciplina (tu 'Sintonía de Calma')."
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
                                        ? "Media histórica por día de la semana (hábitos)."
                                        : `Tu evolución de calma durante ${getMonthName(currentMonth)}.`}
                                </Text>
                            </BlurView>
                            <View style={styles.innerGlassBorder} pointerEvents="none" />
                        </View>

                        {/* Bio-Ritmo HRV Diferencial (D-3) */}
                        <SectionHeader title="Diferencia de Recuperación HRV" icon="pulse-outline" accent="#10B981" />
                        <View style={styles.chartCard} >
                            <BlurView intensity={70} tint="dark" style={styles.chartBlur}>
                                {/* Indicador delta arriba del gráfico */}
                                <HrvDeltaBadge baseline={hrvBaselineData} post={hrvPostData} />
                                <OasisLineChart
                                    data={hrvBaselineData}
                                    data2={hrvPostData}
                                    color="#3B82F6"
                                    color2="#10B981"
                                    height={160}
                                    minY={30}
                                    maxY={100}
                                    infoText="Compara tu HRV antes (azul) y después (verde) de la sesión. Una línea verde por encima de la azul indica que tu sistema nervioso se ha equilibrado y recuperado."
                                />
                                <View style={styles.hrvLegendRow}>
                                    <View style={styles.legendItem}>
                                        <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: '#3B82F6', marginRight: 6 }} />
                                        <Text style={styles.legendText}>🌅 Antes de meditar</Text>
                                    </View>
                                    <View style={styles.legendItem}>
                                        <View style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: '#10B981', marginRight: 6 }} />
                                        <Text style={styles.legendText}>✨ Después de meditar</Text>
                                    </View>
                                </View>
                                <Text style={styles.chartLegend}>
                                    Cuanto más alta la línea verde, más recuperado estaba tu sistema nervioso tras la sesión.
                                </Text>
                            </BlurView>
                            <View style={styles.innerGlassBorder} pointerEvents="none" />
                        </View>

                        {/* Tendencia de Ánimo (C-7) */}
                        <SectionHeader title="Sintonía Emocional" icon="happy-outline" accent="#C084FC" />
                        <View style={styles.chartCard} >
                            <BlurView intensity={70} tint="dark" style={styles.chartBlur}>
                                <OasisLineChart
                                    data={moodData}
                                    yAxisLabels={['cloud-sharp', 'leaf-sharp', 'sunny-sharp']}
                                    color="#C084FC"
                                    height={140}
                                    minY={1}
                                    maxY={5}
                                    infoText="Evolución de tu bienestar percibido. Los iconos representan niveles de calma desde Bajo (Nube) hasta Pleno (Sol). La constancia es la clave."
                                />
                                <Text style={styles.chartLegend}>
                                    Cuanto más alta la línea, mejor tu estado emocional ese día. Una línea en ascenso es señal de progreso real.
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
        <View style={[styles.innerGlassBorder, { borderRadius: 16 }]} pointerEvents="none" />
    </View>
);

const SectionHeader: React.FC<{ title: string; icon: string; accent?: string }> = ({ title, icon, accent = theme.colors.primary }) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={16} color={accent} />
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    </View>
);

const HrvDeltaBadge: React.FC<{
    baseline: { label: string; value: number | null }[];
    post: { label: string; value: number | null }[];
}> = ({ baseline, post }) => {
    // Calculamos el promedio ignorando los valores nulos
    const baselineArr = baseline.map(d => d.value).filter((v): v is number => v !== null && v > 0);
    const postArr = post.map(d => d.value).filter((v): v is number => v !== null && v > 0);
    
    const baselineAvg = baselineArr.length > 0 ? baselineArr.reduce((acc, v) => acc + v, 0) / baselineArr.length : 0;
    const postAvg = postArr.length > 0 ? postArr.reduce((acc, v) => acc + v, 0) / postArr.length : 0;

    if (baselineAvg === 0 || postAvg === 0) return null;

    const delta = Math.round(postAvg - baselineAvg);
    const isPositive = delta >= 0;
    const label = isPositive ? `+${delta} ms de recuperación` : `${delta} ms esta semana`;

    return (
        <View style={[styles.deltaBadge, { backgroundColor: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
            <Ionicons name={isPositive ? 'trending-up' : 'trending-down'} size={12} color={isPositive ? '#10B981' : '#EF4444'} />
            <Text style={[styles.deltaBadgeText, { color: isPositive ? '#10B981' : '#EF4444' }]}>{label}</Text>
        </View>
    );
};

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

    heroCard: {
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1.5,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    heroTextContent: {
        flex: 1,
        paddingRight: 10,
    },
    heroTreeContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    heroTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 24,
        color: '#FFF',
        marginBottom: 2,
    },
    heroSubtitle: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 11,
        letterSpacing: 2,
        marginBottom: 8,
    },
    heroBody: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 18,
    },

    kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
    kpiCardContainer: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
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

    // HRV Legend
    hrvLegendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    deltaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
        marginBottom: 8,
    },
    deltaBadgeText: {
        fontSize: 11,
        fontFamily: 'Outfit_700Bold',
    },
});

export default WeeklyReportScreen;
