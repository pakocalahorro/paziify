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
import { LinearGradient } from 'expo-linear-gradient';
import { Session } from '../types';
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

    const getCategoryStyles = (category: string) => {
        switch (category.toLowerCase()) {
            case 'ansiedad': return { color: '#66DEFF', icon: 'water-outline' };
            case 'sueño': return { color: '#9575CD', icon: 'moon-outline' };
            case 'mindfulness': return { color: '#FFA726', icon: 'sunny-outline' };
            case 'resiliencia': return { color: '#FF6B9D', icon: 'heart-outline' };
            case 'despertar': return { color: '#FFA726', icon: 'sunny-outline' };
            default: return { color: '#646CFF', icon: 'leaf-outline' };
        }
    };

    const { color } = getCategoryStyles(session.category);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(session)}
            activeOpacity={0.8}
        >
            <View style={styles.cardInner}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
                        style={styles.image}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                        style={StyleSheet.absoluteFill}
                    />
                    {isLocked && (
                        <View style={styles.lockBadge}>
                            <Ionicons name="lock-closed" size={10} color="#FFD700" />
                        </View>
                    )}
                </View>

                <View style={styles.contentWrapper}>
                    <View style={styles.headerRow}>
                        <View style={[styles.categoryIndicator, { backgroundColor: color }]} />
                        <Text style={[styles.categoryText, { color }]}>{session.category.toUpperCase()}</Text>
                        <View style={styles.spacer} />
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={10} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.durationText}>{session.duration}m</Text>
                        </View>
                    </View>

                    <Text style={styles.title} numberOfLines={1}>{session.title}</Text>

                    <View style={styles.footerRow}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Ionicons key={s} name="star" size={8} color="#FFD700" style={{ opacity: 0.6 }} />
                            ))}
                        </View>
                        <View style={[styles.miniPlay, { backgroundColor: `${color}20` }]}>
                            <Ionicons name="play" size={12} color={color} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 90,
        marginBottom: 12,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(25, 30, 45, 0.4)',
    },
    cardInner: {
        flex: 1,
        flexDirection: 'row',
    },
    imageWrapper: {
        width: 90,
        height: '100%',
        backgroundColor: '#111',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIndicator: {
        width: 3,
        height: 8,
        borderRadius: 2,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    spacer: {
        flex: 1,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '700',
    },
    lockBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        padding: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.3,
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
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SessionCard;
