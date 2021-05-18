import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../../constants';

export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background-color: ${Theme.default.background};
  `,

  Title: styled.Text<TextProps>`
    font-family: 'Courgette_400Regular';
    font-size: 53px;
    color: ${Theme.default.secondary};
    margin-top: 44px;
    margin-bottom: 32px;
  `,

  Message: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    text-align: center;
    margin-left: 52px;
    margin-right: 52px;
    color: ${Theme.elements.text};
  `,

  ButtonContainer: styled.View<ViewProps>`
    margin-top: auto;
  `,

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
  `,
};

export const styles = {

  headerLayout: {
    backgroundColor: Theme.elements.headerSecondary,
  },

  submitButton: {
    backgroundColor: Theme.default.secondary,
    borderRadius: '2px',
    height: '40px',
    marginBottom: '24px',
    width: '232px',
  },

  statusBarColor: Theme.elements.statusBarSecondary,
};
