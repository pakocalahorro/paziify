import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface OasisToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    accentColor?: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const TOGGLE_WIDTH = 50;
const TOGGLE_HEIGHT = 30;
const KNOB_SIZE = 24;

/**
 * Universal Toggle Switch for PDS v3.0
 * Features Glassmorphism and haptic feedback. Replaces native Switch.
 */
export const OasisToggle: React.FC<OasisToggleProps> = ({
    value,
    onValueChange,
    accentColor = '#2DD4BF', // Healing default
    style,
    disabled = false
}) => {
    const progress = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(value ? 1 : 0, {
            damping: 20,
            stiffness: 250,
            mass: 0.8
        });
    }, [value]);

    const handlePress = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(!value);
    };

    const animatedTrackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(255, 255, 255, 0.1)', `${accentColor}80`] // from subtle white to 50% opacity accent
        );
        const borderColor = interpolateColor(
            progress.value,
            [0, 1],
            ['rgba(255, 255, 255, 0.2)', accentColor]
        );

        return {
            backgroundColor,
            borderColor
        };
    });

    const animatedKnobStyle = useAnimatedStyle(() => {
        const translateX = progress.value * (TOGGLE_WIDTH - KNOB_SIZE - 6); // 6 is total horizontal padding (3 left + 3 right)
        return {
            transform: [{ translateX }],
            backgroundColor: progress.value > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'
        };
    });

    return (
        <TouchableWithoutFeedback onPress={handlePress} disabled={disabled}>
            <View style={[styles.container, style, disabled && styles.disabled]}>
                <Animated.View style={[styles.track, animatedTrackStyle]}>
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
                    <Animated.View style={[styles.knob, animatedKnobStyle]} />
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: TOGGLE_WIDTH,
        height: TOGGLE_HEIGHT,
    },
    disabled: {
        opacity: 0.5,
    },
    track: {
        width: '100%',
        height: '100%',
        borderRadius: TOGGLE_HEIGHT / 2,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        paddingHorizontal: 3, // space for the knob to breathe
    },
    knob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // for android shadow
    }
});
