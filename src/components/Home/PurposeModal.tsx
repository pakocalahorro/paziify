import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import ResilienceTree from '../Profile/ResilienceTree';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface PurposeModalProps {
    isVisible: boolean;
    onAccept: () => void;
    onClose: () => void;
}

const PurposeModal: React.FC<PurposeModalProps> = ({ isVisible, onAccept, onClose }) => {
    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.overlay}>
                <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <View style={styles.treeWrapper}>
                                <ResilienceTree daysPracticed={12} size={160} isGuest={false} />
                            </View>
                            <Text style={styles.title}>Tu Propósito en Paziify</Text>
                            <Text style={styles.subtitle}>Acepta el reto para transformar tu vida y la de los demás.</Text>
                        </View>

                        <View style={styles.itemsContainer}>
                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(74, 103, 65, 0.2)' }]}>
                                    <Ionicons name="heart" size={24} color="#4ADE80" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Equilibrio Emocional</Text>
                                    <Text style={styles.itemDescription}>
                                        Mejora tu salud y paz interior practicando a diario durante un mes completo.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(212, 175, 55, 0.2)' }]}>
                                    <Ionicons name="earth" size={24} color="#D4AF37" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Guía y Motivación</Text>
                                    <Text style={styles.itemDescription}>
                                        Comparte tu camino al final para inspirar y guiar a otras personas en su búsqueda.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                    <Ionicons name="gift" size={24} color="#FFF" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Regalo Sorpresa</Text>
                                    <Text style={styles.itemDescription}>
                                        Una recompensa exclusiva te espera al completar el florecer de tu árbol.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={onAccept}>
                            <Text style={styles.buttonText}>Acepto el Reto</Text>
                            <Ionicons name="sparkles" size={18} color={theme.colors.background} style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                        <Text style={styles.footerNote}>
                            Solo tú puedes dar el primer paso hacia tu nueva realidad.
                        </Text>
                    </ScrollView>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        maxHeight: '85%',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    treeWrapper: {
        height: 160,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 20,
    },
    itemsContainer: {
        width: '100%',
        gap: 24,
        marginBottom: 40,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemTexts: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 18,
    },
    button: {
        backgroundColor: '#FFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        shadowColor: "#FFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.background,
    },
    footerNote: {
        marginTop: 24,
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        fontStyle: 'italic',
        textAlign: 'center',
    }
});

export default PurposeModal;
