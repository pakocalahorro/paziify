import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import React, { useEffect } from 'react';

interface BentoCardProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'small' | 'wide' | 'tall' | 'full' | 'large' | 'medium' | 'vinyl' | 'cinematic' | 'silhouette';
    accentColor?: string;
    backgroundImage?: any;
    largeIcon?: boolean;
    ctaText?: string;
    mood?: 'healing' | 'growth';
    badgeIcon?: keyof typeof Ionicons.glyphMap;
    badgeText?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
    title,
    subtitle,
    icon,
    onPress,
    children,
    style,
    variant = 'small',
    accentColor = theme.colors.primary,
    backgroundImage,
    largeIcon = false,
    ctaText,
    mood = 'healing',
    badgeIcon,
    badgeText,
}) => {
    const scale = useSharedValue(1);
    const vinylGlow = useSharedValue(0.3);
    const cinematicPan = useSharedValue(0);

    useEffect(() => {
        if (variant === 'vinyl') {
            vinylGlow.value = withRepeat(
                withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else if (variant === 'cinematic') {
            cinematicPan.value = withRepeat(
                withTiming(1, { duration: 25000, easing: Easing.linear }),
                -1,
                true // reverse and go back so there's no popping
            );
        }
    }, [variant]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedGlowStyle = useAnimatedStyle(() => ({
        opacity: vinylGlow.value,
    }));

    const animatedCinematicStyle = useAnimatedStyle(() => {
        // We will move the image slowly from -15% to 0% (assuming image is wider than container)
        // Here we'll translate it using a simple interpolation based on the 0-1 value
        const translateX = -30 * cinematicPan.value; // Moves left by up to 30px
        return {
            transform: [{ translateX }, { scale: 1.15 }], // Slight scale up avoids edges showing during pan
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const renderContent = () => (
        <>
            {/* Category Icon & Text Badge - Absolutely Floating Top-Left */}
            {(badgeIcon || badgeText) && (
                <View style={styles.badgeContainer}>
                    <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                        {badgeIcon && <Ionicons name={badgeIcon} size={12} color="#FFFFFF" style={styles.badgeIconStyle} />}
                        {badgeText && <Text style={styles.badgeText}>{badgeText}</Text>}
                    </BlurView>
                </View>
            )}

            <View style={[styles.header, (badgeIcon || badgeText) ? { marginTop: 32 } : null]}>
                <View style={[styles.titleContainer, largeIcon ? { paddingRight: 40 } : null]}>
                    <Text
                        style={[styles.title, { fontSize: variant === 'small' ? 18 : (largeIcon ? 24 : 22) }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {title}
                    </Text>
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
            </View>
            <View style={[styles.content, largeIcon && styles.largeIconContent]}>
                {largeIcon && icon && (
                    <View style={styles.iconSophisticatedContainer}>
                        <View style={styles.iconGlow} />
                        <BlurView intensity={20} tint="light" style={styles.iconGlass}>
                            <Ionicons name={icon} size={25} color="#FFF" style={styles.mainIcon} />
                        </BlurView>
                    </View>
                )}
                {children}

                {ctaText && (
                    <View style={styles.ctaContainer}>
                        <BlurView intensity={20} tint="light" style={styles.ctaButton}>
                            <Text style={styles.ctaText}>{ctaText}</Text>
                            <Ionicons name="arrow-forward" size={14} color="#FFF" />
                        </BlurView>
                    </View>
                )}
            </View>
            <View style={styles.innerGlassBorder} pointerEvents="none" />
        </>
    );

    // Gradientes dinámicos según el mood para un toque premium editorial (Deep Shadows)
    const getGradientColors = () => {
        if (mood === 'growth') {
            return ['rgba(0,0,0,0.0)', 'rgba(9, 9, 11, 0.6)', 'rgba(217, 119, 6, 0.95)'] as const; // Ámbar oscuro hiper-saturado base
        }
        return ['rgba(0,0,0,0.0)', 'rgba(2, 6, 23, 0.7)', 'rgba(15, 23, 42, 0.98)'] as const; // Azul oscuro casi negro en la base
    };

    const getVinylGradient = () => {
        if (mood === 'growth') {
            return ['rgba(120, 53, 15, 0.9)', 'rgba(9, 9, 11, 0.95)'] as const;
        }
        return ['rgba(30, 58, 138, 0.7)', 'rgba(2, 6, 23, 0.98)'] as const;
    };

    const renderVinyl = () => (
        <View style={styles.touchable}>
            <View style={styles.vinylRecordContainer}>
                {backgroundImage && (
                    <Image
                        source={backgroundImage}
                        style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                    />
                )}
                {/* Animated dark breathing pulse over the vinyl image */}
                <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }, animatedGlowStyle]} />
                {/* Dark overlay to simulate vinyl groves */}
                <View style={styles.vinylGroves} />
                <View style={styles.vinylGrovesInner} />

                {/* The Vinyl Label in the center */}
                <View style={[styles.vinylLabel, { backgroundColor: mood === 'growth' ? '#d97706' : '#2DD4BF' }]}>
                    <Text style={styles.vinylLabelSubtitle} numberOfLines={1}>{badgeText || "SONIDO"}</Text>
                    <Text style={styles.vinylLabelTitle} numberOfLines={2} adjustsFontSizeToFit>{title}</Text>
                    {icon && <Ionicons name={icon} size={18} color="#111" style={{ marginTop: 8 }} />}
                    <View style={styles.vinylCenterHole} />
                </View>
            </View>
        </View>
    );

    const renderCinematic = () => (
        <View style={styles.touchable}>
            <View style={{ flex: 1, overflow: 'hidden', borderRadius: 24, backgroundColor: '#000' }}>
                {backgroundImage && (
                    <Animated.Image
                        source={backgroundImage}
                        style={[{ width: '100%', height: '100%', opacity: 0.8 }, animatedCinematicStyle]}
                        resizeMode="cover"
                    // Since Animated.Image from react-native is used here directly to support animated style simply, 
                    // we're omitting expo-image specific props to avoid type conflicts, but the visual result holds.
                    />
                )}
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', '#020617']}
                    locations={[0, 0.4, 1]}
                    style={styles.cinematicOverlay}
                >
                    <View style={styles.cinematicContent}>
                        {(badgeIcon || badgeText) && (
                            <View style={[styles.badgeContainer, { position: 'relative', top: 0, left: 0, alignSelf: 'center', marginBottom: 12 }]}>
                                <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                                    {badgeIcon && <Ionicons name={badgeIcon} size={12} color="#FFFFFF" style={styles.badgeIconStyle} />}
                                    {badgeText && <Text style={styles.badgeText}>{badgeText}</Text>}
                                </BlurView>
                            </View>
                        )}
                        <Text style={[styles.title, { fontSize: 32, textAlign: 'center', marginBottom: 4 }]} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
                        {subtitle && <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }]} numberOfLines={1}>{subtitle}</Text>}

                        {icon && (
                            <View style={styles.cinematicPlayButton}>
                                <BlurView intensity={30} tint="light" style={styles.cinematicPlayGlass}>
                                    <Ionicons name={icon} size={28} color="#FFF" style={{ marginLeft: icon === 'play' ? 4 : 0 }} />
                                </BlurView>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
            <View style={styles.innerGlassBorder} pointerEvents="none" />
        </View>
    );

    const renderSilhouette = () => (
        <View style={styles.touchable}>
            <View style={[
                styles.silhouetteContainer,
                { backgroundColor: mood === 'growth' ? '#1E1B24' : '#141E28' }
            ]}>
                {/* Silhouette Image */}
                <Image
                    source={{ uri: backgroundImage || "https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/true_stories_background.webp" }}
                    style={styles.silhouetteImage}
                    contentFit="cover"
                    transition={500}
                />

                {/* Shadow Gradient from bottom to ensure text readability if needed */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                    locations={[0, 0.4, 1]}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.silhouetteContent}>
                    {/* Floating Badge (Top Left) */}
                    {(badgeIcon || badgeText) && (
                        <View style={[styles.badgeContainer, { position: 'absolute', top: 16, left: 16 }]}>
                            <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                                {badgeIcon && <Ionicons name={badgeIcon} size={12} color="#FFFFFF" style={styles.badgeIconStyle} />}
                                {badgeText && <Text style={styles.badgeText}>{badgeText}</Text>}
                            </BlurView>
                        </View>
                    )}

                    {/* Text removed, handled externally in HomeScreen */}
                    {icon && (
                        <View style={styles.silhouettePlayContainer}>
                            <Ionicons name={icon} size={28} color="#FFF" style={{ marginLeft: icon === 'play' ? 4 : 0 }} />
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.innerGlassBorder} pointerEvents="none" />
        </View>
    );

    return (
        <Animated.View style={[styles.wrapper, styles[variant], animatedStyle, style]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchable}
            >
                {variant === 'silhouette' ? renderSilhouette() : variant === 'cinematic' ? renderCinematic() : variant === 'vinyl' ? renderVinyl() : backgroundImage ? (
                    <View style={styles.touchable}>
                        <Image
                            source={backgroundImage}
                            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                            contentFit="cover"
                            transition={500}
                            cachePolicy="memory-disk"
                        />
                        <LinearGradient
                            colors={getGradientColors()}
                            locations={[0, 0.5, 1]}
                            style={styles.gradientOverlay}
                        >
                            {renderContent()}
                        </LinearGradient>
                    </View>
                ) : (
                    <BlurView intensity={25} tint="dark" style={styles.blur}>
                        {renderContent()}
                    </BlurView>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(0,0,0,0.2)', // Base color for loading
    },
    touchable: {
        flex: 1,
    },
    blur: {
        flex: 1,
        padding: 16,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gradientOverlay: {
        flex: 1,
        padding: 16,
        paddingTop: 12, // Reduced top padding to accommodate badge
        justifyContent: 'space-between',
    },
    badgeContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20, // Pill shape
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    badgeBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        gap: 6,
    },
    badgeIconStyle: {
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '900', // Outfit UltraBold/Black base
        fontFamily: 'Outfit_900Black', // Inyección de la fuente editorial
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -1, // Look compacto "editorial"
        textShadowColor: 'rgba(0,0,0,0.8)', // Shadow más bestia para contrastar con deep shadow
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Outfit_600SemiBold',
        color: 'rgba(255, 255, 255, 0.7)',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        letterSpacing: -0.2,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    ctaContainer: {
        marginTop: 'auto',
        alignItems: 'flex-start',
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
    },
    ctaText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    innerGlassBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderTopColor: 'rgba(255,255,255,0.35)',
        borderLeftColor: 'rgba(255,255,255,0.25)',
    },
    largeIconContent: {
        position: 'absolute',
        bottom: +25,
        right: +25,
        opacity: 0.85,
    },
    mainIcon: {
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    // Estilos de iconos sofisticados para "Large Icons" que flotan libres
    iconSophisticatedContainer: {
        position: 'absolute',
        right: -15, // Empujado más afuera para cortarlo
        bottom: -15, // Empujado más afuera
        opacity: 0.9,
    },
    iconGlow: {
        position: 'absolute',
        width: 100, // Glow más masivo
        height: 100,
        borderRadius: 50,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        opacity: 0.25,
    },
    iconGlass: {
        padding: 24, // Cristal más ancho
        borderRadius: 45, // Más circular para el padding
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.4)',
        overflow: 'hidden',
    },
    // Variants
    small: {
        width: '48%',
        aspectRatio: 1,
    },
    wide: {
        width: '100%',
        height: 120,
    },
    tall: {
        width: '48%',
        height: 250,
    },
    full: {
        width: '100%',
        height: 200,
    },
    large: {
        width: '100%',
        height: 145,
    },
    medium: {
        width: '48%',
        height: 145,
    },
    cinematic: {
        width: '100%',
        height: 180,
    },
    cinematicOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 24,
    },
    cinematicContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cinematicPlayButton: {
        marginTop: 20,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    cinematicPlayGlass: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vinyl: {
        width: '85%', // Make it significantly larger
        aspectRatio: 1, // Perfect square
        borderRadius: 500, // Massive border radius for perfect circle
        alignSelf: 'center', // Center in the container
        borderWidth: 6,
        borderColor: '#111', // Outer vinyl rim
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
        backgroundColor: '#000',
        padding: 0,
    },
    vinylRecordContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderRadius: 500, // Must match the wrapper
        overflow: 'hidden',
    },
    vinylGroves: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 500,
        margin: 15,
    },
    vinylGrovesInner: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 500,
        margin: 30,
    },
    vinylLabel: {
        width: '48%', // Slightly larger label to match bigger disc
        height: '48%',
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    vinylCenterHole: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#020617', // Match dark theme bg
        top: '50%',
        left: '50%',
        transform: [{ translateX: -7 }, { translateY: -7 }],
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        zIndex: 20,
    },
    vinylLabelTitle: {
        fontSize: 14,
        fontFamily: 'Outfit_900Black',
        color: '#111',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 16,
    },
    vinylLabelSubtitle: {
        fontSize: 8,
        fontFamily: 'Outfit_600SemiBold',
        color: 'rgba(0,0,0,0.6)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    silhouetteContainer: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    },
    silhouetteImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
    silhouetteContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    silhouettePrefix: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: '#FFFFFF',
        marginBottom: 4,
        textShadowColor: '#000000',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 15,
    },
    silhouetteTitle: {
        fontSize: 34,
        fontFamily: 'Outfit_900Black',
        color: '#FFFFFF',
        textAlign: 'center',
        fontStyle: 'italic',
        letterSpacing: -1,
        textShadowColor: '#000000',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 20,
    },
    silhouettePlayContainer: {
        marginTop: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    silhouette: {
        width: '100%',
        height: 280, // A bit taller to let the silhouette breathe
    }
});

export default BentoCard;
