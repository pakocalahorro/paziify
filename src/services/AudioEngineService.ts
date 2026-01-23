import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
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
    private voiceSound: Audio.Sound | null = null;
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
            // Capa 1: Voz guiada
            if (config.voice) {
                const { sound } = await Audio.Sound.createAsync(
                    config.voice,
                    { shouldPlay: false, volume: this.volumes.voice }
                );
                this.voiceSound = sound;
            }

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
            if (this.voiceSound) promises.push(this.voiceSound.playAsync());
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
     * Pausa todas las capas de audio
     */
    async pauseAll() {
        try {
            const promises = [];
            if (this.voiceSound) promises.push(this.voiceSound.pauseAsync());
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
        const soundMap = {
            voice: this.voiceSound,
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
                await Promise.all([
                    this.voiceSound?.setVolumeAsync(this.volumes.voice * factor),
                    this.soundscapeSound?.setVolumeAsync(this.volumes.soundscape * factor),
                    this.binauralSound?.setVolumeAsync(this.volumes.binaural * factor),
                    this.elementsSound?.setVolumeAsync(this.volumes.elements * factor),
                ]);
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
            if (this.voiceSound) promises.push(this.voiceSound.unloadAsync());
            if (this.soundscapeSound) promises.push(this.soundscapeSound.unloadAsync());
            if (this.binauralSound) promises.push(this.binauralSound.unloadAsync());
            if (this.elementsSound) promises.push(this.elementsSound.unloadAsync());
            await Promise.all(promises);

            this.voiceSound = null;
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
            // 1. Unload current if exists
            if (this.soundscapeSound) {
                await this.soundscapeSound.unloadAsync();
                this.soundscapeSound = null;
            }

            // 2. Load new
            const soundscape = SOUNDSCAPES.find(s => s.id === soundscapeId);
            if (soundscape && soundscape.audioFile) {
                const { sound } = await Audio.Sound.createAsync(
                    soundscape.audioFile,
                    { shouldPlay: false, volume: this.volumes.soundscape, isLooping: true }
                );
                this.soundscapeSound = sound;

                // 3. Play if active
                if (shouldPlay) {
                    await this.soundscapeSound.playAsync();
                }
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
            // 1. Unload current
            if (this.binauralSound) {
                await this.binauralSound.unloadAsync();
                this.binauralSound = null;
            }

            // 2. Load new
            const binaural = BINAURAL_WAVES.find(b => b.id === binauralId);
            if (binaural && binaural.audioFile) {
                const { sound } = await Audio.Sound.createAsync(
                    binaural.audioFile,
                    { shouldPlay: false, volume: this.volumes.binaural, isLooping: true }
                );
                this.binauralSound = sound;

                // 3. Play if active
                if (shouldPlay) {
                    await this.binauralSound.playAsync();
                }
            }
        } catch (error) {
            console.error('Error swapping binaural:', error);
        }
    }

    /**
     * Obtiene el estado de reproducción de la voz
     */
    async getVoiceStatus() {
        if (!this.voiceSound) return null;
        try {
            return await this.voiceSound.getStatusAsync();
        } catch (error) {
            console.error('Error getting voice status:', error);
            return null;
        }
    }

    /**
     * Reproduce una instrucción de voz para la fase de respiración
     */
    async playVoiceCue(type: 'inhale' | 'exhale' | 'hold' | 'holdPost', style: string = 'calm') {
        const messages: Record<string, string> = {
            inhale: 'Inhala',
            exhale: 'Exhala tranquilamente',
            hold: 'Mantén el aire',
            holdPost: 'Descansa'
        };

        const message = messages[type];
        if (!message) return;

        try {
            await Speech.stop();

            const options = {
                language: 'es-ES',
                pitch: 0.75, // Deep and resonant
                rate: 0.30,  // Ultra-slow for maximum relaxation
            };

            await Speech.speak(message, options);
        } catch (error) {
            console.error('Error in Speech:', error);
        }
    }
}

export default new AudioEngineService();
