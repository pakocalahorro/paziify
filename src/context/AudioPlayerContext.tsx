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
}

interface AudioPlayerContextType {
    sound: Audio.Sound | null;
    isPlaying: boolean;
    currentTrack: Track | null;
    position: number;
    duration: number;
    isBuffering: boolean;
    loadTrack: (track: Track, initialPosition?: number) => Promise<void>;
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
    const { isNightMode, user } = useApp(); // Access night mode and user auth state
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [ambienceSound, setAmbienceSound] = useState<Audio.Sound | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    // State to track if meditation engine is active (managed by screens)
    const [isExternalAudioActive, setExternalAudioActive] = useState(false);

    const soundRef = useRef<Audio.Sound | null>(null);
    const ambienceRef = useRef<Audio.Sound | null>(null);
    const isMounted = useRef(true);

    // Initial configuration
    useEffect(() => {
        isMounted.current = true;
        setupAudioMode();
        return () => {
            isMounted.current = false;
            // Cleanup on unmount (app close)
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
            if (ambienceRef.current) {
                ambienceRef.current.unloadAsync();
            }
        };
    }, []);

    // Sync refs
    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    useEffect(() => {
        ambienceRef.current = ambienceSound;
    }, [ambienceSound]);

    const activeUrlRef = useRef<string | null>(null);

    // Consolidated Ambience Logic with Concurrency Safety
    useEffect(() => {
        let isCurrentEffect = true; // Flag to track if this effect execution is still valid

        const manageAmbience = async () => {
            const shouldPlayAmbience = !isPlaying && !isExternalAudioActive;
            const targetUrl = isNightMode ? NIGHT_AMBIENCE_URL : DAY_AMBIENCE_URL;

            // 1. Check if we need to switch tracks (because mode changed)
            if (activeUrlRef.current && activeUrlRef.current !== targetUrl) {
                // Unload current sound because it doesn't match the new mode
                if (ambienceRef.current) {
                    try {
                        await ambienceRef.current.stopAsync();
                        await ambienceRef.current.unloadAsync();
                    } catch (e) {
                        console.log('Error unloading previous ambience:', e);
                    }
                    if (isCurrentEffect) setAmbienceSound(null);
                }
                activeUrlRef.current = null;
            }

            if (!isCurrentEffect) return; // Exit if effect was cleaned up during unload

            // 2. Manage Playback
            if (shouldPlayAmbience) {
                if (!ambienceRef.current && !activeUrlRef.current) {
                    // Load the target sound ONLY if we don't have one and we aren't tracking one
                    try {
                        const { sound: newAmbience } = await Audio.Sound.createAsync(
                            { uri: targetUrl },
                            { shouldPlay: true, isLooping: true, volume: 0.3 }
                        );

                        if (isCurrentEffect) {
                            setAmbienceSound(newAmbience);
                            activeUrlRef.current = targetUrl;
                        } else {
                            // If effect was cancelled while loading, unload immediately
                            await newAmbience.unloadAsync();
                        }
                    } catch (error) {
                        console.error('Error loading ambience:', error);
                    }
                } else if (ambienceRef.current) {
                    // Sound IS loaded (and presumably matches targetUrl if we didn't unload it above)
                    try {
                        const status = await ambienceRef.current.getStatusAsync();
                        if (status.isLoaded && !status.isPlaying) {
                            await ambienceRef.current.playAsync();
                        }
                    } catch (e) {
                        console.log("Error checking status:", e);
                    }
                }
            } else {
                // Should be paused/stopped
                if (ambienceRef.current) {
                    try {
                        const status = await ambienceRef.current.getStatusAsync();
                        if (status.isLoaded && status.isPlaying) {
                            await ambienceRef.current.pauseAsync();
                        }
                    } catch (e) { }
                }
            }
        };

        manageAmbience();

        return () => {
            isCurrentEffect = false; // Cleanup: Mark this execution as stale
        };
    }, [isNightMode, isPlaying, isExternalAudioActive, ambienceSound]);

    // Auto-save position
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
        } catch (error) {
            console.error('Error setting audio mode:', error);
        }
    };

    const loadTrack = async (track: Track, initialPosition: number = 0) => {
        // If same track, just toggle play if requested, or do nothing
        if (currentTrack?.id === track.id && sound) {
            return;
        }

        // Pause multi-layer engine if it's playing
        await audioEngineService.pauseAll();

        try {
            // Unload previous
            if (sound) {
                await sound.unloadAsync();
            }

            setCurrentTrack(track);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);

            const { sound: newSound, status } = await Audio.Sound.createAsync(
                { uri: track.audioUrl },
                { shouldPlay: false, positionMillis: initialPosition },
                onPlaybackStatusUpdate
            );

            setSound(newSound);

            // Auto-play
            await newSound.playAsync();
        } catch (error) {
            console.error('Error loading track:', error);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!isMounted.current) return;

        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            setIsBuffering(status.isBuffering);

            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                if (currentTrack) {
                    savePlaybackPosition(currentTrack.id, 0, status.durationMillis || 0);
                }
            }
        }
    };

    const play = async () => {
        if (sound) {
            // Pause meditation engine to be safe
            await audioEngineService.pauseAll();
            await sound.playAsync();
        }
    };

    const pause = async () => {
        if (sound) {
            await sound.pauseAsync();
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
        if (sound) {
            await sound.unloadAsync();
        }
        setSound(null);
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
