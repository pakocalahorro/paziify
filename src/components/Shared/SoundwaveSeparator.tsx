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

            {/* Text Overlay - Black Backlight */}
            <View style={styles.contentWrapper}>
                <Text style={styles.text}>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
        textTransform: 'uppercase',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,1)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.4)', // Darker background for text over wave
        borderRadius: 20,
    },
    actionButton: {
        position: 'absolute',
        right: -50,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    }
});

export default SoundwaveSeparator;
