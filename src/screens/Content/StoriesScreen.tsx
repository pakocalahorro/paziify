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
import { Screen, RootStackParamList, RealStory } from '../../types';
import { theme } from '../../constants/theme';
import { storiesService } from '../../services/contentService';
import { useStories } from '../../hooks/useContent';
import { useApp } from '../../context/AppContext';
import StoryCard from '../../components/StoryCard';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';

type StoriesScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.STORIES
>;

interface Props {
    navigation: StoriesScreenNavigationProp;
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
                            colors={['rgba(251, 191, 36, 0.5)', 'transparent']}
                        />
                        <Blur blur={25} />
                    </Circle>
                </Group>
            </Canvas>
            <View style={styles.silhouetteIconWrapper}>
                <Ionicons name="sparkles-outline" size={60} color="rgba(251, 191, 36, 0.4)" style={styles.silhouetteIcon} />
            </View>
        </View>
    );
};

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
    ansiedad: { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80' },
    health: { uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80' },
    bienestar: { uri: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80' },
    growth: { uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80' },
    crecimiento: { uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80' },
    relationships: { uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' },
    relaciones: { uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80' },
    professional: { uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80' },
    carrera: { uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80' },
    sleep: { uri: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80' },
    sueño: { uri: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80' },
    family: { uri: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80' },
    familia: { uri: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80' },
    children: { uri: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80' },
    hijos: { uri: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&q=80' },
    all: { uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80' },
    todo: { uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80' },
};

const StoriesScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode } = useApp();
    const isPlusMember = userState.isPlusMember || false;

    // ** React Query Hook **
    const { data, isLoading: loading, refetch, isRefetching } = useStories();
    const stories = data || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const featuredStories = React.useMemo(() => {
        return stories.filter(s => s.is_featured).slice(0, 5);
    }, [stories]);

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleRefresh = () => {
        refetch();
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
                        <Text style={styles.headerLabel}>HISTORIAS DE</Text>
                        <View style={styles.headerTop}>
                            <Text style={styles.headerTitle}>Transformación</Text>
                        </View>
                    </View>
                    <BacklitSilhouette />
                </View>
                <Text style={styles.headerSubtitle}>
                    Narrativas reales de superación y crecimiento personal.
                </Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
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
        </View >
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredStories}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item, index }) => (
                        <StoryCard
                            story={item}
                            onPress={handleStoryPress}
                            isPlusMember={userState.isPlusMember}
                            scrollY={scrollY}
                            index={index}
                        />
                    )}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                    onRefresh={handleRefresh}
                    refreshing={isRefetching}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                />
            </Animated.View>

            {loading && !isRefetching && (
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
    headerContent: {
        // Wrapper
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
        fontSize: 10,
        fontWeight: '900',
        color: '#FBBF24',
        letterSpacing: 2,
        marginBottom: 4,
    },
    headerTop: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
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
    listContent: {
        paddingHorizontal: 20,
    },
});

export default StoriesScreen;
