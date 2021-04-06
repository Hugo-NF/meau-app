// Package imports.
import React, { useLayoutEffect, useState } from 'react';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { StackActions, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Button, Dialog, Paragraph, Portal,
} from 'react-native-paper';

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
import CustomTextInput from '../../components/CustomTextInput';
import { Theme, Values } from '../../constants';

interface LoginForm {
  email: string,
  password: string,
}
interface IDialogState {
  open: boolean,
  title: string,
  message: string,
}

// Component export.
export default function Login() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const [dialog, setDialog] = useState<IDialogState>({
    open: false,
    title: '',
    message: '',
  });

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  const signIn = async ({ email, password }: LoginForm): Promise<void> => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        navigation.dispatch(StackActions.replace('AnimalFeed'));
      }
    } catch (e) {
      setDialog({
        open: true,
        title: 'Autenticação',
        message: `E-mail e/ou senha incorretos.\n\nDetalhes: ${e}`,
      });
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
        <Portal>
          <Dialog
            visible={dialog.open}
            onDismiss={() => setDialog({ ...dialog, open: false })}
          >
            <Dialog.Title>{dialog.title}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{dialog.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialog({ ...dialog, open: false })}>Fechar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().required('E-mail é obrigatório').email('Deve ser um e-mail válido'),
            password: Yup.string().required('Senha é obrigatória')
              .min(Values.PASSWORD_MIN_LENGTH, `Deve ter pelo menos ${Values.PASSWORD_MIN_LENGTH} caracteres`),
          })}
          onSubmit={(data) => signIn(data)}
        >
          {(formikHelpers) => (
            <LoginForm>
              <CustomTextInput
                fieldName="email"
                formikHelpers={formikHelpers}
                label="E-mail"
                placeholder="E-mail"
                mode="flat"
                keyboardType="email-address"
                autoFocus
                selectionColor={Theme.elements.statusBarPrimary}
                underlineColor={Theme.elements.headerText}
                style={{
                  backgroundColor: 'transparent',
                  maxHeight: 56,
                  width: 312,
                }}
              />
              <CustomTextInput
                fieldName="password"
                formikHelpers={formikHelpers}
                label="Senha"
                placeholder="Senha"
                mode="flat"
                secureTextEntry
                selectionColor={Theme.elements.statusBarPrimary}
                underlineColor={Theme.elements.headerText}
                style={{
                  backgroundColor: 'transparent',
                  maxHeight: 56,
                  width: 312,
                }}
              />
              <SubmitButton
                disabled={formikHelpers.isSubmitting}
                onPress={formikHelpers.handleSubmit as (values: unknown) => void}
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
