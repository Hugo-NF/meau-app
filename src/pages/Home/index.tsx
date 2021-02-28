import React from 'react';

import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import AsyncButton from '../../components/AsyncButton';
import { Theme } from '../../constants';
import { Container } from './styles';

export default function Home() : JSX.Element {
  const navigation = useNavigation();

  return (
    <Container>
      <Text onPress={() => navigation.navigate('Login')}>Bugstenium rocks!</Text>
      <AsyncButton
        styles={{
          flex: 1,
          width: '70%',
          height: '32px',
          backgroundColor: Theme.default.secondary,
          borderRadius: '5px',
          marginTop: '10px',
        }}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Login');
        }}
      >
        <Text>Login</Text>
      </AsyncButton>
    </Container>
  );
}
