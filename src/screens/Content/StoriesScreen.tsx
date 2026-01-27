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
    Group,
    Blur,
} from '@shopify/react-native-skia';
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

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'all', label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { id: 'anxiety', label: 'Ansiedad', icon: 'frown-outline', color: '#FFA726' },
    { id: 'health', label: 'Bienestar', icon: 'fitness-outline', color: '#66BB6A' },
    { id: 'growth', label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    { id: 'relationships', label: 'Relaciones', icon: 'heart-outline', color: '#FF6B9D' },
    { id: 'professional', label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    { id: 'sleep', label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
];

const CATEGORY_ASSETS: Record<string, any> = {
    anxiety: { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80' },
    health: { uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80' },
    growth: { uri: 'https://images.unsplash.com/photo-1499728603263-137cb7ab3e1f?w=800&q=80' },
    relationships: { uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' },
    professional: { uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80' },
    sleep: { uri: 'https://images.unsplash.com/photo-1511295742364-9119556d7395?w=800&q=80' },
    family: { uri: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80' },
    children: { uri: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80' },
    all: { uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80' },
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

    useEffect(() => {
        loadStories();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
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
            story.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
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
                                source={CATEGORY_ASSETS[item.category.toLowerCase()] || CATEGORY_ASSETS['all']}
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
            {/* NEW UNIFIED HEADER AT THE TOP */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerLabel}>RELATOS DE</Text>
                        <Text style={styles.headerTitle}>Superación</Text>
                    </View>

                    <View style={styles.silhouetteContainer}>
                        <Canvas style={styles.silhouetteCanvas}>
                            <Group>
                                <Circle cx={50} cy={50} r={40} color="rgba(251, 191, 36, 0.2)">
                                    <Blur blur={15} />
                                </Circle>
                            </Group>
                        </Canvas>
                        <Ionicons name="sparkles-outline" size={32} color="rgba(251, 191, 36, 0.6)" />
                    </View>
                </View>

                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar historias..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {renderHero()}

            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'all' ? 'Todas las Historias' : `Superando: ${selectedCategory}`}
                </Text>

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#0A0E1A', '#1A1B2E', '#0A0E1A']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredStories}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
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
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#0A0E1A',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    headerLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FBBF24',
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    silhouetteContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    silhouetteCanvas: {
        width: 100,
        height: 100,
        position: 'absolute',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    headerContent: {
        // Wrapper
    },
    heroContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    heroList: {
        paddingRight: 20,
        paddingLeft: 20,
    },
    heroCard: {
        width: width * 0.78,
        height: 180,
        marginRight: 16,
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
        padding: 20,
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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginLeft: 20,
        marginBottom: 16,
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
    categoryList: {
        paddingLeft: 20,
        paddingBottom: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: 10,
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 14, 26, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default StoriesScreen;
