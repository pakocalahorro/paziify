import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../../types';
import NebulaBackground from '../../components/Sanctuary/NebulaBackground';
import LiquidOrb from '../../components/Sanctuary/LiquidOrb';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const CompassScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedMode, setSelectedMode] = useState<'healing' | 'growth' | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSelect = (mode: 'healing' | 'growth') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setSelectedMode(mode);

        // Visual feedback: brief extra pulse or scaling could go here
        setTimeout(() => {
            navigation.navigate(Screen.MANIFESTO, { mode });
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                <NebulaBackground mode={selectedMode || 'healing'} />
            </View>

            <SafeAreaView style={styles.content}>
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
                    <Text style={styles.subtitle}>Sintoniza tu energía</Text>
                    <Text style={styles.title}>La Brújula Interior</Text>
                </Animated.View>

                <View style={[styles.orbsContainer, { marginTop: -40 }]}>
                    {/* Healing */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelect('healing')}
                        style={[styles.orbWrapper, selectedMode === 'growth' && { opacity: 0.1, transform: [{ scale: 0.8 }] }]}
                    >
                        <LiquidOrb color="#6366F1" size={width * 0.45} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.orbLabel}>Sanar</Text>
                            <Text style={styles.orbDesc}>Paz Profunda</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Growth */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelect('growth')}
                        style={[styles.orbWrapper, selectedMode === 'healing' && { opacity: 0.1, transform: [{ scale: 0.8 }] }]}
                    >
                        <LiquidOrb color="#F59E0B" size={width * 0.45} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.orbLabel}>Crecer</Text>
                            <Text style={styles.orbDesc}>Vitalidad</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Text style={styles.hint}>¿Hacia dónde te guía tu pulso hoy?</Text>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
    header: { alignItems: 'center', marginTop: 40 },
    title: { fontSize: 34, fontWeight: '200', color: '#FFF', letterSpacing: 3, textAlign: 'center' },
    subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 5, marginBottom: 12 },
    orbsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 15 },
    orbWrapper: { alignItems: 'center', transition: 'all 0.5s ease' },
    labelContainer: { alignItems: 'center', marginTop: 15 },
    orbLabel: { color: '#FFF', fontSize: 22, fontWeight: '600', letterSpacing: 1.5 },
    orbDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    footer: { marginBottom: 30 },
    hint: { color: 'rgba(255,255,255,0.35)', fontSize: 15, fontStyle: 'italic', fontWeight: '300' }
});

export default CompassScreen;
