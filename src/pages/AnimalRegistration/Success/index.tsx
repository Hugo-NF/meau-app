import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncButton from '../../../components/AsyncButton';
import {
  navigationOptions, Container, Title, Message, ButtonContainer, ButtonText, styles,
} from './styles';

export default function AnimalRegistrationSuccess() : JSX.Element {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="md-arrow-back-sharp"
          onPress={() => navigation.goBack()}
          size={24}
          style={styles.headerLeftIcon}
        />
      ),
      ...navigationOptions,
    });
    setStatusBarBackgroundColor(styles.statusBarColor, false);
  }, [navigation]);

  return (
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
          callback={() : null => null}
        >
          <ButtonText>MEUS PETS</ButtonText>
        </AsyncButton>
      </ButtonContainer>
    </Container>
  );
}
