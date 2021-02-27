import React from 'react';

import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Home() : JSX.Element {
  setStatusBarStyle('auto');

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text onPress={() => navigation.navigate('Login')}>Bugstenium rocks!</Text>
      <StatusBar />
    </View>
  );
}
