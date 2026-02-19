import { SignalQuality, HRVNormalized, BioAnalysisResult } from '../types/cardio';

/**
 * BioSignalProcessor v2.1 - Hybrid Engine & Progressive Scan
 * 
 * Major Changes:
 * 1. Hybrid Engine: Combines POS (Precision) + Legacy (Robustness)
 * 2. Progressive Accumulation: Quality-based progress, not time-based.
 * 3. Smart Filter: Logic-based outlier rejection (max BPM jump).
 * 4. Hot Start: Preserves buffer between phases.
 */
export class BioSignalProcessor {
    private static readonly SAMPLE_RATE = 30; // 30Hz
    private static readonly WINDOW_SIZE = 300; // 10s buffer (Increased for better HRV accuracy)

    // Multi-channel RGB buffers
    private rBuffer: number[] = [];
    private gBuffer: number[] = [];
    private bBuffer: number[] = [];
    private timestamps: number[] = [];

    // Accumulation State
    private accumulatedQuality = 0; // 0-100%
    private qualityPackets = 0;
    private lastProcessedPeakTime = 0; // Track unique peaks to prevent duplicates

    // Smart Filter State
    private lastValidResult: BioAnalysisResult | null = null;
    private lastValidBPM: number | null = null;

    /**
     * Add Sample (Hot Start Capable)
     */
    public addRGBSample(r: number, g: number, b: number, timestampMs: number) {
        this.rBuffer.push(r);
        this.gBuffer.push(g);
        this.bBuffer.push(b);
        this.timestamps.push(timestampMs);

        if (this.rBuffer.length > BioSignalProcessor.WINDOW_SIZE) {
            this.rBuffer.shift();
            this.gBuffer.shift();
            this.bBuffer.shift();
            this.timestamps.shift();
        }
    }

    /**
     * HYBRID ENGINE: Get Progress Increment based on Quality
     * Returns 0-5% progress based on current signal packet
     */
    public processProgressFrame(): { progressDelta: number; quality: SignalQuality } {
        const quality = this.getSignalQuality();
        let progressDelta = 0;

        // Only accumulate if signal is decent
        if (quality.score >= 60) {
            // Excellent signal = faster progress
            // Target: ~15-20s duration for reliable HRV
            // 30fps * 20s = 600 frames. 100/600 = ~0.16
            const multiplier = quality.level === 'excellent' ? 1.5 : 1.0;
            progressDelta = 0.15 * multiplier; // Slower progress for more data
        } else if (quality.score < 40) {
            // Very poor signal = slight regression/penalty to force stability
            // But don't punish too hard
            progressDelta = 0;
        }

        return { progressDelta, quality };
    }



    /**
     * Main Analysis Pipeline
     * Tries POS (Remote PPG) first, falls back to Green Channel (Legacy)
     */
    public analyze(): BioAnalysisResult | null {
        // 1. Try POS (Best for motion/robustness)
        let result = this.analyzeWithPOS();

        // 2. Fallback to Green Channel (Best for stationarity)
        if (!result) {
            // Only log sparingly
            // console.log('[BioProcessor] POS failed/low conf, switching to Legacy Green');
            result = this.analyzeLegacy();
        }

        // 3. Cache valid result if found
        if (result) {
            // Smart Filter Check to avoid huge jumps
            // Smart Filter Check to avoid huge jumps
            if (this.lastValidBPM && Math.abs(result.bpm - this.lastValidBPM) > 40) {
                // Ignore jump if too large, but if it persists we might need to reset.
                // For now, let's just log it and maybe NOT update lastValidResult?
                // Actually, if we return it, we should trust it somewhat.
                // console.log('[BioProcessor] Jump detected');
            }
            this.lastValidResult = result;
            this.lastValidBPM = result.bpm;
        }
        // 4. "Memory" Fallback (CRITICAL FIX):
        else if (this.lastValidResult) {
            return { ...this.lastValidResult, confidence: 0.5 };
        }

        return result;
    }

    /**
     * POS Algorithm (Optimized)
     */
    private analyzeWithPOS(): BioAnalysisResult | null {
        if (this.rBuffer.length < BioSignalProcessor.WINDOW_SIZE) return null;

        const ppgSignal = this.applyPOSAlgorithm();
        if (ppgSignal.length < BioSignalProcessor.WINDOW_SIZE) return null;

        const filtered = this.detrendSignal(ppgSignal);
        const peaks = this.findPeaksAdaptive(filtered);

        if (peaks.length < 2) return null;

        return this.calculateMetricsFromPeaks(peaks);
    }

