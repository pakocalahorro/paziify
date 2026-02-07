import { supabase } from './supabaseClient';
import { Audiobook, RealStory } from '../types';

/**
 * Audiobooks Service
 * Functions to interact with audiobooks table
 */

import { MeditationSessionContent } from '../types';
import { MeditationSession } from '../data/sessionsData'; // Keep this for UI compatibility

// Adapter to convert DB V2 Content to Legacy UI Format
export const adaptSession = (dbSession: MeditationSessionContent): MeditationSession => {
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
            voiceTrack: dbSession.audio_config?.voiceTrack,
            defaultSoundscape: dbSession.audio_config?.defaultSoundscape || 'rain',
            defaultBinaural: dbSession.audio_config?.defaultBinaural || 'alpha',
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
        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .select('*')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
        return data || [];
    },

    /**
     * Get session by ID (UUID)
     */
    async getById(id: string): Promise<MeditationSessionContent | null> {
        const { data, error } = await supabase
            .from('meditation_sessions_content')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.log('Error fetching session (offline?):', error);
            return null;
        }
        return data;
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

export const audiobooksService = {
    /** ... */

    async getAll(): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.log('Error fetching audiobooks:', error);
            throw error;
        }

        if (data && data.length > 0) return data;

        return [];
    },

    /**
     * Get audiobooks by category
     */
    async getByCategory(category: string): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .eq('category', category)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching audiobooks by category:', error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get featured audiobooks
     */
    async getFeatured(): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching featured audiobooks:', error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get audiobook by ID
     */
    async getById(id: string): Promise<Audiobook | null> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching audiobook:', error);
            throw error;
        }

        return data;
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
            console.error('Error searching audiobooks:', error);
            throw error;
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
        const { data, error } = await supabase
            .from('real_stories')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }

        if (data && data.length > 0) return data;

        // Mock fallback if empty
        return [
            {
                id: '1', title: 'El Renacer del Fénix', subtitle: 'Superando la Adversidad', story_text: '...',
                category: 'growth', tags: ['resilience'], reading_time_minutes: 5, transformation_theme: 'Resilience',
                is_featured: true, is_premium: false
            },
            {
                id: '2', title: 'Calma en la Tormenta', subtitle: 'Ansiedad bajo control', story_text: '...',
                category: 'anxiety', tags: ['peace'], reading_time_minutes: 7, transformation_theme: 'Peace',
                is_featured: true, is_premium: false
            },
            {
                id: '3', title: 'Liderazgo Consciente', subtitle: 'Gestionando equipos', story_text: '...',
                category: 'leadership', tags: ['work'], reading_time_minutes: 6, transformation_theme: 'Leadership',
                is_featured: false, is_premium: true
            },
            {
                id: '4', title: 'Dormir Profundo', subtitle: 'Un viaje a los sueños', story_text: '...',
                category: 'sleep', tags: ['rest'], reading_time_minutes: 10, transformation_theme: 'Sleep',
                is_featured: false, is_premium: false
            }
        ];
    },

    /**
     * Get stories by category
     */
    async getByCategory(category: string): Promise<RealStory[]> {
        const { data, error } = await supabase
            .from('real_stories')
            .select('*')
            .eq('category', category)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching stories by category:', error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get featured stories
     */
    async getFeatured(): Promise<RealStory[]> {
        const { data, error } = await supabase
            .from('real_stories')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching featured stories:', error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get story by ID
     */
    async getById(id: string): Promise<RealStory | null> {
        const { data, error } = await supabase
            .from('real_stories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching story:', error);
            throw error;
        }

        return data;
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
            console.error('Error searching stories:', error);
            throw error;
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
            console.error('Error populating stories:', error);
            throw error;
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
            console.error('Error adding to favorites:', error);
            throw error;
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
            console.error('Error removing from favorites:', error);
            throw error;
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
            console.error('Error checking favorite:', error);
            return false;
        }

        return !!data;
    },

    /**
     * Get user's favorite audiobooks
     */
    async getFavoriteAudiobooks(userId: string): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('content_id')
            .eq('user_id', userId)
            .eq('content_type', 'audiobook');

        if (error) {
            console.error('Error fetching favorite audiobooks:', error);
            return [];
        }

        const ids = data.map(f => f.content_id);
        if (ids.length === 0) return [];

        const { data: audiobooks, error: audiobooksError } = await supabase
            .from('audiobooks')
            .select('*')
            .in('id', ids);

        if (audiobooksError) {
            console.error('Error fetching audiobooks:', audiobooksError);
            return [];
        }

        return audiobooks || [];
    },

    /**
     * Get user's favorite stories
     */
    async getFavoriteStories(userId: string): Promise<RealStory[]> {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('content_id')
            .eq('user_id', userId)
            .eq('content_type', 'story');

        if (error) {
            console.error('Error fetching favorite stories:', error);
            return [];
        }

        const ids = data.map(f => f.content_id);
        if (ids.length === 0) return [];

        const { data: stories, error: storiesError } = await supabase
            .from('real_stories')
            .select('*')
            .in('id', ids);

        if (storiesError) {
            console.error('Error fetching stories:', storiesError);
            return [];
        }

        return stories || [];
    },
};
