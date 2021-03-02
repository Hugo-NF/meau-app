import React from 'react';

import { StatusBar } from 'expo-status-bar';
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

export default function Login() : JSX.Element {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text onPress={() => navigation.navigate('Home')}>Login</Text>
      <StatusBar />
    </View>
  );
}
