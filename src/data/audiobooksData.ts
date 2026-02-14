import { Audiobook } from '../types';

/**
 * Paziify Local Audiobooks Catalog
 * Repaired with correct Supabase subfolders as identified in the Forensic Audit.
 */
export const LOCAL_AUDIOBOOKS: Audiobook[] = [
    {
        id: 'ab_001',
        title: 'El Poder del Ahora',
        author: 'Eckhart Tolle',
        narrator: 'Aria',
        description: 'Una guía esencial para el despertar espiritual y vivir en el presente.',
        category: 'growth',
        tags: ['presencia', 'zen', 'despertar'],
        // REPAIRED: Added /growth/ subfolder
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobooks/growth/poder_del_ahora.mp3',
        image_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobook-thumbnails/poder_del_ahora.webp',
        duration_minutes: 450,
        source: 'Library',
        language: 'es',
        is_premium: true,
        is_featured: true
    },
    {
        id: 'ab_002',
        title: 'Meditaciones',
        author: 'Marco Aurelio',
        narrator: 'Ziro',
        description: 'Reflexiones estoicas sobre la virtud, la brevedad de la vida y la paz interior.',
        category: 'growth',
        tags: ['estoicismo', 'resiliencia', 'filosofía'],
        // REPAIRED: Added /growth/ subfolder
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobooks/growth/meditaciones_marco_aurelio.mp3',
        image_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobook-thumbnails/meditaciones.webp',
        duration_minutes: 320,
        source: 'Library',
        language: 'es',
        is_premium: false,
        is_featured: true
    },
    {
        id: 'ab_003',
        title: 'Hábitos Atómicos',
        author: 'James Clear',
        narrator: 'Gaia',
        description: 'Pequeños cambios para obtener resultados extraordinarios en tu vida diaria.',
        category: 'professional',
        tags: ['hábitos', 'productividad', 'mejora'],
        // REPAIRED: Added /professional/ subfolder
        audio_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobooks/professional/habitos_atomicos.mp3',
        image_url: 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/audiobook-thumbnails/habitos_atomicos.webp',
        duration_minutes: 380,
        source: 'Library',
        language: 'es',
        is_premium: true,
        is_featured: false
    }
];
