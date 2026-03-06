import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    View,
    TextInput,
    Animated,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AcademyModule } from '../../data/academyData';
import { AcademyService } from '../../services/AcademyService';
import { Screen, RootStackParamList } from '../../types';
import CategoryRow from '../../components/CategoryRow';
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

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
    growth: { label: 'Crecimiento', icon: 'leaf-outline', color: '#646CFF' },
    professional: { label: 'Carrera', icon: 'briefcase-outline', color: '#4FC3F7' },
    anxiety: { label: 'Ansiedad', icon: 'rainy-outline', color: '#FFA726' },
    health: { label: 'Salud', icon: 'fitness-outline', color: '#66BB6A' },
    basics: { label: 'Fundamentos', icon: 'book-outline', color: '#F06292' },
    family: { label: 'Familia', icon: 'people-outline', color: '#FFB74D' },
};

const CBTAcademyScreen: React.FC<Props> = ({ navigation }) => {
    const { userState, toggleFavorite } = useApp();

    const [modules, setModules] = useState<AcademyModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadModules = async () => {
            try {
                const data = await AcademyService.getModules();
                setModules(data);
            } catch (error: any) {
                console.log('AcademyScreen: Failed to load academy modules (silenced):', error);
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
            { id: 'all', label: 'Todo', icon: 'leaf-outline', color: '#646CFF' },
            ...dynamicCats
        ];
    }, [activeStats]);

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

                    <CategoryRow
                        title="Elige tu curso"
                        accentColor="#FB7185"
                        sessions={filteredCourses.map(c => ({
                            ...c,
                            creatorName: c.author,
                            thumbnailUrl: c.image, // Corrected from thumbnailUrl
                            isPlus: (c as any).is_premium || false,
                            description: c.description
                        } as any))}
                        onSessionPress={(item: any) => navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                            courseId: item.id,
                            courseData: item as any
                        })}
                        onFavoritePress={(session: any) => toggleFavorite(session.id)}
                        favoriteSessionIds={userState.favoriteSessionIds}
                        isPlusMember={userState.isPlusMember || false}
                        isLoading={isLoading}
                        icon="school-outline"
                        sharedTransitionTagPrefix="course.image"
                    />
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
});

export default CBTAcademyScreen;
