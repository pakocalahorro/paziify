import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    StatusBar,
    ScrollView,
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
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { theme } from '../../constants/theme';
import { useAudiobooks } from '../../hooks/useContent';
import { useApp } from '../../context/AppContext';
import { OasisCard } from '../../components/Oasis/OasisCard';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';

type AudiobooksScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.AUDIOBOOKS
>;

interface Props {
    navigation: AudiobooksScreenNavigationProp;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const SPACING = 10;
const EMPTY_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

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
                            colors={['rgba(251, 113, 133, 0.5)', 'transparent']}
                        />
                        <Blur blur={25} />
                    </Circle>
                </Group>
            </Canvas>
            <View style={styles.silhouetteIconWrapper}>
                <Ionicons name="book-outline" size={60} color="rgba(251, 113, 133, 0.4)" style={styles.silhouetteIcon} />
            </View>
        </View>
    );
};

// --- CONSTANTS ---

// Guides Data (Duplicated from MeditationCatalog for now, avoiding cross-dependency risks)
const ALL_GUIDES = [
    {
        id: 'aria',
        name: 'Aria',
        specialty: 'Calma',
        color: '#66DEFF',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/avatars/aria_avatar.webp'
    },
    {
        id: 'eter',
        name: 'Éter',
        specialty: 'Sueño',
        color: '#9575CD',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/avatars/eter_avatar.webp'
    },
    {
        id: 'ziro',
        name: 'Ziro',
        specialty: 'Resiliencia',
        color: '#646CFF',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/avatars/ziro_avatar.webp'
    },
    {
        id: 'gaia',
        name: 'Gaia',
        specialty: 'Energía',
        color: '#FFA726',
        avatar: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation/avatars/gaia_avatar.webp'
    },
];