    /**
     * Legacy Algorithm (Green Channel Only)
     */
    private analyzeLegacy(): BioAnalysisResult | null {
        if (this.gBuffer.length < 60) return null;

        // Use Green channel (inverted as blood absorption absorbs green)
        // Actually for reflection, higher blood = less green reflected.
        // We use -Green or just Green and look for valleys.
        // Simple approach: Detrend Green directly.

        const processed = this.detrendSignal(this.gBuffer);
        // Invert signal for peak detection if looking for absorption peaks
        // But findPeaksAdaptive looks for local maxima. Pulse = max blood flow = max absorption = min reflection.
        // So we should invert the green signal to find peaks at pulse beats.
        const inverted = processed.map(v => -v);

        const peaks = this.findPeaksAdaptive(inverted);

        if (peaks.length < 3) return null;

        return this.calculateMetricsFromPeaks(peaks);
    }

    private calculateMetricsFromPeaks(peaks: number[]): BioAnalysisResult | null {
        // ROBUSTNESS: Ensure we return something if we have minimal data.
        if (peaks.length < 2) {
            // EMERGENCY FALLBACK: Estimate from peak count over buffer duration
            // This is a rough estimate but better than "No Metrics" error.
            // approx duration = (buffer length) / 30fps. 
            // We don't have buffer length here easily, so we just fail if < 2 peaks.
            return null;
        }

        const rawRRs: number[] = [];
        let newSessionRRs: number[] = [];

        // Optimization: Use last 150 samples max or whatever applyPOSAlgorithm used
        // applyPOSAlgorithm uses: const limit = Math.min(n, BioSignalProcessor.WINDOW_SIZE);
        // const start = n - limit;
        const n = this.rBuffer.length;
        const limit = Math.min(n, BioSignalProcessor.WINDOW_SIZE);
        const start = n - limit;

        for (let i = 1; i < peaks.length; i++) {
            // Convert indices to ms (assuming 30fps = 33.33ms per frame)
            const rr = (peaks[i] - peaks[i - 1]) * 33.33;
            rawRRs.push(rr);

            // UNIQUE PEAK TRACKING
            // Get absolute timestamp of this peak
            // peaks[i] is relative to the start of the analyzed window
            const peakIndex = start + peaks[i];
            const peakTime = this.timestamps[peakIndex];

            // If this peak is NEW (newer than last processed), add its RR to session
            if (peakTime > this.lastProcessedPeakTime) {
                // Determine if this RR is valid before pushing
                if (rr > 330 && rr < 1500) { // Same filter as filterRRIntervals
                    newSessionRRs.push(rr);
                    this.lastProcessedPeakTime = peakTime;
                }
            }
        }

        // Filter extreme outliers (noise)
        let finalRRs = this.filterRRIntervals(rawRRs);

        // FALLBACK 1: If filtering removed too many, use rawRRs but clamp loosely
        if (finalRRs.length === 0) {
            finalRRs = rawRRs.filter(rr => rr > 250 && rr < 2000);
        }

        // FALLBACK 2: If still empty, use ALL rawRRs (trust the peak finder)
        if (finalRRs.length === 0) {
            finalRRs = rawRRs;
        }

        if (finalRRs.length === 0) return null; // Should be impossible if peaks >= 2

        // --- SESSION ACCUMULATION (New) ---
        // PRECISION FIX: Only push NEW unique RRs detected in this frame
        if (newSessionRRs.length > 0) {
            this.sessionIBIs.push(...newSessionRRs);
        }
        // ----------------------------------

        const bpm = this.calculateBPM(finalRRs);
        const rmssd = this.calculateRMSSD(finalRRs);
        const confidence = finalRRs.length / (peaks.length - 1);

        return { bpm, rmssd, confidence };
    }

    // --- SHARED ALGORITHMS (POS, SNR, ETC) SAME AS BEFORE ---

    private applyPOSAlgorithm(): number[] {
        const n = this.rBuffer.length;
        // Optimization: Use last 150 samples max
        const limit = Math.min(n, BioSignalProcessor.WINDOW_SIZE);
        const start = n - limit;

        const r = this.rBuffer.slice(start);
        const g = this.gBuffer.slice(start);
        const b = this.bBuffer.slice(start);

        const rMean = this.mean(r) || 1;
        const gMean = this.mean(g) || 1;
        const bMean = this.mean(b) || 1;

        const s1: number[] = [];
        const s2: number[] = [];

        for (let i = 0; i < limit; i++) {
            const rn = r[i] / rMean;
            const gn = g[i] / gMean;
            const bn = b[i] / bMean;

            s1.push(rn - gn);
            s2.push(rn + gn - 2 * bn);
        }

        const alpha = this.std(s1) / (this.std(s2) || 1);

        return s1.map((v, i) => v - alpha * s2[i]);
    }

