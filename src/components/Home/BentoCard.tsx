import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    StyleProp,
    ViewStyle,
    ImageBackground,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

interface BentoCardProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'small' | 'wide' | 'tall' | 'full' | 'large' | 'medium';
    accentColor?: string;
    backgroundImage?: string;
    largeIcon?: boolean;
    ctaText?: string; // New prop
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
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const renderContent = () => (
        <>
            <View style={styles.header}>
                {icon && !largeIcon && (
                    <View style={[styles.iconContainer, { backgroundColor: `${accentColor}40` }]}>
                        <Ionicons name={icon} size={18} color={accentColor} />
                    </View>
                )}
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>
            </View>
            <View style={[styles.content, largeIcon && styles.largeIconContent]}>
                {largeIcon && icon && (
                    <View style={styles.iconSophisticatedContainer}>
                        <View style={[styles.iconGlow, { backgroundColor: accentColor }]} />
                        <BlurView intensity={30} tint="light" style={styles.iconGlass}>
                            <Ionicons name={icon} size={44} color="#FFF" style={styles.mainIcon} />
                        </BlurView>
                    </View>
                )}
                {children}

                {ctaText && (
                    <View style={styles.ctaContainer}>
                        <BlurView intensity={40} tint="light" style={styles.ctaButton}>
                            <Text style={styles.ctaText}>{ctaText}</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </BlurView>
                    </View>
                )}
            </View>
        </>
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
                {backgroundImage ? (
                    <ImageBackground
                        source={{ uri: backgroundImage }}
                        style={styles.backgroundImage}
                        imageStyle={{ borderRadius: 24 }}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                            style={styles.gradientOverlay}
                        >
                            {renderContent()}
                        </LinearGradient>
                    </ImageBackground>
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
        justifyContent: 'space-between',
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
        fontSize: 14,
        fontWeight: '800',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
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
        fontSize: 12,
        fontWeight: '700',
    },
    largeIconContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainIcon: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },
    iconSophisticatedContainer: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconGlow: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        opacity: 0.4,
        transform: [{ scale: 1.5 }],
    },
    iconGlass: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
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
        height: 170,
    },
    medium: {
        width: '48%',
        height: 180,
    },
});

export default BentoCard;
