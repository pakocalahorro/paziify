import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { COMMUNITY_POSTS, Post } from '../../data/socialData';

const CommunityScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [posts, setPosts] = useState<Post[]>(COMMUNITY_POSTS);

    const handleSupport = (postId: string) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, supportCount: post.supportCount + 1 }
                    : post
            )
        );
    };

    const renderPost = ({ item }: { item: Post }) => {
        let iconName: any = 'heart-outline';
        let iconColor = theme.colors.textMuted;

        if (item.category === 'achievement') {
            iconName = 'trophy-outline';
        } else if (item.category === 'thought') {
            iconName = 'bulb-outline';
        }

        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.userName}</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                    <Ionicons name={iconName} size={18} color={theme.colors.accent} />
                </View>

                <Text style={styles.postContent}>{item.content}</Text>

                <View style={styles.postFooter}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleSupport(item.id)}
                    >
                        <Ionicons name="leaf-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.actionText}>Dar Paz ({item.supportCount})</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textMuted} />
                        <Text style={styles.actionTextMuted}>Comentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Comunidad</Text>
                <Text style={styles.headerSubtitle}>No estás solo en esto. Nos apoyamos.</Text>
            </View>

            <View style={styles.tabsRow}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={styles.activeTabText}>Muro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Mis Post</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
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
        paddingBottom: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: 'rgba(74, 103, 65, 0.15)',
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    tabText: {
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    listContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
    postCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    avatarText: {
        color: theme.colors.accent,
        fontWeight: '700',
        fontSize: 18,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.textMain,
    },
    timestamp: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    postContent: {
        fontSize: 15,
        color: theme.colors.textMain,
        lineHeight: 22,
        marginBottom: theme.spacing.lg,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.03)',
        paddingTop: theme.spacing.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    actionTextMuted: {
        fontSize: 14,
        color: theme.colors.textMuted,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        backgroundColor: theme.colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default CommunityScreen;
