import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

interface HomeUserProfileProps {
    user: any;
    greeting: string;
    userState: any;
    visualMode: 'healing' | 'growth';
    onRetoPress: () => void;
    pulseStyle: any;
    pulseOpacityStyle: any;
}

export const HomeUserProfile: React.FC<HomeUserProfileProps> = ({
    user, greeting, userState, visualMode, onRetoPress, pulseStyle, pulseOpacityStyle
}) => {
    return (
        <View style={styles.header}>
            <View style={styles.greetingRow}>
                <Text style={styles.greeting}>{greeting}</Text>
                <TouchableOpacity
                    style={styles.retoButton}
                    onPress={onRetoPress}
                    activeOpacity={0.8}
                >
                    <Animated.View style={pulseStyle}>
                        <Ionicons
                            name={userState.activeChallenge ? "flash" : "trophy-outline"}
                            size={16}
                            color="#FFF"
                        />
                    </Animated.View>
                    <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800', fontFamily: 'Outfit_800ExtraBold' }}>
                        {userState.activeChallenge ? "RETO ACTIVO" : "RETO DIARIO"}
                    </Text>
                    {/* Shadow Pulse Effect */}
                    {!userState.activeChallenge && (
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    backgroundColor: 'rgba(212, 175, 55, 0.4)',
                                    borderRadius: 20,
                                    zIndex: -1
                                },
                                pulseOpacityStyle
                            ]}
                        />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.userProfileRow}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={user?.avatar_url || 'https://paziify.app/placeholder-user.jpg'}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={500}
                    />
                </View>
                <Text style={styles.userName}>
                    {user?.name || 'Explorador'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    retoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.25)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(212, 175, 55, 0.5)',
        gap: 6,
    },
    userProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 38,
        height: 38,
        borderRadius: 19,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 22,
        color: '#FFF',
        flex: 1,
        fontFamily: 'Caveat_700Bold',
    },
});
