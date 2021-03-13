import React, { useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { setStatusBarHidden, StatusBarAnimation } from 'expo-status-bar';

import AsyncButton from '../../components/AsyncButton';

import { styledComponents, styles } from './styles';
import { Images } from '../../constants';

export default function Home() : JSX.Element {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarHidden(true, 'none');
  }, [navigation]);

  const {
    Container, Title, Message, ButtonText, LoginText, LogoContainer,
  } = styledComponents;

  return (
    <Container>
      <Title>Olá!</Title>
      <Message>
        Bem vindo ao Meau!{'\n'}
        Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual o seu interesse?
      </Message>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Login');
        }}
      >
        <ButtonText>Adotar</ButtonText>
      </AsyncButton>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={() => {
          navigation.navigate('Login');
        }}
      >
        <ButtonText>Ajudar</ButtonText>
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
        styles={{
          backgroundColor: 'transparent',
          marginBottom: '68px',
          marginTop: '44px',
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
      <LogoContainer source={Images.MeauBlue} resizeMode="contain" />
    </Container>
  );
}
