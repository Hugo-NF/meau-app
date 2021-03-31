// Package imports.
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Default props.
export const defaultProps = {
  containerStyles: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
};

// Styled components.
export const styledComponents = {

  LoadingMoreContainer: styled.View<ViewProps>`
    padding-bottom: 20px;
    padding-top: 20px;
    position: 'relative';
    margin-bottom: 20px;
    margin-top: 20px;
  `,

};
