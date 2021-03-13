import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import MenuDrawer from 'react-native-side-drawer';

import { Theme } from '../../constants';
import DrawerContent from '../../components/DrawerContent';

import { styledComponents, IHeaderProps, ITitleProps } from './styles';

type HeaderActions = 'back' | 'drawer' | 'share';

interface IButtonAction {
  hidden?: boolean,
  actionType?: HeaderActions,
  iconColor?: string,
}

interface IRoutesDrawer {
  path: string,
  displayName: string,
  icon: JSX.Element
}

interface IHeaderLayoutProps {
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

export default function HeaderLayout({
  headerShown,
  headerStyles,
  title,
  titleStyles,
  leftAction,
  rightAction,
  children,
}: IHeaderLayoutProps): JSX.Element {
  // Hooks
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation();

  const {
    ActionButton, HeaderContainer, HeaderTitle, LayoutContainer,
  } = styledComponents;

  const renderActionButton = (buttonType : IButtonAction): JSX.Element => {
    switch (buttonType.actionType) {
      default:
      case 'back':
        return (
          <ActionButton onPress={() => navigation.goBack()}>
            <Ionicons
              name="md-arrow-back"
              size={24}
              color={buttonType?.iconColor}
            />
          </ActionButton>
        );
      case 'drawer':
        return (
          <ActionButton onPress={() => setDrawerOpen(true)}>
            <Ionicons
              name="menu-sharp"
              size={24}
              color={buttonType?.iconColor}
            />
          </ActionButton>
        );
      case 'share':
        return (
          <ActionButton>
            <Ionicons
              name="share-social"
              size={24}
              color={buttonType?.iconColor}
            />
          </ActionButton>
        );
    }
  };

  return (
    <LayoutContainer>
      <MenuDrawer
        open={drawerOpen}
        drawerContent={DrawerContent({ drawerOpen, setDrawerOpen })}
        drawerPercentage={75}
        animationTime={250}
        opacity={0.1}
        position="left"
      >
        {headerShown && (
        <HeaderContainer {...headerStyles}>
          {!leftAction?.hidden && (renderActionButton(leftAction))}
          <HeaderTitle {...titleStyles}>{title}</HeaderTitle>
          {!rightAction?.hidden && (renderActionButton(rightAction))}
        </HeaderContainer>
        )}
        {children}
      </MenuDrawer>
    </LayoutContainer>
  );
}

HeaderLayout.defaultProps = {
  headerStyles: {
    maxHeight: '56px',
    height: '56px',
    backgroundColor: Theme.elements.headerPrimary,
  },
  titleStyles: {
    fontFamily: 'Roboto_500Medium',
    fontSize: '20px',
    color: Theme.elements.headerText,
  },
  drawerRoutes: [],
  drawerUser: true,
};