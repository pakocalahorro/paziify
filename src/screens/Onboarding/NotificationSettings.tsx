import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { NotificationService, NotificationSettings as SettingsType } from '../../services/NotificationService';

type NotificationSettingsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.NOTIFICATION_SETTINGS
>;

interface Props {
    navigation: NotificationSettingsScreenNavigationProp;
}

const NotificationSettings: React.FC<Props> = ({ navigation }) => {
    const { userState, updateUserState, signOut, isGuest } = useApp();
    const settings = userState.settings;

    // Local state for smooth UI before syncing
    const [birthDate, setBirthDate] = useState(userState.birthDate || '');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>(userState.gender || 'other');
    const [heightCm, setHeightCm] = useState(userState.heightCm?.toString() || '');
    const [weightKg, setWeightKg] = useState(userState.weightKg?.toString() || '');
    const [notifSettings, setNotifSettings] = useState<SettingsType | null>(null);

    useEffect(() => {
        const loadNotifSettings = async () => {
            const s = await NotificationService.getSettings();
            setNotifSettings(s);
        };
        loadNotifSettings();
    }, []);

    const updateNotifSetting = async (key: keyof SettingsType, value: any) => {
        if (!notifSettings) return;
        const newSettings = { ...notifSettings, [key]: value };
        setNotifSettings(newSettings);
        await NotificationService.saveSettings(newSettings);

        if (key === 'morningRoutine') updateUserState({ settings: { ...userState.settings, notificationMorning: value } });
        if (key === 'nightRoutine') updateUserState({ settings: { ...userState.settings, notificationNight: value } });
    };

    const syncHealthData = () => {
        let isoDate = birthDate;
        if (birthDate.includes('/')) {
            const parts = birthDate.split('/');
            if (parts.length === 3) {
                isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }
        const h = parseInt(heightCm);
        const w = parseInt(weightKg);

        updateUserState({
            birthDate: isoDate || undefined,
            gender,
            heightCm: isNaN(h) ? undefined : h,
            weightKg: isNaN(w) ? undefined : w,
        });
    };

    // Auto-sync when health inputs change (debounced feeling)
    useEffect(() => {
        const timer = setTimeout(syncHealthData, 1000);
        return () => clearTimeout(timer);
    }, [birthDate, gender, heightCm, weightKg]);

    const calculateAge = (): number | null => {
        if (!birthDate) return null;
        let isoDate = birthDate;
        if (birthDate.includes('/')) {
            const parts = birthDate.split('/');
            if (parts.length === 3) isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        const d = new Date(isoDate);
        if (isNaN(d.getTime())) return null;
        return Math.floor((Date.now() - d.getTime()) / 31557600000);
    };

    const age = calculateAge();

    const handleToggle = (key: keyof typeof settings) => {
        updateUserState({
            settings: { ...settings, [key]: !settings[key] }
        });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ajustes de Perfil</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. SECCIÓN DE PROPÓSITO (Metas) */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>MI PROPÓSITO</Text>
                    <Ionicons name="compass" size={16} color={theme.colors.primary} />
                </View>

                <View style={styles.settingsGroup}>
                    <View style={styles.goalRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Meta Diaria</Text>
                            <Text style={styles.settingSubtitle}>Compromiso del día</Text>
                        </View>
                        <View style={styles.goalValueContainer}>
                            <TouchableOpacity
                                onPress={() => updateUserState({ dailyGoalMinutes: Math.max((userState.dailyGoalMinutes || 20) - 5, 5) })}
                                style={styles.goalButton}
                            >
                                <Ionicons name="remove" size={18} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.goalValue}>{userState.dailyGoalMinutes || 20}m</Text>
                            <TouchableOpacity
                                onPress={() => updateUserState({ dailyGoalMinutes: (userState.dailyGoalMinutes || 20) + 5 })}
                                style={styles.goalButton}
                            >
                                <Ionicons name="add" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.goalRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Meta Semanal</Text>
                            <Text style={styles.settingSubtitle}>Progreso acumulado</Text>
                        </View>
                        <View style={styles.goalValueContainer}>
                            <TouchableOpacity
                                onPress={() => updateUserState({ weeklyGoalMinutes: Math.max((userState.weeklyGoalMinutes || 150) - 10, 30) })}
                                style={styles.goalButton}
                            >
                                <Ionicons name="remove" size={18} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.goalValue}>{userState.weeklyGoalMinutes || 150}m</Text>
                            <TouchableOpacity
                                onPress={() => updateUserState({ weeklyGoalMinutes: (userState.weeklyGoalMinutes || 150) + 10 })}
                                style={styles.goalButton}
                            >
                                <Ionicons name="add" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 2. SECCIÓN DE SALUD */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>MI PERFIL DE SALUD</Text>
                    <Ionicons name="heart" size={16} color="#FF4B4B" />
                </View>

                <View style={styles.settingsGroup}>
                    {/* Birth Date */}
                    <View style={styles.settingRow}>
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]}>
                            <Ionicons name="calendar" size={20} color="#FF4B4B" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Fecha de nacimiento</Text>
                            {age !== null && <Text style={styles.settingSubtitle}>{age} años</Text>}
                        </View>
                        <TextInput
                            style={styles.healthInput}
                            value={birthDate}
                            onChangeText={setBirthDate}
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            keyboardType="numbers-and-punctuation"
                            maxLength={10}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Gender */}
                    <View style={styles.settingRow}>
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]}>
                            <Ionicons name="person" size={20} color="#FF4B4B" />
                        </View>
                        <View style={[styles.settingInfo, { flex: 0, marginRight: 'auto' }]}>
                            <Text style={styles.settingTitle}>Género</Text>
                        </View>
                        <View style={styles.genderSelector}>
                            {(['male', 'female', 'other'] as const).map(g => (
                                <TouchableOpacity
                                    key={g}
                                    style={[
                                        styles.genderChip,
                                        gender === g && styles.genderChipActive
                                    ]}
                                    onPress={() => setGender(g)}
                                >
                                    <Text style={[
                                        styles.genderChipText,
                                        gender === g && styles.genderChipTextActive
                                    ]}>
                                        {g === 'male' ? 'H' : g === 'female' ? 'M' : '—'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Height & Weight */}
                    <View style={styles.settingRow}>
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]}>
                            <Ionicons name="resize" size={20} color="#FF4B4B" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Altura y Peso</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <TextInput
                                style={[styles.healthInput, { minWidth: 60 }]}
                                value={heightCm}
                                onChangeText={setHeightCm}
                                placeholder="cm"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                keyboardType="numeric"
                                maxLength={3}
                            />
                            <TextInput
                                style={[styles.healthInput, { minWidth: 60 }]}
                                value={weightKg}
                                onChangeText={setWeightKg}
                                placeholder="kg"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                keyboardType="numeric"
                                maxLength={3}
                            />
                        </View>
                    </View>
                </View>

                {/* ====================== */}
                {/* NOTIFICATIONS SECTION  */}
                {/* ====================== */}

                {/* Info Card: Ciencia del Hábito */}
                <View style={[styles.infoCard, { marginTop: 16 }]}>
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
                            onValueChange={() => updateNotifSetting('nightRoutine', !notifSettings?.nightRoutine)}
                            value={notifSettings?.nightRoutine ?? settings.notificationNight}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.timeSelectionRow}>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeLabel}>MAÑANA</Text>
                            <TouchableOpacity
                                style={styles.timeDisplay}
                                onPress={() => {
                                    Alert.alert("Hora de Mañana", "Selecciona tu hora preferida", [
                                        { text: "07:00", onPress: () => updateNotifSetting('morningTime', "07:00") },
                                        { text: "08:00", onPress: () => updateNotifSetting('morningTime', "08:00") },
                                        { text: "09:00", onPress: () => updateNotifSetting('morningTime', "09:00") },
                                        { text: "Cancelar", style: "cancel" }
                                    ]);
                                }}
                            >
                                <Text style={styles.timeText}>{notifSettings?.morningTime || "08:00"}</Text>
                                <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeLabel}>NOCHE</Text>
                            <TouchableOpacity
                                style={styles.timeDisplay}
                                onPress={() => {
                                    Alert.alert("Hora de Noche", "Selecciona tu hora preferida", [
                                        { text: "21:30", onPress: () => updateNotifSetting('nightTime', "21:30") },
                                        { text: "22:00", onPress: () => updateNotifSetting('nightTime', "22:00") },
                                        { text: "22:30", onPress: () => updateNotifSetting('nightTime', "22:30") },
                                        { text: "Cancelar", style: "cancel" }
                                    ]);
                                }}
                            >
                                <Text style={styles.timeText}>{notifSettings?.nightTime || "21:30"}</Text>
                                <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
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
                            onValueChange={() => updateNotifSetting('streakReminder', !notifSettings?.streakReminder)}
                            value={notifSettings?.streakReminder ?? settings.notificationStreak}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.settingRow}>
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                            <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Alerta Racha en Peligro</Text>
                            <Text style={styles.settingSubtitle}>Aviso a las 21:30 si no has meditado</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#323232', true: theme.colors.primary }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#323232"
                            onValueChange={() => updateNotifSetting('streakDangerToggle', !notifSettings?.streakDangerToggle)}
                            value={notifSettings?.streakDangerToggle ?? true}
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

                {/* 5. SECCIÓN DE CUENTA */}
                <Text style={styles.sectionLabel}>SISTEMA Y CUENTA</Text>
                <View style={styles.settingsGroup}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => signOut()}
                    >
                        <View style={[styles.settingIconBox, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                            <Ionicons name="log-out" size={20} color={theme.colors.textMuted} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, { color: theme.colors.textMuted }]}>Cerrar Sesión</Text>
                            <Text style={styles.settingSubtitle}>Salir de la cuenta actual</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
                    </TouchableOpacity>
                </View>

                {/* Footer Brand */}
                <View style={styles.brandFooter}>
                    <Ionicons name="leaf" size={24} color={theme.colors.primary} />
                    <Text style={styles.brandText}>PAZIIFY WELLNESS OS V2.33.5</Text>
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
    timeSelectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        alignItems: 'center',
    },
    timeBox: {
        alignItems: 'center',
        gap: 8,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    timeText: {
        color: theme.colors.textMain,
        fontWeight: '700',
        fontSize: 14,
    },
    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    goalValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 4,
        borderRadius: 14,
    },
    goalValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFF',
        minWidth: 40,
        textAlign: 'center',
    },
    goalButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsGroup: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
    // Health Profile Styles
    healthInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        minWidth: 90,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    healthUnit: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    genderSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    genderChip: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    genderChipActive: {
        backgroundColor: 'rgba(255, 75, 75, 0.15)',
        borderColor: '#FF4B4B',
    },
    genderChipText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        fontWeight: '700',
    },
    genderChipTextActive: {
        color: '#FF4B4B',
    },
    saveProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 75, 75, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 75, 75, 0.15)',
        marginBottom: 32,
    },
    saveProfileButtonSaved: {
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.15)',
    },
    saveProfileText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default NotificationSettings;
