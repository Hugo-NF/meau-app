// Package imports.
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../constants';

// Styled components.
export const Container = styled.View<ViewProps>`
  flex: 1;
  align-items: center;
  background-color: ${Theme.default.background};
`;
