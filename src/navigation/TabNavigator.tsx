import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { theme } from '../constants/theme';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import LibraryScreen from '../screens/Meditation/LibraryScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CBTAcademyScreen from '../screens/Academy/CBTAcademyScreen';
import CommunityScreen from '../screens/Social/CommunityScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.05)',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
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
                name={Screen.LIBRARY}
                component={LibraryScreen}
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
    );
};
