import { supabase } from './supabaseClient';
import LocalAnalyticsService from './LocalAnalyticsService';
import { CATEGORY_MODE_MAP } from '../constants/categories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEDITATION_SESSIONS } from '../data/sessionsData';

export interface UserStats {
    totalMinutes: number;
    sessionsCount: number;
    currentStreak: number;
    resilienceScore: number;
}

export interface DailyActivity {
    day: string; // ISO Date "YYYY-MM-DD"
    minutes: number;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

export const analyticsService = {
    /**
     * Get core user statistics
     */
    async getUserStats(userId: string): Promise<UserStats> {
        const CACHE_KEY = `@user_stats_${userId} `;
        try {
            // 1. Fetch profile for streak and score
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('streak, resilience_score')
                .eq('id', userId)
                .single();

            // 2. Fetch logs summary
            const { data: logs, error: logsError } = await supabase
                .from('meditation_logs')
                .select('duration_minutes')
                .eq('user_id', userId);

            // 3. Merge with Local Pending Logs
            const localLogs = await LocalAnalyticsService.getLogs();

            const remoteMinutes = logs?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;
            const localMinutes = localLogs.reduce((acc, curr) => acc + curr.duration_minutes, 0);

            const totalMinutes = remoteMinutes + localMinutes;
            const sessionsCount = (logs?.length || 0) + localLogs.length;

            const stats = {
                totalMinutes,
                sessionsCount,
                currentStreak: profile?.streak || 0,
                resilienceScore: profile?.resilience_score || 0
            };

            // Save to cache
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(stats));
            return stats;
        } catch (error) {
            console.log('AnalyticsService: Offline getUserStats (Reading cache):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : { totalMinutes: 0, sessionsCount: 0, currentStreak: 0, resilienceScore: 0 };
        }
    },

    /**
     * Get meditation activity for today
     */
    async getTodayStats(userId: string): Promise<{ minutes: number; sessionCount: number }> {
        const today = new Date().toISOString().split('T')[0];
        try {
            const { data, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes')
                .eq('user_id', userId)
                .gte('completed_at', today);

            // Merge with local logs from today
            const localLogs = await LocalAnalyticsService.getLogs();
            const todayLocal = localLogs.filter(l => l.completed_at.startsWith(today));

            const remoteMinutes = data?.reduce((acc, log) => acc + (log.duration_minutes || 0), 0) || 0;
            const localMinutes = todayLocal.reduce((acc, log) => acc + log.duration_minutes, 0);

            return {
                minutes: Math.round(remoteMinutes + localMinutes),
                sessionCount: (data?.length || 0) + todayLocal.length
            };
        } catch (error) {
            console.log('AnalyticsService: Silenced getTodayStats error (offline?):', error);
            return { minutes: 0, sessionCount: 0 };
        }
    },

    async getWeeklyActivity(userId: string): Promise<DailyActivity[]> {
        const CACHE_KEY = `@weekly_activity_${userId} `;
        try {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 for Mon, 6 for Sun

            const monday = new Date(now);
            monday.setDate(now.getDate() - diff);
            monday.setHours(12, 0, 0, 0); // Use noon to avoid TZ shifts
            const startDate = new Date(monday);
            startDate.setHours(0, 0, 0, 0);

            // 1. Fetch Remote Logs
            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at')
                .eq('user_id', userId)
                .gte('completed_at', startDate.toISOString());

            // 2. Fetch Local Logs
            const localLogs = await LocalAnalyticsService.getLogs();
            const weekLocal = localLogs.filter(l => l.completed_at >= startDate.toISOString());

            const dailyMap: Record<string, number> = {};

            // Fill Mon to Sun
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                dailyMap[dateStr] = 0;
            }

            // Sync Remote
            logs?.forEach(log => {
                const dateStr = new Date(log.completed_at).toISOString().split('T')[0];
                if (dailyMap[dateStr] !== undefined) {
                    dailyMap[dateStr] += log.duration_minutes || 0;
                }
            });

            // Sync Local
            weekLocal.forEach(log => {
                const dateStr = log.completed_at.split('T')[0];
                if (dailyMap[dateStr] !== undefined) {
                    dailyMap[dateStr] += log.duration_minutes;
                }
            });

            const result = Object.entries(dailyMap)
                .map(([day, minutes]) => ({ day, minutes }))
                .sort((a, b) => a.day.localeCompare(b.day));

            // Save to cache
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result));
            return result;
        } catch (error) {
            console.log('AnalyticsService: Offline getWeeklyActivity (Reading cache):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    },

    /**
     * Get distribution of content categories consumed
     */
    async getCategoryDistribution(userId: string): Promise<Record<string, number>> {
        try {
            const sessionMap: Record<string, string> = {};

            // Fallback: Populate mapping from local data first
            MEDITATION_SESSIONS.forEach(s => {
                sessionMap[s.id] = s.category;
            });

            // 1. Fetch sessions metadata from Supabase if possible
            try {
                const { data: sessions, error: sessionsError } = await supabase
                    .from('meditation_sessions_content')
                    .select('id, category, legacy_id');

                if (!sessionsError && sessions) {
                    sessions.forEach(s => {
                        sessionMap[s.id] = s.category;
                        if (s.legacy_id) sessionMap[s.legacy_id] = s.category;
                    });
                }
            } catch (innerErr) {
                console.log('AnalyticsService: Skipping remote category mapping (offline)');
            }

            // 2. Fetch user logs (Priority: Supabase + Local)
            const { data: logs, error: logsError } = await supabase
                .from('meditation_logs')
                .select('session_id')
                .eq('user_id', userId);

            const localLogs = await LocalAnalyticsService.getLogs();

            const distribution: Record<string, number> = {};

            const processLog = (log: any) => {
                const rawCategory = sessionMap[log.session_id] || 'otros';
                const mappedCategory = CATEGORY_MODE_MAP[rawCategory] || rawCategory; // Map to broader mode if available
                distribution[mappedCategory] = (distribution[mappedCategory] || 0) + 1;
            };

            logs?.forEach(processLog);
            localLogs.forEach(processLog);

            return distribution;
        } catch (error) {
            console.error('Error fetching category distribution:', error);
            return {};
        }
    },

    /**
     * Obtiene la actividad detallada del mes natural (1 al 31)
     */
    async getMonthlyActivity(userId: string, month?: number, year?: number): Promise<{ day: string; minutes: number }[]> {
        const now = new Date();
        const m = month !== undefined ? month : now.getMonth();
        const y = year !== undefined ? year : now.getFullYear();

        const CACHE_KEY = `@monthly_activity_${userId}_${y}_${m}`;
        try {
            const startDate = new Date(y, m, 1);
            const endDate = new Date(y, m + 1, 0); // Último día del mes
            endDate.setHours(23, 59, 59, 999);

            // 1. Fetch Remote Logs
            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at')
                .eq('user_id', userId)
                .gte('completed_at', startDate.toISOString())
                .lte('completed_at', endDate.toISOString())
                .order('completed_at', { ascending: true });

            if (error) throw error;

            // 2. Fetch Local Logs
            const localLogs = await LocalAnalyticsService.getLogs();
            const monthLocal = localLogs.filter(l => l.completed_at >= startDate.toISOString() && l.completed_at <= endDate.toISOString());

            // Agrupar por día
            const activityMap: Record<string, number> = {};
            const daysInMonth = endDate.getDate();

            // Inicializar todos los días del mes natural a 0
            for (let i = 1; i <= daysInMonth; i++) {
                const d = new Date(y, m, i, 12, 0, 0);
                const yearStr = d.getFullYear();
                const monthStr = String(d.getMonth() + 1).padStart(2, '0');
                const dayStr = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
                activityMap[dateStr] = 0;
            }

            // Sync Remote
            logs?.forEach(session => {
                const dateStr = session.completed_at.split('T')[0];
                if (activityMap[dateStr] !== undefined) {
                    activityMap[dateStr] += session.duration_minutes || 0;
                }
            });

            // Sync Local
            monthLocal.forEach(log => {
                const dateStr = log.completed_at.split('T')[0];
                if (activityMap[dateStr] !== undefined) {
                    activityMap[dateStr] += log.duration_minutes;
                }
            });

            const result = Object.entries(activityMap).map(([day, minutes]) => ({
                day,
                minutes: Math.round(minutes)
            })).sort((a, b) => a.day.localeCompare(b.day));

            // Guardar en caché
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
                data: result,
                timestamp: Date.now()
            }));

            return result;
        } catch (error) {
            console.error('Error fetching monthly activity:', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data } = JSON.parse(cached);
                return data;
            }
            return [];
        }
    },

    /**
     * Record a completed session
     */
    async recordSession(userId: string, sessionId: string, durationMinutes: number, moodScore: number): Promise<void> {
        const completed_at = new Date().toISOString();

        // 1. Local Shadow Save (Instant Resilience)
        await LocalAnalyticsService.saveLog({
            session_id: sessionId,
            duration_minutes: durationMinutes,
            mood_score: moodScore,
            completed_at
        });

        // 2. Attempt Supabase Save
        try {
            const { error } = await supabase
                .from('meditation_logs')
                .insert({
                    user_id: userId,
                    session_id: sessionId,
                    duration_minutes: durationMinutes,
                    mood_score: moodScore,
                    completed_at
                });

            if (error) {
                console.log('AnalyticsService: Offline record detected, kept in local queue.');
            } else {
                // [FIX C-2] Log subido a Supabase con éxito → limpiar cola local
                // para evitar que las estadísticas cuenten el mismo log dos veces
                // (una vez desde el local queue y otra desde meditation_logs remoto).
                await LocalAnalyticsService.clearLogs();
            }
        } catch (error) {
            console.log('AnalyticsService: Silenced recordSession error (stored local):', error);
        }
    }
};
