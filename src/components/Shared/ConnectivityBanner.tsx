import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ConnectivityBanner: React.FC = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [status, setStatus] = useState<'offline' | 'online' | 'syncing' | 'none'>('none');
    const insets = useSafeAreaInsets();
    const anim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const wasOffline = isConnected === false;
            setIsConnected(state.isConnected);

            if (state.isConnected === false) {
                setStatus('offline');
                show();
            } else if (wasOffline && state.isConnected) {
                setStatus('syncing');
                show();
                // Ocultar tras unos segundos de sincronización
                setTimeout(() => hide(), 3500);
            } else if (state.isConnected && status === 'offline') {
                // Si vuelve de repente sin pasar por estado offline previo en este efecto
                hide();
            }
        });

        return () => unsubscribe();
    }, [isConnected, status]);

    const show = () => {
        Animated.spring(anim, {
            toValue: insets.top > 0 ? insets.top : 20, // Ajustar debajo del notch si existe
            useNativeDriver: true,
            bounciness: 8
        }).start();
    };

    const hide = () => {
        Animated.timing(anim, {
            toValue: -150,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            if (isConnected) setStatus('none');
        });
    };

    if (status === 'none') return null;

    const isOffline = status === 'offline';

    return (
        <Animated.View 
            style={[
                styles.container, 
                { 
                    transform: [{ translateY: anim }],
                    backgroundColor: isOffline ? '#F59E0B' : '#10B981', // Amber-500 y Emerald-500
                }
            ]}
        >
            <Text style={styles.text}>
                {isOffline ? '⚠️ Sin conexión - Trabajando en local' : '✅ Conexión recuperada - Sincronizando'}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        width: '80%',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    text: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center'
    }
});