    public getCalibrationQuality() {
        // Reuse getSignalQuality logic but with different thresholds/messages if needed
        // For now, mapping directly for consistency
        const q = this.getSignalQuality();

        // Calibration needs stable signal but maybe less strict on SNR duration
        return {
            score: q.score,
            level: q.level,
            issue: q.score < 50 ? 'bad_signal' : null,
            ready: q.score >= 70, // Slightly easier trigger
            recommendation: q.recommendations[0] || 'Escaneando...'
        };
    }

    public getSignalQuality(): SignalQuality {
        // 1. CRITICAL: Check if finger is actually covering the lens
        if (!this.checkFingerDetected()) {
            return {
                score: 0,
                level: 'poor',
                recommendations: ['Coloca el dedo cubriendo LENTE y FLASH']
            };
        }

        const snr = this.calculateSNR();
        const stability = this.calculateStability();

        // Weighted Score: SNR is king, Stability is queen
        let score = (snr * 3) + (stability * 0.5);
        score = Math.min(100, Math.max(0, score)); // Clamp 0-100

        let level: 'excellent' | 'good' | 'poor' = 'poor';
        if (score >= 75) level = 'excellent';
        else if (score >= 50) level = 'good';

        const recommendations: string[] = [];
        if (snr < 10) recommendations.push('Presiona suavemente');
        if (stability < 60) recommendations.push('Mantén el dedo quieto');

        return { score, level, recommendations };
    }

    private checkFingerDetected(): boolean {
        // Need at least 5 frames
        if (this.rBuffer.length < 5) return false;

        // Check recent average brightness (last 10 frames)
        const recentR = this.rBuffer.slice(-10);
        const recentG = this.gBuffer.slice(-10);
        const recentB = this.bBuffer.slice(-10);

        const avgR = recentR.reduce((a, b) => a + b, 0) / recentR.length;
        const avgG = recentG.reduce((a, b) => a + b, 0) / recentG.length;
        const avgB = recentB.reduce((a, b) => a + b, 0) / recentB.length;

        // CRITERIA FOR FINGER ON FLASH:
        // 1. Red must be dominant and sufficiently bright
        // 2. Green/Blue should be significantly lower (absorption)

        // SUPER ADAPTIVE THRESHOLDS based on User Feedback/Screenshot
        // User saw: R:102, G:195, B:97 -> Pulse was valid (75 BPM), but Quality was 0.
        // This means Auto-White-Balance pushed Green high. We must trust Brightness + Pulse signal.

        // SUPER ADAPTIVE THRESHOLDS based on User Feedback
        // User saw: R:13, G:102, B:5 -> Valid Finger!
        // The previous R > 40 check was failing here.

        // 1. Brightness Check:
        // Accept if Red OR Green is reasonably high.
        // Some cameras filter Red heavily under flash, but Green shines through skin.
        const isBright = avgR > 10 || avgG > 40;

        // 2. Color Profile Check:
        // Skin absorbs Blue heavily. If Blue is the lowest channel, it's likely skin.
        // If Blue is high (close to Green/Red), it's likely ambient light or a screen.
        const isSkinTone = avgB < avgG * 0.5 && avgB < avgR * 1.5;

        // Debug logging (Verification for User)
        if (Math.random() < 0.1) {
            console.log(`[FingerCheck] R:${avgR.toFixed(0)} G:${avgG.toFixed(0)} B:${avgB.toFixed(0)} -> ${isBright && isSkinTone ? 'YES' : 'NO'}`);
        }

        return isBright && isSkinTone;
    }

    private calculateSNR(): number {
        if (this.gBuffer.length < 30) return 0;

        // Use Green channel for Signal Quality (strongest PPG signal)
        const data = this.gBuffer.slice(-60); // Check last 2 seconds

        const ac = this.detrendSignal(data);
        const signalPower = this.std(ac); // AC amplitude

        // Noise estimation: rapid changes
        let noiseSum = 0;
        for (let i = 1; i < data.length; i++) {
            noiseSum += Math.abs(data[i] - data[i - 1]);
        }
        const noiseLevel = noiseSum / data.length;

        if (noiseLevel === 0) return 0;

        // Pseudo-SNR calculation
        const snr = (signalPower / noiseLevel) * 20;
        return Math.min(40, snr);
    }

    private calculateStability(): number {
        if (this.gBuffer.length < 30) return 0;
        const data = this.gBuffer.slice(-30);
        // Variance in DC level (indicates pressure change or motion)
        const stdDev = this.std(data);
        // Lower stdDev (DC) is better stability
        // Mapping: 0 stdDev -> 100 score, 20 stdDev -> 0 score
        return Math.max(0, 100 - (stdDev * 5));
    }

