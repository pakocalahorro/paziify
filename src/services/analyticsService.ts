import { supabase } from './supabaseClient';
import LocalAnalyticsService from './LocalAnalyticsService';
import { CATEGORY_MODE_MAP } from '../constants/categories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEDITATION_SESSIONS } from '../data/sessionsData';

// Cache en memoria para evitar refrescos innecesarios en la misma sesión (TTL: 2 min)
const _memCache = new Map<string, { data: any, ts: number }>();
const MEM_TTL = 120000;

function getCache(key: string) {
    const hit = _memCache.get(key);
    if (hit && Date.now() - hit.ts < MEM_TTL) return hit.data;
    return null;
}

function setCache(key: string, data: any) {
    _memCache.set(key, { data, ts: Date.now() });
}

export interface UserStats {
    totalMinutes: number;
    sessionsCount: number;
    currentStreak: number;
    resilienceScore: number;
}

export interface DailyActivity {
    day: string; // ISO Date "YYYY-MM-DD"
    minutes: number;
    avgMood?: number;
    isChallenge?: boolean;
}

export interface CategoryDistribution {
    category: string;
    count: number;
}

// Helper para obtener YYYY-MM-DD en hora local (evita desfases UTC)
const _toLocalDateStr = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const analyticsService = {
    /**
     * Get core user statistics
     */
    async getUserStats(userId: string): Promise<UserStats> {
        const CACHE_KEY = `@user_stats_${userId}`;
        const memHit = getCache(CACHE_KEY);
        if (memHit) return memHit;

        try {
            // 🚀 THE HIGHWAY: Cálculo en servidor
            const { data, error } = await supabase.rpc('get_user_performance_summary', { 
                p_user_id: userId 
            });

            if (error) throw error;
            
            // Sync Hardening: Local logs are only those NOT YET in Supabase
            const localLogs = await LocalAnalyticsService.getLogs();
            const localMinutes = localLogs.reduce((acc, curr) => acc + curr.duration_minutes, 0);

            // Guardamos en caché SOLO la verdad del servidor (Data Remota)
            // Esto evita el doble conteo al entrar en modo offline
            const remoteStats = {
                totalMinutes: data.totalMinutes || 0,
                sessionsCount: data.sessionsCount || 0,
                currentStreak: data.currentStreak || 0,
                resilienceScore: data.resilienceScore || 50
            };
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remoteStats));

            const stats: UserStats = {
                totalMinutes: remoteStats.totalMinutes + localMinutes,
                sessionsCount: remoteStats.sessionsCount + localLogs.length,
                currentStreak: remoteStats.currentStreak,
                resilienceScore: remoteStats.resilienceScore
            };

            setCache(CACHE_KEY, stats);
            return stats;
        } catch (error) {
            console.log('AnalyticsService: Offline getUserStats (Fallback to cache + local):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            const remoteStats = cached ? JSON.parse(cached) : { totalMinutes: 0, sessionsCount: 0, currentStreak: 0, resilienceScore: 50 };
            
            const localLogs = await LocalAnalyticsService.getLogs();
            const localMinutes = localLogs.reduce((acc, curr) => acc + curr.duration_minutes, 0);

            return {
                totalMinutes: remoteStats.totalMinutes + localMinutes,
                sessionsCount: remoteStats.sessionsCount + localLogs.length,
                currentStreak: remoteStats.currentStreak, // Racha se maneja en AppContext con protección
                resilienceScore: remoteStats.resilienceScore
            };
        }
    },

    /**
     * Get meditation activity for today
     */
    async getTodayStats(userId: string): Promise<{ minutes: number; sessionCount: number }> {
        const today = _toLocalDateStr(new Date());
        const CACHE_KEY = `@today_stats_${userId}`;
        const memHit = getCache(CACHE_KEY);
        if (memHit) return memHit;

        try {
            const { data, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes')
                .eq('user_id', userId)
                .gte('completed_at', today);

            if (error) throw error;

            const remoteMinutes = data?.reduce((acc, log) => acc + (log.duration_minutes || 0), 0) || 0;
            const remoteCount = data?.length || 0;

            // Guardar SOLO la verdad remota en caché persistente
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
                minutes: remoteMinutes,
                sessionCount: remoteCount,
                date: today
            }));

            // Merge with local logs from today
            const localLogs = await LocalAnalyticsService.getLogs();
            const todayLocal = localLogs.filter(l => l.completed_at.startsWith(today));
            const localMinutes = todayLocal.reduce((acc, log) => acc + log.duration_minutes, 0);

            const result = {
                minutes: Math.round(remoteMinutes + localMinutes),
                sessionCount: remoteCount + todayLocal.length
            };

            setCache(CACHE_KEY, result);
            return result;
        } catch (error) {
            console.log('AnalyticsService: Offline getTodayStats (Fallback to cache + local):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            let remote = { minutes: 0, sessionCount: 0 };
            
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.date === today) {
                    remote = { minutes: parsed.minutes, sessionCount: parsed.sessionCount };
                }
            }
            
            // Sumar logs locales de hoy siempre dinámicamente
            const localLogs = await LocalAnalyticsService.getLogs();
            const todayLocal = localLogs.filter(l => l.completed_at.startsWith(today));
            const localMinutes = todayLocal.reduce((acc, log) => acc + log.duration_minutes, 0);
            
            return {
                minutes: remote.minutes + localMinutes,
                sessionCount: remote.sessionCount + todayLocal.length
            };
        }
    },

    async getWeeklyActivity(userId: string): Promise<DailyActivity[]> {
        const CACHE_KEY = `@weekly_activity_${userId}`;
        const memHit = getCache(CACHE_KEY);
        if (memHit) return memHit;

        try {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            const monday = new Date(now);
            monday.setDate(now.getDate() - diff);
            monday.setHours(0, 0, 0, 0);
            const startDate = monday.toISOString();

            // 1. Fetch Remote Logs
            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at, mood_score, challenge_id')
                .eq('user_id', userId)
                .gte('completed_at', startDate);

            if (error) throw error;

            // Guardar SOLO la verdad remota en caché
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(logs || []));

            // 2. Fetch Local Logs
            const localLogs = await LocalAnalyticsService.getLogs();
            const weekLocal = localLogs.filter(l => l.completed_at >= startDate);

            // Merge y cálculo final
            const result = this._mergeLogsToWeekly(logs || [], weekLocal, monday);

            setCache(CACHE_KEY, result);
            return result;
        } catch (error) {
            console.log('AnalyticsService: Offline getWeeklyActivity (Fallback to cache + local):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            const remoteLogs: any[] = cached ? JSON.parse(cached) : [];
            
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const monday = new Date(now);
            monday.setDate(now.getDate() - diff);
            monday.setHours(0, 0, 0, 0);

            const localLogs = await LocalAnalyticsService.getLogs();
            const weekLocal = localLogs.filter(l => l.completed_at >= monday.toISOString());

            return this._mergeLogsToWeekly(remoteLogs, weekLocal, monday);
        }
    },

    /**
     * Helper para fusionar logs remotos y locales en la estructura semanal
     */
    _mergeLogsToWeekly(remote: any[], local: any[], monday: Date): DailyActivity[] {
        const dailyMap: Record<string, { minutes: number; moodSum: number; moodCount: number; isChallenge: boolean }> = {};

        // Inicializar Mon a Sun
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = _toLocalDateStr(d);
            dailyMap[dateStr] = { minutes: 0, moodSum: 0, moodCount: 0, isChallenge: false };
        }

        const all = [...remote, ...local];
        all.forEach(log => {
            const dateStr = _toLocalDateStr(new Date(log.completed_at));
            if (dailyMap[dateStr] !== undefined) {
                dailyMap[dateStr].minutes += log.duration_minutes || 0;
                if (log.challenge_id) dailyMap[dateStr].isChallenge = true;
                if (log.mood_score) {
                    dailyMap[dateStr].moodSum += log.mood_score;
                    dailyMap[dateStr].moodCount += 1;
                }
            }
        });

        return Object.entries(dailyMap)
            .map(([day, stats]) => ({
                day,
                minutes: stats.minutes,
                avgMood: stats.moodCount > 0 ? stats.moodSum / stats.moodCount : undefined,
                isChallenge: stats.isChallenge
            }))
            .sort((a, b) => a.day.localeCompare(b.day));
    },

    /**
     * Obtiene el patrón histórico de rendimiento por día de la semana (L-D).
     * Analiza todo el historial para dar un promedio de minutos habituales por cada día.
     */
    async getWeekdayHistoricalPattern(userId: string): Promise<DailyActivity[]> {
        const CACHE_KEY = `@weekday_pattern_${userId}`;
        const memHit = getCache(CACHE_KEY);
        if (memHit) return memHit;

        try {
            // 1. Obtener todos los logs del servidor
            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at, mood_score')
                .eq('user_id', userId);

            if (error) throw error;

            // Guardar en caché persistente el dataset remoto real
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(logs || []));

            // 2. Obtener logs locales pendientes
            const localLogs = await LocalAnalyticsService.getLogs();

            const result = this._computeWeekdayPattern(logs || [], localLogs);
            setCache(CACHE_KEY, result);
            return result;
        } catch (error) {
            console.log('AnalyticsService: Offline getWeekdayHistoricalPattern (Fallback):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            const remoteLogs = cached ? JSON.parse(cached) : [];
            const localLogs = await LocalAnalyticsService.getLogs();

            const result = this._computeWeekdayPattern(remoteLogs, localLogs);
            // No guardamos en caché de memoria fallbacks vacíos si no hay nada
            if (result.length > 0) setCache(CACHE_KEY, result);
            return result;
        }
    },

    /**
     * Helper para calcular el patrón promedio de minutos y ánimo por día de la semana
     */
    _computeWeekdayPattern(remote: any[], local: any[]): DailyActivity[] {
        const allLogs = [...remote, ...local];
        if (allLogs.length === 0) return [];

        const weekdayMinutes: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        const weekdayMood: Record<number, { sum: number; count: number }> = { 
            0: { sum: 0, count: 0 }, 1: { sum: 0, count: 0 }, 2: { sum: 0, count: 0 }, 
            3: { sum: 0, count: 0 }, 4: { sum: 0, count: 0 }, 5: { sum: 0, count: 0 }, 
            6: { sum: 0, count: 0 } 
        };
        const weekdayOccurrences: Record<number, Set<string>> = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set() };

        allLogs.forEach(log => {
            const d = new Date(log.completed_at);
            const dayOfWeek = d.getDay();
            const dateStr = _toLocalDateStr(d);
            
            weekdayMinutes[dayOfWeek] += log.duration_minutes || 0;
            weekdayOccurrences[dayOfWeek].add(dateStr);
            
            if (log.mood_score) {
                weekdayMood[dayOfWeek].sum += log.mood_score;
                weekdayMood[dayOfWeek].count += 1;
            }
        });

        const now = new Date();
        const currentDayOfWeek = now.getDay();
        const diff = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - diff);
        monday.setHours(12, 0, 0, 0);

        const result: DailyActivity[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const isoDate = _toLocalDateStr(d);
            const dayIdx = d.getDay();

            const totalMins = weekdayMinutes[dayIdx];
            const totalDaysActive = weekdayOccurrences[dayIdx].size;
            const avgMinutes = totalDaysActive > 0 ? totalMins / totalDaysActive : 0;
            const avgMood = weekdayMood[dayIdx].count > 0 ? weekdayMood[dayIdx].sum / weekdayMood[dayIdx].count : undefined;

            result.push({
                day: isoDate,
                minutes: Math.round(avgMinutes),
                avgMood: avgMood
            });
        }
        return result;
    },

    /**
     * Get distribution of content categories consumed
     */
    async getCategoryDistribution(userId: string): Promise<Record<string, number>> {
        const CACHE_KEY = `cat_dist_${userId}`;
        const memHit = getCache(CACHE_KEY);
        if (memHit) return memHit;

        try {
            // 🚀 THE HIGHWAY: JOIN y Agregación en servidor
            // Esto elimina la necesidad de descargar el catálogo entero
            const { data, error } = await supabase.rpc('get_user_category_distribution', { 
                p_user_id: userId 
            });

            if (error) throw error;
            
            const distribution = data || {};
            
            // Mezclar con categorías de logs locales (si existen)
            const localLogs = await LocalAnalyticsService.getLogs();
            if (localLogs.length > 0) {
                // Para logs locales, sí mapeamos contra las sesiones estáticas
                localLogs.forEach(log => {
                    const session = MEDITATION_SESSIONS.find(s => s.id === log.session_id);
                    const cat = session?.category || 'otros';
                    distribution[cat] = (distribution[cat] || 0) + 1;
                });
            }

            setCache(CACHE_KEY, distribution);
            return distribution;
        } catch (error) {
            console.error('AnalyticsService: Error RPC getCategoryDistribution:', error);
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
            const endDate = new Date(y, m + 1, 0, 23, 59, 59);

            // 1. Fetch Remote Logs
            const { data: logs, error } = await supabase
                .from('meditation_logs')
                .select('duration_minutes, completed_at, mood_score')
                .eq('user_id', userId)
                .gte('completed_at', startDate.toISOString())
                .lte('completed_at', endDate.toISOString())
                .order('completed_at', { ascending: true });

            if (error) throw error;

            // Guardamos SOLO los remotos en caché
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
                data: logs || [],
                timestamp: Date.now()
            }));

            // 2. Fetch Local Logs
            const localLogs = await LocalAnalyticsService.getLogs();
            const monthLocal = localLogs.filter(l => l.completed_at >= startDate.toISOString() && l.completed_at <= endDate.toISOString());

            return this._mergeLogsToMonthly(logs || [], monthLocal, y, m);
        } catch (error) {
            console.log('AnalyticsService: Offline getMonthlyActivity (Fallback):', error);
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            const remoteLogs = cached ? JSON.parse(cached).data : [];

            // Fetch Local Logs
            const localLogs = await LocalAnalyticsService.getLogs();
            const startDate = new Date(y, m, 1);
            const endDate = new Date(y, m + 1, 0, 23, 59, 59);
            const monthLocal = localLogs.filter(l => l.completed_at >= startDate.toISOString() && l.completed_at <= endDate.toISOString());

            return this._mergeLogsToMonthly(remoteLogs, monthLocal, y, m);
        }
    },

    _mergeLogsToMonthly(remote: any[], local: any[], year: number, month: number) {
        const activityMap: Record<string, { minutes: number; moodSum: number; moodCount: number }> = {};
        const endDate = new Date(year, month + 1, 0); 
        const daysInMonth = endDate.getDate();

        // Inicializar
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i, 12, 0, 0);
            const dateStr = _toLocalDateStr(d);
            activityMap[dateStr] = { minutes: 0, moodSum: 0, moodCount: 0 };
        }
        
        [...remote, ...local].forEach(session => {
            const dateStr = _toLocalDateStr(new Date(session.completed_at));
            if (activityMap[dateStr] !== undefined) {
                activityMap[dateStr].minutes += session.duration_minutes || 0;
                if (session.mood_score) {
                    activityMap[dateStr].moodSum += session.mood_score;
                    activityMap[dateStr].moodCount += 1;
                }
            }
        });

        return Object.entries(activityMap).map(([day, stats]) => ({
            day,
            minutes: Math.round(stats.minutes),
            avgMood: stats.moodCount > 0 ? stats.moodSum / stats.moodCount : undefined
        })).sort((a, b) => a.day.localeCompare(b.day));
    },

    /**
     * Record a completed session
     */
    async recordSession(
        userId: string, 
        sessionId: string, 
        durationMinutes: number, 
        moodScore: number,
        challengeId?: string,
        challengeDay?: number,
        lifeMode?: string
    ): Promise<void> {
        const completed_at = new Date().toISOString();

        // 1. Local Shadow Save (Instant Resilience)
        await LocalAnalyticsService.saveLog({
            session_id: sessionId,
            duration_minutes: durationMinutes,
            mood_score: moodScore,
            completed_at,
            challenge_id: challengeId,
            challenge_day: challengeDay,
            life_mode: lifeMode
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
                    completed_at,
                    challenge_id: challengeId,
                    challenge_day: challengeDay,
                    life_mode: lifeMode
                });

            if (error) {
                console.log('AnalyticsService: Offline record detected, kept in local queue.');
            } else {
                // [FIX C-2] Log subido a Supabase con éxito → limpiar SOLO este log de la cola local
                await LocalAnalyticsService.removeLog(completed_at);
            }
        } catch (error) {
            console.log('AnalyticsService: Silenced recordSession error (stored local):', error);
        }
    },

    /**
     * Sincroniza todos los logs locales pendientes con Supabase.
     * Útil tras recuperar la conexión a internet.
     */
    async syncPendingLogs(userId: string): Promise<void> {
        if (!userId) return;
        
        try {
            const localLogs = await LocalAnalyticsService.getLogs();
            if (localLogs.length === 0) return;

            console.log(`[Analytics] Intentando sincronizar ${localLogs.length} logs pendientes...`);

            for (const log of localLogs) {
                try {
                    const { error } = await supabase
                        .from('meditation_logs')
                        .insert({
                            user_id: userId,
                            session_id: log.session_id,
                            duration_minutes: log.duration_minutes,
                            mood_score: log.mood_score,
                            completed_at: log.completed_at,
                            challenge_id: log.challenge_id,
                            challenge_day: log.challenge_day,
                            life_mode: log.life_mode
                        });

                    if (!error) {
                        await LocalAnalyticsService.removeLog(log.completed_at);
                        console.log(`[Analytics] Log sincronizado: ${log.completed_at}`);
                    }
                } catch (err) {
                    // Falló este log individual, se queda en la cola
                }
            }
        } catch (error) {
            console.log('[Analytics] Error en sincronización de fondo:', error);
        }
    },

    /**
     * Update user streak in Supabase profile
     */
    async updateProfileStreak(userId: string, newStreak: number): Promise<void> {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    streak: newStreak,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            // Silenced network error in streak update
        }
    },

    /**
     * Get challenge history for a user (C-2)
     */
    async getChallengeHistory(userId: string) {
        try {
            const { data, error } = await supabase
                .from('challenge_history')
                .select('*')
                .eq('user_id', userId)
                .order('ended_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('AnalyticsService: Error fetching challenge history:', error);
            return [];
        }
    },

    /**
     * Record a completed or abandoned challenge (C-2)
     */
    async recordChallengeCompletion(
        userId: string,
        challengeId: string,
        challengeTitle: string,
        daysCompleted: number,
        totalDays: number,
        status: 'completed' | 'abandoned' = 'completed'
    ) {
        try {
            const { error } = await supabase
                .from('challenge_history')
                .insert({
                    user_id: userId,
                    challenge_id: challengeId,
                    challenge_title: challengeTitle,
                    days_completed: daysCompleted,
                    total_days: totalDays,
                    status,
                    ended_at: new Date().toISOString()
                });

            if (error) throw error;
        } catch (error) {
            console.error('AnalyticsService: Error recording challenge completion:', error);
        }
    }
};
