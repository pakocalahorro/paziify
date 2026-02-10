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
    ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen, RootStackParamList } from '../../types';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import { Soundscape } from '../../data/soundscapesData';
import SoundscapeCard from './components/SoundscapeCard';
import { soundscapesService } from '../../services/contentService';
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';
import BacklitSilhouette from '../../components/Shared/BacklitSilhouette';

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
    const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState('Todos');

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

    // Filtered list based on selection
    const filteredSoundscapes = useMemo(() => {
        if (selectedTag === 'Todos') return soundscapes;
        return soundscapes.filter(s =>
            s.recommendedFor && s.recommendedFor.some(tag =>
                tag.toLowerCase() === selectedTag.toLowerCase()
            )
        );
    }, [soundscapes, selectedTag]);

    const handlePress = (item: Soundscape) => {
        navigation.navigate(Screen.BACKGROUND_PLAYER, { soundscapeId: item.id });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Fila 1: Flecha + Titulo + Icono */}
            <View style={styles.headerRow1}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Espacio Sonoro</Text>
                </View>
                <View style={styles.silhouetteWrapper}>
                    <BacklitSilhouette size={80} iconName="musical-notes-outline" />
                </View>
            </View>

            {/* Fila 2: Filtro "Recomendaciones" */}
            <View style={styles.headerRow2}>
                <View style={styles.filterSectionTitle}>
                    <Ionicons name="sparkles-outline" size={14} color="#2DD4BF" style={{ marginRight: 8 }} />
                    <Text style={styles.filterLabel}>RECOMENDACIONES</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                >
                    {recommendationTags.map(tag => (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => setSelectedTag(tag)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedTag === tag ? 100 : 20}
                                tint="dark"
                                style={[
                                    styles.tagChip,
                                    selectedTag === tag && styles.tagChipActive
                                ]}
                            >
                                <Text style={[
                                    styles.tagText,
                                    selectedTag === tag && styles.tagTextActive
                                ]}>
                                    {tag}
                                </Text>
                            </BlurView>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Fila 3: Ondas de frecuencia */}
            <View style={styles.headerRow3}>
                <SoundwaveSeparator title="Elige tu ambiente..." />
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            <View style={StyleSheet.absoluteFill}>
                <BackgroundWrapper nebulaMode="healing" />
                <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'transparent', 'rgba(2, 6, 23, 0.8)', 'rgba(2, 6, 23, 1.0)']}
                    locations={[0, 0.4, 0.8, 0.98]}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <View style={styles.content}>
                {loading ? (
                    <>
                        {renderHeader()}
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#2DD4BF" />
                        </View>
                    </>
                ) : (
                    <FlatList
                        data={filteredSoundscapes}
                        ListHeaderComponent={renderHeader}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <SoundscapeCard item={item} onPress={handlePress} />
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={[
                            styles.listContent,
                            { paddingBottom: insets.bottom + 100 }
                        ]}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
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
    },
    headerRow1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
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
    }
});

export default BackgroundSoundScreen;
