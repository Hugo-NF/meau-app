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
    background-color: ${Theme.default.background};
  `,

  Title: styled.Text<TextProps>`
    font-family: 'Courgette_400Regular';
    font-size: 53px;
    color: ${Theme.default.primary};
    margin-top: 40px;
    margin-bottom: 34px;
  `,

  Message: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    max-width: 80%;
    color: ${Theme.elements.text};
    margin-bottom: 12px;
    text-align: center;
  `,

  ButtonText: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    color: ${Theme.elements.textDark};
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
    width: '60%',
    height: '40px',
    alignItems: 'center',
    borderRadius: '2px',
  },

  headerLayout: {
    backgroundColor: Theme.elements.headerPrimaryDark,
  },

  statusBarColor: Theme.elements.statusBarPrimaryDark,
};
