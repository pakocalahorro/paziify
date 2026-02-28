import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, RootStackParamList } from '../types';
import { OasisScreen } from '../components/Oasis/OasisScreen';
import { OasisHeader } from '../components/Oasis/OasisHeader';

// PDS Components
import { OasisButton } from '../components/Oasis/OasisButton';
import { OasisCard } from '../components/Oasis/OasisCard';
import { OasisInput } from '../components/Oasis/OasisInput';
import { OasisToggle } from '../components/Oasis/OasisToggle';
import { OasisSkeleton } from '../components/Oasis/OasisSkeleton';
import SoundwaveSeparator from '../components/Shared/SoundwaveSeparator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


export default function OasisShowcaseScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Form & State Demo
    const [email, setEmail] = React.useState('');
    const [notificationsOn, setNotificationsOn] = React.useState(true);

    return (
        <OasisScreen
            themeMode="healing"
            showSafeOverlay={false}
            header={
                <OasisHeader
                    showEvolucion={true}
                    onEvolucionPress={() => { /* Prototipo: Abrir Catálogo Evolución */ }}
                    path={['Oasis']}
                    title="SHOWCASE"
                    onBack={() => navigation.navigate('MainTabs' as any)}
                    onPathPress={(index) => {
                        if (index === 0) navigation.navigate('MainTabs' as any);
                    }}
                    userName="Paco Calahorro"
                    avatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                    onProfilePress={() => navigation.navigate(Screen.PROFILE as any)}
                    activeChallengeType="mision"
                />
            }
            disableContentPadding={true}
        >
            <View style={{ paddingTop: 24 }}>
                <View style={styles.section}>
                    <SoundwaveSeparator title="1. Tipografía Dual" />
                    <View style={[styles.cardExample, { marginHorizontal: 20 }]}>
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
                    <SoundwaveSeparator title="2. Oasis Cards (Bento/Listas)" />

                    <View style={{ paddingHorizontal: 20 }}>
                        <OasisCard
                            title="Sesión de Meditación"
                            subtitle="Paz Interior • 15 min"
                            variant="hero"
                            accentColor="#8B5CF6"
                            onPress={() => { }}
                        />

                        <OasisCard
                            title="Relatos de Sueño"
                            subtitle="Bosque de Niebla"
                            variant="default"
                            accentColor="#A78BFA"
                            style={{ marginTop: 20 }}
                            onPress={() => { }}
                        />

                        <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
                            <OasisCard
                                title="Respiración"
                                subtitle="4-7-8"
                                variant="compact"
                                accentColor="#F472B6"
                                style={{ flex: 1 }}
                                onPress={() => { }}
                            />
                            <OasisCard
                                title="Sonidos"
                                subtitle="Lluvia"
                                variant="compact"
                                accentColor="#60A5FA"
                                style={{ flex: 1 }}
                                onPress={() => { }}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <SoundwaveSeparator title="3. Separadores (Rayo)" />
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={styles.sectionSubtitle}>Este es el divisor oficial para secciones ("el de siempre").</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <SoundwaveSeparator title="4. Acciones Primarias" />
                    <View style={{ paddingHorizontal: 20, gap: 12 }}>
                        <OasisButton title="Comenzar Práctica" variant="primary" onPress={() => { }} />
                        <OasisButton title="Ver Detalles" variant="secondary" onPress={() => { }} />
                        <OasisButton title="Cancelar" variant="ghost" onPress={() => { }} />
                    </View>
                </View>

                <View style={styles.section}>
                    <SoundwaveSeparator title="5. Inputs & Toggles" />
                    <View style={{ paddingHorizontal: 20 }}>
                        <OasisInput
                            label="Correo Electrónico"
                            placeholder="tu@oasis.com"
                            value={email}
                            onChangeText={setEmail}
                            icon="mail"
                        />

                        <View style={styles.toggleRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.toggleLabel}>Notificaciones Push</Text>
                                <Text style={styles.toggleDesc}>Recibe recordatorios diarios de meditación.</Text>
                            </View>
                            <OasisToggle
                                value={notificationsOn}
                                onValueChange={setNotificationsOn}
                                accentColor="#10B981"
                            />
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { marginBottom: 100 }]}>
                    <SoundwaveSeparator title="6. Skeletons (Loading)" />
                    <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                        <OasisSkeleton variant="circular" width={48} />
                        <View style={{ flex: 1 }}>
                            <OasisSkeleton variant="text" width="80%" height={16} style={{ marginBottom: 8 }} />
                            <OasisSkeleton variant="text" width="50%" height={14} />
                        </View>
                    </View>
                </View>
            </View>
        </OasisScreen>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 40,
    },
    cardExample: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 20,
        marginTop: 12,
    },
    toggleLabel: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        color: '#FFF',
    },
    toggleDesc: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    sectionSubtitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 12,
        color: '#2DD4BF',
        textAlign: 'center',
        marginTop: -10,
        marginBottom: 20,
        letterSpacing: 1,
    }
});
