import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LOGIN
>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const { signInWithGoogle } = useApp();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Bienvenido de{'\n'}
                        <Text style={styles.titleAccent}>Nuevo</Text>
                    </Text>
                    <Text style={styles.subtitle}>Retoma tu camino de paz sin complicaciones.</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                                <Text style={styles.googleButtonText}>Iniciar Sesión con Google</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="shield-checkmark" size={20} color={theme.colors.textMuted} />
                    <Text style={styles.infoText}>
                        Usamos Google para asegurar que solo tú tengas acceso a tu progreso de forma instantánea.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backButton: {
        marginTop: 20,
        marginLeft: 20,
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'center',
        marginTop: -60,
    },
    header: {
        marginBottom: theme.spacing.xxl,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.sm,
        lineHeight: 44,
    },
    titleAccent: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.textMuted,
        lineHeight: 26,
    },
    buttonContainer: {
        marginTop: 20,
    },
    googleButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: theme.borderRadius.xl,
        gap: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    googleButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    infoBox: {
        flexDirection: 'row',
        marginTop: 40,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    infoText: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: 13,
        lineHeight: 18,
    },
});

export default LoginScreen;
