import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { SESSION_ASSETS, IMAGES } from '../../constants/images';
import { useSessionDetail } from '../../hooks/useContent';
import { adaptSession } from '../../services/contentService';
import { useApp } from '../../context/AppContext';
import { getGuideAvatar } from '../../constants/guides';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.45;
const AnimatedImage = Animated.createAnimatedComponent(Image);

type SessionDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.SESSION_DETAIL
>;

type SessionDetailScreenRouteProp = RouteProp<RootStackParamList, Screen.SESSION_DETAIL>;

interface Props {
    navigation: SessionDetailScreenNavigationProp;
    route: SessionDetailScreenRouteProp;
}

const SessionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { sessionId } = route.params;
    const scrollY = useSharedValue(0);

    const { data: rawSession, isLoading } = useSessionDetail(sessionId);

    const session = useMemo(() => {
        // [ZERO EGRESS] Prioritize data passed via navigation (Prop-Passing Pattern)
        if (route.params.sessionData) {
            console.log('[SESSION_DETAIL] Using navigation sessionData (Zero Egress)');
            return adaptSession(route.params.sessionData);
        }
        if (!rawSession) return null;
        return adaptSession(rawSession);
    }, [rawSession, route.params.sessionData]);

    const { closePlayer } = useAudioPlayer();

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Vanguard Heartbeat Animation
    const heartScale = useSharedValue(1);
    React.useEffect(() => {
        heartScale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 600, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) }),
                withTiming(1, { duration: 1200 }),
            ),
            -1,
            false
        );
    }, []);

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const headerImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [2, 1, 1],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    });

    const getImpactBadges = (benefits: string) => {
        const badges: { name: string; icon: string; color: string; effect: string }[] = [];
        if (!benefits) return badges;
        const text = benefits.toLowerCase();

        if (text.includes('cortisol') || text.includes('estrés') || text.includes('calma')) {
            badges.push({ name: 'Cortisol', icon: 'shield-check-outline', color: '#66DEFF', effect: '↓' });
        }
        if (text.includes('dopamina') || text.includes('felicidad') || text.includes('ánimo')) {
            badges.push({ name: 'Dopamina', icon: 'lightning-bolt-outline', color: '#FCD34D', effect: '↑' });
        }
        if (text.includes('ritmo cardíaco') || text.includes('corazón') || text.includes('cardio')) {
            badges.push({ name: 'Coherencia', icon: 'heart-pulse', color: '#FF6B9D', effect: 'Sinc' });
        }
        if (text.includes('neocórtex') || text.includes('enfoque') || text.includes('cerebro')) {
            badges.push({ name: 'Foco Alpha', icon: 'brain', color: '#9575CD', effect: '↑' });
        }

        return badges;
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!session) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: '#FFF' }}>Sesión no encontrada</Text>
            </View>
        );
    }

    const impactBadges = getImpactBadges(session.scientificBenefits);
    const catKey = (session.category || 'default').toLowerCase();
    const fallbackImage = (SESSION_ASSETS as any)[catKey] || (SESSION_ASSETS as any)['default'];
    const bgImage = session.thumbnailUrl
        ? { uri: session.thumbnailUrl }
        : (typeof fallbackImage === 'string' ? { uri: fallbackImage } : fallbackImage);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Animated.View
                {...({ sharedTransitionTag: `session.image.${sessionId}` } as any)}
                style={[styles.parallaxImage, headerImageStyle]}
            >
                <Image
                    source={bgImage as any}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                    transition={1000}
                    cachePolicy="memory-disk"
                />
            </Animated.View>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)', '#020617']}
                style={StyleSheet.absoluteFill}
            />

            {/* Float Back Button */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 180 }]}
            >
                <View style={{ height: HEADER_HEIGHT - 60 }} />

                <View style={styles.glassContainer}>
                    <BlurView intensity={40} tint="dark" style={styles.glassBlur}>
                        <View style={[styles.categoryBadge, { backgroundColor: `${session.color || '#2DD4BF'}30` }]}>
                            <Text style={[styles.categoryText, { color: session.color || '#2DD4BF' }]}>
                                {session.category.toUpperCase()}
                            </Text>
                        </View>

                        <Text style={styles.title}>{session.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color="#2DD4BF" />
                                <Text style={styles.metaText}>{session.durationMinutes} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="fitness-outline" size={16} color="#FCD34D" />
                                <Text style={styles.metaText}>{session.difficultyLevel || 'Universal'}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>{session.description}</Text>

                        {/* Rhythm Section */}
                        <View style={styles.infoSection}>
                            <Text style={styles.infoSectionTitle}>RITMO DE RESPIRACIÓN</Text>
                            <View style={styles.rhythmRow}>
                                <View style={styles.rhythmItem}>
                                    <Ionicons name="arrow-up-circle-outline" size={16} color={session.color || '#2DD4BF'} />
                                    <Text style={styles.rhythmValue}>{session.breathingPattern.inhale}s</Text>
                                    <Text style={styles.rhythmLabel}>Inhala</Text>
                                </View>
                                {session.breathingPattern.hold > 0 && (
                                    <View style={styles.rhythmItem}>
                                        <Ionicons name="pause-circle-outline" size={16} color={session.color || '#2DD4BF'} />
                                        <Text style={styles.rhythmValue}>{session.breathingPattern.hold}s</Text>
                                        <Text style={styles.rhythmLabel}>Mantén</Text>
                                    </View>
                                )}
                                <View style={styles.rhythmItem}>
                                    <Ionicons name="arrow-down-circle-outline" size={16} color={session.color || '#2DD4BF'} />
                                    <Text style={styles.rhythmValue}>{session.breathingPattern.exhale}s</Text>
                                    <Text style={styles.rhythmLabel}>Exhala</Text>
                                </View>
                            </View>
                        </View>

                        {/* Impact Section */}
                        <View style={styles.infoSection}>
                            <Text style={styles.infoSectionTitle}>IMPACTO NEUROCIENTÍFICO</Text>
                            <View style={styles.badgeRow}>
                                {impactBadges.map((badge, idx) => (
                                    <View key={idx} style={[styles.impactBadge, { borderColor: `${badge.color}40` }]}>
                                        <Text style={[styles.badgeEffect, { color: badge.color }]}>{badge.effect}</Text>
                                        <MaterialCommunityIcons name={badge.icon as any} size={16} color={badge.color} />
                                        <Text style={styles.badgeLabel}>{badge.name}</Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.infoText}>{session.scientificBenefits}</Text>
                        </View>

                        {/* Preparation */}
                        <View style={[styles.infoSection, { marginBottom: 10 }]}>
                            <Text style={styles.infoSectionTitle}>PREPARACIÓN</Text>
                            <View style={styles.instructionBox}>
                                <MaterialCommunityIcons name="meditation" size={18} color="#2DD4BF" />
                                <Text style={styles.instructionText}>
                                    {session.practiceInstruction}
                                </Text>
                            </View>
                        </View>

                        {/* Guide Info */}
                        <View style={styles.creatorCard}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                                style={styles.creatorGradient}
                            />
                            <View style={styles.creatorHeader}>
                                <View style={styles.creatorAvatar}>
                                    <LinearGradient
                                        colors={[session.color || '#2DD4BF', '#000']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    {getGuideAvatar(session.creatorName) ? (
                                        <Image
                                            source={{ uri: getGuideAvatar(session.creatorName) }}
                                            style={StyleSheet.absoluteFill}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                    ) : (
                                        <Ionicons name="person" size={24} color="#FFF" />
                                    )}
                                </View>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <Text style={styles.creatorName}>{session.creatorName || 'Guía Paziify'}</Text>
                                    <Text
                                        style={[styles.creatorCredentials, { color: session.color || '#2DD4BF' }]}
                                        numberOfLines={2}
                                    >
                                        {(session.creatorCredentials || 'Especialista en Mindfulness').toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </View>
            </Animated.ScrollView>

            {/* Footer Action */}
            <View style={[styles.footerAction, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {/* Pre-Session Scan */}
                    <TouchableOpacity
                        style={styles.preScanBtn}
                        onPress={() => navigation.navigate(Screen.CARDIO_SCAN, {
                            context: 'baseline',
                            sessionData: session
                        })}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }, heartStyle]}>
                            <Ionicons name="heart-circle" size={22} color="#FF4B4B" />
                            <Text style={styles.preScanBtnText}>Escanear</Text>
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Start Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.startBtn}
                        onPress={async () => {
                            await closePlayer();
                            navigation.navigate(Screen.BREATHING_TIMER, {
                                sessionId: session.id,
                                sessionData: route.params.sessionData || rawSession || session
                            });
                        }}
                    >
                        <Text style={styles.startBtnText}>Comenzar</Text>
                        <Ionicons name="play" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    parallaxImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    glassContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    glassBlur: {
        padding: 24,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 16,
    },
    categoryText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 11,
        letterSpacing: 2,
    },
    title: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 40,
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 22,
        marginBottom: 24,
        fontWeight: '500',
    },
    infoSection: {
        marginBottom: 24,
    },
    infoSectionTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    rhythmRow: {
        flexDirection: 'row',
        gap: 12,
    },
    rhythmItem: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    rhythmValue: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 18,
        color: '#FFF',
        marginTop: 4,
    },
    rhythmLabel: {
        fontFamily: 'Outfit_900Black',
        fontSize: 9,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 1,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    impactBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        gap: 6,
    },
    badgeEffect: {
        fontSize: 12,
        fontWeight: '900',
    },
    badgeLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: 22,
    },
    instructionBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(45, 212, 191, 0.06)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.12)',
        gap: 12,
        alignItems: 'center',
    },
    instructionText: {
        flex: 1,
        fontSize: 14,
        color: '#2DD4BF',
        fontWeight: '700',
        lineHeight: 20,
    },
    creatorCard: {
        padding: 20,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    creatorGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    creatorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    creatorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    creatorName: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    creatorCredentials: {
        fontFamily: 'Outfit_900Black',
        fontSize: 10,
        letterSpacing: 1.5,
        marginTop: 4,
    },
    footerAction: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#020617',
        paddingTop: 15,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    startBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(45, 212, 191, 0.25)',
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
    },
    preScanBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 75, 75, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 75, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    preScanBtnText: {
        color: '#FF4B4B',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default SessionDetailScreen;
