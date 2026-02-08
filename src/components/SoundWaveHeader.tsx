import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Canvas, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
    title: string;
    accentColor?: string;
}

const SoundWaveHeader: React.FC<Props> = ({ title, accentColor = '#2DD4BF' }) => {
    const pulse = useSharedValue(0.3);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const center = width / 2;
    const wavePath = Skia.Path.Make();
    const centerY = 50;

    // Wave construction
    wavePath.moveTo(0, centerY);
    wavePath.lineTo(center - 80, centerY);

    // High Amplitude Soundwave
    wavePath.lineTo(center - 70, 10);
    wavePath.lineTo(center - 60, 90);
    wavePath.lineTo(center - 50, 20);
    wavePath.lineTo(center - 40, 80);
    wavePath.lineTo(center - 30, 15);
    wavePath.lineTo(center - 20, 85);
    wavePath.lineTo(center - 10, 30);
    wavePath.lineTo(center, 70);
    wavePath.lineTo(center + 10, 25);
    wavePath.lineTo(center + 20, 90);
    wavePath.lineTo(center + 30, 10);
    wavePath.lineTo(center + 40, 80);
    wavePath.lineTo(center + 50, 30);
    wavePath.lineTo(center + 60, 70);
    wavePath.lineTo(center + 70, 40);

    wavePath.lineTo(center + 80, centerY);
    wavePath.lineTo(width, centerY);

    return (
        <View style={{
            height: 100,
            width: width,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        }}>
            {/* Glowing Wave */}
            <Canvas style={{ position: 'absolute', width: width, height: 100 }}>
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
            <Text style={{
                marginHorizontal: 16,
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '900',
                letterSpacing: 4,
                textTransform: 'uppercase',
                textShadowColor: 'rgba(0,0,0,1)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: 'rgba(0,0,0,0.3)', // Added subtle background for better text readability over wave
                borderRadius: 4
            }}>
                {title}
            </Text>
        </View>
    );
};

export default SoundWaveHeader;
