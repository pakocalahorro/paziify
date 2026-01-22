import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { IMAGES } from '../../constants/images';
import { useApp } from '../../context/AppContext';
import BreathingOrb from '../../components/BreathingOrb';

const { width, height } = Dimensions.get('window');

type BreathingTimerScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.BREATHING_TIMER
>;

type BreathingTimerScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.BREATHING_TIMER
>;

interface Props {
    navigation: BreathingTimerScreenNavigationProp;
    route: BreathingTimerScreenRouteProp;
}

const SoundSlider = ({ label, icon, value, isLocked, onValueChange, color = '#2DD4BF' }: any) => {
    return (
        <View style={styles.sliderRow}>
            <View style={styles.sliderHeader}>
                <View style={styles.sliderLabelRow}>
                    <Ionicons name={icon} size={18} color={isLocked ? 'rgba(255,255,255,0.3)' : color} style={styles.sliderIcon} />
                    <Text style={[styles.sliderLabel, isLocked && { color: 'rgba(255,255,255,0.3)' }]}>{label}</Text>
                </View>
                <Text style={[styles.sliderValue, isLocked && { color: 'rgba(255,255,255,0.2)' }]}>{isLocked ? '' : `${Math.round(value * 100)}%`}</Text>
            </View>
            <TouchableOpacity
                activeOpacity={isLocked ? 0.7 : 1}
                onPress={isLocked ? onValueChange : undefined}
                style={styles.sliderTrackContainer}
            >
                <View style={styles.sliderTrack}>
                    <View style={[styles.sliderFill, { width: `${value * 100}%`, backgroundColor: isLocked ? 'rgba(255,255,255,0.1)' : color }]} />
                    {!isLocked && <View style={[styles.sliderThumb, { left: `${value * 100}%` }]} />}
                </View>
                {isLocked && (
                    <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.4)" />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const BreathingTimer: React.FC<Props> = ({ navigation }) => {
    const { userState } = useApp();
    const [timeLeft, setTimeLeft] = useState(899); // 14:59 as per mockup
    const [isActive, setIsActive] = useState(true);
    const [volumes, setVolumes] = useState({ binaural: 0.4, rain: 0.75, bowls: 0.25 });

    const isPremium = userState.isPlusMember;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            navigation.navigate(Screen.SESSION_END);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        setIsActive(!isActive);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePremiumClick = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        navigation.navigate(Screen.PAYWALL);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground source={{ uri: IMAGES.LEAF_BG }} style={styles.background} imageStyle={{ opacity: 0.6 }}>
                <LinearGradient colors={['rgba(10,14,26,0.4)', 'rgba(10,14,26,0.9)']} style={styles.gradient}>
                    <SafeAreaView style={styles.flex}>

                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                                <Ionicons name="chevron-down" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <View style={styles.headerTitle}>
                                <Text style={styles.modeLabel}>MODO ENFOQUE</Text>
                                <View style={styles.frequencyRow}>
                                    <Ionicons name="pulse" size={12} color="#2DD4BF" />
                                    <Text style={styles.freqText}>432Hz</Text>
                                </View>
                            </View>
                            <View style={{ width: 44 }} />
                        </View>

                        {/* Central Content */}
                        <View style={styles.timerContainer}>
                            <Text style={styles.inhaleText}>Inhala...</Text>

                            <View style={styles.orbWrapper}>
                                <View style={styles.orbCircle}>
                                    <Text style={styles.timerBig}>{formatTime(timeLeft)}</Text>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: '40%' }]} />
                                    </View>
                                </View>
                                <View style={styles.breathInstruction}>
                                    <Text style={styles.instructionText}>Mantén 4 segundos</Text>
                                </View>
                            </View>
                        </View>

                        {/* Mixer Panel */}
                        <View style={styles.mixerPanel}>
                            <View style={styles.pullIndicator} />

                            <SoundSlider
                                label="Ondas Binaurales"
                                icon="reorder-three"
                                value={volumes.binaural}
                                isLocked={!isPremium}
                                onValueChange={handlePremiumClick}
                            />
                            <SoundSlider
                                label="Lluvia"
                                icon="water"
                                value={volumes.rain}
                                isLocked={!isPremium}
                                onValueChange={handlePremiumClick}
                            />
                            <SoundSlider
                                label="Campanas Tibetanas"
                                icon="notifications"
                                value={volumes.bowls}
                                isLocked={!isPremium}
                                onValueChange={handlePremiumClick}
                            />

                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.secondaryCircleBtn}>
                                    <Ionicons name="close" size={20} color="#FFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.mainPlayBtn} onPress={toggleTimer}>
                                    <Ionicons name={isActive ? "pause" : "play"} size={30} color="#FFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.secondaryCircleBtn}>
                                    <Ionicons name="volume-high" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#070A15' },
    background: { flex: 1 },
    gradient: { flex: 1 },
    flex: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { alignItems: 'center' },
    modeLabel: { color: '#2DD4BF', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
    frequencyRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    freqText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700' },

    timerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
    inhaleText: { fontSize: 32, color: 'rgba(255,255,255,0.7)', fontWeight: '300', marginBottom: 40 },

    orbWrapper: { alignItems: 'center', justifyContent: 'center' },
    orbCircle: { width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    timerBig: { fontSize: 72, color: '#FFF', fontWeight: '200', letterSpacing: 4 },
    progressTrack: { width: 60, height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 10 },
    progressFill: { height: '100%', backgroundColor: '#2DD4BF', borderRadius: 2 },

    breathInstruction: { marginTop: 80 },
    instructionText: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '500' },

    mixerPanel: { backgroundColor: 'rgba(255,255,255,0.04)', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingBottom: Platform.OS === 'ios' ? 40 : 30 },
    pullIndicator: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, alignSelf: 'center', marginBottom: 25 },

    sliderRow: { marginBottom: 22 },
    sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sliderLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sliderIcon: { opacity: 0.8 },
    sliderLabel: { color: '#FFF', fontSize: 15, fontWeight: '500' },
    sliderValue: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
    sliderTrackContainer: { height: 20, justifyContent: 'center' },
    sliderTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
    sliderFill: { height: '100%', borderRadius: 2 },
    sliderThumb: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFF', top: -5.5 },
    lockOverlay: { position: 'absolute', right: 0, top: -8 },

    actionRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 },
    secondaryCircleBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    mainPlayBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2DD4BF', justifyContent: 'center', alignItems: 'center', shadowColor: '#2DD4BF', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
});

export default BreathingTimer;
