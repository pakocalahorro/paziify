import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ImageBackground,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Canvas,
    Circle,
    Blur,
    Group,
    RadialGradient,
    vec
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
    useDerivedValue
} from 'react-native-reanimated';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { IMAGES } from '../../constants/images';
import NoiseBackground from '../../components/Sanctuary/NoiseBackground';

type LibraryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LIBRARY
>;

interface Props {
    navigation: LibraryScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const BacklitSilhouette: React.FC = () => {
    const pulse = useSharedValue(0.4);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const glowOpacity = useDerivedValue(() => pulse.value * 0.6);
    const glowRadiusVal = useDerivedValue(() => 60 + pulse.value * 40);

    return (
        <View style={styles.silhouetteContainer}>
            <Canvas style={styles.silhouetteCanvas}>
                <Group>
                    <Circle cx={80} cy={80} r={glowRadiusVal}>
                        <RadialGradient
                            c={vec(80, 80)}
                            r={glowRadiusVal}
                            colors={['rgba(45, 212, 191, 0.5)', 'transparent']}
                        />
                        <Blur blur={25} />
                    </Circle>
                </Group>
            </Canvas>
            <View style={styles.silhouetteIconWrapper}>
                <Ionicons name="body-outline" size={60} color="rgba(45, 212, 191, 0.4)" style={styles.silhouetteIcon} />
            </View>
        </View>
    );
};

interface LibrarySectionProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    count: string;
    image: any;
    color: string;
    onPress: () => void;
    index: number;
}

const LibrarySection: React.FC<LibrarySectionProps> = ({
    icon,
    title,
    description,
    count,
    image,
    color,
    onPress,
    index,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            delay: index * 100,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.sectionWrapper, {
            opacity: fadeAnim,
            transform: [{
                translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                })
            }]
        }]}>
            <TouchableOpacity style={styles.sectionCard} onPress={onPress} activeOpacity={0.9}>
                <ImageBackground
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.sectionImage}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.sectionContent}>
                        <View style={styles.topInfo}>
                            <BlurView intensity={20} tint="dark" style={styles.categoryBadge}>
                                <Ionicons name={icon} size={14} color={color} />
                                <Text style={[styles.categoryText, { color }]}>{count}</Text>
                            </BlurView>
                        </View>

                        <View style={styles.sectionInfo}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            <Text style={styles.sectionDescription}>{description}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    );
};

import { useApp } from '../../context/AppContext';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { isNightMode } = useApp();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Background */}
            {/* Premium Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerLabel}>CENTRO DE</Text>
                            <View style={styles.headerTop}>
                                <Text style={styles.headerTitle}>Inspiración</Text>
                            </View>
                        </View>
                        <BacklitSilhouette />
                    </View>
                    <Text style={styles.headerSubtitle}>
                        Tu santuario personal para la calma y el crecimiento consciente.
                    </Text>
                </View>

                {/* Grid-like sections */}
                <LibrarySection
                    index={0}
                    icon="flower-outline"
                    title="Meditación"
                    description="Guías de presencia y mindfulness para el día a día."
                    count="SESIONES"
                    image={IMAGES.LIB_MEDITATION}
                    color="#2DD4BF"
                    onPress={() => navigation.navigate(Screen.MEDITATION_CATALOG)}
                />

                <LibrarySection
                    index={1}
                    icon="book-outline"
                    title="Audiolibros"
                    description="Clásicos de la sabiduría para expandir tu conciencia."
                    count="BIBLIOTECA"
                    image={IMAGES.LIB_BOOKS}
                    color="#FB7185"
                    onPress={() => navigation.navigate(Screen.AUDIOBOOKS)}
                />

                <LibrarySection
                    index={2}
                    icon="sparkles-outline"
                    title="Historias Reales"
                    description="Relatos de superación y resiliencia humana."
                    count="LECTURAS"
                    image={IMAGES.LIB_STORIES}
                    color="#FBBF24"
                    onPress={() => navigation.navigate(Screen.STORIES)}
                />

                {/* Academy Link - Redesigned */}
                <TouchableOpacity
                    style={styles.academyCard}
                    onPress={() => navigation.navigate(Screen.CBT_ACADEMY)}
                    activeOpacity={0.8}
                >
                    <ImageBackground source={{ uri: IMAGES.LIB_ACADEMY }} style={styles.academyImg}>
                        <BlurView intensity={40} tint="dark" style={styles.academyBlur}>
                            <View style={styles.academyIcon}>
                                <Ionicons name="school" size={20} color="#FFF" />
                            </View>
                            <View style={styles.academyText}>
                                <Text style={styles.academyTitle}>Academia TCC</Text>
                                <Text style={styles.academyDescription}>
                                    Domina tu mente con técnicas científicas avanzadas.
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                        </BlurView>
                    </ImageBackground>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    header: {
        marginBottom: 35,
        paddingHorizontal: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
    },
    silhouetteContainer: {
        width: 140,
        height: 140,
        marginTop: -20,
        marginRight: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    silhouetteCanvas: {
        width: 160,
        height: 160,
        position: 'absolute',
    },
    silhouetteIconWrapper: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    silhouetteIcon: {
        zIndex: 2,
    },
    silhouetteInner: {
        display: 'none',
    },
    headerLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#2DD4BF',
        letterSpacing: 3,
        marginBottom: 4,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    searchBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.04)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.45)',
        fontWeight: '500',
        lineHeight: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    sectionWrapper: {
        marginBottom: 24,
    },
    sectionCard: {
        borderRadius: 32,
        overflow: 'hidden',
        height: 220,
        backgroundColor: '#111',
    },
    sectionImage: {
        flex: 1,
    },
    sectionContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    topInfo: {
        flexDirection: 'row',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    sectionInfo: {
        gap: 6,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    sectionDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
        lineHeight: 20,
    },
    academyCard: {
        marginTop: 10,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        height: 120,
    },
    academyImg: {
        flex: 1,
    },
    academyBlur: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    academyIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.3)',
    },
    academyText: {
        flex: 1,
        marginLeft: 16,
    },
    academyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    academyDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
});

export default LibraryScreen;
