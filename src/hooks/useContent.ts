/**
 * useContent.ts
 * React Query hooks for fetching content with caching and offline support.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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

const STATIC_STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours
const DYNAMIC_STALE_TIME = 1000 * 60 * 15;    // 15 minutes

// 1. Hook for All Sessions (Legacy/Small lists)
export const useSessions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SESSIONS],
        queryFn: sessionsService.getAll,
        staleTime: DYNAMIC_STALE_TIME,
    });
};

// 1.1 Hook for Paginated Sessions (Infinity Scroll)
export const useInfiniteSessions = (filters: any = {}) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.SESSIONS, 'infinite', filters],
        queryFn: ({ pageParam = 0 }: any) => sessionsService.getPaginated({ page: pageParam, ...filters }),
        initialPageParam: 0,
        getNextPageParam: (lastPage: any, allPages: any) => {
            return lastPage.hasMore ? allPages.length : undefined;
        },
        staleTime: DYNAMIC_STALE_TIME,
    });
};

// 2. Hook for Audiobooks
export const useAudiobooks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.AUDIOBOOKS],
        queryFn: audiobooksService.getAll,
        staleTime: STATIC_STALE_TIME,
    });
};

// 3. Hook for Stories
export const useStories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STORIES],
        queryFn: storiesService.getAll,
        staleTime: STATIC_STALE_TIME,
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
        staleTime: DYNAMIC_STALE_TIME,
    });
};

// 5. Hook for Academy Modules
export const useAcademyModules = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ACADEMY_MODULES],
        queryFn: AcademyService.getModules,
        staleTime: STATIC_STALE_TIME,
    });
};

// 6. Hook for Soundscapes
export const useSoundscapes = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SOUNDSCAPES],
        queryFn: soundscapesService.getAll,
        staleTime: STATIC_STALE_TIME,
    });
};
