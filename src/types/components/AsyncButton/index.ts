import React from 'react';
import { TouchableOpacityProps } from 'react-native';

export interface ButtonType extends TouchableOpacityProps {
  flex?: number,
  flexDirection?: string,
  width?: string,
  height?: string,
  backgroundColor?: string,
  marginTop?: string,
  marginBottom?: string,
  marginLeft?: string,
  marginRight?: string,
  borderRadius?: string,
  alignSelf?: string,
  alignItems?: string,
  justifyContent?: string,
  elevation?: number,
}

export interface IButtonProps extends ButtonType {
  children: React.ReactNode,
  asyncAction: boolean,
  callback: <GestureResponderEvent>(arg: GestureResponderEvent) => void,
  activityIndicator?: Record<string, unknown>,
  styles?: Record<string, unknown>,
}
