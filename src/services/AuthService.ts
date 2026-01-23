import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabaseClient';
import * as Linking from 'expo-linking';
import { AppState, Platform } from 'react-native';

// WebBrowser needs to complete for some platforms
WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
    try {
        const redirectTo = AuthSession.makeRedirectUri({
            path: 'auth-callback',
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                skipBrowserRedirect: true,
            },
        });

        if (error) throw error;

        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        if (res.type === 'success' && res.url) {
            const hash = res.url.split('#')[1];
            const query = res.url.split('?')[1];
            const params = new URLSearchParams(hash || query);

            const errorParam = params.get('error');
            if (errorParam) {
                throw new Error(`Google Auth Error: ${errorParam} - ${params.get('error_description')}`);
            }

            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token && refresh_token) {
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (sessionError) throw sessionError;
                return { success: true };
            }
        }

        return { success: false, cancelled: res.type === 'cancel' };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};

// Listen for app state changes to ensure we handle redirects correctly
if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            // Check for session if needed
        }
    });
}
