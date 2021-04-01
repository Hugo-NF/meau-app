// Package imports.
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Default props.
export const defaultProps = {
  activityIndicatorColor: Theme.default.primary,

  contentContainerStyles: {
    flex: 1,
    flexDirection: 'column',
    height: '80%',
    width: '80%',
  },

  loadingContainerStyles: {

  },
};

// Styled components.
export const styledComponents = {

  LoadingContainer: styled.View<ViewProps>`
    padding-bottom: 20px;
    padding-top: 20px;
    position: relative;
    margin-bottom: 20px;
    margin-top: 20px;
  `,

};
