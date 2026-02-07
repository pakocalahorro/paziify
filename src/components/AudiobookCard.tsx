import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Audiobook } from '../types';
import { theme } from '../constants/theme';

interface AudiobookCardProps {
    audiobook: Audiobook;
    onPress: (audiobook: Audiobook) => void;
    isPlusMember: boolean;
    scrollY?: Animated.Value;
    index?: number;
    isLargeCard?: boolean; // New prop for carousel mode
    guide?: { name: string; avatar: string; };
}

const { width } = Dimensions.get('window');
// Card dimensions for Large Mode
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 1.5; // Aspect ratio for poster

const BOOK_COVERS: Record<string, any> = {
    'Meditations': 'https://images.unsplash.com/photo-1506126613408-eca67ad4844a?w=400&q=80',
    'The Conquest of Fear': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    'Little Women': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    'As a Man Thinketh': 'https://images.unsplash.com/photo-1454165833744-96e6cf582bb1?w=400&q=80',
    'anxiety': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    'health': 'https://images.unsplash.com/photo-1506126613408-eca67ad4844a?w=400&q=80',
    'growth': 'https://images.unsplash.com/photo-1499728603263-137cb7ab3e1f?w=400&q=80',
    'professional': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
};

const AudiobookCard: React.FC<AudiobookCardProps> = ({
    audiobook,
    onPress,
    isPlusMember,
    scrollY,
    index,
    isLargeCard = false,
    guide,
}) => {
    const isLocked = audiobook.is_premium && !isPlusMember;

    const getCategoryDetails = (category: string) => {
        switch (category) {
            case 'growth': return { color: '#646CFF', icon: 'leaf-outline' };
            case 'professional': return { color: '#4FC3F7', icon: 'briefcase-outline' };
            case 'anxiety': return { color: '#FFA726', icon: 'frown-outline' };
            case 'health': return { color: '#66BB6A', icon: 'fitness-outline' };
            case 'sleep': return { color: '#9575CD', icon: 'moon-outline' };
            default: return { color: '#646CFF', icon: 'book-outline' };
        }
    };

    const { color, icon } = getCategoryDetails(audiobook.category);
    const coverSource = audiobook.image_url || BOOK_COVERS[audiobook.title] || BOOK_COVERS[audiobook.category] || require('../assets/covers/growth.png');

    const formatDuration = (minutes?: number): string => {
        if (!minutes) return 'Audio';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    // --- LARGE CARD RENDER (Vertical Poster) ---
    if (isLargeCard) {
        return (
            <TouchableOpacity
                onPress={() => onPress(audiobook)}
                activeOpacity={0.9}
                style={styles.largeContainer}
            >
                {/* Main Card Image */}
                <View style={[styles.largeImageWrapper, { borderColor: 'rgba(255,255,255,0.1)' }]}>
                    <Image
                        source={typeof coverSource === 'string' ? { uri: coverSource } : coverSource}
                        style={styles.largeImage}
                    />
                    {isLocked && (
                        <View style={styles.lockOverlayList}>
                            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                            <View style={styles.lockCircle}>
                                <Ionicons name="lock-closed" size={24} color="#FFFFFF" />
                            </View>
                        </View>
                    )}
                    <LinearGradient
                        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                {/* Floating Info Card */}
                <BlurView intensity={40} tint="dark" style={styles.largeInfoCard}>
                    <View style={styles.largeHeaderRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
                            <Ionicons name={icon as any} size={10} color={color} />
                            <Text style={[styles.categoryText, { color }]}>{audiobook.category.toUpperCase()}</Text>
                        </View>
                        {audiobook.is_featured && (
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredText}>★ DESTACADO</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.largeTitle} numberOfLines={2}>{audiobook.title}</Text>
                    <Text style={styles.largeAuthor}>{audiobook.author}</Text>

                    <View style={styles.largeFooter}>
                        <View style={styles.durationRow}>
                            {/* Guide Avatar & Duration */}
                            {guide ? (
                                <View style={styles.guideInfoRow}>
                                    <View style={styles.miniAvatarContainer}>
                                        <Image
                                            source={{ uri: guide.avatar }}
                                            style={styles.miniAvatar}
                                        />
                                    </View>
                                    <Text style={styles.guideNameMini}>{guide.name}</Text>
                                </View>
                            ) : (
                                <Ionicons name="mic-outline" size={14} color="rgba(255,255,255,0.5)" />
                            )}

                            <View style={styles.dotSeparator} />

                            <View style={styles.timeInfoRow}>
                                {/* User requested "sustituyendo al texto que pone audio y luego debe indicar el tiempo" 
                                So: Avatar | Time
                             */}
                                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.4)" style={{ marginRight: 4 }} />
                                <Text style={styles.durationText}>{formatDuration(audiobook.duration_minutes || (audiobook as any).duration)}</Text>
                            </View>
                        </View>

                        <View style={[styles.playButtonLarge, { backgroundColor: isLocked ? 'rgba(255,255,255,0.1)' : '#FFF' }]}>
                            <Ionicons
                                name={isLocked ? "lock-closed" : "play"}
                                size={20}
                                color={isLocked ? "rgba(255,255,255,0.5)" : "#000"}
                            />
                        </View>
                    </View>
                </BlurView>
            </TouchableOpacity>
        );
    }

    // --- LEGACY RENDER (Not used in new design but kept for fallback) ---
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(audiobook)}
            activeOpacity={0.93}
        >
            <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.content}>
                        <View style={styles.coverWrapper}>
                            <Image
                                source={typeof coverSource === 'string' ? { uri: coverSource } : coverSource}
                                style={styles.coverImage}
                            />
                            {isLocked && (
                                <View style={styles.lockOverlay}>
                                    <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                                </View>
                            )}
                        </View>

                        <View style={styles.details}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <Ionicons name={icon as any} size={12} color={color} />
                                <Text style={[styles.category, { color }]}>{audiobook.category.toUpperCase()}</Text>
                            </View>

                            <Text style={styles.title} numberOfLines={2}>{audiobook.title}</Text>
                            <Text style={styles.author} numberOfLines={1}>{audiobook.author}</Text>

                            <View style={styles.footer}>
                                {isLocked ? (
                                    <Ionicons name="lock-closed" size={14} color={theme.colors.accent} />
                                ) : (
                                    <Ionicons name="play-circle" size={24} color="white" />
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // --- LARGE CARD STYLES ---
    largeContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeImageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
    },
    largeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    lockOverlayList: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    lockCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    largeInfoCard: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        padding: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    largeHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    featuredBadge: {
        backgroundColor: '#FBBF24',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    featuredText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '900',
    },
    largeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    largeAuthor: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
        marginBottom: 12,
    },
    largeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    durationText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    playButtonLarge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },

    // --- OLD STYLES (Kept for safe fallback/ref) ---
    container: {
        marginBottom: theme.spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    glassContainer: {
        padding: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    coverWrapper: {
        width: 80,
        height: 110,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    details: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    category: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    author: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    // Mini Guide Avatar Styles
    guideInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 12,
    },
    miniAvatarContainer: {
        width: 18,
        height: 18,
        borderRadius: 9,
        overflow: 'hidden',
        marginRight: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    miniAvatar: {
        width: '100%',
        height: '100%',
    },
    guideNameMini: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '600',
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginRight: 8,
    },
    timeInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default AudiobookCard;
