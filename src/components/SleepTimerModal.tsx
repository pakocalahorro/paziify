import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface SleepTimerModalProps {
    visible: boolean;
    onClose: () => void;
    onSetTimer: (minutes: number) => void;
    activeTimer: number | null;
    onCancelTimer: () => void;
}

const timerOptions = [5, 10, 15, 30, 45, 60];

const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
    visible,
    onClose,
    onSetTimer,
    activeTimer,
    onCancelTimer,
}) => {
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (activeTimer) {
            setTimeRemaining(activeTimer);
            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev === null || prev <= 0) {
                        clearInterval(interval);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setTimeRemaining(null);
        }
    }, [activeTimer]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Sleep Timer</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.textMain} />
                        </TouchableOpacity>
                    </View>

                    {timeRemaining !== null && timeRemaining > 0 ? (
                        <View style={styles.activeTimerContainer}>
                            <View style={styles.timerDisplay}>
                                <Ionicons name="moon" size={32} color={theme.colors.primary} />
                                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                            </View>
                            <Text style={styles.timerSubtext}>
                                El audio se detendrá automáticamente
                            </Text>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    onCancelTimer();
                                    onClose();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar Timer</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.optionsContainer}>
                            <Text style={styles.subtitle}>
                                Selecciona el tiempo después del cual se detendrá la reproducción
                            </Text>
                            <View style={styles.timerGrid}>
                                {timerOptions.map((minutes) => (
                                    <TouchableOpacity
                                        key={minutes}
                                        style={styles.timerButton}
                                        onPress={() => {
                                            onSetTimer(minutes);
                                            onClose();
                                        }}
                                    >
                                        <Ionicons
                                            name="moon-outline"
                                            size={24}
                                            color={theme.colors.primary}
                                        />
                                        <Text style={styles.timerButtonText}>{minutes} min</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    activeTimerContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    timerDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    timerSubtext: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xl,
    },
    cancelButton: {
        backgroundColor: theme.colors.error,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    optionsContainer: {},
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    timerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        justifyContent: 'center',
    },
    timerButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    timerButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
});

export default SleepTimerModal;
