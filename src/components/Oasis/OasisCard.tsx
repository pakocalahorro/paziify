import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
    sharedTransitionTag
}) => {
    const isHero = variant === 'hero';
    const isCompact = variant === 'compact';

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

                        {/* Top Left Badge */}
                        {!!badgeText && (
                            <View style={styles.badgeWrapper}>
                                <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                                    {!!icon && <Ionicons name={icon} size={14} color="#FFFFFF" style={styles.badgeIcon} />}
                                    <Text style={styles.badgeText}>{badgeText}</Text>
                                </BlurView>
                            </View>
                        )}

                        {/* Center Action Button (Play) */}
                        <View style={styles.actionButtonContainer}>
                            <View style={styles.actionButton}>
                                <Ionicons name={actionIcon} size={24} color="#FFF" style={{ marginRight: 10, marginLeft: 6 }} />
                                <Text style={styles.actionButtonText}>{actionText}</Text>
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
        fontFamily: 'Outfit_800ExtraBold',
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
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
    badgeWrapper: {
        position: 'absolute',
        top: 16,
        left: 16,
        overflow: 'hidden',
        borderRadius: 30,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    badgeBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    badgeIcon: {
        marginRight: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    actionButtonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 15,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    descriptionText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'left',
        marginTop: 16,
        paddingHorizontal: 4,
    }
});

export default React.memo(OasisCard);
