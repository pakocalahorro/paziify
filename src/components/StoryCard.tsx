import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { RealStory } from '../types';
import { theme } from '../constants/theme';


const CATEGORY_ASSETS: Record<string, any> = {
    anxiety: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    ansiedad: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    health: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=80',
    bienestar: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=80',
    growth: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    crecimiento: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
    relationships: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80',
    relaciones: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80',
    professional: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
    carrera: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80',
    sleep: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=400&q=80',
    sueño: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=400&q=80',
    family: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
    familia: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=400&q=80',
    children: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&q=80',
    hijos: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&q=80',
};

interface StoryCardProps {
    story: RealStory;
    onPress: (story: RealStory) => void;
    isPlusMember: boolean;
    scrollY?: Animated.Value;
    index?: number;
}

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = 180; // Approximate height + margin



const StoryCard: React.FC<StoryCardProps> = ({ story, onPress, isPlusMember, scrollY, index }) => {
    const isLocked = story.is_premium && !isPlusMember;

    const getCategoryDetails = (category: string) => {
        switch (category) {
            case 'anxiety':
                return { icon: 'frown-outline', color: '#FFA726', gradient: ['rgba(255, 167, 38, 0.2)', 'rgba(251, 140, 0, 0.4)'] };
            case 'health':
                return { icon: 'fitness-outline', color: '#66BB6A', gradient: ['rgba(102, 187, 106, 0.2)', 'rgba(67, 160, 71, 0.4)'] };
            case 'growth':
                return { icon: 'leaf-outline', color: '#646CFF', gradient: ['rgba(100, 108, 255, 0.2)', 'rgba(79, 86, 217, 0.4)'] };
            case 'relationships':
                return { icon: 'heart-outline', color: '#FF6B9D', gradient: ['rgba(255, 107, 157, 0.2)', 'rgba(196, 69, 105, 0.4)'] };
            case 'professional':
                return { icon: 'briefcase-outline', color: '#4FC3F7', gradient: ['rgba(79, 195, 247, 0.2)', 'rgba(41, 182, 246, 0.4)'] };
            case 'sleep':
                return { icon: 'moon-outline', color: '#9575CD', gradient: ['rgba(149, 117, 205, 0.2)', 'rgba(103, 58, 183, 0.4)'] };
            case 'family':
                return { icon: 'people-outline', color: '#FFB74D', gradient: ['rgba(255, 183, 77, 0.2)', 'rgba(245, 124, 0, 0.4)'] };
            case 'children':
                return { icon: 'happy-outline', color: '#F06292', gradient: ['rgba(240, 98, 146, 0.2)', 'rgba(233, 30, 99, 0.4)'] };
            default:
                return { icon: 'book-outline', color: '#646CFF', gradient: ['rgba(100, 108, 255, 0.2)', 'rgba(79, 86, 217, 0.4)'] };
        }
    };

    const { icon, color, gradient } = getCategoryDetails(story.category);

    let imageOpacity: any = 0.35;

    if (scrollY && typeof index === 'number') {
        const HEADER_HEIGHT = 480; // Estimate for Stories header
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
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp'
        });
    }



    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(story)}
            activeOpacity={0.9}
        >
            <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
                <View style={styles.mainContent}>
                    <Animated.Image
                        source={{ uri: CATEGORY_ASSETS[story.category] || CATEGORY_ASSETS['growth'] }}
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: imageOpacity }
                        ]}
                        resizeMode="cover"
                    />
                    {/* Category indicator line */}
                    <LinearGradient
                        colors={gradient}
                        style={styles.categoryLine}
                    />

                    <View style={styles.cardBody}>
                        <View style={styles.header}>
                            <View style={[styles.categoryBadge, { backgroundColor: `${color}15` }]}>
                                <Ionicons name={icon as any} size={14} color={color} />
                                <Text style={[styles.categoryText, { color }]}>{story.category.toUpperCase()}</Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                                <Text style={styles.durationText}>{story.reading_time_minutes} min</Text>
                            </View>
                        </View>

                        <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
                        <Text style={styles.subtitle} numberOfLines={2}>{story.subtitle}</Text>

                        <View style={styles.footer}>
                            <View style={styles.footerLeft}>
                                <View style={[styles.playButton, { backgroundColor: `${color}20` }]}>
                                    <Ionicons name="play" size={14} color={color} style={{ marginLeft: 2 }} />
                                </View>
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
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    glassContainer: {
        paddingVertical: 4,
    },
    mainContent: {
        flexDirection: 'row',
        minHeight: 110,
    },
    categoryLine: {
        width: 4,
        height: '100%',
    },
    cardBody: {
        flex: 1,
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    readingTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readingTimeText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 12,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(100, 108, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    avatarInitial: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    characterText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        fontWeight: '700',
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    featuredBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    featuredText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#FFD700',
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    lockText: {
        fontSize: 9,
        fontWeight: '900',
        color: theme.colors.accent,
    },
    chevronContainer: {
        justifyContent: 'center',
        paddingRight: theme.spacing.md,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    playButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    freeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    freeText: {
        fontSize: 9,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.6)',
    },
});

export default StoryCard;
