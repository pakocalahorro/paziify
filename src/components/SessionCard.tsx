import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Session } from '../types';
import { theme } from '../constants/theme';

interface SessionCardProps {
    session: Session;
    onPress: (session: Session) => void;
    isPlusMember: boolean;
}

const { width } = Dimensions.get('window');

const SESSION_ASSETS: Record<string, any> = {
    'Ansiedad': require('../assets/covers/med_anxiety.png'),
    'Sueño': require('../assets/covers/med_sleep.png'),
    'Mindfulness': require('../assets/covers/med_focus.png'),
    'Resiliencia': require('../assets/covers/med_compassion.png'),
    'Despertar': require('../assets/covers/med_focus.png'),
    // Default fallback
    'default': require('../assets/covers/med_focus.png'),
};

const SessionCard: React.FC<SessionCardProps> = ({
    session,
    onPress,
    isPlusMember,
}) => {
    const isLocked = session.isPlus && !isPlusMember;

    // Get asset based on category
    const imageSource = SESSION_ASSETS[session.category] || SESSION_ASSETS['default'];

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'Ansiedad': return { color: '#66DEFF', icon: 'water-outline' };
            case 'Sueño': return { color: '#9575CD', icon: 'moon-outline' };
            case 'Mindfulness': return { color: '#FFA726', icon: 'sunny-outline' };
            case 'Resiliencia': return { color: '#FF6B9D', icon: 'heart-outline' };
            default: return { color: '#646CFF', icon: 'leaf-outline' };
        }
    };

    const { color, icon } = getCategoryStyles(session.category);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(session)}
            activeOpacity={0.9}
        >
            <View style={styles.cardInner}>
                {/* Session Image */}
                <View style={styles.imageWrapper}>
                    <Image source={imageSource} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Floating Info */}
                    <View style={styles.floatingHeader}>
                        <View style={[styles.durationBadge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                            <Ionicons name="time-outline" size={10} color="#FFFFFF" />
                            <Text style={styles.durationText}>{session.duration}m</Text>
                        </View>
                        {isLocked && (
                            <View style={styles.lockBadge}>
                                <Ionicons name="lock-closed" size={10} color="#FFD700" />
                            </View>
                        )}
                    </View>
                </View>

                {/* Content Glass */}
                <BlurView intensity={25} tint="dark" style={styles.infoGlass}>
                    <View style={styles.headerRow}>
                        <View style={[styles.categoryIndicator, { backgroundColor: color }]} />
                        <Text style={[styles.categoryText, { color }]}>{session.category.toUpperCase()}</Text>
                    </View>

                    <Text style={styles.title} numberOfLines={1}>{session.title}</Text>

                    <View style={styles.footerRow}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Ionicons key={s} name="star" size={8} color="#FFD700" style={{ opacity: 0.8 }} />
                            ))}
                        </View>
                        <TouchableOpacity style={[styles.miniPlay, { backgroundColor: `${color}40` }]}>
                            <Ionicons name="play" size={12} color={color} />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: theme.spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    cardInner: {
        flex: 1,
    },
    imageWrapper: {
        width: '100%',
        height: 120,
        backgroundColor: '#111',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    floatingHeader: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4,
    },
    durationText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    lockBadge: {
        padding: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    infoGlass: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryIndicator: {
        width: 3,
        height: 8,
        borderRadius: 2,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stars: {
        flexDirection: 'row',
        gap: 2,
    },
    miniPlay: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SessionCard;
