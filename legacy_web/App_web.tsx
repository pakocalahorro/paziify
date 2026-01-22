import React from 'react';
import { useApp } from './context/AppContext';
import { Screen } from './types';
import RegisterScreen from './screens/Onboarding/RegisterScreen';
import NotificationSettings from './screens/Onboarding/NotificationSettings';
import HomeScreen from './screens/Home/HomeScreen';
import LibraryScreen from './screens/Meditation/LibraryScreen';
import TransitionTunnel from './screens/Meditation/TransitionTunnel';
import BreathingTimer from './screens/Meditation/BreathingTimer';
import SessionEndScreen from './screens/Meditation/SessionEndScreen';
import CommunityScreen from './screens/Social/CommunityScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import WeeklyReportScreen from './screens/Profile/WeeklyReportScreen';
import CBTAcademyScreen from './screens/Academy/CBTAcademyScreen';
import CBTDetailScreen from './screens/Academy/CBTDetailScreen';
import BottomNav from './components/BottomNav';
import UpsellModal from './modals/UpsellModal';

const App: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.REGISTER: return <RegisterScreen />;
      case Screen.NOTIFICATION_SETTINGS: return <NotificationSettings />;
      case Screen.HOME: return <HomeScreen />;
      case Screen.LIBRARY: return <LibraryScreen />;
      case Screen.ACADEMY: return <CBTAcademyScreen />;
      case Screen.COURSE_DETAIL: return <CBTDetailScreen />;
      case Screen.TRANSITION_TUNNEL: return <TransitionTunnel />;
      case Screen.BREATHING_TIMER: return <BreathingTimer />;
      case Screen.SESSION_END: return <SessionEndScreen />;
      case Screen.COMMUNITY: return <CommunityScreen />;
      case Screen.PROFILE: return <ProfileScreen />;
      case Screen.WEEKLY_REPORT: return <WeeklyReportScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomNav />
      <UpsellModal />
    </>
  );
};

export default App;