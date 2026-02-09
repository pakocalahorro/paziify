import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { savePlaybackPosition, getPlaybackPosition } from '../services/playbackStorage';
import audioEngineService from '../services/AudioEngineService';
import { useApp } from './AppContext';

interface Track {
    id: string;
    title: string;
    author: string;
    cover: any; // ImageSource
    audioUrl: string;
    duration: number;
    isInfinite?: boolean; // New
}

interface AudioPlayerContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentTrack: Track | null;
    position: number;
    duration: number;
    isBuffering: boolean;
    loadTrack: (track: Track, initialPosition?: number) => Promise<void>;
    loadBinauralLayer: (url: string | null) => Promise<void>; // New
    play: () => Promise<void>;
    pause: () => Promise<void>;
    seekTo: (positionMillis: number) => Promise<void>;
    skipForward: () => Promise<void>;
    skipBackward: () => Promise<void>;
    closePlayer: () => Promise<void>;
    setExternalAudioActive: (active: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

const NIGHT_AMBIENCE_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/night_cricket_ambience.mp3';
const DAY_AMBIENCE_URL = 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/mountains_rivers_water.mp3';

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isNightMode, user } = useApp();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [secondarySound, setSecondarySound] = useState<Audio.Sound | null>(null); // New: Binaural Layer
    const [ambienceSound, setAmbienceSound] = useState<Audio.Sound | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    const [isExternalAudioActive, setExternalAudioActive] = useState(false);

    const soundRef = useRef<Audio.Sound | null>(null);
    const secondaryRef = useRef<Audio.Sound | null>(null);
    const ambienceRef = useRef<Audio.Sound | null>(null);
    const isLoadingRef = useRef(false); // New: Track loading state to prevent ambience flash
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        setupAudioMode();
        return () => {
            isMounted.current = false;
            if (soundRef.current) soundRef.current.unloadAsync();
            if (secondaryRef.current) secondaryRef.current.unloadAsync();
            if (ambienceRef.current) ambienceRef.current.unloadAsync();
        };
    }, []);

    useEffect(() => { soundRef.current = sound; }, [sound]);
    useEffect(() => { secondaryRef.current = secondarySound; }, [secondarySound]);
    useEffect(() => { ambienceRef.current = ambienceSound; }, [ambienceSound]);

    const activeUrlRef = useRef<string | null>(null);

    // Existing Ambience Logic...
    useEffect(() => {
        let isCurrentEffect = true;
        const manageAmbience = async () => {
            // Only play ambience if:
            // 1. No main track is playing
            // 2. No external audio (meditation) is active
            // 3. We are NOT currently loading a track (prevent gap race condition)
            // 4. We are NOT buffering (prevent noise during buffer)
            const shouldPlayAmbience = !isPlaying && !isExternalAudioActive && !isLoadingRef.current && !isBuffering;
            const targetUrl = isNightMode ? NIGHT_AMBIENCE_URL : DAY_AMBIENCE_URL;

            if (activeUrlRef.current && activeUrlRef.current !== targetUrl) {
                if (ambienceRef.current) {
                    try {
                        await ambienceRef.current.stopAsync();
                        await ambienceRef.current.unloadAsync();
                    } catch (e) { console.log('Error unloading previous ambience:', e); }
                    if (isCurrentEffect) setAmbienceSound(null);
                }
                activeUrlRef.current = null;
            }

            if (!isCurrentEffect) return;

            if (shouldPlayAmbience) {
                if (!ambienceRef.current && !activeUrlRef.current) {
                    try {
                        const { sound: newAmbience } = await Audio.Sound.createAsync(
                            { uri: targetUrl },
                            { shouldPlay: true, isLooping: true, volume: 0.3 }
                        );
                        if (isCurrentEffect) {
                            setAmbienceSound(newAmbience);
                            activeUrlRef.current = targetUrl;
                        } else {
                            await newAmbience.unloadAsync();
                        }
                    } catch (error) { console.log('Error loading ambience:', error); }
                } else if (ambienceRef.current) {
                    try {
                        const status = await ambienceRef.current.getStatusAsync();
                        if (status.isLoaded && !status.isPlaying) await ambienceRef.current.playAsync();
                    } catch (e) { }
                }
            } else {
                if (ambienceRef.current) {
                    try {
                        const status = await ambienceRef.current.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) await ambienceRef.current.pauseAsync();
                    } catch (e) { }
                }
            }
        };
        manageAmbience();
        return () => { isCurrentEffect = false; };
    }, [isNightMode, isPlaying, isExternalAudioActive, ambienceSound, isBuffering]);

    // Auto-save position (only for regular tracks, not infinite ones ideally, but harmless)
    useEffect(() => {
        if (isPlaying && currentTrack) {
            const interval = setInterval(() => {
                if (position > 0 && duration > 0) {
                    savePlaybackPosition(currentTrack.id, position, duration);
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, position, duration, currentTrack]);

    const setupAudioMode = async () => {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                allowsRecordingIOS: false,
            });
        } catch (error) { console.error('Error setting audio mode:', error); }
    };

    const loadTrack = async (track: Track, initialPosition: number = 0) => {
        if (currentTrack?.id === track.id && sound) return;

        isLoadingRef.current = true; // Mark as loading start
        await audioEngineService.pauseAll();

        // Explicitly stop ambience to be safe
        if (ambienceRef.current) {
            try {
                await ambienceRef.current.pauseAsync();
            } catch (e) { }
        }

        try {
            if (sound) await sound.unloadAsync();
            if (secondarySound) {
                await secondarySound.unloadAsync(); // Unload binaural if changing track
                setSecondarySound(null);
            }

            setCurrentTrack(track);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);

            const { sound: newSound, status } = await Audio.Sound.createAsync(
                { uri: track.audioUrl },
                { shouldPlay: false, positionMillis: initialPosition, isLooping: !!track.isInfinite },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error loading track:', error);
        } finally {
            isLoadingRef.current = false; // Mark as loading end
        }
    };

    // New: Load Layer for Mixing
    const loadBinauralLayer = async (url: string | null) => {
        if (secondarySound) {
            await secondarySound.unloadAsync();
            setSecondarySound(null);
        }

        if (!url) return;

        try {
            const { sound: newLayer } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: isPlaying, isLooping: true, volume: 0.5 }
            );
            setSecondarySound(newLayer);
        } catch (error) { console.error('Error loading binaural layer:', error); }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!isMounted.current) return;
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            setIsBuffering(status.isBuffering);
            if (status.didJustFinish && !status.isLooping) {
                setIsPlaying(false);
                setPosition(0);
                if (currentTrack) savePlaybackPosition(currentTrack.id, 0, status.durationMillis || 0);
            }
        }
    };

    const play = async () => {
        if (sound) {
            await audioEngineService.pauseAll();
            await sound.playAsync();
            if (secondarySound) await secondarySound.playAsync(); // Play layer
        }
    };

    const pause = async () => {
        if (sound) {
            await sound.pauseAsync();
            if (secondarySound) await secondarySound.pauseAsync(); // Pause layer
        }
    };

    const seekTo = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    const skipForward = async () => {
        if (sound) {
            const newPos = Math.min(position + 15000, duration);
            await sound.setPositionAsync(newPos);
        }
    };

    const skipBackward = async () => {
        if (sound) {
            const newPos = Math.max(position - 15000, 0);
            await sound.setPositionAsync(newPos);
        }
    };

    const closePlayer = async () => {
        if (sound) await sound.unloadAsync();
        if (secondarySound) await secondarySound.unloadAsync(); // Cleanup layer
        setSound(null);
        setSecondarySound(null);
        setCurrentTrack(null);
        setIsPlaying(false);
        setPosition(0);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                sound,
                isPlaying,
                currentTrack,
                position,
                duration,
                isBuffering,
                loadTrack,
                loadBinauralLayer,
                play,
                pause,
                seekTo,
                skipForward,
                skipBackward,
                closePlayer,
                setExternalAudioActive,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (context === undefined) {
        throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
    }
    return context;
};
