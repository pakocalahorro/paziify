import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { contentService } from '../../services/contentService';
import * as Haptics from 'expo-haptics';
import { CardioService } from '../../services/CardioService';
import GameContainer from '../../components/Gamification/GameContainer';

const { width } = Dimensions.get('window');

interface CardioResultParams {
    diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio';
    metrics?: {
        bpm: number;
        hrv: number;
    };
    context?: 'baseline' | 'post_session';
    quality?: number;
}

const CardioResultScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { updateUserState, setLastSelectedBackgroundUri } = useApp();

    const params = route.params as CardioResultParams | undefined;
    const diagnosis = params?.diagnosis || 'equilibrio';
    const metrics = params?.metrics;
    const context = params?.context || 'baseline';
    const quality = params?.quality || 98; // Default to high if missing

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
    }, [metrics, params, context]);

    // -------------------------------------------------------------------------
    // 2. POSITIVE ARCHETYPES CONFIG (El Espejo del Alma)
    // -------------------------------------------------------------------------
    const resultConfig = {
        sobrecarga: {
            mode: 'healing',
            title: 'Guerrero en Reposo', // Before: Sobrecarga Mental
            tag: 'HONRA TU ESFUERZO',
            color: '#EF4444', // Red-ish
            bg: '#1A0808',
            insight: "Tu cuerpo ha luchado grandes batallas. Ahora, la victoria reside en soltar las armas y permitirte sanar. No es debilidad, es sabiduría."
        },
        agotamiento: {
            mode: 'healing', // Changed to healing for fatigue
            title: 'Marea Calma', // Before: Energía Baja
            tag: 'NUTRICIÓN PROFUNDA',
            color: '#FBBF24', // Amber
            bg: '#1A1500',
            insight: "Como el mar cuando se retira, tu energía está baja para luego volver con fuerza. Hoy no exijas, solo nutre. Flota."
        },
        equilibrio: {
            mode: 'growth',
            title: 'Sol Naciente', // Before: Resonancia Vital
            tag: 'LUZ INTERIOR',
            color: '#10B981', // Emerald
            bg: '#061812',
            insight: "Tu luz interior es estable y brillante. Tienes la claridad y la fuerza para expandirte. Es tu momento de brillar."
        }
    };

    const config = resultConfig[diagnosis] || resultConfig.equilibrio;
    const suggestedMode = config.mode as 'healing' | 'growth';

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
            {/* Background Gradient/Mesh Placeholder */}
            <View style={[styles.backgroundBase, { backgroundColor: config.bg }]} />

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

                {/* Main Insight */}
                <Text style={styles.insightText}>
                    {config.insight}
                </Text>

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

                {/* SCIENTIFIC VALIDATION BLOCK */}
                <View style={styles.scientificContainer}>
                    <View style={styles.qualityBadge}>
                        <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                        <Text style={styles.qualityLabel}>CALIDAD DE SEÑAL:</Text>
                        <Text style={styles.qualityValue}>{quality}% (CLÍNICA)</Text>
                    </View>

                    <Text style={styles.scientificText}>
                        Diagnóstico basado en biomarcadores de Variabilidad Cardíaca (VFC).{"\n"}
                        Tecnología de fotopletismografía validada científicamente.
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.recommendationLabel}>RECOMENDACIÓN PAZIIFY</Text>

                {/* Action Cards (The Nudge) */}
                <View style={styles.cardsContainer}>
                    {/* Sanar Card */}
                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.healingCard,
                            // Dim if suggestion is growth
                            suggestedMode === 'growth' && styles.dimmedCard,
                            // Highlight if suggestion is healing
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
                            // Dim if suggestion is healing
                            suggestedMode === 'healing' && styles.dimmedCard,
                            // Highlight if suggestion is growth
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
        fontSize: 10, // Reduced from 11
        textAlign: 'center',
        lineHeight: 14, // Reduced from 16
        fontStyle: 'italic',
    }
});

export default CardioResultScreen;
