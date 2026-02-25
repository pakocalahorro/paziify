import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationTemplateService, NotificationTemplate } from './NotificationTemplateService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';
import * as Device from 'expo-device';

const STORAGE_KEY_SETTINGS = 'paziify_notification_settings';

export interface NotificationSettings {
    streakReminder: boolean;
    streakDangerToggle: boolean;
    morningRoutine: boolean;
    nightRoutine: boolean;
    morningTime: string; // "HH:mm"
    nightTime: string; // "HH:mm"
    quietHoursEnabled: boolean;
    quietHoursStart: string; // "HH:mm"
    quietHoursEnd: string; // "HH:mm"
}

const DEFAULT_SETTINGS: NotificationSettings = {
    streakReminder: true,
    streakDangerToggle: true,
    morningRoutine: true,
    nightRoutine: true,
    morningTime: "08:00",
    nightTime: "21:30",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
};

export const NotificationService = {
    /**
     * Inicializa y pide permisos
     */
    async initialize() {
        if (Platform.OS === 'web') return;

        // Configuración de comportamiento de notificaciones cuando la app está abierta
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permisos de notificación no concedidos');
            return false;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#646cff',
            });
        }

        return true;
    },

    /**
     * Registra el token de Expo y lo guarda en Supabase
     */
    async registerForPushNotificationsAsync(userId?: string) {
        if (!Device.isDevice) {
            console.log('Debe ser un dispositivo físico para notificaciones push');
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Fallo al obtener el token para notificaciones!');
            return null;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);

        if (userId && token) {
            await supabase
                .from('profiles')
                .update({ expo_push_token: token })
                .eq('id', userId);
        }

        return token;
    },

    /**
     * Obtiene ajustes de la base de datos local
     */
    async getSettings(): Promise<NotificationSettings> {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    },

    /**
     * Guarda ajustes
     */
    async saveSettings(settings: NotificationSettings) {
        await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        // Tras guardar, re-agendamos todo
        await this.rescheduleAll();
    },

    /**
     * Re-agenda todas las notificaciones basadas en el estado actual y plantillas
     */
    async rescheduleAll(userName?: string, currentStreak: number = 0) {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const settings = await this.getSettings();
        if (Platform.OS === 'web') return;

        // 1. Rutina Mañana
        if (settings.morningRoutine) {
            await this.scheduleTemplate('morning', settings.morningTime, { name: userName });
        }

        // 2. Rutina Noche
        if (settings.nightRoutine) {
            await this.scheduleTemplate('night', settings.nightTime, { name: userName });
        }

        // 3. Recordatorio de Racha (Basado en el nivel de racha)
        if (settings.streakReminder) {
            let type = 'streak_0';
            if (currentStreak >= 30) type = 'streak_30';
            else if (currentStreak >= 14) type = 'streak_14';
            else if (currentStreak >= 7) type = 'streak_7';
            else if (currentStreak >= 3) type = 'streak_3';
            else if (currentStreak >= 1) type = 'streak_1';

            // Lo agendamos para la hora de la mañana por defecto o una fija
            await this.scheduleTemplate(type, "10:00", { name: userName, streak: currentStreak.toString() });
        }

        // 4. Peligro de Racha (21:30 si no ha meditado)
        // Nota: Esta lógica se dispara mejor desde el AppContext al detectar que acaba el día
        if (settings.streakDangerToggle && currentStreak >= 3) {
            await this.scheduleTemplate('streak_danger', "21:30", { name: userName, streak: currentStreak.toString() });
        }
    },

    /**
     * Agenda una notificación basada en una plantilla técnica
     */
    async scheduleTemplate(type: string, time: string, variables: Record<string, string | undefined>) {
        const template = await NotificationTemplateService.getTemplateByType(type);
        if (!template || !template.is_active) return;

        let title = template.title;
        let body = template.body;

        // Reemplazar variables
        Object.keys(variables).forEach(key => {
            const value = variables[key] || '';
            title = title.replace(`{${key}}`, value);
            body = body.replace(`{${key}}`, value);
        });

        const [hours, minutes] = time.split(':').map(Number);

        // Estructura de disparador específica por plataforma para evitar errores de "calendar" en Android
        const trigger: any = {
            hour: hours,
            minute: minutes,
            repeats: true,
        };

        if (Platform.OS === 'android') {
            // Android no soporta 'calendar' para recurrencia diaria, usa 'daily'
            trigger.type = 'daily';
            trigger.channelId = 'default';
        } else {
            // iOS usa 'calendar' para disparadores basados en tiempo específico
            trigger.type = 'calendar';
        }

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                    data: { type },
                },
                trigger,
            });
            console.log(`[NotificationService] Scheduled ${type} for ${time} on ${Platform.OS}`);
        } catch (error) {
            console.error(`[NotificationService] Error scheduling ${type}:`, error);
        }
    },

    /**
     * Envía una notificación inmediata (ej: Hitos)
     */
    async sendImmediate(type: string, variables: Record<string, string | undefined>) {
        const template = await NotificationTemplateService.getTemplateByType(type);
        if (!template || !template.is_active) return;

        let title = template.title;
        let body = template.body;

        Object.keys(variables).forEach(key => {
            const value = variables[key] || '';
            title = title.replace(`{${key}}`, value);
            body = body.replace(`{${key}}`, value);
        });

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { type },
            },
            trigger: null, // null means immediate
        });
    }
};
