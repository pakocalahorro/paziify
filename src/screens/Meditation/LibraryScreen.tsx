import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Animated,
    Dimensions,
    Image,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../constants/images';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import SoundWaveHeader from '../../components/SoundWaveHeader';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const EMPTY_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

type LibraryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LIBRARY
>;

interface Props {
    navigation: LibraryScreenNavigationProp;
}

interface LibraryCategory {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    image: any;
    color: string;
    count: string;
    screen: Screen;
}

const CATEGORIES: LibraryCategory[] = [
    {
        id: 'meditation',
        title: 'Meditación',
        description: 'Guías de presencia y mindfulness para el día a día.',
        icon: 'flower-outline',
        image: IMAGES.LIB_MEDITATION,
        color: '#2DD4BF',
        count: 'SESIONES',
        screen: Screen.MEDITATION_CATALOG,
    },
    {
        id: 'ambient',
        title: 'Música & Ambientes',
        description: 'Paisajes sonoros para enfocar, dormir o simplemente estar.',
        icon: 'headset-outline',
        image: IMAGES.LIB_AMBIENT,
        color: '#8B5CF6',
        count: 'SONIDOS',
        screen: Screen.BACKGROUND_SOUND,
    },
    {
        id: 'audiobooks',
        title: 'Audiolibros',
        description: 'Clásicos de la sabiduría para expandir tu conciencia.',
        icon: 'book-outline',
        image: IMAGES.LIB_BOOKS,
        color: '#FB7185',
        count: 'BIBLIOTECA',
        screen: Screen.AUDIOBOOKS,
    },
    {
        id: 'stories',
        title: 'Historias Reales',
        description: 'Relatos de superación y resiliencia humana.',
        icon: 'sparkles-outline',
        image: IMAGES.LIB_STORIES,
        color: '#FBBF24',
        count: 'LECTURAS',
        screen: Screen.STORIES,
    }
];

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Animations
    const scrollX = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

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

    const carouselData = useMemo(() => {
        return [{ id: 'empty-left' }, ...CATEGORIES, { id: 'empty-right' }];
    }, []);

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
                        <Text style={styles.headerTitleInline}>Biblioteca de Calma</Text>
                    </View>

                    <View style={styles.headerIconContainer}>
                        <Ionicons name="library-outline" size={24} color="#2DD4BF" />
                    </View>
                </View>
            </View>

            {/* Search Bar */}
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
                        placeholder="Buscar en la biblioteca..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>
        </View>
    );

    const renderCategoryCard = (item: LibraryCategory, index: number) => {
        const inputRange = [
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            (index) * ITEM_WIDTH,
        ];

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, 50],
            extrapolate: 'clamp',
        });
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ width: ITEM_WIDTH }}>
                <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate(item.screen as any)}
                        style={styles.cardContainer}
                    >
                        <ImageBackground
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.cardImage}
                            imageStyle={{ borderRadius: 32 }}
                        >
                            <LinearGradient
                                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                                style={styles.cardGradient}
                            />

                            <View style={styles.cardContent}>
                                <View style={styles.cardTopRow}>
                                    <BlurView intensity={20} tint="dark" style={styles.badge}>
                                        <Ionicons name={item.icon} size={14} color={item.color} />
                                        <Text style={[styles.badgeText, { color: item.color }]}>{item.count}</Text>
                                    </BlurView>
                                </View>

                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDesc}>{item.description}</Text>

                                    <View style={styles.actionButton}>
                                        <Text style={styles.actionText}>EXPLORAR</Text>
                                        <Ionicons name="arrow-forward" size={14} color="#000" />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
                <LinearGradient
                    colors={['rgba(2, 6, 23, 0.3)', 'rgba(2, 6, 23, 0.8)']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {renderHeader()}

                <View style={styles.carouselContainer}>
                    <SoundWaveHeader title="Tu Santuario" accentColor="#2DD4BF" />

                    <Animated.FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={carouselData}
                        keyExtractor={(item: any) => item.id}
                        contentContainerStyle={[styles.flatListContent, { paddingBottom: insets.bottom + 80 }]}
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
                            return renderCategoryCard(item as LibraryCategory, index);
                        }}
                    />
                </View>
            </Animated.View>
        </View>
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
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerTitleInline: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
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
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    flatListContent: {
        alignItems: 'center',
    },
    cardContainer: {
        height: ITEM_WIDTH * 1.4,
        marginHorizontal: 0,
        borderRadius: 32,
        backgroundColor: '#111',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardImage: {
        flex: 1,
    },
    cardGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 32,
    },
    cardContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardTopRow: {
        flexDirection: 'row',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    cardInfo: {
        gap: 12,
    },
    cardTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
        lineHeight: 20,
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
    },
    actionText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    }
});

export default LibraryScreen;
