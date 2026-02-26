import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';

interface OasisInputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: keyof typeof Feather.glyphMap;
    containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Universal Input for PDS v3.0
 * Features Glassmorphism, floating labels, animated focus states and error handling.
 */
export const OasisInput: React.FC<OasisInputProps> = ({
    label,
    error,
    icon,
    containerStyle,
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const isFloating = isFocused || hasValue;

    // Animations
    const labelPosition = useSharedValue(isFloating ? 1 : 0);
    const borderOpacity = useSharedValue(0.15);

    React.useEffect(() => {
        labelPosition.value = withSpring(isFloating ? 1 : 0, { damping: 15, stiffness: 200 });
        borderOpacity.value = withTiming(isFocused ? 0.4 : 0.15, { duration: 200 });
    }, [isFloating, isFocused]);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withSpring(labelPosition.value === 1 ? -12 : 0) },
                { scale: withSpring(labelPosition.value === 1 ? 0.85 : 1) }
            ],
            color: error
                ? '#EF4444'
                : isFocused
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.6)'
        };
    });

    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            borderColor: error
                ? 'rgba(239, 68, 68, 0.6)' // Red for error
                : `rgba(255, 255, 255, ${borderOpacity.value})`
        };
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />

                <View style={styles.contentRow}>
                    {icon && (
                        <Feather
                            name={icon}
                            size={20}
                            color={error ? '#EF4444' : isFocused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                            style={styles.icon}
                        />
                    )}

                    <View style={styles.inputWrapper}>
                        <Animated.Text style={[styles.label, animatedLabelStyle, { marginLeft: icon ? 0 : 4 }]}>
                            {label}
                        </Animated.Text>

                        <TextInput
                            {...props}
                            value={value}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            style={[
                                styles.input,
                                { paddingLeft: icon ? 0 : 4 },
                                props.style
                            ]}
                            placeholderTextColor="transparent" // Placeholder handled by floating label
                        />
                    </View>
                </View>
            </Animated.View>

            {/* Error Message */}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    inputContainer: {
        height: 60,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.2)', // Slight darkening to increase contrast
    },
    contentRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 12,
    },
    inputWrapper: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    label: {
        position: 'absolute',
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        left: 0,
        zIndex: 1,
    },
    input: {
        flex: 1,
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: '#FFFFFF',
        paddingTop: 16, // Push text down to make room for floating label
        height: '100%',
    },
    errorText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#EF4444',
        marginTop: 6,
        marginLeft: 16,
    }
});
