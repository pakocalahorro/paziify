import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const BIRD_COUNT = 15;

const SunriseBackground: React.FC = () => {
    // Bird system
    const birds = useMemo(() => {
        return Array.from({ length: BIRD_COUNT }).map(() => ({
            y: Math.random() * (height * 0.4), // Top 40% of screen
            xStart: Math.random() * width,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 15000 + 10000,
            anim: new Animated.Value(0),
            delay: Math.random() * 5000,
            direction: Math.random() > 0.5 ? 1 : -1, // 1 for right, -1 for left
        }));
    }, []);

    useEffect(() => {
        // Bird Animation
        birds.forEach(bird => {
            const animateBird = () => {
                bird.anim.setValue(0);
                Animated.sequence([
                    Animated.delay(bird.delay),
                    Animated.timing(bird.anim, {
                        toValue: 1,
                        duration: bird.speed,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ]).start(({ finished }) => {
                    if (finished) animateBird(); // Loop indefinido
                });
            };
            animateBird();
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Realistic Nature Background */}
            <Image
                source={require('../../../assets/nature_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* Subtle Overlay to blend with birds if needed, or ensuring text readability */}
            {/* Keeping it clean for now as requested "feel like being there" */}

            {/* Birds */}
            {birds.map((bird, i) => (
                <Animated.View
                    key={i}
                    style={[
                        styles.bird,
                        {
                            top: bird.y,
                            width: bird.size,
                            height: bird.size / 2, // Flattened specifically
                            transform: [
                                {
                                    translateX: bird.anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: bird.direction === 1 ? [-50, width + 50] : [width + 50, -50]
                                    })
                                },
                                {
                                    translateY: bird.anim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [0, -20, 0] // Arcing flight path
                                    })
                                }
                            ],
                            opacity: 0.6 // Slightly more subtle against real image
                        }
                    ]}
                />
            ))}

            {/* Optional Atmosphere/Sunbeams overlay if image isn't enough, but image is 8k so should be good */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },
    backgroundImage: {
        width: width,
        height: height,
        position: 'absolute',
    },
    bird: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 2,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    }
});

export default SunriseBackground;
