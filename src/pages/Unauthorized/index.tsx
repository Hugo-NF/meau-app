import React, { useCallback } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import AsyncButton from '../../components/AsyncButton';

import HeaderLayout from '../../layouts/HeaderLayout';

import { styles, styledComponents } from './styles';

export default function Unauthorized(): JSX.Element {
  const navigation = useNavigation();
  const {
    ButtonText, Container, Title, Message,
  } = styledComponents;

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

  return (
    <HeaderLayout
      headerShown
      title="Cadastro"
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'back',
      }}
      rightAction={{
        hidden: true,
      }}
    >
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
    </HeaderLayout>
  );
}
