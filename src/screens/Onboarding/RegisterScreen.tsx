import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../services/supabaseClient';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';

// PDS Primitives
import { OasisScreen } from '../../components/Oasis/OasisScreen';
import { OasisInput } from '../../components/Oasis/OasisInput';
import { OasisButton } from '../../components/Oasis/OasisButton';

const { height } = Dimensions.get('window');

type RegisterScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.REGISTER
>;

interface Props {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { updateUserState } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor, rellena todos los campos');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (error) {
            Alert.alert('Error de registro', error.message);
            setLoading(false);
        } else {
            // If sign up is successful, create the profile entry
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { id: data.user.id, full_name: name }
                    ]);

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                }
            }

            Alert.alert('Éxito', 'Cuenta creada. Revisa tu correo si es necesario.');
            // AppContext listener will handle navigation
        }
    };

    return (
        <OasisScreen style={styles.container} preset="scroll">
            <View style={styles.content}>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.signature}>Comienza tu viaje</Text>
                    <Text style={styles.title}>Crea tu Santuario</Text>
                    <Text style={styles.subtitle}>Escribe tu historia desde este instante de paz.</Text>
                </View>

                {/* Main Action Form / Inputs */}
                <View style={styles.formContainer}>
                    <OasisInput
                        label="Nombre"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        icon="user"
                    />

                    <OasisInput
                        label="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        icon="mail"
                    />

                    <OasisInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon="lock"
                    />

                    <OasisButton
                        title="Crear Cuenta"
                        onPress={handleRegister}
                        variant="primary"
                        icon="leaf-outline"
                        loading={loading}
                        style={{ marginTop: theme.spacing.md }}
                    />
                </View>

                {/* Footer Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                    <Text
                        style={styles.footerLink}
                        onPress={() => navigation.navigate(Screen.LOGIN)}
                    >
                        Cruzar el Portal
                    </Text>
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
        paddingVertical: height * 0.02,
    },
    header: {
        marginBottom: theme.spacing.xl,
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
        gap: theme.spacing.md,
    },
    footer: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Outfit_400Regular',
    },
    footerLink: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
});

export default RegisterScreen;
