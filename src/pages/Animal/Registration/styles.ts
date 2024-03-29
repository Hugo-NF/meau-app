// Package imports.
import {
  ImageProps, TextProps, TouchableOpacityProps, ViewProps,
} from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {
  ButtonContainer: styled.View<ViewProps>`
    height: 84px;
  `,

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
  `,

  CheckBoxRowBottom: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    margin-top: 28px;
  `,

  CheckBoxRowTop: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
  `,

  CheckBoxText: styled.Text<TextProps>`
    color: ${Theme.elements.text};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    margin-bottom: 1px;
  `,

  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    background-color: ${Theme.default.background};
  `,

  Form: styled.View<ViewProps>`
    align-items: stretch;
  `,

  FormHeaderText: styled.Text<TextProps>`
    color: ${Theme.elements.textDark};
    font-family: 'Roboto_500Medium';
    font-size: 16px;
    margin-top: 16px;
  `,

  FormLabelText: styled.Text<TextProps>`
    color: ${Theme.elements.labelSecondary};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    margin-top: 20px;
  `,

  IndentedSubsection: styled.View<ViewProps>`
    margin-bottom: -12px;
    margin-left: 36px;
  `,

  InvalidCheckBoxText: styled.Text<TextProps>`
    color: ${Theme.elements.textFaded};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    margin-bottom: 1px;
  `,

  LabeledCheckBox: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    width: 100px;
  `,

  PicturesInput: styled.TouchableOpacity<TouchableOpacityProps>`
    flex-direction: row;
    align-items: center;
    background: ${Theme.elements.animalPhotosInputBackground};
    height: 128px;
    margin-top: 16px;
    width: 312px;
  `,

  PicturesInputInternal: styled.View<ViewProps>`
    align-items: center;
    width: 100%;
  `,

  PicturesInputText: styled.Text<TextProps>`
    color: ${Theme.elements.text}
  `,

  PictureThumbnail: styled.Image<ImageProps>`
    height: 100px;
    margin-right: 10px;
    width: 100px;
  `,

  SingleCheckBoxRow: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    height: 20px;
    margin-bottom: 8px;
    margin-top: 20px;
    width: 100%;
  `,

};

// Styles.
export const styles = {
  addPhotoIcon: {
    color: Theme.elements.photoIcon,
  },

  checkboxTintColors: {
    disabled: Theme.elements.textFaded,
    true: Theme.elements.labelSecondary,
    false: Theme.elements.text,
  },

  headerLayout: {
    backgroundColor: Theme.elements.headerSecondaryDark,
  },

  picturesGrid: {
    width: 312,
  },

  radioForm: {
    animation: false,
    buttonColor: Theme.elements.radioButton,
    buttonOuterSize: 21,
    buttonSize: 12,
    formHorizontal: true,
    labelColor: Theme.elements.text,
    labelHorizontal: true,
    labelStyle: {
      color: Theme.elements.text,
      fontFamily: 'Roboto_400Regular',
      fontSize: 14,
      paddingLeft: 8,
    },
    radioStyle: {
      marginTop: 0,
      width: 102,
    },
    selectedButtonColor: Theme.elements.active,
    style: {
      marginBottom: 0,
      marginLeft: 2,
      marginTop: 16,
    },
    wrapStyle: {
      marginTop: 0,
      width: 102,
    },
  },

  // Submit button must have sizes in '_px' due to Styled components.
  submitButton: {
    backgroundColor: Theme.default.secondary,
    borderRadius: '2px',
    height: '40px',
    marginBottom: '24px',
    marginTop: '24px',
    width: '232px',
  },

  textInput: {
    helperTextStyle: {
      marginTop: 12,
      marginBottom: -12,
    },
    iconColor: Theme.elements.textInputIconSecondary,
    mode: 'flat',
    style: {
      backgroundColor: 'transparent',
      width: 312,
      marginBottom: -12,
      marginTop: 4,
    },
    theme: {
      colors: {
        primary: Theme.default.secondary,
        placeholder: Theme.elements.textFaded,
      },
    },
  },

  statusBarColor: Theme.elements.statusBarSecondaryDark,
};
