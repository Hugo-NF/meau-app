// Package imports.
import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Style imports.
import { navigationOptions, styles, styledComponents } from './styles';

// Component imports.
import AsyncButton from '../../components/AsyncButton';
import TextInputCheck from '../../components/TextInputCheck';

// Component export.
export default function Login() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();

  // Layout effects.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="menu-sharp"
          size={24}
          style={styles.headerLeftIcon}
        />
      ),
      ...navigationOptions,
    });
    setStatusBarBackgroundColor(styles.statusBarColor, false);
  }, [navigation]);

  // Functions.
  const notEmpty = (text) : boolean => {
    text !== '';
  };

  const placeholderFunction = () : null => {
    null;
  };

  // Styled components.
  const { ButtonText, Container, LoginForm } = styledComponents;

  return (
    <Container>
      <LoginForm>
        <TextInputCheck
          validation={notEmpty}
          placeholder="Nome de usuário"
        />
        <TextInputCheck
          validation={notEmpty}
          placeholder="Senha"
        />
      </LoginForm>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={placeholderFunction}
      >
        <ButtonText>ENTRAR</ButtonText>
      </AsyncButton>
    </Container>
  );
}
