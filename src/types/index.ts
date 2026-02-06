export enum Screen {
    REGISTER = 'REGISTER',
    WELCOME = 'WELCOME',
    LOGIN = 'LOGIN',
    NOTIFICATION_SETTINGS = 'NOTIFICATION_SETTINGS',
    HOME = 'HOME',
    LIBRARY = 'LIBRARY',
    MEDITATION_CATALOG = 'MEDITATION_CATALOG',
    AUDIOBOOKS = 'AUDIOBOOKS',
    AUDIOBOOK_PLAYER = 'AUDIOBOOK_PLAYER',
    STORIES = 'STORIES',
    STORY_DETAIL = 'STORY_DETAIL',
    TRANSITION_TUNNEL = 'TRANSITION_TUNNEL',
    BREATHING_TIMER = 'BREATHING_TIMER',
    SESSION_END = 'SESSION_END',
    PROFILE = 'PROFILE',
    WEEKLY_REPORT = 'WEEKLY_REPORT',
    CBT_ACADEMY = 'CBT_ACADEMY',
    CBT_DETAIL = 'CBT_DETAIL',
    COMMUNITY = 'COMMUNITY',
    PAYWALL = 'PAYWALL',
    COMPASS = 'COMPASS',
    MANIFESTO = 'MANIFESTO',
}

export interface UserState {
    id?: string;
    name: string;
    avatarUrl?: string;
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
    favoriteSessionIds?: string[];
    completedSessionIds?: string[];
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
    thumbnailUrl?: string;
    audioUrl?: string;
    description?: string;
    creatorName?: string;
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

export interface Audiobook {
    id: string;
    title: string;
    author: string;
    narrator: string;
    description?: string;
    category: string;
    tags: string[];
    audio_url: string;
    image_url?: string;
    duration_minutes: number;
    source: string;
    language: string;
    is_premium: boolean;
    is_featured: boolean;
}

export interface RealStory {
    id: string;
    title: string;
    subtitle?: string;
    story_text: string;
    character_name?: string;
    character_age?: number;
    character_role?: string;
    category: string;
    subcategory?: string;
    tags: string[];
    reading_time_minutes: number;
    transformation_theme?: string;
    related_meditation_id?: string;
    is_featured: boolean;
    is_premium: boolean;
    source_platform?: string;
    source_attribution?: string;
}

export interface MeditationSessionContent {
    id: string; // UUID from Supabase
    legacy_id: string; // "anx_478"
    title: string;
    description: string;
    duration_minutes: number;
    category: string;
    mood_tags: string[];
    time_of_day: string;
    difficulty_level: string;
    is_premium: boolean;
    is_technical: boolean;
    voice_url: string;
    thumbnail_url: string;

    // JSONB columns typed
    audio_config: {
        voiceTrack?: string;
        defaultSoundscape?: string;
        defaultBinaural?: string;
        postSilence?: number;
    };
    breathing_config: {
        inhale: number;
        hold: number;
        exhale: number;
        holdPost: number;
    };
    metadata: {
        voice_style?: string;
        color?: string;
        visual_sync_enabled?: boolean;
        creator_credentials?: string;
        scientific_benefits?: string;
        session_type?: string;
        is_customizable?: boolean;
        practice_instruction?: string;
    };

    creator_name: string;
}

export type MeditationSession = MeditationSessionContent;

export type RootStackParamList = {
    [Screen.REGISTER]: undefined;
    [Screen.WELCOME]: undefined;
    [Screen.LOGIN]: undefined;
    [Screen.NOTIFICATION_SETTINGS]: undefined;
    [Screen.HOME]: { mode?: 'healing' | 'growth' };
    [Screen.LIBRARY]: undefined;
    [Screen.MEDITATION_CATALOG]: undefined;
    [Screen.AUDIOBOOKS]: undefined;
    [Screen.AUDIOBOOK_PLAYER]: { audiobookId: string };
    [Screen.STORIES]: undefined;
    [Screen.STORY_DETAIL]: { storyId: string };
    [Screen.TRANSITION_TUNNEL]: { sessionId?: string };
    [Screen.BREATHING_TIMER]: { sessionId: string };
    [Screen.SESSION_END]: undefined;
    [Screen.PROFILE]: undefined;
    [Screen.WEEKLY_REPORT]: undefined;
    [Screen.CBT_ACADEMY]: undefined;
    [Screen.CBT_DETAIL]: { lessonId: string };
    [Screen.COMMUNITY]: undefined;
    [Screen.PAYWALL]: undefined;
    [Screen.COMPASS]: undefined;
    [Screen.MANIFESTO]: { mode: 'healing' | 'growth' };
    MainTabs: { mode?: 'healing' | 'growth' } | undefined;
};

