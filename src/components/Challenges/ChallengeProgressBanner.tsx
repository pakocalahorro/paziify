import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { ActiveChallenge } from '../../types';

interface ChallengeProgressBannerProps {
    challenge: ActiveChallenge;
}

const ChallengeProgressBanner: React.FC<ChallengeProgressBannerProps> = ({ challenge }) => {
    // Usamos el número real de días del reto para los puntos
    const numDots = challenge.totalDays;
    
    return (
        <BlurView intensity={30} tint="dark" style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="trophy-outline" size={14} color="#FBBF24" />
                <Text style={styles.title}>
                    RUMBO A: {challenge.title.toUpperCase()}
                </Text>
            </View>
            
            <View style={styles.progressContainer}>
                <View style={styles.dotsRow}>
                    {[...Array(numDots)].map((_, i) => {
                        const isCompleted = i < challenge.daysCompleted;
                        const isNext = i === challenge.daysCompleted;
                        
                        return (
                            <View 
                                key={i} 
                                style={[
                                    styles.dot, 
                                    isCompleted && styles.dotCompleted,
                                    isNext && styles.dotActive
                                ]} 
                            />
                        );
                    })}
                </View>
                <Text style={styles.counterText}>
                    DÍA {challenge.daysCompleted}/{challenge.totalDays}
                </Text>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FBBF24',
        letterSpacing: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 4,
    },
    dot: {
        width: 12,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    dotCompleted: {
        backgroundColor: '#FBBF24',
    },
    dotActive: {
        backgroundColor: 'rgba(251, 191, 36, 0.4)',
        borderWidth: 1,
        borderColor: '#FBBF24',
    },
    counterText: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
    },
});

export default ChallengeProgressBanner;
