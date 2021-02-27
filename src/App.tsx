import React from 'react';

import { StatusBar } from 'expo-status-bar';

// React Navigation Stack
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';

export default function App() : JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="black" style="auto" />
      <Routes />
    </NavigationContainer>
  );
}
