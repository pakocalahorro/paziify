import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

type SessionEndScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.SESSION_END
>;

interface Props {
    navigation: SessionEndScreenNavigationProp;
}

const SessionEndScreen: React.FC<Props> = ({ navigation }) => {
    const { userState, updateUserState } = useApp();
    const [selectedMood, setSelectedMood] = useState<number>(3); // Default to middle/calm
    const [isSharing, setIsSharing] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, []);

    const handleFinish = () => {
        // Update user stats on finish
        const now = new Date();
        const lastSession = userState.lastSessionDate ? new Date(userState.lastSessionDate) : null;
        let newStreak = userState.streak;

        // Simple streak logic for demo
        if (!lastSession || (now.getTime() - lastSession.getTime() > 24 * 60 * 60 * 1000)) {
            newStreak += 1;
        }

        updateUserState({
            streak: newStreak,
            isDailySessionDone: true,
            lastSessionDate: now.toISOString(),
            resilienceScore: Math.min(userState.resilienceScore + (selectedMood >= 3 ? 3 : 1), 100),
            totalMinutes: (userState.totalMinutes || 0) + 1,
        });

        navigation.navigate('MainTabs');
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

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>SESIÓN COMPLETADA</Text>
                </View>

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


                {/* Social Section: Compartimos la experiencia?? */}
                {selectedMood >= 3 && (
                    <View style={styles.shareSection}>
                        <View style={styles.shareRow}>
                            <Text style={styles.shareText}>¿Compartimos la experiencia?</Text>
                            <Switch
                                value={isSharing}
                                onValueChange={setIsSharing}
                                trackColor={{ false: '#333', true: theme.colors.primary }}
                                thumbColor={isSharing ? '#FFF' : '#666'}
                            />
                        </View>
                        <Text style={styles.shareSubtext}>
                            Tu opinión ayudará a otros usuarios de la comunidad.
                        </Text>

                        {isSharing && (
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Escribe tu reflexión aquí..."
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                multiline
                                value={comment}
                                onChangeText={setComment}
                                maxLength={200}
                            />
                        )}
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleFinish}>
                    <Text style={styles.buttonText}>{(isSharing && comment) ? 'Publicar y Continuar' : 'Guardar y Continuar'}</Text>
                </TouchableOpacity>
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
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 60,
    },
    moodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
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
        fontSize: 12,
        fontWeight: '700',
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
        fontSize: 12,
        fontWeight: '800',
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
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
});

export default SessionEndScreen;
