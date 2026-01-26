import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYBACK_POSITION_KEY = '@paziify_playback_position_';
const PLAYBACK_SPEED_KEY = '@paziify_playback_speed';

export interface PlaybackPosition {
    audiobookId: string;
    position: number;
    duration: number;
    lastPlayed: string;
}

/**
 * Save playback position for an audiobook
 */
export const savePlaybackPosition = async (
    audiobookId: string,
    position: number,
    duration: number
): Promise<void> => {
    try {
        const data: PlaybackPosition = {
            audiobookId,
            position,
            duration,
            lastPlayed: new Date().toISOString(),
        };
        await AsyncStorage.setItem(
            `${PLAYBACK_POSITION_KEY}${audiobookId}`,
            JSON.stringify(data)
        );
    } catch (error) {
        console.error('Error saving playback position:', error);
    }
};

/**
 * Get saved playback position for an audiobook
 */
export const getPlaybackPosition = async (
    audiobookId: string
): Promise<PlaybackPosition | null> => {
    try {
        const data = await AsyncStorage.getItem(`${PLAYBACK_POSITION_KEY}${audiobookId}`);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error getting playback position:', error);
        return null;
    }
};

/**
 * Clear playback position for an audiobook
 */
export const clearPlaybackPosition = async (audiobookId: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(`${PLAYBACK_POSITION_KEY}${audiobookId}`);
    } catch (error) {
        console.error('Error clearing playback position:', error);
    }
};

/**
 * Save playback speed preference
 */
export const savePlaybackSpeed = async (speed: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(PLAYBACK_SPEED_KEY, speed.toString());
    } catch (error) {
        console.error('Error saving playback speed:', error);
    }
};

/**
 * Get saved playback speed preference
 */
export const getPlaybackSpeed = async (): Promise<number> => {
    try {
        const speed = await AsyncStorage.getItem(PLAYBACK_SPEED_KEY);
        return speed ? parseFloat(speed) : 1.0;
    } catch (error) {
        console.error('Error getting playback speed:', error);
        return 1.0;
    }
};
