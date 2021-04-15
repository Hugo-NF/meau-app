import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../../constants';

export const Container = styled.View<ViewProps>`
  padding-top: 16px;
  flex: 1;
  align-items: center;
  background-color: ${Theme.default.background};
`;
