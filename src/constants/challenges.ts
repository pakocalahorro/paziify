import { ChallengeType } from '../types';

export interface ChallengeInfo {
    id: string;
    title: string;
    type: ChallengeType;
    days: number;
    description: string;
    benefits: string[];
    sessionSlug: string;
    sessionSchedule?: SessionTheme[]; // Algoritmo Dinámico v2
    colors: [string, string];
    icon: any;
}

/**
 * ALGORITMO DINÁMICO DE ROTACIÓN — SessionTheme
 *
 * En lugar de hardcodear IDs de sesiones específicas, cada día del programa
 * define una INTENCIÓN TERAPÉUTICA (categoría + mood opcional).
 *
 * El algoritmo en SessionEndScreen resuelve dinámicamente la sesión concreta
 * consultando Supabase: sesiones de esa categoría con slug != null (= validadas
 * por el admin panel). Así el pool crece automáticamente con cada subida.
 */
export interface SessionTheme {
    category: string; // TEXT en Supabase — cualquier categoría presente o futura, sin tocar código
    mood?: string;    // Tag opcional para afinar si hay muchas de la misma categoría
    intent?: string;  // Descripción humana (solo documentación, no se usa en código)
}

export const CHALLENGES: Record<string, ChallengeInfo> = {
    'paziify-master': {
        id: 'paziify-master',
        title: 'Desafío Paziify',
        type: 'desafio',
        days: 30,
        description: 'El programa maestro para transformar tu mente. Un viaje de 30 días diseñado para forjar una resiliencia inquebrantable mediante un mix inteligente de sesiones diarias.',
        benefits: [
            'Regulación profunda del estrés',
            'Claridad mental sostenida',
            'Hábito de paz consolidado'
        ],
        sessionSlug: 'anx_478',
        sessionSchedule: [
            // Semana 1 — Calma (días 1-6): base sólida de regulación del sistema nervioso
            { category: 'calmasos', intent: 'regulación inicial del sistema nervioso' },
            { category: 'calmasos', intent: 'coherencia cardíaca' },
            { category: 'calmasos', intent: 'anclaje sensorial' },
            { category: 'calmasos', intent: 'soltar pensamientos' },
            { category: 'calmasos', intent: 'refugio interior' },
            { category: 'calmasos', intent: 'cierre de semana con calma' },
            // Semana 2 — Presencia (días 7-12): atención plena y claridad mental
            { category: 'mindfulness', intent: 'anclaje en la respiración' },
            { category: 'mindfulness', intent: 'observar sin juzgar' },
            { category: 'calmasos',    intent: 'neutralizar rumiación' },
            { category: 'mindfulness', intent: 'presencia plena' },
            { category: 'mindfulness', intent: 'mente como el cielo' },
            { category: 'calmasos',    intent: 'reset mental' },
            // Semana 3 — Despertar (días 13-18): energía, foco y confianza
            { category: 'despertar', intent: 'activación matutina' },
            { category: 'despertar', intent: 'foco mental agudo' },
            { category: 'despertar', intent: 'energía cardíaca' },
            { category: 'despertar', intent: 'afirmaciones de poder' },
            { category: 'despertar', intent: 'café mental - activación rápida' },
            { category: 'despertar', intent: 'cierre de semana con energía' },
            // Semana 4 — Resiliencia (días 19-24): fortaleza mental y nervio vago
            { category: 'resiliencia', intent: 'tonificación del nervio vago' },
            { category: 'resiliencia', intent: 'gratitud y re-cableado positivo' },
            { category: 'resiliencia', intent: 'visualización estoica' },
            { category: 'calmasos',    intent: 'alivio de tensión física' },
            { category: 'resiliencia', intent: 'confianza ante retos' },
            { category: 'resiliencia', intent: 'cierre de semana con fortaleza' },
            // Semana 5 — Integración (días 25-30): consolidar y sellar el hábito
            { category: 'sueno',       intent: 'descanso profundo consciente' },
            { category: 'mindfulness', intent: 'observación de la mente completa' },
            { category: 'calmasos',    intent: 'paz como estado base' },
            { category: 'resiliencia', intent: 'gratitud final - cierre del viaje' },
            { category: 'sueno',       intent: 'recuperación y sueño reparador' },
            { category: 'resiliencia', intent: 'sellado del hábito de resiliencia' },
        ],
        colors: ['#6366F1', '#4F46E5'],
        icon: 'trophy'
    },
    'senda-calma': {
        id: 'senda-calma',
        title: 'Senda de la Calma',
        type: 'reto',
        days: 7,
        description: 'Encuentra tu centro en solo una semana. Ideal para recuperar el equilibrio después de periodos de alta demanda emocional.',
        benefits: [
            'Reducción de cortisol',
            'Paz interior reactivada',
            'Herramientas de calma rápida'
        ],
        sessionSlug: 'anx_478',
        sessionSchedule: [
            // Filosofía: Descender → Arraigarse → Expandirse → Consolidar
            { category: 'calmasos',    intent: 'entrada suave — primer contacto con la calma' },
            { category: 'calmasos',    intent: 'anclaje sensorial en el cuerpo' },
            { category: 'calmasos',    intent: 'coherencia cardíaca — ritmo y equilibrio' },
            { category: 'mindfulness', intent: 'presencia plena — atención sin juzgar' },
            { category: 'resiliencia', intent: 'sistema nervioso — tonificación del vago' },
            { category: 'calmasos',    intent: 'calma profunda — océano interior' },
            { category: 'resiliencia', intent: 'gratitud — cierre y re-cableado positivo' },
        ],
        colors: ['#2DD4BF', '#0D9488'],
        icon: 'leaf'
    },
    'senda-foco': {
        id: 'senda-foco',
        title: 'Senda del Foco',
        type: 'reto',
        days: 7,
        description: 'Entrena tu atención plena para elevar tu productividad y presencia en cada momento de tu día.',
        benefits: [
            'Mejora de la concentración',
            'Presencia plena en el ahora',
            'Eliminación de distracciones'
        ],
        sessionSlug: 'anx_478',
        sessionSchedule: [
            // Filosofía: Activar → Enfocar → Profundizar → Anclar
            { category: 'despertar',   intent: 'activación — fuelle de energía matutina' },
            { category: 'despertar',   intent: 'despertar de la mente — foco agudo' },
            { category: 'despertar',   intent: 'afirmaciones — confianza y poder' },
            { category: 'mindfulness', intent: 'anclaje en la respiración — atención sostenida' },
            { category: 'despertar',   intent: 'café mental — energía sostenida sin crash' },
            { category: 'mindfulness', intent: 'monitorización abierta — observar sin filtros' },
            { category: 'resiliencia', intent: 'estoicismo — mentalidad de acero' },
        ],
        colors: ['#FBBF24', '#D97706'],
        icon: 'flash'
    },
    'sprint-sos': {
        id: 'sprint-sos',
        title: 'Sprint SOS',
        type: 'mision',
        days: 3,
        description: 'Intervención rápida de 3 días para momentos de crisis o ansiedad puntual. Una respiración para tu alma.',
        benefits: [
            'Alivio inmediato de ansiedad',
            'Reconexión con el cuerpo',
            'Rescate emocional rápido'
        ],
        sessionSlug: 'anx_478',
        sessionSchedule: [
            // Filosofía: Intervención → Estabilización → Cierre
            { category: 'calmasos', mood: 'pánico',  intent: 'intervención de emergencia — parar la escalada' },
            { category: 'calmasos', mood: 'crisis',  intent: 'estabilización — recuperar el suelo firme' },
            { category: 'calmasos', mood: 'estrés',  intent: 'cierre y recuperación — volver al centro' },
        ],
        colors: ['#EF4444', '#B91C1C'],
        icon: 'fitness'
    },
    'pausa-express': {
        id: 'pausa-express',
        title: 'Pausa Express',
        type: 'mision',
        days: 3,
        description: 'Aprende a pausar en medio de la tormenta. Tres días de micro-prácticas potentes para días ocupados.',
        benefits: [
            'Micro-dosis de serenidad',
            'Freno al piloto automático',
            'Energía renovada en minutos'
        ],
        sessionSlug: 'anx_478',
        sessionSchedule: [
            // Filosofía: Cortar → Soltar → Renovar
            { category: 'calmasos',    intent: 'cortar — parada y reset rápido' },
            { category: 'mindfulness', intent: 'soltar — observar pensamientos sin engancharse' },
            { category: 'despertar',   intent: 'renovar — energía limpia para continuar' },
        ],
        colors: ['#8B5CF6', '#6D28D9'],
        icon: 'infinite'
    }
};
