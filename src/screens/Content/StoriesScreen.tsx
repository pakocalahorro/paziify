import React, { useState, useEffect, useRef } from 'react';
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
    ImageBackground,
    Image,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, RootStackParamList, RealStory } from '../../types';
import { theme } from '../../constants/theme';
import { storiesService } from '../../services/contentService';
import { useApp } from '../../context/AppContext';
import StoryCard from '../../components/StoryCard';

type StoriesScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.STORIES
>;

interface Props {
    navigation: StoriesScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'all', label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { id: 'anxiety', label: 'Ansiedad', icon: 'frown-outline', color: '#FFA726' },
    { id: 'health', label: 'Bienestar', icon: 'fitness-outline', color: '#66BB6A' },
    { id: 'growth', label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    { id: 'relationships', label: 'Relaciones', icon: 'heart-outline', color: '#FF6B9D' },
    { id: 'professional', label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    { id: 'sleep', label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
];

// Mapping purely for UI assets
const CATEGORY_ASSETS: Record<string, any> = {
    anxiety: require('../../assets/covers/anxiety.png'),
    health: require('../../assets/covers/health.png'),
    growth: require('../../assets/covers/growth.png'),
    relationships: require('../../assets/covers/relationships.png'),
    professional: require('../../assets/covers/professional.png'),
    sleep: require('../../assets/covers/sleep.png'),
    family: require('../../assets/covers/family.png'),
    children: require('../../assets/covers/children.png'),
    all: require('../../assets/covers/growth.png'), // Default
};

const StoriesScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const isPlusMember = userState.isPlusMember || false;

    const [stories, setStories] = useState<RealStory[]>([]);
    const [featuredStories, setFeaturedStories] = useState<RealStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const listScale = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        loadStories();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(listScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await storiesService.getAll();
            setStories(data);
            setFeaturedStories(data.filter(s => s.is_featured).slice(0, 5));
        } catch (error) {
            console.error('Error loading stories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadStories();
    };

    const handleStoryPress = (story: RealStory) => {
        if (story.is_premium && !isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.STORY_DETAIL, { storyId: story.id });
    };

    const filteredStories = stories.filter(story => {
        const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
        const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.story_text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderHero = () => {
        if (featuredStories.length === 0 || selectedCategory !== 'all') return null;

        return (
            <View style={styles.heroContainer}>
                <Text style={styles.sectionTitle}>Destacados para ti</Text>
                <FlatList
                    horizontal
                    data={featuredStories}
                    keyExtractor={(item) => `hero-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.heroList}
                    snapToInterval={width * 0.82}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.heroCard}
                            onPress={() => handleStoryPress(item)}
                            activeOpacity={0.9}
                        >
                            <ImageBackground
                                source={CATEGORY_ASSETS[item.category]}
                                style={styles.heroImage}
                                imageStyle={{ borderRadius: 24 }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                                    style={styles.heroGradient}
                                >
                                    <View style={styles.heroContent}>
                                        <View style={styles.heroBadge}>
                                            <Text style={styles.heroBadgeText}>ESTRENO</Text>
                                        </View>
                                        <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
                                        <Text style={styles.heroSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {renderHero()}

            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'all' ? 'Todas las Historias' : `Superando: ${selectedCategory}`}
                </Text>

                <View style={styles.searchWrapper}>
                    <BlurView intensity={30} tint="dark" style={styles.searchBlur}>
                        <Ionicons name="search-outline" size={20} color="rgba(255,255,255,0.5)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar en la biblioteca..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </BlurView>
                </View>

                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item.id)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedCategory === item.id ? 100 : 20}
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
                                    styles.categoryLabel,
                                    selectedCategory === item.id && styles.categoryLabelActive
                                ]}>
                                    {item.label}
                                </Text>
                            </BlurView>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <BlurView intensity={20} tint="dark" style={styles.emptyBlur}>
                <Ionicons name="sparkles-outline" size={64} color={theme.colors.primary} />
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptySubtitle}>Intenta con otra palabra clave</Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                >
                    <Text style={styles.resetButtonText}>Limpiar filtros</Text>
                </TouchableOpacity>
            </BlurView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Ambient Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#0A0E1A', '#1A1B2E', '#0A0E1A']}
                    style={StyleSheet.absoluteFill}
                />
                <Animated.View
                    style={[
                        styles.backgroundGlow,
                        {
                            backgroundColor: CATEGORIES.find(c => c.id === selectedCategory)?.color || theme.colors.primary,
                            opacity: 0.08,
                        }
                    ]}
                />
            </View>

            {/* Sticky Header */}
            <BlurView intensity={80} tint="dark" style={[styles.navHeader, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inspiración Hub</Text>
                <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
                    <Ionicons name="refresh-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </BlurView>

            <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: listScale }] }}>
                <Animated.FlatList
                    data={filteredStories}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <StoryCard
                            story={item}
                            onPress={handleStoryPress}
                            isPlusMember={isPlusMember}
                        />
                    )}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    ListEmptyComponent={loading ? null : renderEmpty}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                />
            </Animated.View>

            {loading && !refreshing && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A',
    },
    backgroundGlow: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        zIndex: 100,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
    },
    headerContent: {
        // Wrapper for hero and filters
    },
    heroContainer: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    heroList: {
        paddingRight: theme.spacing.xl,
    },
    heroCard: {
        width: width * 0.78,
        height: 180,
        marginRight: theme.spacing.md,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: theme.spacing.lg,
    },
    heroContent: {
        gap: 4,
    },
    heroBadge: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '600',
    },
    filterSection: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: theme.spacing.md,
        opacity: 0.9,
    },
    searchWrapper: {
        marginBottom: theme.spacing.md,
    },
    searchBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 15,
        paddingHorizontal: theme.spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    categoryList: {
        paddingBottom: theme.spacing.sm,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 8,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    emptyBlur: {
        padding: 40,
        borderRadius: 30,
        alignItems: 'center',
        width: width * 0.8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    resetButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 26, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default StoriesScreen;
