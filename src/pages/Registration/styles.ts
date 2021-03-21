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

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.buttonText};
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
    color: ${Theme.elements.headerText};
    margin-top: 16px;
    margin-bottom: 28px;
    border-radius: 4px;
    height: 80px;
  `,

  PhotoContainer: styled.View<ViewProps>`
    align-items: center;
    background-color: ${Theme.elements.photoBackground};
    border-radius: 2px;
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
    align-items: center;
    background-color: ${Theme.elements.photoBackground};
    border-radius: 2px;
    height: 128px;
    padding-bottom: 48px;
    padding-top: 44px;
    width: 128px;
  `,

  SectionText: styled.Text<TextProps>`
    width: 90%;
    margin-bottom: 32px;
    margin-left: 28px;
    color: ${Theme.default.primary};
    text-transform: uppercase;
    text-align: left;
  `,

};

// Styles.
export const styles = {
  addPhotoIcon: {
    color: Theme.elements.photoIcon,
  },

  asyncButton: {
    flex: 1,
    width: '250px',
    height: '50px',
    backgroundColor: Theme.default.primary,
    borderRadius: '5px',
    marginTop: '32px',
    marginBottom: '24px',
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
