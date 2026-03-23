import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, UserState, Session } from '../types';
import { supabase } from '../services/supabaseClient';
import { NotificationService } from '../services/NotificationService';
import { User } from '@supabase/supabase-js';

interface AppContextType {
    currentScreen: Screen;
    navigate: (screen: Screen) => void;
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    isNightMode: boolean;
    setNightMode: (isNight: boolean) => void;
    selectedSession: Session | null;
    setSelectedSession: (session: Session | null) => void;
    user: User | null;
    isLoading: boolean;
    isGuest: boolean;
    continueAsGuest: () => void;
    exitGuestMode: () => void;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    toggleFavorite: (sessionId: string) => void;
    isFirstEntryOfDay: boolean;
    markEntryAsDone: () => void;
}

const defaultUserState: UserState = {
    name: 'Usuario',
    isRegistered: false,
    hasMissedDay: false,
    isDailySessionDone: false,
    streak: 0,
    resilienceScore: 50,
    isPlusMember: false,
    isGuest: false,
    favoriteSessionIds: [],
    completedSessionIds: [],
    settings: {
        notificationMorning: true,
        notificationNight: true,
        notificationStreak: true,
        notificationQuietMode: true,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
    },
    hasAcceptedMonthlyChallenge: false,
    hasSeenWelcomeTour: false,
    activeChallenge: null,
};

