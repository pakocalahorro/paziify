import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen, RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';

// Screens
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import RegisterScreen from '../screens/Onboarding/RegisterScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';
import { TabNavigator } from './TabNavigator';
import TransitionTunnel from '../screens/Meditation/TransitionTunnel';
import BreathingTimer from '../screens/Meditation/BreathingTimer';
import SessionEndScreen from '../screens/Meditation/SessionEndScreen';
import NotificationSettings from '../screens/Onboarding/NotificationSettings';
import WeeklyReportScreen from '../screens/Profile/WeeklyReportScreen';
import CBTAcademyScreen from '../screens/Academy/CBTAcademyScreen';
import CBTDetailScreen from '../screens/Academy/CBTDetailScreen';
import CommunityScreen from '../screens/Social/CommunityScreen';
import PaywallScreen from '../screens/Premium/PaywallScreen';
import CompassScreen from '../screens/Sanctuary/CompassScreen';
import ManifestoScreen from '../screens/Sanctuary/ManifestoScreen';

import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { user, isLoading, isGuest } = useApp();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#646CFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0A0E1A' },
                    animation: 'fade',
                }}
            >
                {!user && !isGuest ? (
                    <>
                        <Stack.Screen name={Screen.WELCOME} component={WelcomeScreen} />
                        <Stack.Screen name={Screen.REGISTER} component={RegisterScreen} />
                        <Stack.Screen name={Screen.LOGIN} component={LoginScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name={Screen.COMPASS} component={CompassScreen} />
                        <Stack.Screen name={Screen.MANIFESTO} component={ManifestoScreen} />
                        <Stack.Screen name="MainTabs" component={TabNavigator} />
                        <Stack.Screen name={Screen.NOTIFICATION_SETTINGS} component={NotificationSettings} />
                        <Stack.Screen name={Screen.TRANSITION_TUNNEL} component={TransitionTunnel} />
                        <Stack.Screen name={Screen.BREATHING_TIMER} component={BreathingTimer} />
                        <Stack.Screen name={Screen.SESSION_END} component={SessionEndScreen} />
                        <Stack.Screen name={Screen.WEEKLY_REPORT} component={WeeklyReportScreen} />
                        <Stack.Screen name={Screen.CBT_ACADEMY} component={CBTAcademyScreen} />
                        <Stack.Screen name={Screen.CBT_DETAIL} component={CBTDetailScreen} />
                        <Stack.Screen name={Screen.COMMUNITY} component={CommunityScreen} />
                        <Stack.Screen
                            name={Screen.PAYWALL}
                            component={PaywallScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom'
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
