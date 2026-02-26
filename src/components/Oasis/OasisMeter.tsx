import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedProps,
    Easing,
} from 'react-native-reanimated';

interface OasisMeterProps {
    progress: number; // 0 to 1
    size?: number;
    label?: string;
    accentColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Universal Progress Meter for PDS v3.0
 * Uses precise Glassmorphism dropshadows and Outfit typography.
 */
export const OasisMeter: React.FC<OasisMeterProps> = ({
    progress,
    size = 150,
    label = "PROGRESO",
    accentColor = "#2DD4BF" // Default Healing Green 
}) => {
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const center = size / 2;

    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        // Clamp progress between 0 and 1
        const safeProgress = Math.min(Math.max(progress, 0), 1);
        animatedProgress.value = withTiming(safeProgress, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [progress]);

    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - (circumference * animatedProgress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size} style={styles.svg}>
                <Defs>
                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor={accentColor} stopOpacity="1" />
                        <Stop offset="1" stopColor={accentColor} stopOpacity="0.6" />
                    </SvgLinearGradient>
                </Defs>

                {/* Glow Track (Fake Shadow) */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={accentColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedCircleProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${center}, ${center}`}
                    opacity={0.3}
                    transform={`scale(1.05) translate(${-center * 0.05}, ${-center * 0.05})`}
                />

                {/* Background Track Ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Animated Progress Ring */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedCircleProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${center}, ${center}`}
                />
            </Svg>

            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    svg: {
        position: 'absolute',
    },
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    percentage: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 32,
        color: '#FFFFFF',
        marginTop: -4,
    },
});
