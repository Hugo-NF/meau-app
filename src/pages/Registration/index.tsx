import React, { useLayoutEffect } from 'react';

import {
  View, Text, SafeAreaView, ScrollView,
} from 'react-native';

import { setStatusBarBackgroundColor } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';

import TextInputCheck from '../../components/TextInputCheck';
import AsyncButton from '../../components/AsyncButton';

import { Theme } from '../../constants';

import { styledComponents } from './styles';

export default function Registration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const { Container, InfoText, SessionText } = styledComponents;

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Container>
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
          <SessionText>Foto de perfil</SessionText>
          <View>
            <AsyncButton
              styles={{
                flex: 1,
                width: '250px',
                height: '50px',
                backgroundColor: '#88c9bf',
                borderRadius: '5px',
                marginTop: '10px',
                marginBottom: '54px',
              }}
              asyncAction={false}
              callback={() => {
                navigation.navigate('Home');
              }}
            >
              <Text style={{ textTransform: 'uppercase' }}>
                Fazer cadastro
              </Text>
            </AsyncButton>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
