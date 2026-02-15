import { Share } from 'react-native';

/**
 * BioSignalProcessor
 * 
 * Handles the mathematical analysis of the PPG signal extracted from the camera frames.
 * - Buffers raw intensity values.
 * - Applies Bandpass Filtering (0.8Hz - 3.0Hz) to isolate heart rate frequencies.
 * - Detects peaks (heartbeats) in the filtered signal.
 * - Calculates BPM and HRV (RMSSD).
 */
export class BioSignalProcessor {
    // Configuration for JS Loop (15Hz ~ 66ms)
    private static SAMPLE_RATE = 15;
    private static WINDOW_SIZE = 75; // 5s buffer @ 15Hz

    // State
    private buffer: number[] = [];
    private timestamps: number[] = [];

    /**
     * Adds a sample. 
     * Handles infinite streams by keeping a fixed window.
     */
    public addSample(value: number, timestampMs: number) {
        this.buffer.push(value);
        this.timestamps.push(timestampMs);

        // Maintain fixed window size
        if (this.buffer.length > BioSignalProcessor.WINDOW_SIZE) {
            this.buffer.shift();
            this.timestamps.shift();
        }
    }

    public analyze() {
        if (this.buffer.length < BioSignalProcessor.SAMPLE_RATE * 1.5) {
            return null; // Need at least 1.5s for initial stats
        }

        // 1. Pre-processing: Detrending (High-Pass like)
        // Removes the DC component (ambient light changes)
        const processed = this.detrendSignal(this.buffer);

        // 2. Adaptive Peak Detection
        // Finds peaks that stick out above local noise
        const peaks = this.findPeaksAdaptive(processed);

        if (peaks.length < 2) return null;

        // 3. Calculate RR Intervals
        const rrs: number[] = [];
        for (let i = 1; i < peaks.length; i++) {
            const t1 = this.timestamps[peaks[i]];
            const t0 = this.timestamps[peaks[i - 1]];
            const rr = t1 - t0;

            // Filters: Human heart range [300ms (200bpm) - 1500ms (40bpm)]
            if (rr > 300 && rr < 1500) {
                rrs.push(rr);
            }
        }

        if (rrs.length < 2) return null;

        // 4. Metrics
        const bpm = this.calculateBPM(rrs);
        const rmssd = this.calculateRMSSD(rrs);

        return {
            bpm,
            rmssd,
            confidence: rrs.length / peaks.length
        };
    }

    private detrendSignal(data: number[]): number[] {
        const result = [];
        const window = 15; // smooth window

        for (let i = 0; i < data.length; i++) {
            // Simple Moving Average
            let sum = 0;
            let count = 0;
            for (let j = Math.max(0, i - window); j <= Math.min(data.length - 1, i + window); j++) {
                sum += data[j];
                count++;
            }
            const avg = sum / count;

            // Inverted for PPG (Blood Absorption = Less Light)
            // But we just want the AC component, so (Data - Avg) works
            result.push(data[i] - avg);
        }
        return result;
    }

    private findPeaksAdaptive(data: number[]): number[] {
        const peaks: number[] = [];

        // Calculate Signal Stats for Threshold
        let max = -Infinity;
        for (const v of data) if (v > max) max = v;

        // Threshold: Must be at least 30% of the max amplitude of this window
        // This makes it adaptive to signal strength
        const threshold = max * 0.3;

        // CORRECTION: minDistance adjusted for 15Hz sampling (was 20 for 60Hz)
        // 5 frames @ 15Hz = ~333ms (Max detectable HR: ~180 BPM)
        const minDistance = 5;

        let lastPeakTime = -minDistance;

        for (let i = 1; i < data.length - 1; i++) {
            // Local Maxima logic
            if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
                if (data[i] > threshold) {
                    if (i - lastPeakTime > minDistance) {
                        peaks.push(i);
                        lastPeakTime = i;
                    } else {
                        // If too close, keep the higher one
                        if (data[i] > data[peaks[peaks.length - 1]]) {
                            peaks.pop();
                            peaks.push(i);
                            lastPeakTime = i;
                        }
                    }
                }
            }
        }
        return peaks;
    }

    private calculateBPM(rrs: number[]): number {
        // Median Filter for robustness against outliers
        const sorted = [...rrs].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        return Math.round(60000 / median);
    }

    private calculateRMSSD(rrs: number[]): number {
        let sumSq = 0;
        for (let i = 1; i < rrs.length; i++) {
            const diff = rrs[i] - rrs[i - 1];
            sumSq += diff * diff;
        }
        return Math.sqrt(sumSq / (rrs.length - 1));
    }

    public reset() {
        this.buffer = [];
        this.timestamps = [];
    }
}

export const bioProcessor = new BioSignalProcessor();
