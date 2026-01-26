import { Audio } from 'expo-av';
import { supabase } from './supabaseClient';
import { SOUNDSCAPES, BINAURAL_WAVES, ELEMENTS } from '../data/soundscapesData';

export interface AudioConfig {
    voice?: any;
    soundscape?: string;
    binaural?: string;
    elements?: string;
}

export interface VolumeConfig {
    voice: number;
    soundscape: number;
    binaural: number;
    elements: number;
}

class AudioEngineService {
    private cueCache: Map<string, Audio.Sound> = new Map();
    private soundscapeSound: Audio.Sound | null = null;
    private binauralSound: Audio.Sound | null = null;
    private elementsSound: Audio.Sound | null = null;

    private volumes: VolumeConfig = {
        voice: 1.0,
        soundscape: 0.7,
        binaural: 0.4,
        elements: 0.5,
    };

    private isInitialized = false;

    /**
     * Inicializa el motor de audio con la configuración necesaria
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
            });
            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing audio engine:', error);
            throw error;
        }
    }

    /**
     * Carga una sesión de meditación con sus capas de audio
     */
    async loadSession(config: AudioConfig) {
        await this.initialize();
        await this.unloadAll();

        try {
            // Capa 2: Soundscape
            if (config.soundscape) {
                const soundscape = SOUNDSCAPES.find(s => s.id === config.soundscape);
                if (soundscape && soundscape.audioFile) {
                    const { sound } = await Audio.Sound.createAsync(
                        soundscape.audioFile,
                        { shouldPlay: false, volume: this.volumes.soundscape, isLooping: true }
                    );
                    this.soundscapeSound = sound;
                }
            }

            // Capa 3: Binaurales
            if (config.binaural) {
                const binaural = BINAURAL_WAVES.find(b => b.id === config.binaural);
                if (binaural && binaural.audioFile) {
                    const { sound } = await Audio.Sound.createAsync(
                        binaural.audioFile,
                        { shouldPlay: false, volume: this.volumes.binaural, isLooping: true }
                    );
                    this.binauralSound = sound;
                }
            }

            // Capa 4: Elementos
            if (config.elements) {
                const element = ELEMENTS.find(e => e.id === config.elements);
                if (element && element.audioFile) {
                    const { sound } = await Audio.Sound.createAsync(
                        element.audioFile,
                        { shouldPlay: false, volume: this.volumes.elements, isLooping: true }
                    );
                    this.elementsSound = sound;
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            throw error;
        }
    }

    /**
     * Reproduce todas las capas de audio sincronizadas
     */
    async playAll() {
        try {
            const promises = [];
            if (this.soundscapeSound) promises.push(this.soundscapeSound.playAsync());
            if (this.binauralSound) promises.push(this.binauralSound.playAsync());
            if (this.elementsSound) promises.push(this.elementsSound.playAsync());
            await Promise.all(promises);
        } catch (error) {
            console.error('Error playing audio:', error);
            throw error;
        }
    }

    /**
     * Pausa todas las capas de audio (incluyendo voces activas)
     */
    async pauseAll() {
        try {
            const promises = [];
            for (const sound of this.cueCache.values()) {
                promises.push(sound.pauseAsync());
            }
            if (this.soundscapeSound) promises.push(this.soundscapeSound.pauseAsync());
            if (this.binauralSound) promises.push(this.binauralSound.pauseAsync());
            if (this.elementsSound) promises.push(this.elementsSound.pauseAsync());
            await Promise.all(promises);
        } catch (error) {
            console.error('Error pausing audio:', error);
            throw error;
        }
    }

    /**
     * Ajusta el volumen de una capa específica
     */
    async setLayerVolume(layer: keyof VolumeConfig, volume: number) {
        this.volumes[layer] = volume;
        if (layer === 'voice') {
            for (const sound of this.cueCache.values()) {
                await sound.setVolumeAsync(volume);
            }
            return;
        }

        const soundMap: Record<string, Audio.Sound | null> = {
            soundscape: this.soundscapeSound,
            binaural: this.binauralSound,
            elements: this.elementsSound,
        };
        const sound = soundMap[layer];
        if (sound) {
            try {
                await sound.setVolumeAsync(volume);
            } catch (error) {
                console.error(`Error setting volume for ${layer}:`, error);
            }
        }
    }

    /**
     * Obtiene los volúmenes actuales
     */
    getVolumes(): VolumeConfig {
        return { ...this.volumes };
    }

    /**
     * Aplica un fade out suave a todas las capas
     */
    async fadeOut(durationMs: number = 3000) {
        const steps = 30;
        const interval = durationMs / steps;

        try {
            for (let i = steps; i >= 0; i--) {
                const factor = i / steps;
                const promises = [];
                if (this.soundscapeSound) promises.push(this.soundscapeSound.setVolumeAsync(this.volumes.soundscape * factor));
                if (this.binauralSound) promises.push(this.binauralSound.setVolumeAsync(this.volumes.binaural * factor));
                if (this.elementsSound) promises.push(this.elementsSound.setVolumeAsync(this.volumes.elements * factor));

                for (const sound of this.cueCache.values()) {
                    promises.push(sound.setVolumeAsync(this.volumes.voice * factor));
                }

                await Promise.all(promises);
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        } catch (error) {
            console.error('Error during fade out:', error);
        }
    }

    /**
     * Descarga todos los recursos de audio
     */
    async unloadAll() {
        try {
            const promises = [];
            for (const sound of this.cueCache.values()) {
                promises.push(sound.unloadAsync());
            }
            if (this.soundscapeSound) promises.push(this.soundscapeSound.unloadAsync());
            if (this.binauralSound) promises.push(this.binauralSound.unloadAsync());
            if (this.elementsSound) promises.push(this.elementsSound.unloadAsync());
            await Promise.all(promises);

            this.cueCache.clear();
            this.soundscapeSound = null;
            this.binauralSound = null;
            this.elementsSound = null;
        } catch (error) {
            console.error('Error unloading audio:', error);
        }
    }

    /**
     * Cambia la capa de soundscape sin detener el resto
     */
    async swapSoundscape(soundscapeId: string, shouldPlay: boolean = true) {
        if (!soundscapeId) return;

        try {
            if (this.soundscapeSound) {
                await this.soundscapeSound.unloadAsync();
                this.soundscapeSound = null;
            }

            const soundscape = SOUNDSCAPES.find(s => s.id === soundscapeId);
            if (soundscape && soundscape.audioFile) {
                const { sound } = await Audio.Sound.createAsync(
                    soundscape.audioFile,
                    { shouldPlay: false, volume: this.volumes.soundscape, isLooping: true }
                );
                this.soundscapeSound = sound;
                if (shouldPlay) await this.soundscapeSound.playAsync();
            }
        } catch (error) {
            console.error('Error swapping soundscape:', error);
        }
    }

    /**
     * Cambia la capa binaural sin detener el resto
     */
    async swapBinaural(binauralId: string, shouldPlay: boolean = true) {
        if (!binauralId) return;

        try {
            if (this.binauralSound) {
                await this.binauralSound.unloadAsync();
                this.binauralSound = null;
            }

            const binaural = BINAURAL_WAVES.find(b => b.id === binauralId);
            if (binaural && binaural.audioFile) {
                const { sound } = await Audio.Sound.createAsync(
                    binaural.audioFile,
                    { shouldPlay: false, volume: this.volumes.binaural, isLooping: true }
                );
                this.binauralSound = sound;
                if (shouldPlay) await this.binauralSound.playAsync();
            }
        } catch (error) {
            console.error('Error swapping binaural:', error);
        }
    }

    /**
     * Carga y almacena en caché todas las instrucciones de una sesión
     */
    async preloadCues(messages: Record<string, string>) {
        console.log('Preloading voice cues...');
        const promises = Object.entries(messages).map(([key, text]) => this.loadProVoice(text, key));
        await Promise.all(promises);
        console.log('Voice cues preloaded.');
    }

    /**
     * Genera y carga la voz profesional mediante Vertex AI (Edge Function)
     */
    async loadProVoice(text: string, cacheKey: string, voiceName: string = 'es-ES-Wavenet-C') {
        try {
            if (this.cueCache.has(cacheKey)) return;

            const { data, error } = await supabase.functions.invoke('meditation-tts', {
                body: {
                    text,
                    voice: voiceName,
                    speed: 0.70, // Super espiritual y lento
                    pitch: -2.5  // Resonante y profundo
                },
            });

            if (error || !data.audioContent) throw new Error(error?.message || 'No audio content received');

            const uri = `data:audio/mp3;base64,${data.audioContent}`;
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: false, volume: this.volumes.voice }
            );
            this.cueCache.set(cacheKey, sound);
        } catch (error) {
            console.error(`Error loading cue (${cacheKey}):`, error);
        }
    }

    /**
     * Reproduce una instrucción de voz con Ducking
     */
    async playVoiceCue(type: string, style: string = 'calm', text?: string) {
        const sound = this.cueCache.get(type);

        if (sound) {
            try {
                // Ducking suave
                await Promise.all([
                    this.soundscapeSound?.setVolumeAsync(this.volumes.soundscape * 0.2),
                    this.binauralSound?.setVolumeAsync(this.volumes.binaural * 0.2),
                ]);

                await sound.replayAsync();

                sound.setOnPlaybackStatusUpdate((status: any) => {
                    if (status.didJustFinish) {
                        // Restauración suave
                        this.soundscapeSound?.setVolumeAsync(this.volumes.soundscape);
                        this.binauralSound?.setVolumeAsync(this.volumes.binaural);
                    }
                });
            } catch (error) {
                console.error('Error playing voice cue:', error);
            }
        } else if (text) {
            await this.loadProVoice(text, type);
            this.playVoiceCue(type, style, text);
        }
    }

    async getVoiceStatus(type: string) {
        const sound = this.cueCache.get(type);
        if (!sound) return null;
        try {
            return await sound.getStatusAsync();
        } catch (error) {
            return null;
        }
    }
}

export default new AudioEngineService();
