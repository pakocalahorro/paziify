import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

type TransitionTunnelScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.TRANSITION_TUNNEL
>;

type TransitionTunnelScreenRouteProp = RouteProp<RootStackParamList, Screen.TRANSITION_TUNNEL>;

interface Props {
    navigation: TransitionTunnelScreenNavigationProp;
    route: TransitionTunnelScreenRouteProp;
}

import { useAudioPlayer } from '../../context/AudioPlayerContext';

const TransitionTunnel: React.FC<Props> = ({ navigation, route }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
    const { setExternalAudioActive } = useAudioPlayer();

    useEffect(() => {
        // Signal that we are starting a meditation-like flow
        setExternalAudioActive(true);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 4000,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            navigation.replace(Screen.BREATHING_TIMER, {
                sessionId: route.params?.sessionId
            } as any);
        }, 4500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0E1A', '#1A1F3C', '#0A0E1A']}
                style={styles.gradient}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    <View style={styles.ring1} />
                    <View style={styles.ring2} />
                    <View style={styles.ring3} />

                    <Text style={styles.text}>Prepárate para conectar</Text>
                    <Text style={styles.subtext}>Suelta todo lo demás por un momento</Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 40,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 16,
        color: theme.colors.textMuted,
        marginTop: 12,
        textAlign: 'center',
    },
    ring1: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(100, 108, 255, 0.3)',
        position: 'absolute',
    },
    ring2: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: 'rgba(100, 108, 255, 0.2)',
        position: 'absolute',
    },
    ring3: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: 'rgba(100, 108, 255, 0.1)',
        position: 'absolute',
    },
});

export default TransitionTunnel;
