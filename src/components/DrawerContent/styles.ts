import { TouchableOpacityProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

import { Theme } from '../../constants';

export const DrawerContainer = styled.View<ViewProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${Theme.default.background};
`;

export const CloseButton = styled.TouchableOpacity<TouchableOpacityProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  max-height: 24px;
  background-color: green;
`;
