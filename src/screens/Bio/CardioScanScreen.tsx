import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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

    // Lifecycle & Active State
    const appState = useAppState();
    const isFocused = useIsFocused();
    const isActive = isFocused && appState === 'active';

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

    const pulseAnim = useSharedValue(1);

    // Derived State for Torch - UPDATED for calibration
    const isTorchOn = scanPhase === 'calibration' || scanPhase === 'countdown' || scanPhase === 'measuring';

    useEffect(() => {
        if (!hasPermission) requestPermission();
        return () => {
            bioProcessor.reset();
        };
    }, []);

    // UPDATED: Frame processor callback with 3-phase logic
    // @ts-ignore - Worklets API is not fully typed
    const addRGBSampleJS = Worklets.createRunOnJS(function (r, g, b, t) {
        // Add sample to processor (cast to number for TypeScript)
        bioProcessor.addRGBSample(r as number, g as number, b as number, t as number);

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
        // Process frames during calibration and measuring phases
        if (scanPhase !== 'calibration' && scanPhase !== 'measuring') return;

        try {
            const buffer = frame.toArrayBuffer();
            const pixels = new Uint8Array(buffer);
            const rgb = extractRGBFromFrame(pixels, frame.pixelFormat);
            const timestamp = Date.now();

            // DIRECT CALL to JavaScript function (no shared values needed)
            addRGBSampleJS(rgb.r, rgb.g, rgb.b, timestamp);

            // Debug log every 30 frames (~1 second)
            if (Math.random() < 0.033) {
                console.log(`[FrameProcessor] RGB: r=${rgb.r.toFixed(1)}, g=${rgb.g.toFixed(1)}, b=${rgb.b.toFixed(1)}, t=${timestamp}`);
            }
        } catch (e) {
            const rgb = extractRGBFallback(frame.width, frame.height);
            const timestamp = Date.now();
            addRGBSampleJS(rgb.r, rgb.g, rgb.b, timestamp);

            console.log(`[FrameProcessor] FALLBACK - Error: ${e}`);
        }
    }, [scanPhase]);



    // UPDATED: Start calibration phase when user presses button
    const handleStartPress = () => {
        setScanPhase('calibration');
        bioProcessor.reset();
        setCalibrationScore(0);
        setReadyFrames(0);
        setProgress(0);
        setRealMetrics(null);
        finishScanCalled.current = false; // Reset guard for new scan
    };

    // UPDATED: Start measuring phase (called after countdown)
    const startScan = () => {
        setScanPhase('measuring');
        setProgress(0);
        setRealMetrics(null);

        // CRITICAL FIX: Reset buffers to start measurement with clean data
        bioProcessor.reset();

        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
                withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
            ),
            -1,
            true
        );

        // UI Progress Loop @ 30Hz
        let localProgress = 0;
        const interval = setInterval(() => {
            localProgress += 0.44; // 15s total (0.44 * 225 ≈ 100%)
            setProgress(Math.floor(localProgress));

            // Haptic Feedback
            if (Math.floor(localProgress) % 15 === 0) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            if (localProgress >= 100) {
                clearInterval(interval);
            }
        }, 33); // 30Hz = 33ms

        // Safety timeout (15s + 1s buffer)
        setTimeout(() => {
            clearInterval(interval);
            if (progress < 100) finishScan();
        }, 16000);
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
            finishScan();
        }
    }, [progress, scanPhase]);

    const finishScan = () => {
        // GUARD: Prevent duplicate calls
        if (finishScanCalled.current) {
            console.log('[CardioScan] finishScan already called, skipping...');
            return;
        }
        finishScanCalled.current = true;

        const finalQuality = bioProcessor.getSignalQuality();

        console.log('[CardioScan] Finishing scan...');
        console.log('[CardioScan] Final Quality:', finalQuality);
        console.log('[CardioScan] Real Metrics:', realMetrics);

        // ESTRICTO: Solo aceptar 'excellent' (score >= 70)
        if (!realMetrics || !finalQuality || finalQuality.level !== 'excellent') {
            console.log('[CardioScan] REJECTED - Reason:',
                !realMetrics ? 'No metrics' :
                    !finalQuality ? 'No quality data' :
                        `Quality ${finalQuality.level} (need excellent)`);

            setScanPhase('idle');
            bioProcessor.reset();
            finishScanCalled.current = false; // Reset guard for next scan

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // Mensaje específico con recomendaciones
            const tips = finalQuality?.recommendations.join('\n• ') || '';
            const message = `❌ Escaneo Inválido\n\nCalidad: ${finalQuality?.level || 'desconocida'}\n\n${tips ? '💡 Recomendaciones:\n• ' + tips : 'Intenta de nuevo cubriendo completamente la cámara y el flash.'}`;

            alert(message);

            return;
        }

        console.log('[CardioScan] ACCEPTED - BPM:', realMetrics.bpm, 'HRV:', realMetrics.hrv);

        setScanPhase('complete');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const finalBpm = realMetrics.bpm;
        const finalHrv = realMetrics.hrv;

        // Diagnosis Logic
        let diagnosis: 'sobrecarga' | 'agotamiento' | 'equilibrio' = 'equilibrio';

        if (finalHrv < 30) diagnosis = 'sobrecarga';
        else if (finalHrv > 30 && finalBpm < 55) diagnosis = 'agotamiento';
        else diagnosis = 'equilibrio';

        setTimeout(() => {
            navigation.replace(Screen.CARDIO_RESULT, {
                diagnosis: diagnosis,
                metrics: { bpm: finalBpm, hrv: finalHrv }
            });
            finishScanCalled.current = false; // Reset guard after navigation
        }, 500);
    };

    const animatedOrbStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }]
    }));

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
                        ) : scanPhase === 'calibration' ? (
                            <>
                                <CalibrationRing
                                    score={calibrationScore}
                                    ready={readyFrames >= 90}
                                />
                                <View style={styles.fingerGuide}>
                                    <Ionicons name="finger-print" size={40} color="#FF4B4B" />
                                </View>
                            </>
                        ) : (
                            <>
                                <Animated.View style={[styles.pulseCircle, animatedOrbStyle]} />
                                <View style={styles.fingerGuide}>
                                    <Ionicons name="finger-print" size={40} color="#FF4B4B" />
                                </View>
                            </>
                        )}
                    </View>

                    {/* Progress or Idle Text */}
                    {scanPhase !== 'idle' && (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.progressText}>
                                {scanPhase === 'calibration' ? calibrationRecommendation :
                                    scanPhase === 'countdown' ? `Iniciando en ${countdown}...` :
                                        `${progress}% Completado`}
                            </Text>

                            {/* MEDICAL HUD: Live Metrics */}
                            <Animated.View style={[styles.hudContainer, { opacity: 1 }]}>
                                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                                <View style={styles.hudContent}>
                                    {/* Left: BPM */}
                                    <View style={styles.metricBlock}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <Animated.View style={animatedOrbStyle}>
                                                <Ionicons name="heart" size={28} color="#FF4B4B" />
                                            </Animated.View>
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

            {/* NEW: Quality Alert */}
            <QualityAlert
                visible={showQualityAlert}
                message={qualityAlertMessage}
            />
        </View>
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
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
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
