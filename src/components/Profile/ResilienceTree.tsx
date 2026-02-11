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
    Blur,
    Shadow,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    useDerivedValue,
    Easing,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface ResilienceTreeProps {
    daysPracticed?: number;
    size?: number;
    isGuest?: boolean;
}

const ResilienceTree: React.FC<ResilienceTreeProps> = ({ daysPracticed = 0, size = 250, isGuest = false }) => {
    // Growth factor (0.2 to 1) based on days practiced in the month (0 to 30)
    // Ensures the tree grows as the month progresses
    const targetGrowth = isGuest ? 0.4 : 0.2 + (Math.min(daysPracticed / 30, 1) * 0.8);
    const growth = useSharedValue(0.1);

    useEffect(() => {
        growth.value = withTiming(targetGrowth, {
            duration: 2000,
            easing: Easing.out(Easing.back(1.5)),
        });
    }, [targetGrowth]);

    // Calculate tree structure (recursive-like but flattened for Skia performance)
    const treeElements = useMemo(() => {
        const centerX = size / 2;
        const baseY = size - 50;

        // Trunk - Slightly curved
        const trunkPath = Skia.Path.Make();
        trunkPath.moveTo(centerX, baseY + 20);
        trunkPath.quadTo(centerX + 5, baseY - (size * 0.2), centerX, baseY - (size * 0.45));

        // Roots (Rounded with quadTo)
        const roots: { path: any }[] = [];
        const addRoot = (startX: number, startY: number, angle: number, length: number, depth: number) => {
            if (depth > 2) return;
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;

            const ctrlX = startX + Math.cos(angle - 0.2) * (length * 0.5);
            const ctrlY = startY + Math.sin(angle - 0.2) * (length * 0.5);

            const path = Skia.Path.Make();
            path.moveTo(startX, startY);
            path.quadTo(ctrlX, ctrlY, endX, endY);
            roots.push({ path });

            addRoot(endX, endY, angle + 0.5, length * 0.6, depth + 1);
            addRoot(endX, endY, angle - 0.5, length * 0.6, depth + 1);
        };

        // Radial roots
        for (let i = 0; i < 5; i++) {
            const angle = Math.PI / 3 + (i * Math.PI / 9);
            addRoot(centerX, baseY + 5, angle, 25, 0);
        }

        // Branches (Organic with quadTo)
        const branches: { path: any; delay: number }[] = [];

        const addBranch = (startX: number, startY: number, angle: number, length: number, depth: number, curveDir: number) => {
            if (depth > 4) return;

            // Calculate end point
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;

            // Control point for quadratic curve to create a rounded look
            const ctrlAngle = angle + (0.3 * curveDir);
            const ctrlX = startX + Math.cos(ctrlAngle) * (length * 0.5);
            const ctrlY = startY + Math.sin(ctrlAngle) * (length * 0.5);

            const path = Skia.Path.Make();
            path.moveTo(startX, startY);
            path.quadTo(ctrlX, ctrlY, endX, endY);

            branches.push({ path, delay: depth });

            const factor = 0.72;
            const spread = 0.5;

            // Adjust angles at higher depths to "pull" them inwards and round the canopy
            const inwardPull = depth > 2 ? (centerX - endX) * 0.001 : 0;

            addBranch(endX, endY, angle - spread + inwardPull, length * factor, depth + 1, -1);
            addBranch(endX, endY, angle + spread + inwardPull, length * factor, depth + 1, 1);

            if (depth < 2) {
                addBranch(endX, endY, angle + inwardPull, length * 0.5, depth + 2, 0);
            }
        };

        // Multi-level organic branching
        // Low
        addBranch(centerX, baseY - (size * 0.15), -Math.PI / 2 - 1.1, size * 0.14, 1, -1);
        addBranch(centerX, baseY - (size * 0.15), -Math.PI / 2 + 1.1, size * 0.14, 1, 1);

        // Mid
        addBranch(centerX, baseY - (size * 0.3), -Math.PI / 2 - 0.7, size * 0.18, 0, -1);
        addBranch(centerX, baseY - (size * 0.3), -Math.PI / 2 + 0.7, size * 0.18, 0, 1);

        // Crown - Lowered and restricted to prevent hitting "ceiling"
        addBranch(centerX, baseY - (size * 0.45), -Math.PI / 2 - 0.3, size * 0.18, 0, -1);
        addBranch(centerX, baseY - (size * 0.45), -Math.PI / 2 + 0.3, size * 0.18, 0, 1);

        return { trunkPath, branches, roots };
    }, [size]);

    // Animated values for drawing
    const bloomRadius = useDerivedValue(() => 4 * growth.value);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Canvas style={styles.canvas}>
                {/* Trunk */}
                <Group opacity={growth}>
                    {/* Roots - Subtle glow */}
                    {treeElements.roots.map((root, index) => (
                        <Path
                            key={`root-${index}`}
                            path={root.path}
                            color="rgba(255,255,255,0.5)"
                            style="stroke"
                            strokeWidth={4 - index}
                            strokeCap="round"
                        >
                            <Shadow dx={0} dy={0} blur={4} color="rgba(255,255,255,0.2)" />
                        </Path>
                    ))}

                    {/* Trunk - Stronger glow */}
                    <Path
                        path={treeElements.trunkPath}
                        color="rgba(255,255,255,0.95)"
                        style="stroke"
                        strokeWidth={10}
                        strokeCap="round"
                    >
                        <Shadow dx={0} dy={0} blur={8} color="rgba(255,255,255,0.4)" />
                    </Path>

                    {/* Branches - Enhanced luminosity */}
                    {treeElements.branches.map((branch, index) => (
                        <Path
                            key={index}
                            path={branch.path}
                            color="rgba(255,255,255,0.85)"
                            style="stroke"
                            strokeWidth={Math.max(1.5, 4 - (branch.delay * 0.6))}
                            strokeCap="round"
                        >
                            <Shadow dx={0} dy={0} blur={3} color="rgba(255,255,255,0.3)" />
                        </Path>
                    ))}

                    {/* Blooms (Circles at the end of branches) */}
                    {treeElements.branches.map((branch, index) => {
                        const lastPoint = branch.path.getLastPt();
                        // Bloom status based on days practiced (1 light per day)
                        // Limiting to 30 active blooms for the monthly challenge
                        const isActive = isGuest ? (index < 5) : (index < daysPracticed);

                        if (index >= 31) return null; // Ensure we only show ~30 lights for the month

                        return (
                            <Circle
                                key={`bloom-${index}`}
                                cx={lastPoint.x}
                                cy={lastPoint.y}
                                r={bloomRadius}
                                color={isActive ? "#FFF" : "rgba(255,255,255,0.05)"}
                            >
                                {isActive && (
                                    <Shadow
                                        dx={0}
                                        dy={0}
                                        blur={8}
                                        color={index % 3 === 0 ? theme.colors.accent : theme.colors.primary}
                                    />
                                )}
                                <LinearGradient
                                    start={vec(lastPoint.x - 5, lastPoint.y - 5)}
                                    end={vec(lastPoint.x + 5, lastPoint.y + 5)}
                                    colors={isActive
                                        ? [index % 3 === 0 ? theme.colors.accent : "#FFF", "#FFF"]
                                        : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                                />
                            </Circle>
                        );
                    })}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    canvas: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default ResilienceTree;
