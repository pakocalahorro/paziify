import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ResilienceTree from '../Profile/ResilienceTree';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface PurposeModalProps {
    isVisible: boolean;
    onAccept: () => void;
    onClose: () => void;
}

const SunriseBackground = () => (
    <View style={StyleSheet.absoluteFill}>
        <LinearGradient
            colors={['#1A2A6C', '#1C3366', '#16222A']}
            style={StyleSheet.absoluteFill}
        />
        <View style={styles.glowOverlay} />
    </View>
);

const PurposeModal: React.FC<PurposeModalProps> = ({ isVisible, onAccept, onClose }) => {
    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                
                <Animated.View 
                    entering={FadeInDown.springify().damping(15)}
                    style={styles.card}
                >
                    <SunriseBackground />
                    
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>
                        <View style={styles.header}>
                            <View style={styles.treeWrapper}>
                                <ResilienceTree lightPoints={50} size={100} isGuest={false} />
                            </View>
                            <Text style={styles.title}>Diseña tu Evolución</Text>
                            <Text style={styles.subtitle}>Paziify se adapta a tu ritmo y compromiso.</Text>
                        </View>

                        <View style={styles.itemsContainer}>
                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}>
                                    <Ionicons name="flash" size={18} color="#2DD4BF" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Misiones y Desafíos</Text>
                                    <Text style={styles.itemDescription}>Planes de 3, 7 o 30 días según tu energía.</Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
                                    <Ionicons name="leaf" size={18} color="#FBBF24" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Árbol Adaptativo</Text>
                                    <Text style={styles.itemDescription}>Florece con cada paso que das.</Text>
                                </View>
                            </View>

                            <View style={styles.item}>
                                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                                    <Ionicons name="people" size={18} color="#FFF" />
                                </View>
                                <View style={styles.itemTexts}>
                                    <Text style={styles.itemTitle}>Propósito Colectivo</Text>
                                    <Text style={styles.itemDescription}>Inspira a otros en su búsqueda de paz.</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onAccept}>
                            <Text style={styles.buttonText}>Explorar mi Evolución</Text>
                            <Ionicons name="arrow-forward" size={18} color="#000" />
                        </TouchableOpacity>

                        <Text style={styles.footerNote}>
                            Solo tú puedes dar el primer paso hacia tu nueva realidad.
                        </Text>
                    </ScrollView>
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
    },
    card: {
        width: width * 0.88,
        maxWidth: 400,
        height: 500,
        backgroundColor: '#16222A',
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 2, // Marco un poco más grueso para que se note el blanco
        borderColor: '#FFFFFF', // Blanco sólido
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.5,
        shadowRadius: 25,
        elevation: 10,
    },
    glowOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        opacity: 0.5,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    treeWrapper: {
        height: 110,
        width: 110,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 16,
        fontFamily: 'Outfit_500Medium',
        paddingHorizontal: 10,
    },
    itemsContainer: {
        width: '100%',
        gap: 8,
        marginVertical: 15,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
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
        fontFamily: 'Outfit_700Bold',
    },
    itemDescription: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Outfit_400Regular',
    },
    button: {
        backgroundColor: '#FFF',
        height: 52,
        borderRadius: 26,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        gap: 10,
        marginTop: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
        fontFamily: 'Outfit_700Bold',
    },
    footerNote: {
        marginTop: 15,
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
    }
});

export default PurposeModal;
