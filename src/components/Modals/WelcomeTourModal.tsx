import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeOut,
    FadeInDown,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    useSharedValue,
} from 'react-native-reanimated';
import { Svg, Path as SvgPath, Circle, LinearGradient as SvgLinearGradient, Defs, Stop } from 'react-native-svg';
import StarCore from '../Sanctuary/StarCore';
import ResilienceTree from '../Profile/ResilienceTree';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

// --- OASIS ARROW (v2.50.0) ---
const OasisArrow = memo(({ active, direction = 'down' }: { active: boolean, direction?: 'up' | 'down' }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (active) {
            opacity.value = withTiming(1, { duration: 600 });
            translateY.value = withRepeat(
                withSequence(
                    withTiming(-15, { duration: 800 }),
                    withTiming(0, { duration: 800 })
                ),
                -1,
                true
            );
        } else {
            opacity.value = withTiming(0, { duration: 400 });
        }
    }, [active]);

    const rStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotate: direction === 'up' ? '180deg' : '0deg' }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.oasisArrowContainer, rStyle]}>
            <Svg height="45" width="45" viewBox="0 0 45 45">
                <Defs>
                    <SvgLinearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FBBF24" stopOpacity="1" />
                        <Stop offset="1" stopColor="rgba(251, 191, 36, 0.4)" stopOpacity="0.5" />
                    </SvgLinearGradient>
                </Defs>
                <SvgPath
                    d="M22.5 35V10M22.5 35L12 24.5M22.5 35L33 24.5"
                    stroke="url(#arrowGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </Animated.View>
    );
});

const GuidanceHalo = memo(({ active }: { active: boolean }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (active) {
            opacity.value = withTiming(0.6, { duration: 500 });
            scale.value = withRepeat(
                withSequence(withTiming(1.6, { duration: 1200 }), withTiming(1, { duration: 1200 })),
                -1,
                true
            );
        } else {
            opacity.value = withTiming(0, { duration: 500 });
        }
    }, [active]);

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.halo, rStyle]} />
    );
});

// --- MIRROR LAYER (v2.50.0) ---
const GuidanceMirrors = ({ currentStep }: { currentStep: number }) => {
    const insets = useSafeAreaInsets();
    
    // Header (Top)
    const headerTop = insets.top;
    const evolButtonX = 20 + 20;
    const homeTitleY = headerTop + 42 + 2;
    const homeTitleX = 140; // Coordenada ajustada por el usuario

    // TabBar (Bottom)
    const tabBarBottom = insets.bottom > 0 ? insets.bottom : 30;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Paso 1: HOME */}
            {currentStep === 1 && (
                <View style={[styles.mirrorMarker, { top: homeTitleY + 18, left: homeTitleX }]}>
                    <GuidanceHalo active={true} />
                    <View style={styles.arrowPointerTop}>
                        <OasisArrow active={true} direction="up" />
                    </View>
                </View>
            )}

            {/* Paso 2: EVOLUCIÓN */}
            {currentStep === 2 && (
                <View style={[styles.mirrorMarker, { top: headerTop + 25, left: evolButtonX + 35 }]}>
                    <GuidanceHalo active={true} />
                    <View style={styles.arrowPointerTop}>
                        <OasisArrow active={true} direction="up" />
                    </View>
                </View>
            )}

            {/* Paso 3: SANTUARIO (ORBE) */}
            {currentStep === 3 && (
                <View style={[styles.mirrorMarker, { bottom: tabBarBottom + 0, left: width / 2 }]}>
                    <GuidanceHalo active={true} />
                    <View style={styles.arrowPointerBottom}>
                        <OasisArrow active={true} direction="down" />
                    </View>
                </View>
            )}

            {/* Paso 4: PERFIL */}
            {currentStep === 4 && (
                <View style={[styles.mirrorMarker, { bottom: tabBarBottom + 2, right: 8 }]}>
                    <GuidanceHalo active={true} />
                    <View style={styles.arrowPointerBottom}>
                        <OasisArrow active={true} direction="down" />
                    </View>
                </View>
            )}
        </View>
    );
};

// --- ILLUSTRATIONS (Memoized for Performance) ---

