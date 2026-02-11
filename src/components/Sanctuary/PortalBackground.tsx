import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { IMAGES } from '../../constants/images';

const { width, height } = Dimensions.get('window');

interface PortalBackgroundProps {
    progress: SharedValue<number>; // -1 (Healing) to 1 (Growth)
    healingImage?: string;
    growthImage?: string;
}

const PortalBackground: React.FC<PortalBackgroundProps> = ({ progress, healingImage, growthImage }) => {
    // Opacity for Growth Portal (Upper half / Drag down)
    const growthStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
        transform: [{ scale: interpolate(progress.value, [0, 1], [1.1, 1], Extrapolation.CLAMP) }]
    }));

    // Opacity for Healing Portal (Lower half / Drag up)
    const healingStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [-1, 0], [1, 0], Extrapolation.CLAMP),
        transform: [{ scale: interpolate(progress.value, [-1, 0], [1, 1.1], Extrapolation.CLAMP) }]
    }));

    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Base Dark Layer */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#020617' }]} />

            {/* Growth World - Radiant Energy */}
            <Animated.View style={[StyleSheet.absoluteFill, growthStyle]}>
                <Image
                    source={{ uri: growthImage || IMAGES.ACADEMY_HERO || 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=1000' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>

            {/* Healing World - Deep Nature */}
            <Animated.View style={[StyleSheet.absoluteFill, healingStyle]}>
                <Image
                    source={{ uri: healingImage || IMAGES.DAY }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>

            {/* Overlay Gradient to blend with content */}
            <View style={[StyleSheet.absoluteFill, styles.vignette]} />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: width,
        height: height,
    },
    vignette: {
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
    }
});

export default PortalBackground;
