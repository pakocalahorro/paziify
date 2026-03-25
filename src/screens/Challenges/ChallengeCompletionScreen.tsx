import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import ResilienceTree from '../../components/Profile/ResilienceTree';
import { analyticsService } from '../../services/analyticsService';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';

type RouteProps = RouteProp<RootStackParamList, Screen.CHALLENGE_COMPLETION>;

const { width } = Dimensions.get('window');

const ChallengeCompletionScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProps>();
    const { challengeId, challengeTitle, totalDaysCompleted } = route.params;
    const { user, userState, updateUserState } = useApp();

    useEffect(() => {
        if (Haptics.notificationAsync) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Grabar en historial de Supabase (C-2)
        if (user?.id) {
            analyticsService.recordChallengeCompletion(
                user.id,
                challengeId,
                challengeTitle,
                totalDaysCompleted,
                totalDaysCompleted,
                'completed'
            );
        }
    }, []);

    const handleFinish = () => {
        // Limpiamos el reto activo al finalizar
        updateUserState({ activeChallenge: null });
        navigation.navigate('MainTabs' as any, { screen: Screen.HOME });
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
                style={StyleSheet.absoluteFill}
            />
            
            <ConfettiCannon
                count={200}
                origin={{ x: width / 2, y: -20 }}
                autoStart={true}
                fadeOut={true}
            />

            <View style={styles.content}>
                <View style={styles.treeContainer}>
                    <View style={styles.glowCircle} />
                    <ResilienceTree
                        lightPoints={userState?.resilienceLight || 0}
                        size={220}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.badge}>¡ENHORABUENA!</Text>
                    <Text style={styles.title}>Reto Completado</Text>
                    <Text style={styles.challengeName}>{challengeTitle}</Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{totalDaysCompleted}</Text>
                            <Text style={styles.statLabel}>DÍAS</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>100%</Text>
                            <Text style={styles.statLabel}>FOCO</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        Has demostrado una constancia increíble. Tu árbol de resiliencia ha echado raíces profundas durante estos días. Mantén este impulso.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleFinish}>
                    <LinearGradient
                        colors={[theme.colors.primary, '#0D9488']}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Continuar mi Camino</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    treeContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    glowCircle: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: theme.colors.primary,
        opacity: 0.15,
        transform: [{ scale: 1.5 }],
    },
    textContainer: {
        alignItems: 'center',
    },
    badge: {
        fontFamily: 'Outfit_900Black',
        color: theme.colors.primary,
        fontSize: 12,
        letterSpacing: 3,
        marginBottom: 10,
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 32,
        color: '#FFF',
        textAlign: 'center',
    },
    challengeName: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 36,
        color: '#FBBF24',
        textAlign: 'center',
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        gap: 20,
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
    },
    statValue: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 24,
        color: '#FFF',
    },
    statLabel: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    description: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    button: {
        height: 60,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    buttonText: {
        fontFamily: 'Outfit_800ExtraBold',
        color: '#FFF',
        fontSize: 18,
    },
});

export default ChallengeCompletionScreen;
