import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScrollView } from 'react-native-gesture-handler';
import SideMenu from 'react-native-side-menu-updated';

import DrawerContent from '../../components/DrawerContent';

import { Theme } from '../../constants';

import { IHeaderLayoutProps, IButtonAction } from '../../types/layouts/HeaderLayout';
import { styledComponents } from './styles';

export default function HeaderLayout({
  disableScrollView,
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
          <ActionButton onPress={() => setDrawerOpen(!drawerOpen)}>
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
      case 'search':
        return (
          <ActionButton>
            <MaterialIcons
              name="search"
              size={24}
              color={buttonType?.iconColor}
            />
          </ActionButton>
        );
      case 'options':
        return (
          <ActionButton onPress={() => (buttonType.onPress ? buttonType.onPress() : null)}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={buttonType?.iconColor}
            />
          </ActionButton>
        );
    }
  };

  const renderPageContent = (disableScroll: boolean | undefined): JSX.Element => {
    const pageChild = (
      <>
        {headerShown && (
          <HeaderContainer {...headerStyles}>
            {!leftAction?.hidden && (renderActionButton(leftAction))}
            <HeaderTitle {...titleStyles}>{title}</HeaderTitle>
            {!rightAction?.hidden && (renderActionButton(rightAction))}
          </HeaderContainer>
        )}
        {children}
      </>
    );

    return disableScroll ? pageChild : (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {pageChild}
      </ScrollView>
    );
  };

  return (
    <LayoutContainer>
      <SideMenu
        autoClosing
        isOpen={drawerOpen}
        menu={(
          <DrawerContent
            key="drawer-component"
            parentDrawerOpen={drawerOpen}
            setParentDrawerOpen={setDrawerOpen}
          />
        )}
        menuPosition="left"
        openMenuOffset={304}
      >
        {renderPageContent(disableScrollView)}
      </SideMenu>
    </LayoutContainer>
  );
}

HeaderLayout.defaultProps = {
  disableScrollView: false,
  headerStyles: {},
  titleStyles: {
    fontFamily: 'Roboto_500Medium',
    fontSize: '20px',
    color: Theme.elements.textDark,
  },
  drawerRoutes: [],
  drawerUser: true,
};
