import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    Platform,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

const WidgetTutorialModal: React.FC<Props> = ({ isVisible, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Añadir Zen Widget</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.heroSection}>
                            <View style={styles.widgetMock}>
                                <BlurView intensity={20} tint="light" style={styles.mockBlur}>
                                    <Ionicons name="leaf" size={32} color={theme.colors.primary} />
                                    <View style={styles.mockBar} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                        <Ionicons name="heart" size={12} color="#FF4B4B" />
                                        <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>72 BPM</Text>
                                    </View>
                                </BlurView>
                            </View>
                            <Text style={styles.heroText}>
                                Tu progreso, racha y último bio-ritmo siempre a la vista.
                            </Text>
                        </View>

                        <View style={styles.stepsSection}>
                            <Text style={styles.sectionLabel}>PASOS PARA {Platform.OS === 'ios' ? 'IOS' : 'ANDROID'}</Text>

                            {Platform.OS === 'ios' ? (
                                <>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>1</Text></View>
                                        <Text style={styles.stepText}>Mantén pulsado cualquier icono en tu pantalla de inicio.</Text>
                                    </View>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>2</Text></View>
                                        <Text style={styles.stepText}>Pulsa el botón "+" en la parte superior izquierda.</Text>
                                    </View>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>3</Text></View>
                                        <Text style={styles.stepText}>Busca "Paziify" y elige el tamaño de tu widget.</Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>1</Text></View>
                                        <Text style={styles.stepText}>Mantén pulsado un área vacía de tu escritorio.</Text>
                                    </View>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>2</Text></View>
                                        <Text style={styles.stepText}>Toca en "Widgets" y busca la sección de Paziify.</Text>
                                    </View>
                                    <View style={styles.stepRow}>
                                        <View style={styles.stepNumber}><Text style={styles.stepNumText}>3</Text></View>
                                        <Text style={styles.stepText}>Arrastra el widget a tu lugar favorito.</Text>
                                    </View>
                                </>
                            )}
                        </View>

                        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                            <Text style={styles.buttonText}>¡Entendido!</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxHeight: '80%',
        borderRadius: 32,
        overflow: 'hidden',
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
    },
    closeButton: {
        padding: 4,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    widgetMock: {
        width: 120,
        height: 120,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mockBlur: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    mockBar: {
        width: '80%',
        height: 4,
        backgroundColor: '#FFF',
        borderRadius: 2,
        marginTop: 12,
    },
    heroText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    stepsSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: 2,
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#FFF',
        lineHeight: 20,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default WidgetTutorialModal;
