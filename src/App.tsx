// Package imports.
import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';

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

export default function App() : JSX.Element | null {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    async function prepare(): Promise<void> {
      try {
        // Keep the splash screen visible while we fetch resources

        // Pre-load fonts
        while (!fontsLoaded); // Waits useFonts to load

        // Make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this when ready to approve the PR! @AndreLaranjeira
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <GlobalState>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar translucent />
            <Routes />
          </NavigationContainer>
        </PaperProvider>
      </GlobalState>
    </View>
  );
}
