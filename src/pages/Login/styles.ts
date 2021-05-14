// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: "Roboto_400Regular";
    font-size: 12px;
    text-transform: uppercase;
  `,

  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
  `,

  LoginForm: styled.View<ViewProps>`
    flex: 1;
    margin-top: 56px;
    margin-bottom: 40px;
    align-items: center;
  `,
};

// Style props.
export const styles = {
  submitButtonStyles: {
    alignItems: 'center',
    backgroundColor: Theme.default.primary,
    borderRadius: '2px',
    height: '40px',
    marginTop: '32px',
    width: '232px',
  },
};
