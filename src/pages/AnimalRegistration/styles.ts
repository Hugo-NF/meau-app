// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const styledComponents = {
  ButtonContainer: styled.View<ViewProps>`
    height: 84px;
  `,

  ButtonText: styled.Text<TextProps>`
    color: ${Theme.elements.buttonText};
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
    background-color: ${Theme.default.background};
  `,

  Form: styled.View<ViewProps>`
    align-items: flex-start;
    margin-left: 24px;
  `,

  FormHeaderText: styled.Text<TextProps>`
    color: ${Theme.elements.headerText};
    font-family: 'Roboto_500Medium';
    font-size: 16px;
    margin-top: 16px;
  `,

  FormLabelText: styled.Text<TextProps>`
    color: ${Theme.elements.label};
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    margin-top: 20px;
  `,

  IndentedSubsection: styled.View<ViewProps>`
    margin-left: 36px;
  `,

  InvalidCheckBoxText: styled.Text<TextProps>`
    color: ${Theme.elements.invalidText};
    font-family: 'Roboto_400Regular';
    font-size: 14px;
    margin-bottom: 1px;
  `,

  LabeledCheckBox: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    width: 100px;
  `,

  SingleCheckBoxRow: styled.View<ViewProps>`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 20px;
    width: 100%;
  `,

};

// Styles.
export const styles = {
  checkbox: {
    // Remove the default margins on bottom and top because they mess with the
    // apps' specification.
    marginBottom: -2,
    marginTop: -2,
  },

  headerLeftIcon: {
    color: Theme.elements.buttonText,
    marginBottom: 16,
    marginLeft: 16,
    marginTop: 16,
  },

  radioForm: {
    animation: false,
    buttonColor: Theme.elements.radioButtom,
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

  statusBarColor: Theme.elements.statusBarSecondaryDark,

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
    width: 288,
  },

  textInputContainer: {
    width: 312,
    marginBottom: 0,
    marginTop: 8,
  },

  textInputCheck: {
    color: Theme.elements.checkSecondary,
  },
};
