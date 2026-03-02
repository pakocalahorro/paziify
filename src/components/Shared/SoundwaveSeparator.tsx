import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string;
    fullWidth?: boolean;
    accentColor?: string;
    onAction?: () => void;
    actionIcon?: string;
}

const { width } = Dimensions.get('window');

const SoundwaveSeparator: React.FC<Props> = ({
    title,
    fullWidth = true,
    accentColor = "#2DD4BF",
    onAction,
    actionIcon = "add"
}) => {
    const pulse = useSharedValue(0.3);

    React.useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const center = width / 2;
    const wavePath = Skia.Path.Make();
    const centerY = 40; // Lowered for 80px height
    wavePath.moveTo(0, centerY);
    wavePath.lineTo(center - 80, centerY);

    // High Amplitude Soundwave
    wavePath.lineTo(center - 70, 0);
    wavePath.lineTo(center - 60, 80);
    wavePath.lineTo(center - 50, 10);
    wavePath.lineTo(center - 40, 70);
    wavePath.lineTo(center - 30, 5);
    wavePath.lineTo(center - 20, 75);
    wavePath.lineTo(center - 10, 20);
    wavePath.lineTo(center, 60);
    wavePath.lineTo(center + 10, 15);
    wavePath.lineTo(center + 20, 80);
    wavePath.lineTo(center + 30, 0);
    wavePath.lineTo(center + 40, 70);
    wavePath.lineTo(center + 50, 20);
    wavePath.lineTo(center + 60, 60);
    wavePath.lineTo(center + 70, 30);

    wavePath.lineTo(center + 80, centerY);
    wavePath.lineTo(width, centerY);

    return (
        <View style={[
            styles.container,
            fullWidth && { width: width, marginHorizontal: 0 }
        ]}>
            {/* Glowing Wave */}
            <Canvas style={[
                styles.canvas,
                fullWidth && { width: width }
            ]}>
                {/* Outer Glow */}
                <Path
                    path={wavePath}
                    color={accentColor}
                    style="stroke"
                    strokeWidth={4}
                    opacity={pulse}
                >
                    <BlurMask blur={8} style="normal" />
                </Path>
                {/* Inner Glow */}
                <Path
                    path={wavePath}
                    color={accentColor}
                    style="stroke"
                    strokeWidth={2}
                    opacity={pulse}
                >
                    <BlurMask blur={3} style="normal" />
                </Path>
                {/* Core Line */}
                <Path
                    path={wavePath}
                    color="#ffffff"
                    style="stroke"
                    strokeWidth={1.5}
                    opacity={0.9}
                />
            </Canvas>

            {/* Text and Action Overlay */}
            <View style={styles.contentWrapper}>
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.text}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>

                    {onAction && (
                        <TouchableOpacity
                            onPress={onAction}
                            style={[styles.actionButton, { borderColor: accentColor + '40' }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={actionIcon as any} size={20} color={accentColor} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 80, // Reduced from 100
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 4
    },
    canvas: {
        position: 'absolute',
        width: width,
        height: 80
    },
    contentWrapper: {
        width: '100%',
        paddingHorizontal: 20,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', // Solidify background for readability
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 24,
        maxWidth: width - 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    }
});

export default SoundwaveSeparator;
