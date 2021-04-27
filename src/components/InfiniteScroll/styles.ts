// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Default props.
export const defaultProps = {
  activityIndicatorColor: Theme.default.primary,

  contentContainerStyles: {
    paddingBottom: 20,
    paddingTop: 20,
  },

  errorContainerStyles: {

  },

  loadingContainerStyles: {

  },

  noDataFoundContainerStyles: {

  },

  numColumns: 1,
};

// Styled components.
export const styledComponents = {

  ErrorMessage: styled.Text<TextProps>`
    color: ${Theme.default.danger};
  `,

  LoadingContainer: styled.View<ViewProps>`
    position: relative;
    margin-bottom: 20px;
    margin-top: 20px;
  `,

  NoDataFoundMessage: styled.Text<TextProps>`
      font-family: 'Roboto_400Regular';
      font-size: 16px;
      text-align: center;
      color: ${Theme.elements.text};
  `,

  TextContainer: styled.View<ViewProps>`
    position: relative;
    margin-bottom: 10px;
    margin-top: 10px;
  `,

};
