import {
  ImageProps,
  TextProps,
  ViewProps,
} from 'react-native';

import styled from 'styled-components/native';
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    justify-content: space-around;
    background-color: ${Theme.default.background};
  `,

  Title: styled.Text<TextProps>`
    font-family: 'Courgette_400Regular';
    font-size: 72px;
    color: ${Theme.default.secondary};
    margin-top: 52px;
    margin-bottom: 52px;
  `,

  Message: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 16px;
    max-width: 80%;
    color: ${Theme.elements.text};
    margin-left: 48px;
    margin-right: 48px;
    margin-bottom: 48px;
    text-align: center;
  `,

  ButtonText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    color: ${Theme.elements.buttonText};
    text-transform: uppercase;
  `,

  LoginText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 16px;
    color: ${Theme.default.primary};
    text-transform: lowercase;
  `,

  LogoContainer: styled.Image<ImageProps>`
    width: 144px;
    height: 44px;
    margin-top: 68px;
    margin-bottom: 32px;
  `,
};

// Style props.
export const styles = {
  asyncButton: {
    backgroundColor: Theme.default.secondary,
    marginBottom: '12px',
    marginTop: '0px',
    marginLeft: '10px',
    marginRight: '10px',
    width: '60%',
    height: '40px',
    alignItems: 'center',
    borderRadius: '2px',
  },
};
