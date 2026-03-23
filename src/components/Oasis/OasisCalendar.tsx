import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface OasisCalendarProps {
    data: { day: string; minutes: number }[];
    variant?: 'healing' | 'growth';
    monthTitle?: string;
    onPrevMonth?: () => void;
    onNextMonth?: () => void;
    containerPadding?: number; // Total horizontal padding/margins outside the calendar
    type?: 'minutes' | 'hrv'; // Data type for intensity mapping
}

/**
 * Oasis Calendar v3.0 (Natural Month)
 * Displays a 7-column grid aligned to the real calendar.
 */
export const OasisCalendar: React.FC<OasisCalendarProps> = ({
    data,
    variant = 'healing',
    monthTitle,
    onPrevMonth,
    onNextMonth,
    type = 'minutes'
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const accentColor = variant === 'healing' ? '#2DD4BF' : '#FBBF24';
    const hrvColor = '#10B981';
    const finalAccentColor = type === 'hrv' ? hrvColor : accentColor;

    // Day labels for the header
    const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    // Helper to get opacity based on intensity
    const getIntensityOpacity = (value: number) => {
        if (value === 0) return 0.1;

        if (type === 'hrv') {
            // HRV thresholds: Stress (<30), Normal (30-60), Good (60-80), Excellent (>80)
            if (value < 40) return 0.4;
            if (value < 60) return 0.6;
            if (value < 80) return 0.8;
            return 1;
        } else {
            // Minutes thresholds
            if (value < 5) return 0.4;
            if (value < 15) return 0.6;
            if (value < 30) return 0.8;
            return 1;
        }
    };

    const firstDayStr = data[0]?.day;
    const firstDate = firstDayStr ? new Date(firstDayStr + 'T12:00:00') : new Date();
    const firstDayOfWeek = firstDate.getDay();
    // Monday = 1, Sunday = 0. Map to 0=Mon...6=Sun
    const leadingEmptyBlocks = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Fixed math for 7 columns based on actual width
    const gridGap = 6;
    const availableWidth = containerWidth > 0 ? containerWidth : Dimensions.get('window').width - 40;
    const finalCellWidth = (availableWidth - (6 * gridGap)) / 7;

    const onLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <View style={styles.container} onLayout={onLayout}>
            {/* Header: Mes y Navegación */}
            {monthTitle && (
                <View style={styles.navHeader}>
                    <TouchableOpacity onPress={onPrevMonth} style={styles.navButton} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>

                    <Text style={styles.monthTitle}>{monthTitle.toUpperCase()}</Text>

                    <TouchableOpacity onPress={onNextMonth} style={styles.navButton} activeOpacity={0.7}>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Sub-Header: L M X J V S D */}
            <View style={styles.dayLabelsHeader}>
                {DAY_LABELS.map((label, i) => (
                    <Text
                        key={i}
                        style={[
                            styles.headerText,
                            { 
                                width: finalCellWidth,
                                marginRight: i === 6 ? 0 : 6 
                            }
                        ]}
                    >
                        {label}
                    </Text>
                ))}
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {/* Empty placeholders for alignment */}
                {Array.from({ length: leadingEmptyBlocks }).map((_, i) => (
                    <View key={`empty-${i}`} style={{ width: finalCellWidth, height: finalCellWidth, marginRight: i % 7 === 6 ? 0 : 6 }} />
                ))}

                {data.map((item, index) => {
                    const isToday = item.day === todayStr;
                    const hasActivity = item.minutes > 0;
                    const opacity = getIntensityOpacity(item.minutes);
                    const isLastInRow = (index + leadingEmptyBlocks + 1) % 7 === 0;

                    return (
                        <Animated.View
                            key={item.day}
                            entering={FadeIn.delay(index * 10)}
                            style={[
                                styles.dayBlock,
                                {
                                    width: finalCellWidth,
                                    height: finalCellWidth,
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: isLastInRow ? 0 : 6,
                                    marginBottom: 6,
                                },
                                isToday && styles.todayBlock,
                                hasActivity && styles.activeDayBlock
                            ]}
                        >
                            {/* Fondo con intensidad de actividad */}
                            {hasActivity && (
                                <View
                                    style={[
                                        StyleSheet.absoluteFill,
                                        { backgroundColor: finalAccentColor, opacity: opacity, borderRadius: 6 }
                                    ]}
                                />
                            )}

                            <Text style={styles.dayNumberText}>
                                {item.day.split('-').pop()}
                            </Text>

                            {hasActivity && (
                                <Text style={styles.minutesText}>
                                    {item.minutes}
                                </Text>
                            )}
                        </Animated.View>
                    );
                })}

                {/* Trailing placeholders to complete the 7-column grid line */}
                {Array.from({ length: (7 - ((leadingEmptyBlocks + data.length) % 7)) % 7 }).map((_, i) => (
                    <View key={`trailing-${i}`} style={[styles.dayBlock, { width: finalCellWidth, height: finalCellWidth, opacity: 0 }]} />
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{type === 'hrv' ? 'Stress' : 'Menos'}</Text>
                <View style={styles.legend}>
                    {(type === 'hrv' ? [30, 50, 70, 90] : [0, 5, 15, 30]).map((m, i) => (
                        <View
                            key={i}
                            style={[
                                styles.legendBlock,
                                { backgroundColor: finalAccentColor, opacity: getIntensityOpacity(m) }
                            ]}
                        />
                    ))}
                </View>
                <Text style={styles.footerText}>{type === 'hrv' ? 'Calma' : 'Más Calma'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 10,
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    navButton: {
        padding: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    monthTitle: {
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
        color: '#FFF',
        letterSpacing: 2,
    },
    dayLabelsHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
        paddingHorizontal: 0,
    },
    headerText: {
        fontSize: 9,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayBlock: {
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    dayNumberText: {
        position: 'absolute',
        top: 2,
        left: 3,
        fontSize: 7,
        fontFamily: 'Outfit_700Bold',
        color: '#FFF',
        opacity: 0.3,
    },
    minutesText: {
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        color: '#FFF',
        textAlign: 'center',
        includeFontPadding: false,
    },
    activeDayBlock: {
        // Removed shadows to avoid "double box" effect
    },
    todayBlock: {
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8,
    },
    footerText: {
        fontSize: 8,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
    },
    legend: {
        flexDirection: 'row',
        gap: 3,
    },
    legendBlock: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
});
