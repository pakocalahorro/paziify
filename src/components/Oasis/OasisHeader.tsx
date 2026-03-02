import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';

interface OasisHeaderProps {
    path?: string[];
    title: string;
    onBack?: () => void;
    onPathPress?: (index: number) => void;
    showEvolucion?: boolean;
    onEvolucionPress?: () => void;
    userName?: string;
    avatarUrl?: string;
    onProfilePress?: () => void;
    onSettingsPress?: () => void;
    onSearchPress?: () => void;
    onFilterPress?: () => void;
    onAdminPress?: () => void;
    activeChallengeType?: 'reto' | 'mision' | 'desafio' | null;
    style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Premium Action Button with Snake Border & Pulse Glow
// ---------------------------------------------------------------------------
const AnimatedEvolucionButton = ({ onPress, isActive, challengeColor }: { onPress?: () => void, isActive: boolean, challengeColor: string }) => {
    const rotation = useSharedValue(0);
    useEffect(() => {
        if (isActive) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 2500, easing: Easing.linear }),
                -1
            );
        } else {
            rotation.value = 0;
        }
    }, [isActive]);

    const animatedSnakeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });


    if (!isActive) {
        return (
            <TouchableOpacity onPress={onPress} style={styles.evolucionButton}>
                <BlurView intensity={30} tint="light" style={styles.sparkleBlur}>
                    <Ionicons name="sparkles" size={16} color="#FBBF24" />
                    <Text style={styles.evolucionText}>EVOLUCIÓN</Text>
                </BlurView>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.animatedButtonContainer}>
            {/* Snake Border Shell */}
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.snakeBorderContainer}>
                {/* Rotating Thematic Light Ray */}
                <Animated.View style={[styles.snakeLightWrapper, animatedSnakeStyle]}>
                    <LinearGradient
                        colors={[challengeColor, `${challengeColor}20`, 'transparent']}
                        style={styles.snakeGradient}
                    />
                </Animated.View>

                {/* Inner Button Mask with Frosted Glass. The spinning light bleeds underneath it */}
                <View style={styles.innerActiveButton}>
                    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
                    <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                    <Text style={[styles.evolucionText, { color: '#FFF' }]}>ACTIVO</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
// ---------------------------------------------------------------------------

/**
 * OasisHeader: Master Corporative Header
 * Full width, integrated safe areas, support for single/dual line layouts, 
 * interactive breadcrumbs and Navy Blue (Azul Marino) premium aesthetic.
 */
