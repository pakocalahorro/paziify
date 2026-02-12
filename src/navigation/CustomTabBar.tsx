import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Modal,
    Text,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withRepeat,
    withSequence,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { Screen } from '../types';
import { useApp } from '../context/AppContext';
import { contentService } from '../services/contentService';
import * as Haptics from 'expo-haptics';
import StarCore from '../components/Sanctuary/StarCore';

const { width } = Dimensions.get('window');

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, updateUserState, setLastSelectedBackgroundUri } = useApp();
    const [isSantuarioOpen, setIsSantuarioOpen] = useState(false);

    // Shared value for StarCore with smooth transition
    const starProgress = useSharedValue(userState.lifeMode === 'growth' ? 1 : -1);

    React.useEffect(() => {
        starProgress.value = withTiming(
            userState.lifeMode === 'growth' ? 1 : -1,
            { duration: 600 }
        );
    }, [userState.lifeMode]);

    // Animación de respiración para el botón central
    const breathScale = useSharedValue(1);
    React.useEffect(() => {
        breathScale.value = withRepeat(
            withSequence(
                withSpring(1.08, { damping: 10, stiffness: 40 }),
                withSpring(1, { damping: 10, stiffness: 40 })
            ),
            -1,
            true
        );
    }, []);

    const santuarioStyle = useAnimatedStyle(() => ({
        transform: [{ scale: breathScale.value }],
    }));

    const handlePressSantuario = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsSantuarioOpen(true);
    };

    const handleSintonizar = async (mode: 'healing' | 'growth') => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // 1. Obtener imagen aleatoria igual que en la Brújula
        const bgUri = await contentService.getRandomCategoryImage(mode);

        // 2. Actualizar estado global
        updateUserState({
            lifeMode: mode,
            lastSelectedBackgroundUri: bgUri as string || undefined,
            lastEntryDate: new Date().toISOString().split('T')[0],
        });

        if (bgUri) {
            setLastSelectedBackgroundUri(bgUri as string);
        }

        setIsSantuarioOpen(false);
    };

    // Filtramos las rutas para manejar la distribución (Comunidad se oculta)
    // Orden deseado: Inicio, Biblioteca, SANTUARIO, Academia, Perfil
    const routes = state.routes.filter(r => r.name !== Screen.COMMUNITY);

    // Mapeo manual de iconos
    const getIconName = (routeName: string, focused: boolean) => {
        switch (routeName) {
            case Screen.HOME: return focused ? 'home' : 'home-outline';
            case 'LibraryTab': return focused ? 'library' : 'library-outline';
            case Screen.CBT_ACADEMY: return focused ? 'school' : 'school-outline';
            case Screen.PROFILE: return focused ? 'person' : 'person-outline';
            default: return 'help-outline';
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 30 }]}>
            <View style={styles.buttonsContainer}>
                {/* Primeros dos botones: Inicio y Biblioteca */}
                {routes.slice(0, 2).map((route, index) => {
                    const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButtonWrapper} activeOpacity={0.7}>
                            <BlurView
                                intensity={65}
                                tint="dark"
                                style={[
                                    styles.buttonGlass,
                                    isFocused && styles.activeButtonGlass
                                ]}
                            >
                                <Ionicons
                                    name={getIconName(route.name, isFocused) as any}
                                    size={22}
                                    color={isFocused ? '#FFF' : 'rgba(255,255,255,0.4)'}
                                />
                                {isFocused && <View style={styles.activeDot} />}
                            </BlurView>
                        </TouchableOpacity>
                    );
                })}

                {/* Botón Central: SANTUARIO (Más independiente) */}
                <TouchableOpacity activeOpacity={0.8} onPress={handlePressSantuario} style={styles.santuarioButtonContainer}>
                    <BlurView intensity={80} tint="dark" style={styles.santuarioGlass}>
                        <Animated.View style={[styles.santuarioOrbe, santuarioStyle]}>
                            <StarCore size={36} progress={starProgress} />
                        </Animated.View>
                    </BlurView>
                </TouchableOpacity>

                {/* Últimos dos botones: Academia y Perfil */}
                {routes.slice(2).map((route) => {
                    const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButtonWrapper} activeOpacity={0.7}>
                            <BlurView
                                intensity={65}
                                tint="dark"
                                style={[
                                    styles.buttonGlass,
                                    isFocused && styles.activeButtonGlass
                                ]}
                            >
                                <Ionicons
                                    name={getIconName(route.name, isFocused) as any}
                                    size={22}
                                    color={isFocused ? '#FFF' : 'rgba(255,255,255,0.4)'}
                                />
                                {isFocused && <View style={styles.activeDot} />}
                            </BlurView>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Modal del Santuario (Overlay) */}
            <Modal visible={isSantuarioOpen} transparent animationType="fade" onRequestClose={() => setIsSantuarioOpen(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsSantuarioOpen(false)}>
                    <BlurView intensity={90} tint="dark" style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalLabel}>SANTUARIO</Text>
                            <Text style={styles.modalTitle}>Sintoniza tu estado</Text>
                        </View>

                        <View style={styles.optionsGrid}>
                            <TouchableOpacity
                                style={[styles.optionCard, { borderColor: userState.lifeMode === 'healing' ? '#2DD4BF' : 'rgba(255,255,255,0.05)' }]}
                                onPress={() => handleSintonizar('healing')}
                            >
                                <Ionicons name="leaf-outline" size={32} color="#2DD4BF" />
                                <Text style={[styles.optionTitle, { color: '#2DD4BF' }]}>SANAR</Text>
                                <Text style={styles.optionDesc}>Paz y Regeneración</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.optionCard, { borderColor: userState.lifeMode === 'growth' ? '#FBBF24' : 'rgba(255,255,255,0.05)' }]}
                                onPress={() => handleSintonizar('growth')}
                            >
                                <Ionicons name="flash-outline" size={32} color="#FBBF24" />
                                <Text style={[styles.optionTitle, { color: '#FBBF24' }]}>CRECER</Text>
                                <Text style={styles.optionDesc}>Potencial y Energía</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.futureScanner}>
                            <View style={styles.scannerInner}>
                                <Ionicons name="finger-print-outline" size={24} color="rgba(255,255,255,0.2)" />
                                <Text style={styles.scannerText}>Check-in de Coherencia</Text>
                                <View style={styles.tag}><Text style={styles.tagText}>PRÓXIMAMENTE</Text></View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsSantuarioOpen(false)}>
                            <Ionicons name="close" size={28} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: width,
        alignItems: 'center',
    },
    buttonsContainer: {
        width: width * 0.95,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    tabButtonWrapper: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },
    buttonGlass: {
        width: '100%',
        height: '100%',
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(10, 14, 26, 0.75)',
    },
    activeButtonGlass: {
        backgroundColor: 'rgba(251, 191, 36, 0.45)', // Ámbar/Naranja
        borderColor: 'rgba(251, 191, 36, 0.6)',
        borderWidth: 1.5,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 8,
    },
    santuarioButtonContainer: {
        width: 76,
        height: 76,
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
    },
    santuarioGlass: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(10, 14, 26, 0.9)',
    },
    santuarioOrbe: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0A0E1A',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#646CFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 25,
        paddingBottom: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    modalLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 10,
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    optionsGrid: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    optionCard: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginTop: 15,
        letterSpacing: 2,
    },
    optionDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
    },
    futureScanner: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    scannerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    scannerText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 15,
        flex: 1,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },
    tagText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 8,
        fontWeight: '900',
    },
    closeButton: {
        marginTop: 35,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    }
});

export default CustomTabBar;
