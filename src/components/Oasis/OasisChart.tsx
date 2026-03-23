import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ChartDataPoint {
    day: string; // ISO date string or just YYYY-MM-DD
    value: number; // e.g., minutes meditated
}

interface OasisChartProps {
    data: { day: string; minutes: number; isChallenge?: boolean }[];
    color?: string;
    challengeColor?: string;
    height?: number;
    showLabels?: boolean;
    isMonthly?: boolean; // New prop to handle higher density
    target?: number; // Target for Y-axis scale (e.g., 20)
    infoText?: string;
}

/**
 * Universal Bar Chart for PDS v3.0
 * Features Glassmorphism backdrops, Outfit typography, and animated bars.
 */
export const OasisChart: React.FC<OasisChartProps> = ({
    data,
    color = theme.colors.primary,
    challengeColor = '#FBBF24',
    height = 200,
    showLabels = true,
    isMonthly = false,
    target = 20,
    infoText
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    // Si no hay datos significativos, escalamos al target para dar contexto
    const rawMax = Math.max(...data.map(d => d.minutes), 0);
    const maxVal = Math.max(rawMax, target);
    
    const LABEL_HEIGHT = showLabels ? 30 : 0;
    const CHART_HEIGHT = height - LABEL_HEIGHT;

    // Calculate bar width based on container width
    const availableWidth = containerWidth > 0 ? containerWidth : (Dimensions.get('window').width - 80);
    const barWidth = isMonthly ? (availableWidth / data.length) : (availableWidth / 7) - 10;
    const borderRadius = isMonthly ? 2 : 8;

    const onLayout = (event: any) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    return (
        <View style={[styles.container, { height }]} onLayout={onLayout}>
            {infoText && (
                <TouchableOpacity 
                    onPress={() => setShowInfo(true)} 
                    style={styles.infoButton}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                    <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
            )}

            <View style={{ height: CHART_HEIGHT, width: '100%', justifyContent: 'flex-end' }}>
                {/* Y-Axis Reference Lines */}
                {[0, 0.5, 1].map((p, i) => {
                    const yVal = Math.round(maxVal * p);
                    const bottom = p * (CHART_HEIGHT - 20); // Margen superior para el label del 100%
                    return (
                        <View key={`grid-${i}`} style={[styles.gridLineContainer, { bottom: bottom + 10 }]}>
                            <Text style={styles.gridLabel}>{yVal}</Text>
                            <View style={styles.gridLine} />
                        </View>
                    );
                })}

                <View style={[styles.barsWrapper, { paddingHorizontal: isMonthly ? 0 : 5 }]}>
                    {data.map((item, index) => {
                        const barHeight = (item.minutes / maxVal) * (CHART_HEIGHT - 20);
                        return (
                            <View key={`bar-${index}`} style={[styles.barContainerBase, { width: barWidth }]}>
                                <Animated.View
                                    entering={FadeInDown.delay(isMonthly ? 0 : index * 20).springify()}
                                    style={[
                                        styles.bar,
                                        {
                                            height: Math.max(barHeight, 4),
                                            backgroundColor: item.isChallenge ? challengeColor : color,
                                            borderRadius,
                                            opacity: item.minutes === 0 ? 0.08 : 1,
                                            shadowColor: item.isChallenge ? challengeColor : color,
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: item.minutes > 0 ? 0.3 : 0,
                                            shadowRadius: 4,
                                            elevation: item.minutes > 0 ? 2 : 0,
                                        }
                                    ]}
                                >
                                    {item.minutes > 0 && !isMonthly && (
                                        <Text style={styles.barValueText}>{Math.round(item.minutes)}</Text>
                                    )}
                                </Animated.View>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Labels Area */}
            {showLabels && (
                <View style={[styles.labelsArea, { height: LABEL_HEIGHT }]}>
                    {data.map((item, index) => {
                        let shouldShow = !isMonthly || (index % 7 === 0) || (index === data.length - 1);
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
            {/* Info Overlay */}
            {showInfo && infoText && (
                <Animated.View 
                    entering={FadeIn.duration(300)} 
                    exiting={FadeOut.duration(200)} 
                    style={[StyleSheet.absoluteFill, { zIndex: 100 }]}
                >
                    <BlurView intensity={90} tint="dark" style={styles.infoOverlay}>
                        <TouchableOpacity style={styles.closeOverlay} onPress={() => setShowInfo(false)}>
                            <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        <View style={styles.infoContent}>
                            <Ionicons name="information-circle" size={32} color={color} style={{ marginBottom: 12 }} />
                            <Text style={styles.infoTitle}>Sobre esta gráfica</Text>
                            <Text style={styles.infoText}>{infoText}</Text>
                        </View>
                    </BlurView>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    barsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        zIndex: 1,
        paddingLeft: 24, // Espacio para labels de eje Y
        paddingRight: 10,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Outfit_800ExtraBold',
        color: 'rgba(255,255,255,0.5)',
        marginTop: 8,
    },
    labelsArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 24, // DEBE COINCIDIR CON barsWrapper
        paddingRight: 10,
    },
    barContainerBase: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 8,
    },
    barValueText: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 9,
        color: '#FFF',
        textAlign: 'center',
        width: '100%',
        position: 'absolute',
        top: -16,
    },
    gridLineContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 0,
    },
    gridLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginLeft: 4,
    },
    gridLabel: {
        fontSize: 10,
        fontFamily: 'Outfit_800ExtraBold',
        color: 'rgba(255,255,255,0.25)',
        width: 18,
        textAlign: 'right',
    },
    infoButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 10,
        padding: 10,
    },
    infoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
        zIndex: 100, // EL OVERLAY DEBE ESTAR ARRIBA
        elevation: 10, // PARA ANDROID/WINDOWS
    },
    infoContent: {
        alignItems: 'center',
    },
    infoTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Outfit_800ExtraBold',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
    },
    closeOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 20,
    }
});
