import React from 'react';
import { Canvas, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Animated
} from 'react-native';
import { OasisCard } from './Oasis/OasisCard';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../types';
import SoundwaveSeparator from './Shared/SoundwaveSeparator';

interface Props {
    title: string;
    sessions: Session[];
    onSessionPress: (session: Session) => void;
    onFavoritePress?: (session: Session) => void;
    isPlusMember: boolean;
    favoriteSessionIds?: string[];
    completedSessionIds?: string[];
    icon?: string;
    accentColor?: string;
    onSeeAll?: (title: string) => void;
    scrollY: any; // For animation if needed
    isResults?: boolean;
    index: number;
    variant?: 'overlay' | 'standard' | 'poster' | 'wide' | 'hero' | 'section-header';
    sharedTransitionTagPrefix?: string;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const EMPTY_ITEM_SIZE = (width - width * 0.75) / 2;



const CategoryRow: React.FC<Props> = ({
    title,
    sessions,
    icon,
    accentColor = '#2DD4BF',
    onSessionPress,
    onFavoritePress,
    onSeeAll,
    isPlusMember,
    favoriteSessionIds = [],
    completedSessionIds = [],
    scrollY,
    isResults = false,
    index,
    variant = 'overlay',
    sharedTransitionTagPrefix
}) => {
    const scrollXResults = React.useRef(new Animated.Value(0)).current;

    // Variant section-header handled below in the main return for consistent container management

    if (sessions.length === 0) return null;

    const carouselData = React.useMemo(() => {
        if (isResults) {
            return [{ id: 'empty-left' }, ...sessions, { id: 'empty-right' }];
        }
        return sessions;
    }, [sessions, isResults]);

    const isStandard = variant === 'standard';
    const isPoster = variant === 'poster';
    const isWide = variant === 'wide';
    const isHero = variant === 'hero';

    // Snap Calculation
    let snapInterval;
    if (!isResults) {
        if (isStandard) {
            snapInterval = width * 0.7 + 12;
        } else if (isPoster) {
            snapInterval = ((width - 68) / 3) + 8; // Poster width + margin (Safe fit for 3)
        } else if (isWide) {
            snapInterval = width * 0.90 + 12; // Wide width + margin
        } else if (isHero) {
            snapInterval = (width - 56) + 12; // Reduced width for hero
        } else {
            snapInterval = width * 0.75 + 16; // Overlay width + margin
        }
    }

    return (
        <View style={[styles.container, variant === 'section-header' && { marginBottom: 0 }]}>
            <View style={styles.transparentBlock}>
                {variant !== 'section-header' && (
                    <SoundwaveSeparator
                        title={title}
                        accentColor={accentColor}
                        onAction={onSeeAll ? () => onSeeAll(title) : undefined}
                        actionIcon={isResults ? "remove" : "add"}
                    />
                )}


                {variant === 'section-header' ? (
                    <SoundwaveSeparator title={title} />
                ) : isResults ? (
                    <Animated.FlatList
                        horizontal
                        data={carouselData}
                        keyExtractor={(item: any) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                        snapToInterval={ITEM_WIDTH}
                        decelerationRate="fast"
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollXResults } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            if ((item as any).id === 'empty-left' || (item as any).id === 'empty-right') {
                                return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                            }

                            const inputRange = [
                                (index - 2) * ITEM_WIDTH,
                                (index - 1) * ITEM_WIDTH,
                                (index) * ITEM_WIDTH,
                            ];

                            const translateY = scrollXResults.interpolate({
                                inputRange,
                                outputRange: [0, -10, 0],
                                extrapolate: 'clamp',
                            });
                            const scale = scrollXResults.interpolate({
                                inputRange,
                                outputRange: [0.92, 1, 0.92],
                                extrapolate: 'clamp',
                            });

                            return (
                                <View style={{ width: ITEM_WIDTH }}>
                                    <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
                                        <OasisCard
                                            superTitle={(item as any).category}
                                            title={(item as any).title}
                                            subtitle={`${(item as any).duration || 0} mins · ${(item as any).creatorName || 'Guía'}`}
                                            imageUri={(item as any).thumbnailUrl || (item as any).image}
                                            onPress={() => onSessionPress(item as any)}
                                            icon={icon as any}
                                            badgeText={(item as any).isPlus ? "PREMIUM" : "LIBRE"}
                                            actionText="Comenzar"
                                            actionIcon="play"
                                            duration={(item as any).duration ? `${(item as any).duration} min` : undefined}
                                            level={(item as any).difficulty}
                                            variant="hero"
                                            accentColor={accentColor}
                                            sharedTransitionTag={sharedTransitionTagPrefix ? `${sharedTransitionTagPrefix}.${(item as any).id}` : undefined}
                                        />
                                    </Animated.View>
                                </View>
                            );
                        }}
                    />
                ) : (
                    <FlatList
                        horizontal={true}
                        data={sessions}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.listContent,
                            // Ensure enough padding at the end
                            { paddingRight: 20 }
                        ]}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={snapInterval}
                        renderItem={({ item, index }) => (
                            <View style={[
                                styles.cardWrapper,
                                isStandard && { width: width * 0.7 },
                                isPoster && { width: (width - 68) / 3, marginRight: 8 },
                                isWide && { width: width * 0.90, marginRight: 12 },
                                isHero && { width: width - 56, marginRight: 12 }
                            ]}>
                                <OasisCard
                                    superTitle={(item as any).category}
                                    title={(item as any).title}
                                    subtitle={`${(item as any).duration || 0} mins · ${(item as any).creatorName || 'Guía'}`}
                                    imageUri={(item as any).thumbnailUrl || (item as any).image}
                                    onPress={() => onSessionPress(item)}
                                    icon={icon as any}
                                    badgeText={(item as any).isPlus ? "PREMIUM" : "LIBRE"}
                                    actionText="Comenzar"
                                    actionIcon="play"
                                    duration={(item as any).duration ? `${(item as any).duration} min` : undefined}
                                    level={(item as any).difficulty}
                                    variant={isCompact(variant) ? 'compact' : (isHero ? 'hero' : 'default')}
                                    accentColor={accentColor}
                                    sharedTransitionTag={sharedTransitionTagPrefix ? `${sharedTransitionTagPrefix}.${item.id}` : undefined}
                                />
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

function isCompact(variant: string | undefined): boolean {
    return variant === 'poster' || variant === 'standard' || variant === 'overlay' || variant === undefined;
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingHorizontal: 0,
    },
    transparentBlock: {
        backgroundColor: 'transparent',
        borderRadius: 24,
        paddingVertical: 0,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 8, // Reduced margin
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllContainer: {
        // Removed margin/padding for cleaner button look
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        borderLeftWidth: 3,
        gap: 10,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    seeAll: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        opacity: 0.9,
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    verticalList: {
        paddingHorizontal: 12,
    },
    cardWrapper: {
        width: width * 0.7,
        marginRight: 12,
    },
    fullWidthCard: {
        width: width * 0.85,
        alignSelf: 'center',
        marginRight: 0,
        marginBottom: 16,
    },
});

export default CategoryRow;
