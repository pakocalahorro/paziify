import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
    Dimensions,
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
import SoundwaveSeparator from '../../components/Shared/SoundwaveSeparator';
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisHeader } from '../../components/Oasis/OasisHeader';

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
    const { userState } = useApp();
    const insets = useSafeAreaInsets();

    // Animations
    const scrollX = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const carouselData = useMemo(() => {
        return [{ id: 'empty-left' }, ...CATEGORIES, { id: 'empty-right' }];
    }, []);

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
        <OasisScreen
            header={
                <OasisHeader
                    path={['Oasis']}
                    title="Biblioteca"
                    onBack={() => navigation.goBack()}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate(Screen.HOME as any);
                    }}
                    userName={userState.name || 'Pazificador'}
                    avatarUrl={userState.avatarUrl}
                    showEvolucion={true}
                    onEvolucionPress={() => navigation.navigate(Screen.EVOLUTION_CATALOG as any)}
                    onProfilePress={() => navigation.navigate(Screen.PROFILE as any)}
                />
            }
            themeMode="healing"
            showSafeOverlay={false}
            disableContentPadding={true}
        >
            <StatusBar barStyle="light-content" />


            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <View style={styles.carouselContainer}>
                    <SoundwaveSeparator title="Tu Santuario" accentColor="#2DD4BF" />

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
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    searchToggleBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
