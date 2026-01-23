import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { MeditationSession } from '../data/sessionsData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    isVisible: boolean;
    session: MeditationSession | null;
    onClose: () => void;
    onStart: (session: MeditationSession) => void;
}

const SessionPreviewModal: React.FC<Props> = ({ isVisible, session, onClose, onStart }) => {
    if (!session) return null;

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header with Close */}
                    <View style={styles.header}>
                        <View style={[styles.categoryBadge, { backgroundColor: `${session.color}20` }]}>
                            <Text style={[styles.categoryText, { color: session.color }]}>
                                {session.category.toUpperCase()}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.title}>{session.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
                                <Text style={styles.metaText}>{session.durationMinutes} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="fitness-outline" size={16} color={theme.colors.textMuted} />
                                <Text style={styles.metaText}>{session.difficultyLevel}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>{session.description}</Text>

                        {/* Professional Credits */}
                        <View style={styles.creatorCard}>
                            <View style={styles.creatorAvatar}>
                                <Ionicons name="person" size={20} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.creatorName}>{session.creatorName}</Text>
                                <Text style={styles.creatorCredentials}>{session.creatorCredentials}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Science Section */}
                        <View style={styles.scienceSection}>
                            <View style={styles.scienceHeader}>
                                <Ionicons name="flask-outline" size={18} color={theme.colors.accent} />
                                <Text style={styles.scienceTitle}>¿Por qué funciona?</Text>
                            </View>
                            <Text style={styles.scienceText}>{session.scientificBenefits}</Text>
                        </View>

                        <View style={styles.preparationBox}>
                            <Text style={styles.prepTitle}>Preparación:</Text>
                            <Text style={styles.prepText}>• Usa auriculares para mejor experiencia.</Text>
                            <Text style={styles.prepText}>• Busca un lugar tranquilo y sin interrupciones.</Text>
                        </View>
                    </ScrollView>

                    {/* Footer Action */}
                    <TouchableOpacity
                        style={[styles.startBtn, { backgroundColor: theme.colors.primary }]}
                        onPress={() => onStart(session)}
                    >
                        <Text style={styles.startBtnText}>Iniciar Sesión</Text>
                        <Ionicons name="play" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: SCREEN_HEIGHT * 0.85,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.textMain,
        marginBottom: 12,
        lineHeight: 34,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: theme.colors.textMain,
        lineHeight: 24,
        marginBottom: 24,
        opacity: 0.9,
    },
    creatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    creatorAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(74, 103, 65, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    creatorCredentials: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 24,
    },
    scienceSection: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
        marginBottom: 24,
    },
    scienceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    scienceTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.accent,
    },
    scienceText: {
        fontSize: 14,
        color: theme.colors.textMain,
        lineHeight: 22,
        opacity: 0.8,
    },
    preparationBox: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderRadius: 16,
    },
    prepTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: 8,
    },
    prepText: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginBottom: 4,
    },
    startBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    startBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
    },
});

export default SessionPreviewModal;
