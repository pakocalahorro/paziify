import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Animated,
    Dimensions,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Canvas,
    Circle,
    Group,
    Blur,
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
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Session } from '../../types';
import { theme } from '../../constants/theme';
import SessionCard from '../../components/SessionCard';
import SessionPreviewModal from '../../components/SessionPreviewModal';
import { MEDITATION_SESSIONS, MeditationSession } from '../../data/sessionsData';
import { IMAGES } from '../../constants/images';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';

type MeditationCatalogScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.MEDITATION_CATALOG
>;

interface Props {
    navigation: MeditationCatalogScreenNavigationProp;
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
                <Ionicons name="leaf-outline" size={60} color="rgba(45, 212, 191, 0.4)" style={styles.silhouetteIcon} />
            </View>
        </View>
    );
};

const CATEGORIES = [
    { label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { label: 'Ansiedad', icon: 'water-outline', color: '#66DEFF' },
    { label: 'Despertar', icon: 'sunny-outline', color: '#FFA726' },
    { label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
    { label: 'Mindfulness', icon: 'leaf-outline', color: '#66BB6A' },
    { label: 'Resiliencia', icon: 'heart-outline', color: '#FF6B9D' },
];

const SESSION_ASSETS: Record<string, string> = {
    'ansiedad': IMAGES.SESSION_PEACE,
    'sueño': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'default': IMAGES.SESSION_PEACE,
};

const MeditationCatalogScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const convertToSession = (medSession: MeditationSession): Session => {
        const categoryKey = medSession.category.toLowerCase();
        return {
            id: medSession.id,
            title: medSession.title,
            duration: medSession.durationMinutes,
            category: medSession.category,
            isPlus: medSession.isPremium,
            image: SESSION_ASSETS[categoryKey] || SESSION_ASSETS['default'],
        };
    };

    const filteredSessions = useMemo(() => {
        return MEDITATION_SESSIONS.filter(session => {
            const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 0 ||
                session.category.toLowerCase() === CATEGORIES[selectedCategory].label.toLowerCase();
            return matchesSearch && matchesCategory;
        }).map(convertToSession);
    }, [searchQuery, selectedCategory]);

    const handleSessionClick = (session: Session) => {
        const fullSession = MEDITATION_SESSIONS.find(s => s.id === session.id);
        if (fullSession) {
            setSelectedSession(fullSession);
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtnAbsolute}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerRow}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerLabel}>OASIS DE</Text>
                        <View style={styles.headerTop}>
                            <Text style={styles.headerTitle}>Calma</Text>
                        </View>
                    </View>
                    <BacklitSilhouette />
                </View>
                <Text style={styles.headerSubtitle}>
                    Tu espacio para reconectar y encontrar la calma interior.
                </Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar paz..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* 2. Categories */}
            <View style={styles.categoryWrap}>
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(index)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedCategory === index ? 100 : 20}
                                tint="dark"
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === index && { backgroundColor: item.color }
                                ]}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={16}
                                    color={selectedCategory === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.categoryLabel,
                                    selectedCategory === index && styles.categoryLabelActive
                                ]}>
                                    {item.label}
                                </Text>
                            </BlurView>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.listSeparator} />
        </View >
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Background */}
            {/* Premium Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredSessions}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <View style={styles.sessionCardWrapper}>
                            <SessionCard
                                session={item}
                                onPress={handleSessionClick}
                                isPlusMember={userState.isPlusMember}
                                scrollY={scrollY}
                                index={index}
                            />
                        </View>
                    )}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                />
            </Animated.View>

            {selectedSession && (
                <SessionPreviewModal
                    isVisible={!!selectedSession}
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                    onStart={() => {
                        const medData = MEDITATION_SESSIONS.find(s => s.id === selectedSession.id);
                        setSelectedSession(null);
                        if (medData) {
                            navigation.navigate(Screen.TRANSITION_TUNNEL, { sessionId: medData.id });
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    headerContent: {
        // No specific wrapper style needed
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    backBtnAbsolute: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextContainer: {
        flex: 1,
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
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.45)',
        fontWeight: '500',
        lineHeight: 24,
    },
    silhouetteContainer: {
        width: 140,
        height: 140,
        marginTop: -40,
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
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: '#FFF',
        fontSize: 15,
        fontWeight: '500',
    },
    categoryWrap: {
        marginBottom: 20,
    },
    categoryList: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    sessionCardWrapper: {
        marginBottom: 12,
    },
    listSeparator: {
        height: 10,
    },
});

export default MeditationCatalogScreen;
