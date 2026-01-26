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
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Session } from '../../types';
import { theme } from '../../constants/theme';
import SessionCard from '../../components/SessionCard';
import SessionPreviewModal from '../../components/SessionPreviewModal';
import { MEDITATION_SESSIONS, MeditationSession } from '../../data/sessionsData';

type MeditationCatalogScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.MEDITATION_CATALOG
>;

interface Props {
    navigation: MeditationCatalogScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
    { label: 'Todo', icon: 'apps-outline', color: '#646CFF' },
    { label: 'Ansiedad', icon: 'water-outline', color: '#66DEFF' },
    { label: 'Despertar', icon: 'sunny-outline', color: '#FFA726' },
    { label: 'Sueño', icon: 'moon-outline', color: '#9575CD' },
    { label: 'Mindfulness', icon: 'leaf-outline', color: '#66BB6A' },
    { label: 'Resiliencia', icon: 'heart-outline', color: '#FF6B9D' },
];

const SESSION_ASSETS: Record<string, any> = {
    'Ansiedad': require('../../assets/covers/med_anxiety.png'),
    'Sueño': require('../../assets/covers/med_sleep.png'),
    'Mindfulness': require('../../assets/covers/med_focus.png'),
    'Resiliencia': require('../../assets/covers/med_compassion.png'),
    'Despertar': require('../../assets/covers/med_focus.png'),
    'default': require('../../assets/covers/med_focus.png'),
};

const MeditationCatalogScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const convertToSession = (medSession: MeditationSession): Session => ({
        id: medSession.id,
        title: medSession.title,
        duration: medSession.durationMinutes,
        category: medSession.category.charAt(0).toUpperCase() + medSession.category.slice(1),
        isPlus: medSession.isPremium,
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=400',
    });

    const filteredSessions = useMemo(() => {
        let filtered = MEDITATION_SESSIONS;
        if (selectedCategory > 0) {
            const categoryName = CATEGORIES[selectedCategory].label.toLowerCase();
            filtered = filtered.filter(s => s.category === categoryName);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query)
            );
        }
        return filtered.map(convertToSession);
    }, [selectedCategory, searchQuery]);

    const handleSessionClick = (session: Session) => {
        const medSession = MEDITATION_SESSIONS.find(s => s.id === session.id);
        if (medSession) {
            setSelectedSession(medSession);
            setPreviewVisible(true);
        }
    };

    const handleStartSession = (session: MeditationSession) => {
        setPreviewVisible(false);
        if (session.isPremium && !userState.isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }
        navigation.navigate(Screen.TRANSITION_TUNNEL, { sessionId: session.id } as any);
    };

    const renderHero = () => {
        if (selectedCategory !== 0) return null;

        const featured = MEDITATION_SESSIONS.slice(0, 3);

        return (
            <View style={styles.heroWrapper}>
                <Text style={styles.sectionTitle}>Recomendado para hoy</Text>
                <FlatList
                    horizontal
                    data={featured}
                    keyExtractor={(item) => `hero-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.heroList}
                    snapToInterval={width * 0.75}
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.heroCard}
                            onPress={() => handleSessionClick(convertToSession(item))}
                            activeOpacity={0.9}
                        >
                            <ImageBackground
                                source={SESSION_ASSETS[item.category.charAt(0).toUpperCase() + item.category.slice(1)] || SESSION_ASSETS['default']}
                                style={styles.heroImage}
                                imageStyle={{ borderRadius: 24 }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.heroGradient}
                                >
                                    <View style={styles.heroBadge}>
                                        <Text style={styles.heroBadgeText}>POPULAR</Text>
                                    </View>
                                    <Text style={styles.heroTitle}>{item.title}</Text>
                                    <View style={styles.heroMeta}>
                                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                                        <Text style={styles.heroMetaText}>{item.durationMinutes} min</Text>
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
            {renderHero()}

            <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 0 ? 'Todas las Sesiones' : `Filtro: ${CATEGORIES[selectedCategory].label}`}
                </Text>

                <View style={styles.searchWrapper}>
                    <BlurView intensity={30} tint="dark" style={styles.searchBlur}>
                        <Ionicons name="search-outline" size={20} color="rgba(255,255,255,0.4)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="¿Qué buscas hoy?..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </BlurView>
                </View>

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
                <View style={[
                    styles.backgroundGlow,
                    {
                        backgroundColor: CATEGORIES[selectedCategory].color,
                        opacity: 0.08,
                    }
                ]} />
            </View>

            {/* Header */}
            <BlurView intensity={80} tint="dark" style={[styles.navHeader, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meditaciones</Text>
                <View style={{ width: 44 }} />
            </BlurView>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <Animated.FlatList
                    data={filteredSessions}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.sessionRow}
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

            <SessionPreviewModal
                isVisible={previewVisible}
                session={selectedSession}
                onClose={() => setPreviewVisible(false)}
                onStart={handleStartSession}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050810',
    },
    backgroundGlow: {
        position: 'absolute',
        top: -150,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        zIndex: 100,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    headerContent: {
        marginTop: 20,
    },
    heroWrapper: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    heroList: {
        paddingRight: 40,
    },
    heroCard: {
        width: width * 0.7,
        height: 180,
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
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
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
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
        gap: 6,
    },
    heroMetaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
    },
    filterSection: {
        marginBottom: 20,
    },
    searchWrapper: {
        marginBottom: 16,
    },
    searchBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    categoryList: {
        paddingBottom: 4,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 15,
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
    sessionRow: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sessionCardWrapper: {
        width: '48%',
    },
});

export default MeditationCatalogScreen;
