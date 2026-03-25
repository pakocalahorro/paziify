import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    Group,
    Circle,
} from '@shopify/react-native-skia';
import {
    useSharedValue,
    withTiming,
    withRepeat,
    withSequence,
    useDerivedValue,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

// 🎄 CONFIGURACIÓN MAESTRA (Fase 4: Arquitectura Ligera - 72 hooks totales)
export const TREE_CONFIG = {
    baseOffset: 10,
    trunkBaseWidth: 0.12,
    trunkTopWidth: 0.03,
    trunkHeight: 0.38,
    maxDepth: 5,
    branchShrink: 0.78,
    spreadBase: 0.45,
    orbSize: 3,
};

const getBezierPoint = (t: number, p0: number[], p1: number[], p2: number[]) => {
    'worklet';
    const invT = 1 - t;
    return {
        x: invT * invT * p0[0] + 2 * invT * t * p1[0] + t * t * p2[0],
        y: invT * invT * p0[1] + 2 * invT * t * p1[1] + t * t * p2[1],
    };
};

/**
 * Componente "Lightweight" para las luces.
 * Solo usa 1 hook de posición (pos). El pulso y halo vienen de fuera.
 * 60 luces x 1 hook = 60 hooks (Perfectamente fluido para React Native).
 */
const BloomLight = ({ points, growth, pulse, halo, isActive, colors, glowOpacity }: any) => {
    // 🌟 REGLA DE HOOKS: Todos los hooks deben llamarse incondicionalmente al inicio
    const pos = useDerivedValue(() => getBezierPoint(growth.value, points[0], points[1], points[2]));
    
    // El aura responde al estado del componente + Fade-In global (Wow Effect)
    const opacity = useDerivedValue(() => (isActive && growth.value > 0.1) ? glowOpacity.value : 0);
    const cx = useDerivedValue(() => pos.value.x);
    const cy = useDerivedValue(() => pos.value.y);
    const haloRadiusLarge = useDerivedValue(() => 22 * halo.value);
    const haloRadiusMed = useDerivedValue(() => 12 * halo.value);
    const pulseRadius = useDerivedValue(() => 8 * pulse.value);

    // Si no está activo, retornamos null DESPUÉS de haber llamado a los hooks
    if (!isActive) return null;

    return (
        <Group opacity={opacity}>
            {/* Halo Exterior */}
            <Circle cx={cx} cy={cy} r={haloRadiusLarge} color={colors.haloOuter} />
            {/* Halo Medio */}
            <Circle cx={cx} cy={cy} r={haloRadiusMed} color={colors.halo}  />
            {/* Glow Central */}
            <Circle cx={cx} cy={cy} r={pulseRadius} color={colors.glow} />
            {/* Núcleo base permanente */}
            <Circle cx={cx} cy={cy} r={1.8} color={colors.core} />
        </Group>
    );
};

interface ResilienceTreeProps {
    lightPoints?: number;
    size?: number;
    isGuest?: boolean;
    hideBlooms?: boolean;
}

const ResilienceTree: React.FC<ResilienceTreeProps> = ({
    lightPoints = 0,
    size = 250,
    isGuest = false,
    hideBlooms = false
}) => {
    const [containerWidth, setContainerWidth] = useState(size);
    
    // Matemáticas del PRESTIGIO Y MAGIA (100 puntos = 1 Nivel de purpurina)
    const points = lightPoints || 0;
    const level = Math.floor(points / 100);
    const progressInLevel = points % 100;
    const targetGrowth = isGuest ? 0.35 : 0.2 + (Math.log(progressInLevel + 1) / Math.log(101)) * 0.8;
    
    // Carga la forma orgánica a 0 MILISEGUNDOS! (Sin estrés visual)
    const growth = useSharedValue(targetGrowth);
    const glowOpacity = useSharedValue(0);

    // Niveles de Consciencia y Aura Logarítmica
    const colors = useMemo(() => [
        { name: 'Shamatha', core: 'white', glow: 'rgba(255, 140, 0, 0.45)', halo: 'rgba(255, 100, 0, 0.15)', haloOuter: 'rgba(255, 80, 0, 0.07)' }, // Naranja
        { name: 'Vipassana', core: 'white', glow: 'rgba(0, 191, 255, 0.45)', halo: 'rgba(0, 150, 255, 0.15)', haloOuter: 'rgba(0, 100, 255, 0.07)' }, // Azul
        { name: 'Metta', core: 'white', glow: 'rgba(50, 205, 50, 0.45)', halo: 'rgba(50, 205, 50, 0.15)', haloOuter: 'rgba(50, 180, 50, 0.07)' }, // Verde
        { name: 'Bodhi', core: 'white', glow: 'rgba(138, 43, 226, 0.45)', halo: 'rgba(138, 43, 226, 0.15)', haloOuter: 'rgba(138, 43, 226, 0.07)' }, // Morado
        { name: 'Zen Absoluto', core: 'white', glow: 'rgba(255, 215, 0, 0.60)', halo: 'rgba(255, 215, 0, 0.20)', haloOuter: 'rgba(255, 215, 0, 0.10)' }, // Oro/Blanco
    ], []);
    const activeColor = colors[Math.min(level, 4)];

    // 🌟 POOL DE ANIMACIONES (Solo 6 patrones para ahorro masivo de hooks)
    const pulsePool = [
        useSharedValue(0.7), useSharedValue(0.8), useSharedValue(0.6),
        useSharedValue(0.9), useSharedValue(0.75), useSharedValue(0.65)
    ];
    const haloPool = [
        useSharedValue(0.5), useSharedValue(0.6), useSharedValue(0.4),
        useSharedValue(0.55), useSharedValue(0.45), useSharedValue(0.5)
    ];

    useEffect(() => {
        // En caso de reactividad real (UI ganando puntos in situ)
        growth.value = withTiming(targetGrowth, {
            duration: 1200,
            easing: Easing.out(Easing.exp),
        });
        
        // WOW EFFECT: Aparición paulatina del poder del usuario tras 0s de carga.
        glowOpacity.value = withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) });

        // Iniciamos el pool de animaciones globales
        pulsePool.forEach((p, i) => {
            p.value = withRepeat(
                withSequence(
                    withTiming(1.4, { duration: 1200 + (i * 150), easing: Easing.inOut(Easing.sin) }),
                    withTiming(0.6, { duration: 1200 + (i * 150), easing: Easing.inOut(Easing.sin) })
                ), -1, true
            );
        });
        haloPool.forEach((h, i) => {
            h.value = withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 2200 + (i * 200), easing: Easing.inOut(Easing.sin) }),
                    withTiming(0.4, { duration: 2200 + (i * 200), easing: Easing.inOut(Easing.sin) })
                ), -1, true
            );
        });

        return () => {
            cancelAnimation(growth);
            pulsePool.forEach(cancelAnimation);
            haloPool.forEach(cancelAnimation);
        };
    }, [targetGrowth]);

    // 1. Geometría estática
    const treeData = useMemo(() => {
        const cx = containerWidth / 2;
        const by = size - TREE_CONFIG.baseOffset;
        const branches: { path: any; depth: number; points: number[][] }[] = [];
        const blooms: { points: number[][] }[] = [];

        const trunkPath = Skia.Path.Make();
        const bw = size * TREE_CONFIG.trunkBaseWidth;
        const tw = size * TREE_CONFIG.trunkTopWidth;
        const th = size * TREE_CONFIG.trunkHeight;

        trunkPath.moveTo(cx - bw / 2, by);
        trunkPath.quadTo(cx - bw / 3, by - th * 0.5, cx - tw / 2, by - th);
        trunkPath.lineTo(cx + tw / 2, by - th);
        trunkPath.quadTo(cx + bw / 3, by - th * 0.5, cx + bw / 2, by);
        trunkPath.close();

        const generate = (x: number, y: number, angle: number, len: number, depth: number) => {
            if (depth > TREE_CONFIG.maxDepth) {
                blooms.push({ points: [[x, y], [x, y], [x, y]] });
                return;
            }

            const angles = [angle - TREE_CONFIG.spreadBase - (Math.random() * 0.1), angle + TREE_CONFIG.spreadBase + (Math.random() * 0.1)];
            angles.forEach(ang => {
                const ex = x + Math.cos(ang) * len;
                const ey = y + Math.sin(ang) * len;
                const midX = x + (ex - x) * 0.5 + (Math.cos(ang + 0.4) * 5);
                const midY = y + (ey - y) * 0.5 + (Math.sin(ang + 0.4) * 5);

                const p = Skia.Path.Make();
                p.moveTo(x, y);
                p.quadTo(midX, midY, ex, ey);
                branches.push({ path: p, depth, points: [[x, y], [midX, midY], [ex, ey]] });

                if (depth === TREE_CONFIG.maxDepth) {
                    blooms.push({ points: [[x, y], [midX, midY], [ex, ey]] });
                }
                generate(ex, ey, ang, len * TREE_CONFIG.branchShrink, depth + 1);
            });
        };

        generate(cx, by - th, -Math.PI / 2 - 0.5, size * 0.18, 1);
        generate(cx, by - th, -Math.PI / 2 + 0.5, size * 0.18, 1);
        generate(cx, by - th * 0.8, -Math.PI / 2 - 1.2, size * 0.15, 2);
        generate(cx, by - th * 0.8, -Math.PI / 2 + 1.2, size * 0.15, 2);

        return { trunkPath, branches, blooms };
    }, [size, containerWidth]);

    return (
        <View
            style={[styles.container, { width: '100%', height: size }]}
            onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                if (w > 0 && w !== containerWidth) setContainerWidth(w);
            }}
        >
            <Canvas style={StyleSheet.absoluteFill}>
                <Group opacity={growth}>
                    <Path path={treeData.trunkPath} color="white" />

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

                    {!hideBlooms && treeData.blooms.map((bloom, i) => {
                        let isActive = false;
                        if (!isGuest) {
                            const totalBlooms = treeData.blooms.length;
                            const bloomsToLight = level >= 4 ? totalBlooms : Math.floor((progressInLevel / 100) * totalBlooms);
                            isActive = points > 0 && i < Math.max(1, bloomsToLight);
                        } else {
                            isActive = i % 8 === 0;
                        }

                        if (i > 100) return null;

                        return (
                            <BloomLight 
                                key={`light-${i}`}
                                points={bloom.points}
                                growth={growth}
                                pulse={pulsePool[i % 6]}
                                halo={haloPool[i % 6]}
                                isActive={isActive}
                                colors={activeColor}
                                glowOpacity={glowOpacity}
                            />
                        );
                    })}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', overflow: 'visible' },
});

export default React.memo(ResilienceTree);
