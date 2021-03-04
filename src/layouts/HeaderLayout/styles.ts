import { TouchableOpacityProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import Constants from 'expo-constants';

export const styledComponents = {
  LayoutContainer: styled.View<ViewProps>`
    flex: 1;
    flex-direction: column;
  `,
  PageContainer: styled.View<ViewProps>`
    flex: 1;
  `,
  HeaderContainer: styled.View<ViewProps>`
    flex: 1;
    flex-direction: row;
    max-height: 56px;
    margin-top: ${Constants.statusBarHeight}px;
    justify-content: space-between;
    align-items: center;
    background-color: black;
  `,
  HeaderTitle: styled.Text<TextProps>`
    font-family: 'Roboto_400Regular';
    font-size: 20px;
    margin-left: 16px;
    margin-right: auto;
    color: red;
  `,
  ActionButton: styled.TouchableOpacity<TouchableOpacityProps>`
    width: 24px;
    height: 24px;
    margin: 16px;
    background-color: transparent;
  `,
};
