/**
 * useContent.ts
 * React Query hooks for fetching content with caching and offline support.
 */

import { useQuery } from '@tanstack/react-query';
import { sessionsService, audiobooksService, storiesService } from '../services/contentService';
import { MeditationSession, Audiobook, RealStory } from '../types';

// Keys for Query Cache
export const QUERY_KEYS = {
    SESSIONS: 'sessions',
    AUDIOBOOKS: 'audiobooks',
    STORIES: 'stories',
    SESSION_DETAIL: 'session_detail',
};

// 1. Hook for All Sessions
export const useSessions = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.SESSIONS],
        queryFn: sessionsService.getAll,
        staleTime: 1000 * 60 * 60, // 1 hour (Catalog rarely changes)
    });
};

// 2. Hook for Audiobooks
export const useAudiobooks = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.AUDIOBOOKS],
        queryFn: audiobooksService.getAll,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

// 3. Hook for Stories
export const useStories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STORIES],
        queryFn: storiesService.getAll,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

// 4. Hook for Single Session (Detail)
export const useSessionDetail = (sessionId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SESSION_DETAIL, sessionId],
        queryFn: async () => {
            const data = await sessionsService.getById(sessionId);
            // We might need to adapt it here if getById returns raw DB format
            // But checking contentService, getById returns MeditationSessionContent
            // We usually convert it to UI Session in the component, OR we can do it here.
            // For now, return raw data same as service.
            return data;
        },
        enabled: !!sessionId, // Only run if ID exists
        staleTime: 1000 * 60 * 10, // 10 mins
    });
};
