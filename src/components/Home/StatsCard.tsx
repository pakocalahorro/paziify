import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, icon, color }) => {
    return (
        <BlurView intensity={30} tint="dark" style={[styles.container, { backgroundColor: 'rgba(2, 6, 23, 0.4)' }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.valueRow}>
                    <Text style={styles.value}>{value}</Text>
                    <Text style={styles.unit}>{unit}</Text>
                </View>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    value: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
    },
    unit: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
    },
});

export default StatsCard;
