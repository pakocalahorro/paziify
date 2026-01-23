import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Session } from '../../types';
import { theme } from '../../constants/theme';
import SessionCard from '../../components/SessionCard';
import SessionPreviewModal from '../../components/SessionPreviewModal';
import { MEDITATION_SESSIONS, MeditationSession } from '../../data/sessionsData';

type LibraryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LIBRARY
>;

interface Props {
    navigation: LibraryScreenNavigationProp;
}

const categories = ['Todo', 'Ansiedad', 'Despertar', 'Sueño', 'Mindfulness', 'Resiliencia'];

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { userState } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    const convertToSession = (medSession: MeditationSession): Session => ({
        id: medSession.id,
        title: medSession.title,
        duration: medSession.durationMinutes,
        category: medSession.category.charAt(0).toUpperCase() + medSession.category.slice(1),
        isPlus: medSession.isPremium,
        image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=400',
    });

    const filteredSessions = useMemo(() => {
        let filtered = MEDITATION_SESSIONS;
        if (selectedCategory > 0) {
            const categoryName = categories[selectedCategory].toLowerCase();
            filtered = filtered.filter(s => s.category === categoryName);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query) ||
                s.moodTags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        return filtered.map(convertToSession);
    }, [selectedCategory, searchQuery]);

    const handleSessionClick = (session: Session) => {
        // Find the original meditation session
        const medSession = MEDITATION_SESSIONS.find(s => s.id === session.id);

        if (medSession) {
            setSelectedSession(medSession);
            setPreviewVisible(true);
        }
    };

    const handleStartSession = (session: MeditationSession) => {
        setPreviewVisible(false);
        // Check if premium and user is not premium
        if (session.isPremium && !userState.isPlusMember) {
            navigation.navigate(Screen.PAYWALL);
            return;
        }

        // Navigate to breathing timer with session ID
        navigation.navigate(Screen.TRANSITION_TUNNEL, { sessionId: session.id } as any);
    };

    const renderSessionCard = ({ item }: { item: Session }) => (
        <View style={styles.sessionCardWrapper}>
            <SessionCard
                session={item}
                onPress={handleSessionClick}
                isPlusMember={userState.isPlusMember}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Biblioteca</Text>
                <TouchableOpacity style={styles.academyButton}>
                    <Text style={styles.academyButtonText}>Ir a Academia TCC</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search-outline"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Encuentra claridad..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryButton,
                                selectedCategory === index && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(index)}
                        >
                            <Text
                                style={[
                                    styles.categoryButtonText,
                                    selectedCategory === index && styles.categoryButtonTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Sessions Grid */}
            <FlatList
                data={filteredSessions}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.sessionRow}
                contentContainerStyle={styles.sessionsList}
                renderItem={renderSessionCard}
                showsVerticalScrollIndicator={false}
            />

            <SessionPreviewModal
                isVisible={previewVisible}
                session={selectedSession}
                onClose={() => setPreviewVisible(false)}
                onStart={handleStartSession}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    academyButton: {
        borderWidth: 1,
        borderColor: `${theme.colors.accent}30`,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
    },
    academyButtonText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.accent,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    searchIcon: {
        marginRight: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.textMain,
        fontSize: 14,
        paddingVertical: theme.spacing.sm,
    },
    categoriesContainer: {
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    categoryButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: theme.spacing.sm,
    },
    categoryButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.textMuted,
    },
    categoryButtonTextActive: {
        color: '#FFFFFF',
    },
    sessionsList: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 100,
    },
    sessionRow: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    sessionCardWrapper: {
        width: '48%',
    },
});

export default LibraryScreen;
