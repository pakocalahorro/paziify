import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    TextInput,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, RootStackParamList, Audiobook } from '../../types';
import { useAudiobooks } from '../../hooks/useContent';
import { useApp } from '../../context/AppContext';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import CategoryRow from '../../components/CategoryRow';
import { FilterActionSheet } from '../../components/Oasis/FilterActionSheet';

type AudiobooksScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.AUDIOBOOKS
>;

interface Props {
    navigation: AudiobooksScreenNavigationProp;
}

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
    const { userState, toggleFavorite } = useApp();
    const isPlusMember = userState.isPlusMember || false;

    const { data, isLoading: loading, refetch, isRefetching } = useAudiobooks();
    const audiobooks = data || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const [showFilter, setShowFilter] = useState(false);

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

    useEffect(() => {
        if (!loading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }
    }, [loading]);

    const filteredAudiobooks = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return audiobooks.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.narrator.toLowerCase().includes(query);
            const matchesCategory = selectedCategory === 'all' || book.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [audiobooks, searchQuery, selectedCategory]);

    const handleBookPress = (book: Audiobook) => {
        if (book.is_premium && !isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.AUDIOBOOK_PLAYER as any, {
            audiobookId: book.id,
            audiobook: book
        });
    };

    const activeCategories = useMemo(() => {
        const set = new Set(audiobooks.map(a => a.category.toLowerCase()));
        return ['all', ...Array.from(set)];
    }, [audiobooks]);

    const availableCategories = useMemo(() => {
        return activeCategories.map(cat => {
            if (cat === 'all') return { id: 'all', label: 'Todos', icon: 'apps-outline', color: '#646CFF' };
            const configKey = Object.keys(CATEGORY_CONFIG).find(k => k.toLowerCase() === cat);
            if (configKey) return { id: cat, ...CATEGORY_CONFIG[configKey] };
            return { id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1), icon: 'book-outline', color: '#90CAF9' };
        });
    }, [activeCategories]);

    const filterOptions = useMemo(() => availableCategories, [availableCategories]);

    return (
        <>
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
                        onFilterPress={() => setShowFilter(true)}
                        userName={userState.name || 'Pazificador'}
                        avatarUrl={userState.avatarUrl}
                        showEvolucion={true}
                        onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                        onProfilePress={() => (navigation as any).navigate('ProfileTab', { screen: Screen.PROFILE })}
                    />
                }
                themeMode="healing"
                disableContentPadding={true}
                preset="fixed"
            >
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                    <View style={{ flex: 1 }}>
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

                        <CategoryRow
                            title="Sabiduría Eterna"
                            accentColor="#FB7185"
                            sessions={filteredAudiobooks.map(b => ({
                                ...b,
                                creatorName: b.narrator || b.author,
                                thumbnailUrl: b.image_url,
                                isPlus: b.is_premium,
                                duration: b.duration_minutes,
                                description: b.description
                            } as any))}
                            onSessionPress={(item: any) => handleBookPress(item)}
                            onFavoritePress={(session: any) => toggleFavorite(session.id)}
                            favoriteSessionIds={userState.favoriteSessionIds}
                            isPlusMember={isPlusMember}
                            isLoading={loading && !isRefetching}
                            icon="book-outline"
                        />
                    </View>
                </Animated.View>
            </OasisScreen>

            <FilterActionSheet
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                options={filterOptions}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
                title="SABIDURÍA ACADÉMICA"
            />
        </>
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

export default AudiobooksScreen;
