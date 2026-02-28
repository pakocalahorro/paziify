import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight, FadeIn, withRepeat, withSequence, withTiming, withDelay, useSharedValue, useAnimatedStyle, Easing } from 'react-native-reanimated';

// Helper to deduce icon for tags
const getTagIcon = (tag: string): keyof typeof Feather.glyphMap | null => {
    const text = tag.toLowerCase();
    if (text.includes('min') || text.includes('hora')) return 'clock';
    if (text.includes('principiante') || text.includes('medio') || text.includes('avanzado')) return 'trending-up';
    if (text.includes('libre') || text.includes('gratis')) return 'unlock';
    return null;
};

interface OasisCardProps {
    superTitle?: string;    // e.g "Curso" or "Audiolibro"
    title: string;          // e.g "Manejo del Estrés"
    subtitle?: string;      // e.g "Aprende herramientas cognitivas."
    imageUri?: string;      // URL of the image
    onPress?: () => void;
    icon?: keyof typeof Ionicons.glyphMap; // e.g., 'school-outline', 'headset'
    badgeText?: string;     // e.g., "FORMACIÓN"
    actionText?: string;    // e.g., "Accede al curso", "Comenzar"
    actionIcon?: keyof typeof Ionicons.glyphMap; // Defaults to 'play'
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'compact' | 'hero';
    accentColor?: string;   // Drives the super-title and glow
    sharedTransitionTag?: string; // Links the image in a Shared Element Transition
    duration?: string;      // e.g. '15 min'
    level?: string;         // e.g. 'Principiante'
    isPremium?: boolean;    // Shows PLUS or LIBRE ribbon
}

/**
 * Universal Card for PDS v3.0
 * Creates a glassmorphic bento-style card with smooth corners and a structural layout.
 */
