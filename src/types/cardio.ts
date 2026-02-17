/**
 * Cardio Scan Types
 * Interfaces for biometric signal processing and HRV analysis
 */

export interface SignalQuality {
    score: number; // 0-100
    level: 'excellent' | 'good' | 'poor';
    recommendations: string[];
}

export interface HRVNormalized {
    rawValue: number; // RMSSD in ms
    normalizedValue: number; // Percentile 0-100
    expectedValue: number; // Expected HRV for age/gender
    category: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    message: string;
}

export interface CardioMetrics {
    bpm: number;
    hrv: number; // RMSSD
    hrvNormalized?: HRVNormalized;
    signalQuality?: SignalQuality;
    confidence: number;
    timestamp?: string;
}

export interface BioAnalysisResult {
    bpm: number;
    rmssd: number;
    confidence: number;
}
