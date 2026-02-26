import { supabase } from './supabaseClient';
import { Audiobook, RealStory } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEDITATION_SESSIONS } from '../data/sessionsData';

const ICON_MAPPING: Record<string, string> = {
    'mountain': 'mount-outline',
    'frown-outline': 'sad-outline',
};

const mapIcon = (icon: string) => ICON_MAPPING[icon] || icon;

/**
 * Audiobooks Service
 * Functions to interact with audiobooks table
 */

import { MeditationSessionContent } from '../types';
import { MeditationSession } from '../data/sessionsData'; // Keep this for UI compatibility

// Adapter to convert DB V2 Content to Legacy UI Format
export const adaptSession = (dbSession: any): MeditationSession => {
    // [IDEMPOTENCY FIX] If it's already in UI format, return it as is
    if (dbSession && (dbSession.durationMinutes !== undefined || dbSession.breathingPattern)) {
        console.log('[adaptSession] Session already adapted, skipping.');
        return dbSession as MeditationSession;
    }

    return {
        id: dbSession.id,
        title: dbSession.title,
        description: dbSession.description,
        durationMinutes: dbSession.duration_minutes,
        category: (dbSession.category || 'calmasos') as any,
        moodTags: dbSession.mood_tags,
        // imageUrl: Removed as per interface
        thumbnailUrl: dbSession.thumbnail_url,
        // voiceUrl: Removed as per interface
        voiceStyle: dbSession.metadata?.voice_style as any || 'calm',
        difficultyLevel: dbSession.difficulty_level as any || 'beginner',
        isPremium: dbSession.is_premium,
        isTechnical: dbSession.is_technical,
        audioAdjustmentFactor: 1.0, // Default
        visualSync: dbSession.metadata?.visual_sync_enabled || false,
        scientificBenefits: dbSession.metadata?.scientific_benefits || '',
        timeOfDay: dbSession.time_of_day as any || 'cualquiera',
        sessionType: dbSession.metadata?.session_type as any || 'guided_pure',
        isCustomizable: dbSession.metadata?.is_customizable ?? false,
        creatorCredentials: dbSession.metadata?.creator_credentials || 'Paziify Expert',
        color: dbSession.metadata?.color || '#FF6B6B',
        practiceInstruction: dbSession.metadata?.practice_instruction || 'Sigue la voz y relájate.',
        creatorName: dbSession.creator_name,
        audioLayers: {
            // Prioritize dedicated voice_url column (updated by Admin Panel) 
            // over the structured JSON config for direct compatibility
            voiceTrack: dbSession.voice_url || dbSession.audio_config?.voiceTrack,
            defaultSoundscape: dbSession.audio_config?.defaultSoundscape || undefined,
            defaultBinaural: dbSession.audio_config?.defaultBinaural || undefined,
            defaultElements: undefined, // DB doesn't have this yet
            postSilence: dbSession.audio_config?.postSilence || 0
        },

        breathingPattern: {
            inhale: dbSession.breathing_config?.inhale || 4,
            hold: dbSession.breathing_config?.hold || 0,
            exhale: dbSession.breathing_config?.exhale || 4,
            holdPost: dbSession.breathing_config?.holdPost || 0
        }
    };
};

export const sessionsService = {
    /**
     * Get all sessions
     */
    async getAll(): Promise<MeditationSessionContent[]> {
        try {
            console.log('[sessionsService] Fetching all sessions from Supabase...');
            const { data, error } = await supabase
                .from('meditation_sessions_content')
                .select('*')
                .order('title', { ascending: true });

            if (error) {
                console.log('[sessionsService] Supabase error (silenced):', error);
                throw error;
            }

            if (data && data.length > 0) {
                console.log(`[sessionsService] Successfully fetched ${data.length} sessions.`);
                return data;
            }

            console.log('[sessionsService] No data from Supabase, returning empty...');
            return [];
        } catch (error) {
            console.log('[sessionsService] Exception: Entrando en modo RESILIENCIA (usando fallback local)');
            // Return local sessions directly as fallback - although they need to be MeditationSessionContent format
            // but for simplicity in this V2 architecture, we use them as the base.
            return MEDITATION_SESSIONS as any[];
        }
    },

    /**
     * Get session by ID (UUID)
     */
    async getById(id: string): Promise<MeditationSessionContent | null> {
        try {
            const { data, error } = await supabase
                .from('meditation_sessions_content')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.log('Error fetching session (offline?), checking local fallback:', error);
            const local = MEDITATION_SESSIONS.find((s: any) => s.id === id || s.legacy_id === id);
            return local ? (local as any) : null;
        }
    },

    /**
     * Get session by Legacy ID (for compatibility during migration)
     */
    async getByLegacyId(legacyId: string): Promise<MeditationSessionContent | null> {
        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .select('*')
            .eq('legacy_id', legacyId)
            .single();

        if (error) {
            console.log('Error fetching session by legacy ID (offline?):', error);
            return null;
        }
        return data;
    },

    /**
     * Get sessions by Category
     */
    async getByCategory(category: string): Promise<MeditationSessionContent[]> {
        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .select('*')
            .eq('category', category);

        if (error) {
            console.log('Error fetching sessions by category:', error);
            return [];
        }
        return data || [];
    },

    /**
     * Get Daily Session (random or specific algorithm)
     */
    async getDaily(): Promise<MeditationSessionContent | null> {
        // Simple random strategy for now, or pick first
        // In V2 we might want a 'daily_sessions' table or logic.
        // For now, let's pick "Respiración 4-7-8" as default or random.
        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .select('*')
            .eq('title', 'Respiración 4-7-8')
            .limit(1)
            .maybeSingle();

        return data;
    }
};

