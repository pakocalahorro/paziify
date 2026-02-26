import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ACADEMY_MODULES, ACADEMY_LESSONS, AcademyModule, Lesson } from '../../data/academyData';
import { AcademyService } from '../../services/AcademyService';

type AcademyCourseDetailNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.ACADEMY_COURSE_DETAIL
>;

type AcademyCourseDetailRouteProp = RouteProp<
    RootStackParamList,
    Screen.ACADEMY_COURSE_DETAIL
>;

interface Props {
    navigation: AcademyCourseDetailNavigationProp;
    route: AcademyCourseDetailRouteProp;
}

const AcademyCourseDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { courseId } = route.params;
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const completedLessons = userState.completedLessons || [];

    const [module, setModule] = React.useState<AcademyModule | null>(null);
    const [moduleLessons, setModuleLessons] = React.useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const [mod, lessons] = await Promise.all([
                    AcademyService.getModuleById(courseId),
                    AcademyService.getLessonsByModuleId(courseId)
                ]);
                setModule(mod);
                setModuleLessons(lessons);
            } catch (error) {
                console.error("Error loading course details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="refresh" size={30} color="white" style={{ marginBottom: 10 }} />
                <Text style={{ color: 'white' }}>Cargando curso...</Text>
            </View>
        );
    }

    if (!module) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white', marginTop: 100, textAlign: 'center' }}>Curso no encontrado</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: 'white', textAlign: 'center' }}>Volver</Text></TouchableOpacity>
            </View>
        )
    }

    const renderLessonCard = ({ item, index }: { item: Lesson; index: number }) => {
        const isCompleted = completedLessons.includes(item.id);

        // Lock logic: Lock if previous lesson not completed (optional, strict mode)
        // For now, let's keep it open or just visual check
        const isLocked = index > 0 && !completedLessons.includes(moduleLessons[index - 1].id);
        // Relaxing lock for pilot: Open if user has access to module. 
        // Let's implement sequential locking for better gamification?
        // User asked for "standard interface". Let's stick to open for now or simple sequential.

        return (
            <TouchableOpacity
                style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
                onPress={() => navigation.navigate(Screen.CBT_DETAIL, {
                    lessonId: item.id,
                    lessonData: item // Prop-Passing (Zero Egress 2.0)
                })}
                disabled={false} // Allow peeking or disabled? Let's allow clicking for now or implement lock.
            >
                <View style={styles.lessonNumberBadge}>
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>

                <View style={styles.lessonInfo}>
                    <View style={styles.lessonHeaderRow}>
                        <Text style={[styles.lessonTitle, isCompleted && { color: theme.colors.success }]}>
                            {item.title}
                        </Text>
                        {isCompleted && (
                            <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                        )}
                    </View>
                    <Text style={styles.lessonDesc} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.lessonFooter}>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                            <Text style={styles.durationText}>{item.duration}</Text>
                        </View>
                    </View>
                </View>

                <Ionicons name={isCompleted ? "play-circle" : "play-circle-outline"} size={32} color={theme.colors.textMuted} />
            </TouchableOpacity>
        );
    };

    const renderExamCard = (totalLessons: number) => {
        const completedCount = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
        const isLocked = completedCount < totalLessons;

        return (
            <TouchableOpacity
                style={[styles.examCard, isLocked && { opacity: 0.6 }]}
                onPress={() => {
                    if (!isLocked) {
                        navigation.navigate(Screen.CBT_QUIZ, { courseId });
                    }
                }}
                disabled={isLocked}
            >
                <LinearGradient
                    colors={isLocked ? ['#333', '#222'] : [theme.colors.primary, theme.colors.accent]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.examGradient}
                >
                    <View style={styles.examContent}>
                        <View style={styles.examTextContainer}>
                            <Text style={styles.examTitle}>🏆 EXAMEN FINAL</Text>
                            <Text style={styles.examDesc}>
                                {isLocked
                                    ? `Completa las ${totalLessons} lecciones para desbloquear.`
                                    : 'Demuestra lo aprendido y obtén tu certificado.'}
                            </Text>
                        </View>
                        {isLocked ? (
                            <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.5)" />
                        ) : (
                            <Ionicons name="trophy" size={24} color="#FFF" />
                        )}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header Image Background (Animated for Shared Element Transition) */}
            <Animated.View
                {...({ sharedTransitionTag: `course.image.${courseId}` } as any)}
                style={styles.headerImage}
            >
                <Image
                    source={typeof module.image === 'string' ? { uri: module.image } : module.image as any}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                    transition={1000}
                    cachePolicy="memory-disk"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', '#020617']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.headerSafeArea}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                </SafeAreaView>
            </Animated.View>

            <ScrollView contentContainerStyle={styles.scrollContent} style={{ marginTop: -40 }}>
                <View style={styles.courseInfoContainer}>
                    <Text style={styles.categoryTag}>{module.category.toUpperCase()}</Text>
                    <Text style={styles.courseTitle}>{module.title}</Text>
                    <Text style={styles.courseAuthor}>Paziify Team</Text>
                    {module.author && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                            <Ionicons name="mic-outline" size={16} color="rgba(255,255,255,0.7)" style={{ marginRight: 6 }} />
                            <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Guía: {module.author}</Text>
                        </View>
                    )}
                    <Text style={styles.courseDesc}>{module.description}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="list" size={16} color={theme.colors.textMuted} />
                            <Text style={styles.statText}>{moduleLessons.length} Lecciones</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="time" size={16} color={theme.colors.textMuted} />
                            <Text style={styles.statText}>{module.duration}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.lessonsList}>
                    <Text style={styles.sectionTitle}>Contenido del Curso</Text>
                    {moduleLessons.map((lesson, index) => (
                        <View key={lesson.id}>
                            {renderLessonCard({ item: lesson, index })}
                        </View>
                    ))}
                </View>

                {/* Exam Section */}
                <View style={styles.examSection}>
                    {renderExamCard(moduleLessons.length)}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Dark background matching Audiobooks
    },
    headerImage: {
        width: '100%',
        height: 300,
        justifyContent: 'flex-start',
    },
    headerSafeArea: {
        marginLeft: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    courseInfoContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    categoryTag: {
        color: theme.colors.accent,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
    },
    courseTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    courseAuthor: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
    },
    courseDesc: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 22,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',
    },
    statText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    lessonsList: {
        paddingHorizontal: 20,
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    lessonCardLocked: {
        opacity: 0.5,
    },
    lessonNumberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    lessonNumberText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
    },
    lessonInfo: {
        flex: 1,
        marginRight: 12,
    },
    lessonHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    lessonDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 6,
    },
    lessonFooter: {
        flexDirection: 'row',
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
    },

    // Exam
    examSection: {
        paddingHorizontal: 20,
        marginTop: 12,
    },
    examCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    examGradient: {
        padding: 20,
    },
    examContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    examTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    examTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    examDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
});

export default AcademyCourseDetailScreen;
