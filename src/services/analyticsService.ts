import { supabase } from './supabaseClient';

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
        try {
            // 1. Fetch profile for streak and score
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('streak, resilience_score')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            // 2. Fetch logs summary
            const { data: logs, error: logsError } = await supabase
                .from('meditation_logs')
                .select('duration_minutes')
                .eq('user_id', userId);

            if (logsError) throw logsError;

            const totalMinutes = logs?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;
            const sessionsCount = logs?.length || 0;

            return {
                totalMinutes,
                sessionsCount,
                currentStreak: profile?.streak || 0,
                resilienceScore: profile?.resilience_score || 0
            };
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return { totalMinutes: 0, sessionsCount: 0, currentStreak: 0, resilienceScore: 0 };
        }
    },

    /**
     * Get meditation activity for today
     */
    async getTodayStats(userId: string): Promise<{ minutes: number; sessionCount: number }> {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('meditation_logs')
            .select('duration_minutes')
            .eq('user_id', userId)
            .gte('completed_at', today);

        if (error) return { minutes: 0, sessionCount: 0 };
        const totalMinutes = data.reduce((acc, log) => acc + (log.duration_minutes || 0), 0);
        return { minutes: Math.round(totalMinutes), sessionCount: data.length };
    },

    async getWeeklyActivity(userId: string): Promise<DailyActivity[]> {
        try {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 for Mon, 6 for Sun

            const monday = new Date(now);
            monday.setDate(now.getDate() - diff);
            monday.setHours(12, 0, 0, 0); // Use noon to avoid TZ shifts when calling toISOString
            const startDate = new Date(monday);
            startDate.setHours(0, 0, 0, 0); // For the query, we want the start of the day

            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at')
                .eq('user_id', userId)
                .gte('completed_at', startDate.toISOString());

            if (error) throw error;

            const dailyMap: Record<string, number> = {};

            // Fill Mon to Sun
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                dailyMap[dateStr] = 0;
            }

            logs?.forEach(log => {
                const dateStr = new Date(log.completed_at).toISOString().split('T')[0];
                if (dailyMap[dateStr] !== undefined) {
                    dailyMap[dateStr] += log.duration_minutes || 0;
                }
            });

            return Object.entries(dailyMap)
                .map(([day, minutes]) => ({ day, minutes }))
                .sort((a, b) => a.day.localeCompare(b.day));
        } catch (error) {
            console.error('Error fetching weekly activity:', error);
            return [];
        }
    },

    /**
     * Get distribution of content categories consumed
     */
    async getCategoryDistribution(userId: string): Promise<CategoryDistribution[]> {
        try {
            // 1. Fetch sessions metadata (id and category) to create a map
            const { data: sessions, error: sessionsError } = await supabase
                .from('meditation_sessions_content')
                .select('id, category, legacy_id');

            if (sessionsError) throw sessionsError;

            const sessionMap: Record<string, string> = {};
            sessions?.forEach(s => {
                sessionMap[s.id] = s.category;
                if (s.legacy_id) sessionMap[s.legacy_id] = s.category;
            });

            // 2. Fetch user logs
            const { data: logs, error: logsError } = await supabase
                .from('meditation_logs')
                .select('session_id')
                .eq('user_id', userId);

            if (logsError) throw logsError;

            const distribution: Record<string, number> = {};
            logs?.forEach((log: any) => {
                const category = sessionMap[log.session_id] || 'otros';
                distribution[category] = (distribution[category] || 0) + 1;
            });

            return Object.entries(distribution).map(([category, count]) => ({ category, count }));
        } catch (error) {
            console.error('Error fetching category distribution:', error);
            return [];
        }
    },

    /**
     * Record a completed session
     */
    async recordSession(userId: string, sessionId: string, durationMinutes: number, moodScore: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('meditation_logs')
                .insert({
                    user_id: userId,
                    session_id: sessionId,
                    duration_minutes: durationMinutes,
                    mood_score: moodScore,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error recording session:', error);
        }
    }
};
