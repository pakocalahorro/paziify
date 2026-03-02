import React, { memo, useRef, useMemo } from 'react';
import { Dimensions, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { OasisCard } from './Oasis/OasisCard';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../types';
import SoundwaveSeparator from './Shared/SoundwaveSeparator';
import { getGuideAvatar } from '../constants/guides';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

/**
 * CONFIGURACIÓN DE MOTOR DE BIBLIOTECA (PDS 3.0)
 * Replicamos exactamente las proporciones y el sistema de anclaje de LibraryScreen.
 */
const ITEM_WIDTH = width * 0.75;
const EMPTY_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

interface Props {
    title: string;
    sessions: Session[];
    onSessionPress: (session: Session) => void;
    onFavoritePress?: (session: Session) => void;
    isPlusMember?: boolean;
    favoriteSessionIds?: string[];
    completedSessionIds?: string[];
    icon?: string;
    accentColor?: string;
    onSeeAll?: (title: string) => void;
    scrollY?: any;
    isResults?: boolean;
    index?: number;
    variant?: 'overlay' | 'standard' | 'poster' | 'wide' | 'hero' | 'section-header';
    sharedTransitionTagPrefix?: string;
    isLoading?: boolean;
    cardVariant?: 'default' | 'compact' | 'hero';
}

const CategoryCardItem = memo(({
    item,
    index,
    onSessionPress,
    icon,
    accentColor,
    sharedTransitionTagPrefix,
    scrollX,
    cardVariant
}: any) => {

    const inputRange = [
        (index - 2) * ITEM_WIDTH,
        (index - 1) * ITEM_WIDTH,
        (index) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.92, 1, 0.92],
        extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
        extrapolate: 'clamp',
    });

    const handlePress = React.useCallback(() => {
        onSessionPress(item);
    }, [onSessionPress, item]);

    return (
        <View style={{ width: ITEM_WIDTH }}>
            <Animated.View style={[
                styles.cardWrapper,
                { transform: [{ scale }], opacity }
            ]}>
                <OasisCard
                    superTitle={item?.category}
                    title={item?.title || 'Sin título'}
                    subtitle={item?.description || item?.subtitle}
                    imageUri={item?.thumbnailUrl || item?.image}
                    onPress={handlePress}
                    icon={icon as any}
                    badgeText={item?.isPlus ? "PREMIUM" : "LIBRE"}
                    guideName={item?.creatorName?.toUpperCase()}
                    guideAvatar={getGuideAvatar(item?.creatorName)}
                    actionText="Comenzar"
                    actionIcon="play"
                    duration={item?.duration ? `${item.duration} min` : (item?.duration_m ? `${item.duration_m} min` : undefined)}
                    level={item?.difficulty}
                    variant={cardVariant || "default"}
                    accentColor={accentColor}
                    sharedTransitionTag={sharedTransitionTagPrefix ? `${sharedTransitionTagPrefix}.${item?.id}` : undefined}
                    isPremium={!!item?.isPlus}
                    style={{ marginBottom: 0 }}
                />
            </Animated.View>
        </View>
    );
});

const CategoryRow: React.FC<Props> = ({
    title,
    sessions,
    icon,
    accentColor = '#2DD4BF',
    onSessionPress,
    onSeeAll,
    isResults = false,
    variant = 'overlay',
    sharedTransitionTagPrefix,
    isLoading = false,
    cardVariant
}) => {

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<Animated.FlatList>(null);
    const scrollOffset = useRef(0);

    const finalData = useMemo(() => {
        if (!sessions || sessions.length === 0) return [];
        return [{ id: 'empty-left' }, ...sessions, { id: 'empty-right' }];
    }, [sessions]);

    const isEmpty = !sessions || sessions.length === 0;

    const handleNext = () => {
        const nextOffset = scrollOffset.current + ITEM_WIDTH;
        // En versiones modernas de React Native/Animated, no se usa .getNode()
        flatListRef.current?.scrollToOffset({
            offset: nextOffset,
            animated: true
        });
    };

    const handlePrev = () => {
        const prevOffset = scrollOffset.current - ITEM_WIDTH;
        flatListRef.current?.scrollToOffset({
            offset: prevOffset,
            animated: true
        });
    };

    if (variant === 'section-header') {
        return (
            <View style={[styles.container, { marginBottom: 0 }]}>
                <SoundwaveSeparator title={title} accentColor={accentColor} />
            </View>
        );
    }

    if (isEmpty && !isResults) return null;

    return (
        <View style={styles.container}>
            <View style={styles.transparentBlock}>
                <SoundwaveSeparator
                    title={title}
                    accentColor={accentColor}
                    onAction={onSeeAll ? () => onSeeAll(title) : undefined}
                    actionIcon={isResults ? "remove-circle" : (onSeeAll ? "add-circle" : undefined)}
                />

                {isEmpty ? (
                    isLoading ? (
                        <View style={{ paddingLeft: 20, flexDirection: 'row', gap: 12 }}>
                            {[1, 2, 3].map((i) => (
                                <View key={i} style={{ width: ITEM_WIDTH, height: 180, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, opacity: 0.5 }} />
                            ))}
                        </View>
                    ) : (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.1)" />
                            <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontWeight: '600' }}>Sin resultados encontrados</Text>
                        </View>
                    )
                ) : (
                    <View style={styles.carouselContainer}>
                        {/* Botones de Navegación Premium */}
                        <TouchableOpacity
                            onPress={handlePrev}
                            style={[styles.navButton, styles.navButtonLeft]}
                            activeOpacity={0.7}
                        >
                            <BlurView intensity={30} tint="dark" style={styles.navButtonBlur}>
                                <Ionicons name="chevron-back" size={32} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleNext}
                            style={[styles.navButton, styles.navButtonRight]}
                            activeOpacity={0.7}
                        >
                            <BlurView intensity={30} tint="dark" style={styles.navButtonBlur}>
                                <Ionicons name="chevron-forward" size={32} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>

                        <Animated.FlatList
                            ref={flatListRef}
                            data={finalData}
                            keyExtractor={(item: any) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            snapToInterval={ITEM_WIDTH}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            bounces={false}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                {
                                    useNativeDriver: true,
                                    listener: (event: any) => {
                                        scrollOffset.current = event.nativeEvent.contentOffset.x;
                                    }
                                }
                            )}
                            renderItem={({ item, index }) => {
                                if (item.id === 'empty-left' || item.id === 'empty-right') {
                                    return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                                }
                                return (
                                    <CategoryCardItem
                                        item={item}
                                        index={index}
                                        onSessionPress={onSessionPress}
                                        icon={icon}
                                        accentColor={accentColor}
                                        sharedTransitionTagPrefix={sharedTransitionTagPrefix}
                                        scrollX={scrollX}
                                        cardVariant={item?.cardVariant || cardVariant || "default"}
                                    />
                                );
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    transparentBlock: {
        backgroundColor: 'transparent',
    },
    carouselContainer: {
        marginTop: 0,
        position: 'relative',
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 40,
        alignItems: 'flex-start',
    },
    cardWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    navButton: {
        position: 'absolute',
        top: 216, // Posición fija para centrar exactamente en la imagen (10 padding + 90 header + 16 gap + 100 centro imagen)
        transform: [{ translateY: -28 }], // Mitad de la altura del botón (56/2)
        zIndex: 100,
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonLeft: {
        left: 8,
    },
    navButtonRight: {
        right: 8,
    },
    navButtonBlur: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    }
});

export default memo(CategoryRow);
