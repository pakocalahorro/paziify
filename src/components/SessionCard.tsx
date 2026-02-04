import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Session } from '../types';
import { theme } from '../constants/theme';
import { IMAGES } from '../constants/images';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = 180; // Approximate height + margin



const SESSION_ASSETS: Record<string, any> = {
    'ansiedad': IMAGES.SESSION_PEACE,
    'sueño': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'default': IMAGES.SESSION_PEACE,
};

interface SessionCardProps {
    session: Session;
    onPress: (session: Session) => void;
    onFavoritePress?: (session: Session) => void;
    isPlusMember: boolean;
    isFavorite?: boolean;
    isCompleted?: boolean;
    scrollY?: Animated.Value;
    index?: number;
}

const SessionCard: React.FC<SessionCardProps & { variant?: 'overlay' | 'standard' | 'poster' | 'wide' }> = ({
    session,
    onPress,
    onFavoritePress,
    isPlusMember,
    isFavorite = false,
    isCompleted = false,
    scrollY,
    index,
    variant = 'overlay'
}) => {
    const isLocked = session.isPlus && !isPlusMember;
    const catKey = session.category.toLowerCase();
    const fallbackImage = SESSION_ASSETS[catKey] || SESSION_ASSETS['default'];
    const imageSource = session.thumbnailUrl ? { uri: session.thumbnailUrl } : (typeof fallbackImage === 'string' ? { uri: fallbackImage } : fallbackImage);

    const getCategoryDetails = (category: string) => {
        const cat = category.toLowerCase();
        if (cat === 'ansiedad' || cat === 'calma sos') {
            return { icon: 'water-outline', color: '#66DEFF', gradient: ['rgba(102, 222, 255, 0.2)', 'rgba(0, 188, 212, 0.4)'] };
        }
        switch (cat) {
            case 'sueño':
                return { icon: 'moon-outline', color: '#9575CD', gradient: ['rgba(149, 117, 205, 0.2)', 'rgba(103, 58, 183, 0.4)'] };
            case 'mindfulness':
                return { icon: 'leaf-outline', color: '#66BB6A', gradient: ['rgba(102, 187, 106, 0.2)', 'rgba(67, 160, 71, 0.4)'] };
            case 'resiliencia':
                return { icon: 'heart-outline', color: '#FF6B9D', gradient: ['rgba(255, 107, 157, 0.2)', 'rgba(196, 69, 105, 0.4)'] };
            case 'despertar':
                return { icon: 'sunny-outline', color: '#FFA726', gradient: ['rgba(255, 167, 38, 0.2)', 'rgba(251, 140, 0, 0.4)'] };
            default:
                return { icon: 'medkit-outline', color: '#646CFF', gradient: ['rgba(100, 108, 255, 0.2)', 'rgba(79, 86, 217, 0.4)'] };
        }
    };

    const { icon, color, gradient } = getCategoryDetails(session.category);

    // --- WIDE VARIANT (Minimalist Horizontal) ---
    if (variant === 'wide') {
        const WIDE_WIDTH = width * 0.90;
        const IMAGE_SIZE = 100;

        return (
            <TouchableOpacity
                style={{
                    width: WIDE_WIDTH,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.05)', // Subtle background
                    borderRadius: 16,
                    padding: 10,
                    alignItems: 'center'
                }}
                onPress={() => onPress(session)}
                activeOpacity={0.9}
            >
                {/* Square Image */}
                <Image
                    source={imageSource}
                    style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 12 }}
                    resizeMode="cover"
                />

                {/* Locked Badge (Mini) */}
                {isLocked && (
                    <View style={{ position: 'absolute', top: 16, left: 16 }}>
                        <View style={[styles.lockBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                            <Ionicons name="lock-closed" size={10} color="#F87171" style={{ marginRight: 2 }} />
                        </View>
                    </View>
                )}

                {/* Content */}
                <View style={{ flex: 1, marginLeft: 14, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginRight: 6 }} />
                        <Text style={{ fontSize: 11, color: color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {session.category}
                        </Text>
                    </View>

                    <Text
                        style={{ fontSize: 17, fontWeight: '700', color: '#FFF', marginBottom: 4 }}
                        numberOfLines={1}
                    >
                        {session.title}
                    </Text>

                    <Text
                        style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, lineHeight: 18 }}
                        numberOfLines={2}
                    >
                        {session.description || 'Una sesión perfecta para encontrar equilibrio y calma en tu día.'}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.5)" style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                            {session.duration} min
                        </Text>
                    </View>
                </View>

                {/* Play Icon */}
                <View style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <Ionicons name="play" size={16} color="#FFF" style={{ marginLeft: 2 }} />
                </View>

            </TouchableOpacity>
        );
    }

    // --- POSTER VARIANT (Cinematic Vertical 2:3) ---
    if (variant === 'poster') {
        // Fit exactly 3 items within container (W-24) with internal pad (12) + margins (8*3)
        // (Width - 26 (container) - 24 (pads) - 16 (internal gaps)) = W - 66.
        // Using W - 68 for safety.
        const POSTER_WIDTH = (width - 68) / 3;
        const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // 2:3 Aspect Ratio

        return (
            <TouchableOpacity
                style={{ width: POSTER_WIDTH, marginRight: 8, height: POSTER_HEIGHT, borderRadius: 12, overflow: 'hidden' }}
                onPress={() => onPress(session)}
                activeOpacity={0.9}
            >
                <Image
                    source={imageSource}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                />

                {/* Gradient Overlay for Text Readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={[StyleSheet.absoluteFill, { top: '40%' }]}
                />

                {/* Top Badges */}
                <View style={{ position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {isLocked && (
                        <View style={[styles.lockBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                            <Ionicons name="lock-closed" size={10} color="#F87171" style={{ marginRight: 2 }} />
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#F87171' }}>PLUS</Text>
                        </View>
                    )}
                </View>

                {/* Bottom Content */}
                <View style={{ position: 'absolute', bottom: 12, left: 8, right: 8 }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
                        numberOfLines={2}
                    >
                        {session.title}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="time" size={12} color="rgba(255,255,255,0.8)" />
                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                                {session.duration}m
                            </Text>
                        </View>

                        {/* Tiny Play Button */}
                        <View style={{
                            width: 24, height: 24, borderRadius: 12,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            justifyContent: 'center', alignItems: 'center',
                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)'
                        }}>
                            <Ionicons name="play" size={10} color="#FFF" style={{ marginLeft: 1 }} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // --- STANDARD VARIANT (Netflix-style Episode) ---
    if (variant === 'standard') {
        const CARD_WIDTH = width * 0.7; // Fixed width for horizontal scrolling
        const IMAGE_HEIGHT = CARD_WIDTH * 0.5625; // 16:9

        return (
            <TouchableOpacity
                style={{ width: CARD_WIDTH, marginBottom: 8 }}
                onPress={() => onPress(session)}
                activeOpacity={0.9}
            >
                {/* Image Container */}
                <View style={{
                    height: IMAGE_HEIGHT,
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginBottom: 10,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    position: 'relative'
                }}>
                    <Animated.Image
                        source={imageSource}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                    />

                    {/* Duration Badge (Overlay on Image) */}
                    <View style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3
                    }}>
                        <Ionicons name="time" size={10} color="#FFF" />
                        <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '700' }}>
                            {session.duration}m
                        </Text>
                    </View>

                    {/* Locked/Free Badge (Top Left) */}
                    <View style={{ position: 'absolute', top: 8, left: 8 }}>
                        {isLocked ? (
                            <View style={[styles.lockBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                                <Ionicons name="lock-closed" size={10} color="#F87171" style={{ marginRight: 2 }} />
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#F87171' }}>PLUS</Text>
                            </View>
                        ) : (
                            // Optional: Free badge or nothing
                            null
                        )}
                    </View>

                    {/* Play Overlay (Centered) */}
                    <View style={[
                        StyleSheet.absoluteFill,
                        { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }
                    ]}>
                        <View style={{
                            width: 32, height: 32, borderRadius: 16,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            justifyContent: 'center', alignItems: 'center',
                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
                        }}>
                            <Ionicons name="play" size={14} color="#FFF" style={{ marginLeft: 2 }} />
                        </View>
                    </View>
                </View>

                {/* Info Container */}
                <View style={{ paddingHorizontal: 4 }}>
                    <Text
                        style={{ fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 4, lineHeight: 20 }}
                        numberOfLines={1}
                    >
                        {session.title}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                            {session.creatorName || 'Paziify'}
                        </Text>

                        {/* Actions Row */}
                        <TouchableOpacity onPress={() => onFavoritePress?.(session)}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={16}
                                color={isFavorite ? "#FF6B6B" : "rgba(255,255,255,0.3)"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    // --- OVERLAY VARIANT (Original) ---
    // Default opacity if no animation props
    let imageOpacity: any = 0.35;

    if (scrollY && typeof index === 'number') {

        const HEADER_HEIGHT = 450;
        const itemCenter = HEADER_HEIGHT + (ITEM_SIZE * index) + (ITEM_SIZE / 2);
        const screenCenter = SCREEN_HEIGHT / 2;
        const targetScrollY = itemCenter - screenCenter;

        const range = [
            targetScrollY - 250,
            targetScrollY,
            targetScrollY + 250
        ];

        imageOpacity = scrollY.interpolate({
            inputRange: range,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp'
        });
    } else {
        imageOpacity = 0.6;
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(session)}
            activeOpacity={0.9}
        >
            <BlurView intensity={60} tint="dark" style={styles.glassContainer}>
                <View style={styles.mainContent}>
                    <Animated.Image
                        source={imageSource}
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: imageOpacity }
                        ]}
                        resizeMode="cover"
                    />
                    {/* Category indicator line */}
                    <LinearGradient
                        colors={gradient as any}
                        style={styles.categoryLine}
                    />

                    <View style={styles.cardBody}>
                        <View style={styles.header}>
                            <View style={styles.categoryBadge}>
                                <Ionicons name={icon as any} size={14} color={color} />
                                <Text style={[styles.categoryText, { color }]}>{session.category.toUpperCase()}</Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                                <Text style={styles.durationText}>{session.duration} min</Text>
                            </View>
                        </View>

                        <Text style={styles.title} numberOfLines={2}>{session.title}</Text>

                        <View style={styles.guideContainer}>
                            <View style={styles.guideRow}>
                                <Ionicons name="sparkles-outline" size={12} color="rgba(255,255,255,0.4)" />
                                <Text style={styles.guideText}>
                                    {session.creatorName || 'Guía Paziify'}
                                </Text>
                            </View>
                            {isCompleted && (
                                <View style={styles.completedBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color="#2DD4BF" />
                                    <Text style={styles.completedText}>LISTO</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.footerLeft}>
                                <TouchableOpacity
                                    onPress={(e) => {
                                        onPress(session);
                                    }}
                                    style={[styles.playButton, { backgroundColor: `${color}20` }]}
                                >
                                    <Ionicons name="play" size={14} color={color} style={{ marginLeft: 2 }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onFavoritePress?.(session)}
                                    style={styles.favoriteButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={isFavorite ? "heart" : "heart-outline"}
                                        size={24}
                                        color={isFavorite ? "#FF6B6B" : "rgba(255,255,255,0.3)"}
                                    />
                                </TouchableOpacity>
                                {isLocked ? (
                                    <View style={styles.lockBadge}>
                                        <Ionicons name="lock-closed" size={10} color={theme.colors.accent} />
                                        <Text style={styles.lockText}>PLUS</Text>
                                    </View>
                                ) : (
                                    <View style={styles.freeBadge}>
                                        <Text style={styles.freeText}>GRATIS</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.chevronContainer}>
                                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
                            </View>
                        </View>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    glassContainer: {
        paddingVertical: 0,
    },
    mainContent: {
        flexDirection: 'row',
        height: 100, // Fixed height as requested
    },
    categoryLine: {
        width: 4,
        height: '100%',
    },
    cardBody: {
        flex: 1,
        paddingHorizontal: 12, // More compact
        paddingVertical: 8, // More compact
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 4,
    },
    categoryText: {
        fontSize: 9, // Smaller font
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    durationText: {
        fontSize: 10,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    title: {
        fontSize: 16, // Reduced title size
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
        lineHeight: 20, // Tighter line height
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    playButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lockText: {
        fontSize: 8,
        fontWeight: '900',
        color: theme.colors.accent,
    },
    freeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    freeText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    chevronContainer: {
        justifyContent: 'center',
        paddingRight: 2,
    },
    guideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    guideRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        opacity: 0.7,
    },
    guideText: {
        fontSize: 11, // Smaller guide text
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    favoriteButton: {
        padding: 2,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    completedText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#2DD4BF',
        letterSpacing: 0.5,
    },
});

export default SessionCard;
