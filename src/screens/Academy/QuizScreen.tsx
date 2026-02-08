import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { ACADEMY_QUIZZES } from '../../data/quizData';

type QuizScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.CBT_QUIZ
>;

type QuizScreenRouteProp = RouteProp<
    RootStackParamList,
    Screen.CBT_QUIZ
>;

interface Props {
    navigation: QuizScreenNavigationProp;
    route: QuizScreenRouteProp;
}

const { width } = Dimensions.get('window');

const QuizScreen: React.FC<Props> = ({ navigation, route }) => {
    const { courseId } = route.params;
    const { userState, updateUserState } = useApp();
    const quiz = ACADEMY_QUIZZES[courseId];

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    if (!quiz) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Error: Examen no encontrado</Text>
            </View>
        );
    }

    const currentQuestion = quiz.questions[currentQIndex];
    const progress = ((currentQIndex) / quiz.questions.length) * 100;
    const isPassed = score >= quiz.passingScore;

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer

        setSelectedOption(index);
        const isCorrect = index === currentQuestion.correctIndex;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Auto advance after short delay
        setTimeout(() => {
            if (currentQIndex < quiz.questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setQuizCompleted(true);
            }
        }, 1500);
    };

    const handleFinish = () => {
        if (isPassed) {
            // Save certificate logic here
            // For now just add resilience
            updateUserState({
                resilienceScore: Math.min(userState.resilienceScore + 20, 100)
            });
        }
        navigation.goBack();
    };

    const handleRetry = () => {
        setCurrentQIndex(0);
        setScore(0);
        setSelectedOption(null);
        setQuizCompleted(false);
    };

    if (quizCompleted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.resultContainer}>
                    {isPassed ? (
                        <>
                            {/* Animation placeholder */}
                            <Ionicons name="trophy" size={80} color={theme.colors.accent} />
                            <Text style={styles.resultTitle}>¡Felicidades!</Text>
                            <Text style={styles.resultSubtitle}>Has completado el curso{'\n'}"{quiz.title}"</Text>

                            <View style={styles.certificateCard}>
                                <Text style={styles.certName}>{userState.name || 'Estudiante'}</Text>
                                <View style={styles.certDivider} />
                                <Text style={styles.certCourse}>MAESTRÍA EN ANSIEDAD</Text>
                                <Text style={styles.certDate}>{new Date().toLocaleDateString()}</Text>
                            </View>

                            <Text style={styles.scoreText}>Puntuación: {score}/{quiz.questions.length}</Text>

                            <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
                                <Text style={styles.buttonText}>Recoger Certificado (+20 R)</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textMuted} />
                            <Text style={styles.resultTitle}>Casi lo tienes</Text>
                            <Text style={styles.resultSubtitle}>Necesitas {quiz.passingScore} aciertos para aprobar.</Text>
                            <Text style={styles.scoreText}>Puntuación: {score}/{quiz.questions.length}</Text>

                            <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
                                <Text style={styles.buttonText}>Intentarlo de nuevo</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header / Progress */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={theme.colors.textMain} />
                </TouchableOpacity>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{currentQIndex + 1}/{quiz.questions.length}</Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => {
                    let optionStyle = styles.optionCard;
                    let iconName = "radio-button-off";
                    let iconColor = theme.colors.textMuted;

                    if (selectedOption !== null) {
                        if (index === currentQuestion.correctIndex) {
                            optionStyle = styles.optionCorrect;
                            iconName = "checkmark-circle";
                            iconColor = theme.colors.success;
                        } else if (index === selectedOption) {
                            optionStyle = styles.optionWrong;
                            iconName = "close-circle";
                            iconColor = theme.colors.error;
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            style={optionStyle}
                            onPress={() => handleOptionSelect(index)}
                            disabled={selectedOption !== null}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                            <Ionicons name={iconName as any} size={24} color={iconColor} />
                        </TouchableOpacity>
                    );
                })}
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.md,
    },
    closeButton: {
        padding: 4,
    },
    progressBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    progressText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '700',
    },
    questionContainer: {
        padding: theme.spacing.xl,
        marginTop: theme.spacing.lg,
    },
    questionText: {
        color: theme.colors.textMain,
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 30,
        textAlign: 'center',
    },
    optionsContainer: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    optionCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    optionCorrect: {
        backgroundColor: 'rgba(74, 103, 65, 0.2)', // Green tint
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.success,
    },
    optionWrong: {
        backgroundColor: 'rgba(231, 76, 60, 0.2)', // Red tint
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.error,
    },
    optionText: {
        color: theme.colors.textMain,
        fontSize: 16,
        flex: 1,
        marginRight: 12,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    resultTitle: {
        color: theme.colors.textMain,
        fontSize: 32,
        fontWeight: '700',
        marginTop: 24,
        textAlign: 'center',
    },
    resultSubtitle: {
        color: theme.colors.textMuted,
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    scoreText: {
        color: theme.colors.textMain,
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 24,
    },
    certificateCard: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.accent,
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    certName: {
        color: theme.colors.textMain,
        fontSize: 24,
        fontFamily: 'serif', // Trying to look distinct
        fontWeight: 'bold',
    },
    certDivider: {
        width: 40,
        height: 2,
        backgroundColor: theme.colors.accent,
        marginVertical: 12,
    },
    certCourse: {
        color: theme.colors.accent,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
    },
    certDate: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginTop: 8,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default QuizScreen;
