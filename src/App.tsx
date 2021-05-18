// Package imports.
import React, { useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

// React Navigation Stack.
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// Importing App Fonts.
import {
  useFonts,
  Courgette_400Regular,
} from '@expo-google-fonts/courgette';

import {
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto';

// Module imports.
import Routes from './routes';
import { Theme } from './constants';
import GlobalState from './contexts/user/contextService';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.default.primary,
    accent: Theme.default.secondary,
  },
};

export default function App() : JSX.Element {
  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    async function prepare(): Promise<void> {
      try {
        // Keep the splash screen visible while we fetch resources
        // Make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this when you're ready to approve the PR! @AndreLaranjeira
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          // Tell the application to render. Hides splashscreen
          SplashScreen.hide();
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  return (
    <GlobalState>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar translucent />
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </GlobalState>
  );
}
