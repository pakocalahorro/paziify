
console.log("=== CTO VALIDATION START ===");

// INLINED CLASS FOR ISOLATION TESTING
class BioSignalProcessor {
    // Configuration for JS Loop (15Hz ~ 66ms)
    private static SAMPLE_RATE = 15;
    private static WINDOW_SIZE = 75; // 5s buffer @ 15Hz

    // State
    private buffer: number[] = [];
    private timestamps: number[] = [];

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
        const processed = this.detrendSignal(this.buffer);

        // 2. Adaptive Peak Detection
        const peaks = this.findPeaksAdaptive(processed);

        if (peaks.length < 2) return null;

        // 3. Calculate RR Intervals
        const rrs: number[] = [];
        for (let i = 1; i < peaks.length; i++) {
            const t1 = this.timestamps[peaks[i]];
            const t0 = this.timestamps[peaks[i - 1]];
            const r = t1 - t0;
            // Filters: Human heart range [300ms (200bpm) - 1500ms (40bpm)]
            if (r > 300 && r < 1500) {
                rrs.push(r);
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
        const window = 15;
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            let count = 0;
            for (let j = Math.max(0, i - window); j <= Math.min(data.length - 1, i + window); j++) {
                sum += data[j];
                count++;
            }
            const avg = sum / count;
            result.push(data[i] - avg);
        }
        return result;
    }

    private findPeaksAdaptive(data: number[]): number[] {
        const peaks: number[] = [];
        let max = -Infinity;
        for (const v of data) if (v > max) max = v;
        const threshold = max * 0.3;
        const minDistance = 5; // frames (~330ms at 15Hz? No, 5 frames @ 15Hz is 330ms)

        let lastPeakTime = -minDistance;

        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
                if (data[i] > threshold) {
                    if (i - lastPeakTime > minDistance) {
                        peaks.push(i);
                        lastPeakTime = i;
                    } else {
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
}

// Mock the processor
const processor = new BioSignalProcessor();
console.log("Simulating 15Hz Signal (70 BPM Sine Wave + Breathing)...");


// Simulate 10 seconds of data at 15Hz (Sample Rate)
const SAMPLE_RATE = 15;
const DURATION_SEC = 10;
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION_SEC;
const INTERVAL_MS = 1000 / SAMPLE_RATE;

let startTime = Date.now();

for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const time = startTime + (i * INTERVAL_MS);

    // Exact same formula as in CardioScanScreen.tsx (Native OR Fallback)
    const breath = Math.sin(time / 2000) * 15;
    const heart = Math.sin(time / (800 + Math.sin(time / 300) * 5)) * 40;
    const noise = (Math.random() - 0.5) * 8;
    const signal = 120 + breath + heart + noise;

    processor.addSample(signal, time);

    // Analyze every few samples (like UI loop)
    if (i % 5 === 0) { // check every ~300ms
        const result = processor.analyze();
        if (result) {
            console.log(`[T=${(i * INTERVAL_MS / 1000).toFixed(1)}s] SUCCESS -> BPM: ${result.bpm} | HRV: ${result.rmssd.toFixed(1)} | Conf: ${(result.confidence * 100).toFixed(0)}%`);
        } else {
            // console.log(`[T=${(i*INTERVAL_MS/1000).toFixed(1)}s] Gathering data...`);
        }
    }
}
console.log("=== CTO VALIDATION END ===");
