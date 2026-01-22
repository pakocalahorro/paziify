// Web-compatible mock for notifications
// Native notifications are not supported in the web build of this app

export async function requestNotificationPermissions() {
    console.log('[Web] Notification permissions requested (simulated)');
    return true;
}

export async function scheduleDailyMeditationReminder(hour: number, minute: number) {
    console.log(`[Web] Daily reminder scheduled for ${hour}:${minute} (simulated)`);
    return 'web-reminder-id';
}

export async function cancelAllNotifications() {
    console.log('[Web] All notifications cancelled (simulated)');
}
