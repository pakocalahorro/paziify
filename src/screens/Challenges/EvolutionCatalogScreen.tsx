import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../../types';
import { useApp } from '../../context/AppContext';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';


import { CHALLENGES, ChallengeInfo } from '../../constants/challenges';
import { ChallengeDetailsModal } from '../../components/Challenges/ChallengeDetailsModal';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';

const EvolutionCatalogScreen = () => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
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

    // 6. Dynamic Background Logic (Fallback Vanguard Tier)
    const dynamicBackgroundUri = userState.lastSelectedBackgroundUri || (
        userState.lifeMode === 'healing'
            ? 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_forest.webp'
            : 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_cosmos.webp'
    );
    const themeColors = {
        desafio: '#2DD4BF', // Teal
        reto: '#8B5CF6',    // Violet
        mision: '#FBBF24'   // Amber
    };

    const challengesArray = Object.values(CHALLENGES);
    const desafios = challengesArray.filter(c => c.type === 'desafio');
    const retos = challengesArray.filter(c => c.type === 'reto');
    const misiones = challengesArray.filter(c => c.type === 'mision');

    const activeChallengeId = userState.activeChallenge?.id;

    const openChallenge = (challenge: ChallengeInfo) => {
        setSelectedChallenge(challenge);
    };

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="EVOLUCIÓN"
                    path={["Oasis"]}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) {
                            // Evolution is outside MainTabs, so we must route to the parent tab navigator explicitly
                            navigation.navigate('MainTabs' as any, { screen: Screen.HOME } as any);
                        }
                    }}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState?.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => { }}
                    onProfilePress={() => navigation.navigate(Screen.PROFILE)}
                    activeChallengeType={userState.activeChallenge?.type as any}
                />
            }
            themeMode={userState.lifeMode || 'healing'}
            remoteImageUri={dynamicBackgroundUri}
            showSafeOverlay={true}
            disableContentPadding={true}
        >
            <View style={[styles.container, { paddingBottom: insets.bottom + 20, paddingTop: 10 }]}>

                {/* 1. HERO SECTION: DESAFÍOS (flex: 1.1) */}
                <View style={styles.heroSection}>
                    {desafios.map((challenge) => (
                        <TouchableOpacity
                            key={challenge.id}
                            activeOpacity={0.9}
                            onPress={() => openChallenge(challenge)}
                            style={[styles.heroCard, { backgroundColor: `${themeColors.desafio}4D` }]}
                        >
                            {/* Thematic Icon & Title */}
                            <BlurView intensity={20} tint="light" style={styles.heroTopBadge}>
                                <Ionicons name="medical" size={14} color="#FFF" />
                                <Text style={[styles.heroBadgeText, { color: '#FFF' }]}>DESAFÍO GLOBAL</Text>
                            </BlurView>

                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle} numberOfLines={2}>{challenge.title}</Text>
                                <View style={styles.heroMetaRow}>
                                    <View style={styles.heroMetaItem}>
                                        <Ionicons name="time-outline" size={16} color="#FFF" />
                                        <Text style={[styles.heroMetaText, { color: '#FFF' }]}>{challenge.days} Días</Text>
                                    </View>
                                    {challenge.id === activeChallengeId && (
                                        <View style={styles.activePillHero}>
                                            <Ionicons name="checkmark-circle" size={12} color="#FFF" />
                                            <Text style={styles.activePillText}>Activo</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 2. MID SECTION: RETOS DE ESENCIA (Fixed Height, Horizontal Scroll) */}
                {retos.length > 0 && (
                    <View style={styles.midSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="leaf-outline" size={18} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.sectionTitle}>RETOS DE ESENCIA</Text>
                            <View style={[styles.sectionLine, { backgroundColor: themeColors.reto }]} />
                        </View>

                        <View style={styles.retosGrid}>
                            {retos.map((challenge) => (
                                <TouchableOpacity
                                    key={challenge.id}
                                    activeOpacity={0.9}
                                    onPress={() => openChallenge(challenge)}
                                    style={[
                                        styles.retoCard,
                                        { backgroundColor: `${themeColors.reto}4D` },
                                        challenge.id === activeChallengeId && { borderColor: '#FFF', borderWidth: 2 }
                                    ]}
                                >
                                    <View style={styles.retoTop}>
                                        <Ionicons name="body" size={24} color="#FFF" />
                                        {challenge.id === activeChallengeId && (
                                            <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.activeIconRight} />
                                        )}
                                    </View>
                                    <View style={styles.retoBottom}>
                                        <Text style={styles.retoTitle} numberOfLines={2}>{challenge.title}</Text>
                                        <Text style={[styles.retoSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>{challenge.days} Días</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* 3. BOTTOM SECTION: MISIONES RÁPIDAS (flex: 0.8, Compact Grid) */}
                {misiones.length > 0 && (
                    <View style={styles.bottomSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="flash-outline" size={18} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.sectionTitle}>MISIONES EXPRESS</Text>
                            <View style={[styles.sectionLine, { backgroundColor: themeColors.mision }]} />
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            <View style={styles.misionesGrid}>
                                {misiones.map((challenge) => (
                                    <TouchableOpacity
                                        key={challenge.id}
                                        activeOpacity={0.8}
                                        onPress={() => openChallenge(challenge)}
                                        style={[
                                            styles.misionCard,
                                            { backgroundColor: `${themeColors.mision}4D` },
                                            challenge.id === activeChallengeId && { borderColor: '#FFF', borderWidth: 2 }
                                        ]}
                                    >
                                        <View style={styles.misionRow}>
                                            <Ionicons name="sunny" size={20} color="#FFF" />
                                            <View style={styles.misionTextCol}>
                                                <Text style={styles.misionTitle} numberOfLines={1}>{challenge.title}</Text>
                                                <Text style={styles.misionSubtitle}>{challenge.days} Días</Text>
                                            </View>
                                            {challenge.id === activeChallengeId && (
                                                <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}

                <ChallengeDetailsModal
                    visible={!!selectedChallenge}
                    challenge={selectedChallenge}
                    onClose={() => setSelectedChallenge(null)}
                    onActivate={activateChallenge}
                />
            </View>
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 16,
    },
    heroSection: {
        flex: 1.1,
    },
    heroCard: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'flex-end',
        padding: 20,
    },
    heroTopBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        gap: 6,
    },
    heroBadgeText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 10,
        letterSpacing: 1,
    },
    heroContent: {
        width: '100%',
    },
    heroTitle: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 42,
        color: '#FFF',
        lineHeight: 46,
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    heroMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    heroMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    heroMetaText: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 12,
    },
    activePillHero: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activePillText: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 10,
        color: '#FFF',
        textTransform: 'uppercase',
    },
    midSection: {
        height: 160,
    },
    bottomSection: {
        flex: 0.8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1.5,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        opacity: 0.3,
    },
    retosGrid: {
        flexDirection: 'row',
        gap: 12,
        flex: 1,
    },
    retoCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        justifyContent: 'space-between',
    },
    retoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    activeIconRight: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
    },
    retoBottom: {
        // Space distribution managed by container
    },
    retoTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: '#FFF',
        marginBottom: 4,
    },
    retoSubtitle: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 11,
        letterSpacing: 0.5,
    },
    misionesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    misionCard: {
        width: '48%',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 12,
    },
    misionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    misionTextCol: {
        flex: 1,
    },
    misionTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 13,
        color: '#FFF',
        marginBottom: 2,
    },
    misionSubtitle: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 9,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
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
