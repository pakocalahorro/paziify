import React, { useMemo } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

interface Props {
    center: { x: number; y: number };
    currentRadius: SharedValue<number>;
    pulse: SharedValue<number>;
}

const CosmosParticles: React.FC<Props> = ({ center, currentRadius, pulse }) => {
    const particles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * Math.PI * 2,
    })), []);

    return (
        <Group>
            {particles.map(({ id, angle }) => {
                const rotation = useDerivedValue(() => angle + pulse.value * Math.PI);
                const particleX = useDerivedValue(() => center.x + Math.cos(rotation.value) * currentRadius.value * 1.3);
                const particleY = useDerivedValue(() => center.y + Math.sin(rotation.value) * currentRadius.value * 1.3);
                const particleSize = useDerivedValue(() => 2 + Math.sin(pulse.value * Math.PI * 2 + id) * 1.5);

                return (
                    <Circle
                        key={`particle-${id}`}
                        cx={particleX}
                        cy={particleY}
                        r={particleSize}
                        color="rgba(255,255,255,0.8)"
                    />
                );
            })}
        </Group>
    );
};

export default CosmosParticles;
