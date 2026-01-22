import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ImageBackground,
    StatusBar,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { IMAGES } from '../../constants/images';
import GGAssistant from '../../components/GGAssistant';
import { clearStorage } from '../../utils/storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.HOME
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { userState, updateUserState, isNightMode, setNightMode } = useApp();

    const handleStartSession = () => {
        navigation.navigate(Screen.TRANSITION_TUNNEL);
    };

    const handleClearStorage = async () => {
        Alert.alert('Limpiar Datos', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Limpiar',
                style: 'destructive',
                onPress: async () => {
                    await clearStorage();
                    if (Platform.OS === 'web') window.location.reload();
                },
            },
        ]);
    };

    const isRecovery = userState.hasMissedDay;
    const isDone = userState.isDailySessionDone;

    const assistantProps = useMemo(() => {
        if (isDone) return { title: 'Sesión Completada', message: 'Increíble trabajo hoy. Has fortalecido tu resiliencia.', type: 'default' as const };
        if (isRecovery) return { title: 'Prevención de Abandono', message: 'No pasa nada por perder un día. Lo importante es retomar hoy.', type: 'recovery' as const, actionLabel: 'Empezar 5 min' };
        if (isNightMode) return { title: 'Sugerencia Nocturna', message: 'Tu sistema nervioso está listo para desconectar.', type: 'night' as const, actionLabel: 'Empezar Sesión' };
        return { title: 'Informe Diario', message: `Hoy es tu ${userState.streak}º día consecutivo.`, type: 'default' as const, actionLabel: 'Empezar dosis diaria' };
    }, [isDone, isRecovery, isNightMode, userState.streak]);

    return (
        <SafeAreaView style={[styles.container, isNightMode && { backgroundColor: '#070A15' }]}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greetingLabel, isNightMode && { color: '#818CF8', fontWeight: '700' }]}>
                            {isNightMode ? '9:00 PM' : (isDone ? 'BIENVENIDO' : 'Buenos días,')}
                        </Text>
                        <View style={styles.nameRow}>
                            <Text style={styles.greetingText}>
                                {isNightMode ? 'Buenas noches, ' : (isDone ? `Hoy, ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : `Hola, `)}
                            </Text>
                            <Text style={styles.greetingName}>{userState.name}</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        {isNightMode && (
                            <View style={styles.nightModeBadge}>
                                <Ionicons name="moon" size={12} color="#818CF8" />
                                <Text style={styles.nightModeBadgeText}>MODO NOCHE</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Night State (Image 0 UI) */}
                {isNightMode && !isDone && !isRecovery ? (
                    <View style={styles.nightView}>
                        <Text style={styles.nightSubtitle}>Tu sistema nervioso está listo para desconectar.</Text>

                        <View style={styles.nightMainCard}>
                            <View style={styles.nightAsssitantHeader}>
                                <View style={styles.assistantAvatar}>
                                    <Ionicons name="desktop-outline" size={16} color="#FFF" />
                                </View>
                                <View style={styles.assistantTitleBlock}>
                                    <Text style={styles.assistantName}>G.G. Sugiere</Text>
                                    <Text style={styles.assistantContext}>Basado en tu actividad beta</Text>
                                </View>
                                <View style={styles.timeBadge}><Text style={styles.timeBadgeText}>10 MIN</Text></View>
                            </View>

                            <ImageBackground
                                source={{ uri: IMAGES.DAY }}
                                style={styles.nightHeroImage}
                                imageStyle={{ borderRadius: 16 }}
                            >
                                <View style={styles.audioBadge}>
                                    <Ionicons name="headset" size={14} color="#FFF" />
                                    <Text style={styles.audioBadgeText}>Audio Guiado</Text>
                                </View>
                            </ImageBackground>

                            <Text style={styles.nightLessonTitle}>Sesión Interoceptiva</Text>
                            <Text style={styles.nightLessonDesc}>
                                Es hora de preparar tu mente. Esta sesión ayudará a tu sistema nervioso a transicionar suavemente hacia el estado de reposo.
                            </Text>

                            <TouchableOpacity style={styles.nightActionBtn} onPress={handleStartSession}>
                                <Ionicons name="play-circle" size={24} color="#FFF" />
                                <Text style={styles.nightActionBtnText}>¿Empezamos?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.nightLink}>
                                <Text style={styles.nightLinkText}>Ver otras opciones</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.nightStatsGrid}>
                            <View style={styles.nightStatBox}>
                                <View style={styles.nightStatHeader}>
                                    <Ionicons name="pulse" size={16} color="#818CF8" />
                                    <View style={styles.percentBadge}><Text style={styles.percentText}>-15%</Text></View>
                                </View>
                                <Text style={styles.nightStatLabel}>Nivel de Estrés</Text>
                                <Text style={styles.nightStatValue}>Bajo</Text>
                            </View>
                            <View style={styles.nightStatBox}>
                                <View style={styles.nightStatHeader}>
                                    <Ionicons name="bed" size={16} color="#818CF8" />
                                </View>
                                <Text style={styles.nightStatLabel}>Tiempo sugerido</Text>
                                <Text style={styles.nightStatValue}>30m</Text>
                            </View>
                        </View>

                        <View style={styles.nightFactCard}>
                            <Ionicons name="sparkles" size={20} color="#818CF8" />
                            <View style={styles.nightFactContent}>
                                <Text style={styles.nightFactTitle}>Dato del día</Text>
                                <Text style={styles.nightFactText}>
                                    Tu variabilidad de frecuencia cardíaca (HRV) indica una recuperación óptima. Una meditación corta hoy maximizará tu sueño REM.
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : isDone ? (
                    /* Done State Implementation */
                    <View style={styles.doneView}>
                        <View style={styles.doneBtn}>
                            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                            <Text style={styles.doneBtnText}>Sesión Completada</Text>
                        </View>
                        <View style={styles.doneCard}>
                            <View style={styles.doneHeader}>
                                <View style={styles.doneAvatarSmall}><Ionicons name="apps" size={14} color={theme.colors.primary} /></View>
                                <Text style={styles.doneAssTitle}>G.G. DICE</Text>
                            </View>
                            <Text style={styles.doneQuote}>"Increíble trabajo hoy. Has fortalecido tu resiliencia."</Text>
                            <Text style={styles.doneSubQuote}>Descansa profundamente y permite que tu mente absorba la calma. Nos vemos mañana.</Text>
                        </View>
                        <View style={styles.nextHeader}>
                            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                            <Text style={styles.nextLabel}>PRÓXIMO PASO</Text>
                        </View>
                        <TouchableOpacity style={styles.nextCard}>
                            <View style={styles.lessonPreview}>
                                <Ionicons name="leaf" size={20} color="rgba(255,255,255,0.2)" />
                                <View style={styles.playDot}><Ionicons name="play" size={8} color="#000" /></View>
                            </View>
                            <View style={styles.nextInfo}>
                                <Text style={styles.nextMeta}>MAÑANA • 10 MIN</Text>
                                <Text style={styles.nextTitle}>Enfoque Profundo</Text>
                                <View style={styles.nextTag}><Ionicons name="settings" size={12} color={theme.colors.primary} /><Text style={styles.nextTagText}>Resiliencia Mental</Text></View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    </View>
                ) : isRecovery ? (
                    /* Recovery State Implementation */
                    <View style={styles.recoveryView}>
                        <View style={styles.recoveryCard}>
                            <View style={styles.recoveryHeader}>
                                <Ionicons name="leaf" size={18} color="#F97316" />
                                <Text style={styles.recoveryAssTitle}>G.G. ASSISTANT</Text>
                            </View>
                            <Text style={styles.recoveryMainMsg}>No pasa nada por perder un día. Lo importante es retomar hoy para mantener tu racha de resiliencia.</Text>
                            <TouchableOpacity style={styles.recoveryActionRow} onPress={handleStartSession}>
                                <Text style={styles.recoveryActionTxt}>¿Hacemos una sesión corta de 10 min?</Text>
                                <Ionicons name="arrow-forward" size={16} color="#F97316" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sectionHeading}>Tu Progreso</Text>
                        <View style={styles.progGrid}>
                            <View style={styles.progCell}>
                                <View style={styles.progHeader}><Text style={styles.progLabel}>Total Minutos</Text><Ionicons name="time" size={14} color="rgba(255,255,255,0.3)" /></View>
                                <Text style={styles.progVal}>320</Text>
                                <Text style={styles.progSubVal}>+12% esta semana</Text>
                            </View>
                            <View style={styles.progCell}>
                                <View style={styles.progHeader}><Text style={styles.progLabel}>Racha Actual</Text><Ionicons name="flame" size={14} color="#F97316" /></View>
                                <Text style={styles.progVal}>0 <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>días</Text></Text>
                                <Text style={styles.progSubVal}>¡Empieza de nuevo hoy!</Text>
                            </View>
                        </View>
                        <Text style={styles.sectionHeading}>Recomendado para ti</Text>
                        <TouchableOpacity style={styles.recCard} onPress={handleStartSession}>
                            <ImageBackground source={{ uri: IMAGES.RECOVERY }} style={styles.recImg} imageStyle={{ borderRadius: 24 }}>
                                <View style={styles.recDurationBadge}><Ionicons name="headset" size={12} color="#FFF" /><Text style={styles.recDurTxt}>10m</Text></View>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.recGradient}>
                                    <Text style={styles.recCat}>MINDFULNESS</Text>
                                    <Text style={styles.recTitle}>Retomando el camino</Text>
                                    <Text style={styles.recDesc}>Una meditación suave para perdonarte y volver a empezar si...</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Default State */
                    <View style={styles.defaultView}>
                        <GGAssistant title={assistantProps.title} message={assistantProps.message} type={assistantProps.type} actionLabel={assistantProps.actionLabel} onAction={handleStartSession} />
                        <TouchableOpacity style={styles.heroActionCard} onPress={handleStartSession}>
                            <ImageBackground source={{ uri: IMAGES.DAY }} style={styles.heroImg} imageStyle={{ borderRadius: 24 }}>
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
                                    <Text style={styles.heroTitle}>Iniciar Sesión Diaria</Text>
                                    <Text style={styles.heroSubtitle}>10 min • Enfoque y Claridad</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableOpacity>
                        <View style={styles.statsRowSmall}>
                            <View style={styles.statBoxSmall}><Text style={styles.statLabelSmall}>RACHA</Text><Text style={styles.statValueSmall}>{userState.streak} días</Text></View>
                            <View style={styles.statBoxSmall}><Text style={styles.statLabelSmall}>RESILIENCIA</Text><Text style={styles.statValueSmall}>{userState.resilienceScore}</Text></View>
                        </View>
                    </View>
                )}

                {/* Simulation Controls */}
                <View style={styles.devBar}>
                    <TouchableOpacity style={styles.devTab} onPress={() => setNightMode(!isNightMode)}>
                        <Text style={[styles.devTabText, isNightMode && { color: '#818CF8' }]}>MODO NOCHE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.devTab} onPress={() => updateUserState({ isDailySessionDone: !userState.isDailySessionDone })}>
                        <Text style={[styles.devTabText, isDone && { color: theme.colors.primary }]}>DÍA CUMPLIDO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.devTab} onPress={() => updateUserState({ hasMissedDay: !userState.hasMissedDay })}>
                        <Text style={[styles.devTabText, isRecovery && { color: '#F97316' }]}>DÍA PERDIDO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.devTab, { backgroundColor: 'rgba(255,0,0,0.1)' }]} onPress={handleClearStorage}>
                        <Text style={styles.devTabText}>RESET</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollView: { flex: 1 },
    content: { padding: 20, paddingBottom: 120 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    greetingLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
    nameRow: { flexDirection: 'row', marginTop: 4 },
    greetingText: { fontSize: 28, fontWeight: '700', color: '#FFF' },
    greetingName: { fontSize: 28, fontWeight: '900', color: '#FFF' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    nightModeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(129, 140, 248, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, gap: 6 },
    nightModeBadgeText: { fontSize: 9, fontWeight: '800', color: '#818CF8', letterSpacing: 1 },
    iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },

    /* NIGHT VIEW (IMAGE 0) */
    nightView: {},
    nightSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 25, fontWeight: '500' },
    nightMainCard: { backgroundColor: 'rgba(129, 140, 248, 0.05)', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.12)', marginBottom: 25 },
    nightAsssitantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    assistantAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#5850EC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    assistantTitleBlock: { flex: 1 },
    assistantName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
    assistantContext: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
    timeBadge: { backgroundColor: 'rgba(129, 140, 248, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    timeBadgeText: { fontSize: 10, fontWeight: '900', color: '#818CF8' },
    nightHeroImage: { height: 160, marginBottom: 20, padding: 15, justifyContent: 'flex-end' },
    audioBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    audioBadgeText: { fontSize: 11, color: '#FFF', fontWeight: '700' },
    nightLessonTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 12 },
    nightLessonDesc: { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 22, marginBottom: 25 },
    nightActionBtn: { backgroundColor: '#5850EC', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, gap: 10, marginBottom: 15 },
    nightActionBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    nightLink: { alignItems: 'center', paddingVertical: 10 },
    nightLinkText: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 14 },
    nightStatsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    nightStatBox: { flex: 1, backgroundColor: 'rgba(129, 140, 248, 0.03)', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    nightStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    percentBadge: { backgroundColor: 'rgba(74, 103, 65, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    percentText: { fontSize: 10, fontWeight: '900', color: theme.colors.primary },
    nightStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
    nightStatValue: { fontSize: 26, fontWeight: '800', color: '#FFF' },
    nightFactCard: { backgroundColor: 'rgba(129, 140, 248, 0.05)', borderRadius: 24, padding: 20, flexDirection: 'row', gap: 15, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.1)' },
    nightFactContent: { flex: 1 },
    nightFactTitle: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    nightFactText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },

    /* DONE VIEW */
    doneView: {},
    doneBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 25, gap: 10, marginBottom: 25 },
    doneBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    doneCard: { backgroundColor: 'rgba(74, 103, 65, 0.15)', borderRadius: 24, padding: 22, marginBottom: 25 },
    doneHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    doneAvatarSmall: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(74, 103, 65, 0.2)', justifyContent: 'center', alignItems: 'center' },
    doneAssTitle: { fontSize: 10, fontWeight: '900', color: theme.colors.primary, letterSpacing: 1 },
    doneQuote: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 8, lineHeight: 24 },
    doneSubQuote: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
    nextHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    nextLabel: { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },
    nextCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center' },
    lessonPreview: { width: 60, height: 60, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    playDot: { position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
    nextInfo: { flex: 1 },
    nextMeta: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.3)', marginBottom: 2 },
    nextTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', marginBottom: 4 },
    nextTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    nextTagText: { fontSize: 11, color: theme.colors.primary, fontWeight: '600' },

    /* RECOVERY VIEW */
    recoveryView: {},
    recoveryCard: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 22, borderLeftWidth: 4, borderLeftColor: '#F97316', marginBottom: 25 },
    recoveryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    recoveryAssTitle: { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
    recoveryMainMsg: { fontSize: 17, color: '#FFF', lineHeight: 24, marginBottom: 15, fontWeight: '500' },
    recoveryActionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    recoveryActionTxt: { fontSize: 14, color: '#F97316', fontWeight: '700' },
    sectionHeading: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 15, marginTop: 10 },
    progGrid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    progCell: { flex: 1, backgroundColor: theme.colors.surface, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    progHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    progLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
    progVal: { fontSize: 26, fontWeight: '900', color: '#FFF' },
    progSubVal: { fontSize: 11, color: theme.colors.primary, marginTop: 4, fontWeight: '600' },
    recCard: { height: 260, borderRadius: 24, overflow: 'hidden' },
    recImg: { flex: 1, padding: 20, justifyContent: 'space-between' },
    recDurationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    recDurTxt: { color: '#FFF', fontSize: 11, fontWeight: '800' },
    recGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 },
    recCat: { fontSize: 11, fontWeight: '900', color: theme.colors.primary, letterSpacing: 1, marginBottom: 4 },
    recTitle: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 6 },
    recDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },

    /* DEFAULT VIEW */
    defaultView: {},
    heroActionCard: { height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 20 },
    heroImg: { flex: 1 },
    heroGradient: { flex: 1, justifyContent: 'flex-end', padding: 20 },
    heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
    heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
    statsRowSmall: { flexDirection: 'row', gap: 12 },
    statBoxSmall: { flex: 1, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 16 },
    statLabelSmall: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)' },
    statValueSmall: { fontSize: 20, fontWeight: '800', color: '#FFF', marginTop: 2 },

    /* DEV PANEL */
    devBar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 50, opacity: 0.8 },
    devTab: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
    devTabText: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
});

export default HomeScreen;
