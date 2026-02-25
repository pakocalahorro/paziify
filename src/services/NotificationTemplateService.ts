import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationTemplate {
    id: string;
    category: 'behavioral' | 'editorial';
    type: string;
    title: string;
    body: string;
    is_active: boolean;
}

const CACHE_KEY = 'paziify_notification_templates';

export const NotificationTemplateService = {
    /**
     * Obtiene todas las plantillas activas. 
     * Prioriza caché local y actualiza en segundo plano.
     */
    async getTemplates(): Promise<NotificationTemplate[]> {
        try {
            // 1. Intentar cargar desde caché
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            let localTemplates: NotificationTemplate[] = cached ? JSON.parse(cached) : [];

            // 2. Si hay red, refrescar en segundo plano (o si no hay caché, esperar)
            const fetchPromise = this.refreshCache();

            if (localTemplates.length === 0) {
                return await fetchPromise;
            }

            return localTemplates;
        } catch (error) {
            console.error('Error loading templates:', error);
            return [];
        }
    },

    /**
     * Fuerza la descarga de plantillas desde Supabase y actualiza la caché
     */
    async refreshCache(): Promise<NotificationTemplate[]> {
        try {
            const { data, error } = await supabase
                .from('notification_templates')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;
            if (data) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
                return data as NotificationTemplate[];
            }
            return [];
        } catch (error) {
            console.error('Error refreshing templates cache:', error);
            return [];
        }
    },

    /**
     * Obtiene una plantilla específica por su tipo
     */
    async getTemplateByType(type: string): Promise<NotificationTemplate | null> {
        const templates = await this.getTemplates();
        return templates.find(t => t.type === type) || null;
    }
};
