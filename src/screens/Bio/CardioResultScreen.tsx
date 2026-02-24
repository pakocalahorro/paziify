import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { contentService } from '../../services/contentService';
import * as Haptics from 'expo-haptics';
import { CardioService } from '../../services/CardioService';
import { Screen } from '../../types';
import GameContainer from '../../components/Gamification/GameContainer';

const { width } = Dimensions.get('window');

interface CardioResultParams {
    diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio';
    metrics?: {
        bpm: number;
        hrv: number;
    };
    hrvNormalized?: {
        rawValue: number;
        normalizedValue: number;
        expectedValue: number;
        category: string;
        message: string;
    };
    context?: 'baseline' | 'post_session';
    quality?: number;
    sessionData?: any;
}

const CardioResultScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { userState, updateUserState, setLastSelectedBackgroundUri } = useApp();

    const params = route.params as CardioResultParams | undefined;
    const diagnosis = params?.diagnosis || 'equilibrio';
    const metrics = params?.metrics;
    const hrvNormalized = params?.hrvNormalized;
    const context = params?.context || 'baseline';
    const quality = params?.quality || 98;
    const sessionData = params?.sessionData;
    const hasActiveProgram = !!userState.activeChallenge;

    // History trend state
    const [weekTrend, setWeekTrend] = useState<{ bpm: number; hrv: number; date: string }[]>([]);
    const [todayBaseline, setTodayBaseline] = useState<{ bpm: number; hrv: number } | null>(null);

    // -------------------------------------------------------------------------
    // 1. SAVE RESULT (LOCAL FIRST)
    // -------------------------------------------------------------------------
    React.useEffect(() => {
        if (metrics && params?.diagnosis) {
            const saveResult = async () => {
                try {
                    await CardioService.saveScan({
                        bpm: metrics.bpm,
                        hrv: metrics.hrv,
                        diagnosis: params.diagnosis,
                        context: context
                    });
                    console.log('Cardio Result saved locally with context:', context);
                } catch (e) {
                    console.error('Failed to save cardio result', e);
                }
            };
            saveResult();
        }

        // Load history trend for mini-chart
        const loadTrend = async () => {
            const trend = await CardioService.getWeekTrend();
            setWeekTrend(trend.map(s => ({ bpm: s.bpm, hrv: s.hrv, date: s.timestamp })));

            // Load today's baseline for pre/post comparison
            if (context === 'post_session') {
                const baseline = await CardioService.getTodayBaseline();
                if (baseline) setTodayBaseline({ bpm: baseline.bpm, hrv: baseline.hrv });
            }
        };
        loadTrend();
    }, [metrics, params, context]);

    // -------------------------------------------------------------------------
    // 2. POSITIVE ARCHETYPES CONFIG (El Espejo del Alma)
    // -------------------------------------------------------------------------
    const resultConfig = {
        sobrecarga: {
            mode: 'healing',
            title: 'Guerrero en Reposo', // Before: Sobrecarga Mental
            tag: 'TU CUERPO HA LUCHADO GRANDES BATALLAS, PERMÍTETE SANAR',
            color: '#EF4444', // Red-ish
            bg: '#1A0808',
            insight: "Tu cuerpo ha luchado grandes batallas. Ahora, la victoria reside en soltar las armas y permitirte sanar. No es debilidad, es sabiduría."
        },
        agotamiento: {
            mode: 'healing', // Changed to healing for fatigue
            title: 'Marea Calma', // Before: Energía Baja
            tag: 'TU ENERGÍA ESTÁ BAJA PARA VOLVER CON FUERZA',
            color: '#FBBF24', // Amber
            bg: '#1A1500',
            insight: "Como el mar cuando se retira, tu energía está baja para luego volver con fuerza. Hoy no exijas, solo nutre. Flota."
        },
        equilibrio: {
            mode: 'growth',
            title: 'Sol Naciente', // Before: Resonancia Vital
            tag: 'TU LUZ INTERIOR ES ESTABLE Y BRILLANTE',
            color: '#10B981', // Emerald
            bg: '#061812',
            insight: "Tu luz interior es estable y brillante. Tienes la claridad y la fuerza para expandirte. Es tu momento de brillar."
        }
    };

    const config = resultConfig[diagnosis] || resultConfig.equilibrio;
    const suggestedMode = config.mode as 'healing' | 'growth';

    // Motivational message for active program (Variante B)
    const missionMessages = {
        sobrecarga: 'Tu cuerpo pide calma. Tu sesión de hoy es justo lo que necesitas — respira profundo y confía en el proceso.',
        agotamiento: 'Tu energía está baja, pero tu sesión te nutrirá. Haz lo que puedas, sin presión.',
        equilibrio: 'Estás en equilibrio perfecto. Hoy es el día ideal para avanzar en tu programa. ¡A por ello!'
    };

    // -------------------------------------------------------------------------
    // 3. GAMIFICATION LOGIC
    // -------------------------------------------------------------------------
    const [activeGameMode, setActiveGameMode] = React.useState<'healing' | 'growth' | null>(null);

    const handleAction = async (mode: 'healing' | 'growth') => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Launch Game directly
        setActiveGameMode(mode);
    };

    const handleGameComplete = async () => {
        if (!activeGameMode) return;
        // Game completed, navigate home with stats update (handled inside game or here if needed)
        await activateModeAndNavigate(activeGameMode);
        setActiveGameMode(null);
    };

    const activateModeAndNavigate = async (mode: 'healing' | 'growth') => {
        // 1. Update Profile (Mood/Background)
        const bgUri = await contentService.getRandomCategoryImage(mode);

        updateUserState({
            lifeMode: mode,
            lastSelectedBackgroundUri: bgUri as string || undefined,
            lastEntryDate: new Date().toISOString().split('T')[0],
        });

        if (bgUri) setLastSelectedBackgroundUri(bgUri as string);

        // 2. Navigate Home
        navigation.navigate('MainTabs', { screen: 'Home' });
    };

    const handleCardPress = async (mode: 'healing' | 'growth') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Direct navigation (Internal Compass behavior)
        await activateModeAndNavigate(mode);
    };

    const handleButtonPress = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Launch Game (Premium Experience)
        setActiveGameMode(suggestedMode);
    };

    return (
        <View style={styles.container}>
            {/* Session Background Image or Solid Color */}
            {sessionData?.thumbnailUrl ? (
                <ImageBackground
                    source={{ uri: sessionData.thumbnailUrl }}
                    style={[StyleSheet.absoluteFill]}
                    imageStyle={{ opacity: 0.3 }}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(10,10,10,0.5)', 'rgba(10,10,10,0.9)', '#0A0A0A']}
                        style={StyleSheet.absoluteFill}
                    />
                </ImageBackground>
            ) : (
                <View style={[styles.backgroundBase, { backgroundColor: config.bg }]} />
            )}

            {/* GAMIFICATION MODAL */}
            <Modal
                visible={!!activeGameMode}
                animationType="fade"
                transparent={false}
                onRequestClose={() => setActiveGameMode(null)}
            >
                {activeGameMode && (
                    <GameContainer
                        mode={activeGameMode}
                        onClose={() => setActiveGameMode(null)}
                        onComplete={handleGameComplete}
                    />
                )}
            </Modal>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text style={styles.subHeader}>TU ESTADO ACTUAL</Text>
                <Text style={styles.headerTitle}>
                    {config.title}
                </Text>
                <View style={[styles.tag, { backgroundColor: `${config.color}20` }]}>
                    <Text style={[styles.tagText, { color: config.color }]}>
                        {config.tag}
                    </Text>
                </View>



                {/* Metrics Cards */}
                <View style={styles.metricsContainer}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>PULSO</Text>
                        <Text style={styles.metricValue}>{metrics?.bpm || '--'}<Text style={styles.metricUnit}> BPM</Text></Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>VFC (HRV)</Text>
                        <Text style={styles.metricValue}>{metrics?.hrv || '--'}<Text style={styles.metricUnit}> ms</Text></Text>
                    </View>
                </View>

                {/* ============================================================ */}
                {/* BASELINE MODE: Lightweight results → back to session          */}
                {/* ============================================================ */}
                {context === 'baseline' ? (
                    <>
                        {/* Confirmation */}
                        <View style={styles.baselineConfirm}>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                            <Text style={styles.baselineConfirmText}>
                                Bio-ritmo registrado
                            </Text>
                        </View>

                        <Text style={styles.baselineHint}>
                            Al terminar tu sesión de meditación, podrás ver el impacto real comparando tus resultados de antes y después.
                        </Text>

                        {/* CTA: Start session directly */}
                        <TouchableOpacity
                            style={[styles.ctaButton, { backgroundColor: '#10B981' }]}
                            onPress={() => {
                                if (sessionData) {
                                    navigation.navigate(Screen.BREATHING_TIMER, {
                                        sessionId: sessionData.id,
                                        sessionData: sessionData,
                                    });
                                } else {
                                    navigation.goBack();
                                }
                            }}
                        >
                            <Text style={styles.ctaText}>Comenzar Sesión</Text>
                            <Ionicons name="play" size={20} color="#000" />
                        </TouchableOpacity>

                        {/* MEDICAL DISCLAIMER */}
                        <Text style={styles.disclaimer}>
                            ⚕️ Esta medición es orientativa y tiene fines de bienestar personal. No sustituye el diagnóstico, consejo o tratamiento médico profesional.
                        </Text>
                    </>
                ) : (
                    <>
                        {/* PRE/POST SESSION COMPARISON (Idea 2) */}
                        {context === 'post_session' && todayBaseline && metrics && (
                            <View style={styles.comparisonCard}>
                                <Text style={styles.comparisonTitle}>IMPACTO DE TU SESIÓN</Text>
                                <View style={styles.comparisonRow}>
                                    <View style={styles.comparisonItem}>
                                        <Text style={styles.comparisonLabel}>ANTES</Text>
                                        <Text style={styles.comparisonVal}>{todayBaseline.bpm} BPM</Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.3)" />
                                    <View style={styles.comparisonItem}>
                                        <Text style={styles.comparisonLabel}>DESPUÉS</Text>
                                        <Text style={styles.comparisonVal}>{metrics.bpm} BPM</Text>
                                    </View>
                                    <Text style={[styles.comparisonDelta, {
                                        color: metrics.bpm < todayBaseline.bpm ? '#10B981' : '#FF6B6B'
                                    }]}>
                                        {metrics.bpm < todayBaseline.bpm ? '↓' : '↑'}{Math.abs(metrics.bpm - todayBaseline.bpm)}
                                    </Text>
                                </View>
                                <View style={styles.comparisonRow}>
                                    <View style={styles.comparisonItem}>
                                        <Text style={styles.comparisonLabel}>VFC</Text>
                                        <Text style={styles.comparisonVal}>{todayBaseline.hrv} ms</Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.3)" />
                                    <View style={styles.comparisonItem}>
                                        <Text style={styles.comparisonLabel}>VFC</Text>
                                        <Text style={styles.comparisonVal}>{metrics.hrv} ms</Text>
                                    </View>
                                    <Text style={[styles.comparisonDelta, {
                                        color: metrics.hrv > todayBaseline.hrv ? '#10B981' : '#FF6B6B'
                                    }]}>
                                        {metrics.hrv > todayBaseline.hrv ? '↑' : '↓'}{Math.abs(metrics.hrv - todayBaseline.hrv)} ms
                                    </Text>
                                </View>
                                {metrics.hrv > todayBaseline.hrv && (
                                    <Text style={styles.comparisonInsight}>
                                        ✨ La meditación ha aumentado tu variabilidad cardíaca. ¡Tu cuerpo responde!
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* HISTORY MINI-CHART (Idea 1) */}
                        {weekTrend.length >= 2 && (
                            <View style={styles.trendCard}>
                                <Text style={styles.trendTitle}>📊 TU EVOLUCIÓN</Text>
                                <View style={styles.trendChart}>
                                    {weekTrend.map((point, i) => {
                                        const maxHrv = Math.max(...weekTrend.map(p => p.hrv), 1);
                                        const heightPct = Math.max((point.hrv / maxHrv) * 100, 10);
                                        return (
                                            <View key={i} style={styles.trendBarContainer}>
                                                <View style={[styles.trendBar, {
                                                    height: `${heightPct}%` as any,
                                                    backgroundColor: i === weekTrend.length - 1
                                                        ? '#10B981' : 'rgba(255,255,255,0.15)'
                                                }]} />
                                                <Text style={styles.trendBarLabel}>
                                                    {['D', 'L', 'M', 'X', 'J', 'V', 'S'][new Date(point.date).getDay()]}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                                {(() => {
                                    if (weekTrend.length >= 2) {
                                        const first = weekTrend[0].hrv;
                                        const last = weekTrend[weekTrend.length - 1].hrv;
                                        const pctChange = Math.round(((last - first) / first) * 100);
                                        if (pctChange > 0) return (
                                            <Text style={styles.trendMessage}>
                                                Tu VFC ha mejorado un {pctChange}% ✨
                                            </Text>
                                        );
                                        if (pctChange < 0) return (
                                            <Text style={[styles.trendMessage, { color: 'rgba(255,255,255,0.3)' }]}>
                                                Tu VFC ha bajado un {Math.abs(pctChange)}%. Descansa más.
                                            </Text>
                                        );
                                    }
                                    return null;
                                })()}
                            </View>
                        )}
                        {weekTrend.length < 2 && weekTrend.length > 0 && (
                            <Text style={styles.trendFirstScan}>
                                ¡Primera lectura guardada! Escanéate otra vez mañana para ver tu evolución.
                            </Text>
                        )}

                        {/* VARIANTE B: Active Program */}
                        {hasActiveProgram ? (
                            <>
                                <Text style={styles.recommendationLabel}>TU MISIÓN DE HOY</Text>
                                <TouchableOpacity
                                    style={styles.missionCard}
                                    onPress={() => {
                                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        navigation.navigate('MainTabs', { screen: 'Home' });
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.missionCardContent}>
                                        <View style={styles.missionIconBox}>
                                            <Ionicons name="trophy" size={28} color="#FBBF24" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.missionTitle}>
                                                {userState.activeChallenge?.title || 'Tu Programa'}
                                            </Text>
                                            <Text style={styles.missionProgress}>
                                                Día {(userState.activeChallenge?.daysCompleted || 0) + 1}/{userState.activeChallenge?.totalDays || 7} • Continuar sesión
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.missionInsight}>
                                    <Ionicons name="sparkles" size={16} color={config.color} />
                                    <Text style={styles.missionInsightText}>
                                        {missionMessages[diagnosis]}
                                    </Text>
                                </View>
                            </>
                        ) : context === 'post_session' ? (
                            /* POST-SESSION: Simple return to home */
                            <>
                                <TouchableOpacity
                                    style={[styles.ctaButton, { backgroundColor: '#10B981' }]}
                                    onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
                                >
                                    <Text style={styles.ctaText}>Volver a Inicio</Text>
                                    <Ionicons name="home" size={20} color="#000" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            /* VARIANTE A: No active program (Standalone scan from Sanctuary) */
                            <>
                                <Text style={styles.recommendationLabel}>RECOMENDACIÓN PAZIIFY</Text>

                                {/* Action Cards (The Nudge) */}
                                <View style={styles.cardsContainer}>
                                    {/* Sanar Card */}
                                    <TouchableOpacity
                                        style={[
                                            styles.card,
                                            styles.healingCard,
                                            suggestedMode === 'growth' && styles.dimmedCard,
                                            suggestedMode === 'healing' && styles.highlightedCard
                                        ]}
                                        onPress={() => handleCardPress('healing')}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="leaf-outline" size={28} color={suggestedMode === 'healing' ? '#2DD4BF' : 'rgba(45, 212, 191, 0.4)'} />
                                        <Text style={[styles.cardTitle, { color: '#2DD4BF' }]}>SANAR</Text>
                                        <Text style={styles.cardDesc}>Calma SOS</Text>
                                    </TouchableOpacity>

                                    {/* Crecer Card */}
                                    <TouchableOpacity
                                        style={[
                                            styles.card,
                                            styles.growthCard,
                                            suggestedMode === 'healing' && styles.dimmedCard,
                                            suggestedMode === 'growth' && styles.highlightedCard
                                        ]}
                                        onPress={() => handleCardPress('growth')}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="flash-outline" size={28} color={suggestedMode === 'growth' ? '#FBBF24' : 'rgba(251, 191, 36, 0.4)'} />
                                        <Text style={[styles.cardTitle, { color: '#FBBF24' }]}>CRECER</Text>
                                        <Text style={styles.cardDesc}>Energía</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* EXPLICIT CTA BUTTON */}
                                <TouchableOpacity
                                    style={[styles.ctaButton, { backgroundColor: config.color }]}
                                    onPress={handleButtonPress}
                                >
                                    <Text style={styles.ctaText}>DESCONECTA ANTES DE EMPEZAR</Text>
                                    <Ionicons name="game-controller" size={20} color="#000" />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* MEDICAL DISCLAIMER */}
                        <Text style={styles.disclaimer}>
                            ⚕️ Esta medición es orientativa y tiene fines de bienestar personal. No sustituye el diagnóstico, consejo o tratamiento médico profesional.
                        </Text>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundBase: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 150, // Increased to ensure button clears Android nav bar
    },
    subHeader: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 30, // Increased from 28
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 10, // Reduced from 15
        textAlign: 'center',
    },
    tag: {
        paddingHorizontal: 10, // Reduced
        paddingVertical: 4, // Reduced
        borderRadius: 6,
        marginBottom: 20, // Reduced from 30
    },
    tagText: {
        fontSize: 11, // Reduced
        fontWeight: '900',
        letterSpacing: 1,
    },
    insightText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13, // Reduced from 15 to fit 2 lines
        lineHeight: 20, // Reduced from 22
        textAlign: 'center',
        paddingHorizontal: 10, // Increased padding
    },
    divider: {
        width: 40,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginVertical: 15, // Reduced from 25 to pull up contents
    },
    recommendationLabel: {
        color: '#FFF',
        fontSize: 13, // Reduced
        fontWeight: '700',
        marginBottom: 10, // Reduced from 15
        alignSelf: 'flex-start',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        width: '48%',
        height: 130, // Reduced from 160
        borderRadius: 20, // Reduced
        padding: 15, // Reduced
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    highlightedCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 2,
        borderColor: '#FFF', // Make it pop
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    dimmedCard: {
        opacity: 0.4,
        borderColor: 'rgba(255,255,255,0.05)',
        transform: [{ scale: 0.95 }]
    },
    healingCard: {
        // base styles
    },
    growthCard: {
        // base styles
    },
    cardTitle: {
        fontSize: 18, // Reduced from 20
        fontWeight: '900',
        marginTop: 10, // Reduced
        letterSpacing: 1,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11, // Reduced
        marginTop: 4,
        fontWeight: '600',
    },
    metricsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 15, // Reduced from 20
        width: '100%',
        marginTop: 20, // Reduced from 30
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    metricItem: {
        alignItems: 'center',
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    metricValue: {
        color: '#FFF',
        fontSize: 22, // Reduced from 24
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    metricUnit: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.4)',
    },
    metricDivider: {
        width: 1,
        height: 25, // Reduced from 30
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16, // Reduced from 18
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 30, // Reduced from 40
        marginBottom: 20, // Reduced from 100 on Button itself, now handled by Scroll container padding
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        width: '100%',
    },
    ctaText: {
        color: '#000',
        fontSize: 15, // Reduced from 16
        fontWeight: '900',
        letterSpacing: 1,
    },
    scientificContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    qualityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    qualityLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    qualityValue: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    scientificText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 14,
        fontStyle: 'italic',
    },
    // Disclaimer
    disclaimer: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    // Variante B: Mission Card
    missionCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(251, 191, 36, 0.25)',
        overflow: 'hidden',
    },
    missionCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        gap: 14,
    },
    missionIconBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    missionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    missionProgress: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    missionInsight: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginTop: 16,
        paddingHorizontal: 4,
    },
    missionInsightText: {
        flex: 1,
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 19,
    },
    // Pre/Post Comparison
    comparisonCard: {
        width: '100%',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderRadius: 20,
        padding: 18,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    comparisonTitle: {
        color: '#10B981',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 14,
        textAlign: 'center',
    },
    comparisonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 8,
    },
    comparisonItem: {
        alignItems: 'center',
        minWidth: 70,
    },
    comparisonLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
    },
    comparisonVal: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
    comparisonDelta: {
        fontSize: 16,
        fontWeight: '900',
        minWidth: 50,
        textAlign: 'right',
    },
    comparisonInsight: {
        color: '#10B981',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '600',
        lineHeight: 18,
    },
    // History Trend Chart
    trendCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 18,
        marginTop: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    trendTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 14,
    },
    trendChart: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    trendBarContainer: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    trendBar: {
        width: 8,
        borderRadius: 4,
        minHeight: 4,
    },
    trendBarLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 9,
        fontWeight: '700',
    },
    trendMessage: {
        color: '#10B981',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '600',
    },
    trendFirstScan: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        textAlign: 'center',
        paddingVertical: 16,
        lineHeight: 18,
    },
    baselineConfirm: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    baselineConfirmText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    baselineHint: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 16,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
});

export default CardioResultScreen;
