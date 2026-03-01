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
    InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { AcademyModule } from '../../data/academyData';
import { AcademyService } from '../../services/AcademyService';
import { Screen, RootStackParamList } from '../../types';
import { OasisCard } from '../../components/Oasis/OasisCard';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import { FilterActionSheet } from '../../components/Oasis/FilterActionSheet';

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
    const [showFilter, setShowFilter] = useState(false);

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
                console.log('AcademyScreen: Failed to load academy modules (silenced):', error);
                setErrorMsg('Error de conexión. Mostrando contenido local.');
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
        return Object.keys(CATEGORY_CONFIG).filter(cat => cats.has(cat as any));
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

        </View>
    );

    const filterOptions = useMemo(() => availableCategories.map(cat => ({
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color
    })), [availableCategories]);

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="ACADEMIA"
                    path={["Oasis"]}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
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
            themeMode="growth"
            disableContentPadding={true}
            preset="fixed"
        >
            <StatusBar barStyle="light-content" />

            {/* Content Overlay */}
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <View style={{ flex: 1 }}>
                    {renderHeader()}
                    <SoundwaveSeparator title="Elige tu curso" accentColor="#FB7185" />

                    {/* Carousel */}
                    <View style={styles.carouselContainer}>
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
                                directionalLockEnabled={true}
                                nestedScrollEnabled={false}
                                scrollEnabled={true}
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
                                        outputRange: [0, 0, 0],
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
                                                <OasisCard
                                                    superTitle={(item as any).category}
                                                    title={(item as any).title}
                                                    subtitle={`${(item as any).duration || 0} mins · ${(item as any).author || 'Guía'}`}
                                                    imageUri={(item as any).thumbnailUrl}
                                                    onPress={() => navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                                                        courseId: item.id,
                                                        courseData: item as any
                                                    })}
                                                    icon="school-outline"
                                                    badgeText={(item as any).isPlus ? "PREMIUM" : "LIBRE"}
                                                    actionText="Ver Curso"
                                                    actionIcon="school"
                                                    duration={(item as any).duration ? `${(item as any).duration} min` : undefined}
                                                    level={(item as any).difficulty}
                                                    variant="hero"
                                                    accentColor="#FB7185"
                                                    sharedTransitionTag={`course.image.${item.id}`}
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

            <FilterActionSheet
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                options={filterOptions}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
                title="SABIDURÍA ACADÉMICA"
            />
        </OasisScreen >
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
        marginBottom: 0,
        paddingHorizontal: 20,
        marginTop: 0,
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
        justifyContent: 'flex-start',
        marginTop: -55, // Sincronizado con Audiolibros para misma posición del rayo
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
