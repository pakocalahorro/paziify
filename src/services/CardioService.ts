import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { supabase } from './supabaseClient';

export interface CardioResult {
    id: string;
    timestamp: string; // ISO string
    bpm: number;
    hrv: number;
    mood?: number; // 1-5 (Post-session)
    context: 'baseline' | 'post_session';
    diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio';
    session_link_id?: string; // If post-session
    user_id?: string;
    life_mode?: string;
}

const STORAGE_KEY = '@cardio_history';
const OFFLINE_QUEUE_KEY = '@paziify_offline_cardio_scans';

export const CardioService = {
    /**
     * Save a new scan result to local storage and Supabase
     */
    async saveScan(result: Omit<CardioResult, 'id' | 'timestamp'>): Promise<CardioResult> {
        try {
            const newScan: CardioResult = {
                ...result,
                id: Crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            };

            // 1. Save Locally
            const existingdata = await AsyncStorage.getItem(STORAGE_KEY);
            const history: CardioResult[] = existingdata ? JSON.parse(existingdata) : [];
            const updatedHistory = [newScan, ...history].slice(0, 1000);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

            // 2. Sync to Supabase if authenticated
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('cardio_scans')
                    .insert({
                        id: newScan.id,
                        user_id: user.id, // Ensure user_id is assigned
                        bpm: newScan.bpm,
                        hrv: newScan.hrv,
                        mood: newScan.mood,
                        scan_context: newScan.context, // Mapped to DB column scan_context
                        life_mode: newScan.life_mode,
                        diagnosis: newScan.diagnosis,
                        session_link_id: newScan.session_link_id,
                        created_at: newScan.timestamp // Mapped to DB naming if needed, keeping timestamp as fallback
                    });
                
                if (error) {
                    console.warn('[CardioService] Remote sync failed, queueing offline:', error.message);
                    await this.enqueueOfflineScan(newScan);
                } else {
                    console.log('[CardioService] Remote sync successful');
                }
            } else {
                console.log('[CardioService] No authenticated user, queueing offline');
                await this.enqueueOfflineScan(newScan);
            }

            return newScan;
        } catch (error) {
            console.error('[CardioService] Failed to save scan:', error);
            throw error;
        }
    },

    async enqueueOfflineScan(scan: CardioResult) {
        try {
            const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
            const queue = raw ? JSON.parse(raw) : [];
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([...queue, scan]));
        } catch (e) {
            console.error('[CardioService] Failed to enqueue offline scan:', e);
        }
    },

    async syncPendingScans(userId: string) {
        try {
            const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
            const queue: CardioResult[] = raw ? JSON.parse(raw) : [];
            if (queue.length === 0) return;

            console.log(`[CardioService] Syncing ${queue.length} pending scans for user ${userId}...`);
            const syncedIds: string[] = [];
            
            for (const scan of queue) {
                const { error } = await supabase
                    .from('cardio_scans')
                    .insert({
                        id: scan.id,
                        user_id: userId,
                        bpm: scan.bpm,
                        hrv: scan.hrv,
                        mood: scan.mood,
                        scan_context: scan.context,
                        life_mode: scan.life_mode,
                        diagnosis: scan.diagnosis,
                        session_link_id: scan.session_link_id,
                        created_at: scan.timestamp
                    });
                
                if (!error) {
                    syncedIds.push(scan.id);
                } else {
                    console.error('[CardioService] Individual scan sync fail:', error.message);
                }
            }

            const remaining = queue.filter(s => !syncedIds.includes(s.id));
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
            console.log(`[CardioService] Sync complete. ${syncedIds.length} uploaded, ${remaining.length} remaining.`);
        } catch (error) {
            console.error('[CardioService] syncPendingScans error:', error);
        }
    },

    /**
     * Get scan history (merged Local + Supabase)
     */
    async getHistory(limit: number = 30): Promise<CardioResult[]> {
        try {
            // Priority 1: Local
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            let localHistory: CardioResult[] = json ? JSON.parse(json) : [];

            // If local is empty, try to fetch from Supabase
            if (localHistory.length === 0) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('cardio_scans')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('timestamp', { ascending: false })
                        .limit(limit);
                    
                    if (data && !error) {
                        localHistory = data;
                        // Cache locally for next time
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    }
                }
            }

            return localHistory.slice(0, limit);
        } catch (error) {
            console.error('[CardioService] Failed to get history:', error);
            return [];
        }
    },

    /**
     * Get latest baseline scan
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
     * Get today's baseline scan
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
     * Get week trend data for the mini-chart
     */
    async getWeekTrend(): Promise<CardioResult[]> {
        try {
            const history = await this.getHistory(7);
            return [...history].reverse(); // Oldest first for chart
        } catch {
            return [];
        }
    },

    /**
     * Clear history
     */
    async clearHistory(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
};
