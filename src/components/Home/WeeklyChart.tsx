import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../constants/theme';

interface WeeklyChartProps {
    data: { day: string; minutes: number }[];
    color: string;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, color }) => {
    const maxMinutes = Math.max(...data.map(d => d.minutes), 30); // At least 30 for scale

    // Sort data to show L, M, X, J, V, S, D based on current date
    // (Actual logic would depend on the data provider, assuming it's already sorted)

    const dayLabels: Record<string, string> = {
        '0': 'D', '1': 'L', '2': 'M', '3': 'X', '4': 'J', '5': 'V', '6': 'S'
    };

    return (
        <BlurView intensity={15} tint="dark" style={styles.glassContainer}>
            <Text style={styles.title}>TU RITMO SEMANAL</Text>
            <View style={styles.chartArea}>
                {data.map((item, index) => {
                    // Use T12:00:00 to ensure the local day matches the date string regardless of TZ
                    const dateObj = new Date(item.day.includes('T') ? item.day : `${item.day}T12:00:00`);
                    const dayNum = dateObj.getDay();
                    const label = dayLabels[dayNum.toString()];
                    const heightPercent = Math.max((item.minutes / maxMinutes) * 100, 10); // Min 10% for visibility

                    const today = new Date();
                    const isToday = dateObj.getDate() === today.getDate() &&
                        dateObj.getMonth() === today.getMonth() &&
                        dateObj.getFullYear() === today.getFullYear();

                    return (
                        <View key={index} style={styles.columnContainer}>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${heightPercent}%`,
                                            backgroundColor: item.minutes > 0 ? color : 'rgba(255,255,255,0.05)',
                                            shadowColor: color,
                                            shadowOpacity: item.minutes > 0 ? 0.5 : 0,
                                            shadowRadius: 10,
                                            elevation: item.minutes > 0 ? 5 : 0,
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={[
                                styles.dayText,
                                item.minutes > 0 && { color: 'rgba(255,255,255,0.6)' },
                                isToday && { color: color, fontWeight: '900', fontSize: 11 }
                            ]}>
                                {label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    glassContainer: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(2, 6, 23, 0.2)',
    },
    title: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 2,
        marginBottom: 15,
        textAlign: 'left',
        marginLeft: 5,
    },
    chartArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 80,
    },
    columnContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barContainer: {
        height: 80,
        width: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 6,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginBottom: 8,
    },
    bar: {
        width: '100%',
        borderRadius: 6,
    },
    dayText: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.2)',
    },
});

export default WeeklyChart;
