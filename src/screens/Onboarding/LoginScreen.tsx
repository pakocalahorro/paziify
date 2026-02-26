import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

// PDS Primitives
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisButton } from '../../components/Oasis/OasisButton';
import { BlurView } from 'expo-blur';

const { height } = Dimensions.get('window');

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
        <OasisScreen style={styles.container} preset="scroll">
            <View style={styles.content}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.signature}>Bienvenido de nuevo</Text>
                    <Text style={styles.title}>Cruza el Portal</Text>
                    <Text style={styles.subtitle}>Retoma tu camino de paz donde lo dejaste.</Text>
                </View>

                {/* Main Action Form / Buttons */}
                <View style={styles.formContainer}>
                    <OasisButton
                        title="Iniciar Sesión con Google"
                        onPress={handleGoogleLogin}
                        variant="primary"
                        icon="logo-google"
                        loading={loading}
                    />

                    <BlurView intensity={20} tint="dark" style={styles.infoBox}>
                        <Ionicons name="shield-checkmark" size={24} color={theme.colors.accent} />
                        <Text style={styles.infoText}>
                            Usamos Google para asegurar que solo tú tengas acceso a tu progreso de forma instantánea.
                        </Text>
                    </BlurView>
                </View>

            </View>
        </OasisScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: height * 0.05,
    },
    header: {
        marginBottom: theme.spacing.xxl,
        alignItems: 'center',
    },
    signature: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 32,
        color: theme.colors.accent,
        transform: [{ rotate: '-2deg' }],
        marginBottom: 8,
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 42,
        color: '#FFFFFF',
        letterSpacing: 1,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: theme.spacing.lg,
    },
    formContainer: {
        width: '100%',
        gap: theme.spacing.xl,
        marginTop: theme.spacing.lg,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: theme.spacing.md,
        overflow: 'hidden',
    },
    infoText: {
        flex: 1,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        lineHeight: 20,
    },
});

export default LoginScreen;
