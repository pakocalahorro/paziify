import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Animated,
    Platform,
} from 'react-native';
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
        { icon: 'sad-outline', label: 'Tenso' },
        { icon: 'alert-circle-outline', label: '' },
        { icon: 'remove-circle-outline', label: '' },
        { icon: 'happy-outline', label: '' },
        { icon: 'leaf-outline', label: 'Calmado' },
    ];

    // Map custom indices to mockup emojis/icons
    const getMoodIcon = (indexValue: number) => {
        switch (indexValue) {
            case 0: return 'sad';
            case 1: return 'body';
            case 2: return 'remove-circle';
            case 3: return 'happy';
            case 4: return 'leaf';
            default: return 'happy';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>SESIÓN COMPLETADA</Text>
                </View>

                <Text style={styles.title}>¿Cómo te sientes ahora?</Text>

                <View style={styles.moodSelector}>
                    {moods.map((_, index) => (
                        <TouchableOpacity
                            key={index}
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
                                name={getMoodIcon(index) as any}
                                size={28}
                                color={selectedMood === index ? '#FFF' : 'rgba(255,255,255,0.3)'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.moodLabels}>
                    <Text style={styles.moodLabel}>TENSO</Text>
                    <Text style={styles.moodLabel}>CALMADO</Text>
                </View>

                {/* G.G. Assistant Box */}
                <View style={styles.assistantBox}>
                    <View style={styles.assistantAvatar}>
                        <Ionicons name="person-circle-outline" size={40} color={theme.colors.primary} />
                        <View style={styles.assistantStatus} />
                    </View>
                    <View style={styles.assistantContent}>
                        <Text style={styles.assistantTitle}>G.G. ASSISTANT</Text>
                        <Text style={styles.assistantText}>
                            Este dato nos ayuda a medir tu resiliencia semanal.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleFinish}>
                    <Text style={styles.buttonText}>Guardar y Continuar</Text>
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
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
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
        marginBottom: 12,
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
    moodLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 60,
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
    assistantStatus: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: '#1A1A1A',
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
    footer: {
        padding: 30,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default SessionEndScreen;
