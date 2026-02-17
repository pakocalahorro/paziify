import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CalibrationRingProps {
    score: number;        // 0-100
    ready: boolean;       // true cuando score >= 80
}

export const CalibrationRing: React.FC<CalibrationRingProps> = ({ score, ready }) => {
    const animatedScore = useSharedValue(0);
    const RADIUS = 80;
    const STROKE_WIDTH = 12;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    useEffect(() => {
        animatedScore.value = withTiming(score, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        });
    }, [score]);

    // Determinar color según score
    const getColor = (currentScore: number): string => {
        if (currentScore >= 80) return '#10B981'; // Verde
        if (currentScore >= 60) return '#FBBF24'; // Amarillo
        return '#EF4444'; // Rojo
    };

    const color = getColor(score);

    // Determinar texto de estado
    const getStatusText = (): string => {
        if (ready) return '✓ ÓPTIMO';
        if (score >= 60) return 'CASI';
        return 'AJUSTA';
    };

    const animatedProps = useAnimatedProps(() => {
        const progress = animatedScore.value / 100;
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={styles.container}>
            <Svg width={200} height={200} style={styles.svg}>
                {/* Círculo de fondo */}
                <Circle
                    cx={100}
                    cy={100}
                    r={RADIUS}
                    stroke="#333"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />

                {/* Círculo de progreso animado */}
                <AnimatedCircle
                    cx={100}
                    cy={100}
                    r={RADIUS}
                    stroke={color}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="100, 100"
                />
            </Svg>

            {/* Contenido central */}
            <View style={styles.centerContent}>
                <Text style={styles.scoreText}>{Math.round(score)}%</Text>
                <Text style={[styles.statusText, { color }]}>
                    {getStatusText()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
