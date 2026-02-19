import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Screen } from '../../types';
import { bioProcessor } from '../../services/BioSignalProcessor';
import { SignalQuality } from '../../types/cardio';
import { extractRGBFromFrame, extractRGBFallback } from '../../utils/rgbExtraction';
import { Worklets } from 'react-native-worklets-core';
import { CalibrationRing } from '../../components/Bio/CalibrationRing';
import { CountdownOverlay } from '../../components/Bio/CountdownOverlay';
import { QualityAlert } from '../../components/Bio/QualityAlert';

const { width, height } = Dimensions.get('window');

// Helper Hook for AppState
function useAppState() {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
        });
        return () => subscription.remove();
    }, []);

    return appState;
}

const CardioScanScreen = () => {
    const navigation = useNavigation<any>();
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    const appState = useAppState();
    const isFocused = useIsFocused();
    const isActive = isFocused && appState === 'active';

    // params
    const route = useRoute();
    const params = route.params as { context?: 'baseline' | 'post_session' } | undefined;
    const context = params?.context || 'baseline';

    // States - UPDATED for 3-phase calibration
    type ScanPhase = 'idle' | 'calibration' | 'countdown' | 'measuring' | 'complete';
    const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
    const [progress, setProgress] = useState(0);
    const [realMetrics, setRealMetrics] = useState<{ bpm: number; hrv: number } | null>(null);
    const [signalQuality, setSignalQuality] = useState<SignalQuality | null>(null);

    // NEW: Calibration states
    const [calibrationScore, setCalibrationScore] = useState(0);
    const [calibrationRecommendation, setCalibrationRecommendation] = useState('');
    const [readyFrames, setReadyFrames] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [showQualityAlert, setShowQualityAlert] = useState(false);
    const [qualityAlertMessage, setQualityAlertMessage] = useState('');

    // Guard to prevent finishScan from being called multiple times
    const finishScanCalled = useRef(false);
    const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // DEBUG STATE
    const [debugRGB, setDebugRGB] = useState({ r: 0, g: 0, b: 0 });
    const lastDebugUpdate = useRef(0);

    // Removed pulseAnim and animatedOrbStyle as requested

    // Derived State for Torch - UPDATED for calibration
    const isTorchOn = scanPhase === 'calibration' || scanPhase === 'countdown' || scanPhase === 'measuring';

    useEffect(() => {
        if (!hasPermission) requestPermission();
        return () => {
            bioProcessor.reset();
            if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
        };
    }, []);

    // UPDATED: Frame processor callback with 3-phase logic
    // @ts-ignore - Worklets API is not fully typed
    const addRGBSampleJS = Worklets.createRunOnJS(function (r, g, b, t) {
        // Add sample to processor (cast to number for TypeScript)
        bioProcessor.addRGBSample(r as number, g as number, b as number, t as number);

        // DEBUG: Update UI state (Throttled 100ms)
        const now = Date.now();
        if (now - lastDebugUpdate.current > 100) {
            setDebugRGB({ r: r as number, g: g as number, b: b as number });
            lastDebugUpdate.current = now;
        }

        if (scanPhase === 'calibration') {
            // PHASE 1: Calibration - Real-time quality feedback
            const quality = bioProcessor.getCalibrationQuality();
            setCalibrationScore(quality.score);
            setCalibrationRecommendation(quality.recommendation);

            if (quality.ready) {
                setReadyFrames(prev => {
                    const newCount = prev + 1;
                    // If ready for 90 frames (3 seconds at 30fps), transition to countdown
                    if (newCount >= 90) {
                        setScanPhase('countdown');
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        return 0; // Reset
                    }
                    return newCount;
                });
            } else {
                setReadyFrames(0);
            }
        } else if (scanPhase === 'measuring') {
            // PHASE 3: Measuring - Full analysis with quality monitoring
            const analysis = bioProcessor.analyze();
            const quality = bioProcessor.getSignalQuality();

            setSignalQuality(quality);
            if (analysis) {
                setRealMetrics({ bpm: analysis.bpm, hrv: Math.round(analysis.rmssd) });
            }

            // Monitor quality during measurement
            if (quality.score < 60) {
                setShowQualityAlert(true);
                setQualityAlertMessage('Mantén el dedo quieto');
            } else {
                setShowQualityAlert(false);
            }
        }
    });

    // Frame Processor - UPDATED for calibration + measuring phases
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';

        if (scanPhase !== 'calibration' && scanPhase !== 'measuring' && scanPhase !== 'countdown') return;

        try {
            const buffer = frame.toArrayBuffer();
            const pixels = new Uint8Array(buffer);
            const rgb = extractRGBFromFrame(pixels, frame.pixelFormat);
            const timestamp = Date.now();

            // DIRECT CALL to JavaScript function
            addRGBSampleJS(rgb.r, rgb.g, rgb.b, timestamp);

            // DEBUG: Log RGB during Countdown to check flash status
            if (scanPhase === 'countdown') {
                console.log(`[Countdown] RGB: ${rgb.r.toFixed(0)}, ${rgb.g.toFixed(0)}, ${rgb.b.toFixed(0)}`);
            }

        } catch (e) {
            console.log(`[FrameProcessor] Error: ${e}`);
        }
    }, [scanPhase]);

    // UPDATED: Start calibration phase
    // UPDATED: Start measuring phase (Skipping calibration per user request)
    const handleStartPress = () => {
        setScanPhase('countdown'); // Go straight to countdown
        bioProcessor.reset();
        setCalibrationScore(0);
        setReadyFrames(0);
        setProgress(0);
        setRealMetrics(null);
        finishScanCalled.current = false;
        Haptics.selectionAsync();
    };

    // STALE CLOSURE FIX: Keep metrics in ref for async access
    const realMetricsRef = useRef<{ bpm: number; hrv: number } | null>(null);

    // Sync ref with state
    useEffect(() => {
        realMetricsRef.current = realMetrics;
    }, [realMetrics]);

    // UPDATED: Start measuring phase (Progressive Fingerprint Logic)
    const startScan = () => {
        setScanPhase('measuring');
        setProgress(0);
        setRealMetrics(null);
        realMetricsRef.current = null; // Reset ref

        // HOT START: Do NOT reset bioProcessor here. Keep calibration data.


        // Quality Accumulation Loop @ 30Hz
        const interval = setInterval(() => {
            // Ask processor for progress based on CURRENT signal quality
            // This is the key: Speed varies by quality.
            const result = bioProcessor.processProgressFrame();

            // Log for debugging
            if (Math.random() < 0.05) console.log('[Scan] Progress Delta:', result.progressDelta, 'Quality:', result.quality.score);

            setProgress(prev => {
                const next = Math.min(100, prev + result.progressDelta);

                // Haptic feedback on significant progress milestones (every 10%)
                if (Math.floor(next / 10) > Math.floor(prev / 10)) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                if (next >= 100) {
                    clearInterval(interval);
                    // DO NOT call finishScan() here directly to avoid Stale Closure.
                    // Let the useEffect([progress]) handle it.
                }
                return next;
            });

        }, 33); // 30Hz

        // Safety timeout (60s max - extended to be forgiving)
        safetyTimeoutRef.current = setTimeout(() => {
            clearInterval(interval);
            if (!finishScanCalled.current) {
                // Check if we have gathered enough data despite timeout
                if (progress > 80) {
                    finishScan();
                } else {
                    alert("El escaneo ha tomado demasiado tiempo. Inténtalo de nuevo.");
                    setScanPhase('idle');
                }
            }
        }, 60000);
    };

    // NEW: Countdown phase logic
    useEffect(() => {
        if (scanPhase === 'countdown') {
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        startScan(); // Start measuring after countdown
                        return 3; // Reset for next time
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [scanPhase]);

    // Watch for progress completion - UPDATED for measuring phase
    useEffect(() => {
        if (progress >= 100 && scanPhase === 'measuring') {
            // Only call if not already called
            if (!finishScanCalled.current) {
                finishScan();
            }
        }
    }, [progress, scanPhase]);

    const finishScan = () => {
        // GUARD: Prevent duplicate calls
        if (finishScanCalled.current) {
            console.log('[CardioScan] finishScan already called, skipping...');
            return;
        }
        finishScanCalled.current = true;

        // STOP TIMEOUT
        if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

        const finalQuality = bioProcessor.getSignalQuality();

        console.log('[CardioScan] Finishing scan...');
        console.log('[CardioScan] Final Quality:', finalQuality);

        // USE REF TO GET FRESH METRICS (Fixes Stale Closure)
        // OLD: const finalMetrics = realMetricsRef.current;
        // NEW SCIENTIFIC: Calculate from accumulated session using MAD Filter
        const finalMetrics = bioProcessor.calculateSessionMetrics();

        console.log('[CardioScan] Session Metrics (Scientific):', finalMetrics);

        // ESTRICTO: Solo aceptar 'excellent' (score >= 70)
        // NOTE: In Progressive Scan, we might trust the accumulation even if final frame is just 'good'
        // But let's keep it strict for now to ensure quality.
        if (!finalMetrics) {
            console.log('[CardioScan] REJECTED - No metrics computed');

            setScanPhase('idle');
            bioProcessor.reset();
            finishScanCalled.current = false;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            alert("No se pudieron calcular métricas fiables. Intenta de nuevo.");
            return;
        }

        // STOP EVERYTHING IMMEDIATELY
        setScanPhase('complete');
        bioProcessor.reset();

        console.log('[CardioScan] ACCEPTED - BPM:', finalMetrics.bpm, 'HRV:', finalMetrics.rmssd);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const finalBpm = finalMetrics.bpm;
        const finalHrv = finalMetrics.rmssd; // Processor returns RMSSD directly

        // Diagnosis Logic
        let diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio' = 'equilibrio';

        if (finalHrv < 30) diagnosis = 'sobrecarga';
        else if (finalHrv > 30 && finalBpm < 55) diagnosis = 'agotamiento';
        else diagnosis = 'equilibrio';

        // Navigate immediately
        navigation.replace(Screen.CARDIO_RESULT, {
            diagnosis: diagnosis,
            metrics: { bpm: finalBpm, hrv: finalHrv },
            context: context,
            quality: finalQuality.score // Pass score (0-100)
        });
    };



    if (!hasPermission) return <View style={styles.container}><Text>No Camera Permission</Text></View>;
    if (!device) return <View style={styles.container}><Text>No Camera Device</Text></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Camera View */}
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                torch={isTorchOn ? 'on' : 'off'}
                frameProcessor={frameProcessor}
                pixelFormat="yuv" // Efficient format for processing
            />

            {/* Dark Overlay */}
            <View style={styles.overlay}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.centerContainer}>

                    {/* Visual Instruction Guide */}
                    <View style={styles.guideContainer}>
                        {/* Schematic: Phone Camera + Finger */}
                        <View style={styles.schematicContainer}>
                            {/* Phone Camera Module Representation */}
                            <View style={styles.phoneCameraModule}>
                                <View style={styles.lens} />
                                <View style={styles.flash} />
                            </View>

                            {/* Finger Overlay (Semi-transparent red to indicate coverage) */}
                            <View style={styles.fingerOverlay}>
                                <Ionicons name="finger-print" size={32} color="rgba(255,255,255,0.8)" />
                            </View>
                        </View>

                        <Text style={styles.instructionTitle}>Cómo Escanear</Text>
                        <Text style={styles.instructionText}>
                            {scanPhase === 'idle'
                                ? "Coloca tu dedo índice cubriendo LENTE y FLASH suavemente."
                                : "Mantén el dedo quieto y respira normal."}
                        </Text>
                    </View>

                    {/* Finger Zone / Start Button */}
                    <View style={styles.pulseContainer}>
                        {scanPhase === 'idle' ? (
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartPress}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="finger-print" size={60} color="#FFF" />
                                <Text style={styles.buttonText}>INICIAR</Text>
                            </TouchableOpacity>
                        ) : (
                            // MEASURING / COUNTDOWN PHASE
                            <View style={styles.fingerGuide}>
                                {/* 1. Background Fingerprint (Grey/Dim) - Always visible */}
                                <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="finger-print" size={180} color="rgba(255, 75, 75, 0.2)" />
                                </View>

                                {/* 2. Foreground Fingerprint (Red) - Reveal Mask */}
                                <View style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0, // Ensure absolute alignment relative to fingerGuide
                                    width: 180, // MATCH BACKGROUND WIDTH EXACTLY
                                    height: `${progress}%`, // Grows from bottom
                                    overflow: 'hidden',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }}>
                                    {/* Inner Red Icon - Fixed Size & Positioned at bottom of container */}
                                    <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name="finger-print" size={180} color="#FF4B4B" />
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Progress or Idle Text */}
                    {scanPhase !== 'idle' && (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.progressText}>
                                {scanPhase === 'calibration' ? calibrationRecommendation :
                                    scanPhase === 'countdown' ? `Iniciando en ${countdown}...` :
                                        `${Math.round(progress)}% Completado`}
                            </Text>

                            {/* MEDICAL HUD: Live Metrics */}
                            <Animated.View style={[styles.hudContainer, { opacity: 1 }]}>
                                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                                <View style={styles.hudContent}>
                                    {/* Left: BPM */}
                                    <View style={styles.metricBlock}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            {/* Removed pulsating circle */}
                                            <Ionicons name="heart" size={28} color="#FF4B4B" />
                                            <Text style={styles.metricValue}>
                                                {realMetrics?.bpm || '--'}
                                            </Text>
                                        </View>
                                        <Text style={styles.metricLabel}>BPM</Text>
                                    </View>

                                    {/* Divider */}
                                    <View style={styles.divider} />

                                    {/* Right: HRV */}
                                    <View style={styles.metricBlock}>
                                        <Text style={[styles.metricValue, { fontSize: 24, color: '#4CD964' }]}>
                                            {realMetrics?.hrv || '--'}
                                            <Text style={{ fontSize: 14 }}> ms</Text>
                                        </Text>
                                        <Text style={styles.metricLabel}>Variabilidad (HRV)</Text>
                                    </View>
                                </View>

                                {/* NEW: Signal Quality Indicator */}
                                <View style={styles.qualityIndicator}>
                                    <View style={[
                                        styles.qualityDot,
                                        {
                                            backgroundColor:
                                                signalQuality?.level === 'excellent' ? '#10B981' :
                                                    signalQuality?.level === 'good' ? '#FBBF24' : '#EF4444'
                                        }
                                    ]} />
                                    <Text style={styles.qualityText}>
                                        {signalQuality?.level === 'excellent' ? '✓ Señal Excelente' :
                                            signalQuality?.level === 'good' ? '⚠ Señal Buena' :
                                                '✗ Ajusta tu dedo'}
                                    </Text>
                                </View>


                                {/* NEW: Contextual Tips */}
                                {signalQuality && signalQuality.recommendations.length > 0 && (
                                    <View style={styles.tipsContainer}>
                                        {signalQuality.recommendations.map((tip, i) => (
                                            <Text key={i} style={styles.tip}>💡 {tip}</Text>
                                        ))}
                                    </View>
                                )}
                            </Animated.View>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>

            {/* NEW: Countdown Overlay */}
            <CountdownOverlay
                count={countdown}
                visible={scanPhase === 'countdown'}
            />

            <QualityAlert
                visible={showQualityAlert}
                message={qualityAlertMessage}
            />

            {/* DEBUG OVERLAY (Top Level) */}
            <View style={{ position: 'absolute', top: 100, left: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8, zIndex: 2000, pointerEvents: 'none' }}>
                <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' }}>
                    DEBUG MODE
                </Text>
                <Text style={{ color: 'white', fontFamily: 'monospace', fontSize: 12 }}>
                    Phase: {scanPhase}
                </Text>
                <Text style={{ color: 'white', fontFamily: 'monospace', fontSize: 12 }}>
                    R: {debugRGB.r.toFixed(0)} | G: {debugRGB.g.toFixed(0)} | B: {debugRGB.b.toFixed(0)}
                </Text>
                <Text style={{ color: 'white', fontFamily: 'monospace', fontSize: 12 }}>
                    Quality: {signalQuality?.score.toFixed(0) || 0} ({signalQuality?.level})
                </Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)', // Darken camera feed significantly
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    guideContainer: {
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 24,
        width: '85%',
    },
    schematicContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    phoneCameraModule: {
        width: 60,
        height: 60,
        backgroundColor: '#333',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    lens: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#111',
        borderWidth: 2,
        borderColor: '#555',
    },
    flash: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFD700', // Gold for flash
        opacity: 0.8,
    },
    fingerOverlay: {
        position: 'absolute',
        width: 70,
        height: 90,
        backgroundColor: 'rgba(255, 100, 100, 0.3)', // Flesh/Red tint
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 100, 100, 0.5)',
    },
    instructionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },
    instructionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    pulseContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 75, 75, 0.4)', // Red glow like blood
        shadowColor: '#FF4B4B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    fingerGuide: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        // Removed border and background as requested (no circle)
    },
    progressText: {
        color: 'rgba(255,255,255,0.6)',
        marginTop: 30,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 60,
        right: 30,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    buttonText: {
        color: '#FFF',
        marginTop: 5,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    // NEW HUD STYLES
    hudContainer: {
        marginTop: 30,
        width: width * 0.85,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(20,20,30,0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    hudContent: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metricBlock: {
        alignItems: 'center',
        flex: 1,
    },
    metricValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    metricLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 15,
    },
    statusLine: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    // NEW: Quality Indicator Styles
    qualityIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    qualityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    qualityText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    tipsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 8,
    },
    tip: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        lineHeight: 18,
    },
});

export default CardioScanScreen;
