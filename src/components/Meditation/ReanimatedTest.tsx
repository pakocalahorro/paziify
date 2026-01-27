import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const ReanimatedTest: React.FC = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.text}>TEST REANIMATED</Text>
            <Animated.View style={[styles.box, animatedStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '800',
        marginBottom: 5,
    },
    box: {
        width: 40,
        height: 40,
        backgroundColor: '#F97316',
        borderRadius: 8,
    },
});

export default ReanimatedTest;