const SantuarioDualIllustration = memo(() => {
    return (
        <View style={styles.dualContainer}>
            <View style={[styles.optionCardLabel, { borderColor: '#2DD4BF' }]}>
                <Ionicons name="leaf-outline" size={24} color="#2DD4BF" />
                <Text style={styles.optionTextLabel}>SANAR</Text>
            </View>
            <View style={[styles.optionCardLabel, { borderColor: '#FBBF24' }]}>
                <Ionicons name="flash-outline" size={24} color="#FBBF24" />
                <Text style={styles.optionTextLabel}>CRECER</Text>
            </View>
            <View style={styles.orbCenterPad}>
                <StarCore size={50} progress={useSharedValue(1)} />
            </View>
        </View>
    );
});

const SplineChartIllustration = memo(() => (
    <View style={styles.chartContainer}>
        <Svg height="110" width="200" viewBox="0 0 200 100">
            <Defs>
                <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={theme.colors.accent} stopOpacity="1" />
                    <Stop offset="1" stopColor={theme.colors.accent} stopOpacity="0.2" />
                </SvgLinearGradient>
            </Defs>
            <SvgPath
                d="M0 80 Q 25 20, 50 50 T 100 30 T 150 70 T 200 10"
                fill="none"
                stroke="url(#chartGrad)"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <Circle cx="100" cy="30" r="4" fill={theme.colors.accent} />
            <Circle cx="150" cy="70" r="4" fill={theme.colors.accent} />
        </Svg>
        <View style={styles.chartLegend}>
            <Text style={styles.chartValue}>+24% Bienestar Mental</Text>
        </View>
    </View>
));

const SunriseBackground = memo(() => {
    const sunGlow = useSharedValue(0.4);
    useEffect(() => {
        sunGlow.value = withRepeat(
            withSequence(withTiming(0.6, { duration: 3000 }), withTiming(0.4, { duration: 3000 })),
            -1,
            true
        );
    }, []);

    const rStyle = useAnimatedStyle(() => ({ opacity: sunGlow.value }));

    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={['#1A2A6C', '#1C3366', '#16222A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View style={[styles.sunGlow, rStyle]}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0)']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
});

const PaziifyLogoIllustration = memo(() => {
    return (
        <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
                <Ionicons name="leaf" size={40} color={theme.colors.accent} />
            </View>
            <Text style={styles.logoText}>Paziify</Text>
        </View>
    );
});

const AutoContentCarousel = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);

    const SLIDES = [
        {
            id: 'meditation',
            title: 'Meditación Oasis',
            icon: <Ionicons name="flash" size={24} color={theme.colors.accent} />,
            label: 'Dosis Diaria'
        },
        {
            id: 'music',
            title: 'Sintonía Relax',
            icon: <Ionicons name="musical-notes" size={24} color="#A78BFA" />,
            label: 'Música'
        },
        {
            id: 'book',
            title: 'Lectura Consciente',
            icon: <MaterialCommunityIcons name="book-open-variant" size={24} color="#FBBF24" />,
            label: 'Audiolibro'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SLIDES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const current = SLIDES[activeIndex];

    return (
        <View style={styles.carouselContainer}>
            <Animated.View
                key={current.id}
                entering={FadeIn.duration(800)}
                exiting={FadeOut.duration(800)}
                style={styles.carouselSlide}
            >
                <View style={styles.carouselIconBg}>{current.icon}</View>
                <Text style={styles.carouselLabel}>{current.label}</Text>
                <Text style={styles.carouselMainTitle}>{current.title}</Text>
            </Animated.View>
        </View>
    );
});

// --- MODAL COMPONENT ---

