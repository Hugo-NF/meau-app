// Package imports.
import { TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

// Style imports.
import { Theme } from '../../../constants';

export const CardText = styled.Text<TextProps>`
  color: ${Theme.elements.cardText};
  font-family: 'Roboto_400Regular';
  font-size: 12px;
`;

export const CardTextContainer = styled.View<ViewProps>`
   flex: 1;
   flexDirection: column;
   justifyContent: center;
`;

export const CardTextRow = styled.View<ViewProps>`
   flex: 1;
   flexDirection: row;
   justifyContent: space-around;
`;

export const Container = styled.View<ViewProps>`
    margin-top: 8px;
    align-items: center;
    flex: 1;
`;
