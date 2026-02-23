import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from './src/lib/queryClient';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    Caveat_700Bold,
  });

  if (!fontsLoaded) {
    return null; // O un SplashScreen de Expo si estuviera configurado
  }

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <AppProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AppProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
