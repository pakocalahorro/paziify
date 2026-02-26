import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, View, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface OasisButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    icon?: keyof typeof Ionicons.glyphMap;
    size?: 'large' | 'medium' | 'small';
    accentColor?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isPulse?: boolean; // For Heartbeat/Action CTA effects
    disabled?: boolean;
    loading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * Universal Button for PDS v3.0
 * Handles standard interactions, visual feedback, and primary CTAs.
 */
export const OasisButton: React.FC<OasisButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    icon,
    size = 'large',
    accentColor = '#2DD4BF', // Default Oasis Green
    style,
    textStyle,
    isPulse = false,
    disabled = false,
    loading = false,
}) => {
    const scale = useSharedValue(1);
    const pulseScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);

    useEffect(() => {
        if (isPulse && variant === 'primary') {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 1000 }),
                    withTiming(0.4, { duration: 1000 })
                ),
                -1,
                true
            );
        } else {
            pulseScale.value = 1;
            pulseOpacity.value = 0.4;
        }
    }, [isPulse, variant]);

    const handlePressIn = () => {
        if (disabled || loading) return;
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        if (disabled || loading) return;
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePress = () => {
        if (disabled || loading) return;
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => {
        const currentOpacity = disabled ? 0.4 : 1;
        if (isPulse && variant === 'primary' && !disabled) {
            return {
                transform: [{ scale: scale.value * pulseScale.value }],
                shadowOpacity: pulseOpacity.value,
                opacity: currentOpacity,
            };
        }
        return {
            transform: [{ scale: scale.value }],
            opacity: currentOpacity,
        };
    });

    const getHeight = () => {
        switch (size) {
            case 'small': return 40;
            case 'medium': return 48;
            case 'large': return 56;
            default: return 56;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small': return 14;
            case 'medium': return 16;
            case 'large': return 18;
            default: return 18;
        }
    };

    const renderButtonContent = () => {
        if (loading) {
            return (
                <View style={styles.contentRow}>
                    <ActivityIndicator color={variant === 'ghost' ? accentColor : '#FFFFFF'} />
                    <Text style={[
                        styles.text,
                        { fontSize: getFontSize(), marginLeft: 8 },
                        variant === 'ghost' && { color: accentColor },
                        textStyle
                    ]}>
                        Cargando...
                    </Text>
                </View>
            );
        }

        const content = (
            <View style={styles.contentRow}>
                {!!icon && <Ionicons name={icon} size={getFontSize() + 4} color={variant === 'ghost' ? accentColor : '#FFFFFF'} style={styles.icon} />}
                <Text style={[
                    styles.text,
                    { fontSize: getFontSize() },
                    variant === 'ghost' && { color: accentColor },
                    textStyle
                ]}>
                    {title}
                </Text>
            </View>
        );

        if (variant === 'glass') {
            return (
                <BlurView intensity={40} tint="light" style={[styles.glassInner, { height: getHeight() }]}>
                    {content}
                </BlurView>
            );
        }

        if (variant === 'primary') {
            return (
                <LinearGradient
                    colors={[accentColor, `${accentColor}CC`]} // Slight gradient on primary
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.primaryInner, { height: getHeight() }]}
                >
                    {content}
                </LinearGradient>
            );
        }

        return (
            <View style={[
                styles.basicInner,
                { height: getHeight() },
                variant === 'secondary' && styles.secondaryInner,
                variant === 'ghost' && styles.ghostInner
            ]}>
                {content}
            </View>
        );
    };

    return (
        <AnimatedTouchable
            activeOpacity={0.9}
            disabled={disabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[
                styles.container,
                { height: getHeight() },
                variant === 'primary' && { shadowColor: accentColor },
                style,
                animatedStyle
            ]}
        >
            {renderButtonContent()}

            {/* Outline highlight for glass and primary */}
            {(variant === 'glass' || variant === 'primary') && (
                <View style={styles.highlightBorder} pointerEvents="none" />
            )}
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 30, // Pill shape
        overflow: 'hidden',
        justifyContent: 'center',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    secondaryInner: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    glassInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    ghostInner: {
        backgroundColor: 'transparent',
    },
    basicInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 30,
    },
    highlightBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
    },
    text: {
        fontFamily: 'Outfit_800ExtraBold',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    icon: {
        marginRight: 8,
    }
});
