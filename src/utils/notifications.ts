import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
}

export async function scheduleDailyMeditationReminder(hour: number, minute: number, challengeTitle?: string, currentDay?: number) {
    // Cancel all previous notifications of this type if needed
    await Notifications.cancelAllScheduledNotificationsAsync();

    const title = challengeTitle ? `Reto: ${challengeTitle} 🌳` : "Momento de Paziify 🧘‍♂️";
    const body = challengeTitle
        ? `¡Día ${currentDay} de tu misión! Tu sistema nervioso te espera para seguir floreciendo.`
        : "Tu sistema nervioso está listo para un minuto de calma. ¿Empezamos?";

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { screen: 'HOME' }, // Redirect to HOME where the master slot is
        },
        trigger: Platform.OS === 'android'
            ? {
                type: 'daily', // Explicitly set type for Android
                hour,
                minute,
                repeats: true,
            } as any
            : {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            },
    });

    return id;
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
