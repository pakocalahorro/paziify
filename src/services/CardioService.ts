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
}

const STORAGE_KEY = '@cardio_history';

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
                        user_id: user.id,
                        bpm: newScan.bpm,
                        hrv: newScan.hrv,
                        mood: newScan.mood,
                        context: newScan.context,
                        diagnosis: newScan.diagnosis,
                        session_link_id: newScan.session_link_id,
                        timestamp: newScan.timestamp
                    });
                
                if (error) console.warn('[CardioService] Remote sync failed:', error.message);
                else console.log('[CardioService] Remote sync successful');
            }

            return newScan;
        } catch (error) {
            console.error('[CardioService] Failed to save scan:', error);
            throw error;
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
