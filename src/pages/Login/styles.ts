// Package imports.
import { TouchableOpacityProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

export const ButtonText = styled.Text<TextProps>`
  color: ${Theme.elements.buttonText};
  font-family: "Roboto_400Regular";
  font-size: 12px;
  text-transform: uppercase;
`;

export const Container = styled.View<ViewProps>`
  flex: 1;
  align-items: center;
  background-color: ${Theme.default.background};
`;

export const LoginForm = styled.View<ViewProps>`
  flex: 1;
  margin-top: 56px;
  margin-bottom: 40px;
  align-items: center;
`;

export const SubmitButton = styled.TouchableOpacity<TouchableOpacityProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${Theme.default.primary};
  border-radius: 2px;
  max-height: 40px;
  margin-top: 32px;
  width: 232px;
`;
