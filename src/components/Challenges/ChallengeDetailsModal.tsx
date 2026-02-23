import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChallengeInfo } from '../../constants/challenges';

interface ChallengeDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    challenge: ChallengeInfo | null;
    onActivate?: (challenge: ChallengeInfo) => void;
    hideActivateButton?: boolean;
}

export const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
    visible,
    onClose,
    challenge,
    onActivate,
    hideActivateButton = false,
}) => {
    if (!challenge) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>

                    <View style={styles.modalBody}>
                        <View style={[styles.iconContainer, { backgroundColor: `${challenge.colors[0]}20` }]}>
                            <Ionicons name={challenge.icon} size={32} color={challenge.colors[0]} />
                        </View>

                        <Text style={styles.modalTitle}>{challenge.title}</Text>
                        <Text style={styles.modalDays}>{challenge.days} DÍAS DE EVOLUCIÓN</Text>

                        <Text style={styles.modalDesc}>{challenge.description}</Text>

                        <View style={styles.benefitsContainer}>
                            <Text style={styles.benefitsSubtitle}>LO QUE VAS A LOGRAR:</Text>
                            {challenge.benefits.map((benefit, idx) => (
                                <View key={idx} style={styles.benefitRow}>
                                    <Ionicons name="checkmark-circle" size={16} color={challenge.colors[0]} />
                                    <Text style={styles.benefitText}>{benefit}</Text>
                                </View>
                            ))}
                        </View>

                        {!hideActivateButton && onActivate && (
                            <TouchableOpacity
                                style={styles.activateButton}
                                onPress={() => onActivate(challenge)}
                            >
                                <LinearGradient
                                    colors={challenge.colors}
                                    style={styles.activateGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.activateButtonText}>Confirmar y Empezar</Text>
                                    <Ionicons name="sparkles" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        marginBottom: 16,
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
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
    },
    benefitsSubtitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    benefitText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    activateButton: {
        width: '100%',
        height: 56,
        borderRadius: 18,
        overflow: 'hidden',
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
        fontWeight: '700',
    },
});
