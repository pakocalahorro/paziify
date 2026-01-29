import { supabase } from './supabaseClient';
import { Audiobook, RealStory } from '../types';

/**
 * Audiobooks Service
 * Functions to interact with audiobooks table
 */

export const audiobooksService = {
    /**
     * Get all audiobooks
     */
    async getAll(): Promise<Audiobook[]> {
        const { data, error } = await supabase
            .from('audiobooks')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching audiobooks:', error);
            throw error;
        }

        if (data && data.length > 0) return data;

        // Mock fallback if empty
        return [
            {
                id: '1', title: 'The Conquest of Fear', author: 'Basil King', narrator: 'Paziify AI',
                category: 'anxiety', tags: ['peace', 'mind'], audio_url: 'dummy', duration_minutes: 45,
                source: 'librivox', language: 'en', is_premium: false, is_featured: true
            },
            {
                id: '2', title: 'As a Man Thinketh', author: 'James Allen', narrator: 'Paziify AI',
                category: 'growth', tags: ['mindset', 'success'], audio_url: 'dummy', duration_minutes: 60,
                source: 'librivox', language: 'en', is_premium: false, is_featured: true
            },
            {
                id: '3', title: 'Meditations', author: 'Marcus Aurelius', narrator: 'Paziify AI',
                category: 'leadership', tags: ['stoic', 'philosophy'], audio_url: 'dummy', duration_minutes: 120,
                source: 'librivox', language: 'en', is_premium: true, is_featured: true
            },
            {
                id: '4', title: 'Little Women', author: 'Louisa May Alcott', narrator: 'Paziify AI',
                category: 'relationships', tags: ['family', 'love'], audio_url: 'dummy', duration_minutes: 300,
                source: 'librivox', language: 'en', is_premium: false, is_featured: false
            },
            {
                id: '5', title: 'Sleep Well', author: 'Dr. Calm', narrator: 'Paziify AI',
                category: 'sleep', tags: ['rest', 'dreams'], audio_url: 'dummy', duration_minutes: 30,
                source: 'paziify', language: 'en', is_premium: false, is_featured: false
            }
        ];
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
                is_featured: true, is_premium: false, created_at: new Date().toISOString()
            },
            {
                id: '2', title: 'Calma en la Tormenta', subtitle: 'Ansiedad bajo control', story_text: '...',
                category: 'anxiety', tags: ['peace'], reading_time_minutes: 7, transformation_theme: 'Peace',
                is_featured: true, is_premium: false, created_at: new Date().toISOString()
            },
            {
                id: '3', title: 'Liderazgo Consciente', subtitle: 'Gestionando equipos', story_text: '...',
                category: 'leadership', tags: ['work'], reading_time_minutes: 6, transformation_theme: 'Leadership',
                is_featured: false, is_premium: true, created_at: new Date().toISOString()
            },
            {
                id: '4', title: 'Dormir Profundo', subtitle: 'Un viaje a los sueños', story_text: '...',
                category: 'sleep', tags: ['rest'], reading_time_minutes: 10, transformation_theme: 'Sleep',
                is_featured: false, is_premium: false, created_at: new Date().toISOString()
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
