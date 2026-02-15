import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { contentService } from '../../services/contentService';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface CardioResultParams {
    diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio';
    metrics?: {
        bpm: number;
        hrv: number;
    };
}

const CardioResultScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { updateUserState, setLastSelectedBackgroundUri } = useApp();

    const params = route.params as CardioResultParams | undefined;
    const diagnosis = params?.diagnosis || 'equilibrio';
    const metrics = params?.metrics;

    // THERAPEUTIC MAPPING
    const resultConfig = {
        sobrecarga: {
            mode: 'healing',
            title: 'Sobrecarga Mental',
            tag: 'NECESIDAD DE PAUSA',
            color: '#EF4444',
            bg: '#1A0808',
            insight: "Tu sistema nervioso necesita un respiro. Es normal sentir saturación; tu cuerpo te pide desconectar para volver a conectar."
        },
        agotamiento: {
            mode: 'growth',
            title: 'Energía Baja',
            tag: 'MOMENTO DE RECARGA',
            color: '#FBBF24',
            bg: '#1A1500',
            insight: "Tus reservas están bajas hoy. No te fuerces. Una sesión suave de activación puede ser justo lo que necesitas para fluir mejor."
        },
        equilibrio: {
            mode: 'growth',
            title: 'Resonancia Vital',
            tag: 'ESTADO ÓPTIMO',
            color: '#10B981',
            bg: '#061812',
            insight: "Tu coherencia cardíaca es excelente. Estás en un estado ideal para crear, resolver problemas o profundizar en tu práctica."
        }
    };

    const config = resultConfig[diagnosis] || resultConfig.equilibrio;
    const suggestedMode = config.mode as 'healing' | 'growth';

    const handleAction = async (mode: 'healing' | 'growth') => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Update user state (same logic as CustomTabBar)
        const bgUri = await contentService.getRandomCategoryImage(mode);

        updateUserState({
            lifeMode: mode,
            lastSelectedBackgroundUri: bgUri as string || undefined,
            lastEntryDate: new Date().toISOString().split('T')[0],
        });

        if (bgUri) setLastSelectedBackgroundUri(bgUri as string);

        // Go back to Home (MainTabs)
        navigation.navigate('MainTabs', { screen: 'Home' });
    };

    return (
        <View style={styles.container}>
            {/* Background Gradient/Mesh Placeholder */}
            <View style={[styles.backgroundBase, { backgroundColor: config.bg }]} />

            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
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
                        <Text style={styles.metricLabel}>COHERENCIA</Text>
                        <Text style={styles.metricValue}>{metrics?.hrv || '--'}<Text style={styles.metricUnit}> ms</Text></Text>
                    </View>
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
                        onPress={() => handleAction('healing')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="leaf-outline" size={32} color={suggestedMode === 'healing' ? '#2DD4BF' : 'rgba(45, 212, 191, 0.4)'} />
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
                        onPress={() => handleAction('growth')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="flash-outline" size={32} color={suggestedMode === 'growth' ? '#FBBF24' : 'rgba(251, 191, 36, 0.4)'} />
                        <Text style={[styles.cardTitle, { color: '#FBBF24' }]}>CRECER</Text>
                        <Text style={styles.cardDesc}>Energía</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    subHeader: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
        marginBottom: 15,
        textAlign: 'center',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 30,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    insightText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginVertical: 40,
    },
    recommendationLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        width: '48%',
        height: 160,
        borderRadius: 24,
        padding: 20,
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
        fontSize: 20,
        fontWeight: '900',
        marginTop: 15,
        letterSpacing: 1,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    metricsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginTop: 30,
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
        marginBottom: 5,
    },
    metricValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    metricUnit: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.4)',
    },
    metricDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    }
});

export default CardioResultScreen;
