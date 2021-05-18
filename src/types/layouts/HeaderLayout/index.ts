import { TextProps, ViewProps } from 'react-native';

export interface ITitleProps extends TextProps {
  fontFamily?: string,
  fontSize?: string,
  color?: string,
}

export interface IHeaderProps extends ViewProps {
  maxHeight?: string,
  height?: string,
  backgroundColor?: string,
}

export type HeaderActions = 'back' | 'drawer' | 'share' | 'search' | 'options';

export interface IButtonAction {
  hidden?: boolean,
  actionType?: HeaderActions,
  iconColor?: string,
  onPress?: () => void,
}

export interface IRoutesDrawer {
  path: string,
  displayName: string,
  icon: JSX.Element
}

export interface IHeaderLayoutProps {
  disableScrollView?: boolean,
  headerShown: boolean,
  headerStyles?: IHeaderProps,
  title: string,
  titleStyles?: ITitleProps,
  leftAction: IButtonAction,
  rightAction: IButtonAction,
  children: React.ReactNode,
  drawerRoutes?: Array<IRoutesDrawer>,
  drawerUser?: boolean
}
