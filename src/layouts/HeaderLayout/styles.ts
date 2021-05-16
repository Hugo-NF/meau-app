import { TouchableOpacityProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

import { ITitleProps, IHeaderProps } from '../../types/layouts/HeaderLayout';

export const styledComponents = {
  LayoutContainer: styled.View<ViewProps>`
    flex: 1;
    flex-direction: column;
    margin-top: ${Constants.statusBarHeight}px;
  `,
  HeaderContainer: styled.View<IHeaderProps>`
    flex: 1;
    flex-direction: row;
    max-height: ${(props) => props.maxHeight};
    height: ${(props) => props.height};
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.backgroundColor};
  `,
  HeaderTitle: styled.Text<ITitleProps>`
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    margin-left: 16px;
    margin-right: auto;
    color: ${(props) => props.color};
  `,
  ActionButton: styled.TouchableOpacity<TouchableOpacityProps>`
    width: 24px;
    height: 24px;
    margin: 16px;
    background-color: transparent;
  `,
};
