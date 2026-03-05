import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen, RootStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';
import { Session } from '../../types';
import { Soundscape } from '../../data/soundscapesData';
import { soundscapesService } from '../../services/contentService';
import { OasisCard } from '../../components/Oasis/OasisCard';
import { Modal } from 'react-native';
import CategoryRow from '../../components/CategoryRow';

const { width } = Dimensions.get('window');

type BackgroundSoundScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.BACKGROUND_SOUND
>;

interface Props {
    navigation: BackgroundSoundScreenNavigationProp;
}

const BackgroundSoundScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState('Todos');

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
        if (isSearchExpanded) setSearchQuery('');
    };

    const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await soundscapesService.getAll();
                setSoundscapes(data as any);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    // Extract unique tags from soundscapes for the filter
    const recommendationTags = useMemo(() => {
        const tags = new Set<string>();
        tags.add('Todos');
        soundscapes.forEach(s => {
            if (s.recommendedFor) {
                s.recommendedFor.forEach(tag => {
                    const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
                    tags.add(capitalized);
                });
            }
        });
        return Array.from(tags);
    }, [soundscapes]);

    // Filtered list based on selection and search
    const filteredSoundscapes = useMemo(() => {
        let list = soundscapes;

        // 1. Tag filter
        if (selectedTag !== 'Todos') {
            list = list.filter(s =>
                s.recommendedFor && s.recommendedFor.some(tag =>
                    tag.toLowerCase() === selectedTag.toLowerCase()
                )
            );
        }

        // 2. Search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(query) ||
                (s.description && s.description.toLowerCase().includes(query))
            );
        }

        return list;
    }, [soundscapes, selectedTag, searchQuery]);

    const handlePress = (item: Soundscape) => {
        navigation.navigate(Screen.BACKGROUND_PLAYER, {
            soundscapeId: item.id,
            soundscape: item // Prop-Passing (Zero Egress 2.0)
        });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Search Bar (Collapsible) */}
            {isSearchExpanded && (
                <View style={[styles.searchBaseContainer, { marginBottom: 15 }]}>
                    <View style={styles.searchWrapper}>
                        <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar paisajes sonoros..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                        />
                    </View>
                </View>
            )}
        </View>
    );

    const renderFilterModal = () => (
        <Modal
            visible={isFilterModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleFilterModal}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={{ flex: 1 }} onPress={toggleFilterModal} />
                <BlurView intensity={80} tint="dark" style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>FILTRAR POR RECOMENDACIÓN</Text>
                        <TouchableOpacity onPress={toggleFilterModal} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {recommendationTags.map(tag => (
                            <TouchableOpacity
                                key={tag}
                                style={[
                                    styles.filterOption,
                                    selectedTag === tag && styles.filterOptionActive
                                ]}
                                onPress={() => {
                                    setSelectedTag(tag);
                                    toggleFilterModal();
                                }}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    selectedTag === tag && styles.filterOptionTextActive
                                ]}>
                                    {tag}
                                </Text>
                                {selectedTag === tag && (
                                    <Ionicons name="checkmark-circle" size={20} color="#2DD4BF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </BlurView>
            </View>
        </Modal>
    );

    return (
        <OasisScreen
            header={
                <OasisHeader
                    title="SONIDOS"
                    path={["Oasis", "Biblioteca"]}
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                        if (index === 1) navigation.navigate(Screen.LIBRARY as any);
                    }}
                    onSearchPress={toggleSearch}
                    onFilterPress={toggleFilterModal}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    onProfilePress={() => navigation.navigate(Screen.PROFILE as any)}
                />
            }
            themeMode="healing"
            disableContentPadding={true}
            preset="fixed"
        >

            <View style={styles.content}>
                {loading ? (
                    <>
                        {renderHeader()}
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#2DD4BF" />
                        </View>
                    </>
                ) : (
                    <View style={{ flex: 1 }}>
                        {renderHeader()}
                        <CategoryRow
                            title={selectedTag === 'Todos' ? "Ambientes Inmersivos" : `Filtro: ${selectedTag}`}
                            accentColor="#2DD4BF"
                            sessions={filteredSoundscapes.map(s => ({
                                id: s.id,
                                title: s.name,
                                description: s.description,
                                thumbnailUrl: s.image,
                                isPlus: s.isPremium,
                                creatorName: 'Paziify',
                                duration: undefined,
                                category: s.isPremium ? 'PREMIUM' : 'LIBRE',
                                originalSoundscape: s
                            } as any))}
                            onSessionPress={(item: any) => handlePress(item.originalSoundscape)}
                            isPlusMember={userState.isPlusMember}
                            icon="planet-outline"
                        />
                    </View>
                )}
            </View>
            {renderFilterModal()}
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    content: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: 10,
        marginBottom: 10,
        paddingHorizontal: 0, // Now managed by children to allow full-width elements
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
    headerRow2: {
        marginBottom: 16,
    },
    headerRow3: {
        // Wave separator logic
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
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    silhouetteWrapper: {
        marginRight: -20,
        opacity: 0.8,
    },
    filterSectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
    },
    filterList: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    tagChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    tagChipActive: {
        backgroundColor: '#2DD4BF',
        borderColor: '#2DD4BF',
    },
    tagText: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    tagTextActive: {
        color: '#FFF',
    },
    listContent: {
        // paddingHorizontal: 16,
    },
    columnWrapper: {
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    cardWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        maxHeight: Dimensions.get('window').height * 0.7,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderBottomWidth: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    filterOptionActive: {
        borderBottomColor: 'rgba(45, 212, 191, 0.3)',
    },
    filterOptionText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
    },
    filterOptionTextActive: {
        color: '#FFF',
    }
});

export default BackgroundSoundScreen;
