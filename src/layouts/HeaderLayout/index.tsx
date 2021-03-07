import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import MenuDrawer from 'react-native-side-drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styledComponents, IHeaderProps, ITitleProps } from './styles';
import { Theme } from '../../constants';

type HeaderActions = 'back' | 'drawer' | 'share';

interface IButtonAction {
  hidden?: boolean,
  actionType: HeaderActions,
  iconColor?: string,
}

interface IHeaderLayoutProps {
  headerShown: boolean,
  headerStyles?: IHeaderProps,
  title: string,
  titleStyles?: ITitleProps,
  leftAction?: IButtonAction,
  rightAction?: IButtonAction,
  children: React.ReactNode,
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
    ActionButton, HeaderContainer, HeaderTitle, LayoutContainer, PageContainer,
  } = styledComponents;

  const drawerContent = (): JSX.Element => (
    <TouchableOpacity
      onPress={() => setDrawerOpen(false)}
      style={{
        flex: 1,
        backgroundColor: '#38C8EC',
        padding: 10,
      }}
    >
      <HeaderTitle {...titleStyles}>Close</HeaderTitle>
    </TouchableOpacity>
  );
  return (
    <LayoutContainer>
      <MenuDrawer
        open={drawerOpen}
        drawerContent={drawerContent()}
        drawerPercentage={45}
        animationTime={250}
        opacity={0.1}
        position="left"
      >
        { headerShown && (
        <HeaderContainer {...headerStyles}>
          {!leftAction?.hidden && (
            <ActionButton onPress={() => setDrawerOpen(true)}>
              <Ionicons
                name="menu-sharp"
                size={24}
                color={leftAction?.iconColor}
              />
            </ActionButton>
          )}
          <HeaderTitle {...titleStyles}>{title}</HeaderTitle>
          {!rightAction?.hidden && (
            <ActionButton>
              <Ionicons
                name="menu-sharp"
                size={24}
                color={leftAction?.iconColor}
              />
            </ActionButton>
          )}
        </HeaderContainer>
        )}
        <PageContainer>
          {children}
        </PageContainer>
      </MenuDrawer>
    </LayoutContainer>
  );
}

HeaderLayout.defaultProps = {
  headerStyles: {
    maxHeight: '56px',
    height: '56px',
    backgroundColor: Theme.elements.headerPrimaryDark,
  },
  titleStyles: {
    fontFamily: 'Roboto_400Regular',
    fontSize: '16px',
    color: Theme.elements.headerText,
  },
  leftAction: {
    hidden: true,
    iconColor: Theme.elements.headerText,
  },
  rightAction: {
    hidden: true,
    iconColor: Theme.elements.headerText,
  },
};
