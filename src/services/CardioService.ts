import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export interface CardioResult {
    id: string;
    timestamp: string; // ISO string
    bpm: number;
    hrv: number;
    mood?: number; // 1-5 (Post-session)
    context: 'baseline' | 'post_session';
    diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio';
    session_link_id?: string; // If post-session
}

const STORAGE_KEY = '@cardio_history';

export const CardioService = {
    /**
     * Save a new scan result to local storage
     */
    async saveScan(result: Omit<CardioResult, 'id' | 'timestamp'>): Promise<CardioResult> {
        try {
            const newScan: CardioResult = {
                ...result,
                id: Crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            };

            const existingdata = await AsyncStorage.getItem(STORAGE_KEY);
            const history: CardioResult[] = existingdata ? JSON.parse(existingdata) : [];

            // Prepend new scan (newest first)
            const updatedHistory = [newScan, ...history];

            // Limit history to keep storage lean (e.g., last 1000 scans)
            if (updatedHistory.length > 1000) {
                updatedHistory.length = 1000;
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
            return newScan;
        } catch (error) {
            console.error('[CardioService] Failed to save scan:', error);
            throw error;
        }
    },

    /**
     * Get scan history
     */
    async getHistory(limit: number = 30): Promise<CardioResult[]> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return [];
            const history = JSON.parse(json);
            return history.slice(0, limit);
        } catch (error) {
            console.error('[CardioService] Failed to get history:', error);
            return [];
        }
    },

    /**
     * Get latest baseline scan (for post-session comparison)
     */
    async getLatestBaseline(): Promise<CardioResult | null> {
        try {
            const history = await this.getHistory(50);
            return history.find(scan => scan.context === 'baseline') || null;
        } catch (error) {
            return null;
        }
    },

    /**
     * Get today's baseline scan (for pre/post session comparison)
     */
    async getTodayBaseline(): Promise<CardioResult | null> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const history = await this.getHistory(50);
            return history.find(scan =>
                scan.context === 'baseline' && scan.timestamp.startsWith(today)
            ) || null;
        } catch {
            return null;
        }
    },

    /**
     * Get week trend data for the mini-chart (last 7 scans)
     * Returns scans ordered oldest → newest for chart rendering
     */
    async getWeekTrend(): Promise<CardioResult[]> {
        try {
            const history = await this.getHistory(7);
            return history.reverse(); // Oldest first for chart
        } catch {
            return [];
        }
    },

    /**
     * Clear history (Development/Privacy)
     */
    async clearHistory(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
};
