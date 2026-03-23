import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface DataPoint {
    label: string;
    value: number | null;
}

interface OasisLineChartProps {
    data: DataPoint[];
    data2?: DataPoint[]; // For dual series like HRV
    yAxisLabels?: string[]; // Custom labels/icons for Y axis
    color?: string;
    color2?: string;
    height?: number;
    minY?: number;
    maxY?: number;
    showDots?: boolean;
    bridgeGaps?: boolean;
    showArea?: boolean;
    infoText?: string;
}

/**
 * Premium Line Chart for PDS v3.0
 * Supports single or dual series with smooth SVG paths, gradients and area fill.
 */
export const OasisLineChart: React.FC<OasisLineChartProps> = ({
    data,
    data2,
    yAxisLabels,
    color = theme.colors.primary,
    color2 = '#10B981',
    height = 150,
    minY,
    maxY,
    showDots = true,
    bridgeGaps = true,
    showArea = true,
    infoText
}) => {
    const [width, setWidth] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    
    // Filtramos nulos para calcular escalas pero mantenemos el orden para el eje X
    const allValues = [
        ...data.map(d => d.value).filter((v): v is number => v !== null), 
        ...(data2 ? data2.map(d => d.value).filter((v): v is number => v !== null) : [])
    ];
    
    const calculatedMinY = minY !== undefined ? minY : (allValues.length > 0 ? Math.min(...allValues) : 0);
    const calculatedMaxY = maxY !== undefined ? maxY : (allValues.length > 0 ? Math.max(...allValues) : 10);
    const rangeY = (calculatedMaxY - calculatedMinY) || 1;

    const chartHeight = height - 40; 
    const paddingX = 45; 
    const paddingY = 15;

    const getX = (index: number, total: number) => {
        if (total <= 1) return width / 2;
        return paddingX + (index * (width - paddingX * 2)) / (total - 1);
    };

    const getY = (value: number) => {
        return chartHeight - paddingY - ((value - calculatedMinY) / rangeY) * (chartHeight - paddingY * 2);
    };

    const createPath = (points: DataPoint[], isArea = false) => {
        const validPoints = points
            .map((p, i) => ({ ...p, x: getX(i, points.length), index: i }))
            .filter((p): p is { label: string; value: number; x: number; index: number } => p.value !== null);
        
        if (validPoints.length < 1) return '';
        
        const firstPoint = validPoints[0];
        const lastPoint = validPoints[validPoints.length - 1];
        
        let d = `M ${firstPoint.x} ${getY(firstPoint.value)}`;
        
        for (let i = 1; i < validPoints.length; i++) {
            const p = validPoints[i];
            const prev = validPoints[i-1];
            const hasGap = p.index - prev.index > 1;

            if (hasGap && !bridgeGaps) {
                d += ` M ${p.x} ${getY(p.value)}`;
            } else {
                const cp1x = prev.x + (p.x - prev.x) / 2;
                d += ` C ${cp1x} ${getY(prev.value)}, ${cp1x} ${getY(p.value)}, ${p.x} ${getY(p.value)}`;
            }
        }

        if (isArea && validPoints.length > 1) {
            d += ` L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;
        }
        
        return d;
    };

    return (
        <View style={{ height, width: '100%', position: 'relative' }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
            {infoText && (
                <TouchableOpacity 
                    onPress={() => setShowInfo(true)} 
                    style={styles.infoButton}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                    <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
            )}
            {width > 0 && (
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
                            <Stop offset="0.8" stopColor={color} stopOpacity="0.05" />
                            <Stop offset="1" stopColor={color} stopOpacity="0" />
                        </LinearGradient>
                        <LinearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={color2} stopOpacity="0.25" />
                            <Stop offset="1" stopColor={color2} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Ejes Y y Cuadrícula */}
                    {[0, 0.5, 1].map((p, i) => {
                        const yVal = Math.round(calculatedMinY + rangeY * p);
                        const yPos = getY(calculatedMinY + rangeY * p);
                        const label = (yAxisLabels && yAxisLabels[i]) ? yAxisLabels[i] : yVal.toString();

                        return (
                            <React.Fragment key={`grid-${i}`}>
                                <Path
                                    d={`M ${paddingX} ${yPos} L ${width - paddingX} ${yPos}`}
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="1"
                                />
                                <View style={[styles.yLabelContainer, { top: yPos - 12 }]}>
                                    {label.length > 2 ? (
                                        <Ionicons name={label as any} size={18} color="rgba(255,255,255,0.6)" />
                                    ) : (
                                        <Text style={[styles.axisLabel, { fontSize: yAxisLabels ? 14 : 9 }]}>{label}</Text>
                                    )}
                                </View>
                            </React.Fragment>
                        );
                    })}

                    {/* Area Fills */}
                    {showArea && (
                        <>
                            <Path d={createPath(data, true)} fill="url(#areaGrad)" />
                            {data2 && <Path d={createPath(data2, true)} fill="url(#areaGrad2)" />}
                        </>
                    )}

                    {/* Main Lines */}
                    <Path
                        d={createPath(data)}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    
                    {data2 && (
                        <Path
                            d={createPath(data2)}
                            fill="none"
                            stroke={color2}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="6,4"
                        />
                    )}

                    {/* Dots & X-Labels */}
                    {data.map((p, i) => {
                        const x = getX(i, data.length);
                        return (
                            <React.Fragment key={`col-${i}`}>
                                <View style={[styles.xLabelContainer, { left: x - 15, top: chartHeight + 4 }]}>
                                    <Text style={styles.axisLabel}>{p.label}</Text>
                                </View>
                                {showDots && p.value !== null && (
                                    <Circle
                                        cx={x}
                                        cy={getY(p.value)}
                                        r="4.5"
                                        fill="#FFF"
                                        stroke={color}
                                        strokeWidth="2.5"
                                    />
                                )}
                    </React.Fragment>
                );
            })}
        </Svg>
    )}

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
    axisLabel: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '800',
    },
    yLabelContainer: {
        position: 'absolute',
        left: 8,
        width: 35,
        alignItems: 'center',
    },
    xLabelContainer: {
        position: 'absolute',
        width: 30,
        alignItems: 'center',
    },
    infoButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        padding: 4,
    },
    infoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 20,
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
