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
};

// Styled components.
export const styledComponents = {

  ErrorContainer: styled.View<ViewProps>`
    position: relative;
    margin-bottom: 10px;
    margin-top: 10px;
  `,

  ErrorMessage: styled.Text<TextProps>`
    color: ${Theme.default.danger};
  `,

  LoadingContainer: styled.View<ViewProps>`
    position: relative;
    margin-bottom: 20px;
    margin-top: 20px;
  `,

};
