import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ACADEMY_MODULES, ACADEMY_LESSONS, AcademyModule, Lesson } from '../../data/academyData';

type CBTAcademyScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.CBT_ACADEMY
>;

interface Props {
    navigation: CBTAcademyScreenNavigationProp;
}

const CBTAcademyScreen: React.FC<Props> = ({ navigation }) => {
    const { userState } = useApp();
    const completedLessons = userState.completedLessons || [];

    const renderLessonCard = ({ item }: { item: Lesson }) => {
        const isCompleted = completedLessons.includes(item.id);

        return (
            <TouchableOpacity
                style={styles.lessonCard}
                onPress={() => navigation.navigate(Screen.CBT_DETAIL, { lessonId: item.id })}
            >
                <View style={styles.lessonInfo}>
                    <View style={styles.lessonHeaderRow}>
                        <Text style={styles.lessonTitle}>{item.title}</Text>
                        {isCompleted && (
                            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                        )}
                    </View>
                    <Text style={styles.lessonDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.lessonFooter}>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
                            <Text style={styles.durationText}>{item.duration}</Text>
                        </View>
                        {item.isPlus && (
                            <View style={styles.plusBadge}>
                                <Text style={styles.plusText}>PLUS</Text>
                            </View>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
        );
    };

    const renderModule = (module: AcademyModule) => {
        const moduleLessons = ACADEMY_LESSONS.filter(l => l.moduleId === module.id);

        return (
            <View key={module.id} style={styles.moduleSection}>
                <View style={styles.moduleHeader}>
                    <View style={[styles.moduleIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                        <Ionicons name={module.icon as any} size={20} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text style={styles.moduleDesc}>{module.description}</Text>
                    </View>
                </View>

                {moduleLessons.map(lesson => (
                    <View key={lesson.id}>
                        {renderLessonCard({ item: lesson })}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Academia TCC</Text>
                <Text style={styles.headerSubtitle}>Herramientas para tu bienestar mental</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats Header */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{completedLessons.length}</Text>
                        <Text style={styles.statLab}>Lecciones</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statVal}>{Math.round((completedLessons.length / ACADEMY_LESSONS.length) * 100)}%</Text>
                        <Text style={styles.statLab}>Progreso</Text>
                    </View>
                </View>

                {ACADEMY_MODULES.map(renderModule)}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    statLab: {
        fontSize: 12,
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    moduleSection: {
        marginBottom: theme.spacing.xxl,
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    moduleIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    moduleDesc: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
    },
    lessonInfo: {
        flex: 1,
    },
    lessonHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textMain,
    },
    lessonDesc: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginBottom: 8,
        lineHeight: 18,
    },
    lessonFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 11,
        color: theme.colors.textMuted,
    },
    plusBadge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    plusText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#000',
    },
});

export default CBTAcademyScreen;
