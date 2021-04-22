// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

export const Container = styled.View<ViewProps>`
  padding-top: 16px;
  align-items: center;
  flex: 1;
  background-color: ${Theme.default.background}
`;

export const LoadingContainer = styled.View<ViewProps>`
  flex: 1;
  align-items: center;
  background-color: ${Theme.default.background};
  justify-content: center;
`;

export const LoadingText = styled.Text<TextProps>`
  font-family: 'Roboto_400Regular';
  font-size: 16px;
  margin-bottom: 10px;
`;
