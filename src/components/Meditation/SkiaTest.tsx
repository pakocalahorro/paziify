import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import {
    Canvas,
    Circle,
    Group,
    Blur,
} from '@shopify/react-native-skia';

const { width } = Dimensions.get('window');

const SkiaTest: React.FC = () => {
    // Componente estático sin hooks de animación para evitar conflictos con Reanimated durante la verificación inicial
    return (
        <View style={styles.container}>
            <Canvas style={styles.canvas}>
                <Group>
                    <Blur blur={20} />
                    <Circle
                        cx={width / 2}
                        cy={150}
                        r={80}
                        color="#2DD4BF"
                        opacity={0.6}
                    />
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 300,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        marginVertical: 20,
        overflow: 'hidden',
    },
    canvas: {
        flex: 1,
    },
});

export default SkiaTest;
