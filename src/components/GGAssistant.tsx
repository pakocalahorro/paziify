import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface GGAssistantProps {
    title: string;
    message: string;
    type?: 'default' | 'recovery' | 'night';
    actionLabel?: string;
    onAction?: () => void;
}

const GGAssistant: React.FC<GGAssistantProps> = ({
    title,
    message,
    type = 'default',
    actionLabel,
    onAction,
}) => {
    const getIconName = () => {
        switch (type) {
            case 'recovery':
                return 'refresh-circle';
            case 'night':
                return 'moon';
            default:
                return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'recovery':
                return '#F97316'; // orange
            case 'night':
                return '#818CF8'; // indigo
            default:
                return theme.colors.primary;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name={getIconName()}
                    size={20}
                    color={getIconColor()}
                    style={styles.icon}
                />
                <Text style={styles.title}>{title}</Text>
            </View>

            <Text style={styles.message}>{message}</Text>

            {actionLabel && onAction && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onAction}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>{actionLabel}</Text>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    icon: {
        marginRight: theme.spacing.xs,
    },
    title: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.textMain,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 14,
        color: theme.colors.textMuted,
        lineHeight: 20,
        marginBottom: theme.spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: theme.spacing.xs,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
        marginRight: theme.spacing.xs,
    },
});

export default GGAssistant;
