import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
    showSafeOverlay?: boolean;
    header?: React.ReactNode;
    disableContentPadding?: boolean;
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
    showSafeOverlay = true,
    header,
    disableContentPadding = false,
}) => {
    const insets = useSafeAreaInsets();
    const { userState, isNightMode } = useApp();

    // Determine the environment theme
    const activeTheme = themeMode || userState.lifeMode || (isNightMode ? 'healing' : 'growth');
    const nebulaTheme = activeTheme === 'cosmos' ? 'healing' : activeTheme;

    // Automatic safe overlay management:
    // If we have a header, we don't need the dark safeTop overlay because the header handles it.
    const shouldShowSafeTop = showSafeOverlay && !header;

    const innerContent = (
        <View style={[
            styles.inner,
            disableContentPadding && { paddingHorizontal: 0 },
            style
        ]}>
            {/* Top blurred padding to protect against status bar content overlapping */}
            {shouldShowSafeTop && (
                <BlurView
                    intensity={80}
                    tint="dark"
                    style={[styles.safeTop, { height: insets.top }]}
                />
            )}
            {children}
        </View>
    );

    const content = (
        <View style={styles.container}>
            {!hideBackground && (
                <BackgroundWrapper nebulaMode={nebulaTheme as 'healing' | 'growth'} remoteImageUri={remoteImageUri} />
            )}

            {/* FIXED HEADER (Full Width, outside of scroll) */}
            {header}

            {preset === 'scroll' ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingTop: header ? 0 : insets.top + 20,
                            paddingBottom: insets.bottom + 100
                        },
                        contentContainerStyle
                    ]}
                >
                    {innerContent}
                </ScrollView>
            ) : (
                <View style={[styles.fixedContent, { paddingTop: header ? 0 : insets.top, paddingBottom: insets.bottom }, contentContainerStyle]}>
                    {innerContent}
                </View>
            )}

            {/* MASTER FOOTER GRADIENT (Premium Finish) */}
            <View
                style={[
                    styles.footerGradientContainer,
                    { height: insets.bottom + 40, bottom: 0 }
                ]}
                pointerEvents="none"
            >
                <LinearGradient
                    colors={['transparent', 'rgba(17, 24, 39, 0.5)', 'rgba(30, 58, 138, 0.95)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.4, 1]}
                />
            </View>
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
    },
    footerGradientContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1000,
    }
});
