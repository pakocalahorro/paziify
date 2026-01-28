import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Session } from '../types';
import { theme } from '../constants/theme';
import { IMAGES } from '../constants/images';

const { width } = Dimensions.get('window');

const SESSION_ASSETS: Record<string, any> = {
    'ansiedad': IMAGES.SESSION_PEACE,
    'sueño': 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&q=80',
    'mindfulness': IMAGES.SESSION_JOY,
    'resiliencia': IMAGES.SESSION_MOTIVATION,
    'despertar': IMAGES.SESSION_ENERGY,
    'default': IMAGES.SESSION_PEACE,
};

interface SessionCardProps {
    session: Session;
    onPress: (session: Session) => void;
    isPlusMember: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
    session,
    onPress,
    isPlusMember,
}) => {
    const isLocked = session.isPlus && !isPlusMember;
    const catKey = session.category.toLowerCase();
    const imageSource = SESSION_ASSETS[catKey] || SESSION_ASSETS['default'];

    const getCategoryDetails = (category: string) => {
        switch (category.toLowerCase()) {
            case 'ansiedad':
                return { icon: 'water-outline', color: '#66DEFF', gradient: ['rgba(102, 222, 255, 0.2)', 'rgba(0, 188, 212, 0.4)'] };
            case 'sueño':
                return { icon: 'moon-outline', color: '#9575CD', gradient: ['rgba(149, 117, 205, 0.2)', 'rgba(103, 58, 183, 0.4)'] };
            case 'mindfulness':
                return { icon: 'leaf-outline', color: '#66BB6A', gradient: ['rgba(102, 187, 106, 0.2)', 'rgba(67, 160, 71, 0.4)'] };
            case 'resiliencia':
                return { icon: 'heart-outline', color: '#FF6B9D', gradient: ['rgba(255, 107, 157, 0.2)', 'rgba(196, 69, 105, 0.4)'] };
            case 'despertar':
                return { icon: 'sunny-outline', color: '#FFA726', gradient: ['rgba(255, 167, 38, 0.2)', 'rgba(251, 140, 0, 0.4)'] };
            default:
                return { icon: 'medkit-outline', color: '#646CFF', gradient: ['rgba(100, 108, 255, 0.2)', 'rgba(79, 86, 217, 0.4)'] };
        }
    };

    const { icon, color, gradient } = getCategoryDetails(session.category);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(session)}
            activeOpacity={0.9}
        >
            <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
                <ImageBackground
                    source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
                    style={styles.mainContent}
                    imageStyle={{ opacity: 0.15 }}
                >
                    {/* Category indicator line */}
                    <LinearGradient
                        colors={gradient as any}
                        style={styles.categoryLine}
                    />

                    <View style={styles.cardBody}>
                        <View style={styles.header}>
                            <View style={styles.categoryBadge}>
                                <Ionicons name={icon as any} size={14} color={color} />
                                <Text style={[styles.categoryText, { color }]}>{session.category.toUpperCase()}</Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                                <Text style={styles.durationText}>{session.duration} min</Text>
                            </View>
                        </View>

                        <Text style={styles.title} numberOfLines={2}>{session.title}</Text>

                        {/* 
                           Si tuviéramos subtítulo/descripción corta en el objeto Session 
                           podríamos ponerlo aquí, igual que en StoryCard.
                           De momento, usamos el espacio para separar visualmente.
                        */}
                        <View style={{ height: 8 }} />

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
                </ImageBackground>
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
        paddingVertical: 0,
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
        justifyContent: 'space-between',
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
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
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
    chevronContainer: {
        justifyContent: 'center',
        paddingRight: 4,
    },
});

export default SessionCard;
