// Package imports.
import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

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

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  // Functions.
  const notEmpty = (text: string) : boolean => text !== '';

  const placeholderFunction = () : null => null;

  // Styled components.
  const { ButtonText, Container, LoginForm } = styledComponents;

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
