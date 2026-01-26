import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface SpeedControlModalProps {
    visible: boolean;
    currentSpeed: number;
    onClose: () => void;
    onSelectSpeed: (speed: number) => void;
}

const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

const SpeedControlModal: React.FC<SpeedControlModalProps> = ({
    visible,
    currentSpeed,
    onClose,
    onSelectSpeed,
}) => {
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
                        <Text style={styles.title}>Velocidad de Reproducción</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.textMain} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.speedsContainer}>
                        {speeds.map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                style={[
                                    styles.speedButton,
                                    currentSpeed === speed && styles.speedButtonActive,
                                ]}
                                onPress={() => {
                                    onSelectSpeed(speed);
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.speedText,
                                        currentSpeed === speed && styles.speedTextActive,
                                    ]}
                                >
                                    {speed}x
                                </Text>
                                {currentSpeed === speed && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color={theme.colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
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
    speedsContainer: {
        gap: theme.spacing.sm,
    },
    speedButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    speedButtonActive: {
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        borderColor: theme.colors.primary,
    },
    speedText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
    speedTextActive: {
        color: theme.colors.primary,
    },
});

export default SpeedControlModal;
