import React, { useLayoutEffect } from 'react';

import {
  ScrollView,
  View,
} from 'react-native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import TextInputCheck from '../../components/TextInputCheck';
import AsyncButton from '../../components/AsyncButton';
import HeaderLayout from '../../layouts/HeaderLayout';

import { Theme } from '../../constants';

import { styles, styledComponents } from './styles';

export default function Registration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const {
    ButtonText, Container, InfoText, SessionText, FormContainer,
  } = styledComponents;

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  return (
    <HeaderLayout
      headerShown
      title="Cadastro Pessoal"
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimary,
        maxHeight: '56px',
        height: '56px',
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
        <ScrollView>
          <FormContainer>
            <InfoText>
              As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
            </InfoText>
            <SessionText>Informações Pessoais</SessionText>
            <TextInputCheck validation={() => true} placeholder="Nome completo" />
            <TextInputCheck validation={() => true} placeholder="Idade" />
            <TextInputCheck validation={() => true} placeholder="E-mail" />
            <TextInputCheck validation={() => true} placeholder="Estado" />
            <TextInputCheck validation={() => true} placeholder="Cidade" />
            <TextInputCheck validation={() => true} placeholder="Endereço" />
            <TextInputCheck validation={() => true} placeholder="Telefone" />
            <SessionText>Informações de perfil</SessionText>
            <TextInputCheck validation={() => true} placeholder="Nome de usuário" />
            <TextInputCheck validation={() => true} placeholder="Senha" />
            <TextInputCheck validation={() => true} placeholder="Confirmação de senha" />
            <View>
              <AsyncButton
                styles={styles.asyncButton}
                asyncAction={false}
                callback={() => {
                  navigation.navigate('Home');
                }}
              >
                <ButtonText>Fazer cadastro</ButtonText>
              </AsyncButton>
            </View>

          </FormContainer>
        </ScrollView>
      </Container>
    </HeaderLayout>
  );
}
