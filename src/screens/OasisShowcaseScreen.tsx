import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Screen } from '../types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// PDS Primitives
import { OasisScreen } from '../components/Oasis/OasisScreen';
import { OasisCard } from '../components/Oasis/OasisCard';
import { OasisButton } from '../components/Oasis/OasisButton';
import { OasisMeter } from '../components/Oasis/OasisMeter';
import { OasisChart } from '../components/Oasis/OasisChart';
import { OasisTree } from '../components/Oasis/OasisTree';
import { OasisInput } from '../components/Oasis/OasisInput';
import { OasisToggle } from '../components/Oasis/OasisToggle';
import { OasisSkeleton } from '../components/Oasis/OasisSkeleton';

const SoundWaveHeader = ({ title, accentColor }: { title: string, accentColor: string }) => (
    <View style={{ marginBottom: 16 }}>
        <Text style={{ fontFamily: 'Outfit_800ExtraBold', fontSize: 18, color: accentColor, textTransform: 'uppercase', letterSpacing: 2 }}>{title}</Text>
    </View>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OasisShowcaseScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Form & State Demo
    const [email, setEmail] = React.useState('');
    const [notificationsOn, setNotificationsOn] = React.useState(true);

    return (
        <OasisScreen themeMode="healing">
            {/* Header: Universal Back Navigation & Title */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <BlurView intensity={80} tint="dark" style={styles.iconBlur}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </BlurView>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.signatureTitle}>Oasis Design</Text>
                    <Text style={styles.structuralSubtitle}>SHOWCASE V3.0</Text>
                </View>
                <View style={{ width: 44 }} /> {/* Balance */}
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="1. Tipografía Dual" accentColor="#2DD4BF" />
                <View style={styles.cardExample}>
                    <Text style={{ fontFamily: 'Caveat_700Bold', fontSize: 36, color: '#A0AEC0', marginBottom: -4 }}>La Firma (Caveat)</Text>
                    <Text style={{ fontFamily: 'Outfit_800ExtraBold', fontSize: 28, color: '#FFF' }}>
                        LA ESTRUCTURA (Outfit)
                    </Text>
                    <Text style={{ fontFamily: 'Outfit_400Regular', fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
                        Cuerpo de texto legible, limpio y geométrico. Ideal para descripciones largas y datos técnicos.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="2. Oasis Cards (Bento/Listas)" accentColor="#8B5CF6" />

                <Text style={styles.label}>Hero (Listado Principal / Home)</Text>
                <OasisCard
                    superTitle="Tu Sesión"
                    title="Meditación para la Ansiedad"
                    subtitle="Reduce el cortisol y encuentra tu centro en minutos."
                    variant="hero"
                    badgeText="RECOMENDADO"
                    icon="star"
                    actionText="Comenzar"
                    actionIcon="play"
                    imageUri="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800"
                    onPress={() => { }}
                />

                <Text style={[styles.label, { marginTop: 16 }]}>Default (Catálogos Grid / Biblioteca)</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <OasisCard
                            superTitle="Serie"
                            title="Ansiedad"
                            variant="default"
                            imageUri="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"
                            actionText="Ver"
                            actionIcon="eye"
                            onPress={() => { }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <OasisCard
                            superTitle="Sonidos"
                            title="Dormir"
                            variant="default"
                            accentColor="#8B5CF6"
                            imageUri="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500"
                            actionText="Oír"
                            actionIcon="musical-notes"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <Text style={[styles.label, { marginTop: 16 }]}>Compact (Listas Ajustes/Perfil)</Text>
                <OasisCard
                    title="Historial Bio-Ritmo"
                    subtitle="Consulta tus mediciones anteriores."
                    variant="compact"
                    icon="heart"
                    accentColor="#EF4444"
                    onPress={() => { }}
                />
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="3. Oasis Buttons (CTAs)" accentColor="#FBBF24" />

                <Text style={styles.label}>Primary Action (Pulse)</Text>
                <OasisButton
                    title="Comenzar Sesión"
                    icon="play"
                    isPulse
                    onPress={() => { }}
                    style={{ marginBottom: 12 }}
                />

                <Text style={styles.label}>Glass Action (Secondary/List)</Text>
                <OasisButton
                    title="Añadir a Favoritos"
                    icon="heart-outline"
                    variant="glass"
                    onPress={() => { }}
                    style={{ marginBottom: 12 }}
                />

                <Text style={styles.label}>Ghost Action (Cancel/Back)</Text>
                <OasisButton
                    title="Omitir por ahora"
                    variant="ghost"
                    accentColor="rgba(255,255,255,0.5)"
                    onPress={() => { }}
                />
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="4. Data Viz (Analíticas)" accentColor="#EC4899" />

                <Text style={styles.label}>Oasis Meter (Progreso Circular)</Text>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <OasisMeter progress={0.75} label="ENERGÍA" accentColor="#FBBF24" />
                </View>

                <Text style={styles.label}>Oasis Chart (Métricas Diarias)</Text>
                <View style={{ marginBottom: 24 }}>
                    <OasisChart
                        title="MINUTOS DE MEDITACIÓN"
                        accentColor="#2DD4BF"
                        data={[
                            { day: '2026-02-23', value: 15 },
                            { day: '2026-02-24', value: 30 },
                            { day: '2026-02-25', value: 45 },
                            { day: '2026-02-26', value: 20 },
                            { day: '2026-02-27', value: 0 },
                            { day: '2026-02-28', value: 0 },
                            { day: '2026-03-01', value: 0 },
                        ]}
                    />
                </View>

                <Text style={styles.label}>Oasis Tree (Resiliencia Skia)</Text>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <OasisTree
                        daysPracticed={18}
                        totalSteps={30}
                        accentColor="#8B5CF6"
                    />
                </View>
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="5. Iconografía (A/B Test)" accentColor="#3B82F6" />

                <Text style={styles.label}>Estándar (Ionicons) vs Premium (Feather)</Text>

                <View style={styles.cardExample}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_800ExtraBold', fontSize: 10 }}>IONICONS (ACTUAL)</Text>
                        <Text style={{ color: '#3B82F6', fontFamily: 'Outfit_800ExtraBold', fontSize: 10 }}>FEATHER (PROPUESTA)</Text>
                    </View>

                    {/* Compare Home */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Ionicons name="home" size={28} color="#FFF" />
                            <Text style={styles.iconDesc}>home</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Feather name="home" size={28} color="#3B82F6" strokeWidth={1.5} />
                            <Text style={styles.iconDesc}>home</Text>
                        </View>
                    </View>

                    {/* Compare Settings */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Ionicons name="settings" size={28} color="#FFF" />
                            <Text style={styles.iconDesc}>settings</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Feather name="settings" size={28} color="#3B82F6" strokeWidth={1.5} />
                            <Text style={styles.iconDesc}>settings</Text>
                        </View>
                    </View>

                    {/* Compare Play */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Ionicons name="play" size={28} color="#FFF" />
                            <Text style={styles.iconDesc}>play</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Feather name="play" size={28} color="#3B82F6" strokeWidth={1.5} />
                            <Text style={styles.iconDesc}>play</Text>
                        </View>
                    </View>

                    {/* Compare Heart */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Ionicons name="heart" size={28} color="#FFF" />
                            <Text style={styles.iconDesc}>heart</Text>
                        </View>
                        <View style={{ alignItems: 'center', width: 60 }}>
                            <Feather name="heart" size={28} color="#3B82F6" strokeWidth={1.5} />
                            <Text style={styles.iconDesc}>heart</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <SoundWaveHeader title="6. Formularios y Carga (Fase 0.5)" accentColor="#F59E0B" />

                <Text style={styles.label}>Oasis Input (Glassmorphism + Animación)</Text>
                <View style={styles.cardExample}>
                    <OasisInput
                        label="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail"
                        placeholder="tu@email.com"
                        keyboardType="email-address"
                    />
                    <OasisInput
                        label="Contraseña"
                        value=""
                        icon="lock"
                        secureTextEntry
                        error="La contraseña debe tener 8 caracteres."
                    />
                </View>

                <Text style={[styles.label, { marginTop: 24 }]}>Oasis Toggle (Configuración)</Text>
                <View style={[styles.cardExample, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ color: '#FFF', fontFamily: 'Outfit_500Medium', fontSize: 16 }}>
                        Recordatorio diario
                    </Text>
                    <OasisToggle
                        value={notificationsOn}
                        onValueChange={setNotificationsOn}
                        accentColor="#F59E0B"
                    />
                </View>

                <Text style={[styles.label, { marginTop: 24 }]}>Oasis Skeleton (Carga Vanguardia)</Text>
                <View style={[styles.cardExample, { flexDirection: 'row', alignItems: 'center' }]}>
                    <OasisSkeleton variant="circular" width={50} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <OasisSkeleton variant="text" width="80%" height={16} style={{ marginBottom: 8 }} />
                        <OasisSkeleton variant="text" width="50%" height={14} />
                    </View>
                </View>
            </View>

        </OasisScreen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    iconBlur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signatureTitle: {
        fontFamily: 'Caveat_700Bold',
        fontSize: 32,
        color: '#2DD4BF',
        marginBottom: -8,
    },
    structuralSubtitle: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 14,
        letterSpacing: 2,
        color: 'rgba(255,255,255,0.7)',
    },
    section: {
        marginBottom: 40,
    },
    label: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 12,
        letterSpacing: 1.5,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 4,
    },
    cardExample: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconDesc: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        marginTop: 6,
        fontFamily: 'Outfit_400Regular'
    }
});
