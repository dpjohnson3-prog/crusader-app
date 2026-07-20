import { ThemeProvider, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { RankUpOverlay } from '@/components/RankUpOverlay';
import { AuthProvider, useAuth } from '@/context/Auth';
import { GameStateProvider } from '@/context/GameState';
import { AllFontsToLoad, Colors } from '@/constants/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// The app has one fixed dark "System window" HUD theme — it does not
// adapt to the device's light/dark setting.
const HudNavigationTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.cyan,
    background: Colors.bg,
    card: Colors.panel,
    text: Colors.ink,
    border: Colors.border,
    notification: Colors.gold,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(AllFontsToLoad);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { initializing } = useAuth();

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  if (initializing) {
    return null;
  }

  // Both screens stay registered; each one redirects away from itself
  // based on auth state (see app/login.tsx and app/(tabs)/_layout.tsx).
  return (
    <ThemeProvider value={HudNavigationTheme}>
      <GameStateProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
        <RankUpOverlay />
      </GameStateProvider>
    </ThemeProvider>
  );
}
