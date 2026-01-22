import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../types';
import { theme } from '../constants/theme';

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

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(session)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: session.image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* PLUS Badge */}
                {session.isPlus && !isPlusMember && (
                    <View style={styles.plusBadge}>
                        <Ionicons name="star" size={10} color={theme.colors.accent} />
                        <Text style={styles.plusBadgeText}>PLUS</Text>
                    </View>
                )}

                {/* Play Overlay */}
                {!isLocked && (
                    <View style={styles.playOverlay}>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={20} color="#FFFFFF" />
                        </View>
                    </View>
                )}

                {/* Lock Overlay */}
                {isLocked && (
                    <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.8)" />
                    </View>
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {session.title}
                </Text>
                <Text style={styles.meta}>
                    {session.duration} min • {session.category}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.sm,
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    plusBadge: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: `${theme.colors.accent}20`,
    },
    plusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.accent,
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        paddingHorizontal: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: 4,
        lineHeight: 18,
    },
    meta: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
});

export default SessionCard;