interface WelcomeTourModalProps {
    visible: boolean;
    onComplete: () => void;
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({ visible, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const STEPS = useMemo(() => [
        {
            title: "Te damos la bienvenida",
            description: "Tu viaje comienza aquí. Entra en un refugio diseñado para evolucionar y proteger tu paz.",
            visual: <PaziifyLogoIllustration />,
        },
        {
            title: "HOME: Tu pantalla inicial",
            description: "Explora consejos y recomendaciones dinámicas: Meditaciones, Música, Audiolibros e Historias.",
            visual: <AutoContentCarousel />,
        },
        {
            title: "Ciclo de Evolución",
            description: "Define tu camino con Programas y ve florecer tu Árbol. Deja que el Bio-Scan personalice tu viaje.",
            visual: (
                <View style={styles.evolutionContainer}>
                    <ResilienceTree size={110} daysPracticed={20} totalSteps={30} />
                </View>
            ),
        },
        {
            title: "Explora el Santuario",
            description: "Elige Sanar o Crecer en el Orbe central. Activa consejos y propuestas personalizadas.",
            visual: <SantuarioDualIllustration />,
        },
        {
            title: "Toda Evolución Cuenta",
            description: "Consulta tus resultados estadísticos en tu perfil. Celebra cada segundo de paz ganado.",
            visual: <SplineChartIllustration />,
        }
    ], []);

    useEffect(() => {
        if (visible) setCurrentStep(0);
    }, [visible]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    if (!visible) return null;

    const step = STEPS[currentStep];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                
                <GuidanceMirrors currentStep={currentStep} />

                <Animated.View
                    key={currentStep}
                    entering={FadeInDown.duration(400)}
                    style={styles.card}
                >
                    <SunriseBackground />

                    <View style={styles.cardHeader}>
                        <View style={styles.breadcrumbs}>
                            {STEPS.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.breadcrumbDot,
                                        i === currentStep && { width: 30, backgroundColor: "#FFF" }
                                    ]}
                                />
                            ))}
                        </View>
                        <TouchableOpacity onPress={onComplete} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                            <Ionicons name="close" size={24} color="rgba(255,255,255,0.6)" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mainContent}>
                        <View style={styles.illustrationPad}>
                            {step.visual}
                        </View>
                        <Text style={styles.title}>{step.title}</Text>
                        <Text style={styles.description} numberOfLines={2}>{step.description}</Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={handleBack}
                            disabled={currentStep === 0}
                            style={[styles.backButton, { opacity: currentStep === 0 ? 0 : 0.7 }]}
                        >
                            <Text style={styles.backText}>Anterior</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.8}
                            style={styles.nextButton}
                        >
                            <Text style={styles.nextText}>
                                {currentStep === STEPS.length - 1 ? "¡Empezar!" : "Siguiente"}
                            </Text>
                            <Ionicons
                                name={currentStep === STEPS.length - 1 ? "rocket" : "arrow-forward"}
                                size={18}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sunGlow: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
    },
    card: {
        width: width * 0.88,
        maxWidth: 400,
        backgroundColor: '#16222A',
        borderRadius: 35,
        padding: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 35,
        zIndex: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    breadcrumbs: {
        flexDirection: 'row',
        gap: 6,
    },
    breadcrumbDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    mainContent: {
        alignItems: 'center',
        width: '100%',
    },
    illustrationPad: {
        height: 150,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 10,
        marginBottom: 20,
        height: 40,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    backButton: {
        padding: 10,
    },
    backText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoBadge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 30,
        fontFamily: 'Outfit_800ExtraBold',
        color: '#FFF',
    },
    carouselContainer: {
        width: '100%',
        height: 130,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselSlide: {
        width: 200,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
    },
    carouselIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    carouselLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        textTransform: 'uppercase',
    },
    carouselMainTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
    },
    evolutionContainer: {
        alignItems: 'center',
    },
    dualContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    optionCardLabel: {
        width: 100,
        height: 100,
        borderRadius: 20,
        borderWidth: 1.5,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTextLabel: {
        fontSize: 12,
        fontFamily: 'Outfit_900Black',
        marginTop: 8,
        color: '#FFF',
    },
    orbCenterPad: {
        position: 'absolute',
        bottom: -20,
        alignSelf: 'center',
    },
    chartContainer: {
        alignItems: 'center',
    },
    chartLegend: {
        marginTop: 5,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    chartValue: {
        color: "#FFF",
        fontFamily: 'Outfit_700Bold',
        fontSize: 12,
    },
    oasisArrowContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    halo: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(251, 191, 36, 0.4)',
        zIndex: -1,
    },
    mirrorMarker: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        marginLeft: -40,
        marginTop: -40,
    },
    arrowPointerTop: {
        marginTop: 80,
    },
    arrowPointerBottom: {
        marginBottom: 100,
    },
});
