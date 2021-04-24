import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncButton from '../../../components/AsyncButton';
import {
  Container, Title, Message, ButtonContainer, ButtonText, styles,
} from './styles';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Theme } from '../../../constants';

export default function AnimalRegistrationSuccess() : JSX.Element {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  return (
    <HeaderLayout
      headerShown
      title="Cadastro do Animal"
      headerStyles={{
        backgroundColor: Theme.elements.headerSecondary,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'back',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        <Title>Eba!</Title>
        <Message>
          O cadastro do seu pet foi realizado com sucesso!{'\n\n'}
          Certifique-se que permitiu o envio de notificações por push no campo privacidade do menu configurações do aplicativo. Assim, poderemos te avisar assim que alguém interessado entrar em contato!
        </Message>
        <ButtonContainer>
          <AsyncButton
            styles={styles.submitButton}
            asyncAction={false}
            callback={() => navigation.navigate('MyPets')}
          >
            <ButtonText>MEUS PETS</ButtonText>
          </AsyncButton>
        </ButtonContainer>
      </Container>
    </HeaderLayout>
  );
}
