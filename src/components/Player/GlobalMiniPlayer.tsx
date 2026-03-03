import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { Screen, RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');

const GlobalMiniPlayer: React.FC = () => {
    const { currentTrack: track, isPlaying, play, pause, closePlayer } = useAudioPlayer();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // 1. React Rules of Hooks: This must always execute unconditionally at the top.
    const insets = useSafeAreaInsets();

    // Check if we are in a native player screen
    const rawState = navigation.getState();
    const currentRouteName = rawState?.routes[rawState.index]?.name;
    const isFullScreenPlayer = currentRouteName === Screen.AUDIOBOOK_PLAYER || currentRouteName === Screen.BACKGROUND_PLAYER;

    // Si no hay pista activa o estamos en un reproductor de pantalla completa, no mostrar.
    if (!track || isFullScreenPlayer) return null;

    const handlePress = () => {
        if (!track.isInfinite) {
            navigation.getParent()?.navigate(Screen.AUDIOBOOK_PLAYER, { audiobookId: track.id });
        } else {
            navigation.getParent()?.navigate(Screen.BACKGROUND_PLAYER, { soundscapeId: track.id });
        }
    };

    const handlePlayPause = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isPlaying) {
            await pause();
        } else {
            await play();
        }
    };

    // Fallback and type-safety validator for expo-image (Kotlin TypeCastException fix)
    const validCoverUrl = typeof track.cover === 'string' && track.cover.startsWith('http')
        ? track.cover
        : 'https://images.unsplash.com/photo-1542474415-46ffeed89eb0?w=100';

    const tabBarBottomSpace = insets.bottom > 0 ? insets.bottom : 0;
    const dynamicBottomPosition = 60 + tabBarBottomSpace + 10; // 60 (tabbar base) + Notch + gap

    return (
        <Animated.View
            entering={FadeInDown.springify().damping(15)}
            exiting={FadeOutDown.springify()}
            style={[styles.container, { bottom: dynamicBottomPosition }]}
        >
            <TouchableOpacity activeOpacity={0.9} style={styles.touchable} onPress={handlePress}>
                <BlurView intensity={75} tint="dark" style={styles.blurContainer}>
                    <View style={styles.blurContainerContent}>
                        {/* Thumbnail */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: validCoverUrl }}
                                style={styles.image}
                            />
                        </View>

                        {/* Metadata */}
                        <View style={styles.metadataContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                {track.title}
                            </Text>
                            <Text style={styles.artist} numberOfLines={1}>
                                {track.author || 'Paziify'}
                            </Text>
                        </View>

                        {/* Play/Pause Control */}
                        <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={24}
                                color="#FFF"
                                style={{ marginLeft: isPlaying ? 0 : 2 }} // Ajuste visual
                            />
                        </TouchableOpacity>

                        {/* Close Control (X) - The one that was missing */}
                        <TouchableOpacity onPress={closePlayer} style={styles.closeButton}>
                            <Ionicons
                                name="close"
                                size={20}
                                color="rgba(255,255,255,0.5)"
                            />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        width: width * 0.92,
        zIndex: 1000,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    touchable: {
        width: '100%',
    },
    blurContainer: {
        backgroundColor: 'rgba(10, 14, 26, 0.65)', // PDS Base
    },
    blurContainerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    imageContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    metadataContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    artist: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '500',
    },
    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
});

export default GlobalMiniPlayer;
