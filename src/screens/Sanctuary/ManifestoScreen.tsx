import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Animated, Easing } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../../types';
import NebulaBackground from '../../components/Sanctuary/NebulaBackground';

const ManifestoScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, Screen.MANIFESTO>>();
    const { mode } = route.params;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const manifestoText = mode === 'healing'
        ? "En el silencio de este momento, encuentras tu refugio. No hay nada que hacer, solo ser."
        : "Tu potencial está esperando ser liberado. Cada respiración es un paso hacia tu mejor versión.";

    useEffect(() => {
        // Entrance animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        // Auto-navigate to MainTabs after showing the manifesto
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                navigation.replace('MainTabs', { mode });
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [mode]);

    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                <NebulaBackground mode={mode} />
            </View>

            <SafeAreaView style={styles.content}>
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.quoteMark}>“</Text>
                    <Text style={styles.manifestoText}>{manifestoText}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.modeLabel}>
                        {mode === 'healing' ? 'Santuario de Sanación' : 'Camino de Crecimiento'}
                    </Text>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    textContainer: { alignItems: 'center' },
    quoteMark: { fontSize: 80, color: 'rgba(255,255,255,0.2)', fontFamily: 'serif', marginBottom: -40 },
    manifestoText: { fontSize: 24, color: '#FFF', textAlign: 'center', lineHeight: 36, fontWeight: '300', letterSpacing: 1 },
    divider: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 30 },
    modeLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 3 }
});

export default ManifestoScreen;
