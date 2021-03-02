import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import React from 'react';

import OpsComponent from './pages/Cadastro Pessoal/Ops';

// Importing App Fonts
import {
  useFonts,
  Courgette_400Regular,
} from '@expo-google-fonts/courgette';

import {
  Roboto_400Regular,
} from '@expo-google-fonts/roboto';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});

export default function App() : JSX.Element {
  setStatusBarStyle('auto');  
  
  const [fontsLoaded] = useFonts({
    Courgette_400Regular,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <OpsComponent></OpsComponent>
      <StatusBar />
    </View>
  );
}
