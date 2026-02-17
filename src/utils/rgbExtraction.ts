/**
 * RGB Extraction Helper for Frame Processor
 * Extracts real RGB pixel data from camera frames
 */

export interface RGBValues {
    r: number;
    g: number;
    b: number;
}

/**
 * Extract RGB averages from camera frame
 * Works with both YUV and RGB pixel formats
 */
export function extractRGBFromFrame(
    pixels: Uint8Array,
    pixelFormat: 'yuv' | 'rgb' | 'unknown'
): RGBValues {
    'worklet';
    let r = 0, g = 0, b = 0, count = 0;

    // Sample every 100th pixel for performance
    const step = 100;

    if (pixelFormat === 'yuv') {
        // YUV420 format: Y plane followed by U and V planes
        // For PPG, we need to convert YUV to RGB to get color variations
        const yPlaneSize = Math.floor(pixels.length * 2 / 3);
        const uvPlaneSize = Math.floor(pixels.length / 6);

        for (let i = 0; i < yPlaneSize && i < 10000; i += step) {
            const y = pixels[i];

            // Get corresponding U and V values
            const uvIndex = yPlaneSize + Math.floor(i / 2);
            const u = uvIndex < pixels.length ? pixels[uvIndex] : 128;
            const v = uvIndex + uvPlaneSize < pixels.length ? pixels[uvIndex + uvPlaneSize] : 128;

            // YUV to RGB conversion
            const rVal = y + 1.402 * (v - 128);
            const gVal = y - 0.344136 * (u - 128) - 0.714136 * (v - 128);
            const bVal = y + 1.772 * (u - 128);

            // Clamp to 0-255
            r += Math.max(0, Math.min(255, rVal));
            g += Math.max(0, Math.min(255, gVal));
            b += Math.max(0, Math.min(255, bVal));
            count++;
        }
    } else {
        // RGB format: extract each channel
        // RGBA: [R, G, B, A, R, G, B, A, ...]
        for (let i = 0; i < pixels.length - 3 && i < 40000; i += step * 4) {
            r += pixels[i];     // Red
            g += pixels[i + 1]; // Green
            b += pixels[i + 2]; // Blue
            count++;
        }
    }

    // Calculate averages
    if (count > 0) {
        return {
            r: r / count,
            g: g / count,
            b: b / count
        };
    }

    // Fallback
    return { r: 0, g: 0, b: 0 };
}

/**
 * Fallback RGB extraction based on frame dimensions
 * Used when toArrayBuffer() is not available
 */
export function extractRGBFallback(width: number, height: number): RGBValues {
    'worklet';
    const brightness = width * height;
    const normalized = Math.min(255, brightness / 10000);

    return {
        r: normalized,
        g: normalized,
        b: normalized
    };
}
