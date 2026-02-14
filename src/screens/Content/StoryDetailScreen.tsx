import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share,
    ImageBackground,
    Animated,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Screen, RootStackParamList, RealStory } from '../../types';
import { theme } from '../../constants/theme';
import { storiesService, favoritesService } from '../../services/contentService';
import { useApp } from '../../context/AppContext';

type StoryDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.STORY_DETAIL
>;

type StoryDetailScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.STORY_DETAIL
>;

interface Props {
    navigation: StoryDetailScreenNavigationProp;
    route: StoryDetailScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const CATEGORY_ASSETS: Record<string, any> = {
    anxiety: require('../../assets/covers/anxiety.png'),
    health: require('../../assets/covers/health.png'),
    growth: require('../../assets/covers/growth.png'),
    relationships: require('../../assets/covers/relationships.png'),
    professional: require('../../assets/covers/professional.png'),
    sleep: require('../../assets/covers/sleep.png'),
    family: require('../../assets/covers/family.png'),
    children: require('../../assets/covers/children.png'),
};

const StoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { storyId } = route.params;
    const { userState } = useApp();

    const [story, setStory] = useState<RealStory | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // [ZERO EGRESS] Use passed data if available to avoid service calls
        if (route.params.story) {
            console.log('[STORY_DETAIL] Using navigation story data (Zero Egress)');
            setStory(route.params.story);
            setLoading(false);
        } else {
            loadStory();
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [storyId, route.params.story]);

    useEffect(() => {
        if (story && userState.id) {
            checkFavorite();
        }
    }, [story, userState.id]);

    const loadStory = async () => {
        try {
            setLoading(true);
            const data = await storiesService.getById(storyId);
            setStory(data);
        } catch (error) {
            console.error('Error loading story:', error);
            Alert.alert('Error', 'No se pudo cargar la historia');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        if (!userState.id || !story) return;
        try {
            const fav = await favoritesService.isFavorited(userState.id, 'story', story.id);
            setIsFavorite(fav);
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!userState.id || !story) return;
        try {
            if (isFavorite) {
                await favoritesService.remove(userState.id, 'story', story.id);
                setIsFavorite(false);
            } else {
                await favoritesService.add(userState.id, 'story', story.id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'No se pudo actualizar favoritos');
        }
    };

    const handleShare = async () => {
        if (!story) return;
        try {
            await Share.share({
                message: `Mira esta historia de superación en Paziify: "${story.title}"\n\n${story.story_text.substring(0, 100)}...`,
                title: story.title,
            });
        } catch (error) {
            console.error('Error sharing story:', error);
        }
    };

    if (loading || !story) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'anxiety': return { color: '#FFA726' };
            case 'health': return { color: '#66BB6A' };
            case 'growth': return { color: '#646CFF' };
            case 'relationships': return { color: '#FF6B9D' };
            case 'professional': return { color: '#4FC3F7' };
            case 'sleep': return { color: '#9575CD' };
            case 'family': return { color: '#FFB74D' };
            case 'children': return { color: '#F06292' };
            default: return { color: '#646CFF' };
        }
    };

    const { color } = getCategoryStyles(story.category);

    // Parallax Header scaling
    const headerScale = scrollY.interpolate({
        inputRange: [-height * 0.4, 0],
        outputRange: [2, 1],
        extrapolateLeft: 'extend',
        extrapolateRight: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* Background Parallax Image */}
            <Animated.View style={[styles.headerContainer, { transform: [{ scale: headerScale }] }]}>
                <ImageBackground
                    source={CATEGORY_ASSETS[story.category]}
                    style={styles.headerImage}
                >
                    <LinearGradient
                        colors={['rgba(10, 14, 26, 0.4)', 'rgba(10, 14, 26, 0.8)']}
                        style={StyleSheet.absoluteFill}
                    />
                </ImageBackground>
            </Animated.View>

            <Animated.ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingTop: height * 0.35 }]}
            >
                <BlurView intensity={40} tint="dark" style={styles.contentBlur}>
                    <View style={styles.contentContainer}>
                        {/* Header Info */}
                        <View style={styles.titleSection}>
                            <View style={styles.categoryRow}>
                                <View style={[styles.categoryBadge, { backgroundColor: `${color}20` }]}>
                                    <Text style={[styles.categoryText, { color }]}>{story.category.toUpperCase()}</Text>
                                </View>
                                <View style={styles.readingTime}>
                                    <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.readingTimeText}>{story.reading_time_minutes} min lectura</Text>
                                </View>
                            </View>

                            <Text style={styles.title}>{story.title}</Text>
                            {story.subtitle && (
                                <Text style={styles.subtitle}>{story.subtitle}</Text>
                            )}

                            <View style={styles.authorBar}>
                                <View style={styles.authorIcon}>
                                    <Text style={styles.authorInitial}>{(story.character_name || 'U').charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.authorName}>{story.character_name || 'Protagonista'}</Text>
                                    <Text style={styles.authorRole}>{story.character_role || 'Biografía'}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Story Body */}
                        <View style={styles.bodySection}>
                            {story.transformation_theme && (
                                <View style={styles.themeBadge}>
                                    <Ionicons name="sparkles" size={14} color={theme.colors.primary} />
                                    <Text style={styles.themeText}>TEMA: {story.transformation_theme.toUpperCase()}</Text>
                                </View>
                            )}

                            <Text style={styles.storyText}>{story.story_text}</Text>

                            {/* Tags */}
                            <View style={styles.tagContainer}>
                                {story.tags.map((tag, index) => (
                                    <BlurView key={index} intensity={20} tint="light" style={styles.tag}>
                                        <Text style={styles.tagText}>#{tag}</Text>
                                    </BlurView>
                                ))}
                            </View>
                        </View>
                    </View>
                </BlurView>

                {/* Spacer for bottom */}
                <View style={{ height: insets.bottom + 100 }} />
            </Animated.ScrollView>

            {/* Floating Top Nav */}
            <BlurView intensity={30} tint="dark" style={[styles.navHeader, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.circleButton}
                >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={handleShare}
                        style={styles.circleButton}
                    >
                        <Ionicons name="share-outline" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={styles.circleButton}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={22}
                            color={isFavorite ? '#FF6B9D' : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.45,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
    navHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        zIndex: 100,
    },
    headerRight: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    circleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    contentBlur: {
        borderRadius: 40,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    contentContainer: {
        backgroundColor: 'rgba(10, 14, 26, 0.4)',
        padding: theme.spacing.xl,
    },
    titleSection: {
        marginBottom: 24,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    readingTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    readingTimeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        lineHeight: 40,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 20,
        fontWeight: '500',
    },
    authorBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    authorIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    authorInitial: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    authorName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    authorRole: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
    },
    bodySection: {
        gap: 20,
    },
    themeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    themeText: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    storyText: {
        fontSize: 18,
        lineHeight: 34,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'justify',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 40,
        gap: 10,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tagText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '700',
    },
});

export default StoryDetailScreen;
