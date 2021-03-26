import React, { useLayoutEffect } from 'react';
import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import auth from '@react-native-firebase/auth';

import { styledComponents } from './styles';
import { Theme } from '../../constants';
import AsyncButton from '../../components/AsyncButton';

export default function Authorized(): JSX.Element {
  const navigation = useNavigation();
  const {
    Container,
  } = styledComponents;

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
  }, [navigation]);

  const logout = async (): Promise<void> => {
    await auth().signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <Container>
      <Text>Você está logado! E-mail: {auth().currentUser?.email}</Text>
      <AsyncButton asyncAction callback={logout}><Text>Logout</Text></AsyncButton>
    </Container>
  );
}
