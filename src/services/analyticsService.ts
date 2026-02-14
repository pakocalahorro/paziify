import { supabase } from './supabaseClient';
import LocalAnalyticsService from './LocalAnalyticsService';
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
        const CACHE_KEY = `@user_stats_${userId}`;
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
        const CACHE_KEY = `@weekly_activity_${userId}`;
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
    async getCategoryDistribution(userId: string): Promise<CategoryDistribution[]> {
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
                const category = sessionMap[log.session_id] || 'otros';
                distribution[category] = (distribution[category] || 0) + 1;
            };

            logs?.forEach(processLog);
            localLogs.forEach(processLog);

            return Object.entries(distribution).map(([category, count]) => ({ category, count }));
        } catch (error) {
            console.log('AnalyticsService: Silent error in getCategoryDistribution (offline?):', error);
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
                // If success, we could theoretically remove it from local queue OR 
                // just wait for a formal sync cycle later to avoid duplicates.
                // For now, simple shadow save is safer.
            }
        } catch (error) {
            console.log('AnalyticsService: Silenced recordSession error (stored local):', error);
        }
    }
};
