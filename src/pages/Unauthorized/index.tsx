import React, { useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import AsyncButton from '../../components/AsyncButton';

import { styles, styledComponents } from './styles';
import { Theme } from '../../constants';

export default function Unauthorized(): JSX.Element {
  const navigation = useNavigation();
  const {
    ButtonText, Container, Title, Message,
  } = styledComponents;

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, true);
  }, [navigation]);

  return (
    <Container>
      <Title>Ops!</Title>
      <Message>Você não pode realizar esta ação sem possuir um cadastro.</Message>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Registration');
        }}
      >
        <ButtonText>Fazer cadastro</ButtonText>
      </AsyncButton>
      <Message>Já possui cadastro?</Message>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Login');
        }}
      >
        <ButtonText>Fazer login</ButtonText>
      </AsyncButton>
    </Container>
  );
}
