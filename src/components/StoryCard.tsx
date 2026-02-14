import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AnimatedImage = Animated.createAnimatedComponent(Image);
import { RealStory } from '../types';
import { theme } from '../constants/theme';

import { CONTENT_CATEGORIES } from '../constants/categories'; // Import unified categories
import { SESSION_ASSETS } from '../constants/images'; // Import shared assets

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

    const getCategoryDetails = (categoryKey: string) => {
        const category = CONTENT_CATEGORIES.find(c => c.key === categoryKey) || CONTENT_CATEGORIES[0]; // Default to first if not found
        const { icon, color } = category;

        // Generate gradient based on color
        // Simple opacity variation for glassmorphism effect
        const gradient = [
            `${color}33`, // 20% opacity (approx 33 hex)
            `${color}66`  // 40% opacity (approx 66 hex)
        ];

        return { icon, color, gradient };
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
                    <AnimatedImage
                        source={SESSION_ASSETS[story.category] ? { uri: SESSION_ASSETS[story.category] } : { uri: SESSION_ASSETS['default'] }}
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: imageOpacity as any }
                        ]}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="disk"
                    />
                    {/* Category indicator line */}
                    <LinearGradient
                        colors={gradient as [string, string, ...string[]]}
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

                        {story.character_name && (
                            <View style={styles.characterContainer}>
                                <Text style={[styles.characterName, { color: color }]}>{story.character_name.toUpperCase()}</Text>
                                {story.character_role && <Text style={styles.characterRole}> • {story.character_role}</Text>}
                            </View>
                        )}

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
    characterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    characterName: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    characterRole: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '500',
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
