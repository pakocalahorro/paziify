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
    RadialGradient,
    Blur,
    vec
} from '@shopify/react-native-skia';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { AcademyModule } from '../../data/academyData';
import { AcademyService } from '../../services/AcademyService';
import CourseCard from '../../components/CourseCard';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import SoundWaveHeader from '../../components/SoundWaveHeader';

type CBTAcademyScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.CBT_ACADEMY
>;

interface Props {
    navigation: CBTAcademyScreenNavigationProp;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const SPACING = 10;
const EMPTY_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

// Helper / Config
const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
    growth: { label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    professional: { label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    anxiety: { label: 'Ansiedad', icon: 'rainy-outline', color: '#FFA726' },
    health: { label: 'Salud', icon: 'fitness-outline', color: '#66BB6A' },

    basics: { label: 'Fundamentos', icon: 'book-outline', color: '#F06292' },
    family: { label: 'Familia', icon: 'people-outline', color: '#FFB74D' },
};

const CBTAcademyScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();

    const [modules, setModules] = useState<AcademyModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Animations
    const scrollX = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadModules = async () => {
            try {
                const data = await AcademyService.getModules();
                setModules(data);
                setErrorMsg(null);
            } catch (error: any) {
                console.error('Failed to load academy modules', error);
                setErrorMsg(error.message || JSON.stringify(error));
            } finally {
                setIsLoading(false);
            }
        };

        loadModules();

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

    // Filter Logic
    const filteredCourses = useMemo(() => {
        return modules.filter(course => {
            const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
            const query = searchQuery.toLowerCase();
            const matchesSearch = course.title.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query) ||
                (course.author && course.author.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [modules, selectedCategory, searchQuery]);

    const carouselData = useMemo(() => {
        if (filteredCourses.length === 0) return [];
        return [{ id: 'empty-left' }, ...filteredCourses, { id: 'empty-right' }];
    }, [filteredCourses]);

    // Derived stats
    const activeStats = useMemo(() => {
        const cats = new Set(modules.map(c => c.category));
        return Object.keys(CATEGORY_CONFIG).filter(cat => cats.has(cat));
    }, [modules]);

    const availableCategories = useMemo(() => {
        const dynamicCats = activeStats.map(cat => {
            const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG] || {
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
                icon: 'school-outline',
                color: '#90CAF9'
            };
            return { id: cat, ...config };
        });

        return [
            { id: 'all', label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
            ...dynamicCats
        ];
    }, [activeStats]);

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        {/* 
                         * Back button logic: 
                         * If this is a main tab/screen, maybe no back button? 
                         * But usually user wants to go back to Home.
                         */}
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
                                color={isSearchExpanded ? "#FB7185" : "#FFF"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitleInline}>Academia TCC</Text>
                    </View>

                    <View style={styles.headerIconContainer}>
                        <Ionicons name="school-outline" size={24} color="#FB7185" />
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
                        placeholder="Buscar cursos..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
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
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="growth" />
                <LinearGradient
                    colors={['rgba(2, 6, 23, 0.3)', 'rgba(2, 6, 23, 0.8)']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <View style={{ flex: 1 }}>
                    {renderHeader()}

                    {/* Carousel */}
                    <View style={styles.carouselContainer}>
                        <SoundWaveHeader title="Elige tu curso" accentColor="#FB7185" />
                        {filteredCourses.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="school-outline" size={48} color="rgba(255,255,255,0.3)" />
                                <Text style={styles.emptyText}>No se encontraron cursos.</Text>
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
                                                <CourseCard
                                                    course={item as AcademyModule}
                                                    onPress={(course) => navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, { courseId: course.id })}
                                                    isLargeCard={true}
                                                />
                                            </Animated.View>
                                        </View>
                                    );
                                }}
                            />
                        )}
                    </View>
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
    selectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
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
});

export default CBTAcademyScreen;
