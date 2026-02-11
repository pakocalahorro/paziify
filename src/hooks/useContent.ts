/**
 * useContent.ts
 * React Query hooks for fetching content with caching and offline support.
 */

import { useQuery } from '@tanstack/react-query';
import { sessionsService, audiobooksService, storiesService, soundscapesService } from '../services/contentService';
import { AcademyService } from '../services/AcademyService';

// Keys for Query Cache
export const QUERY_KEYS = {
    SESSIONS: 'sessions',
    AUDIOBOOKS: 'audiobooks',
    STORIES: 'stories',
    SESSION_DETAIL: 'session_detail',
    ACADEMY_MODULES: 'academy_modules',
    SOUNDSCAPES: 'soundscapes',
};

// 1. Hook for All Sessions
export const useSessions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SESSIONS],
        queryFn: sessionsService.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// 2. Hook for Audiobooks
export const useAudiobooks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.AUDIOBOOKS],
        queryFn: audiobooksService.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// 3. Hook for Stories
export const useStories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STORIES],
        queryFn: storiesService.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// 4. Hook for Single Session (Detail)
export const useSessionDetail = (sessionId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SESSION_DETAIL, sessionId],
        queryFn: async () => {
            const data = await sessionsService.getById(sessionId);
            return data;
        },
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 10, // 10 mins
    });
};

// 5. Hook for Academy Modules
export const useAcademyModules = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ACADEMY_MODULES],
        queryFn: AcademyService.getModules,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// 6. Hook for Soundscapes
export const useSoundscapes = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SOUNDSCAPES],
        queryFn: soundscapesService.getAll,
        staleTime: 1000 * 60 * 30, // 30 mins
    });
};
