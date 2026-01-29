import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.PROFILE
>;

interface Props {
    navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState, signOut } = useApp();

    const chartData = [20, 35, 45, 30, 50, 65, 55, 70, 85];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Text style={styles.headerTitle}>Tu Resiliencia</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate(Screen.NOTIFICATION_SETTINGS)}
                    >
                        <Ionicons name="settings-outline" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Resilience Score Circle */}
                <View style={styles.scoreContainer}>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreValue}>{userState.resilienceScore}</Text>
                        <Text style={styles.scoreLabel}>Excelente</Text>
                    </View>
                    <Text style={styles.scoreDescription}>
                        Tu línea base ha mejorado un{' '}
                        <Text style={styles.scoreHighlight}>12%</Text> este mes.
                    </Text>

                    {!userState.isPlusMember && (
                        <TouchableOpacity
                            style={styles.premiumBadge}
                            onPress={() => navigation.navigate(Screen.PAYWALL)}
                        >
                            <Ionicons name="sparkles" size={14} color="#000" />
                            <Text style={styles.premiumBadgeText}>DESCUBRIR PLUS</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Mood Improvement Chart */}
                <TouchableOpacity
                    style={styles.chartCard}
                    onPress={() => navigation.navigate(Screen.WEEKLY_REPORT)}
                    activeOpacity={0.8}
                >
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Mejora del Ánimo</Text>
                        <View style={styles.chartBadge}>
                            <Ionicons name="trending-up" size={12} color={theme.colors.primary} />
                            <Text style={styles.chartBadgeText}>+12%</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                    </View>

                    {/* Simple Bar Chart */}
                    <View style={styles.chart}>
                        {chartData.map((heightVal, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={[styles.bar, { height: `${heightVal}%` }]} />
                            </View>
                        ))}
                    </View>

                    <View style={styles.chartLabels}>
                        <Text style={styles.chartLabel}>Hace 30 días</Text>
                        <Text style={styles.chartLabel}>Hoy</Text>
                    </View>
                </TouchableOpacity>

                {/* Badges */}
                <View style={styles.badgesSection}>
                    <Text style={styles.sectionTitle}>Insignias</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.badgesList}
                    >
                        {/* Badge 1 */}
                        <View style={styles.badgeCard}>
                            <View style={[styles.badgeIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                                <Ionicons name="sunny" size={20} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.badgeTitle}>Calma Matutina</Text>
                                <Text style={styles.badgeSubtitle}>Racha de 7 días</Text>
                            </View>
                        </View>

                        {/* Badge 2 */}
                        <View style={styles.badgeCard}>
                            <View style={[styles.badgeIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                                <Ionicons name="boat" size={20} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={styles.badgeTitle}>El Ancla</Text>
                                <Text style={styles.badgeSubtitle}>30 Días</Text>
                            </View>
                        </View>

                        {/* Badge 3 - Locked */}
                        <View style={[styles.badgeCard, styles.badgeCardLocked]}>
                            <View style={[styles.badgeIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                <Ionicons name="lock-closed" size={20} color="rgba(255, 255, 255, 0.4)" />
                            </View>
                            <View>
                                <Text style={styles.badgeTitle}>Maestro Zen</Text>
                                <Text style={styles.badgeSubtitle}>???</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Privacy Note */}
                <View style={styles.privacyNote}>
                    <Ionicons name="lock-closed" size={10} color={theme.colors.textMuted} />
                    <Text style={styles.privacyText}>
                        Tus datos están encriptados y son privados.
                    </Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        Alert.alert(
                            "Cerrar Sesión",
                            "¿Estás seguro de que quieres salir?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                { text: "Salir", style: "destructive", onPress: signOut }
                            ]
                        );
                    }}
                >
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    headerSpacer: {
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    scoreCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 6,
        borderColor: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreDescription: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        maxWidth: 200,
        marginTop: theme.spacing.sm,
    },
    scoreHighlight: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    chartCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    chartBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    chartBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    chart: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 2,
    },
    barContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: `${theme.colors.primary}20`,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
    },
    chartLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
    },
    badgesSection: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.textMain,
        marginBottom: theme.spacing.md,
    },
    badgesList: {
        gap: theme.spacing.md,
    },
    badgeCard: {
        width: 140,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    badgeCardLocked: {
        opacity: 0.5,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    badgeSubtitle: {
        fontSize: 12,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    privacyText: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    premiumBadge: {
        backgroundColor: theme.colors.accent,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 16,
        gap: 6,
    },
    premiumBadgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    logoutButton: {
        marginTop: theme.spacing.xl,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    logoutText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default ProfileScreen;
