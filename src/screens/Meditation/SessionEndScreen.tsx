import React, { useState, useEffect } from 'react';
import ReanimatedAnimated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    Animated,
    Platform,
    TextInput,
    Switch,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, RootStackParamList, UserState } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { analyticsService } from '../../services/analyticsService';
import ResilienceTree from '../../components/Profile/ResilienceTree';
import { CHALLENGES } from '../../constants/challenges';

type SessionEndScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.SESSION_END
>;

type SessionEndScreenRouteProp = RouteProp<RootStackParamList, Screen.SESSION_END>;

interface Props {
    navigation: SessionEndScreenNavigationProp;
}

const SessionEndScreen: React.FC<Props> = ({ navigation }) => {
    const route = useRoute<SessionEndScreenRouteProp>();
    const { sessionId, durationMinutes, thumbnailUrl } = route.params;
    const { user, userState, updateUserState } = useApp();
    const [selectedMood, setSelectedMood] = useState<number>(3); // Default to middle/calm
    const [isSharing, setIsSharing] = useState(false);
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Heartbeat animation for Verificar button
    const heartScale = useSharedValue(1);
    useEffect(() => {
        heartScale.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 600, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 500, easing: Easing.in(Easing.ease) }),
                withTiming(1.05, { duration: 400, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) }),
            ),
            -1, false
        );
    }, []);
    const heartbeatStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const isChallengeSession = !!userState.activeChallenge;

    useEffect(() => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, []);

    const saveData = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            // 1. Record in Supabase (Permanent)
        if (user?.id) {
            try {
                const challengeId = userState.activeChallenge?.id;
                const isChallengeDay = !!userState.activeChallenge;
                // Calculamos el día actual del reto (si es reto, es el completado + 1)
                const challengeDay = isChallengeDay ? (userState.activeChallenge?.daysCompleted || 0) + 1 : undefined;

                await analyticsService.recordSession(
                    user.id, 
                    sessionId, 
                    durationMinutes, 
                    selectedMood + 1,
                    challengeId,
                    challengeDay,
                    userState.lifeMode
                );
            } catch (error) {
                console.error("Failed to record session in Supabase:", error);
            }
        }

        // 2. Update local state (UI Responsiveness)
        const now = new Date();
        const lastSession = userState.lastSessionDate ? new Date(userState.lastSessionDate) : null;
        let newStreak = userState.streak;

        if (!lastSession || (now.getTime() - lastSession.getTime() > 24 * 60 * 60 * 1000)) {
            newStreak += 1;
        }

        const updateObj: Partial<UserState> = {
            streak: newStreak,
            isDailySessionDone: true,
            lastSessionDate: now.toISOString(),
            resilienceScore: Math.min(userState.resilienceScore + (selectedMood >= 3 ? 3 : 1), 100),
            totalMinutes: (userState.totalMinutes || 0) + durationMinutes,
        };

        if (isChallengeSession && userState.activeChallenge) {
            const todayStr = now.toISOString().split('T')[0];
            const lastCompletedStr = userState.activeChallenge.lastSessionCompletedDate?.split('T')[0];

            if (todayStr !== lastCompletedStr) {
                const nextDay = userState.activeChallenge.daysCompleted + 1;
                // Importamos CHALLENGES dinámicamente o nos aseguramos que esté disponible
                // Para este paso, asumimos que se inyecta o se importa arriba (comprobado en view_file)
                const challenge = CHALLENGES[userState.activeChallenge.id];
                const nextSessionSlug = challenge?.sessionSchedule?.[nextDay] || userState.activeChallenge.currentSessionSlug;

                updateObj.activeChallenge = {
                    ...userState.activeChallenge,
                    daysCompleted: nextDay,
                    currentSessionSlug: nextSessionSlug, // C-6 Fix
                    lastSessionCompletedDate: now.toISOString(),
                };
            }
        }

        updateUserState(updateObj);

        // 3. Sync streak to Supabase (Ensure persistence)
        if (user?.id) {
            analyticsService.updateProfileStreak(user.id, newStreak);
        }
        
    } catch (error) {
        console.error("Critical error in saveData:", error);
        setIsSaving(false); // Liberar bloqueo si falla
    }
    };

    const handleFinish = async () => {
        const wasChallengeJustCompleted = 
            isChallengeSession && 
            userState.activeChallenge && 
            (userState.activeChallenge.daysCompleted + 1 >= userState.activeChallenge.totalDays);

        await saveData();

        if (wasChallengeJustCompleted && userState.activeChallenge) {
            navigation.navigate(Screen.CHALLENGE_COMPLETION, {
                challengeId: userState.activeChallenge.id,
                challengeTitle: userState.activeChallenge.title,
                totalDaysCompleted: userState.activeChallenge.daysCompleted + 1
            });
        } else {
            // @ts-ignore
            navigation.navigate('MainTabs');
        }
    };

    const moods = [
        { icon: 'sad', label: 'Peor', color: '#FF6B6B' },
        { icon: 'body', label: 'Igual', color: '#FFD933' },
        { icon: 'remove-circle', label: 'Bien', color: '#4CAF50' },
        { icon: 'happy', label: 'Genial', color: '#2DD4BF' },
        { icon: 'leaf', label: 'Excelente', color: '#2DD4BF' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Session Background Image */}
            {thumbnailUrl && (
                <ImageBackground
                    source={{ uri: thumbnailUrl }}
                    style={StyleSheet.absoluteFill}
                    imageStyle={{ opacity: 0.3 }}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(10,10,10,0.6)', 'rgba(10,10,10,0.95)', '#0A0A0A']}
                        style={StyleSheet.absoluteFill}
                    />
                </ImageBackground>
            )}

            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    // @ts-ignore
                    navigation.navigate('MainTabs');
                }} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.badge, isChallengeSession && { backgroundColor: theme.colors.accent }]}>
                    <Text style={styles.badgeText}>{isChallengeSession ? 'MISIÓN COMPLETADA' : 'SESIÓN COMPLETADA'}</Text>
                </View>

                {/* VISUALIZACIÓN: Solo Árbol para Retos */}
                {isChallengeSession && (
                    <View style={{ height: 200, justifyContent: 'center', marginBottom: 20 }}>
                        <ResilienceTree
                            daysPracticed={userState.activeChallenge?.daysCompleted ? userState.activeChallenge.daysCompleted + 1 : 1}
                            totalSteps={userState.activeChallenge?.totalDays}
                            size={180}
                        />
                    </View>
                )}

                {isChallengeSession && (
                    <Text style={[styles.title, { fontSize: 18, color: theme.colors.accent, marginBottom: 10 }]}>
                        ¡Día {userState.activeChallenge?.daysCompleted ? userState.activeChallenge.daysCompleted + 1 : 1} de {userState.activeChallenge?.totalDays} completado!
                    </Text>
                )}

                <Text style={styles.title}>¿Cómo te sientes ahora?</Text>

                <View style={styles.moodSelector}>
                    {moods.map((mood, index) => (
                        <View key={index} style={styles.moodItemContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.moodItem,
                                    selectedMood === index && styles.moodItemActive
                                ]}
                                onPress={() => {
                                    setSelectedMood(index);
                                    if (Platform.OS !== 'web') {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }
                                }}
                            >
                                <Ionicons
                                    name={mood.icon as any}
                                    size={28}
                                    color={selectedMood === index ? '#FFF' : 'rgba(255,255,255,0.3)'}
                                />
                            </TouchableOpacity>
                            <Text style={[
                                styles.moodLabel,
                                { color: selectedMood === index ? theme.colors.primary : 'rgba(255,255,255,0.4)' }
                            ]}>
                                {mood.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* G.G. Assistant or Expert Tip */}
                {selectedMood <= 1 ? (
                    <View style={[styles.assistantBox, styles.negativeAlert]}>
                        <View style={styles.assistantAvatar}>
                            <Ionicons name="fitness-outline" size={32} color={theme.colors.accent} />
                        </View>
                        <View style={styles.assistantContent}>
                            <Text style={styles.assistantTitle}>CONSEJO DE G.G.</Text>
                            <Text style={styles.assistantText}>
                                Si no sientes relajación, intenta dar un paseo o hacer 5 minutos de estiramientos físicos. ¡A veces el cuerpo necesita soltar antes que la mente!
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.assistantBox}>
                        <View style={styles.assistantAvatar}>
                            <Ionicons name="sunny-outline" size={32} color={theme.colors.primary} />
                        </View>
                        <View style={styles.assistantContent}>
                            <Text style={styles.assistantTitle}>PALABRA DE EXPERTO</Text>
                            <Text style={styles.assistantText}>
                                {new Date().getHours() < 19
                                    ? "Un momento de calma ahora protege tu paz durante todo el día. Mantén esta presencia en tus próximas tareas."
                                    : "Cierra el día con gratitud. Lo que has hecho es suficiente, el descanso es tu prioridad ahora."}
                            </Text>
                        </View>
                    </View>
                )}



            </ScrollView>

            <View style={styles.footer}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Verificar Impacto */}
                    <TouchableOpacity
                        style={[styles.cardioFooterBtn, isSaving && { opacity: 0.5 }]}
                        onPress={async () => {
                            await saveData();
                            navigation.navigate(Screen.CARDIO_SCAN, { context: 'post_session' });
                        }}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FF4B4B" />
                        ) : (
                            <ReanimatedAnimated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }, heartbeatStyle]}>
                                <Ionicons name="heart-circle" size={22} color="#FF4B4B" />
                                <Text style={styles.cardioFooterText}>Verificar</Text>
                            </ReanimatedAnimated.View>
                        )}
                    </TouchableOpacity>

                    {/* Continuar */}
                    <TouchableOpacity 
                        style={[styles.button, isSaving && { opacity: 0.5 }]} 
                        onPress={handleFinish}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>{(isSharing && comment) ? 'Publicar' : 'Continuar'}</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A', // Deep dark background
    },
    header: {
        paddingHorizontal: 20,
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    closeButton: {
        padding: 5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: 20,
    },
    badge: {
        backgroundColor: 'rgba(74, 103, 65, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 30,
    },
    badgeText: {
        fontFamily: 'Outfit_800ExtraBold',
        color: theme.colors.primary,
        fontSize: 12,
        letterSpacing: 1,
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 22,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 24,
    },
    moodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    moodItemContainer: {
        alignItems: 'center',
        gap: 8,
    },
    moodItem: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    moodItemActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    moodLabel: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
    },
    assistantBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    assistantAvatar: {
        position: 'relative',
        marginRight: 15,
    },
    assistantContent: {
        flex: 1,
    },
    assistantTitle: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        marginBottom: 4,
    },
    assistantText: {
        fontSize: 14,
        color: '#FFF',
        lineHeight: 20,
        opacity: 0.8,
    },
    negativeAlert: {
        borderColor: theme.colors.accent,
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
    },
    shareSection: {
        paddingHorizontal: 25,
        paddingBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginHorizontal: 20,
        borderRadius: 24,
        paddingTop: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    shareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shareText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    quoteAuthor: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontStyle: 'italic',
    },
    // NEW STYLES
    cardioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold tint
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        gap: 12,
    },
    cardioButtonText: {
        color: '#FFD700', // Gold
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 20,
        width: '100%',
    },
    shareSubtext: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 4,
    },
    commentInput: {
        marginTop: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: 15,
        color: '#FFF',
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        paddingTop: 10,
    },
    button: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
        fontFamily: 'Outfit_800ExtraBold',
        color: '#FFF',
        fontSize: 18,
    },
    cardioFooterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 18,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 75, 75, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 75, 0.3)',
    },
    cardioFooterText: {
        fontFamily: 'Outfit_700Bold',
        color: '#FF4B4B',
        fontSize: 14,
    },
});

export default SessionEndScreen;
