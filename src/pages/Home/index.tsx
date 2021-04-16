import React, { useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import HeaderLayout from '../../layouts/HeaderLayout';
import AsyncButton from '../../components/AsyncButton';

import { styledComponents, styles } from './styles';
import { Images, Theme } from '../../constants';

export default function Home() : JSX.Element {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor('transparent', true);
  }, [navigation]);

  const {
    Center, Container, Title, Message, ButtonText, LoginText, LogoContainer,
  } = styledComponents;

  return (
    <HeaderLayout
      headerShown
      title=""
      headerStyles={{
        backgroundColor: Theme.default.background,
        height: '56px',
        maxHeight: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
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
          Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual o seu interesse?
        </Message>
        <AsyncButton
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('Unauthorized');
          }}
        >
          <ButtonText>Ops</ButtonText>
        </AsyncButton>
        <AsyncButton
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('Registration');
          }}
        >
          <ButtonText>Cadastro</ButtonText>
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
          styles={styles.asyncButton}
          asyncAction={false}
          callback={() => {
            navigation.navigate('AnimalRegistrationSuccess');
          }}
        >
          <ButtonText>Eba</ButtonText>
        </AsyncButton>
        <AsyncButton
          styles={{
            backgroundColor: 'transparent',
            marginBottom: '68px',
            marginTop: '32px',
            marginLeft: '10px',
            marginRight: '10px',
            width: '60%',
            height: '40px',
            alignItems: 'center',
            borderRadius: '2px',
          }}
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
