import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { Screen, RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import BackgroundWrapper from '../../components/Layout/BackgroundWrapper';
import { SOUNDSCAPES, Soundscape } from '../../data/soundscapesData';
import SoundscapeCard from './components/SoundscapeCard';

type BackgroundSoundScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    Screen.BACKGROUND_SOUND
>;

interface Props {
    navigation: BackgroundSoundScreenNavigationProp;
}

const BackgroundSoundScreen: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState<string>('all');

    const handlePress = (item: Soundscape) => {
        // Navigate to the Immersive Player
        navigation.navigate(Screen.BACKGROUND_PLAYER, { soundscapeId: item.id });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
            >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Espacios Sonoros</Text>
                <Text style={styles.headerSubtitle}>
                    Paisajes inmersivos para enfocar tu mente o relajar tu espíritu.
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />
            <BackgroundWrapper nebulaMode="healing" />

            <View style={styles.content}>
                {renderHeader()}

                <FlatList
                    data={SOUNDSCAPES}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <SoundscapeCard item={item} onPress={handlePress} />
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingBottom: insets.bottom + 100 } // Space for MiniPlayer
                    ]}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    content: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 24,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardWrapper: {
        flex: 1, // Distribute space evenly
        alignItems: 'center', // Center card in its column slot
    }
});

export default BackgroundSoundScreen;