// Helper for visual properties of categories
const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
    growth: { label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    professional: { label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    anxiety: { label: 'Ansiedad', icon: 'sad-outline', color: '#FFA726' },
    health: { label: 'Salud', icon: 'fitness-outline', color: '#66BB6A' },
    family: { label: 'Familia', icon: 'people-outline', color: '#FFB74D' },
    children: { label: 'Niños', icon: 'happy-outline', color: '#F06292' },
    sleep: { label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
    focus: { label: 'Enfoque', icon: 'eye-outline', color: '#29B6F6' },
    stress: { label: 'Estrés', icon: 'thunderstorm-outline', color: '#EF5350' },
};

const AudiobooksScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode } = useApp();
    const isPlusMember = userState.isPlusMember || false;

    // ** React Query Hook **
    const { data, isLoading: loading, refetch, isRefetching } = useAudiobooks();
    const audiobooks = data || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' is key for "Todo"
    const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

    // Animations
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Search Animation (Standardized)
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchAnim = useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        const toValue = isSearchExpanded ? 0 : 1;
        Animated.spring(searchAnim, {
            toValue,
            useNativeDriver: false, // height/marginBottom
            friction: 8,
            tension: 40
        }).start();
        setIsSearchExpanded(!isSearchExpanded);
        if (isSearchExpanded) setSearchQuery('');
    };


    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    // ** UPDATED FILTERING LOGIC **
    // Now compatible with both local mock data and real Supabase strings.
    const filteredAudiobooks = useMemo(() => {
        const query = searchQuery.toLowerCase();

        return audiobooks.filter(book => {
            // 1. Search Match
            const matchesSearch = book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.narrator.toLowerCase().includes(query);

            // 2. Guide/Narrator Filter
            // Real names in Supabase match the ID in the catalog, but case might vary.
            // We'll normalize to lowercase. If mock IDs were used previously, checking substring might help.
            const matchesGuide = !selectedGuide || book.narrator.toLowerCase().includes(selectedGuide.toLowerCase());

            // 3. Category Filter
            // Make sure normalization applies so "Ciencia Ficción" matches "ciencia ficción" map if needed.
            // Using exact matching for categories since it's driven by our UI buttons.
            const matchesCategory = selectedCategory === 'all' || book.category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesGuide && matchesCategory;
        });
    }, [audiobooks, searchQuery, selectedCategory, selectedGuide]);

    const carouselData = useMemo(() => {
        if (filteredAudiobooks.length === 0) return [];
        return [{ id: 'empty-left' }, ...filteredAudiobooks, { id: 'empty-right' }];
    }, [filteredAudiobooks]);


    const handleRefresh = () => {
        refetch(); // Call the useQuery refetch
    };

    const handleBookPress = (book: Audiobook) => {
        if (book.is_premium && !isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.AUDIOBOOK_PLAYER as any, {
            audiobookId: book.id,
            audiobook: book // Prop-Passing (Zero Egress 2.0)
        });
    };

    // Derived active categories and guides basd on current data
    const activeCategories = useMemo(() => {
        const set = new Set(audiobooks.map(a => a.category.toLowerCase()));
        return ['all', ...Array.from(set)];
    }, [audiobooks]);

    const activeGuides = useMemo(() => {
        // Collect narrators found in audiobooks and try to map them to ALL_GUIDES
        const set = new Set(audiobooks.map(a => a.narrator.toLowerCase()));
        return ALL_GUIDES.filter(g => {
            // Check if any narrator includes the guide name (handles 'Voz de Aria' etc.)
            return Array.from(set).some(narrator => narrator.includes(g.name.toLowerCase()));
        });
    }, [audiobooks]);

    const availableCategories = useMemo(() => {
        return activeCategories.map(cat => {
            if (cat === 'all') return { id: 'all', label: 'Todos', icon: 'apps-outline', color: '#646CFF' };
            // Attempt to find config
            const configKey = Object.keys(CATEGORY_CONFIG).find(k => k.toLowerCase() === cat);
            if (configKey) return { id: cat, ...CATEGORY_CONFIG[configKey] };
            // Fallback for unknown categories
            return { id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1), icon: 'book-outline', color: '#90CAF9' };
        });
    }, [activeCategories]);

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {/* Nav / Title / Search Toggle */}
            <View style={styles.header}>
                {/* Antiguo bloque de encabezado removido - Ahora manejado por OasisHeader en OasisScreen */}
            </View>

            {/* Search Bar (Collapsible) */}
            <Animated.View style={[
                styles.searchBaseContainer,
                {
                    height: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
                    opacity: searchAnim,
                    marginBottom: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }),
                    overflow: 'hidden'
                }
            ]}>
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar libros o autores..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={false}
                    />
                </View>
            </Animated.View>

            {/* Categories */}
            <View style={styles.categoryWrap}>
                <FlatList
                    horizontal
                    data={availableCategories}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item.id)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedCategory === item.id ? 80 : 20}
                                tint="dark"
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === item.id && { backgroundColor: item.color }
                                ]}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={16}
                                    color={selectedCategory === item.id ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.categoryTextLabel,
                                    selectedCategory === item.id && styles.categoryLabelActive
                                ]}>
                                    {item.label}
                                </Text>
                            </BlurView>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Sub-Header / Guides Filter (Optional/Dynamic) */}
            {activeGuides.length > 0 && (
                <View style={styles.guidesSection}>
                    <View style={styles.moodHeaderCentered}>
                        <Text style={styles.moodSectionTitleLarge}>Voces Populares</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.guidesListCentered}
                    >
                        {activeGuides.map((guide) => {
                            const isSelected = selectedGuide === guide.name;
                            return (
                                <TouchableOpacity
                                    key={guide.id}
                                    onPress={() => setSelectedGuide(isSelected ? null : guide.name)}
                                    activeOpacity={0.8}
                                    style={styles.guideItem}
                                >
                                    <View style={styles.avatarWrapper}>
                                        {isSelected && (
                                            <View style={[styles.avatarGlow, { backgroundColor: guide.color }]} />
                                        )}
                                        <View style={[
                                            styles.avatarContainer,
                                            isSelected && { borderColor: guide.color, borderWidth: 2 }
                                        ]}>
                                            <Image
                                                source={{ uri: guide.avatar }}
                                                style={styles.avatarImage}
                                            />
                                        </View>
                                    </View>
                                    <Text style={[styles.guideName, isSelected && { color: guide.color, fontWeight: '700' }]}>
                                        {guide.name}
                                    </Text>
                                    {!isSelected && (
                                        <Text style={styles.guideSpecialty}>{guide.specialty}</Text>
                                    )}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            )}

        </View>
    );

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="AUDIOLIBROS"
                    path={["Oasis", "Biblioteca"]}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                        if (index === 1) navigation.navigate(Screen.LIBRARY as any);
                    }}
                    onSearchPress={toggleSearch}
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

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.ScrollView
                    contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                >
                    {renderHeader()}
                    <SoundwaveSeparator title="Sabiduría Eterna" accentColor="#FB7185" />

                    <View style={styles.carouselContainer}>
                        {loading && !isRefetching ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
                        ) : filteredAudiobooks.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.3)" />
                                <Text style={styles.emptyText}>No se encontraron audiolibros.</Text>
                            </View>
                        ) : (
                            <Animated.FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={carouselData}
                                keyExtractor={(item: any) => item.id}
                                contentContainerStyle={{ alignItems: 'center' }}
                                snapToInterval={ITEM_WIDTH}
                                decelerationRate="fast"
                                bounces={false}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                    { useNativeDriver: true }
                                )}
                                scrollEventThrottle={16}
                                renderItem={({ item, index }) => {
                                    if (item.id === 'empty-left' || item.id === 'empty-right') {
                                        return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                                    }

                                    const inputRange = [
                                        (index - 2) * ITEM_WIDTH,
                                        (index - 1) * ITEM_WIDTH,
                                        (index) * ITEM_WIDTH,
                                    ];

                                    const translateY = scrollX.interpolate({
                                        inputRange,
                                        outputRange: [40, 0, 40],
                                        extrapolate: 'clamp',
                                    });
                                    const scale = scrollX.interpolate({
                                        inputRange,
                                        outputRange: [0.9, 1, 0.9],
                                        extrapolate: 'clamp',
                                    });

                                    return (
                                        <View style={{ width: ITEM_WIDTH }}>
                                            <Animated.View
                                                style={{
                                                    transform: [{ translateY }, { scale }],
                                                }}
                                            >
                                                <OasisCard
                                                    superTitle={(item as any).category}
                                                    title={(item as any).title}
                                                    subtitle={`${(item as any).duration_m || 0} mins · ${(item as any).author || 'Autor'}`}
                                                    imageUri={(item as any).cover_url}
                                                    onPress={() => handleBookPress(item as any)}
                                                    icon="book-outline"
                                                    badgeText={(item as any).is_premium ? "PREMIUM" : "LIBRE"}
                                                    actionText="Leer Libro"
                                                    actionIcon="book"
                                                    duration={(item as any).duration_m ? `${(item as any).duration_m} min` : undefined}
                                                    level={(item as any).difficulty}
                                                    variant="hero"
                                                    accentColor="#FB7185"
                                                    sharedTransitionTag={`session.image.${item.id}`}
                                                />
                                            </Animated.View>
                                        </View>
                                    );
                                }}
                            />
                        )}
                    </View>
                </Animated.ScrollView>
            </Animated.View>
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    headerContent: {
        zIndex: 10,
    },
    header: {
        marginBottom: 8,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtnAbsolute: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    searchToggleBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 0,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center', // Center title in available space? Or left? User said "aparecer en la misma linea". Usually title is centered or left. Let's try Centered if space allows, or flex-start next to buttons. 
        // "arriba en la fila del boton... el titulo ... debe aparecer en la misma linea con el icono"
        // [Back][Search]  [Title] [Icon]
        paddingHorizontal: 8,
    },
    headerTitleInline: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        // Optional border or bg
    },
    // Old styles to remove/override can just be omitted if full replacement, but here we replace renderHeader and styles object partly.
    // I need to make sure I replace the styles object correctly.
    // ... (rest of styles preserved in logic below)

    // Search
    searchBaseContainer: {
        paddingHorizontal: 20,
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

    // Category List
    categoryWrap: {
        marginBottom: 10,
        marginTop: 5,
    },
    categoryList: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    categoryTextLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.5)',
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },

    // Guides Section
    guidesSection: {
        marginBottom: 10,
    },
    moodHeaderCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    moodSectionTitleLarge: {
        fontSize: 12,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1.5,
    },
    // Centered Guides
    guidesListCentered: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    guideItem: {
        alignItems: 'center',
        marginHorizontal: 12, // More symmetric spacing for centering
        width: 60,
    },
    avatarWrapper: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    avatarGlow: {
        width: 60,
        height: 60,
        position: 'absolute',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#000',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    guideName: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 2,
    },
    guideSpecialty: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
    },

    // Carousel
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 400,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        marginTop: 10,
        fontSize: 16,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 8, 16, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    // Silhouette Styles
    silhouetteContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    silhouetteCanvas: {
        width: 160,
        height: 160,
        position: 'absolute',
    },
    silhouetteIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(2, 6, 23, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 113, 133, 0.2)',
    },
    silhouetteIcon: {
        opacity: 0.8,
    },
});

export default AudiobooksScreen;
