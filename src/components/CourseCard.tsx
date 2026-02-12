import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Platform,
    TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Text as SkiaText, useFont, Skia, matchFont, BlurMask } from '@shopify/react-native-skia';
import { AcademyModule } from '../data/academyData';
import { theme } from '../constants/theme';

interface CourseCardProps {
    course: AcademyModule;
    onPress: (course: AcademyModule) => void;
    index?: number;
    isLargeCard?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

// Fallback font for measuring roughly
const fontFamily = Platform.select({ ios: "AvenirNext-CondensedBold", default: "serif" });

const SkiaDynamicText: React.FC<{ text: string; width: number; fontSize: number; color: string; category: string }> = ({ text, width, fontSize, color, category }) => {
    // Load local font file
    const font = useFont(require('../../assets/fonts/Oswald.ttf'), fontSize);

    const lines = useMemo(() => {
        if (!font) return [];
        const words = text.toUpperCase().split(' ');
        const result: string[] = [];
        let line = words[0];

        for (let i = 1; i < words.length; i++) {
            const testLine = line + ' ' + words[i];
            const metrics = font.getTextWidth(testLine);
            if (metrics > width * 0.95) { // 95% width safety
                result.push(line);
                line = words[i];
            } else {
                line = testLine;
            }
        }
        result.push(line);
        return result;
    }, [text, font, width]);

    if (!font) {
        return null;
    }

    const lineHeight = fontSize * 1.1;
    const totalHeight = lines.length * lineHeight;

    return (
        <Canvas style={{ width: width, height: totalHeight }}>
            {lines.map((line, index) => {
                const textWidth = font.getTextWidth(line);
                const x = (width - textWidth) / 2;
                const y = (index + 1) * lineHeight - (lineHeight * 0.2);

                return (
                    <React.Fragment key={index}>
                        {/* ANXIETY: Hollow (Stroke Only) */}
                        {category === 'anxiety' && (
                            <SkiaText
                                x={x} y={y} text={line} font={font}
                                color={color} style="stroke" strokeWidth={2}
                            />
                        )}

                        {/* PROFESSIONAL: Solid White (Container handles background) */}
                        {category === 'professional' && (
                            <SkiaText
                                x={x} y={y} text={line} font={font}
                                color="#FFFFFF" style="fill"
                            />
                        )}

                        {/* BASIC: Solid White (Same as Professional for now) */}
                        {category === 'basics' && (
                            <SkiaText
                                x={x} y={y} text={line} font={font}
                                color="#FFFFFF" style="fill"
                            />
                        )}

                        {/* GROWTH: White Fill + Color Stroke (Elegant Outlined) */}
                        {category === 'growth' && (
                            <>
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color={color} style="stroke" strokeWidth={4} opacity={0.5}
                                />
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color="#FFFFFF" style="fill"
                                />
                            </>
                        )}

                        {/* HEALTH: Color Fill + White Stroke (Duotone) */}
                        {category === 'health' && (
                            <>
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color="#FFFFFF" style="stroke" strokeWidth={3}
                                />
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color={color} style="fill"
                                />
                            </>
                        )}

                        {/* FAMILY: Soft (White Fill + Glow/Shadow) */}
                        {category === 'family' && (
                            <>
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color={color} style="stroke" strokeWidth={4} opacity={0.3}
                                >
                                    <BlurMask blur={4} style="normal" />
                                </SkiaText>
                                <SkiaText
                                    x={x} y={y} text={line} font={font}
                                    color="#FFFFFF" style="fill"
                                />
                            </>
                        )}
                    </ React.Fragment>
                );
            })}
        </Canvas>
    );
};


const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onPress,
    isLargeCard = false,
}) => {
    const [titleContainerLayout, setTitleContainerLayout] = useState({ width: 0, height: 0 });

    // Helper for category visuals
    const getCategoryDetails = (category: string) => {
        switch (category) {
            case 'growth': return { color: '#646CFF', icon: 'leaf-outline' };
            case 'professional': return { color: '#4FC3F7', icon: 'briefcase-outline' };
            case 'anxiety': return { color: '#FFA726', icon: 'rainy-outline' };
            case 'health': return { color: '#66BB6A', icon: 'fitness-outline' };
            case 'basics': return { color: '#F06292', icon: 'book-outline' };
            case 'family': return { color: '#FFB74D', icon: 'people-outline' };
            default: return { color: '#646CFF', icon: 'school-outline' };
        }
    };

    const { color, icon } = getCategoryDetails(course.category);
    // Determine container background opacity and style based on category
    const getContainerStyle = (category: string, baseColor: string) => {
        switch (category) {
            case 'anxiety': return { bg: 'transparent', border: baseColor, intensity: 0 }; // Hollow effect needs clear bg
            case 'professional': return { bg: 'rgba(0,0,0,0.85)', border: baseColor, intensity: 0 }; // Solid Dark Box
            case 'growth': return { bg: 'rgba(0,0,0,0.4)', border: baseColor, intensity: 20 }; // Standard Glass
            case 'health': return { bg: 'rgba(255,255,255,0.1)', border: '#FFF', intensity: 20 }; // Light Glass
            case 'family': return { bg: baseColor + '40', border: 'rgba(255,255,255,0.5)', intensity: 10 }; // Tinted Glass
            default: return { bg: 'rgba(0,0,0,0.5)', border: baseColor, intensity: 20 };
        }
    };

    const containerStyle = getContainerStyle(course.category, color);

    // We use Skia for ALL categories now
    const useSkia = true;

    return (
        <TouchableOpacity
            onPress={() => onPress(course)}
            activeOpacity={0.9}
            style={styles.largeContainer}
        >
            {/* Main Card Image */}
            <View style={[styles.largeImageWrapper, { borderColor: 'rgba(255,255,255,0.1)' }]}>
                <Image
                    source={{ uri: course.image }}
                    style={styles.largeImage}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                    style={StyleSheet.absoluteFill}
                />
            </View>

            {/* Top Header (Title) */}
            <View style={styles.topHeader}>
                <BlurView
                    intensity={containerStyle.intensity}
                    tint="dark"
                    style={[
                        styles.titleContainer,
                        {
                            borderColor: containerStyle.border,
                            backgroundColor: containerStyle.bg
                        }
                    ]}
                    onLayout={(e) => setTitleContainerLayout({
                        width: e.nativeEvent.layout.width - 40, // subtract padding
                        height: e.nativeEvent.layout.height
                    })}
                >
                    {/* "CURSO" Label + Icon */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 }}>
                        <Ionicons name="school" size={14} color={color} />
                        <Text style={{ color: color, fontSize: 12, fontWeight: '900', letterSpacing: 1.5 }}>CURSO</Text>
                    </View>

                    {/* Native Text (Spacer / Fallback) - Always invisible now as Skia covers it */}
                    <Text
                        style={[
                            styles.largeTitle,
                            {
                                fontFamily: Platform.OS === 'ios' ? 'AvenirNext-CondensedBold' : 'sans-serif-condensed',
                                fontWeight: 'bold',
                                fontSize: 40,
                                lineHeight: 44,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                opacity: 0 // Completely invisible, just for sizing
                            }
                        ]}
                        numberOfLines={3}
                    >
                        {course.title.toUpperCase()}
                    </Text>

                    {/* Skia Effect Layer */}
                    {titleContainerLayout.width > 0 && (
                        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', paddingTop: 26 }]}>
                            {/* paddingTop compensates for the CURSO label space roughly */}
                            <SkiaDynamicText
                                text={course.title}
                                width={titleContainerLayout.width}
                                fontSize={40}
                                color={color}
                                category={course.category}
                            />
                        </View>
                    )}

                    <View style={styles.authorRow}>
                        <Ionicons name="mic-outline" size={12} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.largeAuthor}>{course.author || 'Paziify Team'}</Text>
                    </View>
                </BlurView>
            </View>

            {/* Bottom Info Card */}
            <BlurView intensity={40} tint="dark" style={styles.largeInfoCard}>
                <View style={styles.largeHeaderRow}>
                    <View style={[styles.categoryBadge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
                        <Ionicons name={icon as any} size={12} color={color} />
                        <Text style={[styles.categoryText, { color }]}>{course.category.toUpperCase()}</Text>
                    </View>
                    <View style={styles.durationRow}>
                        <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.5)" style={{ marginRight: 4 }} />
                        <Text style={styles.durationText}>{course.duration}</Text>
                    </View>
                </View>

                <View style={styles.spacer} />

                {/* Large Enter Button */}
                <View style={styles.largeFooter}>
                    <View style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>ENTRAR AL CURSO</Text>
                        <Ionicons name="arrow-forward" size={14} color="#000" />
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    largeContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeImageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        backgroundColor: '#1A1A1A',
    },
    largeImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    topHeader: {
        position: 'absolute',
        top: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    titleContainer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        maxWidth: '85%',
        overflow: 'hidden',
        minHeight: 80, // Ensure height for Skia
        justifyContent: 'center'
    },
    largeTitle: {
        color: '#FFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        textAlign: 'center',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 4,
    },
    largeAuthor: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    largeInfoCard: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        padding: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    largeHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        gap: 6,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    durationText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 11,
        fontWeight: '600',
    },
    spacer: {
        height: 4,
    },
    largeFooter: {
        width: '100%',
    },
    actionButton: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    actionButtonText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    }
});

export default CourseCard;
