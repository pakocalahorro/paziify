import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_LOGS_KEY = '@paziify_offline_logs';

export interface MeditationLog {
    session_id: string;
    duration_minutes: number;
    mood_score: number;
    completed_at: string;
    challenge_id?: string;
    challenge_day?: number;
    life_mode?: string;
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
     * Elimina un log específico de la cola local (tras sincronización exitosa)
     */
    async removeLog(completedAt: string): Promise<void> {
        try {
            const existing = await this.getLogs();
            const filtered = existing.filter(l => l.completed_at !== completedAt);
            await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('LocalAnalyticsService: Error removing log', error);
        }
    }

    /**
     * Limpia los logs locales (desactivado por defecto para seguridad, preferir removeLog)
     */
    async clearLogs(): Promise<void> {
        await AsyncStorage.removeItem(PENDING_LOGS_KEY);
    }
}

export default new LocalAnalyticsService();
