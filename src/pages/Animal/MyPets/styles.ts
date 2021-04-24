// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

export const CardText = styled.Text<TextProps>`
  color: ${Theme.elements.cardText};
  font-family: 'Roboto_400Regular';
  font-size: 12px;
  text-transform: uppercase;
`;

export const CardTextContainer = styled.View<ViewProps>`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const CardTextRow = styled.View<ViewProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const Container = styled.View<ViewProps>`
  align-items: center;
  flex: 1;
  background-color: ${Theme.default.background}
`;
