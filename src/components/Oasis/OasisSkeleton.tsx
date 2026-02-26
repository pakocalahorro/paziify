import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    withSequence
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface OasisSkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    variant?: 'rectangular' | 'circular' | 'text';
}

/**
 * Universal Skeleton Loader for PDS v3.0 (Shimmer Effect)
 * Used while awaiting Supabase data to prevent "white screens" or basic ActivityIndicators.
 */
export const OasisSkeleton: React.FC<OasisSkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
    variant = 'rectangular'
}) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1, // infinite
            true // yoyo
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(shimmer.value, [0, 1], [0.3, 0.7]);
        return { opacity };
    });

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'circular':
                const size = typeof width === 'number' ? width : 40;
                return { width: size, height: size, borderRadius: size / 2 };
            case 'text':
                return { width: width as any, height: (typeof height === 'number' ? height : 14) as any, borderRadius: 4 };
            case 'rectangular':
            default:
                return { width: width as any, height: height as any, borderRadius };
        }
    };

    return (
        <Animated.View style={[styles.container, getVariantStyles(), style, animatedStyle]}>
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
            <View style={styles.glassBorder} pointerEvents="none" />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // base placeholder color
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 9999, // Overridden by inline styles if rectangular
    }
});
