import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
import { BlurView } from 'expo-blur';

// 🎄 MASTER CONFIGURATION 
const TREE_CONFIG = {
    baseOffset: 30,
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

interface BloomProps {
    index: number;
    points: number[][];
    growAnim: SharedValue<number>;
    isActive: boolean;
    accentColor: string;
}

const Bloom: React.FC<BloomProps> = ({ index, points, growAnim, isActive, accentColor }) => {
    const pos = useDerivedValue(() => getBezierPoint(growAnim.value, points[0], points[1], points[2]));
    return (
        <Circle
            cx={pos.value.x}
            cy={pos.value.y}
            r={3 * growAnim.value}
            color={isActive ? "#FFF" : "rgba(255,255,255,0.05)"}
        >
            {isActive && (
                <Shadow dx={0} dy={0} blur={8} color={accentColor} />
            )}
            <LinearGradient
                start={vec(0, 0)}
                end={vec(10, 10)}
                colors={isActive ? ["#FFF", "rgba(255,255,255,0.8)"] : ["rgba(255,255,255,0.1)", "transparent"]}
            />
        </Circle>
    );
};

interface OasisTreeProps {
    daysPracticed?: number;
    totalSteps?: number;
    size?: number;
    accentColor?: string;
}

/**
 * Universal Generative Tree for PDS v3.0
 * Uses Shopify Skia to generate a fractal tree reflecting user growth.
 */
export const OasisTree: React.FC<OasisTreeProps> = ({
    daysPracticed = 15, // Default for showcase
    totalSteps = 30,
    size = 250,
    accentColor = "#2DD4BF"
}) => {
    const targetGrowth = 0.2 + (Math.min(daysPracticed / totalSteps, 1) * 0.8);
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

        // 1. TRUNK
        const trunkPath = Skia.Path.Make();
        const bw = size * TREE_CONFIG.trunkBaseWidth;
        const tw = size * TREE_CONFIG.trunkTopWidth;
        const th = size * TREE_CONFIG.trunkHeight;

        trunkPath.moveTo(cx - bw / 2, by);
        trunkPath.quadTo(cx - bw / 3, by - th * 0.5, cx - tw / 2, by - th);
        trunkPath.lineTo(cx + tw / 2, by - th);
        trunkPath.quadTo(cx + bw / 3, by - th * 0.5, cx + bw / 2, by);
        trunkPath.close();

        // 2. L-SYSTEM GENERATOR
        const generate = (x: number, y: number, angle: number, len: number, depth: number) => {
            if (depth > TREE_CONFIG.maxDepth) {
                blooms.push({ points: [[x, y], [x, y], [x, y]] });
                return;
            }

            const angles = [angle - TREE_CONFIG.spreadBase - (Math.random() * 0.2), angle + TREE_CONFIG.spreadBase + (Math.random() * 0.2)];

            angles.forEach(ang => {
                const ex = x + Math.cos(ang) * len;
                const ey = y + Math.sin(ang) * len;
                const midX = x + (ex - x) * 0.5 + (Math.cos(ang + 0.4) * 10);
                const midY = y + (ey - y) * 0.5 + (Math.sin(ang + 0.4) * 10);

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
    }, [size]);

    return (
        <BlurView intensity={25} tint="dark" style={[styles.container, { width: '100%', height: size + 40 }]}>
            <Text style={styles.title}>CRECIMIENTO ACUMULADO</Text>

            <Canvas style={{ width: size, height: size }}>
                <Group opacity={growth}>
                    {/* Trunk */}
                    <Path path={treeData.trunkPath} color="white">
                        <Shadow dx={0} dy={0} blur={10} color={`${accentColor}60`} />
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
                        const isActive = i < daysPracticed * 2;
                        if (i > 100) return null; // Cap
                        return (
                            <Bloom
                                key={`bloom-${i}`}
                                index={i}
                                points={bloom.points}
                                growAnim={growth}
                                isActive={isActive}
                                accentColor={accentColor}
                            />
                        );
                    })}
                </Group>
            </Canvas>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
    },
    title: {
        fontFamily: 'Outfit_800ExtraBold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        position: 'absolute',
        top: 20,
        textTransform: 'uppercase',
    },
});