// Adapter for Soundscapes
export const adaptSoundscape = (dbSoundscape: any): any => {
    return {
        ...dbSoundscape,
        id: dbSoundscape.slug || dbSoundscape.id, // Use slug for navigation consistency if available
        image: dbSoundscape.image_url,
        icon: mapIcon(dbSoundscape.icon),
        audioFile: { uri: dbSoundscape.audio_url },
        recommendedFor: dbSoundscape.recommended_for || [],
        isPremium: dbSoundscape.is_premium || false,
    };
};

export const soundscapesService = {
    /**
     * Obtener todos los paisajes sonoros con fallback local
     */
    async getAll(): Promise<any[]> {
        try {
            console.log('Fetching all soundscapes from Supabase...');
            const { data, error } = await supabase
                .from('soundscapes')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.log('Supabase error fetching soundscapes (silenced):', error);
                throw error;
            }

            if (data && data.length > 0) {
                console.log(`Successfully fetched ${data.length} soundscapes from DB.`);
                return data.map(adaptSoundscape);
            }

            console.log('No soundscapes found in DB, using local fallback.');
            // Fallback si la tabla está vacía
            const { SOUNDSCAPES } = require('../data/soundscapesData');
            return SOUNDSCAPES;
        } catch (error) {
            console.log('Error fetching soundscapes (usando local):', error);
            const { SOUNDSCAPES } = require('../data/soundscapesData');
            return SOUNDSCAPES;
        }
    },

    /**
     * Obtener por ID con prioridad local para Zero Egress
     */
    async getById(id: string): Promise<any | null> {
        try {
            // Priority 1: Check local data first (instant, no network needed)
            console.log(`Checking local soundscape for ID/Slug: ${id}...`);
            const { SOUNDSCAPES } = require('../data/soundscapesData');
            const local = SOUNDSCAPES.find((s: any) => s.id === id || s.slug === id);

            if (local) {
                console.log(`Found local soundscape: ${local.name}`);
                return local;
            }

            // Priority 2: Fetch from DB if not found locally (online mode)
            console.log(`Local not found, fetching from DB/Slug: ${id}...`);
            const { data, error } = await supabase
                .from('soundscapes')
                .select('*')
                .or(`id.eq.${id},slug.eq.${id}`)
                .maybeSingle();

            if (error) {
                console.log('Supabase error fetching soundscape by ID (silenced):', error);
                return null;
            }

            if (data) {
                console.log(`Found soundscape in DB: ${data.name}`);
                return adaptSoundscape(data);
            }

            return null;
        } catch (err) {
            console.error('Error in getById:', err);
            return null;
        }
    }
};

export const audiobooksService = {

    async getAll(): Promise<Audiobook[]> {
        try {
            const { data, error } = await supabase
                .from('audiobooks')
                .select('*')
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.log('Exception in audiobooksService.getAll, using local fallback:', error);
            const { LOCAL_AUDIOBOOKS } = require('../data/audiobooksData');
            return LOCAL_AUDIOBOOKS;
        }
    },

    /**
     * Get audiobooks by category
     */
    async getByCategory(category: string): Promise<Audiobook[]> {
        try {
            const { data, error } = await supabase
                .from('audiobooks')
                .select('*')
                .eq('category', category)
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Error fetching audiobooks by category (silenced):', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.log('Exception in audiobooksService.getByCategory (silenced):', error);
            return [];
        }
    },

    /**
     * Get featured audiobooks
     */
    async getFeatured(): Promise<Audiobook[]> {
        try {
            const { data, error } = await supabase
                .from('audiobooks')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Error fetching featured audiobooks (silenced):', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.log('Exception in audiobooksService.getFeatured (silenced):', error);
            return [];
        }
    },

    /**
     * Get audiobook by ID
     */
    async getById(id: string): Promise<Audiobook | null> {
        try {
            const { data, error } = await supabase
                .from('audiobooks')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.log('Error fetching audiobook by ID, checking local fallback:', error);
            const { LOCAL_AUDIOBOOKS } = require('../data/audiobooksData');
            return LOCAL_AUDIOBOOKS.find((a: Audiobook) => a.id === id) || null;
        }
    },

    /**
     * Search audiobooks
     */
    async search(query: string): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
            .order('is_featured', { ascending: false });

        if (error) {
            console.log('Error searching audiobooks (silenced):', error);
            return [];
        }

        return data || [];
    },
};

/**
 * Stories Service
 * Functions to interact with real_stories table
 */

