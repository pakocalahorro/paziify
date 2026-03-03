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
import { useSessions, useInfiniteSessions, QUERY_KEYS } from '../../hooks/useContent';
import { AcademyService } from '../../services/AcademyService';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../../constants/theme';
import { IMAGES, SESSION_ASSETS } from '../../constants/images';
import { OasisCard } from '../../components/Oasis/OasisCard';
import SessionPreviewModal from '../../components/SessionPreviewModal';
import { MeditationSession } from '../../data/sessionsData'; // Keep type
import { sessionsService, adaptSession } from '../../services/contentService'; // Import service
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import CategoryRow from '../../components/CategoryRow';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';
import { FilterActionSheet } from '../../components/Oasis/FilterActionSheet';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

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
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_aria.webp'
    },
    {
        id: 'eter',
        name: 'Éter',
        specialty: 'Sueño',
        color: '#9575CD',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_eter.webp'
    },
    {
        id: 'ziro',
        name: 'Ziro',
        specialty: 'Resiliencia',
        color: '#646CFF',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_ziro.webp'
    },
    {
        id: 'gaia',
        name: 'Gaia',
        specialty: 'Energía',
        color: '#FFA726',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/avatar_gaia.webp'
    },
];

const convertToSession = (medSession: MeditationSession): Session => {
    const categoryKey = medSession.category.toLowerCase();
    const catInfo = CATEGORIES.find(c => c.key === categoryKey);
    const dynamicThumbnail = medSession.thumbnailUrl;
    const staticAsset = SESSION_ASSETS[categoryKey] || SESSION_ASSETS['default'];

    return {
        id: medSession.id,
        title: medSession.title,
        duration: medSession.durationMinutes,
        category: catInfo ? catInfo.label : medSession.category,
        isPlus: medSession.isPremium,
        image: dynamicThumbnail || staticAsset,
        thumbnailUrl: dynamicThumbnail,
        creatorName: medSession.creatorName,
    };
};

const MeditationCatalogScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode, toggleFavorite } = useApp();
    const { closePlayer } = useAudioPlayer();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilter, setShowFilter] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const { data: rawSessions, isLoading: loading } = useSessions();

    // Infinite Search Query for Results View
    const infiniteFilters = useMemo(() => {
        return {
            category: selectedCategory,
            searchQuery: searchQuery,
            creatorName: selectedGuide
        };
    }, [selectedCategory, searchQuery, selectedGuide]);

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isInfiniteLoading
    } = useInfiniteSessions(infiniteFilters);

    const infiniteSessions = useMemo(() => {
        if (!infiniteData) return [];
        return infiniteData.pages
            .flatMap((page: any) => page.data)
            .map(adaptSession)
            .map(convertToSession);
    }, [infiniteData]);

    const sessions = useMemo(() => {
        if (!rawSessions) return [];
        return rawSessions.map(adaptSession);
    }, [rawSessions]);

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

    const toggleSearch = React.useCallback(() => {
        const toValue = isSearchExpanded ? 0 : 1;
        Animated.spring(searchAnim, {
            toValue,
            useNativeDriver: false,
            friction: 8,
            tension: 40
        }).start();
        setIsSearchExpanded(!isSearchExpanded);
        if (isSearchExpanded) setSearchQuery('');
    }, [isSearchExpanded, searchAnim]);


    const filteredSessions = useMemo(() => {
        if (loading) return [];
        const query = searchQuery.toLowerCase().trim();
        return sessions.filter(session => {
            if (query === 'favoritos') return (userState.favoriteSessionIds || []).includes(session.id);
            if (query === 'flash') return session.durationMinutes < 6;
            if (query === 'novedades') {
                const newIds = [...sessions].reverse().slice(0, 5).map(s => s.id);
                return newIds.includes(session.id);
            }
            if (query === 'core') return session.isTechnical;

            const matchesSearch = query === '' ||
                session.title.toLowerCase().includes(query) ||
                session.description.toLowerCase().includes(query) ||
                session.scientificBenefits.toLowerCase().includes(query) ||
                session.creatorName.toLowerCase().includes(query) ||
                (session.moodTags && session.moodTags.some(tag => tag.toLowerCase().includes(query)));

            const sCat = session.category.toLowerCase();
            const activeCat = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0];
            const matchesCategory = selectedCategory === 'all' || sCat === activeCat.key;
            const matchesGuide = !selectedGuide || session.creatorName.toLowerCase() === selectedGuide.toLowerCase();

            return matchesSearch && matchesCategory && matchesGuide;
        }).map(convertToSession);
    }, [searchQuery, selectedCategory, selectedGuide, userState.favoriteSessionIds, sessions, loading]);

    const hasActiveFilter = selectedCategory !== 'all' || searchQuery !== '' || selectedGuide !== null;

    const sessionsByRow = useMemo(() => {
        if (hasActiveFilter) {
            const titleParts = [];
            if (selectedGuide) titleParts.push(selectedGuide.toUpperCase());
            if (selectedCategory !== 'all') {
                const catLabel = CATEGORIES.find(c => c.key === selectedCategory)?.label;
                if (catLabel) titleParts.push(catLabel.toUpperCase());
            }
            if (searchQuery !== '' && !['favoritos', 'flash', 'novedades', 'core'].includes(searchQuery.toLowerCase().trim())) {
                titleParts.push(searchQuery.toUpperCase());
            }

            const title = titleParts.length > 0
                ? `RESULTADOS: ${titleParts.join(' + ')}`
                : 'RESULTADOS';

            return [{
                title,
                data: infiniteSessions,
                icon: undefined as any,
                accentColor: undefined as any,
                variant: 'standard' as any
            }];
        }

        const rows: { title: string; data: Session[]; icon?: string; accentColor?: string; variant?: 'overlay' | 'standard' | 'poster' | 'wide' | 'hero' | 'section-header' }[] = [];

        const favoriteIds = userState.favoriteSessionIds || [];
        if (favoriteIds.length > 0) {
            const favorites = sessions.filter(s => favoriteIds.includes(s.id)).map(convertToSession);
            rows.push({ title: 'Tus Favoritos', data: favorites, icon: 'heart', accentColor: '#FF6B6B' });
        }

        const technicalSessions = sessions.filter(s => s.isTechnical).map(convertToSession);
        if (technicalSessions.length > 0) {
            rows.push({
                title: 'Técnicas de calma',
                data: technicalSessions,
                icon: 'shield-checkmark',
                accentColor: '#2DD4BF',
                variant: 'standard'
            });
        }

        const flashSessions = shuffledSessions.filter(s => s.durationMinutes < 6).slice(0, 6).map(convertToSession);
        if (flashSessions.length > 0) {
            rows.push({
                title: 'Sesiones rápidas',
                data: flashSessions,
                icon: 'flash',
                accentColor: '#FBBF24',
                variant: 'standard'
            });
        }

        const newArrivals = [...sessions].reverse().slice(0, 5).map(convertToSession);
        rows.push({ title: 'Mejor valoradas', data: newArrivals, icon: 'sparkles', accentColor: '#A78BFA', variant: 'standard' });

        return rows;
    }, [filteredSessions, selectedCategory, searchQuery, selectedGuide, userState.favoriteSessionIds, sessions, shuffledSessions, hasActiveFilter]);

    const handleSeeAll = React.useCallback((sectionTitle: string) => {
        const cat = CATEGORIES.find(c => c.label.toLowerCase() === sectionTitle.toLowerCase());
        if (cat) {
            setSelectedCategory(cat.key);
            setSearchQuery('');
            return;
        }

        const upperTitle = sectionTitle.toUpperCase();

        if (upperTitle.includes('FLASH') || upperTitle.includes('RÁPIDAS')) {
            setSearchQuery('flash');
            setSelectedCategory('all');
        } else if (upperTitle.includes('FAVORITOS')) {
            setSearchQuery('favoritos');
            setSelectedCategory('all');
        } else if (upperTitle.includes('NOVEDADES') || upperTitle.includes('VALORADAS')) {
            setSearchQuery('novedades');
            setSelectedCategory('all');
        } else if (upperTitle.includes('TÉCNICOS') || upperTitle.includes('CORE') || upperTitle.includes('TÉCNICA')) {
            setSearchQuery('core');
            setSelectedCategory('all');
        } else if (upperTitle.startsWith('RESULTADOS')) {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedGuide(null);
        }

        scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, []);

    const handleSessionClick = React.useCallback((session: Session) => {
        const fullSession = sessions.find(s => s.id === session.id);
        if (fullSession) {
            setSelectedSession(fullSession);
        }
    }, [sessions]);

    const renderHeader = () => (
        <View style={styles.headerContent}>
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

            {!hasActiveFilter && (
                <>
                    <SoundwaveSeparator title="NUESTROS GUÍAS" accentColor="#2DD4BF" />
                    <View style={styles.guidesSection}>
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
                </>
            )}
        </View>
    );

    const filterOptions = useMemo(() => CATEGORIES.map(cat => ({
        id: cat.key,
        label: cat.label,
        icon: cat.icon,
        color: cat.color
    })), []);

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="MEDITACIONES"
                    path={["Oasis", "Biblioteca"]}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                        if (index === 1) navigation.navigate(Screen.LIBRARY as any);
                    }}
                    onSearchPress={toggleSearch}
                    onFilterPress={() => setShowFilter(true)}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    onProfilePress={() => navigation.navigate(Screen.PROFILE as any)}
                />
            }
            themeMode="healing"
            disableContentPadding={true}
            preset="fixed"
        >
            <FlashList
                data={sessionsByRow}
                keyExtractor={(item, index) => item.title + index}
                renderItem={({ item, index }) => (
                    <CategoryRow
                        title={item.title}
                        sessions={item.data}
                        icon={item.icon}
                        accentColor={item.accentColor}
                        onSessionPress={handleSessionClick}
                        onFavoritePress={(session) => toggleFavorite(session.id)}
                        onSeeAll={item.title?.toUpperCase?.().includes('RESULTADOS') ? handleSeeAll : undefined}
                        isPlusMember={userState.isPlusMember}
                        favoriteSessionIds={userState.favoriteSessionIds}
                        completedSessionIds={userState.completedSessionIds}
                        scrollY={scrollY}
                        isResults={hasActiveFilter}
                        variant={item.variant}
                        index={index}
                        sharedTransitionTagPrefix="session.image"
                        isLoading={hasActiveFilter ? isInfiniteLoading : false}
                    />
                )}
                estimatedItemSize={250}
                ListHeaderComponent={renderHeader()}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 100 },
                    { paddingTop: 10 }
                ]}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasActiveFilter && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // FlashList with Animated.event often needs false or specific setup
                )}
            />

            {selectedSession && (
                <SessionPreviewModal
                    isVisible={!!selectedSession}
                    session={selectedSession}
                    guideAvatar={selectedSession ? GUIDES.find(g => g.name === selectedSession.creatorName)?.avatar : undefined}
                    onClose={() => setSelectedSession(null)}
                    onStart={async () => {
                        if (!selectedSession) return;
                        const medData = sessions.find(s => s.id === selectedSession.id);
                        setSelectedSession(null);
                        if (medData) {
                            await closePlayer();
                            navigation.navigate(Screen.BREATHING_TIMER, {
                                sessionId: medData.id,
                                sessionData: medData
                            });
                        }
                    }}
                />
            )}

            <FilterActionSheet
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                options={filterOptions}
                selectedId={selectedCategory}
                onSelect={(id) => setSelectedCategory(id)}
                title="SANTUARIO INTERIOR"
            />
        </OasisScreen>
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
        marginBottom: 0,
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
        marginBottom: 12,
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
        marginTop: 20,
    },
});

export default MeditationCatalogScreen;
