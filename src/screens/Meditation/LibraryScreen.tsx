import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Screen, RootStackParamList, Session } from '../../types';
import { theme } from '../../constants/theme';
import SessionCard from '../../components/SessionCard';

type LibraryScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.LIBRARY
>;

interface Props {
    navigation: LibraryScreenNavigationProp;
}

const categories = ['Todo', '10-20 min', 'Sueño', 'Ansiedad', 'Foco'];

const sessions: Session[] = [
    { id: '1', title: 'Respiración Resonante', duration: 10, category: 'Ansiedad', isPlus: true, image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=400' },
    { id: '2', title: 'Escaneo Corporal', duration: 20, category: 'Sueño', isPlus: false, image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=400' },
    { id: '3', title: 'Compasión', duration: 15, category: 'Conexión', isPlus: false, image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400' },
    { id: '4', title: 'Sonidos Binaurales', duration: 30, category: 'Foco', isPlus: true, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400' },
    { id: '5', title: 'Meditación Guiada', duration: 15, category: 'Foco', isPlus: false, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400' },
    { id: '6', title: 'Relajación Profunda', duration: 25, category: 'Sueño', isPlus: true, image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=400' },
];

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
    const { userState } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSessionClick = (session: Session) => {
        navigation.navigate(Screen.TRANSITION_TUNNEL);
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
        <SafeAreaView style={styles.container}>
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
                data={sessions}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.sessionRow}
                contentContainerStyle={styles.sessionsList}
                renderItem={renderSessionCard}
                showsVerticalScrollIndicator={false}
            />
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
