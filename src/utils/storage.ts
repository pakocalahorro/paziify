import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@paziify_user_state';

/**
 * Clear all stored data (useful for logout or reset)
 */
export const clearStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('Storage cleared successfully');
    } catch (error) {
        console.error('Error clearing storage:', error);
    }
};

/**
 * Get stored user state
 */
export const getStoredUserState = async (): Promise<any | null> => {
    try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error getting stored state:', error);
        return null;
    }
};

/**
 * Check if user is registered (has saved data)
 */
export const hasStoredData = async (): Promise<boolean> => {
    try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        return savedState !== null;
    } catch (error) {
        console.error('Error checking stored data:', error);
        return false;
    }
};
