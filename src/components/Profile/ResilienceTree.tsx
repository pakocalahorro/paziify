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
    withRepeat,
    withSequence,
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
    // 🔥 Cálculos reactivos (Skia reacciona automáticamente a DerivedValues)
    const pos = useDerivedValue(() => getBezierPoint(growAnim.value, points[0], points[1], points[2]));
    const cx = useDerivedValue(() => pos.value.x);
    const cy = useDerivedValue(() => pos.value.y);
    
    // Efecto de Brillo Pulsante ("Respiración")
    const pulseAnim = useSharedValue(0.8);
    useEffect(() => {
        if (isActive) {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 1500 + (index % 500), easing: Easing.inOut(Easing.sin) }),
                    withTiming(0.8, { duration: 1500 + (index % 500), easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                true
            );
        }
    }, [isActive]);

    const bloomRadius = useDerivedValue(() => 8 * growAnim.value * (isActive ? pulseAnim.value : 1));
    const shadowBlur = useDerivedValue(() => 60 * pulseAnim.value); // Brillo equilibrado (v2.52.5)
    const lightColor = "#FFD700"; // Amarillo Oro vibrante

    return (
        <Circle
            cx={cx}
            cy={cy}
            r={bloomRadius}
            color={isActive ? "#FFF" : "rgba(255,255,255,0.05)"}
        >
            {isActive && (
                <Shadow 
                    dx={0} 
                    dy={0} 
                    blur={shadowBlur} 
                    color={lightColor} 
                />
            )}
            <LinearGradient
                start={vec(0, 0)}
                end={vec(10, 10)}
                colors={isActive ? ["#FFF", lightColor] : ["rgba(255,255,255,0.1)", "transparent"]}
            />
        </Circle>
    );
};

interface ResilienceTreeProps {
    daysPracticed?: number;
    totalSteps?: number; // New: To dynamize growth
    size?: number;
    isGuest?: boolean;
}

const ResilienceTree: React.FC<ResilienceTreeProps> = ({
    daysPracticed = 0,
    totalSteps = 30, // Default to legacy 30 days
    size = 250,
    isGuest = false
}) => {
    // Dynamize growth: (Practiced / Total) * 0.8 + 0.2 (base)
    const targetGrowth = isGuest ? 0.35 : 0.2 + (Math.min(daysPracticed / totalSteps, 1) * 0.8);
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
                        // 🌟 FÓRMULA DE ILUMINACIÓN PROPORCIONAL (v2.52.0)
                        // Para que el progreso sea visible al instante en retos cortos
                        let isActive = false;
                        if (!isGuest) {
                            if (totalSteps <= 3) {
                                // Reto 3 días: Encender ~33% de luces por día
                                isActive = i < (daysPracticed * 34);
                            } else if (totalSteps <= 7) {
                                // Reto 7 días: Encender ~14% de luces por día
                                isActive = i < (daysPracticed * 15);
                            } else {
                                // Reto 30 días: Encender gradualmente
                                isActive = i < (daysPracticed * 4);
                            }
                        } else {
                            // Guest mode
                            isActive = i % 8 === 0;
                        }

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
