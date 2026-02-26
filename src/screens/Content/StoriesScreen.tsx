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

import { Screen, RootStackParamList, RealStory } from '../../types';
import { theme } from '../../constants/theme';
import { storiesService } from '../../services/contentService';
import { useStories } from '../../hooks/useContent';
import { useApp } from '../../context/AppContext';
import { OasisCard } from '../../components/Oasis/OasisCard';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import { CONTENT_CATEGORIES } from '../../constants/categories'; // Import unified categories
import { SESSION_ASSETS, IMAGES } from '../../constants/images'; // Import shared assets

type StoriesScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.STORIES
>;

interface Props {
    navigation: StoriesScreenNavigationProp;
}

const { width } = Dimensions.get('window');





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

    // ** UNIFIED FILTERING LOGIC **
    // Now compatible with both local data and Supabase (Admin Panel)
    const filteredStories = React.useMemo(() => {
        const query = searchQuery.toLowerCase();

        return stories.filter(story => {
            // 1. Search Filter
            const matchesSearch = story.title.toLowerCase().includes(query) ||
                story.character_name?.toLowerCase().includes(query) ||
                story.tags.some(t => t.toLowerCase().includes(query));

            // 2. Category Filter (Dynamic)
            // If 'all', show everything. Otherwise, match category key.
            // Normalize both to lowercase to prevent mismatches.
            const matchesCategory = selectedCategory === 'all' ||
                story.category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [stories, searchQuery, selectedCategory]);


    const handleRefresh = () => {
        refetch();
    };

    const handleStoryPress = (story: RealStory) => {
        if (story.is_premium && !isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.STORY_DETAIL, {
            storyId: story.id,
            story: story // Prop-Passing (Zero Egress 2.0)
        });
    };



    const handlePopulate = async () => {
        try {
            await storiesService.populateStories();
            refetch();
            alert('Historias importadas correctamente');
        } catch (e) {
            alert('Error importando historias');
        }
    };

    {/* Header */ }
    <View style={styles.header}>
        <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    style={styles.backBtnAbsolute}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.searchToggleBtn}
                    onPress={() => {
                        // Toggle Search Logic
                        if (searchQuery !== '') setSearchQuery(''); // Clear if closing? No, standard Toggle.
                        // Actually, let's reuse standard toggle logic if we had it, but here we just show search input below
                        // For now, we'll make the Search Input visible/invisible if we want match Library, 
                        // but user asked for "Flecha izquierda + busqueda + titulo + icono", 
                        // assuming Search ICON triggers the bar.
                    }}
                >
                    {/* Wait, the user said "Fila 1 Flecha izquierda + busqueda + titulo + icono".
                                In LibraryScreen (Step 459), it is Left: [Back, SearchToggle], Center: Title, Right: Icon.
                                I'll implement exactly that.
                             */}
                    {/* We need to implement the toggleSearch state/anim if not present, 
                                but StoriesScreen already has searchInput visible always in current code. 
                                I will adapt to standard: Search Icon toggles visibility.
                             */}
                </TouchableOpacity>
            </View>
        </View>
    </View>

    {/* ... Actually, let's rewrite the whole renderHeader to be clean and match LibraryScreen structure exactly ... */ }

    // We need to introduce the toggle logic first in the component body if I replace the whole standard.
    // Let's do a multi_replace to handle imports/state if needed, but `StoriesScreen` already has `searchQuery`. 
    // It lacks `isSearchExpanded` and `searchAnim` in the same way? 
    // Checking file content: it lacks `isSearchExpanded`. It HAS `fadeAnim`. 
    // I need to add `isSearchExpanded` state and `searchAnim` Ref.

    // Better strategy: I will use `replace_file_content` to replace the `renderHeader` entirely 
    // AND `multi_replace` to add the missing state/refs.

    // Let's start with `multi_replace` to add state/refs and update `renderHeader`.


    const renderHeader = () => (
        <View style={styles.headerContent}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.backBtnAbsolute}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.searchToggleBtn}
                            onPress={toggleSearch}
                        >
                            <Ionicons
                                name={isSearchExpanded ? "close-outline" : "search-outline"}
                                size={20}
                                color={isSearchExpanded ? "#2DD4BF" : "#FFF"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitleInline}>Historias Reales</Text>
                    </View>

                    <View style={styles.headerIconContainer}>
                        <Ionicons name="sparkles-outline" size={24} color="#FBBF24" />
                    </View>
                </View>
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
                        placeholder="Buscar biografías..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={false}
                    />
                </View>
            </Animated.View>

            <View style={styles.filterSection}>
                <FlatList
                    horizontal
                    data={CONTENT_CATEGORIES}
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item.key)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedCategory === item.key ? 100 : 20}
                                tint="dark"
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === item.key && { backgroundColor: item.color }
                                ]}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={16}
                                    color={selectedCategory === item.key ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.categoryLabel,
                                    selectedCategory === item.key && styles.categoryLabelActive
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

            {/* Premium Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />

                {/* Parallax Image Mapping - Fading the light part as we scroll */}
                <Animated.View style={[StyleSheet.absoluteFill, {
                    opacity: scrollY.interpolate({
                        inputRange: [0, 200],
                        outputRange: [1, 0],
                        extrapolate: 'clamp'
                    }),
                    transform: [{
                        scale: scrollY.interpolate({
                            inputRange: [-100, 0, 100],
                            outputRange: [1.2, 1, 1],
                            extrapolate: 'clamp'
                        })
                    }, {
                        translateY: scrollY.interpolate({
                            inputRange: [-100, 0, 100],
                            outputRange: [-50, 0, 0], // Optional subtle vertical parallax Shift
                            extrapolate: 'clamp'
                        })
                    }]
                }]}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'transparent', 'rgba(2, 6, 23, 0.5)', 'rgba(2, 6, 23, 1.0)']}
                        locations={[0, 0.15, 0.45, 0.75, 0.98]}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>

                {/* Dark Background that stays for content */}
                <Animated.View style={[StyleSheet.absoluteFill, {
                    opacity: scrollY.interpolate({
                        inputRange: [0, 200],
                        outputRange: [0, 1],
                        extrapolate: 'clamp'
                    })
                }]}>
                    <LinearGradient
                        colors={['rgba(2, 6, 23, 0.6)', 'rgba(2, 6, 23, 1.0)']}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>

            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.ScrollView
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                >
                    {renderHeader()}

                    <View style={{ paddingHorizontal: 20 }}>
                        {filteredStories.map((item, index) => (
                            <View style={{ marginBottom: 16 }} key={item.id}>
                                <OasisCard
                                    superTitle={(item as any).category}
                                    title={(item as any).title}
                                    subtitle={`${(item as any).duration_m || 0} mins · ${(item as any).character_name || 'Historia'}`}
                                    imageUri={(item as any).thumbnail_url}
                                    onPress={() => handleStoryPress(item)}
                                    icon="sparkles-outline"
                                    badgeText={(item as any).is_premium ? "PREMIUM" : "LIBRE"}
                                    actionText="Leer Biografía"
                                    actionIcon="book"
                                    variant="hero"
                                    accentColor="#FBBF24"
                                    sharedTransitionTag={`story.image.${item.id}`}
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handlePopulate}
                        style={{ padding: 20, alignItems: 'center', opacity: 0.3 }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 10 }}>Regenerar Contenido (Dev)</Text>
                    </TouchableOpacity>
                </Animated.ScrollView>
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
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
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
    },
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
    filterSection: {
        marginBottom: 10,
    },
    categoryList: {
        paddingLeft: 20,
        paddingBottom: 8,
        paddingRight: 10,
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
        fontSize: 13,
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
