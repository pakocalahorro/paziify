import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Fill,
    Turbulence,
    DisplacementMap,
    ColorMatrix,
} from '@shopify/react-native-skia';

const { width, height } = Dimensions.get('window');

const NoiseBackground: React.FC = () => {
    return (
        <Canvas style={styles.canvas}>
            <Fill>
                <Turbulence freqX={0.05} freqY={0.05} octaves={2} />
                <ColorMatrix
                    matrix={[
                        0.1, 0, 0, 0, 0,
                        0, 0.1, 0, 0, 0,
                        0, 0, 0.1, 0, 0,
                        0, 0, 0, 0.2, 0,
                    ]}
                />
            </Fill>
        </Canvas>
    );
};

const styles = StyleSheet.create({
    canvas: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
});

export default NoiseBackground;
