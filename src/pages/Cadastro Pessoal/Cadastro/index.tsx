import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TextInputCheck from '../../../components/TextInputCheck';
import AsyncButton from '../../../components/AsyncButton';
import { emptyTextValidation } from '../../../utils/validationRules';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    width: 328,
    alignItems: 'center',
  },
  infoText: {
    width: 328,
    backgroundColor: '#cfe9e5',
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#434343',
    marginTop: 16,
    marginBottom: 28,
  },
  pageTinyTitle: {
    width: '100%',
    marginBottom: 32,
    color: '#434343',
    textTransform: 'uppercase',
    textAlign: 'left',
  },
});

export default function CadastroPessoal() : JSX.Element {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.infoText}>
            As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
          </Text>
          <Text style={styles.pageTinyTitle}>Informações Pessoais</Text>
          <TextInputCheck validation={emptyTextValidation} placeholder="Nome completo" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Idade" />
          <TextInputCheck validation={emptyTextValidation} placeholder="E-mail" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Estado" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Cidade" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Endereço" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Telefone" />
          <Text style={styles.pageTinyTitle}>Informações de perfil</Text>
          <TextInputCheck validation={emptyTextValidation} placeholder="Nome de usuário" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Senha" />
          <TextInputCheck validation={emptyTextValidation} placeholder="Confirmação de senha" />
          <Text style={styles.pageTinyTitle}>Foto de perfil</Text>
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
        </View>
      </View>
    </ScrollView>
  );
}
