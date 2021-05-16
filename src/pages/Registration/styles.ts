// Package imports.
import {
  ImageProps,
  TextProps,
  TouchableOpacityProps,
  ViewProps,
} from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {

  BirthDateButton: styled.View<ViewProps>`
    align-items: center;
    background-color: ${Theme.elements.iconBackground};
    border-radius: 2px;
    height: 30px;
    justify-content: center;
    margin-right: 12px;
    width: 30px;
  `,

  BirthDateContainer: styled.View<ViewProps>`
    flex: 1;
    flex-direction: row;
    align-items: center;
    height: 32px;
    justify-content: flex-start;
    margin-left: 28px;
    margin-right: 16px;
    margin-top: 24px;
  `,

  BirthDatePlaceholderText: styled.Text<TextProps>`
    color: ${Theme.elements.textFaded};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  BirthDateRow: styled.View<ViewProps>`
    flex: 1;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-start;
  `,

  BirthDateText: styled.Text<TextProps>`
    color: ${Theme.elements.fieldText};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    text-transform: uppercase;
  `,

  Container: styled.View<ViewProps>`
    flex: 1;
    background-color: ${Theme.default.background};
  `,

  FormContainer: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
  `,

  IconUndertext: styled.Text<TextProps>`
    color: ${Theme.elements.text};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
  `,

  InfoText: styled.Text<TextProps>`
    width: 328px;
    background-color: ${Theme.elements.headerPrimary};
    padding: 5px 14px 5px;
    text-align: center;
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    color: ${Theme.elements.textDark};
    margin-bottom: 8px;
    margin-top: 16px;
    border-radius: 4px;
    height: 80px;
  `,

  PhotoContainer: styled.View<ViewProps>`
    align-items: center;
    background-color: ${Theme.elements.iconBackground};
    border-radius: 2px;
    elevation: 3;
    height: 128px;
    justify-content: center;
    padding: 8px;
    width: 128px;
  `,

  PhotoPreview: styled.Image<ImageProps>`
    flex: 1;
    height: 112px;
    width: 112px;
  `,

  PhotoSelect: styled.TouchableOpacity<TouchableOpacityProps>`
    align-items: center;
  `,

  PhotoSelectContainer: styled.View<ViewProps>`
    background-color: ${Theme.elements.iconBackground};
    border-radius: 2px;
    elevation: 3;
    height: 128px;
    padding-bottom: 48px;
    padding-top: 44px;
    margin-top: 28px;
    width: 128px;
  `,

  SectionText: styled.Text<TextProps>`
    align-self: flex-start;
    margin-left: 28px;
    margin-top: 20px;
    color: ${Theme.default.primary};
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

  icon: {
    color: Theme.elements.icon,
  },

  textInput: {
    iconColor: Theme.elements.textInputIconPrimary,
    style: {
      marginBottom: 0,
      marginTop: 4,
      paddingHorizontal: 12,
      width: 328,
    },
    theme: {
      colors: {
        primary: Theme.default.primary,
        placeholder: Theme.elements.textFaded,
      },
    },
  },

  statusBarColor: Theme.elements.statusBarPrimary,
};
