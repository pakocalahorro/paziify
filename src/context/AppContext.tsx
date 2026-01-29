import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, UserState, Session } from '../types';
import { supabase } from '../services/supabaseClient';
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
    settings: {
        notificationMorning: true,
        notificationNight: true,
        notificationStreak: true,
        notificationQuietMode: true,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
    }
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

    // Initial session and auth listener
    useEffect(() => {
        const loadStoredState = async () => {
            try {
                const storedState = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    setUserState(prev => ({ ...prev, ...parsedState }));
                }
            } catch (error) {
                console.error('Failed to load user state from storage:', error);
            }
        };

        loadStoredState();
    }, []);

    // Check Supabase session
    useEffect(() => {
        // Check current session
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLoading(false);
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) {
                // Clear state on sign out
                setUserState(defaultUserState);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load profile from Supabase when user changes
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
                    setUserState(prev => ({
                        ...prev,
                        name: data.full_name || prev.name,
                        avatarUrl: data.avatar_url,
                        streak: data.streak || 0,
                        resilienceScore: data.resilience_score || 50,
                        isPlusMember: data.is_plus_member || false,
                        isRegistered: true,
                    }));
                }
            }
        };

        loadProfile();
    }, [user]);

    // Save user state to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading && !userState.isGuest) {
            const saveUserState = async () => {
                try {
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
                } catch (error) {
                    console.error('Error saving user state:', error);
                }
            };

            saveUserState();
        }
    }, [userState, isLoading]);

    // Determine night mode based on real time
    useEffect(() => {
        const hour = new Date().getHours();
        setIsNightMode(hour >= 21 || hour < 6);
    }, []);

    const signOut = async () => {
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
