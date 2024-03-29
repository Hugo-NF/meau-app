import styled from 'styled-components/native';

import { Theme } from '../../constants';
import { ButtonType } from '../../types/components/AsyncButton';

export const Button = styled.TouchableOpacity<ButtonType>`
  flex: ${(props) => props.flex};
  flex-direction: ${(props) => props.flexDirection};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  max-height: ${(props) => props.height};
  background-color: ${(props) => props.backgroundColor};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  border-radius: ${(props) => props.borderRadius};
  align-self: ${(props) => props.alignSelf};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  elevation: ${(props) => props.elevation};
`;

Button.defaultProps = {
  flex: 1,
  flexDirection: 'row',
  width: '40%',
  height: '35px',
  backgroundColor: Theme.default.primary,
  marginTop: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  borderRadius: '0px',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
};
