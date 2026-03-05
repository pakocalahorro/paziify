import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface ChartDataPoint {
    day: string; // ISO date string or just YYYY-MM-DD
    value: number; // e.g., minutes meditated
}

interface OasisChartProps {
    data: { day: string; minutes: number }[];
    color?: string;
    height?: number;
    showLabels?: boolean;
    isMonthly?: boolean; // New prop to handle higher density
}

/**
 * Universal Bar Chart for PDS v3.0
 * Features Glassmorphism backdrops, Outfit typography, and animated bars.
 */
export const OasisChart: React.FC<OasisChartProps> = ({
    data,
    color = theme.colors.primary,
    height = 200,
    showLabels = true,
    isMonthly = false
}) => {
    const [containerWidth, setContainerWidth] = React.useState(0);

    const maxVal = Math.max(...data.map(d => d.minutes), 5);
    const LABEL_HEIGHT = showLabels ? 25 : 0;
    const CHART_HEIGHT = height - LABEL_HEIGHT;

    // Calculate bar width based on container width
    const availableWidth = containerWidth > 0 ? containerWidth : (Dimensions.get('window').width - 80);
    const barWidth = isMonthly ? (availableWidth / data.length) : (availableWidth / 7) - 8;
    const borderRadius = isMonthly ? 2 : 8;

    const onLayout = (event: any) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    return (
        <View style={[styles.container, { height }]} onLayout={onLayout}>
            {/* Chart Area */}
            <View style={[styles.chartArea, { height: CHART_HEIGHT }]}>
                {data.map((item, index) => {
                    const barHeight = (item.minutes / maxVal) * CHART_HEIGHT;
                    return (
                        <View key={`bar-${index}`} style={[styles.barContainerBase, { width: barWidth }]}>
                            <Animated.View
                                entering={FadeInDown.delay(isMonthly ? 0 : index * 20).springify()}
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max(barHeight, 4), // Min height for visibility
                                        backgroundColor: color,
                                        borderRadius,
                                        opacity: item.minutes === 0 ? 0.05 : 1,
                                    }
                                ]}
                            />
                        </View>
                    );
                })}
            </View>

            {/* Labels Area */}
            {showLabels && (
                <View style={[styles.labelsArea, { height: LABEL_HEIGHT }]}>
                    {data.map((item, index) => {
                        // Better label logic for variety of lengths
                        let shouldShow = false;
                        if (!isMonthly) {
                            shouldShow = true; // Always show in weekly
                        } else {
                            // En mensual, mostrar cada 7 días para dar referencia semanal
                            shouldShow = (index % 7 === 0) || (index === data.length - 1);
                        }

                        if (!shouldShow) return <View key={`gap-${index}`} style={{ width: barWidth }} />;

                        return (
                            <View key={`label-${index}`} style={{ width: barWidth, alignItems: 'center' }}>
                                <Text style={styles.label} numberOfLines={1}>
                                    {item.day}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
    },
    barWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFF',
    },
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
        paddingHorizontal: 10,
    },
    labelsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 4,
    },
    barContainerBase: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
    },
    bar: {
        width: '100%',
        borderRadius: 8,
    },
    dayText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
    },
});
