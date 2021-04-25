import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../../constants';

export const Container = styled.View<ViewProps>`
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background-color: ${Theme.default.background};
`;

export const Title = styled.Text<TextProps>`
    font-family: 'Courgette_400Regular';
    font-size: 53px;
    color: ${Theme.default.secondary};
    margin-top: 52px;
    margin-bottom: 52px;
`;

export const Message = styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    text-align: center;
    margin-left: 52px;
    margin-right: 52px;
    color: ${Theme.elements.text};
`;

export const ButtonContainer = styled.View<ViewProps>`
    margin-top: auto;
`;

export const ButtonText = styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
`;

export const styles = {
  statusBarColor: Theme.elements.statusBarSecondaryDark,

  headerLeftIcon: {
    color: Theme.elements.textDark,
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },

  submitButton: {
    backgroundColor: Theme.default.secondary,
    borderRadius: '2px',
    height: '40px',
    marginBottom: '24px',
    width: '232px',
  },
};
