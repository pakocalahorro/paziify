import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface QualityAlertProps {
    visible: boolean;
    message: string;
}

export const QualityAlert: React.FC<QualityAlertProps> = ({ visible, message }) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, {
                damping: 15,
                stiffness: 150,
            });
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            translateY.value = withTiming(-100, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.alert}>
                <Text style={styles.icon}>⚠️</Text>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    alert: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        fontSize: 24,
        marginRight: 12,
    },
    message: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#92400E',
    },
});