export const storiesService = {
    /**
     * Get all stories
     */
    async getAll(): Promise<RealStory[]> {
        try {
            const { data, error } = await supabase
                .from('real_stories')
                .select('*')
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.log('Error fetching stories, using local fallback:', error);
            const { MENTES_MAESTRAS_STORIES } = require('../data/realStories');
            return MENTES_MAESTRAS_STORIES;
        }
    },

    /**
     * Get stories by category
     */
    async getByCategory(category: string): Promise<RealStory[]> {
        try {
            const { data, error } = await supabase
                .from('real_stories')
                .select('*')
                .eq('category', category)
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Error fetching stories by category (silenced):', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.log('Exception in storiesService.getByCategory (silenced):', error);
            return [];
        }
    },

    /**
     * Get featured stories
     */
    async getFeatured(): Promise<RealStory[]> {
        try {
            const { data, error } = await supabase
                .from('real_stories')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Error fetching featured stories (silenced):', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.log('Exception in storiesService.getFeatured (silenced):', error);
            return [];
        }
    },

    /**
     * Get story by ID
     */
    async getById(id: string): Promise<RealStory | null> {
        try {
            const { data, error } = await supabase
                .from('real_stories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.log('Error fetching story by ID, checking local fallback:', error);
            const { MENTES_MAESTRAS_STORIES } = require('../data/realStories');
            return MENTES_MAESTRAS_STORIES.find((s: any) => s.id === id) || null;
        }
    },

    /**
     * Search stories
     */
    async search(query: string): Promise<RealStory[]> {
        const { data, error } = await supabase
            .from('real_stories')
            .select('*')
            .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,story_text.ilike.%${query}%,transformation_theme.ilike.%${query}%`)
            .order('is_featured', { ascending: false });

        if (error) {
            console.log('Error searching stories (silenced):', error);
            return [];
        }

        return data || [];
    },

    /**
     * Populate stories with Mentes Maestras data
     */
    async populateStories(): Promise<void> {
        // Clean existing
        // Note: DELETE without where is risky in Supabase client usually, but for dev it works if RLS allows
        await supabase.from('real_stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Insert new
        const { error } = await supabase
            .from('real_stories')
            .insert(require('../data/realStories').MENTES_MAESTRAS_STORIES);

        if (error) {
            console.log('Error populating stories (silenced):', error);
        }
    }
};

/**
 * Favorites Service
 * Functions to manage user favorites
 */

export const favoritesService = {
    /**
     * Add to favorites
     */
    async add(userId: string, contentType: 'audiobook' | 'story', contentId: string): Promise<void> {
        const { error } = await supabase
            .from('user_favorites')
            .insert({
                user_id: userId,
                content_type: contentType,
                content_id: contentId,
            });

        if (error) {
            console.log('Error adding to favorites (silenced):', error);
        }
    },

    /**
     * Remove from favorites
     */
    async remove(userId: string, contentType: 'audiobook' | 'story', contentId: string): Promise<void> {
        const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', userId)
            .eq('content_type', contentType)
            .eq('content_id', contentId);

        if (error) {
            console.log('Error removing from favorites (silenced):', error);
        }
    },

    /**
     * Check if item is favorited
     */
    async isFavorited(userId: string, contentType: 'audiobook' | 'story', contentId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('content_type', contentType)
            .eq('content_id', contentId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.log('Error checking favorite (silenced):', error);
            return false;
        }

        return !!data;
    },

    /**
     * Get user's favorite audiobooks with offline cache
     */
    async getFavoriteAudiobooks(userId: string): Promise<Audiobook[]> {
        const CACHE_KEY = `@fav_audiobooks_${userId}`;
        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_type', 'audiobook');

            if (error) throw error;

            const ids = data.map(f => f.content_id);
            if (ids.length === 0) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify([]));
                return [];
            }

            const { data: audiobooks, error: audiobooksError } = await supabase
                .from('audiobooks')
                .select('*')
                .in('id', ids);

            if (audiobooksError) throw audiobooksError;

            if (audiobooks) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(audiobooks));
                return audiobooks;
            }
            return [];
        } catch (error) {
            console.log('[favoritesService] Offline mode: Reading favorite audiobooks from cache');
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    },

    /**
     * Get user's favorite stories with offline cache
     */
    async getFavoriteStories(userId: string): Promise<RealStory[]> {
        const CACHE_KEY = `@fav_stories_${userId}`;
        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_type', 'story');

            if (error) throw error;

            const ids = data.map(f => f.content_id);
            if (ids.length === 0) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify([]));
                return [];
            }

            const { data: stories, error: storiesError } = await supabase
                .from('real_stories')
                .select('*')
                .in('id', ids);

            if (storiesError) throw storiesError;

            if (stories) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(stories));
                return stories;
            }
            return [];
        } catch (error) {
            console.log('[favoritesService] Offline mode: Reading favorite stories from cache');
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    },
};

export const contentService = {
    /**
     * Get the exact background image requested by the CEO based on user intention (Sanar vs Crecer)
     */
    async getRandomCategoryImage(mode: 'healing' | 'growth'): Promise<string> {
        if (mode === 'healing') {
            return 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_forest.webp';
        } else {
            return 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/meditation_temple.webp';
        }
    }
};
