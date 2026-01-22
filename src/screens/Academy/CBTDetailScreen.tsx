import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ACADEMY_LESSONS } from '../../data/academyData';

type CBTDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.CBT_DETAIL
>;

type CBTDetailScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.CBT_DETAIL
>;

interface Props {
    navigation: CBTDetailScreenNavigationProp;
    route: CBTDetailScreenRouteProp;
}

const CBTDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { lessonId } = route.params;
    const { userState, updateUserState } = useApp();
    const lesson = ACADEMY_LESSONS.find(l => l.id === lessonId);

    if (!lesson) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lección no encontrada</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isCompleted = userState.completedLessons?.includes(lessonId);

    const handleComplete = () => {
        if (!isCompleted) {
            const currentCompleted = userState.completedLessons || [];
            updateUserState({
                completedLessons: [...currentCompleted, lessonId],
                resilienceScore: Math.min(userState.resilienceScore + 5, 100),
            });
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
                    <Text style={styles.headerSubtitle}>{lesson.duration} de lectura</Text>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social-outline" size={22} color={theme.colors.textMuted} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Markdown style={markdownStyles}>
                    {lesson.content.trim()}
                </Markdown>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.completeButton, isCompleted && styles.completedButton]}
                        onPress={handleComplete}
                    >
                        <Text style={styles.buttonText}>
                            {isCompleted ? 'Lección Completada' : 'Marcar como Leída'}
                        </Text>
                        {!isCompleted && (
                            <Text style={styles.rewardText}>+5 resiliencia</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const markdownStyles: any = {
    body: {
        color: theme.colors.textMain,
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        color: theme.colors.textMain,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
    },
    heading2: {
        color: theme.colors.textMain,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 24,
    },
    paragraph: {
        marginBottom: 16,
    },
    strong: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    blockquote: {
        backgroundColor: 'rgba(74, 103, 65, 0.1)',
        borderLeftColor: theme.colors.primary,
        borderLeftWidth: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 16,
        borderRadius: 4,
    },
    bullet_list: {
        marginBottom: 16,
    },
    list_item: {
        marginBottom: 8,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerInfo: {
        flex: 1,
        marginHorizontal: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    headerSubtitle: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    shareButton: {
        padding: 4,
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    footer: {
        marginTop: theme.spacing.xxl,
        marginBottom: theme.spacing.xl,
    },
    completeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    rewardText: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    errorText: {
        color: theme.colors.textMain,
        fontSize: 18,
    },
    backLink: {
        color: theme.colors.primary,
        marginTop: 16,
        fontSize: 16,
    },
});

export default CBTDetailScreen;
