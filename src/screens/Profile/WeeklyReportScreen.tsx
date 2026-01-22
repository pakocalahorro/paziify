import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

type WeeklyReportScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.WEEKLY_REPORT
>;

interface Props {
    navigation: WeeklyReportScreenNavigationProp;
}

const WeeklyReportScreen: React.FC<Props> = ({ navigation }) => {
    const { userState } = useApp();

    const moodData = {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        datasets: [
            {
                data: [4, 5, 6, 5, 8, 7, 9],
                color: (opacity = 1) => `rgba(74, 103, 65, ${opacity})`, // primary
                strokeWidth: 3,
            },
        ],
    };

    const focusData = {
        labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
        datasets: [
            {
                data: [10, 20, 15, 30, 25, 40, 35],
            },
        ],
    };

    const chartConfig = {
        backgroundColor: theme.colors.surface,
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.colors.primary,
        },
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reporte Semanal</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-outline" size={22} color={theme.colors.textMuted} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Mood Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evolución del Bienestar</Text>
                    <View style={styles.chartCard}>
                        <LineChart
                            data={moodData}
                            width={screenWidth - 64}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </View>
                </View>

                {/* Stats Summary */}
                <View style={styles.statsSummary}>
                    <View style={styles.statLine}>
                        <Text style={styles.statLabel}>Tiempo Total</Text>
                        <Text style={styles.statValue}>{userState.totalMinutes || 0} min</Text>
                    </View>
                    <View style={styles.statLine}>
                        <Text style={styles.statLabel}>Sesiones</Text>
                        <Text style={styles.statValue}>12 completadas</Text>
                    </View>
                    <View style={styles.statLine}>
                        <Text style={styles.statLabel}>Mejor Racha</Text>
                        <Text style={styles.statValue}>{userState.streak} días</Text>
                    </View>
                </View>

                {/* Focus/Activity Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Minutos por Día</Text>
                    <View style={styles.chartCard}>
                        <BarChart
                            data={focusData}
                            width={screenWidth - 64}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`, // accent
                            }}
                            yAxisLabel=""
                            yAxisSuffix="m"
                            style={styles.chart}
                            fromZero
                        />
                    </View>
                </View>

                {/* Insights */}
                <View style={styles.insightBox}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="bulb-outline" size={20} color={theme.colors.accent} />
                        <Text style={styles.insightTitle}>Recomendación IA</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Has meditado más los Viernes. Parece que es cuando más necesitas desconectar. Prueba a adelantar tu sesión de mañana 10 minutos para aprovechar tu pico de atención.
                    </Text>
                </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    shareButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
    chartCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsSummary: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    statLabel: {
        fontSize: 16,
        color: theme.colors.textMuted,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    insightBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: theme.spacing.sm,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.accent,
        textTransform: 'uppercase',
    },
    insightText: {
        fontSize: 15,
        color: theme.colors.textMain,
        lineHeight: 22,
    },
});

export default WeeklyReportScreen;
