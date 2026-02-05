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
    ScrollView,
    Image,
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
// import { MEDITATION_SESSIONS, MeditationSession } from '../../data/sessionsData'; // Removed static
import { MeditationSession } from '../../data/sessionsData'; // Keep type
import { sessionsService, adaptSession } from '../../services/contentService'; // Import service
import { useSessions } from '../../hooks/useContent'; // Import hook
import { IMAGES } from '../../constants/images';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import CategoryRow from '../../components/CategoryRow';

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
    { label: 'Todo', icon: 'apps-outline', color: '#646CFF', key: 'all' },
    { label: 'Calma SOS', icon: 'water-outline', color: '#66DEFF', key: 'calmasos' },
    { label: 'Mindfulness', icon: 'leaf-outline', color: '#66BB6A', key: 'mindfulness' },
    { label: 'Sueño', icon: 'moon-outline', color: '#9575CD', key: 'sueno' },
    { label: 'Resiliencia', icon: 'fitness-outline', color: '#FF6B9D', key: 'resiliencia' },
    { label: 'Rendimiento', icon: 'flash-outline', color: '#FBBF24', key: 'rendimiento' },
    { label: 'Despertar', icon: 'sunny-outline', color: '#FFA726', key: 'despertar' },
    { label: 'Salud', icon: 'medkit-outline', color: '#2DD4BF', key: 'salud' },
    { label: 'Hábitos', icon: 'calendar-outline', color: '#A78BFA', key: 'habitos' },
    { label: 'Emocional', icon: 'heart-outline', color: '#FF8A80', key: 'emocional' },
    { label: 'Niños', icon: 'happy-outline', color: '#FFD54F', key: 'kids' },
];

const GUIDES = [
    {
        id: 'aria',
        name: 'Aria',
        specialty: 'Calma',
        color: '#66DEFF',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/aria_avatar.webp'
    },
    {
        id: 'eter',
        name: 'Éter',
        specialty: 'Sueño',
        color: '#9575CD',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/eter_avatar.webp'
    },
    {
        id: 'ziro',
        name: 'Ziro',
        specialty: 'Resiliencia',
        color: '#646CFF',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/ziro_avatar.webp'
    },
    {
        id: 'gaia',
        name: 'Gaia',
        specialty: 'Energía',
        color: '#FFA726',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/gaia_avatar.webp'
    },
];

const SESSION_ASSETS: Record<string, string> = {
    'calmasos': IMAGES.SESSION_PEACE,
    'sueno': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'rendimiento': IMAGES.SESSION_FOCUS,
    'salud': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    'habitos': IMAGES.SESSION_ROUTINE,
    'emocional': 'https://images.unsplash.com/photo-1516589174184-c685eb32140a?w=800&q=80',
    'kids': 'https://images.unsplash.com/photo-1536640712247-c7553ee84681?w=800&q=80',
    'default': IMAGES.SESSION_PEACE,
};

const MeditationCatalogScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode, toggleFavorite } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // ** React Query Hook **
    const { data: rawSessions, isLoading: loading } = useSessions();

    // Adapt raw DB sessions to UI format
    const sessions = useMemo(() => {
        if (!rawSessions) return [];
        return rawSessions.map(adaptSession);
    }, [rawSessions]);

    // Randomize sessions (memoized to prevent re-shuffling on every render)
    const shuffledSessions = useMemo(() => {
        return [...sessions].sort(() => 0.5 - Math.random());
    }, [sessions]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    const toggleSearch = () => {
        const toValue = isSearchExpanded ? 0 : 1;
        Animated.spring(searchAnim, {
            toValue,
            useNativeDriver: false,
            friction: 8,
            tension: 40
        }).start();
        setIsSearchExpanded(!isSearchExpanded);
        if (isSearchExpanded) setSearchQuery('');
    };

    const convertToSession = (medSession: MeditationSession): Session => {
        const categoryKey = medSession.category.toLowerCase();
        const catInfo = CATEGORIES.find(c => c.key === categoryKey);
        return {
            id: medSession.id,
            title: medSession.title,
            duration: medSession.durationMinutes,
            category: catInfo ? catInfo.label : medSession.category,
            isPlus: medSession.isPremium,
            image: SESSION_ASSETS[categoryKey] || SESSION_ASSETS['default'],
            thumbnailUrl: medSession.thumbnailUrl,
            creatorName: medSession.creatorName,
        };
    };

    const filteredSessions = useMemo(() => {
        if (loading) return []; // Don't filter while loading

        const query = searchQuery.toLowerCase().trim();

        return sessions.filter(session => {
            // Special internal filters for "See All"
            if (query === 'favoritos') {
                return (userState.favoriteSessionIds || []).includes(session.id);
            }
            if (query === 'flash') {
                return session.durationMinutes < 6;
            }
            if (query === 'novedades') {
                const newIds = [...sessions].reverse().slice(0, 5).map(s => s.id);
                return newIds.includes(session.id);
            }
            if (query === 'core') {
                return session.isTechnical;
            }

            const matchesSearch = query === '' ||
                session.title.toLowerCase().includes(query) ||
                session.description.toLowerCase().includes(query) ||
                session.scientificBenefits.toLowerCase().includes(query) ||
                session.creatorName.toLowerCase().includes(query) ||
                (session.moodTags && session.moodTags.some(tag => tag.toLowerCase().includes(query)));

            const sCat = session.category.toLowerCase();
            const activeCat = CATEGORIES[selectedCategory];
            const matchesCategory = selectedCategory === 0 || sCat === activeCat.key;

            const matchesGuide = !selectedGuide || session.creatorName.toLowerCase() === selectedGuide.toLowerCase();

            return matchesSearch && matchesCategory && matchesGuide;
        }).map(convertToSession);
    }, [searchQuery, selectedCategory, selectedGuide, userState.favoriteSessionIds, sessions, loading]);


    const sessionsByRow = useMemo(() => {
        const hasActiveFilter = selectedCategory !== 0 || searchQuery !== '' || selectedGuide !== null;

        if (hasActiveFilter) {
            return [{ title: 'Resultados', data: filteredSessions }];
        }

        const rows: { title: string; data: Session[]; icon?: string; accentColor?: string; variant?: 'overlay' | 'standard' | 'poster' | 'wide' | 'hero' | 'section-header' }[] = [];

        // 1. tus Favoritos (Solo si hay)
        const favoriteIds = userState.favoriteSessionIds || [];
        if (favoriteIds.length > 0) {
            // Keep favorites stable/predictable
            const favorites = sessions
                .filter(s => favoriteIds.includes(s.id))
                .map(convertToSession);
            rows.push({ title: 'Tus Favoritos', data: favorites, icon: 'heart', accentColor: '#FF6B6B' });
        }
        // 1.5. Protocolos Técnicos (Core Paziify) - Randomized
        const technicalSessions = shuffledSessions
            .filter(s => s.isTechnical)
            .slice(0, 6)
            .map(convertToSession);
        if (technicalSessions.length > 0) {
            // New Separator for Featured Section
            rows.push({
                title: 'DESTACADOS',
                data: [],
                variant: 'section-header'
            });

            rows.push({
                title: 'Meditaciones técnicas',
                data: technicalSessions,
                icon: 'shield-checkmark',
                accentColor: '#2DD4BF',
                variant: 'hero' // Single card, full width carousel
            });
        }

        // 2. Sesiones Flash (< 6 min) - Randomized
        const flashSessions = shuffledSessions
            .filter(s => s.durationMinutes < 6)
            .slice(0, 6)
            .map(convertToSession);
        if (flashSessions.length > 0) {
            rows.push({
                title: 'Sesiones rápidas',
                data: flashSessions,
                icon: 'flash',
                accentColor: '#FBBF24',
                variant: 'poster' // Cinematic Poster Styles
            });
        }

        // 3. Novedades (Últimas 5) - Keep strict order for "Newest"
        const newArrivals = [...sessions]
            .reverse()
            .slice(0, 5)
            .map(convertToSession);
        rows.push({ title: 'Mejor valoradas', data: newArrivals, icon: 'sparkles', accentColor: '#A78BFA', variant: 'wide' });

        // SEPARATOR
        rows.push({
            title: 'EXPLORA POR CATEGORÍAS',
            data: [], // Empty data is fine for section-header
            variant: 'section-header'
        });

        // 4. Categorías Estándar (Las 10 reales) - Randomized
        CATEGORIES.slice(1).forEach(cat => {
            const catSessions = shuffledSessions
                .filter(s => s.category.toLowerCase() === cat.key)
                .map(convertToSession);

            if (catSessions.length > 0) {
                // Apply 'standard' variant (Netflix-style) to all standard categories
                rows.push({
                    title: cat.label,
                    data: catSessions,
                    icon: cat.icon.replace('-outline', ''),
                    accentColor: cat.color,
                    variant: 'standard'
                });
            }
        });

        return rows;
    }, [filteredSessions, selectedCategory, searchQuery, userState.favoriteSessionIds]);

    const handleSeeAll = (sectionTitle: string) => {
        // Find if it matches a category
        const catIndex = CATEGORIES.findIndex(c => c.label.toLowerCase() === sectionTitle.toLowerCase());
        if (catIndex !== -1) {
            setSelectedCategory(catIndex);
            setSearchQuery('');
            return;
        }

        // Special sections
        if (sectionTitle.includes('Flash') || sectionTitle.includes('rápidas')) {
            setSearchQuery('flash');
            setSelectedCategory(0);
        } else if (sectionTitle.includes('Favoritos')) {
            setSearchQuery('favoritos');
            setSelectedCategory(0);
        } else if (sectionTitle.includes('Novedades') || sectionTitle.includes('valoradas')) {
            setSearchQuery('novedades');
            setSelectedCategory(0);
        } else if (sectionTitle.includes('Técnicos') || sectionTitle.includes('Core') || sectionTitle.includes('técnica')) {
            setSearchQuery('core');
            setSelectedCategory(0);
        } else if (sectionTitle === 'Resultados') {
            setSearchQuery('');
            setSelectedCategory(0);
            setSelectedGuide(null);
        }
    };

    const handleSessionClick = (session: Session) => {
        const fullSession = sessions.find(s => s.id === session.id);
        if (fullSession) {
            setSelectedSession(fullSession);
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {/* Header */}
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backBtnAbsolute}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.searchToggleBtn}
                        onPress={toggleSearch}
                    >
                        <Ionicons
                            name={isSearchExpanded ? "close-outline" : "search-outline"}
                            size={24}
                            color={isSearchExpanded ? "#2DD4BF" : "#FFF"}
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle} numberOfLines={1}>Oasis de Calma</Text>
                    </View>
                    <View style={styles.silhouetteAbsolute}>
                        <BacklitSilhouette />
                    </View>
                </View>
            </View>

            {/* Active Filter Header (Back Button) */}
            {(searchQuery !== '' || selectedCategory !== 0 || selectedGuide !== null) && (
                <View style={styles.activeFilterHeader}>
                    <TouchableOpacity
                        style={styles.backFilterRow}
                        onPress={() => {
                            setSearchQuery('');
                            setSelectedCategory(0);
                            setSelectedGuide(null);
                        }}
                    >
                        <Ionicons name="arrow-back-outline" size={20} color="#2DD4BF" />
                        <Text style={styles.backFilterText}>Volver al catálogo</Text>
                    </TouchableOpacity>
                    <Text style={styles.resultsTitle}>
                        {selectedGuide ? `Sesiones de ${selectedGuide}` :
                            searchQuery !== '' ? `Búsqueda: ${searchQuery}` :
                                CATEGORIES[selectedCategory].label}
                    </Text>
                </View>
            )}

            {/* Search */}
            <Animated.View style={[
                styles.searchContainer,
                {
                    height: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 72]
                    }),
                    opacity: searchAnim,
                    marginBottom: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 24]
                    }),
                    overflow: 'hidden'
                }
            ]}>
                <View style={[styles.searchWrapper, { marginTop: 12 }]}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar paz..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={isSearchExpanded}
                    />
                </View>
            </Animated.View>

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

            {/* 3. Our Guides */}
            <View style={styles.guidesSection}>
                <View style={styles.moodHeaderCentered}>
                    <Ionicons name="people" size={14} color="#2DD4BF" style={{ marginRight: 8 }} />
                    <Text style={styles.moodSectionTitleLarge}>NUESTROS GUÍAS</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.guidesList}
                >
                    {GUIDES.map(guide => {
                        const isActive = selectedGuide === guide.name;
                        return (
                            <TouchableOpacity
                                key={guide.id}
                                style={styles.guideItem}
                                onPress={() => setSelectedGuide(isActive ? null : guide.name)}
                            >
                                <View style={styles.avatarWrapper}>
                                    {isActive && (
                                        <Canvas style={styles.avatarGlow}>
                                            <Circle cx={32} cy={32} r={32}>
                                                <RadialGradient
                                                    c={vec(32, 32)}
                                                    r={32}
                                                    colors={[guide.color, 'transparent']}
                                                />
                                                <Blur blur={10} />
                                            </Circle>
                                        </Canvas>
                                    )}
                                    <View style={[
                                        styles.avatarContainer,
                                        isActive && { borderColor: guide.color, borderWidth: 2 }
                                    ]}>
                                        <Image
                                            source={{ uri: guide.avatar }}
                                            style={styles.avatarImage}
                                        />
                                    </View>
                                </View>
                                <Text style={[
                                    styles.guideName,
                                    isActive && { color: guide.color, fontWeight: 'bold' }
                                ]}>
                                    {guide.name}
                                </Text>
                                <Text style={styles.guideSpecialty}>{guide.specialty}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.listSeparator} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Premium Background */}
            {/* Premium Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
                {/* Visual Fix: High-Intensity Day Sky (0-50%) -> Deep Focus for Cards (70-100%) */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent', 'rgba(2, 6, 23, 0.5)', 'rgba(2, 6, 23, 1.0)']}
                    locations={[0, 0.15, 0.45, 0.75, 0.98]}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={sessionsByRow}
                    keyExtractor={(item) => item.title}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <CategoryRow
                            title={item.title}
                            sessions={item.data}
                            icon={item.icon}
                            accentColor={item.accentColor}
                            onSessionPress={handleSessionClick}
                            onFavoritePress={(session) => toggleFavorite(session.id)}
                            onSeeAll={handleSeeAll}
                            isPlusMember={userState.isPlusMember}
                            favoriteSessionIds={userState.favoriteSessionIds}
                            completedSessionIds={userState.completedSessionIds}
                            scrollY={scrollY}
                            isResults={item.title === 'Resultados'}
                            variant={item.variant}
                            index={index}
                        />
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
                    guideAvatar={GUIDES.find(g => g.name === selectedSession.creatorName)?.avatar}
                    onClose={() => setSelectedSession(null)}
                    onStart={() => {
                        const medData = sessions.find(s => s.id === selectedSession.id);
                        setSelectedSession(null);
                        if (medData) {
                            navigation.navigate(Screen.BREATHING_TIMER, { sessionId: medData.id });
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
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    backBtnAbsolute: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    searchToggleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    silhouetteAbsolute: {
        position: 'absolute',
        right: -30,
        top: -30,
        transform: [{ scale: 0.5 }],
        opacity: 0.8,
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
        marginBottom: 24,
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
    },
    activeFilterHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    backFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    backFilterText: {
        color: '#2DD4BF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    resultsTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    categoryWrap: {
        marginBottom: 32,
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
    },
    moodSection: {
        marginTop: 10,
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    moodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    moodHeaderCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    moodSectionTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
    },
    moodSectionTitleLarge: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 2,
    },
    moodGlassContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    moodList: {
        paddingHorizontal: 16,
    },
    guidesSection: {
        marginTop: 10,
        marginBottom: 12, // Reduced from 32
    },
    guidesList: {
        paddingHorizontal: 20,
        gap: 15,
    },
    guideItem: {
        alignItems: 'center',
        width: 72,
    },
    avatarWrapper: {
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        top: -8,
        left: -8,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    guideName: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    guideSpecialty: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    sessionCardWrapper: {
        marginBottom: 12,
    },
    listSeparator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 20,
        marginVertical: 4, // Reduced from 10
    },
});

export default MeditationCatalogScreen;
