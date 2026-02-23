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
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>
                        <View style={styles.header}>
                            <View style={styles.treeWrapper}>
                                <ResilienceTree daysPracticed={0} totalSteps={30} size={110} isGuest={false} />
                            </View>
                            <Text style={styles.title}>Diseña tu Evolución</Text>
                            <Text style={styles.subtitle}>Paziify se adapta a tu ritmo. Elige el compromiso que necesites hoy.</Text>
                        </View>

                        <View style={styles.itemsContainer}>
                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(74, 103, 65, 0.2)' }]}>
                                    <Ionicons name="flash" size={24} color="#4ADE80" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Misiones y Desafíos</Text>
                                    <Text style={styles.itemDescription}>
                                        Elige entre 3, 7 o 30 días según tu energía y compromiso actual.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(212, 175, 55, 0.2)' }]}>
                                    <Ionicons name="leaf" size={24} color="#D4AF37" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Árbol Adaptativo</Text>
                                    <Text style={styles.itemDescription}>
                                        Tu Árbol de Resiliencia florecerá al ritmo de tu camino elegido.
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                    <Ionicons name="people" size={24} color="#FFF" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Propósito Compartido</Text>
                                    <Text style={styles.itemDescription}>
                                        Tu evolución personal inspira y guía a otros en su búsqueda de paz.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={onAccept}>
                            <Text style={styles.buttonText}>Explorar mi Evolución</Text>
                            <Ionicons name="arrow-forward" size={18} color={theme.colors.background} style={{ marginLeft: 8 }} />
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
        padding: 16,
        paddingBottom: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    treeWrapper: {
        height: 110,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 18,
    },
    itemsContainer: {
        width: '100%',
        gap: 8,
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTexts: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 2,
    },
    itemDescription: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 16,
    },
    button: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
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
        marginTop: 12,
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        fontStyle: 'italic',
        textAlign: 'center',
    }
});

export default PurposeModal;
