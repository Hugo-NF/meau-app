// Package imports.
import React, {useLayoutEffect} from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Styled component imports.
import {navigationOptions, styles, styledComponents} from './styles';

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
      ...navigationOptions
    });
    setStatusBarBackgroundColor(styles.statusBarColor, false);
  }, [navigation]);

  // Functions.
  const notEmpty = (text) => {
    text !== '';
  };

  return (
    <styledComponents.Container>
      <styledComponents.LoginForm>
        <TextInputCheck
          validation={notEmpty}
          placeholder="Nome de usuário"
        />
        <TextInputCheck
          validation={notEmpty}
          placeholder="Senha"
        />
      </styledComponents.LoginForm>
      <AsyncButton
        styles={styles.asyncButton}
        asyncAction={false}
        callback={() => {}}
      >
        <styledComponents.ButtonText>ENTRAR</styledComponents.ButtonText>
      </AsyncButton>
    </styledComponents.Container>
  );
}