const STORAGE_KEY = '@paziify_user_state';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.REGISTER);
    const [userState, setUserState] = useState<UserState>(defaultUserState);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isNightMode, setIsNightMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [isFirstEntryOfDay, setIsFirstEntryOfDay] = useState(false);
    const prevConnectedRef = useRef<boolean | null>(null);

    // Track first entry of the day
    useEffect(() => {
        const checkFirstEntry = () => {
            const today = new Date().toISOString().split('T')[0];
            if (userState.lastEntryDate !== today) {
                setIsFirstEntryOfDay(true);
            } else {
                setIsFirstEntryOfDay(false);
            }
        };
        if (!isLoading) {
            checkFirstEntry();
        }
    }, [userState.lastEntryDate, isLoading]);

    const markEntryAsDone = () => {
        const today = new Date().toISOString().split('T')[0];
        updateUserState({ lastEntryDate: today });
    };

    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    // Initial session and auth listener
    useEffect(() => {
        const loadStoredState = async () => {
            try {
                const storedState = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    setUserState(prev => ({ ...prev, ...parsedState }));
                }
            } catch (innerErr) {
                // Silenced: This is expected when offline
            }
        };

        loadStoredState();
        NotificationService.initialize();

        // Listen for connectivity
        import('@react-native-community/netinfo').then(NetInfo => {
            const unsubscribe = NetInfo.default.addEventListener(state => {
                const wasOffline = prevConnectedRef.current === false;
                prevConnectedRef.current = state.isConnected ?? null;
                setIsConnected(state.isConnected);

                // Si recuperamos conexión y el usuario está logado, sincronizar de fondo
                if (wasOffline && state.isConnected && user?.id) {
                    import('../services/analyticsService').then(({ analyticsService }) => {
                        analyticsService.syncPendingLogs(user.id);
                    });
                    import('../services/CardioService').then(({ CardioService }) => {
                        CardioService.syncPendingScans(user.id);
                    });
                }
            });
            return () => unsubscribe();
        });
    }, []);

    // Check Supabase session
    useEffect(() => {
        // Check current session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (e) {
                console.log('[AppContext] Auth init error (offline?):', e);
            } finally {
                setIsLoading(false);
            }
        };

        if (isConnected !== false) {
            initAuth();
        } else {
            setIsLoading(false);
        }

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsProfileLoaded(false); // Bloquear guardado en cualquier cambio de usuario hasta que se recargue el perfil
            if (!session) {
                // Clear state on sign out
                setUserState(defaultUserState);
            }
        });

        return () => subscription.unsubscribe();
    }, [isConnected]);

    // Load profile from Supabase when user changes
    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (!error && data) {
                    setUserState(prev => {
                        // Hardening: Si los datos locales son mayores, no sobrescribirlos con datos remotos obsoletos
                        // (esto protege mientras la sincronización de fondo está pendiente)
                        const remoteStreak = data.streak || 0;
                        const remoteMinutes = data.total_minutes || 0;
                        const remoteResilience = data.resilience_score || 50;

                        // Hardening para activeChallenge: No dejar que el servidor retroceda el progreso del reto activo
                        let finalChallenge = data.active_challenge || prev.activeChallenge;
                        if (data.active_challenge && prev.activeChallenge && data.active_challenge.id === prev.activeChallenge.id) {
                            const remoteDays = data.active_challenge.daysCompleted || 0;
                            const localDays = prev.activeChallenge.daysCompleted || 0;
                            if (localDays > remoteDays) {
                                finalChallenge = prev.activeChallenge;
                            }
                        }

                        return {
                            ...prev,
                            name: data.full_name || prev.name,
                            avatarUrl: data.avatar_url,
                            role: data.role || prev.role,
                            streak: remoteStreak > (prev.streak || 0) ? remoteStreak : prev.streak,
                            totalMinutes: remoteMinutes > (prev.totalMinutes || 0) ? remoteMinutes : prev.totalMinutes,
                            resilienceScore: remoteResilience > (prev.resilienceScore || 0) ? remoteResilience : prev.resilienceScore,
                            isPlusMember: data.is_plus_member || false,
                            isRegistered: true,
                            hasAcceptedMonthlyChallenge: data.has_accepted_monthly_challenge || false,
                            hasSeenWelcomeTour: data.has_seen_welcome_tour || false,
                            dailyGoalMinutes: data.daily_goal_minutes || prev.dailyGoalMinutes || 20,
                            weeklyGoalMinutes: data.weekly_goal_minutes || prev.weeklyGoalMinutes || 150,
                            lifeMode: data.life_mode || prev.lifeMode,
                            lastSelectedBackgroundUri: data.last_selected_background_uri || prev.lastSelectedBackgroundUri,
                            lastEntryDate: data.last_entry_date || prev.lastEntryDate,
                            favoriteSessionIds: [...new Set([...(data.favorite_session_ids || []), ...(prev.favoriteSessionIds || [])])],
                            completedSessionIds: [...new Set([...(data.completed_session_ids || []), ...(prev.completedSessionIds || [])])],
                            activeChallenge: finalChallenge,
                            settings: data.notification_settings || prev.settings,
                        };
                    });

                    // Register for push notifications
                    NotificationService.registerForPushNotificationsAsync(user.id);
                    setIsProfileLoaded(true);
                } else if (error && error.code === 'PGRST116') {
                    // Profile does not exist yet (New User)
                    setIsProfileLoaded(true); 
                    console.log('[AppContext] New user detected, profile will be created on first save.');
                } else if (error) {
                    // Solo loguear errores reales, no de red esperados offline
                    if (error.message !== 'Network request failed' && error.code !== 'PGRST116') {
                        console.log('[AppContext] Error loading profile (expected if offline):', error.message);
                    }
                }
            }
        };

        loadProfile();
    }, [user]);

    // Save user state to AsyncStorage and Supabase whenever it changes
    useEffect(() => {
        // Bloquear guardado hasta que el perfil esté totalmente cargado de Supabase (o se determine que es nuevo/offline)
        // para evitar sobreescribir con estado vacío o parcial durante el arranque.
        if (!isLoading && !userState.isGuest && isProfileLoaded) {
            const saveUserState = async () => {
                try {
                    // Local save (always)
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    
                    // Supabase sync (ONLY if profile was loaded successfully to avoid race conditions)
                    if (user && isProfileLoaded) {
                        const { error } = await supabase
                            .from('profiles')
                            .update({
                                has_accepted_monthly_challenge: userState.hasAcceptedMonthlyChallenge,
                                daily_goal_minutes: userState.dailyGoalMinutes,
                                weekly_goal_minutes: userState.weeklyGoalMinutes,
                                life_mode: userState.lifeMode,
                                last_selected_background_uri: userState.lastSelectedBackgroundUri,
                                last_entry_date: userState.lastEntryDate,
                                favorite_session_ids: userState.favoriteSessionIds,
                                completed_session_ids: userState.completedSessionIds,
                                active_challenge: userState.activeChallenge,
                                notification_settings: userState.settings,
                                has_seen_welcome_tour: userState.hasSeenWelcomeTour,
                                total_minutes: userState.totalMinutes,
                                resilience_score: userState.resilienceScore,
                                streak: userState.streak
                            })
                            .eq('id', user.id);
                        
                        if (error) {
                            console.warn('[AppContext] Supabase sync error:', error.message);
                        } else {
                            console.log('[AppContext] Supabase sync success (Safe Sync)');
                        }
                    }
                } catch (error) {
                    console.error('Error saving user state:', error);
                }
            };

            saveUserState();
        }
    }, [
        userState.hasAcceptedMonthlyChallenge,
        userState.dailyGoalMinutes,
        userState.weeklyGoalMinutes,
        userState.lifeMode,
        userState.lastSelectedBackgroundUri,
        userState.lastEntryDate,
        userState.favoriteSessionIds,
        userState.completedSessionIds,
        userState.activeChallenge,
        userState.settings,
        userState.hasSeenWelcomeTour,
        userState.totalMinutes,
        userState.resilienceScore,
        userState.streak,
        isLoading,
        isProfileLoaded
    ]);

    // Handle Intelligent Notifications scheduling
    useEffect(() => {
        if (!isLoading) {
            const scheduleReminders = async () => {
                try {
                    await NotificationService.rescheduleAll(userState.name, userState.streak);
                } catch (error) {
                    console.error('Error scheduling intelligent notifications:', error);
                }
            };
            scheduleReminders();
        }
    }, [userState.activeChallenge?.id, userState.streak, userState.name, isLoading]);

    // Determine night mode based on real time
    useEffect(() => {
        const hour = new Date().getHours();
        setIsNightMode(hour >= 21 || hour < 6);
    }, []);

    const signOut = async () => {
        setIsProfileLoaded(false);
        await supabase.auth.signOut();
    };

    const continueAsGuest = () => {
        setUserState(prev => ({ ...prev, isGuest: true }));
    };

    const exitGuestMode = () => {
        setUserState(prev => ({ ...prev, isGuest: false }));
    };

    const navigate = (screen: Screen) => {
        setCurrentScreen(screen);
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);
        setIsProfileLoaded(false);
        try {
            const { signInWithGoogle: authSignIn } = await import('../services/AuthService');
            const result = await authSignIn();

            if (result.success) {
                // The onAuthStateChange listener will handle the user state update
                setUserState(prev => ({ ...prev, isGuest: false }));
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserState = (updates: Partial<UserState>) => {
        setUserState(prev => ({ ...prev, ...updates }));
    };

    const toggleFavorite = (sessionId: string) => {
        const currentFavorites = userState.favoriteSessionIds || [];
        const isFavorite = currentFavorites.includes(sessionId);

        const newFavorites = isFavorite
            ? currentFavorites.filter(id => id !== sessionId)
            : [...currentFavorites, sessionId];

        updateUserState({ favoriteSessionIds: newFavorites });
    };

    return (
        <AppContext.Provider
            value={{
                currentScreen,
                navigate,
                userState,
                updateUserState,
                isNightMode,
                setNightMode: setIsNightMode,
                selectedSession,
                setSelectedSession,
                user,
                isLoading,
                isGuest: userState.isGuest,
                continueAsGuest,
                exitGuestMode,
                signOut,
                signInWithGoogle,
                toggleFavorite,
                isFirstEntryOfDay,
                markEntryAsDone,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
