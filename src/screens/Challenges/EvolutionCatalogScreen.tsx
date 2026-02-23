import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, RootStackParamList, ChallengeType } from '../../types';
import { useApp } from '../../context/AppContext';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AuraBackground from '../../components/Profile/AuraBackground';

const { width } = Dimensions.get('window');

import { CHALLENGES, ChallengeInfo } from '../../constants/challenges';
import { ChallengeDetailsModal } from '../../components/Challenges/ChallengeDetailsModal';

const EvolutionCatalogScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { userState, updateUserState } = useApp();
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeInfo | null>(null);

    const handleSelectChallenge = (id: string) => {
        const challenge = CHALLENGES[id];
        if (challenge) {
            setSelectedChallenge(challenge);
        }
    };

    const activateChallenge = () => {
        if (!selectedChallenge) return;

        updateUserState({
            activeChallenge: {
                id: selectedChallenge.id,
                slug: selectedChallenge.id,
                type: selectedChallenge.type,
                title: selectedChallenge.title,
                startDate: new Date().toISOString(),
                daysCompleted: 0,
                totalDays: selectedChallenge.days,
                currentSessionSlug: selectedChallenge.sessionSlug,
            }
        });
        setSelectedChallenge(null);
        navigation.navigate('MainTabs' as any, { screen: Screen.HOME });
    };

    return (
        <AuraBackground mode="neutral">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Elegir mi Evolución</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>DESAFÍOS (30 DÍAS)</Text>
                    <TouchableOpacity
                        style={styles.heroCard}
                        onPress={() => handleSelectChallenge('paziify-master')}
                    >
                        <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.cardGradient}>
                            <Text style={styles.cardType}>PROGRAMA MAESTRO</Text>
                            <Text style={styles.cardTitle}>Desafío Paziify</Text>
                            <Text style={styles.cardDesc}>Forja el hábito base con un mix inteligente de 30 días.</Text>
                            <View style={styles.cardBadge}>
                                <Text style={styles.badgeText}>30 DÍAS</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>RETOS DE ESENCIA (7 DÍAS)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <TouchableOpacity
                            style={styles.smallCard}
                            onPress={() => handleSelectChallenge('senda-calma')}
                        >
                            <BlurView intensity={40} tint="dark" style={styles.blurCard}>
                                <Ionicons name="leaf" size={24} color="#2DD4BF" style={{ marginBottom: 12 }} />
                                <Text style={styles.smallCardTitle}>Senda de la Calma</Text>
                                <Text style={styles.smallCardDays}>7 DÍAS</Text>
                            </BlurView>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.smallCard}
                            onPress={() => handleSelectChallenge('senda-foco')}
                        >
                            <BlurView intensity={40} tint="dark" style={styles.blurCard}>
                                <Ionicons name="flash" size={24} color="#FBBF24" style={{ marginBottom: 12 }} />
                                <Text style={styles.smallCardTitle}>Senda del Foco</Text>
                                <Text style={styles.smallCardDays}>7 DÍAS</Text>
                            </BlurView>
                        </TouchableOpacity>
                    </ScrollView>

                    <Text style={styles.sectionTitle}>MISIONES RÁPIDAS (3 DÍAS)</Text>
                    <View style={styles.grid}>
                        <TouchableOpacity
                            style={styles.gridCard}
                            onPress={() => handleSelectChallenge('sprint-sos')}
                        >
                            <LinearGradient colors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']} style={styles.gridGradient}>
                                <Text style={styles.gridTitle}>Sprint SOS</Text>
                                <Text style={styles.gridDays}>3 DÍAS</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridCard}
                            onPress={() => handleSelectChallenge('pausa-express')}
                        >
                            <LinearGradient colors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']} style={styles.gridGradient}>
                                <Text style={styles.gridTitle}>Pausa Express</Text>
                                <Text style={styles.gridDays}>3 DÍAS</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <ChallengeDetailsModal
                    visible={!!selectedChallenge}
                    challenge={selectedChallenge}
                    onClose={() => setSelectedChallenge(null)}
                    onActivate={activateChallenge}
                />
            </SafeAreaView>
        </AuraBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        marginBottom: 16,
        marginTop: 10,
    },
    heroCard: {
        width: '100%',
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 32,
    },
    cardGradient: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    cardType: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 2,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
    },
    cardBadge: {
        position: 'absolute',
        top: 24,
        right: 24,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    horizontalScroll: {
        marginBottom: 32,
    },
    smallCard: {
        width: 160,
        height: 120,
        marginRight: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    blurCard: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    smallCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    smallCardDays: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
    },
    gridCard: {
        flex: 1,
        height: 100,
        borderRadius: 20,
        overflow: 'hidden',
    },
    gridGradient: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    gridTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    gridDays: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 24,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    modalBody: {
        alignItems: 'center',
        paddingTop: 10,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalDays: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        marginBottom: 20,
    },
    modalDesc: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    benefitsContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 32,
    },
    benefitsSubtitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    benefitText: {
        fontSize: 13,
        color: '#FFF',
        fontWeight: '500',
    },
    activateButton: {
        width: '100%',
        height: 56,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    activateGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default EvolutionCatalogScreen;
