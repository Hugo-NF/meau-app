import React, { useCallback } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import HeaderLayout from '../../layouts/HeaderLayout';
import AsyncButton from '../../components/AsyncButton';

import { styledComponents, styles } from './styles';
import { Images } from '../../constants';

export default function Home() : JSX.Element {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

  const {
    Center, Container, Title, Message, ButtonText, LoginText, LogoContainer,
  } = styledComponents;

  return (
    <HeaderLayout
      headerShown
      title=""
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
        iconColor: styles.headerIconColor,
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        <Center>
          <Title>Olá!</Title>
        </Center>
        <Message>
          Bem vindo ao Meau!{'\n'}
          Aqui você pode adotar, doar e ajudar cães e gatos com facilidade.{'\n'}
          Qual o seu interesse?
        </Message>
        <AsyncButton
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('Registration');
          }}
        >
          <ButtonText>Cadastro de usuário</ButtonText>
        </AsyncButton>
        <AsyncButton
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('AnimalFeed');
          }}
        >
          <ButtonText>Adotar</ButtonText>
        </AsyncButton>
        <AsyncButton
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('AnimalRegistration');
          }}
        >
          <ButtonText>Cadastrar animal</ButtonText>
        </AsyncButton>
        <AsyncButton
          styles={styles.loginButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('Login');
          }}
        >
          <LoginText>login</LoginText>
        </AsyncButton>
        <Center>
          <LogoContainer source={Images.MeauBlue} resizeMode="contain" />
        </Center>
      </Container>
    </HeaderLayout>
  );
}
