import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackgroundWrapper from '../Layout/BackgroundWrapper';
import { useApp } from '../../context/AppContext';

interface OasisScreenProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    hideBackground?: boolean;
    preset?: 'scroll' | 'fixed';
    themeMode?: 'healing' | 'growth' | 'cosmos';
    remoteImageUri?: string | null;
}

/**
 * Universal Wrapper for PDS v3.0 Screens
 * Injects infinite background, handles safe areas, and provides consistent padding.
 */
export const OasisScreen: React.FC<OasisScreenProps> = ({
    children,
    style,
    contentContainerStyle,
    hideBackground = false,
    preset = 'scroll',
    themeMode,
    remoteImageUri,
}) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode } = useApp();

    // Determine the environment theme
    const activeTheme = themeMode || userState.lifeMode || (isNightMode ? 'healing' : 'growth');
    const nebulaTheme = activeTheme === 'cosmos' ? 'healing' : activeTheme;

    const innerContent = (
        <View style={[styles.inner, style]}>
            {/* Top blurred padding to protect against status bar content overlapping */}
            <BlurView
                intensity={80}
                tint="dark"
                style={[styles.safeTop, { height: insets.top }]}
            />
            {children}
        </View>
    );

    const content = (
        <View style={styles.container}>
            {!hideBackground && (
                <BackgroundWrapper nebulaMode={nebulaTheme as 'healing' | 'growth'} remoteImageUri={remoteImageUri} />
            )}

            {preset === 'scroll' ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
                        contentContainerStyle
                    ]}
                >
                    {innerContent}
                </ScrollView>
            ) : (
                <View style={[styles.fixedContent, { paddingTop: insets.top, paddingBottom: insets.bottom }, contentContainerStyle]}>
                    {innerContent}
                </View>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {content}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Strict fallback
    },
    safeTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
    },
    scrollContent: {
        flexGrow: 1,
    },
    fixedContent: {
        flex: 1,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 20,
    }
});
