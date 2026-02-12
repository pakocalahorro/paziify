import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, RootStackParamList } from '../types';
import { theme } from '../constants/theme';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import LibraryScreen from '../screens/Meditation/LibraryScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CBTAcademyScreen from '../screens/Academy/CBTAcademyScreen';
import CommunityScreen from '../screens/Social/CommunityScreen';
import MeditationCatalogScreen from '../screens/Meditation/MeditationCatalogScreen';
import AudiobooksScreen from '../screens/Content/AudiobooksScreen';
import AudiobookPlayerScreen from '../screens/Content/AudiobookPlayerScreen';
import StoriesScreen from '../screens/Content/StoriesScreen';
import BackgroundSoundScreen from '../screens/BackgroundSound/BackgroundSoundScreen';
import BackgroundPlayerScreen from '../screens/BackgroundSound/BackgroundPlayerScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MiniPlayer from '../components/Shared/MiniPlayer';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();
const LibStack = createNativeStackNavigator<RootStackParamList>();

const LibraryStack = () => (
    <LibStack.Navigator screenOptions={{ headerShown: false }}>
        <LibStack.Screen name={Screen.LIBRARY} component={LibraryScreen} />
        <LibStack.Screen name={Screen.MEDITATION_CATALOG} component={MeditationCatalogScreen} />
        <LibStack.Screen name={Screen.AUDIOBOOKS} component={AudiobooksScreen} />
        <LibStack.Screen name={Screen.STORIES} component={StoriesScreen} />
        <LibStack.Screen name={Screen.BACKGROUND_SOUND} component={BackgroundSoundScreen} />
        <LibStack.Screen name={Screen.BACKGROUND_PLAYER} component={BackgroundPlayerScreen} />
    </LibStack.Navigator>
);

export const TabNavigator = () => {
    return (
        <>
            <Tab.Navigator
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name={Screen.HOME}
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Inicio',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="LibraryTab"
                    component={LibraryStack}
                    options={{
                        tabBarLabel: 'Biblioteca',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="library" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={Screen.CBT_ACADEMY}
                    component={CBTAcademyScreen}
                    options={{
                        tabBarLabel: 'Academia',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="school" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={Screen.COMMUNITY}
                    component={CommunityScreen}
                    options={{
                        tabBarLabel: 'Comunidad',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="chatbubbles" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={Screen.PROFILE}
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Perfil',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
            <MiniPlayer />
        </>
    );
};
