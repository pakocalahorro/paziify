import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';
import { MeditationSession } from '../data/sessionsData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    isVisible: boolean;
    session: MeditationSession | null;
    onClose: () => void;
    onStart: (session: MeditationSession) => void;
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SessionPreviewModal: React.FC<Props> = ({ isVisible, session, onClose, onStart }) => {
    const insets = useSafeAreaInsets();

    if (!session) return null;

    const bgImage = session.thumbnailUrl ? { uri: session.thumbnailUrl } : null;

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <ImageBackground
                    source={bgImage as any}
                    style={styles.fullBackground}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={[styles.modalContent, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
                        {/* Header with Close - Overlaid on top */}
                        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            style={styles.scrollView}
                        >
                            <View style={styles.topSpacer} />

                            <View style={styles.glassContainer}>
                                <BlurView intensity={40} tint="dark" style={styles.glassBlur}>
                                    <View style={[styles.categoryBadge, { backgroundColor: `${session.color}30` }]}>
                                        <Text style={[styles.categoryText, { color: session.color || '#FFF' }]}>
                                            {(session.category.toLowerCase() === 'ansiedad' ? 'Calma SOS' : session.category).toUpperCase()}
                                        </Text>
                                    </View>

                                    <Text style={styles.title}>{session.title}</Text>

                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="time-outline" size={16} color="#2DD4BF" />
                                            <Text style={styles.metaText}>{session.durationMinutes} min</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="fitness-outline" size={16} color="#FCD34D" />
                                            <Text style={styles.metaText}>{session.difficultyLevel}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.description}>{session.description}</Text>

                                    {/* NEW - Practice Rhythm Section */}
                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>RITMO DE RESPIRACIÓN</Text>
                                        <View style={styles.rhythmRow}>
                                            <View style={styles.rhythmItem}>
                                                <Ionicons name="arrow-up-circle-outline" size={16} color={session.color} />
                                                <Text style={styles.rhythmValue}>{session.breathingPattern.inhale}s</Text>
                                                <Text style={styles.rhythmLabel}>Inhala</Text>
                                            </View>
                                            {session.breathingPattern.hold > 0 && (
                                                <View style={styles.rhythmItem}>
                                                    <Ionicons name="pause-circle-outline" size={16} color={session.color} />
                                                    <Text style={styles.rhythmValue}>{session.breathingPattern.hold}s</Text>
                                                    <Text style={styles.rhythmLabel}>Mantén</Text>
                                                </View>
                                            )}
                                            <View style={styles.rhythmItem}>
                                                <Ionicons name="arrow-down-circle-outline" size={16} color={session.color} />
                                                <Text style={styles.rhythmValue}>{session.breathingPattern.exhale}s</Text>
                                                <Text style={styles.rhythmLabel}>Exhala</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* NEW - Scientific Goal Section */}
                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>OBJETIVO CIENTÍFICO</Text>
                                        <Text style={styles.infoText}>{session.scientificBenefits}</Text>
                                    </View>

                                    {/* NEW - Getting Ready Section */}
                                    <View style={[styles.infoSection, { marginBottom: 10 }]}>
                                        <Text style={styles.infoSectionTitle}>PREPARACIÓN</Text>
                                        <View style={styles.instructionBox}>
                                            <Ionicons name="information-circle-outline" size={18} color="#2DD4BF" />
                                            <Text style={styles.instructionText}>
                                                {session.practiceInstruction}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Professional Credits */}
                                    <View style={styles.creatorCard}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                                            style={styles.creatorGradient}
                                        />
                                        <View style={styles.creatorAvatar}>
                                            <Ionicons name="sparkles" size={20} color={session.color} />
                                        </View>
                                        <View>
                                            <Text style={styles.creatorName}>{session.creatorName}</Text>
                                            <Text style={[styles.creatorCredentials, { color: session.color }]}>GUÍA ESPIRITUAL</Text>
                                        </View>
                                    </View>
                                </BlurView>
                            </View>
                        </ScrollView>

                        {/* Pinned Footer Action */}
                        <View style={[styles.footerAction, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.startBtn, { backgroundColor: session.color || theme.colors.primary }]}
                                onPress={() => onStart(session)}
                            >
                                <Text style={styles.startBtnText}>Comenzar Práctica</Text>
                                <Ionicons name="play" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullBackground: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    topSpacer: {
        height: SCREEN_HEIGHT * 0.12, // Lowered spacer significantly
    },
    glassContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    glassBlur: {
        padding: 24,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
        opacity: 0.8,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 22,
        marginBottom: 24,
        fontWeight: '500',
    },
    infoSection: {
        marginBottom: 24,
    },
    infoSectionTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: 22,
        fontWeight: '500',
    },
    instructionBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(45, 212, 191, 0.06)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.12)',
        gap: 12,
        alignItems: 'center',
    },
    instructionText: {
        flex: 1,
        fontSize: 14,
        color: '#2DD4BF',
        fontWeight: '700',
        lineHeight: 20,
    },
    rhythmRow: {
        flexDirection: 'row',
        gap: 12,
    },
    rhythmItem: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    rhythmValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 4,
    },
    rhythmLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 1,
        marginTop: 2,
    },
    creatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 16,
        marginBottom: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    creatorGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    creatorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    creatorName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    creatorCredentials: {
        fontSize: 10,
        color: '#2DD4BF',
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    startBtn: {
        flexDirection: 'row',
        height: 64,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    startBtnText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    footerAction: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: 15,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
});

export default SessionPreviewModal;
