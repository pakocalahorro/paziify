import { supabase } from './supabaseClient';
import { AcademyModule, Lesson, ACADEMY_MODULES, ACADEMY_LESSONS } from '../data/academyData';

const ICON_MAPPING: Record<string, string> = {
    'mountain': 'mount-outline',
    'frown-outline': 'sad-outline',
};

// mapping helper
const mapIcon = (icon: string) => ICON_MAPPING[icon] || icon;

export const AcademyService = {
    async getModules(): Promise<AcademyModule[]> {
        try {
            const { data, error } = await supabase
                .from('academy_modules')
                .select('*')
                .order('title');

            if (error) throw error;

            return data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                icon: mapIcon(item.icon),
                category: item.category,
                author: item.author,
                duration: item.duration,
                image: item.image_url,
            }));
        } catch (error) {
            console.log('[AcademyService] Using Local Fallback for Modules (silenced)');
            return ACADEMY_MODULES;
        }
    },

    async getLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
        try {
            const { data, error } = await supabase
                .from('academy_lessons')
                .select('*')
                .eq('module_id', moduleId)
                .order('order_index', { ascending: true });

            if (error) throw error;

            return data.map((item: any) => ({
                id: item.id,
                moduleId: item.module_id,
                title: item.title,
                description: item.description,
                duration: item.duration,
                isPlus: item.is_premium,
                content: item.content,
                audio_url: item.audio_url,
            }));
        } catch (error) {
            console.log('[AcademyService] Using Local Fallback for Lessons (silenced)', moduleId);
            return ACADEMY_LESSONS.filter(l => l.moduleId === moduleId);
        }
    },

    async getModuleById(moduleId: string): Promise<AcademyModule | null> {
        try {
            const { data, error } = await supabase
                .from('academy_modules')
                .select('*')
                .eq('id', moduleId)
                .single();

            if (error || !data) throw error || new Error('Not found');

            return {
                id: data.id,
                title: data.title,
                description: data.description,
                icon: mapIcon(data.icon),
                category: data.category,
                author: data.author,
                duration: data.duration,
                image: data.image_url,
            };
        } catch (error) {
            console.log('[AcademyService] Using Local Fallback for Module (silenced)', moduleId);
            return ACADEMY_MODULES.find(m => m.id === moduleId) || null;
        }
    },

    async getLessonById(lessonId: string): Promise<Lesson | null> {
        try {
            const { data, error } = await supabase
                .from('academy_lessons')
                .select('*')
                .eq('id', lessonId)
                .single();

            if (error || !data) throw error || new Error('Not found');

            return {
                id: data.id,
                moduleId: data.module_id,
                title: data.title,
                description: data.description,
                duration: data.duration,
                isPlus: data.is_premium,
                content: data.content,
                audio_url: data.audio_url,
            };
        } catch (error) {
            console.log('AcademyService: Using Local Fallback for Lesson (silenced)', lessonId);
            return ACADEMY_LESSONS.find(l => l.id === lessonId) || null;
        }
    }
};
