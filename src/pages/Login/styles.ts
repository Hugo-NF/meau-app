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
    margin-top: 56px;
    margin-bottom: 40px;
  `,
};

// Navigation options.
export const navigationOptions = {
  headerStyle: {
    backgroundColor: Theme.elements.headerPrimary,
  },
  headerTintColor: Theme.elements.headerText,
  headerTitle: 'Login',
  headerTitleStyle: {
    fontFamily: 'Roboto_500Medium',
  },
};

// Styles.
export const styles = {
  asyncButton: {
    backgroundColor: Theme.default.primary,
    borderRadius: '2px',
    height: '40px',
    marginTop: '0px',
    width: '232px',
  },

  headerLeftIcon: {
    color: Theme.elements.buttonText,
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },

  statusBarColor: Theme.elements.statusBarPrimary,

  textInput: {
    width: 288,
  },

  textInputContainer: {
    width: 312,
    marginBottom: 12,
    marginTop: 0,
  },
};
