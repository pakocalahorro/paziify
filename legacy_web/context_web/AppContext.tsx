import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Screen, UserState, Session, Course } from '../types';

interface AppContextType {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  userState: UserState;
  updateUserState: (updates: Partial<UserState>) => void;
  isNightMode: boolean; // Computed based on time
  selectedSession: Session | null;
  setSelectedSession: (session: Session | null) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  showUpsell: boolean;
  setShowUpsell: (show: boolean) => void;
}

const defaultUserState: UserState = {
  name: 'Alex',
  isRegistered: false,
  hasMissedDay: false, // Toggle this to test Recovery state
  isDailySessionDone: false,
  streak: 4,
  resilienceScore: 84,
  isPlusMember: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.REGISTER);
  const [userState, setUserState] = useState<UserState>(defaultUserState);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    // Determine night mode based on real time
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
        selectedSession,
        setSelectedSession,
        selectedCourse,
        setSelectedCourse,
        showUpsell,
        setShowUpsell,
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