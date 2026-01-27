import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  RadialGradient,
  vec,
  Paint,
} from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
  size?: number;
  active?: boolean;
  phase?: 'inhale' | 'exhale' | 'hold' | 'ready';
  progress?: number;
}

const ProBreathingOrb: React.FC<Props> = ({
  size = width * 0.75,
  active = true,
  phase = 'ready',
  progress = 0,
}) => {
  // Animaciones globales
  const orbScale = useSharedValue(1);
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Animación ambiente (Movimiento de energía interna)
    driftX.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }), -1, true);
    driftY.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), -1, true);
    pulse.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  useEffect(() => {
    // Escala del ORBE COMPLETO según la respiración
    const config = { duration: 4000, easing: Easing.inOut(Easing.ease) };
    if (phase === 'inhale') {
      orbScale.value = withTiming(1.3, config);
    } else if (phase === 'exhale') {
      orbScale.value = withTiming(0.7, config);
    } else if (phase === 'hold') {
      orbScale.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
    } else {
      orbScale.value = withTiming(1, { duration: 1000 });
    }
  }, [phase]);

  const center = vec(size / 2, size / 2);
  const BASE_RADIUS = size / 3.2;

  // El radio de TODO el orbe es dinámico
  const currentRadius = useDerivedValue(() => BASE_RADIUS * orbScale.value);

  // Posiciones de la energía (Lava Flow)
  const energyLimePos = useDerivedValue(() => ({
    x: center.x + Math.sin(driftX.value * Math.PI) * (currentRadius.value * 0.35),
    y: center.y + Math.cos(driftY.value * Math.PI) * (currentRadius.value * 0.25),
  }));

  const energyEmeraldPos = useDerivedValue(() => ({
    x: center.x - Math.cos(driftX.value * Math.PI) * (currentRadius.value * 0.45),
    y: center.y - Math.sin(driftY.value * Math.PI) * (currentRadius.value * 0.35),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={styles.canvas}>
        <Group>
          {/* 1. NÚCLEO VERDE RETROILUMINADO (Emerald Base) */}
          <Circle c={center} r={currentRadius}>
            <RadialGradient
              c={center}
              r={currentRadius}
              colors={['#064e3b', '#022c22', '#000000']} // Degradado verde bosque a negro
              positions={[0, 0.7, 1]}
            />
          </Circle>

          {/* 2. ENERGÍA VIVA (Nature Glow) */}
          <Group blendMode="screen">
            {/* Esfera Lima Eléctrica */}
            <Circle c={energyLimePos} r={currentRadius}>
              <RadialGradient
                c={energyLimePos}
                r={currentRadius}
                colors={['#10b981', 'rgba(16, 185, 129, 0.3)', 'transparent']}
                positions={[0, 0.4, 1]}
              />
            </Circle>

            {/* Esfera Esmeralda Profunda */}
            <Circle c={energyEmeraldPos} r={useDerivedValue(() => currentRadius.value * 1.2)}>
              <RadialGradient
                c={energyEmeraldPos}
                r={useDerivedValue(() => currentRadius.value * 1.2)}
                colors={['#34d399', 'rgba(52, 211, 153, 0.2)', 'transparent']}
                positions={[0, 0.4, 1]}
              />
            </Circle>

            {/* Punto de Luz Áurea/Blanca (Bio-Luminiscencia) */}
            <Circle c={center} r={useDerivedValue(() => currentRadius.value * 0.4 * (1 + pulse.value * 0.15))}>
              <RadialGradient
                c={center}
                r={useDerivedValue(() => currentRadius.value * 0.4)}
                colors={['#FFFFFF', 'rgba(255, 255, 255, 0.4)', 'transparent']}
              />
            </Circle>
          </Group>

          {/* 3. BORDE DE CRISTAL ESMERALDA */}
          <Circle
            c={center}
            r={currentRadius}
            color="rgba(110, 231, 183, 0.4)" // Verde menta suave para el brillo del borde
          >
            <Paint style="stroke" strokeWidth={1.5} />
          </Circle>

          {/* Reflejo cristalino dinámico */}
          <Circle
            c={useDerivedValue(() => ({
              x: center.x - currentRadius.value * 0.4,
              y: center.y - currentRadius.value * 0.4
            }))}
            r={useDerivedValue(() => currentRadius.value * 0.3)}
          >
            <RadialGradient
              c={useDerivedValue(() => ({
                x: center.x - currentRadius.value * 0.4,
                y: center.y - currentRadius.value * 0.4
              }))}
              r={useDerivedValue(() => currentRadius.value * 0.3)}
              colors={['rgba(255, 255, 255, 0.25)', 'transparent']}
            />
          </Circle>
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  canvas: { flex: 1, width: '100%', height: '100%' },
});

export default ProBreathingOrb;
