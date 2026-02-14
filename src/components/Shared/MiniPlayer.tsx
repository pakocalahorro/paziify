import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Screen } from '../../types';
import { BlurView } from 'expo-blur';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { currentTrack, isPlaying, play, pause, closePlayer } = useAudioPlayer();

    // Get current route name to hide MiniPlayer if we are on the Player Screen
    const currentRouteName = useNavigationState(state => {
        const getRouteName = (route: any): string => {
            if (!route) return '';
            // If it has state (nested navigator), go deeper
            if (route.state && route.state.routes) {
                return getRouteName(route.state.routes[route.state.index]);
            }
            return route.name;
        };
        return state ? getRouteName(state.routes[state.index]) : '';
    });

    // 1. Smart Hide Logic [Refined]
    // Only hide if we are on a Player Screen AND the content matches what is playing.
    // Otherwise (e.g. reading a book while listening to music), show the player.

    // We need to inspect route params. This is a bit tricky with nested navigators but doable.
    const currentRouteParams = useNavigationState(state => {
        const getParams = (route: any): any => {
            if (!route) return null;
            if (route.state && route.state.routes) {
                return getParams(route.state.routes[route.state.index]);
            }
            return route.params;
        };
        return state ? getParams(state.routes[state.index]) : null;
    });

    if (currentRouteName === Screen.BACKGROUND_PLAYER) {
        // For Background Player, we usually hide it because it's full screen.
        // But strictly, if we are listening to a Book and looking at Background Player?
        // Let's stick to hiding it on BackgroundPlayer as it has its own distinct UI/Logic usually.
        return null;
    }

    if (currentRouteName === Screen.AUDIOBOOK_PLAYER && currentTrack) {
        // Check if the audiobook being viewed is the one playing
        const viewingAudiobookId = currentRouteParams?.audiobookId;
        if (viewingAudiobookId === currentTrack.id) {
            return null; // Hide MiniPlayer, let Big Player handle it
        }
        // If not matching (e.g. listening to music), SHOW MiniPlayer
    }

    if (!currentTrack) return null;

    const handlePress = () => {
        if (currentTrack.isInfinite) {
            navigation.navigate('LibraryTab', {
                screen: Screen.BACKGROUND_PLAYER,
                params: { soundscapeId: currentTrack.id }
            });
        } else {
            navigation.navigate('LibraryTab', {
                screen: Screen.AUDIOBOOK_PLAYER,
                params: { audiobookId: currentTrack.id }
            });
        }
    };

    // 2. Adjust bottom position to sit above TabBar
    // TabBar height is usually 60 + bottom inset. We add a little margin.
    // If insets.bottom is 0 (old device), we default to standard tab bar height.
    const tabBarHeight = 60 + (insets.bottom > 0 ? insets.bottom : 0);
    const bottomPosition = tabBarHeight + 10;

    return (
        <View style={[styles.container, { bottom: bottomPosition }]}>
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.9}>
                    {/* Tiny Cover */}
                    {currentTrack.cover && (
                        <Image source={currentTrack.cover} style={styles.cover} />
                    )}

                    {/* Info */}
                    <View style={styles.info}>
                        <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                        <Text style={styles.author} numberOfLines={1}>{currentTrack.author}</Text>
                    </View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        <TouchableOpacity
                            onPress={isPlaying ? pause : play}
                            style={styles.playButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closePlayer}
                            style={styles.closeButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                {/* Progress Bar (Optional thin line at bottom) */}
                {!currentTrack.isInfinite && (
                    <View style={styles.progressBarBackground}>
                        {/* Could add animated width based on progress here if desired */}
                    </View>
                )}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // Bottom is set dynamically via inline styles
        left: 0,
        right: 0,
        marginHorizontal: 12,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 100,
    },
    blurContainer: {
        width: '100%',
        backgroundColor: 'rgba(20, 30, 40, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 64,
    },
    cover: {
        width: 44,
        height: 44,
        borderRadius: 6,
        backgroundColor: '#333',
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    author: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingRight: 8,
    },
    playButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        padding: 4,
    },
    progressBarBackground: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    }
});

export default MiniPlayer;
