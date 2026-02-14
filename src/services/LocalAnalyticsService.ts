import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_LOGS_KEY = '@paziify_offline_logs';

export interface MeditationLog {
    session_id: string;
    duration_minutes: number;
    mood_score: number;
    completed_at: string;
}

class LocalAnalyticsService {
    /**
     * Guarda un log localmente y lo añade a la cola de sincronización
     */
    async saveLog(log: MeditationLog): Promise<void> {
        try {
            const existing = await this.getLogs();
            existing.push(log);
            await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(existing));
            console.log('LocalAnalyticsService: Log saved locally (offline-ready)');
        } catch (error) {
            console.error('LocalAnalyticsService: Error saving log', error);
        }
    }

    /**
     * Obtiene todos los logs locales (pendientes de subir)
     */
    async getLogs(): Promise<MeditationLog[]> {
        try {
            const data = await AsyncStorage.getItem(PENDING_LOGS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('LocalAnalyticsService: Error reading logs', error);
            return [];
        }
    }

    /**
     * Limpia los logs locales (después de sincronizar)
     */
    async clearLogs(): Promise<void> {
        await AsyncStorage.removeItem(PENDING_LOGS_KEY);
    }
}

export default new LocalAnalyticsService();
