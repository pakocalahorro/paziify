import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

type NotificationSettingsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.NOTIFICATION_SETTINGS
>;

interface Props {
    navigation: NotificationSettingsScreenNavigationProp;
}

const NotificationSettings: React.FC<Props> = ({ navigation }) => {
    const { userState, updateUserState } = useApp();
    const settings = userState.settings;

    if (!settings) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={theme.colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: theme.colors.textMuted }}>Cargando ajustes...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleToggle = (key: keyof typeof settings) => {
        updateUserState({
            settings: {
                ...settings,
                [key]: !settings[key]
            }
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Info Card: Ciencia del Hábito */}
                <View style={styles.infoCard}>
                    <View style={styles.infoTitleRow}>
                        <Ionicons name="beaker" size={18} color={theme.colors.primary} />
                        <Text style={styles.infoLabel}>CIENCIA DEL HÁBITO</Text>
                    </View>
                    <Text style={styles.infoContent}>
                        Las notificaciones inteligentes se adaptan a tu
                        <Text style={styles.infoHighlight}> ritmo circadiano </Text>
                        para maximizar la adherencia.
                    </Text>
                </View>

                {/* Section: Rutinas Diarias */}
                <Text style={styles.sectionLabel}>RUTINAS DIARIAS</Text>
                <View style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconBox}>
                            <Ionicons name="sunny" size={20} color={theme.colors.accent} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Rutina de Mañana</Text>
                            <Text style={styles.settingSubtitle}>Start with intention</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#323232', true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#323232"
                            onValueChange={() => handleToggle('notificationMorning')}
                            value={settings.notificationMorning}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingRow}>
                        <View style={styles.settingIconBox}>
                            <Ionicons name="moon" size={20} color="#818CF8" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Sugerencia Nocturna</Text>
                            <Text style={styles.settingSubtitle}>Wind down properly</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#323232', true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#323232"
                            onValueChange={() => handleToggle('notificationNight')}
                            value={settings.notificationNight}
                        />
                    </View>
                </View>

                {/* Section: Motivación */}
                <Text style={styles.sectionLabel}>MOTIVACIÓN</Text>
                <View style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                            <Ionicons name="flame" size={20} color="#EF4444" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Recordatorio de Racha</Text>
                            <Text style={styles.settingSubtitle}>Keep your momentum</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#323232', true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#323232"
                            onValueChange={() => handleToggle('notificationStreak')}
                            value={settings.notificationStreak}
                        />
                    </View>
                </View>

                {/* Section: Zona de Calma */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>ZONA DE CALMA</Text>
                    <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>Recomendado</Text>
                    </View>
                </View>

                <View style={styles.settingsGroup}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconBox}>
                            <Ionicons name="remove-circle" size={20} color={theme.colors.textMuted} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Horario de Silencio</Text>
                            <Text style={styles.settingSubtitle}>Protects deep sleep cycles</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#323232', true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#323232"
                            onValueChange={() => handleToggle('notificationQuietMode')}
                            value={settings.notificationQuietMode}
                        />
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.timeSettingRow}>
                        <Ionicons name="time" size={20} color={theme.colors.textMuted} />
                        <Text style={styles.timeLabel}>Activo entre</Text>
                        <Text style={styles.timeRange}>
                            {settings.quietHoursStart} - {settings.quietHoursEnd}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                    </TouchableOpacity>

                    <Text style={styles.footerNote}>
                        No se enviarán notificaciones durante estas horas para asegurar un descanso profundo y sin interrupciones.
                    </Text>
                </View>

                {/* Footer Brand */}
                <View style={styles.brandFooter}>
                    <Ionicons name="leaf" size={24} color={theme.colors.primary} />
                    <Text style={styles.brandText}>PAZIIFY WELLNESS OS V2.4</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: 'rgba(74, 103, 65, 0.15)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(74, 103, 65, 0.2)',
    },
    infoTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    infoContent: {
        fontSize: 18,
        lineHeight: 26,
        color: theme.colors.textMain,
    },
    infoHighlight: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.textMuted,
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    settingsGroup: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textMain,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 4,
    },
    recommendedBadge: {
        backgroundColor: 'rgba(74, 103, 65, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    recommendedText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    timeSettingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    timeLabel: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.textMain,
    },
    timeRange: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    footerNote: {
        fontSize: 13,
        color: theme.colors.textMuted,
        lineHeight: 18,
        marginTop: 12,
        paddingHorizontal: 8,
    },
    brandFooter: {
        alignItems: 'center',
        marginTop: 24,
        gap: 12,
        opacity: 0.5,
    },
    brandText: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.textMuted,
        letterSpacing: 2,
    },
});

export default NotificationSettings;