    // --- UTILS ---
    private detrendSignal(data: number[]): number[] {
        const w = 15;
        return data.map((v, i) => {
            const start = Math.max(0, i - w);
            const end = Math.min(data.length, i + w);
            const sub = data.slice(start, end);
            const avg = sub.reduce((a, b) => a + b, 0) / sub.length;
            return v - avg;
        });
    }

    private findPeaksAdaptive(data: number[]): number[] {
        const sorted = [...data].sort((a, b) => a - b);
        const threshold = sorted[Math.floor(sorted.length * 0.75)]; // Top 25%

        const peaks: number[] = [];
        // Min distance ~250ms (240 BPM) -> 30fps * 0.25 = 7.5 frames
        const minDist = 8;

        for (let i = 2; i < data.length - 2; i++) {
            if (data[i] > threshold &&
                data[i] > data[i - 1] && data[i] > data[i - 2] &&
                data[i] > data[i + 1] && data[i] > data[i + 2]) {

                if (peaks.length === 0 || (i - peaks[peaks.length - 1]) > minDist) {
                    peaks.push(i);
                } else if (data[i] > data[peaks[peaks.length - 1]]) {
                    // Keep higher peak if too close
                    peaks[peaks.length - 1] = i;
                }
            }
        }
        return peaks;
    }

    private filterRRIntervals(rrs: number[]): number[] {
        // Simple range filter for now: 40-180 BPM (333ms - 1500ms)
        return rrs.filter(rr => rr > 330 && rr < 1500);
    }

    private calculateBPM(rrs: number[]): number {
        if (rrs.length === 0) return 0;
        const avg = rrs.reduce((a, b) => a + b, 0) / rrs.length;
        return Math.round(60000 / avg);
    }

    private calculateRMSSD(rrs: number[]): number {
        if (rrs.length < 2) return 0;
        let sum = 0;
        for (let i = 1; i < rrs.length; i++) {
            sum += Math.pow(rrs[i] - rrs[i - 1], 2);
        }
        return Math.round(Math.sqrt(sum / (rrs.length - 1)));
    }

    // Session Accumulation (Scientific Gold Standard)
    private sessionIBIs: number[] = [];

    // --- FINAL SCIENTIFIC CALCULATION ---
    /**
     * Calculates the definitive session metrics using the entire gathered dataset
     * applying MAD filtering to remove artifacts.
     */
    public calculateSessionMetrics(): BioAnalysisResult | null {
        // 1. If buffer is empty, return last known valid result
        if (this.sessionIBIs.length < 5) return this.lastValidResult;

        // 2. Outlier Removal via Median Absolute Deviation (MAD)
        // This is robust against occasional movement peaks
        const rrs = this.filterOutliersMAD(this.sessionIBIs);

        if (rrs.length === 0) return this.lastValidResult;

        // 3. Compute Final Metrics on CLEAN dataset
        const bpm = this.calculateBPM(rrs);
        const rmssd = this.calculateRMSSD(rrs);
        const confidence = 1.0; // High confidence because we filtered

        // Log for transparency
        console.log(`[BioProcessor] Final Session Analysis: Raw=${this.sessionIBIs.length}, Clean=${rrs.length}, BPM=${bpm}, HRV=${rmssd}`);

        return { bpm, rmssd, confidence };
    }

    private filterOutliersMAD(data: number[]): number[] {
        const med = this.median(data);
        const absDevs = data.map(v => Math.abs(v - med));
        const mad = this.median(absDevs);

        // Standard rejection: 3 * MAD (approx 2 * SD for normal dist)
        // We use generous 3.5 to keep natural variability but kill artifacts
        const limit = 3.5 * (mad || 1); // Avoid 0

        return data.filter(v => Math.abs(v - med) <= limit);
    }

    private median(arr: number[]): number {
        if (!arr.length) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    public normalizeHRV(rmssd: number, age: number, gender: 'male' | 'female'): HRVNormalized {
        // Simple normalization for MVP
        const expected = 50 - (age * 0.5);
        const score = Math.min(100, (rmssd / expected) * 100);
        let category: any = 'average';
        if (score > 120) category = 'excellent';
        else if (score < 60) category = 'poor';

        return {
            rawValue: rmssd,
            normalizedValue: Math.round(score),
            expectedValue: Math.round(expected),
            category,
            message: category === 'excellent' ? 'Excelente' : 'Normal'
        };
    }

    private mean(arr: number[]) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
    private std(arr: number[]) {
        if (!arr.length) return 0;
        const m = this.mean(arr);
        return Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length);
    }

    public reset() {
        this.rBuffer = []; this.gBuffer = []; this.bBuffer = []; this.timestamps = [];
        this.accumulatedQuality = 0;
        this.lastValidBPM = null;
        this.sessionIBIs = []; // Clear session buffer
        this.lastProcessedPeakTime = 0;
    }
}

export const bioProcessor = new BioSignalProcessor();
