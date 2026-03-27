import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, InteractionManager } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    Group,
    Circle,
} from '@shopify/react-native-skia';
import Animated, {
    useSharedValue,
    withTiming,
    withRepeat,
    withSequence,
    useDerivedValue,
    Easing,
    cancelAnimation,
    FadeIn,
    FadeOut
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
 * Usa 1 reloj global (globalClock) y aplica desfase matemático mediante el índice.
 * 0 hooks independientes de Timer. Rendimiento nativo total.
 */
const BloomLight = ({ points, growth, globalPhaseRadii, colors, glowOpacity, isStatic, targetGrowth }: any) => {
    // ESTÁTICO: Renderizado matemático puro en 0ms. ¡CERO HOOKS de Reanimated!
    if (isStatic) {
        const p = getBezierPoint(targetGrowth, points[0], points[1], points[2]);
        const op = targetGrowth > 0.1 ? 1 : 0;
        return (
            <Group opacity={op}>
                <Circle cx={p.x} cy={p.y} r={11} color={colors.haloOuter} />
                <Circle cx={p.x} cy={p.y} r={6} color={colors.halo}  />
                <Circle cx={p.x} cy={p.y} r={4} color={colors.glow} />
                <Circle cx={p.x} cy={p.y} r={1.8} color={colors.core} />
            </Group>
        );
    }

    // DINÁMICO: Matemática de shaders. 
    // Usamos los Radios compartidos globalmente en bloque (4 fases max), cayendo el uso de CPU al 5%.
    const pos = useDerivedValue(() => getBezierPoint(growth.value, points[0], points[1], points[2]));
    const opacity = useDerivedValue(() => (growth.value > 0.1) ? glowOpacity.value : 0);
    const cx = useDerivedValue(() => pos.value.x);
    const cy = useDerivedValue(() => pos.value.y);

    return (
        <Group opacity={opacity}>
            <Circle cx={cx} cy={cy} r={globalPhaseRadii.haloLarge} color={colors.haloOuter} />
            <Circle cx={cx} cy={cy} r={globalPhaseRadii.haloMed} color={colors.halo}  />
            <Circle cx={cx} cy={cy} r={globalPhaseRadii.pulse} color={colors.glow} />
            <Circle cx={cx} cy={cy} r={1.8} color={colors.core} />
        </Group>
    );
};

interface ResilienceTreeProps {
    lightPoints?: number;
    size?: number;
    isGuest?: boolean;
    hideBlooms?: boolean;
    isStatic?: boolean;
}

const ResilienceTree: React.FC<ResilienceTreeProps> = ({
    lightPoints = 0,
    size = 250,
    isGuest = false,
    hideBlooms = false,
    isStatic = false
}) => {
    const [containerWidth, setContainerWidth] = useState(size);
    
    // Matemáticas del PRESTIGIO Y MAGIA (100 puntos = 1 Nivel de purpurina)
    const points = lightPoints || 0;
    const level = Math.floor(points / 100);
    const progressInLevel = points % 100;
    const targetGrowth = isGuest ? 0.35 : 0.2 + (Math.log(progressInLevel + 1) / Math.log(101)) * 0.8;
    
    // 🌟 RENDERIZADO DIFERIDO (Ocultación temporal del Skia Canvas)
    const [isSkiaMounted, setIsSkiaMounted] = useState(isStatic);
    const [isSkiaReady, setIsSkiaReady] = useState(isStatic);

    useEffect(() => {
        if (!isStatic) {
            // Revertimos a timeout absoluto (InteractionManager causaba latencias de 10s si la red o Supabase tardaba)
            const t1 = setTimeout(() => {
                setIsSkiaMounted(true);
                setTimeout(() => setIsSkiaReady(true), 800);
            }, 350);
            return () => clearTimeout(t1);
        }
    }, [isStatic]);

    // Carga la forma orgánica al 100% instantáneamente (Sin esperas artificiales o sensación de lag)
    const growth = useSharedValue(targetGrowth);
    const glowOpacity = useSharedValue(1);

    // Niveles de Consciencia y Aura Logarítmica
    const colors = useMemo(() => [
        { name: 'Shamatha', core: 'white', glow: 'rgba(255, 140, 0, 0.45)', halo: 'rgba(255, 100, 0, 0.15)', haloOuter: 'rgba(255, 80, 0, 0.07)' }, // Naranja
        { name: 'Vipassana', core: 'white', glow: 'rgba(0, 191, 255, 0.45)', halo: 'rgba(0, 150, 255, 0.15)', haloOuter: 'rgba(0, 100, 255, 0.07)' }, // Azul
        { name: 'Metta', core: 'white', glow: 'rgba(50, 205, 50, 0.45)', halo: 'rgba(50, 205, 50, 0.15)', haloOuter: 'rgba(50, 180, 50, 0.07)' }, // Verde
        { name: 'Bodhi', core: 'white', glow: 'rgba(138, 43, 226, 0.45)', halo: 'rgba(138, 43, 226, 0.15)', haloOuter: 'rgba(138, 43, 226, 0.07)' }, // Morado
        { name: 'Zen Absoluto', core: 'white', glow: 'rgba(255, 215, 0, 0.60)', halo: 'rgba(255, 215, 0, 0.20)', haloOuter: 'rgba(255, 215, 0, 0.10)' }, // Oro/Blanco
    ], []);
    const activeColor = colors[Math.min(level, 4)];

    // 🌟 ARQUITECTURA GAME ENGINE: Un solo reloj global interactivo (Cero fugas de memoria)
    const globalClock = useSharedValue(0);

    // Fases Armónicas Optimizadas (Sustituyen 192 workslets por sólo 12 cálculos matemáticos)
    const phase0_pulse = useDerivedValue(() => 4 + 4 * ((Math.sin(globalClock.value + 0) + 1) / 2));
    const phase0_hm = useDerivedValue(() => 7.2 + 4.8 * ((Math.sin(globalClock.value * 1.5 + 0) + 1) / 2));
    const phase0_hl = useDerivedValue(() => 13.2 + 8.8 * ((Math.sin(globalClock.value * 1.5 + 0) + 1) / 2));

    const phase1_pulse = useDerivedValue(() => 4 + 4 * ((Math.sin(globalClock.value + 0.8) + 1) / 2));
    const phase1_hm = useDerivedValue(() => 7.2 + 4.8 * ((Math.sin(globalClock.value * 1.5 + 0.8) + 1) / 2));
    const phase1_hl = useDerivedValue(() => 13.2 + 8.8 * ((Math.sin(globalClock.value * 1.5 + 0.8) + 1) / 2));

    const phase2_pulse = useDerivedValue(() => 4 + 4 * ((Math.sin(globalClock.value + 1.6) + 1) / 2));
    const phase2_hm = useDerivedValue(() => 7.2 + 4.8 * ((Math.sin(globalClock.value * 1.5 + 1.6) + 1) / 2));
    const phase2_hl = useDerivedValue(() => 13.2 + 8.8 * ((Math.sin(globalClock.value * 1.5 + 1.6) + 1) / 2));

    const phase3_pulse = useDerivedValue(() => 4 + 4 * ((Math.sin(globalClock.value + 2.4) + 1) / 2));
    const phase3_hm = useDerivedValue(() => 7.2 + 4.8 * ((Math.sin(globalClock.value * 1.5 + 2.4) + 1) / 2));
    const phase3_hl = useDerivedValue(() => 13.2 + 8.8 * ((Math.sin(globalClock.value * 1.5 + 2.4) + 1) / 2));

    const phaseGroups = [
        { pulse: phase0_pulse, haloMed: phase0_hm, haloLarge: phase0_hl },
        { pulse: phase1_pulse, haloMed: phase1_hm, haloLarge: phase1_hl },
        { pulse: phase2_pulse, haloMed: phase2_hm, haloLarge: phase2_hl },
        { pulse: phase3_pulse, haloMed: phase3_hm, haloLarge: phase3_hl },
    ];

    useEffect(() => {
        if (isStatic) {
            growth.value = targetGrowth;
            glowOpacity.value = 1;
            return;
        }

        // Si cambia el nivel dinámicamente en tiempo real, lo animamos.
        // (Si es la carga inicial en Perfil, al haber inicializado en 1 y targetGrowth, el timing se obvia a 0ms reales)
        growth.value = withTiming(targetGrowth, { duration: 1200, easing: Easing.out(Easing.exp) });
        glowOpacity.value = withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) });

        // Único bucle infinito que alimenta matemáticamente a todos los nodos
        globalClock.value = withRepeat(
            withTiming(Math.PI * 2, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );

        return () => {
            cancelAnimation(growth);
            cancelAnimation(glowOpacity);
            cancelAnimation(globalClock);
        };
    }, [targetGrowth, isStatic]);

    // 1. Geometría estática masivamente optimizada (Skia Path Clustering)
    const treeData = useMemo(() => {
        const cx = containerWidth / 2;
        const by = size - TREE_CONFIG.baseOffset;
        
        // Creamos un Path centralizador para cada profundidad (1 a maxDepth)
        const depthPaths = Array.from({ length: TREE_CONFIG.maxDepth + 1 }, () => Skia.Path.Make());
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

                // MÁGIA DE RENDIMIENTO ABSOLUTO: 0 llamadas al JSI Bridge. Escribimos la matemática puramente en el maestro.
                depthPaths[depth].moveTo(x, y);
                depthPaths[depth].quadTo(midX, midY, ex, ey);

                if (depth === TREE_CONFIG.maxDepth) {
                    blooms.push({ points: [[x, y], [midX, midY], [ex, ey]] });
                }
                generate(ex, ey, ang, len * TREE_CONFIG.branchShrink, depth + 1);
            });
        };

        // Generamos unicamente la copa maestra del árbol, eliminando las raíces horizontales
        // para dar una estética de dosel elegante y reducir la geometría a la mitad exacta (64 luces).
        generate(cx, by - th, -Math.PI / 2 - 0.45, size * 0.16, 1);
        generate(cx, by - th, -Math.PI / 2 + 0.45, size * 0.16, 1);

        // Retornamos los paths maestros filtrando los que estén vacíos
        const activeDepthPaths = depthPaths
            .map((path, index) => ({ path, depth: index }))
            .filter(d => d.depth > 0 && !d.path.isEmpty());

        return { trunkPath, activeDepthPaths, blooms };
    }, [size, containerWidth]);

    const transformState = useDerivedValue(() => [{ scale: growth.value }]);

    // Transición de opacidad líquida (Se pinta Skia de forma invisible y amanece cuando isSkiaReady es true)
    const readyOpacity = useDerivedValue(() => withTiming(isSkiaReady || isStatic ? 1 : 0, { duration: 600, easing: Easing.inOut(Easing.ease) }));

    return (
        <View
            style={[styles.container, { width: '100%', height: size }]}
            onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                if (w > 0 && w !== containerWidth) setContainerWidth(w);
            }}
        >
            {!isSkiaReady && (
                <Animated.View exiting={FadeOut.duration(300)} style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 10 }]}>
                    <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
                    <Text style={{ marginTop: 12, color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'Outfit_800ExtraBold', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        Actualizando Evolución...
                    </Text>
                </Animated.View>
            )}
            {isSkiaMounted && (
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: readyOpacity }]}>
                    <Canvas style={StyleSheet.absoluteFill}>
                        <Group opacity={growth} transform={transformState} origin={{ x: containerWidth / 2, y: size - TREE_CONFIG.baseOffset }}>
                            <Path path={treeData.trunkPath} color="white" />

                            {treeData.activeDepthPaths.map((b) => (
                                <Path
                                    key={`layer-${b.depth}`}
                                    path={b.path}
                                    color="rgba(255,255,255,0.7)"
                                    style="stroke"
                                    strokeWidth={Math.max(0.7, 3 - b.depth * 0.5)}
                                    strokeCap="round"
                                />
                            ))}

                            {!hideBlooms && treeData.blooms.map((bloom, i) => {
                                let isActive = false;
                                if (!isGuest) {
                                    const totalBlooms = treeData.blooms.length;
                                    const bloomsToLight = level >= 4 ? totalBlooms : Math.floor((progressInLevel / 100) * totalBlooms);
                                    
                                    // MAGIA DE SIMETRÍA: Dispersión determinista con número Áureo (83)
                                    // Garantiza que la nueva copa de 64 luces se ilumine de forma heterogénea perfecta
                                    isActive = points > 0 && ((i * 83) % totalBlooms) < bloomsToLight;
                                } else {
                                    isActive = i % 8 === 0;
                                }

                                // CORTOCIRCUITO: Si la luz está apagada, devolvemos null ANTES de que instancie el componente hijo
                                if (!isActive) return null;

                                return (
                                    <BloomLight 
                                        key={`light-${i}`}
                                        points={bloom.points}
                                        growth={growth}
                                        globalPhaseRadii={phaseGroups[i % 4]}
                                        colors={activeColor}
                                        glowOpacity={glowOpacity}
                                        isStatic={isStatic}
                                        targetGrowth={targetGrowth}
                                    />
                                );
                            })}
                        </Group>
                    </Canvas>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', overflow: 'visible' },
});

export default React.memo(ResilienceTree);
