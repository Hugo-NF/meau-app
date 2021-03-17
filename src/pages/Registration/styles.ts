// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    background-color: ${Theme.default.background};
  `,

  InfoText: styled.Text<TextProps>`
    width: 328px;
    background-color: ${Theme.elements.headerPrimary};
    padding: 5px 14px 5px;
    text-align: center;
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    color: ${Theme.elements.headerText};
    margin-top: 16px;
    margin-bottom: 28px;
    border-radius: 4px;
    height: 80px;
  `,

  FormContainer: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
  `,

  SessionText: styled.Text<TextProps>`
    width: 90%;
    margin-bottom: 32px;
    margin-left: 28px;
    color: ${Theme.default.primary};
    text-transform: uppercase;
    text-align: left;
  `,

  ButtonText: styled.Text<TextProps>`
    text-transform: uppercase;
  `,
};

// Styles.
export const styles = {
  asyncButton: {
    flex: 1,
    width: '250px',
    height: '50px',
    backgroundColor: Theme.default.primary,
    borderRadius: '5px',
    marginTop: '32px',
    marginBottom: '24px',
  },

  headerLeftIcon: {
    color: Theme.elements.buttonText,
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },

  textInput: {
    selectionColor: Theme.elements.statusBarPrimary,
    underlineColor: Theme.elements.headerText,
    style: {
      backgroundColor: 'transparent',
      maxHeight: 56,
      width: 312,
    },
  },
};
