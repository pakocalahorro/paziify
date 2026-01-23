import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.WELCOME
>;

interface Props {
    navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    const { continueAsGuest, signInWithGoogle } = useApp();
    const [loading, setLoading] = React.useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0A0E1A', '#1A1F35', '#0A0E1A']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={['#646CFF', '#9B6BFF']}
                            style={styles.logoGradient}
                        >
                            <Ionicons name="leaf" size={40} color="#FFFFFF" />
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>Paziify</Text>
                    <Text style={styles.subtitle}>Tu Santuario de Paz Digital</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.description}>
                        Reduce el estrés y recupera el control de tu bienestar con meditación y ciencia.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                                <Text style={styles.googleButtonText}>Continuar con Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={continueAsGuest}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.guestButtonText}>Explorar como invitado</Text>
                        <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.loginOption}>
                        <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                        <Text
                            style={styles.loginLink}
                            onPress={() => navigation.navigate(Screen.LOGIN)}
                        >
                            Iniciar sesión
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A',
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 10,
        shadowColor: '#646CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#9B6BFF',
        fontWeight: '600',
        marginTop: 5,
    },
    content: {
        alignItems: 'center',
    },
    description: {
        fontSize: 18,
        color: theme.colors.textMuted,
        textAlign: 'center',
        lineHeight: 28,
        paddingHorizontal: 10,
    },
    footer: {
        gap: 20,
        marginBottom: 20,
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
    guestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    guestButtonText: {
        color: theme.colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    loginOption: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginText: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    loginLink: {
        color: theme.colors.accent,
        fontSize: 14,
        fontWeight: '700',
    },
});

export default WelcomeScreen;