export const OasisCard: React.FC<OasisCardProps> = ({
    superTitle,
    title,
    subtitle,
    imageUri,
    onPress,
    icon,
    badgeText,
    actionText = "Comenzar",
    actionIcon = "play",
    style,
    variant = 'default',
    accentColor = '#2DD4BF', // Healing default
    sharedTransitionTag,
    duration,
    level,
    isPremium = false
}) => {
    const isHero = variant === 'hero';
    const isCompact = variant === 'compact';

    // Animated values for the Premium Ribbon Glow
    const ribbonGlow = useSharedValue(0.4);

    React.useEffect(() => {
        if (isPremium) {
            ribbonGlow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500 }),
                    withTiming(0.4, { duration: 1500 })
                ),
                -1,
                true
            );
        }
    }, [isPremium]);

    const animatedRibbonStyle = useAnimatedStyle(() => ({
        opacity: ribbonGlow.value,
    }));

    // The image card height
    const cardHeight = isHero ? 280 : isCompact ? 100 : 200;
    const borderRadius = isCompact ? 20 : 24;

    const ContentWrapper = onPress ? TouchableOpacity : View;

    if (isCompact) {
        // Compact variants (like Profile lists) stay simple
        return (
            <Animated.View entering={FadeInUp.duration(600).springify()} style={[styles.outerContainer, { shadowColor: accentColor }, style]}>
                <ContentWrapper
                    style={[styles.card, { height: cardHeight, borderRadius }]}
                    activeOpacity={0.8}
                    {...(onPress ? { onPress } : {})}
                >
                    <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                    <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']} style={styles.overlay} />
                    <View style={[styles.glassBorder, { borderRadius }]} pointerEvents="none" />
                    <View style={styles.contentCompact}>
                        <View style={styles.bottomSection}>
                            <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
                            {!!subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                        </View>
                        {!!icon && (
                            <View style={[styles.compactIconWrapper, { backgroundColor: `${accentColor}30` }]}>
                                <Ionicons name={icon} size={24} color={accentColor} />
                            </View>
                        )}
                    </View>
                </ContentWrapper>
            </Animated.View>
        );
    }

    // Default/Hero variants follow the strict 4-Layer Home Architecture
    return (
        <Animated.View entering={FadeInUp.duration(600).springify()} style={[styles.fullWrapper, style]}>

            {/* Layer 1 & 2: Super-Title & Title */}
            <View style={styles.headerTitles}>
                {!!superTitle ? (
                    <Text style={[styles.superTitle, { color: accentColor }]}>{superTitle}</Text>
                ) : (
                    // Spacing balance if no superTitle
                    <View style={{ height: 16 }} />
                )}
                <Text style={styles.mainTitle} numberOfLines={2} adjustsFontSizeToFit>
                    {title}
                </Text>
            </View>

            {/* Layer 3: Immersive Card */}
            <View style={[styles.outerContainer, { shadowColor: accentColor }]}>
                <ContentWrapper
                    style={[styles.card, { height: cardHeight, borderRadius }]}
                    activeOpacity={0.9}
                    {...(onPress ? { onPress } : {})}
                >
                    {/* Background Image with optional Shared Element Transition */}
                    {!!imageUri ? (
                        sharedTransitionTag ? (
                            <Animated.View {...({ sharedTransitionTag: sharedTransitionTag } as any)} style={StyleSheet.absoluteFill}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    transition={500}
                                    cachePolicy="memory-disk"
                                />
                            </Animated.View>
                        ) : (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                transition={500}
                                cachePolicy="memory-disk"
                            />
                        )
                    ) : (
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                    )}

                    {/* Dark Gradient Overlay for text contrast */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)', `${accentColor}90`]}
                        style={styles.overlay}
                    />

                    {/* Glass effect borders */}
                    <View style={[styles.glassBorder, { borderRadius }]} pointerEvents="none" />

                    {/* Content inside the image card */}
                    <View style={styles.cardContentBox}>

                        {/* Neo-Minimalist Top Left Badge */}
                        {!!badgeText && (
                            <View style={styles.neoBadgeWrapper}>
                                {!!icon && <Ionicons name={icon} size={10} color={accentColor} style={styles.neoBadgeIcon} />}
                                {!icon && <View style={[styles.neoBadgeDot, { backgroundColor: accentColor }]} />}
                                <Text style={[styles.neoBadgeText, { color: accentColor }]}>{badgeText}</Text>
                            </View>
                        )}

                        {/* Top Right Ribbon (Anchored Structural: PLUS / LIBRE) */}
                        <View style={styles.premiumRibbonWrapper}>
                            <Animated.View entering={FadeInRight.delay(200).springify()}>
                                <View style={styles.premiumRibbonRotator}>
                                    <LinearGradient colors={isPremium ? ['#F59E0B', '#FDE047'] : ['#334155', '#94A3B8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumRibbon}>
                                        <Text style={[styles.premiumRibbonText, !isPremium && { color: '#FFFFFF' }]}>{isPremium ? 'PLUS' : 'LIBRE'}</Text>
                                    </LinearGradient>
                                    {/* Animated Pulse Overlay (Only for Premium) */}
                                    {isPremium && (
                                        <Animated.View style={[StyleSheet.absoluteFill, animatedRibbonStyle]}>
                                            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                                        </Animated.View>
                                    )}
                                </View>
                            </Animated.View>
                        </View>

                        {/* Bottom Left Duration Corner */}
                        {!!duration && (
                            <View style={styles.durationCorner}>
                                <BlurView intensity={30} tint="dark" style={styles.durationBlur}>
                                    <Text style={styles.durationText}>{duration.replace(/\D/g, '')}</Text>
                                    <Feather name={getTagIcon(duration) || 'clock'} size={10} color="rgba(255,255,255,0.8)" style={{ marginLeft: 4 }} />
                                </BlurView>
                            </View>
                        )}

                        <View style={styles.centerActionArea}>
                            {/* Center Action Button (Play with Level metadata) */}
                            <View style={styles.actionButtonContainer}>
                                <BlurView intensity={30} tint="light" style={styles.actionButtonBlur}>
                                    <View style={styles.actionButton}>
                                        <Ionicons name={actionIcon} size={28} color="#FFF" style={{ marginRight: 12 }} />
                                        <View style={styles.actionButtonTextCol}>
                                            <Text style={styles.actionButtonText}>{actionText}</Text>
                                            {!!level && (
                                                <View style={styles.levelRow}>
                                                    <Feather name={getTagIcon(level) || "trending-up"} size={11} color="rgba(255,255,255,0.8)" style={{ marginRight: 4 }} />
                                                    <Text style={styles.levelText}>{level}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </BlurView>
                            </View>
                        </View>

                    </View>
                </ContentWrapper>
            </View>

            {/* Layer 4: Subtitle / Description */}
            {!!subtitle && (
                <Text style={styles.descriptionText} numberOfLines={2}>
                    {subtitle}
                </Text>
            )}

        </Animated.View>
    );
};

const styles = StyleSheet.create({
    fullWrapper: {
        width: '100%',
        marginBottom: 32, // Replaces external margins
    },
    headerTitles: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    superTitle: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 36,
        marginBottom: -8,
    },
    mainTitle: {
        fontFamily: 'Outfit_900Black',
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'left',
    },
    outerContainer: {
        width: '100%',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    card: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'rgba(2, 6, 23, 0.6)',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    glassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    cardContentBox: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Compact styles
    contentCompact: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    compactIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        flex: 1,
        marginRight: 16,
    },
    compactTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
    },
    neoBadgeWrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    neoBadgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
        shadowColor: '#FFF',
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    neoBadgeIcon: {
        marginRight: 4,
    },
    neoBadgeText: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 9,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    premiumRibbonWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        overflow: 'hidden',
        borderTopRightRadius: 24, // Matches card radius
    },
    premiumRibbonRotator: {
        position: 'absolute',
        top: 14,
        right: -28,
        width: 120,
        transform: [{ rotate: '45deg' }],
        shadowColor: '#F59E0B',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    premiumRibbon: {
        width: '100%',
        paddingVertical: 4,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    premiumRibbonText: {
        color: '#78350F',
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 9,
        letterSpacing: 3,
    },
    actionButtonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    actionButtonBlur: {
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    actionButtonTextCol: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    levelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    levelText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 9,
        color: 'rgba(255,255,255,0.85)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    descriptionText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'left',
        marginTop: 16,
        paddingHorizontal: 4,
    },
    centerActionArea: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    durationCorner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    durationBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    durationText: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 12,
        color: '#FFFFFF',
        letterSpacing: 1,
    }
});

export default React.memo(OasisCard);