export const OasisHeader: React.FC<OasisHeaderProps> = ({
    path = [],
    title,
    onBack,
    onPathPress,
    showEvolucion = false,
    onEvolucionPress,
    userName,
    avatarUrl,
    onProfilePress,
    onSettingsPress,
    onSearchPress,
    onFilterPress,
    onAdminPress,
    activeChallengeType: propActiveChallengeType,
    style,
}) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();

    const activeChallengeType = propActiveChallengeType !== undefined
        ? propActiveChallengeType
        : (userState?.activeChallenge?.type as 'reto' | 'mision' | 'desafio' | undefined);

    // Challenge Colors
    const challengeColor =
        activeChallengeType === 'mision' ? '#FBBF24' : // Amber/Gold
            activeChallengeType === 'reto' ? '#8B5CF6' :   // Violet/Purple
                activeChallengeType === 'desafio' ? '#2DD4BF' : // Teal
                    'transparent';

    // We convert the hex to rgba for the gradient
    const getGradientColors = () => {
        if (!activeChallengeType || challengeColor === 'transparent') {
            return ['rgba(10, 14, 26, 1.0)', 'rgba(10, 14, 26, 0.85)', 'rgba(10, 14, 26, 0.45)', 'rgba(10, 14, 26, 0.15)', 'transparent'] as const;
        }

        // Add a tint of the challenge color to the top of the header
        return [
            challengeColor, // Top solid color
            `${challengeColor}99`, // 60% opacity
            `${challengeColor}40`, // 25% opacity
            'rgba(10, 14, 26, 0.5)', // Fade into the dark background
            'transparent'
        ] as const;
    };

    const renderThread = () => (
        <View style={styles.threadContainer}>
            {onBack && userName && (
                <TouchableOpacity onPress={onBack} style={styles.inlineBack} hitSlop={styles.hitSlop}>
                    <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            )}

            {path.map((segment, index) => (
                <View key={index} style={styles.segmentWrapper}>
                    <TouchableOpacity
                        onPress={() => onPathPress?.(index)}
                        disabled={!onPathPress}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.pathText}>{segment}</Text>
                    </TouchableOpacity>
                    <Text style={styles.separator}> / </Text>
                </View>
            ))}
            <Text style={styles.titleText}>{title.toUpperCase()}</Text>
            {onFilterPress && (
                <TouchableOpacity
                    onPress={onFilterPress}
                    style={styles.filterButtonInline}
                    hitSlop={styles.hitSlop}
                >
                    <Ionicons name="options-outline" size={18} color="#FB7185" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={[styles.masterWrapper, { paddingTop: insets.top }, style]}>
            {/* Smoke Gradient Background - Bleeding out to transparent */}
            <LinearGradient
                colors={getGradientColors()}
                style={[StyleSheet.absoluteFill, { height: '170%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.45, 0.75, 0.9, 1]}
            />

            {/* Optional Glow for Active Challenge */}
            {activeChallengeType && (
                <View style={[styles.activeGlow, { backgroundColor: challengeColor, opacity: 0.3 }]} />
            )}

            <View style={styles.headerContent}>
                <View style={styles.topRow}>
                    {/* Left Group: Back, Settings or Evolución */}
                    <View style={styles.leftGroup}>
                        {onBack && !userName ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={onBack}
                                    hitSlop={styles.hitSlop}
                                    style={styles.backButton}
                                >
                                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                                </TouchableOpacity>
                                {onSearchPress && (
                                    <TouchableOpacity
                                        onPress={onSearchPress}
                                        style={[styles.actionCircle, { marginLeft: 8, width: 32, height: 32 }]}
                                    >
                                        <Ionicons name="search" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : userName ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {showEvolucion && (
                                    <AnimatedEvolucionButton
                                        onPress={onEvolucionPress}
                                        isActive={!!activeChallengeType}
                                        challengeColor={challengeColor}
                                    />
                                )}
                            </View>
                        ) : showEvolucion ? (
                            <AnimatedEvolucionButton
                                onPress={onEvolucionPress}
                                isActive={!!activeChallengeType}
                                challengeColor={challengeColor}
                            />
                        ) : (
                            <Ionicons name="leaf-outline" size={24} color="rgba(255,255,255,0.2)" />
                        )}
                    </View>

                    {!userName && (
                        <View style={styles.centerGroup}>
                            {renderThread()}
                        </View>
                    )}

                    <View style={styles.rightGroup}>
                        {userName ? (
                            <View style={styles.profileRow}>
                                <TouchableOpacity onPress={onProfilePress} style={styles.profileBox}>
                                    <View style={styles.textRight}>
                                        <Text style={styles.userLabel}>MI PERFIL</Text>
                                        <Text style={styles.userNameText} numberOfLines={1}>{userName}</Text>
                                    </View>
                                    <Image
                                        source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                                        style={styles.avatarMini}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={onProfilePress} style={styles.actionCircle}>
                                <Ionicons name="person-outline" size={20} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {userName && (
                    <View style={styles.bottomRow}>
                        <View style={styles.bottomAlignment}>
                            {onAdminPress && (
                                <TouchableOpacity
                                    onPress={onAdminPress}
                                    style={styles.showcaseButton}
                                >
                                    <Ionicons name="color-palette" size={16} color="#2DD4BF" />
                                </TouchableOpacity>
                            )}
                            {renderThread()}
                        </View>
                    </View>
                )}
            </View>
        </View >
    );
};


const styles = StyleSheet.create({
    masterWrapper: {
        width: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
    },
    activeGlow: {
        position: 'absolute',
        top: -10,
        left: '20%',
        right: '20%',
        height: 20,
        borderRadius: 20,
        opacity: 0.3,
        shadowRadius: 30,
        elevation: 20,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingBottom: 6,
    },
    topRow: {
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomRow: {
        marginTop: 0,
        paddingHorizontal: 4,
    },
    bottomAlignment: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showcaseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(45, 212, 191, 0.3)',
    },
    leftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        // Removed flex: 1 to prevent pushing profile to the right
    },
    centerGroup: {
        flex: 1,
        alignItems: 'center',
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8, // Small gap as requested by user
    },
    backButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
    },
    evolucionButton: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    sparkleBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    titleText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1,
        marginTop: 2,
    },
    evolucionText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 10,
        color: '#FFF',
        letterSpacing: 1,
    },
    animatedButtonContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    snakeBorderContainer: {
        width: 100,
        height: 32,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)', // Very subtle glass back
        justifyContent: 'center',
        alignItems: 'center',
    },
    snakeLightWrapper: {
        position: 'absolute',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    snakeGradient: {
        width: '50%',
        height: '50%',
        position: 'absolute',
        top: 0,
        left: '25%',
    },
    innerActiveButton: {
        position: 'absolute',
        top: 1.5,
        bottom: 1.5,
        left: 1.5,
        right: 1.5,
        backgroundColor: 'transparent', // Let BlurView do the work
        borderRadius: 18.5,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        gap: 6,
    },
    threadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    segmentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inlineBack: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 4,
    },
    pathText: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 18,
        color: 'rgba(255,255,255,0.4)',
    },
    separator: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: 'rgba(255,255,255,0.2)',
        marginTop: 4,
        marginHorizontal: 2,
    },
    filterButtonInline: {
        marginLeft: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(251, 113, 133, 0.2)',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 1,
    },
    textRight: {
        alignItems: 'flex-end',
    },
    userLabel: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 8,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
    },
    userNameText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 13,
        color: '#FFF',
        maxWidth: 150,
    },
    avatarMini: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBorder: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        position: 'absolute',
        bottom: 0,
    },
    hitSlop: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    }
});
