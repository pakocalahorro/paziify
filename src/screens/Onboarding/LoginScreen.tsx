import React, { useState, useRef } from 'react';
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
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

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
    const videoRef = useRef<Video>(null);

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
            {/* 1. Immersive Video Background (Lowest Layer) */}
            <View style={StyleSheet.absoluteFillObject}>
                <LinearGradient
                    colors={['#0F2027', '#203A43', '#2C5364']}
                    style={StyleSheet.absoluteFillObject}
                />
                <Video
                    ref={videoRef}
                    source={{
                        uri: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/login.mp4',
                    }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    isLooping
                    isMuted
                    posterSource={require('../../../assets/splash-icon.png')}
                    posterStyle={{ resizeMode: 'cover' }}
                    useNativeControls={false}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded === false) {
                            // Video failed to load, stays on gradient/poster
                            console.log('[LoginScreen] Video failed to load, using fallback');
                        }
                    }}
                />
                {/* 2. Night-mode mist overlay to ensure text readability */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,10,20,0.95)']}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            {/* 3. Foreground Content with transparent OasisScreen */}
            <OasisScreen style={styles.transparentOverlay} hideBackground preset="scroll" showSafeOverlay={false}>
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
                            title="Continuar con Google"
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

                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>

                </View>
            </OasisScreen>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    transparentOverlay: {
        backgroundColor: 'transparent',
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
        padding: theme.spacing.md,
    },
    backText: {
        color: '#FFF',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default LoginScreen;
