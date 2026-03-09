import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { OasisMeter } from '../Oasis/OasisMeter';
import { OasisCalendar } from '../Oasis/OasisCalendar';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface HomeDashboardProps {
    dailyProgress: number;
    statsProgress: number;
    todayStats: { minutes: number; sessionCount: number };
    stats: { minutes: number; sessionCount: number; activity: { day: string; minutes: number }[] };
    timeRange: 'weekly' | 'monthly';
    handleRangeChange: (range: 'weekly' | 'monthly') => void;
    isLoadingStats: boolean;
    visualMode: 'healing' | 'growth';
    currentMonth: number;
    currentYear: number;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    getMonthName: (m: number) => string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
    dailyProgress, statsProgress, todayStats, stats, timeRange, handleRangeChange, isLoadingStats,
    visualMode, currentMonth, currentYear, handlePrevMonth, handleNextMonth, getMonthName
}) => {
    return (
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
                                progress={statsProgress}
                                size={70}
                                label={timeRange === 'weekly' ? "SEM" : "MES"}
                                accentColor={theme.colors.primary}
                            />
                        </View>
                        <View style={styles.dashboardSeparator} />
                        <View style={[styles.dashboardStats, { justifyContent: 'center', gap: 12, marginLeft: 8 }]}>
                            <View style={styles.dashboardStatItem}>
                                <Ionicons name="time" size={18} color={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'} />
                                <Text style={styles.dashboardStatValue}>
                                    {isLoadingStats ? "..." : todayStats.minutes} <Text style={styles.dashboardStatUnit}>m Hoy</Text>
                                </Text>
                            </View>
                            <View style={styles.dashboardStatItem}>
                                <Ionicons name="stats-chart" size={18} color={theme.colors.primary} />
                                <Text style={styles.dashboardStatValue}>
                                    {isLoadingStats ? "..." : stats.minutes} <Text style={styles.dashboardStatUnit}>m {timeRange === 'weekly' ? 'Sem' : 'Mes'}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* SELECTOR SEMANAL/MENSUAL */}
                    <View style={styles.rangeSelectorContainer}>
                        <TouchableOpacity
                            onPress={() => handleRangeChange('weekly')}
                            style={[styles.rangePill, timeRange === 'weekly' && styles.rangePillActive]}
                        >
                            <Text style={[styles.rangeText, timeRange === 'weekly' && styles.rangeTextActive]}>SEMANAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleRangeChange('monthly')}
                            style={[styles.rangePill, timeRange === 'monthly' && styles.rangePillActive]}
                        >
                            <Text style={[styles.rangeText, timeRange === 'monthly' && styles.rangeTextActive]}>MENSUAL</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoadingStats ? (
                        <View style={{ height: timeRange === 'monthly' ? 240 : 60, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={visualMode === 'healing' ? '#2DD4BF' : '#FBBF24'} size="small" />
                        </View>
                    ) : (
                        <>
                            {timeRange === 'weekly' ? (
                                <View style={styles.weeklyDotsContainer}>
                                    {stats.activity.map((item, index) => {
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
                                                    isToday && { borderWidth: 1.2, borderColor: '#FFF' }
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
                            ) : (
                                <View style={{ marginTop: 12 }}>
                                    <OasisCalendar
                                        data={stats.activity}
                                        variant={visualMode === 'healing' ? 'healing' : 'growth'}
                                        monthTitle={`${getMonthName(currentMonth)} ${currentYear}`}
                                        onPrevMonth={handlePrevMonth}
                                        onNextMonth={handleNextMonth}
                                    />
                                </View>
                            )}
                        </>
                    )}
                </BlurView>
                <View style={styles.innerGlassBorder} pointerEvents="none" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        padding: 24,
        paddingBottom: 20,
    },
    dashboardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dashboardSeparator: {
        height: 60,
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 16,
    },
    dashboardStats: {
        flex: 1,
    },
    dashboardStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dashboardStatValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        fontFamily: 'Outfit_800ExtraBold',
    },
    dashboardStatUnit: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    rangeSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        padding: 4,
        marginTop: 24,
        marginBottom: 8,
    },
    rangePill: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    rangePillActive: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    rangeText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '800',
        fontFamily: 'Outfit_800ExtraBold',
        letterSpacing: 0.5,
    },
    rangeTextActive: {
        color: '#FFF',
    },
    weeklyDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 4,
    },
    dotItem: {
        alignItems: 'center',
        gap: 8,
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    innerGlassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    }
});
