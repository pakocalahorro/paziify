import { CardioResult } from '../services/CardioService';

export interface InsightResult {
    icon: string;
    title: string;
    body: string;
    color: string;
}

/**
 * Genera un insight dinámico basado en los datos reales del usuario.
 * Función pura sin side effects.
 */
export function generateWeeklyInsight(
    scans: CardioResult[],
    weeklyMinutes: number,
    streak: number,
    name?: string
): InsightResult {
    const displayName = name ? `, ${name}` : '';

    // Caso 1: Sin datos en absoluto
    if (scans.length === 0 && weeklyMinutes === 0) {
        return {
            icon: '🌱',
            title: 'Tu práctica te espera',
            body: '5 minutos son suficientes para empezar. Cada gran árbol comienza siendo una semilla.',
            color: '#10B981',
        };
    }

    // Caso 2: Actividad de meditación pero sin escaneos
    if (scans.length === 0 && weeklyMinutes > 0) {
        return {
            icon: '💚',
            title: 'Meditas, pero no te conoces',
            body: `Esta semana meditaste ${Math.round(weeklyMinutes)} minutos. Añade el Cardio Scan para descubrir cómo cambia tu bio-ritmo.`,
            color: '#6366F1',
        };
    }

    // Calcular tendencia HRV (comparar primera mitad vs segunda mitad de la semana)
    const midpoint = Math.floor(scans.length / 2);
    const firstHalf = scans.slice(0, midpoint);
    const secondHalf = scans.slice(midpoint);

    const avgHrvFirst = firstHalf.length > 0
        ? firstHalf.reduce((acc, s) => acc + s.hrv, 0) / firstHalf.length
        : 0;
    const avgHrvSecond = secondHalf.length > 0
        ? secondHalf.reduce((acc, s) => acc + s.hrv, 0) / secondHalf.length
        : 0;

    const hrvDeltaPct = avgHrvFirst > 0
        ? Math.round(((avgHrvSecond - avgHrvFirst) / avgHrvFirst) * 100)
        : 0;

    // Diagnóstico predominante
    const diagnosisCounts = scans.reduce((acc, s) => {
        acc[s.diagnosis] = (acc[s.diagnosis] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const dominantDiagnosis = Object.entries(diagnosisCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'equilibrio';

    // Caso 3: HRV en ascenso significativo
    if (hrvDeltaPct >= 10 && scans.length >= 2) {
        return {
            icon: '📈',
            title: 'Tu sistema nervioso mejora',
            body: `Tu HRV subió un ${hrvDeltaPct}% esta semana${displayName}. La meditación está reescribiendo tu biología.`,
            color: '#10B981',
        };
    }

    // Caso 4: Diagnóstico mayoritario = sobrecarga
    if (dominantDiagnosis === 'sobrecarga') {
        return {
            icon: '🛡️',
            title: 'Tu cuerpo ha estado bajo presión',
            body: `Esta semana tus escaneos muestran tensión acumulada. Tu práctica es tu escudo${displayName}. Sigue.`,
            color: '#F59E0B',
        };
    }

    // Caso 5: Racha + HRV estable (equilibrio o mejora leve)
    if (streak >= 7 && dominantDiagnosis === 'equilibrio') {
        return {
            icon: '🌟',
            title: `${streak} días de constancia`,
            body: `Tu disciplina está dando frutos${displayName}. El equilibrio que muestran tus escaneos no es casualidad.`,
            color: '#D4AF37',
        };
    }

    // Caso 6: Equilibrio general (fallback positivo)
    return {
        icon: '💚',
        title: 'Tu semana en equilibrio',
        body: `${scans.length} escaneo${scans.length !== 1 ? 's' : ''} esta semana. Tu bio-ritmo se mantiene estable${displayName}. Bien hecho.`,
        color: '#10B981',
    };
}
