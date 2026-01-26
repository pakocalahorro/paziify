import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
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
}

const { width } = Dimensions.get('window');

// Mapping for specific book covers or generic category covers
const BOOK_COVERS: Record<string, any> = {
    'Meditations': require('../assets/covers/meditations.png'),
    'The Conquest of Fear': require('../assets/covers/conquest_fear.png'),
    'Little Women': require('../assets/covers/little_women.png'),
    'As a Man Thinketh': require('../assets/covers/mind_power.png'),
    'anxiety': require('../assets/covers/anxiety.png'),
    'health': require('../assets/covers/health.png'),
    'growth': require('../assets/covers/growth.png'),
    'professional': require('../assets/covers/professional.png'),
};

const AudiobookCard: React.FC<AudiobookCardProps> = ({
    audiobook,
    onPress,
    isPlusMember,
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
    const coverSource = BOOK_COVERS[audiobook.title] || BOOK_COVERS[audiobook.category] || require('../assets/covers/growth.png');

    const formatDuration = (minutes: number): string => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(audiobook)}
            activeOpacity={0.93}
        >
            <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
                <View style={styles.content}>
                    {/* Book Cover */}
                    <View style={styles.coverWrapper}>
                        <Image source={coverSource} style={styles.coverImage} />
                        {isLocked && (
                            <View style={styles.lockOverlay}>
                                <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                            </View>
                        )}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)']}
                            style={styles.coverShadow}
                        />
                    </View>

                    {/* Info */}
                    <View style={styles.infoContainer}>
                        <View style={styles.header}>
                            <View style={[styles.categoryBadge, { backgroundColor: `${color}20` }]}>
                                <Ionicons name={icon as any} size={12} color={color} />
                                <Text style={[styles.categoryText, { color }]}>{audiobook.category.toUpperCase()}</Text>
                            </View>
                            {audiobook.is_featured && (
                                <View style={styles.featuredBadge}>
                                    <Ionicons name="star" size={10} color="#FFD700" />
                                    <Text style={styles.featuredText}>TOP</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.title} numberOfLines={2}>{audiobook.title}</Text>
                        <Text style={styles.author} numberOfLines={1}>de {audiobook.author}</Text>

                        <View style={styles.footer}>
                            <View style={styles.meta}>
                                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.4)" />
                                <Text style={styles.metaText}>{formatDuration(audiobook.duration_minutes)}</Text>
                            </View>
                            {audiobook.language && (
                                <View style={styles.langBadge}>
                                    <Text style={styles.langText}>{audiobook.language.toUpperCase()}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.btnContainer}>
                        <View style={[styles.playButton, { backgroundColor: `${color}30` }]}>
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
        padding: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
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
    infoContainer: {
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
    categoryText: {
        fontSize: 9,
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
