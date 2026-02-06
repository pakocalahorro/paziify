import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ImageBackground,
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
}

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = 150; // Approximated height + margin for AudiobookCard



// Mapping for specific book covers or generic category covers
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

    // Determine cover image (specific book title or category generic)
    const coverSource = audiobook.image_url || BOOK_COVERS[audiobook.title] || BOOK_COVERS[audiobook.category] || require('../assets/covers/growth.png');

    const formatDuration = (minutes: number): string => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    let imageOpacity: any = 0.25;

    if (scrollY && typeof index === 'number') {
        const HEADER_HEIGHT = 480; // Slightly larger header estimate for Audiobooks
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
            outputRange: [0.25, 1, 0.25],
            extrapolate: 'clamp'
        });
    }



    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(audiobook)}
            activeOpacity={0.93}
        >
            <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
                <View style={{ flex: 1 }}>
                    <Animated.Image
                        source={typeof coverSource === 'string' ? { uri: coverSource } : coverSource}
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: imageOpacity }
                        ]}
                        resizeMode="cover"
                    />
                    <View style={styles.content}>
                        {/* Book Cover */}
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
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.4)']}
                                style={styles.gradient}
                            />
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

                    <View style={styles.btnContainer}>
                        <View style={[styles.playButton, { backgroundColor: color + '30' }]}>
                            <Ionicons name="play" size={18} color={color} />
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
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    glassContainer: {
        padding: 0, // Removed padding here, handled inside
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12, // Moved padding here
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
    coverShadow: {
        ...StyleSheet.absoluteFillObject,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    details: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    category: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    featuredText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#FFD700',
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
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '700',
    },
    langBadge: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4,
    },
    langText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.5)',
    },
    btnContainer: {
        paddingLeft: 8,
    },
    playButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
});

export default AudiobookCard;
