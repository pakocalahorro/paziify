import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Animated,
    Dimensions,
    StatusBar,
    ImageBackground,
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
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Session } from '../../types';
import { theme } from '../../constants/theme';
import SessionCard from '../../components/SessionCard';
import SessionPreviewModal from '../../components/SessionPreviewModal';
import { MEDITATION_SESSIONS, MeditationSession } from '../../data/sessionsData';
import { IMAGES } from '../../constants/images';

type MeditationCatalogScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.MEDITATION_CATALOG
>;

interface Props {
    navigation: MeditationCatalogScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { label: 'Ansiedad', icon: 'water-outline', color: '#66DEFF' },
    { label: 'Despertar', icon: 'sunny-outline', color: '#FFA726' },
    { label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
    { label: 'Mindfulness', icon: 'leaf-outline', color: '#66BB6A' },
    { label: 'Resiliencia', icon: 'heart-outline', color: '#FF6B9D' },
];

const SESSION_ASSETS: Record<string, string> = {
    'ansiedad': IMAGES.SESSION_PEACE,
    'sueño': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'default': IMAGES.SESSION_PEACE,
};

const MeditationCatalogScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const convertToSession = (medSession: MeditationSession): Session => {
        const categoryKey = medSession.category.toLowerCase();
        return {
            id: medSession.id,
            title: medSession.title,
            duration: medSession.durationMinutes,
            category: medSession.category,
            isPlus: medSession.isPremium,
            image: SESSION_ASSETS[categoryKey] || SESSION_ASSETS['default'],
        };
    };

    const filteredSessions = useMemo(() => {
        return MEDITATION_SESSIONS.filter(session => {
            const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 0 ||
                session.category.toLowerCase() === CATEGORIES[selectedCategory].label.toLowerCase();
            return matchesSearch && matchesCategory;
        }).map(convertToSession);
    }, [searchQuery, selectedCategory]);

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
    };

    const renderHero = () => {
        if (selectedCategory !== 0 || searchQuery !== '') return null;
        const featured = MEDITATION_SESSIONS.slice(0, 3);

        return (
            <View style={styles.heroWrapper}>
                <Text style={styles.sectionTitle}>Sugerencias Vitales</Text>
                <FlatList
                    horizontal
                    data={featured}
                    keyExtractor={(item) => `hero-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.heroList}
                    snapToInterval={width * 0.85}
                    decelerationRate="fast"
                    renderItem={({ item }) => {
                        const asset = SESSION_ASSETS[item.category.toLowerCase()] || SESSION_ASSETS['default'];
                        return (
                            <TouchableOpacity
                                style={styles.heroCard}
                                onPress={() => handleSessionClick(convertToSession(item))}
                                activeOpacity={0.9}
                            >
                                <ImageBackground
                                    source={typeof asset === 'string' ? { uri: asset } : asset}
                                    style={styles.heroImage}
                                    imageStyle={{ borderRadius: 32 }}
                                >
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                                        style={styles.heroGradient}
                                    >
                                        <View style={styles.heroBadge}>
                                            <Ionicons name="sparkles" size={10} color="#FFF" />
                                            <Text style={styles.heroBadgeText}>OASIS</Text>
                                        </View>
                                        <Text style={styles.heroTitle}>{item.title}</Text>
                                        <View style={styles.heroMeta}>
                                            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                                            <Text style={styles.heroMetaText}>{item.durationMinutes} min</Text>
                                        </View>
                                    </LinearGradient>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            {/* 1. Header with Back and Title stays at the VERY TOP */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerLabel}>OASIS DE</Text>
                        <Text style={styles.headerTitle}>Calma</Text>
                    </View>

                    <View style={styles.silhouetteContainer}>
                        <Canvas style={styles.silhouetteCanvas}>
                            <Group>
                                <Circle cx={50} cy={50} r={40} color="rgba(45, 212, 191, 0.2)">
                                    <Blur blur={15} />
                                </Circle>
                            </Group>
                        </Canvas>
                        <Ionicons name="leaf-outline" size={32} color="rgba(45, 212, 191, 0.6)" />
                    </View>
                </View>

                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={18} color="rgba(255,255,255,0.4)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar paz..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* 2. Then the Hero/Suggestions section */}
            {renderHero()}

            {/* 3. Then Categories */}
            <View style={styles.categoryWrap}>
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(index)}
                            activeOpacity={0.7}
                        >
                            <BlurView
                                intensity={selectedCategory === index ? 100 : 20}
                                tint="dark"
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === index && { backgroundColor: item.color }
                                ]}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={16}
                                    color={selectedCategory === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)'}
                                />
                                <Text style={[
                                    styles.categoryLabel,
                                    selectedCategory === index && styles.categoryLabelActive
                                ]}>
                                    {item.label}
                                </Text>
                            </BlurView>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.listSeparator} />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Ambient Background */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['#050810', '#12142B', '#050810']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredSessions}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                        <View style={styles.sessionCardWrapper}>
                            <SessionCard
                                session={item}
                                onPress={handleSessionClick}
                                isPlusMember={userState.isPlusMember}
                            />
                        </View>
                    )}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                />
            </Animated.View>

            {selectedSession && (
                <SessionPreviewModal
                    isVisible={!!selectedSession}
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                    onStart={() => {
                        const medData = MEDITATION_SESSIONS.find(s => s.id === selectedSession.id);
                        setSelectedSession(null);
                        if (medData) {
                            navigation.navigate(Screen.TRANSITION_TUNNEL as any, { session: medData });
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    headerContent: {
        // No specific wrapper style needed
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#020617',
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
        color: '#2DD4BF',
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
    heroWrapper: {
        marginTop: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginLeft: 20,
        marginBottom: 16,
    },
    heroList: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    heroCard: {
        width: width * 0.8,
        height: 140,
        marginRight: 16,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
        top: 15,
        left: 15,
        backgroundColor: 'rgba(45, 212, 191, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 4,
    },
    heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    heroMetaText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '700',
    },
    categoryWrap: {
        marginBottom: 20,
    },
    categoryList: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        marginRight: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    categoryLabelActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    sessionCardWrapper: {
        marginBottom: 12,
    },
    listSeparator: {
        height: 10,
    },
});

export default MeditationCatalogScreen;
