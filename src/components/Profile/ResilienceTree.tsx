import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    Group,
    Circle,
    LinearGradient,
    vec,
    Shadow,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    useDerivedValue,
    Easing,
    SharedValue,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

// 🎄 CONFIGURACIÓN MAESTRA DEL ROBLE ESPIRITUAL
export const TREE_CONFIG = {
    baseOffset: 10,
    trunkBaseWidth: 0.12,   // Base ancha como en la imagen
    trunkTopWidth: 0.03,    // Se estrecha arriba
    trunkHeight: 0.38,      // % de la altura total
    maxDepth: 5,            // Profundidad para densidad (5-6)
    branchShrink: 0.78,     // Cuánto se achica cada rama
    spreadBase: 0.45,       // Ángulo de apertura (radianes)
    orbSize: 3,             // Tamaño de las luces
};

// Helper para calcular punto en curva Bézier cuadrática (para seguir el crecimiento)
const getBezierPoint = (t: number, p0: number[], p1: number[], p2: number[]) => {
    'worklet';
    const invT = 1 - t;
    return {
        x: invT * invT * p0[0] + 2 * invT * t * p1[0] + t * t * p2[0],
        y: invT * invT * p0[1] + 2 * invT * t * p1[1] + t * t * p2[1],
    };
};

interface BloomProps {
    index: number;
    points: number[][];
    growAnim: SharedValue<number>;
    isActive: boolean;
    colors: { accent: string; primary: string };
}

const Bloom: React.FC<BloomProps> = ({ index, points, growAnim, isActive, colors }) => {
    const pos = useDerivedValue(() => getBezierPoint(growAnim.value, points[0], points[1], points[2]));

    return (
        <Circle
            cx={pos.value.x}
            cy={pos.value.y}
            r={3 * growAnim.value}
            color={isActive ? "#FFF" : "rgba(255,255,255,0.05)"}
        >
            {isActive && (
                <Shadow dx={0} dy={0} blur={8} color={index % 2 === 0 ? colors.accent : colors.primary} />
            )}
            <LinearGradient
                start={vec(0, 0)}
                end={vec(10, 10)}
                colors={isActive ? ["#FFF", "rgba(255,255,255,0.8)"] : ["rgba(255,255,255,0.1)", "transparent"]}
            />
        </Circle>
    );
};

interface ResilienceTreeProps {
    daysPracticed?: number;
    size?: number;
    isGuest?: boolean;
}

const ResilienceTree: React.FC<ResilienceTreeProps> = ({ daysPracticed = 0, size = 250, isGuest = false }) => {
    const targetGrowth = isGuest ? 0.35 : 0.2 + (Math.min(daysPracticed / 30, 1) * 0.8);
    const growth = useSharedValue(0.1);

    useEffect(() => {
        growth.value = withTiming(targetGrowth, {
            duration: 2500,
            easing: Easing.out(Easing.exp),
        });
    }, [targetGrowth]);

    const treeData = useMemo(() => {
        const cx = size / 2;
        const by = size - TREE_CONFIG.baseOffset;
        const branches: { path: any; depth: number; points: number[][] }[] = [];
        const blooms: { points: number[][] }[] = [];

        // 1. DIBUJO DEL TRONCO (Potente y curvo)
        const trunkPath = Skia.Path.Make();
        const bw = size * TREE_CONFIG.trunkBaseWidth;
        const tw = size * TREE_CONFIG.trunkTopWidth;
        const th = size * TREE_CONFIG.trunkHeight;

        // Base
        trunkPath.moveTo(cx - bw / 2, by);
        // Lado izquierdo curvo
        trunkPath.quadTo(cx - bw / 3, by - th * 0.5, cx - tw / 2, by - th);
        // Parte superior
        trunkPath.lineTo(cx + tw / 2, by - th);
        // Lado derecho curvo
        trunkPath.quadTo(cx + bw / 3, by - th * 0.5, cx + bw / 2, by);
        trunkPath.close();

        // 2. GENERADOR RECURSIVO (L-System con arcos)
        const generate = (x: number, y: number, angle: number, len: number, depth: number) => {
            if (depth > TREE_CONFIG.maxDepth) {
                blooms.push({ points: [[x, y], [x, y], [x, y]] }); // Placeholder for tip
                return;
            }

            // Calculamos dos ramas
            const angles = [angle - TREE_CONFIG.spreadBase - (Math.random() * 0.2), angle + TREE_CONFIG.spreadBase + (Math.random() * 0.2)];

            angles.forEach(ang => {
                const ex = x + Math.cos(ang) * len;
                const ey = y + Math.sin(ang) * len;

                // Punto de control para la curva (arqueada hacia afuera)
                const midX = x + (ex - x) * 0.5 + (Math.cos(ang + 0.4) * 10);
                const midY = y + (ey - y) * 0.5 + (Math.sin(ang + 0.4) * 10);

                const p = Skia.Path.Make();
                p.moveTo(x, y);
                p.quadTo(midX, midY, ex, ey);

                branches.push({ path: p, depth, points: [[x, y], [midX, midY], [ex, ey]] });

                // Si es el último nivel, el bloom va aquí
                if (depth === TREE_CONFIG.maxDepth) {
                    blooms.push({ points: [[x, y], [midX, midY], [ex, ey]] });
                }

                generate(ex, ey, ang, len * TREE_CONFIG.branchShrink, depth + 1);
            });
        };

        // Iniciamos el crecimiento desde el final del tronco
        // Varias ramas principales para densidad
        generate(cx, by - th, -Math.PI / 2 - 0.5, size * 0.18, 1);
        generate(cx, by - th, -Math.PI / 2 + 0.5, size * 0.18, 1);
        generate(cx, by - th * 0.8, -Math.PI / 2 - 1.2, size * 0.15, 2);
        generate(cx, by - th * 0.8, -Math.PI / 2 + 1.2, size * 0.15, 2);

        return { trunkPath, branches, blooms };
    }, [size]);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Canvas style={styles.canvas}>
                <Group opacity={growth}>
                    {/* Trunk */}
                    <Path path={treeData.trunkPath} color="white">
                        <Shadow dx={0} dy={0} blur={10} color="rgba(255,255,255,0.4)" />
                    </Path>

                    {/* Branches */}
                    {treeData.branches.map((b, i) => (
                        <Path
                            key={`branch-${i}`}
                            path={b.path}
                            color="rgba(255,255,255,0.7)"
                            style="stroke"
                            strokeWidth={Math.max(0.7, 3 - b.depth * 0.5)}
                            strokeCap="round"
                            start={0}
                            end={growth}
                        />
                    ))}

                    {/* Lights / Blooms */}
                    {treeData.blooms.map((bloom, i) => {
                        const isActive = isGuest ? (i % 5 === 0) : (i < daysPracticed * 2);
                        if (i > 100) return null; // Cap for performance
                        return (
                            <Bloom
                                key={`bloom-${i}`}
                                index={i}
                                points={bloom.points}
                                growAnim={growth}
                                isActive={isActive}
                                colors={{ accent: theme.colors.accent, primary: theme.colors.primary }}
                            />
                        );
                    })}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center' },
    canvas: { flex: 1, width: '100%', height: '100%' },
});

export default ResilienceTree;
