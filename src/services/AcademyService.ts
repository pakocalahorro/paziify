import { supabase } from './supabaseClient';
import { AcademyModule, Lesson } from '../data/academyData';

export const AcademyService = {
    async getModules(): Promise<AcademyModule[]> {
        const { data, error } = await supabase
            .from('academy_modules')
            .select('*')
            // .eq('is_published', true) // Temoorarily disabled for debugging
            .order('title');

        console.log('AcademyService getModules result:', { dataLength: data?.length, error });

        if (error) {
            console.error('Error fetching academy modules:', error);
            throw error;
        }

        // Map Supabase data to AcademyModule interface if needed
        // Assuming direct mapping for now, but handling potential nulls
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            icon: item.icon,
            category: item.category,
            author: item.author,
            duration: item.duration,
            image: item.image_url, // map image_url to image
        }));
    },

    async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
        const { data, error } = await supabase
            .from('academy_lessons')
            .select('*')
            .eq('module_id', moduleId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error(`Error fetching lessons for module ${moduleId}:`, error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            moduleId: item.module_id,
            title: item.title,
            description: item.description,
            duration: item.duration,
            isPlus: item.is_premium,
            content: item.content,
            audioSource: item.audio_url, // direct URL string
        }));
    },

    async getModuleById(moduleId: string): Promise<AcademyModule | null> {
        const { data, error } = await supabase
            .from('academy_modules')
            .select('*')
            .eq('id', moduleId)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            category: data.category,
            author: data.author,
            duration: data.duration,
            image: data.image_url,
        };
    },

    async getLessonById(lessonId: string): Promise<Lesson | null> {
        const { data, error } = await supabase
            .from('academy_lessons')
            .select('*')
            .eq('id', lessonId)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            moduleId: data.module_id,
            title: data.title,
            description: data.description,
            duration: data.duration,
            isPlus: data.is_premium,
            content: data.content,
            audioSource: data.audio_url,
        };
    }
};
