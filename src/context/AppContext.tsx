import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, UserState, Session } from '../types';

interface AppContextType {
    currentScreen: Screen;
    navigate: (screen: Screen) => void;
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    isNightMode: boolean;
    setNightMode: (isNight: boolean) => void;
    selectedSession: Session | null;
    setSelectedSession: (session: Session | null) => void;
}

const defaultUserState: UserState = {
    name: 'Usuario',
    isRegistered: false,
    hasMissedDay: false,
    isDailySessionDone: false,
    streak: 0,
    resilienceScore: 50,
    isPlusMember: false,
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
    const [isNightMode, setIsNightMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load user state from AsyncStorage on app start
    useEffect(() => {
        const loadUserState = async () => {
            try {
                const savedState = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    setUserState({ ...defaultUserState, ...parsedState });
                }
            } catch (error) {
                console.error('Error loading user state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserState();
    }, []);

    // Save user state to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
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

    const navigate = (screen: Screen) => {
        setCurrentScreen(screen);
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
