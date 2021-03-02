import React from 'react';
// import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, View } from 'react-native';
import TextInputCheck from './components/TextInputCheck';

import { StatusBar } from 'expo-status-bar';

// React Navigation Stack
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// Importing App Fonts
// import {
//   useFonts,
//   Courgette_400Regular,
// } from '@expo-google-fonts/courgette';
//
// import {
//   Roboto_400Regular,
// } from '@expo-google-fonts/roboto';

import Routes from './routes';

const emptyTextValidation: (_: string) => boolean = (text: string) => text !== '';

export default function App() : JSX.Element {
  // const [fontsLoaded] = useFonts({
  //   Courgette_400Regular,
  //   Roboto_400Regular,
  // });
  //
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <NavigationContainer>
      <StatusBar translucent style="auto" />
      <Routes />
    </NavigationContainer>
  );
}
