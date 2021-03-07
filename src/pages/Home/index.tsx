import React from 'react';

import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Entypo } from '@expo/vector-icons';

import AsyncButton from '../../components/AsyncButton';
import TextInputCheck from '../../components/TextInputCheck';
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
          width: '30%',
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
        <Entypo name="lock" size={16} />
        <Text>Login</Text>
      </AsyncButton>
      <AsyncButton
        styles={{
          flex: 1,
          width: '30%',
          height: '32px',
          backgroundColor: Theme.default.secondary,
          borderRadius: '5px',
          marginTop: '10px',
        }}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Unauthorized');
        }}
      >
        <Text>Ops</Text>
      </AsyncButton>
      <AsyncButton
        styles={{
          flex: 1,
          width: '30%',
          height: '32px',
          backgroundColor: Theme.default.secondary,
          borderRadius: '5px',
          marginTop: '10px',
        }}
        asyncAction={false}
        callback={() => {
          navigation.navigate('AnimalRegistration');
        }}
      >
        <Text>Animal form</Text>
      </AsyncButton>
      <Text>Exemplo de TextInputCheck:</Text>
      <TextInputCheck validation={() => true} placeholder="E-mail" />
    </Container>
  );
}
