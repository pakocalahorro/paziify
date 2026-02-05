import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ImageBackground,
    StatusBar,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Audiobook, RealStory } from '../../types';
import { theme } from '../../constants/theme';
import { IMAGES } from '../../constants/images';
import { audiobooksService, storiesService } from '../../services/contentService';
import { useAudiobooks, useStories } from '../../hooks/useContent';
import GGAssistant from '../../components/GGAssistant';
import GuestBanner from '../../components/GuestBanner';
import NebulaBackground from '../../components/Sanctuary/NebulaBackground';
import SunriseBackground from '../../components/Sanctuary/SunriseBackground';
import { clearStorage } from '../../utils/storage';
import { FlatList } from 'react-native';

type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.HOME
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const route = useRoute<RouteProp<RootStackParamList, Screen.HOME>>();
    const { userState, exitGuestMode, isNightMode, setNightMode } = useApp();

    // Determine visual mode from route or default to healing/night context
    const visualMode = route.params?.mode || (isNightMode ? 'healing' : 'healing');

    // React Query Hooks
    const { data: allBooksData, isLoading: loadingBooks } = useAudiobooks();
    const { data: allStoriesData, isLoading: loadingStories } = useStories();

    const loadingSuggestions = loadingBooks || loadingStories;

    const { suggestedAudiobooks, suggestedStories } = useMemo(() => {
        if (!allBooksData || !allStoriesData) return { suggestedAudiobooks: [], suggestedStories: [] };

        const allBooks = allBooksData;
        const allStories = allStoriesData;

        // Filter logic based on visualMode
        // Healing: Anxiety, Sleep, Health
        // Growth: Career, Success, Relationships, Leadership
        const targetCategories = visualMode === 'healing'
            ? ['anxiety', 'sleep', 'health', 'wellness', 'stress', 'ansiedad', 'sueño', 'salud']
            : ['professional', 'growth', 'career', 'relationships', 'leadership', 'success', 'carrera', 'exito'];

        const filteredBooks = allBooks.filter(item =>
            targetCategories.some(cat => item.category.toLowerCase().includes(cat))
        ).slice(0, 5);

        const filteredStories = allStories.filter(item =>
            targetCategories.some(cat => item.category.toLowerCase().includes(cat))
        ).slice(0, 5);

        return {
            suggestedAudiobooks: filteredBooks.length > 0 ? filteredBooks : allBooks.slice(0, 5),
            suggestedStories: filteredStories.length > 0 ? filteredStories : allStories.slice(0, 5)
        };
    }, [allBooksData, allStoriesData, visualMode]);

    const handleStartSession = () => {
        navigation.navigate(Screen.TRANSITION_TUNNEL);
    };

    const handleRegisterClick = () => {
        exitGuestMode();
    };

    const handleClearStorage = async () => {
        Alert.alert('Limpiar Datos', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Limpiar',
                style: 'destructive',
                onPress: async () => {
                    await clearStorage();
                    if (Platform.OS === 'web') window.location.reload();
                },
            },
        ]);
    };

    const isRecovery = userState.hasMissedDay;
    const isDone = userState.isDailySessionDone;

    const assistantProps = useMemo(() => {
        if (isDone) return { title: 'Sesión Completada', message: 'Increíble trabajo hoy. Has fortalecido tu resiliencia.', type: 'default' as const };
        if (isRecovery) return { title: 'Prevención de Abandono', message: 'No pasa nada por perder un día. Lo importante es retomar hoy.', type: 'recovery' as const, actionLabel: 'Empezar 5 min' };
        if (isNightMode) return { title: 'Sugerencia Nocturna', message: 'Tu sistema nervioso está listo para desconectar.', type: 'night' as const, actionLabel: 'Empezar Sesión' };
        return { title: 'Informe Diario', message: `Hoy es tu ${userState.streak}º día consecutivo.`, type: 'default' as const, actionLabel: 'Empezar dosis diaria' };
    }, [isDone, isRecovery, isNightMode, userState.streak]);

    const renderSuggestions = () => {
        if (loadingSuggestions || (suggestedAudiobooks.length === 0 && suggestedStories.length === 0)) return null;

        return (
            <View style={styles.suggestionsContainer}>
                <Text style={styles.sectionTitle}>
                    {visualMode === 'healing' ? 'Sugerencias para Sanar' : 'Impulsa tu Crecimiento'}
                </Text>

                {/* Audiobooks Horizontal List */}
                {suggestedAudiobooks.length > 0 && (
                    <View style={styles.horizontalSection}>
                        <Text style={styles.subTitle}>Audiolibros Recomendados</Text>
                        <FlatList
                            horizontal
                            data={suggestedAudiobooks}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionCard}
                                    onPress={() => navigation.navigate(Screen.AUDIOBOOKS)}
                                >
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' }} // Placeholder
                                        style={styles.suggestionImage}
                                        imageStyle={{ borderRadius: 16 }}
                                    >
                                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.suggestionGradient}>
                                            <Text style={styles.suggestionTitle} numberOfLines={2}>{item.title}</Text>
                                            <Text style={styles.suggestionMeta}>{item.author}</Text>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {/* Stories Horizontal List */}
                {suggestedStories.length > 0 && (
                    <View style={styles.horizontalSection}>
                        <Text style={styles.subTitle}>Historias para ti</Text>
                        <FlatList
                            horizontal
                            data={suggestedStories}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionCard}
                                    onPress={() => navigation.navigate(Screen.STORY_DETAIL, { storyId: item.id })}
                                >
                                    <ImageBackground
                                        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }} // Placeholder
                                        style={styles.suggestionImage}
                                        imageStyle={{ borderRadius: 16 }}
                                    >
                                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.suggestionGradient}>
                                            <Text style={styles.suggestionTitle} numberOfLines={2}>{item.title}</Text>
                                            <Text style={styles.suggestionMeta}>{item.subtitle}</Text>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={StyleSheet.absoluteFill}>
                {isNightMode ? (
                    <NebulaBackground mode={visualMode as 'healing' | 'growth'} />
                ) : (
                    <SunriseBackground />
                )}
            </View>
            <StatusBar barStyle="light-content" translucent={true} />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {userState.isGuest && (
                    <GuestBanner onPressRegister={handleRegisterClick} />
                )}

                {/* Header Redesigned */}
                <View style={styles.header}>
                    <View style={styles.profileContainer}>
                        <View style={styles.avatarContainer}>
                            {userState.avatarUrl ? (
                                <Image source={{ uri: userState.avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitial}>{userState.name.charAt(0)}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.welcomeTextContainer}>
                            <Text style={styles.welcomeLabel}>
                                {isNightMode ? 'Buenas noches' : 'Bienvenido de nuevo'}
                            </Text>
                            <Text style={styles.userName} numberOfLines={1} adjustsFontSizeToFit>
                                {userState.name}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {isNightMode && !isDone && !isRecovery ? (
                    <View style={styles.nightView}>
                        <Text style={styles.nightSubtitle}>Tu sistema nervioso está listo para desconectar.</Text>
                        <BlurView intensity={30} tint="dark" style={styles.nightMainCard}>
                            <View style={styles.nightAsssitantHeader}>
                                <View style={styles.assistantAvatar}><Ionicons name="desktop-outline" size={16} color="#FFF" /></View>
                                <View style={styles.assistantTitleBlock}>
                                    <Text style={styles.assistantName}>G.G. Sugiere</Text>
                                    <Text style={styles.assistantContext}>Basado en tu actividad beta</Text>
                                </View>
                            </View>
                            <ImageBackground source={{ uri: IMAGES.DAY }} style={styles.nightHeroImage} imageStyle={{ borderRadius: 16 }}>
                                <View style={styles.audioBadge}><Ionicons name="headset" size={14} color="#FFF" /><Text style={styles.audioBadgeText}>Audio Guiado</Text></View>
                            </ImageBackground>
                            <Text style={styles.nightLessonTitle}>Sesión Interoceptiva</Text>
                            <TouchableOpacity style={styles.nightActionBtn} onPress={handleStartSession}>
                                <Ionicons name="play-circle" size={24} color="#FFF" /><Text style={styles.nightActionBtnText}>¿Empezamos?</Text>
                            </TouchableOpacity>
                        </BlurView>

                        {/* Night Mode Suggestions */}
                        {renderSuggestions()}
                    </View>
                ) : isDone ? (
                    <View style={styles.doneView}>
                        <View style={styles.doneBtn}><Ionicons name="checkmark-circle" size={22} color="#FFF" /><Text style={styles.doneBtnText}>Sesión Completada</Text></View>

                        {/* Zenith Progress Mosaic */}
                        <View style={styles.zenithCard}>
                            <Text style={styles.zenithTitle}>TU ESTADO ZEN HOY</Text>
                            <View style={styles.mosaicContainer}>
                                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                    <View key={d} style={[styles.mosaicTile, d <= userState.streak % 8 && styles.activeTile]} />
                                ))}
                            </View>
                            <Text style={styles.zenithStats}>Has liberado 150mg de cortisol hoy ✨</Text>
                        </View>

                        <View style={styles.doneCard}>
                            <Ionicons name="sparkles" size={24} color={theme.colors.primary} style={{ marginBottom: 12 }} />
                            <Text style={styles.doneQuote}>"El silencio no es la ausencia de sonido, sino la ausencia de ruido en tu mente."</Text>
                            <Text style={styles.author}>— Maestro Zen</Text>
                        </View>
                    </View>
                ) : isRecovery ? (
                    <View style={styles.recoveryView}>
                        <View style={styles.recoveryCard}>
                            <Text style={styles.recoveryMainMsg}>No pasa nada por perder un día. Lo importante es retomar hoy.</Text>
                            <TouchableOpacity style={styles.recoveryActionRow} onPress={handleStartSession}>
                                <Text style={styles.recoveryActionTxt}>Retomar ahora</Text><Ionicons name="arrow-forward" size={16} color="#F97316" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.defaultView}>
                        <GGAssistant title={assistantProps.title} message={assistantProps.message} type={assistantProps.type} actionLabel={assistantProps.actionLabel} onAction={handleStartSession} />

                        <TouchableOpacity style={styles.heroActionCard} onPress={handleStartSession}>
                            <ImageBackground source={{ uri: IMAGES.DAY }} style={styles.heroImg} imageStyle={{ borderRadius: 24 }}>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
                                    <Text style={styles.heroTitle}>Iniciar Sesión Diaria</Text>
                                    <Text style={styles.heroSubtitle}>10 min • Enfoque y Claridad</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>

                        {/* Suggestions Section */}
                        {renderSuggestions()}
                    </View>
                )}

                {/* Dev Panel */}
                <View style={styles.devBar}>
                    <TouchableOpacity style={styles.devTab} onPress={() => setNightMode(!isNightMode)}><Text style={styles.devTabText}>NOCHE</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.devTab} onPress={() => handleClearStorage()}><Text style={styles.devTabText}>RESET</Text></TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    scrollView: { flex: 1 },
    content: { padding: 20, paddingBottom: 120 },

    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1, // Allow text to take remaining space
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    avatarInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    welcomeTextContainer: {
        flex: 1,
    },
    welcomeLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
        marginBottom: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    nightView: {},
    nightSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontWeight: '500' },
    nightMainCard: { borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 25, overflow: 'hidden' },
    nightAsssitantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    assistantAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#5850EC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    assistantTitleBlock: { flex: 1 },
    assistantName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
    assistantContext: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
    nightHeroImage: { height: 160, marginBottom: 20, padding: 15, justifyContent: 'flex-end' },
    audioBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    audioBadgeText: { fontSize: 11, color: '#FFF', fontWeight: '700' },
    nightLessonTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 12 },
    nightActionBtn: { backgroundColor: '#5850EC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, gap: 10, marginBottom: 15 },
    nightActionBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },

    doneView: { gap: 20 },
    doneBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 10, marginBottom: 5 },
    doneBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    doneCard: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    doneQuote: { fontSize: 18, fontWeight: '400', color: '#FFF', fontStyle: 'italic', marginBottom: 8, lineHeight: 28, opacity: 0.9 },
    author: { fontSize: 12, color: theme.colors.primary, fontWeight: '800', letterSpacing: 1 },

    zenithCard: { backgroundColor: 'rgba(45, 212, 191, 0.05)', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: 'rgba(45, 212, 191, 0.1)' },
    zenithTitle: { fontSize: 11, fontWeight: '800', color: theme.colors.primary, letterSpacing: 2, marginBottom: 15 },
    mosaicContainer: { flexDirection: 'row', gap: 8, marginBottom: 15 },
    mosaicTile: { width: 35, height: 35, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
    activeTile: { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOpacity: 0.5, shadowRadius: 10 },
    zenithStats: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },

    recoveryView: {},
    recoveryCard: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 22, borderLeftWidth: 4, borderLeftColor: '#F97316', marginBottom: 25 },
    recoveryMainMsg: { fontSize: 17, color: '#FFF', lineHeight: 24, marginBottom: 15, fontWeight: '500' },
    recoveryActionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    recoveryActionTxt: { fontSize: 14, color: '#F97316', fontWeight: '700' },

    defaultView: {},
    heroActionCard: { height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 20 },
    heroImg: { flex: 1 },
    heroGradient: { flex: 1, justifyContent: 'flex-end', padding: 20 },
    heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
    heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

    devBar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 50, opacity: 0.8 },
    devTab: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
    devTabText: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },

    suggestionsContainer: { marginTop: 10, gap: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 5 },
    horizontalSection: { gap: 12 },
    subTitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 1 },
    horizontalList: { paddingRight: 20 },
    suggestionCard: { width: 160, height: 200, marginRight: 15, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1E29' },
    suggestionImage: { width: '100%', height: '100%' },
    suggestionGradient: { flex: 1, justifyContent: 'flex-end', padding: 12 },
    suggestionTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    suggestionMeta: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});

export default HomeScreen;
