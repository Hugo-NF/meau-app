/* eslint-disable no-template-curly-in-string */
// Package imports.
import React, { useLayoutEffect } from 'react';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import auth, { firebase } from '@react-native-firebase/auth';

import * as Yup from 'yup';
import { ErrorMessage, Formik } from 'formik';

import { HelperText, TextInput } from 'react-native-paper';

// Style imports.
import {
  ButtonText,
  Container,
  LoginForm,
  SubmitButton,
} from './styles';

// Layout import
import HeaderLayout from '../../layouts/HeaderLayout';

// Project imports.
import { Theme } from '../../constants';

interface LoginForm {
  email: string,
  password: string,
}

// Component export.
export default function Login() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();

  if (auth().currentUser) {
    navigation.navigate('Authorized');
  }

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  const signIn = async ({ email, password }: LoginForm): Promise<void> => {
    console.log(email);
    console.log(password);
    // try {
    //   const response = await auth().signInWithEmailAndPassword(email, password);
    //   console.log(response);
    //   if (response && response.user) {
    //     // Autenticou
    //     navigation.navigate('Authorized');
    //   }
    // } catch (e) {
    //   // Erro
    //   console.log(e);
    // }
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
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().required('E-mail é obrigatório').email('Deve ser um e-mail válido'),
            password: Yup.string().required('Senha é obrigatória').min(6, 'Deve conter pelo menos ${min} caracteres'),
          })}
          onSubmit={(data) => signIn(data)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <LoginForm>
              <TextInput
                label="E-mail"
                placeholder="E-mail"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                mode="flat"
                keyboardType="email-address"
                dense
                error={Boolean(touched.email && errors.email)}
                selectionColor={Theme.elements.statusBarPrimary}
                underlineColor={Theme.elements.headerText}
                style={{
                  backgroundColor: 'transparent',
                  maxHeight: 56,
                }}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.email && errors.email)}
              >
                {touched.email && errors.email}
              </HelperText>
              <TextInput
                label="Senha"
                placeholder="Senha"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                mode="flat"
                error={Boolean(touched.password && errors.password)}
                secureTextEntry
                selectionColor={Theme.elements.statusBarPrimary}
                underlineColor={Theme.elements.headerText}
                style={{
                  backgroundColor: 'transparent',
                  maxHeight: 56,
                }}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.password && errors.password)}
              >
                {touched.password && errors.password}
              </HelperText>
              <SubmitButton
                disabled={isSubmitting}
                onPress={handleSubmit as (values: unknown) => void}
              >
                <ButtonText>Entrar</ButtonText>
              </SubmitButton>
            </LoginForm>
          )}
        </Formik>
      </Container>
    </HeaderLayout>
  );
}
