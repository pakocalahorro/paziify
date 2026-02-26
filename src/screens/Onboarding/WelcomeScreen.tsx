import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

// PDS Primitives
import { OasisButton } from '../../components/Oasis/OasisButton';
import { OasisScreen } from '../../components/Oasis/OasisScreen';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.WELCOME
>;

interface Props {
    navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    const { continueAsGuest, signInWithGoogle } = useApp();
    const [loading, setLoading] = useState(false);
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
                {/* Fallback majestic gradient while video loads or if it fails */}
                <LinearGradient
                    colors={['#0F2027', '#203A43', '#2C5364']}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* Immersive Video Player (expo-av) */}
                <Video
                    ref={videoRef}
                    source={{
                        // Placeholder video to preview the Vanguard layout (Google Cloud Storage)
                        // TODO [CEO]: Reemplazar por tu enlace de Supabase Storage una vez subas el video inmersivo final.
                        uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                    }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    isLooping
                    isMuted
                    posterSource={require('../../../assets/splash-icon.png')}
                    posterStyle={{ resizeMode: 'cover' }}
                    onError={(error) => console.log('Video Playback Error (Supabase):', error)}
                />
                {/* 2. Night-mode mist overlay to ensure text readability */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,10,20,0.95)']}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            {/* 3. Foreground Content with transparent OasisScreen */}
            <OasisScreen style={styles.transparentOverlay} hideBackground preset="fixed">
                <View style={styles.contentWrapper}>

                    {/* Spiritual Header */}
                    <View style={styles.header}>
                        <View style={styles.brandBadge}>
                            <Ionicons name="leaf" size={24} color={theme.colors.accent} />
                        </View>
                        <Text style={styles.title}>Paziify</Text>
                        <Text style={styles.signature}>Tu Santuario Digital</Text>
                    </View>

                    {/* Footer Controls */}
                    <View style={styles.footer}>

                        <Text style={styles.manifesto}>
                            Descubre la calma interior.{'\n'}Comienza tu viaje de transformación.
                        </Text>

                        <View style={styles.buttonGroup}>
                            <OasisButton
                                title="Empieza tu viaje"
                                onPress={handleGoogleLogin}
                                variant="primary"
                                icon="logo-google"
                                loading={loading}
                            />

                            <OasisButton
                                title="Explorar el Santuario"
                                onPress={continueAsGuest}
                                variant="glass"
                                icon="compass-outline"
                            />
                        </View>

                        <View style={styles.loginOption}>
                            <Text style={styles.loginText}>¿Ya eres miembro? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate(Screen.LOGIN)}>
                                <Text style={styles.loginLink}>Cruzar el Portal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: height * 0.15,
        paddingBottom: theme.spacing.xxl,
    },
    header: {
        alignItems: 'center',
    },
    brandBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 52,
        color: '#FFFFFF',
        letterSpacing: 2,
        marginBottom: 8,
    },
    signature: {
        fontFamily: 'Caveat_700Bold', // Immersive typography
        fontSize: 34,
        color: theme.colors.accent,
        transform: [{ rotate: '-2deg' }],
        opacity: 0.9,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
    },
    manifesto: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.xxl,
        letterSpacing: 0.5,
    },
    buttonGroup: {
        width: '100%',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    loginOption: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    loginLink: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
});

export default WelcomeScreen;
