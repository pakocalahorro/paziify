import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

type PaywallScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.PAYWALL
>;

interface Props {
    navigation: PaywallScreenNavigationProp;
}

const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const { updateUserState } = useApp();
    const [period, setPeriod] = useState<'annual' | 'monthly'>('annual');

    const handleSubscribe = () => {
        updateUserState({ isPlusMember: true });
        navigation.goBack();
    };

    const features = [
        { name: 'Contenido', free: '7 días de calma', plus: 'Sesiones ilimitadas', plusHighlight: true },
        { name: 'Herramientas', free: 'Temporizador básico', plus: 'Frecuencias Binaurales', plusHighlight: false },
        { name: 'Análisis', free: 'Estadísticas básicas', plus: 'Diagnóstico avanzado', plusHighlight: true, plusColor: '#2D9C9B' },
        { name: 'Cursos', free: '—', plus: 'TCC con Expertos', plusHighlight: true, plusColor: theme.colors.accent },
        { name: 'Modo Offline', free: 'close', plus: 'checkmark-circle' },
        { name: 'Comunidad', free: 'Básica', plus: 'Smart Notify G.G.' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.restoreText}>RESTAURAR COMPRA</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Badge & Title */}
                <View style={styles.topBadge}>
                    <Ionicons name="swap-horizontal" size={14} color={theme.colors.primary} />
                    <Text style={styles.topBadgeText}>COMPARATIVA</Text>
                </View>

                <Text style={styles.title}>
                    Paziify Plus{'\n'}
                    <Text style={styles.titleAlt}>vs Plan Gratis</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Descubre cómo la ciencia de datos puede acelerar tu bienestar mental.
                </Text>

                {/* Comparative Table */}
                <BlurView intensity={20} tint="dark" style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.columnLabel, { flex: 1.5 }]}>CARACTERÍSTICA</Text>
                        <Text style={styles.columnLabel}>GRATIS</Text>
                        <Text style={styles.columnLabel}>PLUS</Text>
                    </View>

                    {features.map((f, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.featureName}>{f.name}</Text>
                            <View style={styles.featureValue}>
                                {f.free === 'close' ? (
                                    <Ionicons name="close" size={16} color="rgba(255,255,255,0.2)" />
                                ) : (
                                    <Text style={styles.valueTextFree}>{f.free}</Text>
                                )}
                            </View>
                            <View style={styles.featureValue}>
                                {f.plus === 'checkmark-circle' ? (
                                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
                                ) : (
                                    <Text style={[
                                        styles.valueTextPlus,
                                        f.plusHighlight && { fontWeight: '800' },
                                        f.plusColor ? { color: f.plusColor } : { color: theme.colors.accent }
                                    ]}>
                                        {f.plus}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
                </BlurView>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    <TouchableOpacity
                        style={[styles.periodTab, period === 'annual' && styles.periodTabActive]}
                        onPress={() => setPeriod('annual')}
                    >
                        <Text style={[styles.periodTabText, period === 'annual' && styles.periodTabTextActive]}>Anual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodTab, period === 'monthly' && styles.periodTabActive]}
                        onPress={() => setPeriod('monthly')}
                    >
                        <Text style={[styles.periodTabText, period === 'monthly' && styles.periodTabTextActive]}>Mensual</Text>
                    </TouchableOpacity>
                </View>

                {/* Plans */}
                <TouchableOpacity
                    style={[{ width: '100%', marginBottom: 16 }]}
                    onPress={() => setPeriod('annual')}
                >
                    <BlurView intensity={25} tint="dark" style={[styles.planCard, period === 'annual' && styles.planCardActive]}>
                        {period === 'annual' && (
                            <View style={styles.bestValueBadge}>
                                <Text style={styles.bestValueText}>MEJOR VALOR</Text>
                            </View>
                        )}
                        <View style={styles.planRow}>
                            <View style={[styles.radio, period === 'annual' && styles.radioActive]}>
                                {period === 'annual' && <View style={styles.radioInner} />}
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={styles.planTitle}>Plan Anual</Text>
                                <Text style={styles.planDesc}>Solo $4.99/mes. Facturado anualmente.</Text>
                                <View style={styles.trialBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                                    <Text style={styles.trialText}>Prueba de 7 días incluida</Text>
                                </View>
                            </View>
                            <View style={styles.planPriceBox}>
                                <Text style={styles.price}>$59.99</Text>
                                <Text style={styles.pricePeriod}>/ año</Text>
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[{ width: '100%', marginBottom: 16 }]}
                    onPress={() => setPeriod('monthly')}
                >
                    <BlurView intensity={25} tint="dark" style={[styles.planCard, period === 'monthly' && styles.planCardActive]}>
                        <View style={styles.planRow}>
                            <View style={[styles.radio, period === 'monthly' && styles.radioActive]}>
                                {period === 'monthly' && <View style={styles.radioInner} />}
                            </View>
                            <View style={styles.planInfo}>
                                <Text style={styles.planTitle}>Plan Mensual</Text>
                                <Text style={styles.planDesc}>Compromiso flexible. Cancela cuando quieras.</Text>
                            </View>
                            <View style={styles.planPriceBox}>
                                <Text style={styles.price}>$9.99</Text>
                                <Text style={styles.pricePeriod}>/ mes</Text>
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>

                {/* Primary Button */}
                <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                    <Text style={styles.subscribeButtonText}>Comenzar Expansión</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.legalText}>
                    Facturación recurrente. Cancela cuando quieras en ajustes. Al continuar, aceptas nuestros <Text style={{ textDecorationLine: 'underline' }}>Términos</Text>.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A', // Darker theme for premium feel
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        height: 60,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    restoreText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    topBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 156, 155, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    topBadgeText: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    title: {
        fontSize: 38,
        fontFamily: 'Caveat_400Regular',
        color: '#FFF',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    titleAlt: {
        color: theme.colors.accent,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 22,
        marginBottom: 32,
        alignSelf: 'flex-start',
    },
    table: {
        width: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        marginBottom: 32,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    columnLabel: {
        flex: 1,
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.02)',
    },
    featureName: {
        flex: 1.5,
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    featureValue: {
        flex: 1,
        alignItems: 'center',
    },
    valueTextFree: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
    },
    valueTextPlus: {
        fontSize: 11,
        textAlign: 'center',
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 25,
        padding: 4,
        marginBottom: 24,
    },
    periodTab: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },
    periodTabActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    periodTabText: {
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    periodTabTextActive: {
        color: '#FFF',
    },
    planCard: {
        width: '100%',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        overflow: 'hidden',
    },
    planCardActive: {
        borderColor: theme.colors.accent,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    bestValueBadge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bestValueText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#000',
    },
    planRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    radioActive: {
        borderColor: theme.colors.accent,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.accent,
    },
    planInfo: {
        flex: 1,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    planDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 18,
    },
    planPriceBox: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.accent,
    },
    pricePeriod: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    trialBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(45, 156, 155, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    trialText: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: '700',
    },
    subscribeButton: {
        width: '100%',
        backgroundColor: '#2D9C9B',
        flexDirection: 'row',
        paddingVertical: 18,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
        marginBottom: 16,
    },
    subscribeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    legalText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default PaywallScreen;
