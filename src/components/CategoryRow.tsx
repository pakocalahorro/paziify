import React from 'react';
import { Canvas, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import SessionCard from './SessionCard';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../types';

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
}

const { width } = Dimensions.get('window');

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
    const pulse = useSharedValue(0.3);

    React.useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const center = width / 2;
    const wavePath = Skia.Path.Make();
    const centerY = 50;
    wavePath.moveTo(0, centerY);
    wavePath.lineTo(center - 80, centerY);

    // High Amplitude Soundwave
    wavePath.lineTo(center - 70, 10);
    wavePath.lineTo(center - 60, 90);
    wavePath.lineTo(center - 50, 20);
    wavePath.lineTo(center - 40, 80);
    wavePath.lineTo(center - 30, 15);
    wavePath.lineTo(center - 20, 85);
    wavePath.lineTo(center - 10, 30);
    wavePath.lineTo(center, 70);
    wavePath.lineTo(center + 10, 25);
    wavePath.lineTo(center + 20, 90);
    wavePath.lineTo(center + 30, 10);
    wavePath.lineTo(center + 40, 80);
    wavePath.lineTo(center + 50, 30);
    wavePath.lineTo(center + 60, 70);
    wavePath.lineTo(center + 70, 40);

    wavePath.lineTo(center + 80, centerY);
    wavePath.lineTo(width, centerY);

    return (
        <View style={{
            height: 100,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
            marginBottom: 16
        }}>
            {/* Glowing Wave */}
            <Canvas style={{ position: 'absolute', width: width, height: 100 }}>
                {/* Outer Glow */}
                <Path
                    path={wavePath}
                    color="#2DD4BF"
                    style="stroke"
                    strokeWidth={4}
                    opacity={pulse}
                >
                    <BlurMask blur={8} style="normal" />
                </Path>
                {/* Inner Glow */}
                <Path
                    path={wavePath}
                    color="#2DD4BF"
                    style="stroke"
                    strokeWidth={2}
                    opacity={pulse}
                >
                    <BlurMask blur={3} style="normal" />
                </Path>
                {/* Core Line */}
                <Path
                    path={wavePath}
                    color="#ffffff"
                    style="stroke"
                    strokeWidth={1.5}
                    opacity={0.9}
                />
            </Canvas>

            {/* Text Overlay - Black Backlight */}
            <Text style={{
                marginHorizontal: 16,
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '900',
                letterSpacing: 4,
                textTransform: 'uppercase',
                textShadowColor: 'rgba(0,0,0,1)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 4
            }}>
                {title}
            </Text>
        </View>
    );
};

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
    variant = 'overlay'
}) => {
    if (variant === 'section-header') {
        return <SectionHeader title={title} />;
    }

    if (sessions.length === 0) return null;

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Only apply glass block style if variant is NOT standard or poster (unless we want poster to be in glass block? Assume yes for now as it replaces a featured block)
    // Actually, user wants poster for "Sesiones rapidas" which IS a glass block.
    // So if variant == standard, no glass block.
    const isStandard = variant === 'standard';
    const isPoster = variant === 'poster';
    const isWide = variant === 'wide';
    const isHero = variant === 'hero';

    // For standard, we removed glass block. For poster (in featured section), we might keep it?
    // User request: "para el bloque de sesiones rapidas". That block has glass.
    // Let's keep glass block for poster for now, unless instructed otherwise.

    const containerStyle = isStandard ?
        { marginTop: 0, paddingBottom: 4 } :
        [
            styles.glassBlock,
            accentColor && { backgroundColor: hexToRgba(accentColor, 0.20) }
        ];

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
        <View style={[styles.container, isStandard && { marginBottom: 8 }]}>
            <View style={containerStyle}>
                <View style={[
                    styles.header,
                    isResults && { marginBottom: 10 },
                    isStandard && {
                        paddingVertical: 4,
                        marginBottom: 10,
                    }
                ]}>
                    <View style={styles.headerInfo}>
                        <View style={[
                            styles.titleContainer,
                            { borderLeftColor: (isStandard) ? 'transparent' : accentColor },
                            (isStandard) && { paddingLeft: 0, borderLeftWidth: 0 }
                        ]}>
                            {icon && !isStandard && (
                                <View style={styles.iconBox}>
                                    <Ionicons name={icon as any} size={18} color={accentColor} />
                                </View>
                            )}
                            <Text style={[
                                styles.title,
                                isStandard && { fontSize: 20, marginBottom: 0 }
                            ]}>{title}</Text>
                        </View>
                        {onSeeAll && (
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => onSeeAll(title)}
                                style={styles.seeAllContainer}
                            >
                                <View style={{
                                    width: 32, height: 32, borderRadius: 16,
                                    backgroundColor: isResults ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Ionicons
                                        name={isResults ? "remove" : "add"}
                                        size={20}
                                        color={accentColor || '#FFF'}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Glass Separator Line (Restored) */}
                {isStandard && (
                    <View style={{
                        height: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        marginHorizontal: 16,
                        marginBottom: 16,
                        marginTop: -4,
                        borderRadius: 1
                    }} />
                )}

                <FlatList
                    horizontal={!isResults}
                    data={sessions}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.listContent,
                        isResults && styles.verticalList,
                        // Ensure enough padding at the end
                        !isResults && { paddingRight: 20 }
                    ]}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={snapInterval}
                    renderItem={({ item, index }) => (
                        <View style={[
                            styles.cardWrapper,
                            isResults && styles.fullWidthCard,
                            isStandard && { width: width * 0.7 },
                            isPoster && { width: (width - 68) / 3, marginRight: 8 }, // Poster wrapper
                            isWide && { width: width * 0.90, marginRight: 12 }, // Wide wrapper
                            isHero && { width: width - 56, marginRight: 12 } // Hero wrapper (Reduced width)
                        ]}>
                            <SessionCard
                                session={item}
                                onPress={onSessionPress}
                                onFavoritePress={onFavoritePress}
                                isPlusMember={isPlusMember}
                                isFavorite={favoriteSessionIds.includes(item.id)}
                                isCompleted={completedSessionIds.includes(item.id)}
                                scrollY={scrollY}
                                index={index}
                                variant={variant}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    glassBlock: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Increased opacity
        borderRadius: 24,
        paddingVertical: 12, // Reduced padding
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
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
        paddingLeft: 12,
        paddingRight: 12,
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
