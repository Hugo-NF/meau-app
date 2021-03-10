// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { Text } from 'react-native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import auth, { firebase } from '@react-native-firebase/auth';

// Style imports.
import { navigationOptions, styles, styledComponents } from './styles';

// Component imports.
import AsyncButton from '../../components/AsyncButton';
import TextInputCheck from '../../components/TextInputCheck';

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
    setStatusBarBackgroundColor(styles.statusBarColor, true);
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
    <Container>
      <LoginForm>
        <TextInputCheck
          validation={notEmpty}
          placeholder="Nome de usuário"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInputCheck
          validation={notEmpty}
          placeholder="Senha"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </LoginForm>
      <Text>{wrongLogin ? 'E-mail ou senha inválidos' : ''}</Text>

      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={signIn}
      >
        <ButtonText>ENTRAR</ButtonText>
      </AsyncButton>
    </Container>
  );
}
