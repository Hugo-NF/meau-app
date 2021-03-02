import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextInputCheck from './components/TextInputCheck';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const emptyTextValidation: (_: string) => boolean = (text: string) => text !== '';

export default function App() : JSX.Element {
  setStatusBarStyle('auto');

  return (
    <View style={styles.container}>
      <Text>Bugstenium rocks!</Text>
      <TextInputCheck validation={emptyTextValidation} placeholder="Login" />
      <TextInputCheck validation={emptyTextValidation} placeholder="E-mail" />
      <StatusBar />
    </View>
  );
}
