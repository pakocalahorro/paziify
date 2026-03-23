import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface ModePickerModalProps {
    isVisible: boolean;
    currentMode: 'healing' | 'growth';
    onSelect: (mode: 'healing' | 'growth') => void;
    onClose: () => void;
}

const ModePickerModal: React.FC<ModePickerModalProps> = ({ isVisible, currentMode, onSelect, onClose }) => {
    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                
                <Animated.View 
                    entering={FadeInDown.springify().damping(15)}
                    style={styles.card}
                >
                    <BlurView intensity={80} tint="dark" style={styles.innerBlur}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>

                        <Text style={styles.title}>Estado de Vida</Text>
                        <Text style={styles.subtitle}>Elige cómo deseas que Paziify te acompañe hoy.</Text>

                        <View style={styles.optionsContainer}>
                            {/* HEALING OPTION */}
                            <TouchableOpacity 
                                style={[
                                    styles.option, 
                                    currentMode === 'healing' && styles.optionActive,
                                    { borderColor: 'rgba(45, 212, 191, 0.3)' }
                                ]}
                                onPress={() => {
                                    onSelect('healing');
                                    onClose();
                                }}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}>
                                    <Ionicons name="leaf" size={24} color="#2DD4BF" />
                                </View>
                                <View style={styles.optionTexts}>
                                    <Text style={[styles.optionTitle, { color: '#2DD4BF' }]}>MODO SANAR</Text>
                                    <Text style={styles.optionDescription}>Enfoque en calma, recuperación y paz interior.</Text>
                                </View>
                                {currentMode === 'healing' && <Ionicons name="checkmark-circle" size={20} color="#2DD4BF" />}
                            </TouchableOpacity>

                            {/* GROWTH OPTION */}
                            <TouchableOpacity 
                                style={[
                                    styles.option, 
                                    currentMode === 'growth' && styles.optionActive,
                                    { borderColor: 'rgba(251, 191, 36, 0.3)' }
                                ]}
                                onPress={() => {
                                    onSelect('growth');
                                    onClose();
                                }}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
                                    <Ionicons name="flash" size={24} color="#FBBF24" />
                                </View>
                                <View style={styles.optionTexts}>
                                    <Text style={[styles.optionTitle, { color: '#FBBF24' }]}>MODO CRECER</Text>
                                    <Text style={styles.optionDescription}>Enfoque en energía, expansión y superación.</Text>
                                </View>
                                {currentMode === 'growth' && <Ionicons name="checkmark-circle" size={20} color="#FBBF24" />}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.footerNote}>
                            Puedes cambiar tu modo en cualquier momento desde el dashboard.
                        </Text>
                    </BlurView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    innerBlur: {
        padding: 24,
    },
    closeButton: {
        alignSelf: 'flex-end',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit_900Black',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    optionsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    optionActive: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1.5,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTexts: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 14,
        fontFamily: 'Outfit_800ExtraBold',
        letterSpacing: 1,
    },
    optionDescription: {
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    footerNote: {
        fontSize: 11,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        fontStyle: 'italic',
    }
});

export default ModePickerModal;
