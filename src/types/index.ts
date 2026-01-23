export enum Screen {
    REGISTER = 'REGISTER',
    WELCOME = 'WELCOME',
    LOGIN = 'LOGIN',
    NOTIFICATION_SETTINGS = 'NOTIFICATION_SETTINGS',
    HOME = 'HOME',
    LIBRARY = 'LIBRARY',
    TRANSITION_TUNNEL = 'TRANSITION_TUNNEL',
    BREATHING_TIMER = 'BREATHING_TIMER',
    SESSION_END = 'SESSION_END',
    PROFILE = 'PROFILE',
    WEEKLY_REPORT = 'WEEKLY_REPORT',
    CBT_ACADEMY = 'CBT_ACADEMY',
    CBT_DETAIL = 'CBT_DETAIL',
    COMMUNITY = 'COMMUNITY',
    PAYWALL = 'PAYWALL',
}

export interface UserState {
    id?: string;
    name: string;
    email?: string;
    isRegistered: boolean;
    isGuest: boolean;
    hasMissedDay: boolean;
    isDailySessionDone: boolean;
    streak: number;
    resilienceScore: number;
    isPlusMember: boolean;
    totalMinutes?: number;
    lastSessionDate?: string;
    completedLessons?: string[];
    settings: {
        notificationMorning: boolean;
        notificationNight: boolean;
        notificationStreak: boolean;
        notificationQuietMode: boolean;
        quietHoursStart: string; // "22:00"
        quietHoursEnd: string;   // "07:00"
    };
}

export interface Session {
    id: string;
    title: string;
    duration: number; // minutes
    category: string;
    isPlus: boolean;
    image?: string;
    audioUrl?: string;
    description?: string;
}

export interface UserSession {
    id: string;
    userId: string;
    sessionId: string;
    startedAt: string;
    completedAt?: string;
    durationCompleted?: number;
    moodBefore?: number;
    moodAfter?: number;
}

export type RootStackParamList = {
    [Screen.REGISTER]: undefined;
    [Screen.WELCOME]: undefined;
    [Screen.LOGIN]: undefined;
    [Screen.NOTIFICATION_SETTINGS]: undefined;
    [Screen.HOME]: undefined;
    [Screen.LIBRARY]: undefined;
    [Screen.TRANSITION_TUNNEL]: undefined;
    [Screen.BREATHING_TIMER]: undefined;
    [Screen.SESSION_END]: undefined;
    [Screen.PROFILE]: undefined;
    [Screen.WEEKLY_REPORT]: undefined;
    [Screen.CBT_ACADEMY]: undefined;
    [Screen.CBT_DETAIL]: { lessonId: string };
    [Screen.COMMUNITY]: undefined;
    [Screen.PAYWALL]: undefined;
    MainTabs: undefined;
};
