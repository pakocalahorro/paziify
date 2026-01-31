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
  const pulse = useSharedValue(0);
  const auraScale = useSharedValue(1);

  // Animaciones para 5 capas de energía
  const drift1X = useSharedValue(0);
  const drift1Y = useSharedValue(0);
  const drift2X = useSharedValue(0);
  const drift2Y = useSharedValue(0);
  const drift3X = useSharedValue(0);
  const drift3Y = useSharedValue(0);
  const drift4X = useSharedValue(0);
  const drift4Y = useSharedValue(0);
  const drift5X = useSharedValue(0);
  const drift5Y = useSharedValue(0);

  // Debug marker - PHASE 1 ENHANCED ORB LOADED
  useEffect(() => {
    console.log('🎨 ProBreathingOrb PHASE 1 - Enhanced with 5 energy layers + aura');
  }, []);

  useEffect(() => {
    // Animación ambiente (Movimiento de energía interna) - 5 capas con diferentes velocidades
    drift1X.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift1Y.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), -1, true);

    drift2X.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift2Y.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true);

    drift3X.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift3Y.value = withRepeat(withTiming(1, { duration: 7500, easing: Easing.inOut(Easing.sin) }), -1, true);

    drift4X.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift4Y.value = withRepeat(withTiming(1, { duration: 6500, easing: Easing.inOut(Easing.sin) }), -1, true);

    drift5X.value = withRepeat(withTiming(1, { duration: 6500, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift5Y.value = withRepeat(withTiming(1, { duration: 8500, easing: Easing.inOut(Easing.sin) }), -1, true);

    pulse.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    auraScale.value = withRepeat(withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
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

  // Posiciones de las 5 capas de energía
  const energy1Pos = useDerivedValue(() => ({
    x: center.x + Math.sin(drift1X.value * Math.PI) * (currentRadius.value * 0.35),
    y: center.y + Math.cos(drift1Y.value * Math.PI) * (currentRadius.value * 0.25),
  }));

  const energy2Pos = useDerivedValue(() => ({
    x: center.x - Math.cos(drift2X.value * Math.PI) * (currentRadius.value * 0.45),
    y: center.y - Math.sin(drift2Y.value * Math.PI) * (currentRadius.value * 0.35),
  }));

  const energy3Pos = useDerivedValue(() => ({
    x: center.x + Math.cos(drift3X.value * Math.PI) * (currentRadius.value * 0.3),
    y: center.y + Math.sin(drift3Y.value * Math.PI) * (currentRadius.value * 0.4),
  }));

  const energy4Pos = useDerivedValue(() => ({
    x: center.x - Math.sin(drift4X.value * Math.PI) * (currentRadius.value * 0.4),
    y: center.y + Math.cos(drift4Y.value * Math.PI) * (currentRadius.value * 0.3),
  }));

  const energy5Pos = useDerivedValue(() => ({
    x: center.x + Math.sin(drift5X.value * Math.PI) * (currentRadius.value * 0.25),
    y: center.y - Math.cos(drift5Y.value * Math.PI) * (currentRadius.value * 0.35),
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={styles.canvas}>
        <Group>
          {/* AURA EXTERIOR - Capa 3 (más externa) */}
          <Circle c={center} r={useDerivedValue(() => currentRadius.value * 1.8 * auraScale.value)}>
            <RadialGradient
              c={center}
              r={useDerivedValue(() => currentRadius.value * 1.8)}
              colors={['rgba(52, 211, 153, 0.08)', 'transparent']}
              positions={[0, 1]}
            />
          </Circle>

          {/* AURA EXTERIOR - Capa 2 */}
          <Circle c={center} r={useDerivedValue(() => currentRadius.value * 1.5 * auraScale.value)}>
            <RadialGradient
              c={center}
              r={useDerivedValue(() => currentRadius.value * 1.5)}
              colors={['rgba(16, 185, 129, 0.15)', 'transparent']}
              positions={[0, 1]}
            />
          </Circle>

          {/* AURA EXTERIOR - Capa 1 (más cercana) */}
          <Circle c={center} r={useDerivedValue(() => currentRadius.value * 1.2 * auraScale.value)}>
            <RadialGradient
              c={center}
              r={useDerivedValue(() => currentRadius.value * 1.2)}
              colors={['rgba(34, 197, 94, 0.25)', 'transparent']}
              positions={[0, 1]}
            />
          </Circle>

          {/* 1. NÚCLEO VERDE MEJORADO (más oscuro para contraste) */}
          <Circle c={center} r={currentRadius}>
            <RadialGradient
              c={center}
              r={currentRadius}
              colors={['#064e3b', '#022c22', '#000000']}
              positions={[0, 0.6, 1]}
            />
          </Circle>

          {/* 2. ENERGÍA VIVA - 5 CAPAS (blend mode screen para brillo) */}
          <Group blendMode="screen">
            {/* Capa 1: Verde Esmeralda Brillante */}
            <Circle c={energy1Pos} r={currentRadius}>
              <RadialGradient
                c={energy1Pos}
                r={currentRadius}
                colors={['#10b981', 'rgba(16, 185, 129, 0.4)', 'transparent']}
                positions={[0, 0.35, 1]}
              />
            </Circle>

            {/* Capa 2: Verde Neón */}
            <Circle c={energy2Pos} r={useDerivedValue(() => currentRadius.value * 1.2)}>
              <RadialGradient
                c={energy2Pos}
                r={useDerivedValue(() => currentRadius.value * 1.2)}
                colors={['#22c55e', 'rgba(34, 197, 94, 0.3)', 'transparent']}
                positions={[0, 0.4, 1]}
              />
            </Circle>

            {/* Capa 3: Verde Menta */}
            <Circle c={energy3Pos} r={useDerivedValue(() => currentRadius.value * 0.9)}>
              <RadialGradient
                c={energy3Pos}
                r={useDerivedValue(() => currentRadius.value * 0.9)}
                colors={['#34d399', 'rgba(52, 211, 153, 0.35)', 'transparent']}
                positions={[0, 0.4, 1]}
              />
            </Circle>

            {/* Capa 4: Verde Lima */}
            <Circle c={energy4Pos} r={useDerivedValue(() => currentRadius.value * 1.1)}>
              <RadialGradient
                c={energy4Pos}
                r={useDerivedValue(() => currentRadius.value * 1.1)}
                colors={['#6ee7b7', 'rgba(110, 231, 183, 0.3)', 'transparent']}
                positions={[0, 0.35, 1]}
              />
            </Circle>

            {/* Capa 5: Verde Aqua */}
            <Circle c={energy5Pos} r={useDerivedValue(() => currentRadius.value * 0.95)}>
              <RadialGradient
                c={energy5Pos}
                r={useDerivedValue(() => currentRadius.value * 0.95)}
                colors={['#a7f3d0', 'rgba(167, 243, 208, 0.3)', 'transparent']}
                positions={[0, 0.4, 1]}
              />
            </Circle>

            {/* Núcleo Ultra Brillante (blanco-verde) */}
            <Circle c={center} r={useDerivedValue(() => currentRadius.value * 0.45 * (1 + pulse.value * 0.2))}>
              <RadialGradient
                c={center}
                r={useDerivedValue(() => currentRadius.value * 0.45)}
                colors={['#ECFDF5', 'rgba(236, 253, 245, 0.6)', 'transparent']}
                positions={[0, 0.5, 1]}
              />
            </Circle>
          </Group>

          {/* 3. BORDE DE CRISTAL ESMERALDA (más brillante) */}
          <Circle
            c={center}
            r={currentRadius}
            color="rgba(110, 231, 183, 0.6)"
          >
            <Paint style="stroke" strokeWidth={2} />
          </Circle>

          {/* Reflejo cristalino dinámico mejorado */}
          <Circle
            c={useDerivedValue(() => ({
              x: center.x - currentRadius.value * 0.4,
              y: center.y - currentRadius.value * 0.4
            }))}
            r={useDerivedValue(() => currentRadius.value * 0.35)}
          >
            <RadialGradient
              c={useDerivedValue(() => ({
                x: center.x - currentRadius.value * 0.4,
                y: center.y - currentRadius.value * 0.4
              }))}
              r={useDerivedValue(() => currentRadius.value * 0.35)}
              colors={['rgba(255, 255, 255, 0.35)', 'transparent']}
              positions={[0, 1]}
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
