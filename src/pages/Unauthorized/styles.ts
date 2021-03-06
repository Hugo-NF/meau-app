import {
  TextProps, ViewProps,
} from 'react-native';

import styled from 'styled-components/native';
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,

  Title: styled.Text<TextProps>`
    font-family: 'Courgette_400Regular';
    font-size: 53px;
    color: ${Theme.default.primary};
    margin-top: 52px;
    margin-bottom: 52px;
  `,

  Message: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    max-width: 80%;
    color: ${Theme.elements.text};
    margin-bottom: 16px;
    text-align: center;
  `,

  ButtonText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    color: ${Theme.elements.buttonText};
    text-transform: uppercase;
  `,
};

// Style props.
export const styles = {
  asyncButton: {
    backgroundColor: Theme.default.primary,
    marginBottom: '44px',
    marginTop: '0px',
    marginLeft: '10px',
    marginRight: '10px',
    width: '232px',
    height: '40px',
    alignItems: 'center',
    borderRadius: '2px',
  },
};
