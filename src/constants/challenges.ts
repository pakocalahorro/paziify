import { ChallengeType } from '../types';

export interface ChallengeInfo {
    id: string;
    title: string;
    type: ChallengeType;
    days: number;
    description: string;
    benefits: string[];
    sessionSlug: string;
    colors: [string, string];
    icon: any;
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
        sessionSlug: 'con_123',
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
        colors: ['#8B5CF6', '#6D28D9'],
        icon: 'infinite'
    }
};
