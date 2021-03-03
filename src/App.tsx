// Package imports.
import React from 'react';
import AppLoading from 'expo-app-loading';

import { StatusBar } from 'expo-status-bar';

// React Navigation Stack
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// Importing App Fonts
import {
  useFonts,
  Courgette_400Regular,
} from '@expo-google-fonts/courgette';

import {
  Roboto_400Regular,
} from '@expo-google-fonts/roboto';

import Routes from './routes';

export default function App() : JSX.Element {
  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar translucent />
      <Routes />
    </NavigationContainer>
  );
}
