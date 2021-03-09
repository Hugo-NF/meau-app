import React, { useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';

import { styledComponents } from './styles';
import { Theme } from '../../constants';

export default function Authorized(): JSX.Element {
  const navigation = useNavigation();
  const {
    Container,
  } = styledComponents;

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
  }, [navigation]);

  return (
    <Container>
      <Text>Você está logado!</Text>
    </Container>
  );
}
