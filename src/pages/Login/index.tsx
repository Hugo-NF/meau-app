// Package imports.
import React, { useLayoutEffect, useState } from 'react';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import auth, { firebase } from '@react-native-firebase/auth';

import * as Yup from 'yup';
import { Formik } from 'formik';

// Style imports.
import { styles, styledComponents } from './styles';

// Layout import
import HeaderLayout from '../../layouts/HeaderLayout';

// Component imports.
import AsyncButton from '../../components/AsyncButton';
import TextInputCheck from '../../components/TextInputCheck';
import { Theme } from '../../constants';

// Component export.
export default function Login() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wrongLogin, setWrongLogin] = useState(false);

  if (auth().currentUser) {
    navigation.navigate('Authorized');
  }

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  // Functions.
  const notEmpty = (text: string) : boolean => text !== '';

  const placeholderFunction = () : null => null;

  // Styled components.
  const { ButtonText, Container, LoginForm } = styledComponents;

  const signIn = async (): Promise<void> => {
    console.log(email);
    try {
      if (!email || !password) {
        console.log('Campos vazios');
        return;
      }
      const response = await auth().signInWithEmailAndPassword(email, password);
      console.log(response);
      if (response && response.user) {
        // Autenticou
        navigation.navigate('Authorized');
      }
    } catch (e) {
      // Erro
      console.log(e);
      setWrongLogin(true);
    }
  };

  return (
    <HeaderLayout
      headerShown
      title="Login"
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
        <LoginForm>
          <TextInputCheck
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.textInput}
            validation={notEmpty}
            placeholder="Nome de usuário"
          />
          <TextInputCheck
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.textInput}
            validation={notEmpty}
            placeholder="Senha"
          />
          <AsyncButton
            styles={styles.asyncButton}
            asyncAction={false}
            callback={placeholderFunction}
          >
            <ButtonText>Entrar</ButtonText>
          </AsyncButton>
        </LoginForm>
      </Container>
    </HeaderLayout>
  );
}
