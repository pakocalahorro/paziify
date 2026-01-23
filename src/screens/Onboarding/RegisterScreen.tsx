import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../services/supabaseClient';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Bienvenido a{'\n'}
                            <Text style={styles.titleAccent}>Paziify</Text>
                        </Text>
                        <Text style={styles.subtitle}>Tu santuario te espera.</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={theme.colors.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre"
                                placeholderTextColor={theme.colors.textMuted}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={theme.colors.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor={theme.colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={theme.colors.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor={theme.colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>Crear Cuenta</Text>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>o regístrate con</Text>
                            <View style={styles.divider} />
                        </View>

                        {/* Social Login Buttons */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={24} color="#EA4335" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            ¿Ya tienes cuenta?{' '}
                            <Text
                                style={styles.footerLink}
                                onPress={() => navigation.navigate(Screen.LOGIN)}
                            >
                                Iniciar sesión
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xxl,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.sm,
        lineHeight: 42,
    },
    titleAccent: {
        color: theme.colors.primary,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.textMuted,
    },
    form: {
        gap: theme.spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        color: theme.colors.textMain,
        fontSize: 16,
        paddingVertical: theme.spacing.md,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        paddingVertical: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.lg,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        marginTop: theme.spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    footerLink: {
        color: theme.colors.accent,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        color: theme.colors.textMuted,
        paddingHorizontal: 15,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.borderRadius.xl,
        paddingVertical: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    socialButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default RegisterScreen;
