import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screen, RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';

// Screens
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import RegisterScreen from '../screens/Onboarding/RegisterScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';
import { TabNavigator } from './TabNavigator';
// Immersive / Shared Screens
import TransitionTunnel from '../screens/Meditation/TransitionTunnel';
import BreathingTimer from '../screens/Meditation/BreathingTimer';
import SessionEndScreen from '../screens/Meditation/SessionEndScreen';
import NotificationSettings from '../screens/Onboarding/NotificationSettings';
import CBTDetailScreen from '../screens/Academy/CBTDetailScreen';
import PaywallScreen from '../screens/Premium/PaywallScreen';
import QuizScreen from '../screens/Academy/QuizScreen';
import AcademyCourseDetailScreen from '../screens/Academy/AcademyCourseDetailScreen'; // Added
import BackgroundSoundScreen from '../screens/BackgroundSound/BackgroundSoundScreen';
import BackgroundPlayerScreen from '../screens/BackgroundSound/BackgroundPlayerScreen';
import CompassScreen from '../screens/Sanctuary/CompassScreen';
import SpiritualPreloader from '../screens/Sanctuary/SpiritualPreloader';
import StoryDetailScreen from '../screens/Content/StoryDetailScreen';
import SessionDetailScreen from '../screens/Meditation/SessionDetailScreen';
import AudiobookPlayerScreen from '../screens/Content/AudiobookPlayerScreen';
import CardioScanScreen from '../screens/Bio/CardioScanScreen';
import CardioResultScreen from '../screens/Bio/CardioResultScreen';
import EvolutionCatalogScreen from '../screens/Challenges/EvolutionCatalogScreen';
import OasisShowcaseScreen from '../screens/OasisShowcaseScreen'; // PDS Showcase

import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigatorContent = () => {
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
                        <Stack.Screen name={Screen.SPIRITUAL_PRELOADER} component={SpiritualPreloader} />
                        <Stack.Screen name={Screen.COMPASS} component={CompassScreen} />
                        <Stack.Screen name="MainTabs" component={TabNavigator} />
                        <Stack.Screen name={Screen.STORY_DETAIL} component={StoryDetailScreen} />
                        <Stack.Screen name={Screen.TRANSITION_TUNNEL} component={TransitionTunnel} />
                        <Stack.Screen name={Screen.BREATHING_TIMER} component={BreathingTimer} />
                        <Stack.Screen name={Screen.SESSION_END} component={SessionEndScreen} />
                        <Stack.Screen name={Screen.CBT_DETAIL} component={CBTDetailScreen} />
                        <Stack.Screen name={Screen.ACADEMY_COURSE_DETAIL} component={AcademyCourseDetailScreen} />
                        <Stack.Screen name={Screen.CBT_QUIZ} component={QuizScreen} />
                        <Stack.Screen name={Screen.AUDIOBOOK_PLAYER} component={AudiobookPlayerScreen} />
                        <Stack.Screen name={Screen.SESSION_DETAIL} component={SessionDetailScreen} />

                        {/* Background Music Features */}
                        <Stack.Screen
                            name={Screen.BACKGROUND_SOUND}
                            component={BackgroundSoundScreen}
                            options={{ animation: 'fade_from_bottom' }}
                        />
                        <Stack.Screen
                            name={Screen.BACKGROUND_PLAYER}
                            component={BackgroundPlayerScreen}
                            options={{ animation: 'fade' }}
                        />

                        <Stack.Screen
                            name={Screen.PAYWALL}
                            component={PaywallScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom'
                            }}
                        />

                        {/* Bio / Cardio Scan */}
                        <Stack.Screen
                            name={Screen.CARDIO_SCAN}
                            component={CardioScanScreen}
                            options={{ animation: 'fade', gestureEnabled: false }}
                        />
                        <Stack.Screen
                            name={Screen.CARDIO_RESULT}
                            component={CardioResultScreen}
                            options={{ animation: 'fade' }}
                        />
                        <Stack.Screen
                            name={Screen.EVOLUTION_CATALOG}
                            component={EvolutionCatalogScreen}
                            options={{ animation: 'slide_from_bottom' }}
                        />
                        <Stack.Screen
                            name={Screen.OASIS_SHOWCASE}
                            component={OasisShowcaseScreen}
                            options={{ animation: 'fade' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export const AppNavigator = () => {
    return (
        <AudioPlayerProvider>
            <AppNavigatorContent />
        </AudioPlayerProvider>
    );
};
