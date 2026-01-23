import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';

interface Props {
    onPressRegister: () => void;
}

const GuestBanner: React.FC<Props> = ({ onPressRegister }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={20} color="#F59E0B" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Estás en Modo Invitado</Text>
                <Text style={styles.message}>
                    Tu progreso no se está guardando. <Text style={styles.link} onPress={onPressRegister}>Regístrate con Google</Text> para asegurar tu camino de paz.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F59E0B',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 18,
    },
    link: {
        color: '#646CFF',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});

export default GuestBanner;
