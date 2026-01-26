import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    Animated,
    StatusBar,
    Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { RootStackParamList, Screen } from '../../types';
import NebulaBackground from '../../components/Sanctuary/NebulaBackground';
import LiquidOrb from '../../components/Sanctuary/LiquidOrb';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const CompassScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [selectedMode, setSelectedMode] = useState<'healing' | 'growth' | null>(null);
    const [pressedMode, setPressedMode] = useState<'healing' | 'growth' | null>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const orbIntroScale = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(-30)).current;
    const footerOpacity = useRef(new Animated.Value(0)).current;

    // Explosion Animation
    const explosionScale = useRef(new Animated.Value(0)).current;
    const explosionOpacity = useRef(new Animated.Value(0)).current;
    const [explosionColor, setExplosionColor] = useState('#6366F1');

    useFocusEffect(
        React.useCallback(() => {
            // Reset state and animations when screen is focused
            setSelectedMode(null);
            setPressedMode(null);
            explosionScale.setValue(0);
            explosionOpacity.setValue(0);
            fadeAnim.setValue(0);
            orbIntroScale.setValue(0);
            headerSlide.setValue(-30);
            footerOpacity.setValue(0);

            // Dramatic Staggered Intro
            Animated.stagger(200, [
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.spring(orbIntroScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    delay: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(headerSlide, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(footerOpacity, {
                    toValue: 1,
                    duration: 2000,
                    delay: 600,
                    useNativeDriver: true,
                }),
            ]).start();

            return () => { };
        }, [])
    );

    const triggerExplosion = (mode: 'healing' | 'growth') => {
        const color = mode === 'healing' ? '#6366F1' : '#F59E0B';
        setExplosionColor(color);
        explosionScale.setValue(0);
        explosionOpacity.setValue(1);

        Animated.parallel([
            Animated.timing(explosionScale, {
                toValue: 10,
                duration: 800,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(explosionOpacity, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressIn = (mode: 'healing' | 'growth') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPressedMode(mode);
    };

    const handlePressOut = (mode: 'healing' | 'growth') => {
        if (selectedMode) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setPressedMode(null);
        setSelectedMode(mode);
        triggerExplosion(mode);

        setTimeout(() => {
            navigation.navigate(Screen.MANIFESTO, { mode });
        }, 900);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={StyleSheet.absoluteFill}>
                <NebulaBackground mode={selectedMode || 'healing'} />
            </View>

            {/* Explosion Layer - pointerEvents="none" ensures it doesn't block touches */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.explosionContainer,
                    {
                        opacity: explosionOpacity,
                        transform: [{ scale: explosionScale }]
                    }
                ]}
            >
                <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Defs>
                        <RadialGradient id="explosionGrad" cx="50%" cy="50%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                            <Stop offset="30%" stopColor={explosionColor} stopOpacity="0.6" />
                            <Stop offset="100%" stopColor={explosionColor} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="50" fill="url(#explosionGrad)" />
                </Svg>
            </Animated.View>

            <View style={[styles.mainOverlay, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
                {/* Header */}
                <Animated.View style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: headerSlide }]
                    }
                ]}>
                    <Text style={styles.topLabel}>ENCUENTRA TU CENTRO</Text>
                    <Text style={styles.mainTitle}>La Brújula Interior</Text>
                    <View style={styles.titleDivider} />
                </Animated.View>

                {/* Orbs Section */}
                <View style={[styles.orbsContainer, { marginTop: -20 }]}>
                    {/* Healing Orb */}
                    <Animated.View style={[
                        styles.orbHitbox,
                        { transform: [{ scale: orbIntroScale }] },
                        selectedMode === 'growth' && { opacity: 0.05, transform: [{ scale: 0.7 }] }
                    ]}>
                        <TouchableWithoutFeedback
                            onPressIn={() => handlePressIn('healing')}
                            onPressOut={() => handlePressOut('healing')}
                            disabled={!!selectedMode}
                        >
                            <View style={styles.orbInteraction}>
                                <LiquidOrb
                                    color="#6366F1"
                                    size={width * 0.48}
                                    mode="healing"
                                    isPressed={pressedMode === 'healing'}
                                />
                                <BlurView intensity={20} tint="light" style={styles.labelGlass}>
                                    <Text style={styles.orbLabel}>SANAR</Text>
                                    <Text style={styles.orbDesc}>Paz Profunda</Text>
                                </BlurView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>

                    {/* Growth Orb */}
                    <Animated.View style={[
                        styles.orbHitbox,
                        { transform: [{ scale: orbIntroScale }] },
                        selectedMode === 'healing' && { opacity: 0.05, transform: [{ scale: 0.7 }] }
                    ]}>
                        <TouchableWithoutFeedback
                            onPressIn={() => handlePressIn('growth')}
                            onPressOut={() => handlePressOut('growth')}
                            disabled={!!selectedMode}
                        >
                            <View style={styles.orbInteraction}>
                                <LiquidOrb
                                    color="#F59E0B"
                                    size={width * 0.48}
                                    mode="growth"
                                    isPressed={pressedMode === 'growth'}
                                />
                                <BlurView intensity={20} tint="light" style={styles.labelGlass}>
                                    <Text style={styles.orbLabel}>CRECER</Text>
                                    <Text style={styles.orbDesc}>Vitalidad</Text>
                                </BlurView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>

                {/* Footer Hint */}
                <Animated.View style={[styles.footer, { opacity: footerOpacity }]}>
                    <View style={styles.hintContainer}>
                        <View style={styles.hintLine} />
                        <Text style={styles.hint}>¿Hacia dónde te guía tu pulso hoy?</Text>
                        <View style={styles.hintLine} />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050810' },
    explosionContainer: {
        position: 'absolute',
        width: 300,
        height: 300,
        top: height / 2 - 150,
        left: width / 2 - 150,
        zIndex: 5,
    },
    mainOverlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
    header: { alignItems: 'center', width: '100%', paddingHorizontal: 30 },
    topLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 4,
        marginBottom: 10,
        fontWeight: '900'
    },
    mainTitle: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: '200',
        textAlign: 'center',
        letterSpacing: 2,
    },
    titleDivider: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: 20,
    },
    orbsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    orbHitbox: {
        alignItems: 'center',
    },
    orbInteraction: {
        alignItems: 'center',
    },
    labelGlass: {
        marginTop: 30,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    orbLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 3
    },
    orbDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 9,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700'
    },
    footer: { width: '100%', paddingHorizontal: 40 },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    hintLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    hint: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
        fontStyle: 'italic',
        fontWeight: '300',
        textAlign: 'center'
    }
});

export default CompassScreen;
