import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../../constants';

export const navigationOptions = {
  headerStyle: {
    backgroundColor: Theme.elements.headerSecondary,
  },
  headerTintColor: Theme.elements.headerText,
  headerTitle: 'Cadastro do Animal',
  headerTitleStyle: {
    fontFamily: 'Roboto_500Medium',
  },
};

export const Container = styled.View<ViewProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
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
    color: ${Theme.elements.buttonText};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
`;

export const styles = {
  statusBarColor: Theme.elements.statusBarSecondaryDark,

  headerLeftIcon: {
    color: Theme.elements.buttonText,
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
