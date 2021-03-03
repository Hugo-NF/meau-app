// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.buttonText};
    font-family: "Roboto_400Regular";
    font-size: 12px;
  `,

  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
  `,

  LoginForm: styled.View<ViewProps>`
    margin-top: 64px;
    margin-bottom: 52px;,
  `,

};

// Navigation options.
export const navigationOptions = {
  headerStyle: {
    backgroundColor: Theme.elements.headerPrimary,
  },
  headerTintColor: Theme.elements.headerText,
  headerTitle: 'Login',
};

// Styles.
export const styles = {
  asyncButton: {
    backgroundColor: Theme.default.primary,
    borderRadius: 2,
    height: 40,
    marginTop: 0,
    width: 232,
  },

  headerLeftIcon: {
    color: Theme.elements.buttonText,
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },

  statusBarColor: Theme.elements.headerPrimaryDark,
};
