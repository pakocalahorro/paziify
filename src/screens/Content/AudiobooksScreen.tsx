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
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { theme } from '../../constants/theme';
import { audiobooksService } from '../../services/contentService';
import { useApp } from '../../context/AppContext';
import AudiobookCard from '../../components/AudiobookCard';

type AudiobooksScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.AUDIOBOOKS
>;

interface Props {
    navigation: AudiobooksScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'all', label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { id: 'growth', label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    { id: 'professional', label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    { id: 'anxiety', label: 'Ansiedad', icon: 'frown-outline', color: '#FFA726' },
    { id: 'health', label: 'Salud', icon: 'fitness-outline', color: '#66BB6A' },
    { id: 'family', label: 'Familia', icon: 'people-outline', color: '#FFB74D' },
    { id: 'children', label: 'Niños', icon: 'happy-outline', color: '#F06292' },
    { id: 'sleep', label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
];

const BOOK_COVERS: Record<string, any> = {
    'Meditations': require('../../assets/covers/meditations.png'),
    'The Conquest of Fear': require('../../assets/covers/conquest_fear.png'),
    'Little Women': require('../../assets/covers/little_women.png'),
    'As a Man Thinketh': require('../../assets/covers/mind_power.png'),
};

const AudiobooksScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const isPlusMember = userState.isPlusMember || false;

    const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
    const [featuredBooks, setFeaturedBooks] = useState<Audiobook[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadAudiobooks();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadAudiobooks = async () => {
        try {
            setLoading(true);
            const data = await audiobooksService.getAll();
            setAudiobooks(data);
            setFeaturedBooks(data.filter(b => b.is_featured).slice(0, 5));
        } catch (error) {
            console.error('Error loading audiobooks:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadAudiobooks();
    };

    const handleAudiobookPress = (audiobook: Audiobook) => {
        if (audiobook.is_premium && !isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.AUDIOBOOK_PLAYER as any, { audiobookId: audiobook.id });
    };

    const filteredAudiobooks = audiobooks.filter(book => {
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderHero = () => {
        if (featuredBooks.length === 0 || selectedCategory !== 'all') return null;

        return (
            <View style={styles.heroContainer}>
                <Text style={styles.sectionTitle}>Escucha destacada</Text>
                <Animated.FlatList
                    horizontal
                    data={featuredBooks}
                    keyExtractor={(item) => `hero-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.heroList}
                    snapToInterval={width * 0.7}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.heroCard}
                            onPress={() => handleAudiobookPress(item)}
                            activeOpacity={0.9}
                        >
                            <ImageBackground
                                source={BOOK_COVERS[item.title] || require('../../assets/covers/growth.png')}
                                style={styles.heroImage}
                                imageStyle={{ borderRadius: 20 }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.heroGradient}
                                >
                                    <View style={styles.heroBadge}>
                                        <Text style={styles.heroBadgeText}>DESTACADO</Text>
                                    </View>
                                    <View style={styles.heroInfo}>
                                        <Text style={styles.heroTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.heroAuthor} numberOfLines={1}>{item.author}</Text>
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
                        <Text style={styles.headerLabel}>BIBLIOTECA DE</Text>
                        <Text style={styles.headerTitle}>Sabiduría</Text>
                    </View>

                    <View style={styles.silhouetteContainer}>
                        <Canvas style={styles.silhouetteCanvas}>
                            <Group>
                                <Circle cx={50} cy={50} r={40} color="rgba(251, 113, 133, 0.2)">
                                    <Blur blur={15} />
                                </Circle>
                            </Group>
                        </Canvas>
                        <Ionicons name="book-outline" size={32} color="rgba(251, 113, 133, 0.6)" />
                    </View>
                </View>

                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar audiolibros..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {renderHero()}

            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'all' ? 'Todo el Contenido' : `Categoría: ${selectedCategory}`}
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
                    colors={['#050810', '#101222', '#050810']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredAudiobooks}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                        <AudiobookCard
                            audiobook={item}
                            onPress={handleAudiobookPress}
                            isPlusMember={isPlusMember}
                        />
                    )}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
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
        backgroundColor: '#050810',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#050810',
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
        color: '#FB7185',
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
        paddingRight: 40,
        paddingLeft: 20,
    },
    heroCard: {
        width: width * 0.65,
        height: 280,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    heroBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
    },
    heroInfo: {
        gap: 4,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
    },
    heroAuthor: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '700',
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
        paddingBottom: 4,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        marginRight: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 8, 16, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

export default AudiobooksScreen;
