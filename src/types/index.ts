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
    BACKGROUND_SOUND = 'BACKGROUND_SOUND', // Catalog
    BACKGROUND_PLAYER = 'BACKGROUND_PLAYER', // Immersive Player
    STORIES = 'STORIES',
    STORY_DETAIL = 'STORY_DETAIL',
    TRANSITION_TUNNEL = 'TRANSITION_TUNNEL',
    BREATHING_TIMER = 'BREATHING_TIMER',
    SESSION_END = 'SESSION_END',
    PROFILE = 'PROFILE',
    WEEKLY_REPORT = 'WEEKLY_REPORT',
    CBT_ACADEMY = 'CBT_ACADEMY',
    ACADEMY_COURSE_DETAIL = 'ACADEMY_COURSE_DETAIL', // Added
    CBT_DETAIL = 'CBT_DETAIL',
    CBT_QUIZ = 'CBT_QUIZ', // Added
    COMMUNITY = 'COMMUNITY',
    PAYWALL = 'PAYWALL',
    SESSION_DETAIL = 'SESSION_DETAIL',
    COMPASS = 'COMPASS',
    SPIRITUAL_PRELOADER = 'SPIRITUAL_PRELOADER',
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
    lastEntryDate?: string; // New: To track daily ritual
    lifeMode?: 'growth' | 'healing'; // New: To persist selection
    lastSelectedBackgroundUri?: string; // New: To persist chosen image
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
    dailyGoalMinutes?: number;
    weeklyGoalMinutes?: number;
    hasAcceptedMonthlyChallenge?: boolean;
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
    thumbnail_url?: string;
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
    [Screen.AUDIOBOOK_PLAYER]: { audiobookId: string; audiobook?: Audiobook };
    [Screen.BACKGROUND_SOUND]: undefined;
    [Screen.BACKGROUND_PLAYER]: { soundscapeId: string; soundscape?: any };
    [Screen.STORIES]: undefined;
    [Screen.STORY_DETAIL]: { storyId: string; story?: any };
    [Screen.TRANSITION_TUNNEL]: { sessionId?: string; sessionData?: any };
    [Screen.BREATHING_TIMER]: { sessionId: string; sessionData?: any };
    [Screen.SESSION_END]: { sessionId: string; durationMinutes: number };
    [Screen.SESSION_DETAIL]: { sessionId: string; sessionData?: any };
    [Screen.PROFILE]: undefined;
    [Screen.WEEKLY_REPORT]: undefined;
    [Screen.CBT_ACADEMY]: undefined;
    [Screen.ACADEMY_COURSE_DETAIL]: { courseId: string; courseData?: any };
    [Screen.CBT_DETAIL]: { lessonId: string; lessonData?: any };
    [Screen.CBT_QUIZ]: { courseId: string }; // Added for Quiz
    [Screen.COMMUNITY]: undefined;
    [Screen.PAYWALL]: undefined;
    [Screen.COMPASS]: undefined;
    [Screen.COMPASS]: undefined;
    [Screen.SPIRITUAL_PRELOADER]: undefined;

    // Bio / Cardio
    [Screen.CARDIO_SCAN]: undefined;
    [Screen.CARDIO_RESULT]: { diagnosis: 'stress' | 'fatigue' | 'balanced' };
}

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
    BACKGROUND_SOUND = 'BACKGROUND_SOUND',
    BACKGROUND_PLAYER = 'BACKGROUND_PLAYER',
    STORIES = 'STORIES',
    STORY_DETAIL = 'STORY_DETAIL',
    TRANSITION_TUNNEL = 'TRANSITION_TUNNEL',
    BREATHING_TIMER = 'BREATHING_TIMER',
    SESSION_END = 'SESSION_END',
    PROFILE = 'PROFILE',
    WEEKLY_REPORT = 'WEEKLY_REPORT',
    CBT_ACADEMY = 'CBT_ACADEMY',
    ACADEMY_COURSE_DETAIL = 'ACADEMY_COURSE_DETAIL',
    CBT_DETAIL = 'CBT_DETAIL',
    CBT_QUIZ = 'CBT_QUIZ',
    COMMUNITY = 'COMMUNITY',
    PAYWALL = 'PAYWALL',
    SESSION_DETAIL = 'SESSION_DETAIL',
    COMPASS = 'COMPASS',
    SPIRITUAL_PRELOADER = 'SPIRITUAL_PRELOADER',
    CARDIO_SCAN = 'CARDIO_SCAN',
    CARDIO_RESULT = 'CARDIO_RESULT',
}

