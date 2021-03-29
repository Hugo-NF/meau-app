import { TouchableOpacityProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

import { Theme } from '../../constants';

export const DrawerContainer = styled.View<ViewProps>`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${Theme.elements.drawerBackground};
`;

export const AvatarContainer = styled.View<ViewProps>`
  margin-top: 40px;
  margin-left: 16px;
  margin-bottom: 68px;
`;

export const LogoutButton = styled.TouchableOpacity<TouchableOpacityProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  max-height: 48px;
  background-color: ${Theme.default.primary};
`;

export const LogoutText = styled.Text<TextProps>`
  font-family: 'Roboto_400Medium';
  font-size: 14px;
  text-transform: uppercase;
  color: ${Theme.elements.buttonText};
`;
