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
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';

type LibraryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LIBRARY
>;

interface Props {
    navigation: LibraryScreenNavigationProp;
}

const { width } = Dimensions.get('window');

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
            duration: 600,
            delay: index * 150,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.sectionWrapper, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.sectionCard} onPress={onPress} activeOpacity={0.9}>
                <ImageBackground source={image} style={styles.sectionImage}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.sectionContent}>
                        <BlurView intensity={30} tint="light" style={styles.iconCircle}>
                            <Ionicons name={icon} size={24} color="#FFFFFF" />
                        </BlurView>

                        <View style={styles.sectionInfo}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                            <Text style={styles.sectionDescription}>{description}</Text>

                            <View style={styles.sectionFooter}>
                                <View style={[styles.countBadge, { backgroundColor: `${color}40` }]}>
                                    <Text style={[styles.sectionCount, { color }]}>{count}</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.5)" />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </Animated.View>
    );
};

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Ambient Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#050810', '#0D1117', '#050810']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>Inspiración Hub</Text>
                        <TouchableOpacity style={styles.searchBtn}>
                            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerSubtitle}>
                        Tu santuario personal de conocimiento y paz.
                    </Text>
                </View>

                {/* Grid-like sections */}
                <LibrarySection
                    index={0}
                    icon="flower-outline"
                    title="Meditación"
                    description="Guías de presencia y mindfulness"
                    count="SESIONES"
                    image={require('../../assets/covers/med_anxiety.png')}
                    color="#66DEFF"
                    onPress={() => navigation.navigate(Screen.MEDITATION_CATALOG)}
                />

                <LibrarySection
                    index={1}
                    icon="book-outline"
                    title="Audiolibros"
                    description="Sabiduría de los clásicos en tu voz"
                    count="LIBROS"
                    image={require('../../assets/covers/professional.png')}
                    color="#FF6B9D"
                    onPress={() => navigation.navigate(Screen.AUDIOBOOKS)}
                />

                <LibrarySection
                    index={2}
                    icon="sparkles-outline"
                    title="Historias Reales"
                    description="Testimonios de superación diaria"
                    count="LECTURAS"
                    image={require('../../assets/covers/growth.png')}
                    color="#FFA726"
                    onPress={() => navigation.navigate(Screen.STORIES)}
                />

                {/* Academy Link - Redesigned */}
                <TouchableOpacity
                    style={styles.academyCard}
                    onPress={() => navigation.navigate(Screen.CBT_ACADEMY)}
                    activeOpacity={0.8}
                >
                    <BlurView intensity={20} tint="dark" style={styles.academyBlur}>
                        <View style={styles.academyIcon}>
                            <Ionicons name="school" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.academyText}>
                            <Text style={styles.academyTitle}>Academia TCC</Text>
                            <Text style={styles.academyDescription}>
                                Domina tu mente con técnicas científicas.
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </BlurView>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050810',
    },
    header: {
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    searchBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
        lineHeight: 22,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    sectionWrapper: {
        marginBottom: 20,
    },
    sectionCard: {
        borderRadius: 24,
        overflow: 'hidden',
        height: 180,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    sectionImage: {
        flex: 1,
    },
    sectionContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sectionInfo: {
        gap: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    sectionDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
        marginBottom: 10,
    },
    sectionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sectionCount: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    academyCard: {
        marginTop: 10,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    academyBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    academyIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    academyText: {
        flex: 1,
        marginLeft: 16,
    },
    academyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    academyDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
});

export default LibraryScreen;
