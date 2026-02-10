import React, { memo } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Soundscape } from '../../../data/soundscapesData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface Props {
    item: Soundscape;
    onPress: (item: Soundscape) => void;
}

const SoundscapeCard: React.FC<Props> = ({ item, onPress }) => {
    // Debug URL if needed
    // console.log(`Card ${item.name} image:`, item.image);

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onPress(item)}
        >
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.image}
                imageStyle={{ borderRadius: 20 }}
                onError={(e) => console.log(`Error loading image for ${item.name}:`, e.nativeEvent.error)}
            >
                {/* Gradient Overlay for text readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                />

                {/* Content */}
                <View style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        <Ionicons name={item.icon as any} size={20} color="#FFF" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
                    </View>
                </View>

                {/* Play Button Overlay (Optional hint) */}
                <View style={styles.playHint}>
                    <BlurView intensity={20} tint="dark" style={styles.playBlur}>
                        <Ionicons name="play" size={14} color="#FFF" />
                    </BlurView>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.2, // Portrait aspect ratio
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: '#1E1E2E',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        padding: 12,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    textContainer: {
        width: '100%',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
        fontFamily: 'System', // Will switch to Oswald in Player
    },
    description: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
        fontWeight: '500',
    },
    playHint: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    playBlur: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.2)',
    }
});

export default memo(SoundscapeCard);
