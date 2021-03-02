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

export default function App() : JSX.Element {
  setStatusBarStyle('auto');

  return (
    <View style={styles.container}>
      <Text>Bugstenium rocks!</Text>
      <TextInputCheck validation={(text) => text != ""}></TextInputCheck>
      <TextInputCheck></TextInputCheck>
      <StatusBar />
    </View>
  );
}
