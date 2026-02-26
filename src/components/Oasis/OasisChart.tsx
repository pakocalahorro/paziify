import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ChartDataPoint {
    day: string; // ISO date string or just YYYY-MM-DD
    value: number; // e.g., minutes meditated
}

interface OasisChartProps {
    data: ChartDataPoint[];
    title?: string;
    accentColor?: string;
}

/**
 * Universal Bar Chart for PDS v3.0
 * Features Glassmorphism backdrops, Outfit typography, and animated bars.
 */
export const OasisChart: React.FC<OasisChartProps> = ({
    data,
    title = "TU RITMO SEMANAL",
    accentColor = "#2DD4BF" // Default Healing Green
}) => {
    // Determine the maximum value to scale the bars correctly. Minimum scale of 30.
    const maxValue = Math.max(...data.map(d => d.value), 30);

    const dayLabels: Record<string, string> = {
        '0': 'D', '1': 'L', '2': 'M', '3': 'X', '4': 'J', '5': 'V', '6': 'S'
    };

    return (
        <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
            {!!title && <Text style={styles.title}>{title}</Text>}

            <View style={styles.chartArea}>
                {data.map((item, index) => {
                    // Safe date parsing ensuring local time alignment
                    const dateObj = new Date(item.day.includes('T') ? item.day : `${item.day}T12:00:00`);
                    const dayNum = dateObj.getDay();
                    const label = dayLabels[dayNum.toString()] || '?';

                    // Cap at 100%, minimum 10% for visual presence if value > 0
                    const heightPercent = item.value > 0
                        ? Math.max((item.value / maxValue) * 100, 10)
                        : 0;

                    const today = new Date();
                    const isToday = dateObj.getDate() === today.getDate() &&
                        dateObj.getMonth() === today.getMonth() &&
                        dateObj.getFullYear() === today.getFullYear();

                    return (
                        <View key={index} style={styles.columnContainer}>
                            <View style={styles.barContainer}>
                                {item.value > 0 && (
                                    <Animated.View
                                        entering={FadeInDown.delay(index * 100).springify()}
                                        style={[
                                            styles.bar,
                                            { height: `${heightPercent}%`, shadowColor: accentColor }
                                        ]}
                                    >
                                        <LinearGradient
                                            colors={[accentColor, `${accentColor}80`]}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    </Animated.View>
                                )}
                            </View>
                            <Text style={[
                                styles.dayText,
                                item.value > 0 && { color: 'rgba(255,255,255,0.8)' },
                                isToday && { color: accentColor, fontFamily: 'Outfit_800ExtraBold', fontSize: 13 }
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    chartArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 80, // Slightly taller for better visual
    },
    columnContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barContainer: {
        height: 60,
        width: 14,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 7,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginBottom: 10,
    },
    bar: {
        width: '100%',
        borderRadius: 7,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    dayText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
    },
});
