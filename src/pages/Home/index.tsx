import React from 'react';

import { setStatusBarStyle, StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Container } from './styles';

export default function Home() : JSX.Element {
  setStatusBarStyle('auto');

  const navigation = useNavigation();

  return (
    <Container>
      <Text onPress={() => navigation.navigate('Login')}>Bugstenium rocks!</Text>
      <StatusBar />
    </Container>
  );
}
