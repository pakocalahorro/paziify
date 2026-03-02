import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../../types';
import { useApp } from '../../context/AppContext';
import { theme } from '../../constants/theme';
import { OasisScreen } from '../../components/Oasis/OasisScreen';

const { width } = Dimensions.get('window');

const QUOTES = [
    { text: "El silencio no es la ausencia de sonido, sino la presencia de ti mismo.", author: "Gaia" },
    { text: "Cada respiración es una oportunidad para volver al centro.", author: "Ziro" },
    { text: "No busques el camino, tú eres el camino.", author: "Gaia" },
    { text: "La paz comienza con una decisión consciente.", author: "Ziro" },
    { text: "Tu resiliencia es el arte de florecer en la adversidad.", author: "Gaia" },
    { text: "Sintoniza con tu frecuencia más elevada aquí y ahora.", author: "Ziro" }
];

const SpiritualPreloader = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { isFirstEntryOfDay, userState } = useApp();
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation sequence
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(3500), // User request: stay for 3-4 seconds
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Decision logic: If there's an active challenge, bypass Compass
            if (isFirstEntryOfDay) {
                if (userState.activeChallenge) {
                    // @ts-ignore
                    navigation.replace('MainTabs');
                } else {
                    navigation.replace(Screen.COMPASS);
                }
            } else {
                // @ts-ignore
                navigation.replace('MainTabs');
            }
        });
    }, [isFirstEntryOfDay, userState.activeChallenge]);

    return (
        <OasisScreen hideBackground={false} preset="fixed" style={{ backgroundColor: '#0A0E1A' }} showSafeOverlay={false}>
            <View style={styles.container}>
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <Text style={styles.brandName}>PAZIIFY</Text>
                    <Text style={styles.quoteMark}>“</Text>
                    <Text style={styles.quoteText}>{quote.text}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.author}>{quote.author}</Text>
                </Animated.View>

                {/* Subtle pulse loader at bottom */}
                <View style={styles.loaderContainer}>
                    <View style={styles.loaderDot} />
                    <Text style={styles.loadingText}>Sincronizando con el Santuario...</Text>
                </View>
            </View>
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    content: {
        alignItems: 'center',
    },
    brandName: {
        fontFamily: 'Outfit_900Black',
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: 8,
        marginBottom: 20,
    },
    quoteMark: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 120,
        color: 'rgba(255,255,255,0.08)',
        marginBottom: -60,
    },
    quoteText: {
        fontFamily: 'Outfit_300Light',
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 36,
    },
    divider: {
        width: 40,
        height: 1,
        backgroundColor: '#FFFFFF',
        marginVertical: 30,
        opacity: 0.2,
    },
    author: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    loaderContainer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
        gap: 12,
    },
    loaderDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        opacity: 0.3,
    },
    loadingText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default SpiritualPreloader;
