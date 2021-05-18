// Package imports.
import React, { useCallback, useState } from 'react';

import { setStatusBarBackgroundColor } from 'expo-status-bar';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Button, Dialog, Paragraph, Portal,
} from 'react-native-paper';

// Component imports.
import AsyncButton from '../../components/AsyncButton';

// Service imports.
import userAPI from '../../services/user/api';

// Style imports.
import { styledComponents, styles } from './styles';

// Layout import
import HeaderLayout from '../../layouts/HeaderLayout';

// Project imports.
import CustomTextInput from '../../components/CustomTextInput';
import { Values } from '../../constants';

import { ILoginForm } from '../../types/pages/Login';
import { IDialogState } from '../../types/globals/Dialog';

// Component export.
export default function Login() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const [dialog, setDialog] = useState<IDialogState>({
    open: false,
    title: '',
    message: '',
  });

  // Styled components.
  const {
    ButtonText,
    Container,
    LoginForm,
  } = styledComponents;

  // Page effects.
  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

  const signIn = async ({ email, password }: ILoginForm): Promise<void> => {
    try {
      const response = await userAPI.signIn(email, password);
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
                theme={styles.textInput.theme}
                iconColor={styles.textInput.iconColor}
              />
              <CustomTextInput
                fieldName="password"
                formikHelpers={formikHelpers}
                label="Senha"
                placeholder="Senha"
                mode="flat"
                secureTextEntry
                theme={styles.textInput.theme}
                iconColor={styles.textInput.iconColor}
              />
              <AsyncButton
                asyncAction
                callback={formikHelpers.handleSubmit as (values: unknown) => void}
                disabled={formikHelpers.isSubmitting}
                styles={styles.submitButtonStyles}
              >
                <ButtonText>Entrar</ButtonText>
              </AsyncButton>
            </LoginForm>
          )}
        </Formik>
      </Container>
    </HeaderLayout>
  );
}
