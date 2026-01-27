import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
    useDerivedValue,
    runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { RootStackParamList, Screen } from '../../types';
import PortalBackground from '../../components/Sanctuary/PortalBackground';
import StarCore from '../../components/Sanctuary/StarCore';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const THRESHOLD = 160;

const CompassScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Interaction State
    const translateY = useSharedValue(0);
    const [isNavigating, setIsNavigating] = useState(false);

    const progress = useDerivedValue(() => {
        // -1 (Drag Up -> Healing) to 1 (Drag Down -> Growth)
        return interpolate(
            translateY.value,
            [-THRESHOLD, THRESHOLD],
            [1, -1],
            Extrapolation.CLAMP
        );
    });

    const navigateToMode = (mode: 'healing' | 'growth') => {
        if (isNavigating) return;
        setIsNavigating(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate(Screen.MANIFESTO, { mode });
    };

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = event.translationY;

            // Subtle haptic feedback as we approach thresholds
            if (Math.abs(event.translationY) > THRESHOLD - 5 && Math.abs(event.translationY) < THRESHOLD) {
                runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
            }
        })
        .onEnd(() => {
            if (translateY.value < -THRESHOLD) {
                runOnJS(navigateToMode)('growth');
            } else if (translateY.value > THRESHOLD) {
                runOnJS(navigateToMode)('healing');
            } else {
                translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
            }
        });

    useFocusEffect(
        React.useCallback(() => {
            translateY.value = 0;
            setIsNavigating(false);
            return () => { };
        }, [])
    );

    const starAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: interpolate(Math.abs(translateY.value), [0, THRESHOLD], [1, 1.5], Extrapolation.CLAMP) }
        ],
        opacity: interpolate(Math.abs(translateY.value), [THRESHOLD - 20, THRESHOLD], [1, 0], Extrapolation.CLAMP)
    }));

    const labelStyle = (target: 'growth' | 'healing') => useAnimatedStyle(() => {
        const op = target === 'growth'
            ? interpolate(translateY.value, [-THRESHOLD, -50], [1, 0], Extrapolation.CLAMP)
            : interpolate(translateY.value, [50, THRESHOLD], [0, 1], Extrapolation.CLAMP);

        return {
            opacity: op,
            transform: [{ translateY: target === 'growth' ? -20 * op : 20 * op }]
        };
    });

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Full Screen Immersive Background */}
            <PortalBackground progress={progress} />

            <GestureDetector gesture={gesture}>
                <View style={[styles.mainContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}>

                    {/* Header - Always visible but subtle */}
                    <View style={styles.header}>
                        <Text style={styles.headerLabel}>EL NEXO</Text>
                        <Text style={styles.headerTitle}>Sintoniza</Text>
                    </View>

                    {/* Growth Portal Indicator */}
                    <Animated.View pointerEvents="none" style={[styles.portalZone, styles.topZone, labelStyle('growth')]}>
                        <BlurView intensity={30} tint="light" style={styles.glassLabel}>
                            <Text style={[styles.labelTitle, { color: '#FBBF24' }]}>CRECER</Text>
                            <Text style={styles.labelDesc}>POTENCIAL ILIMITADO</Text>
                        </BlurView>
                    </Animated.View>

                    {/* Center Interactor */}
                    <Animated.View style={[styles.starContainer, starAnimatedStyle]}>
                        <StarCore progress={progress} size={120} />
                    </Animated.View>

                    {/* Healing Portal Indicator */}
                    <Animated.View pointerEvents="none" style={[styles.portalZone, styles.bottomZone, labelStyle('healing')]}>
                        <BlurView intensity={30} tint="light" style={styles.glassLabel}>
                            <Text style={[styles.labelTitle, { color: '#2DD4BF' }]}>SANAR</Text>
                            <Text style={styles.labelDesc}>PAZ Y REGENERACIÓN</Text>
                        </BlurView>
                    </Animated.View>

                    {/* Hint */}
                    <Animated.View style={[styles.hintContainer, { opacity: useDerivedValue(() => 1 - Math.abs(progress.value) * 1.5) }]}>
                        <Text style={styles.hintText}>Desliza el núcleo de luz</Text>
                        <View style={styles.bounceDot} />
                    </Animated.View>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    headerLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 5,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    portalZone: {
        width: width * 0.8,
        alignItems: 'center',
    },
    topZone: {
        marginTop: 40,
    },
    bottomZone: {
        marginBottom: 40,
    },
    glassLabel: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    labelTitle: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 6,
    },
    labelDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 4,
    },
    starContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    hintContainer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
    },
    hintText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    bounceDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: 10,
    }
});

export default CompassScreen;
