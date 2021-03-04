import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import MenuDrawer from 'react-native-side-drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styledComponents } from './styles';

interface IHeaderLayoutProps {
  children: React.ReactNode,
}

export default function HeaderLayout({ children }: IHeaderLayoutProps): JSX.Element {
  // Hooks
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation();

  // Styled components desestructuring
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
      <HeaderTitle>Close</HeaderTitle>
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
        <HeaderContainer>
          <ActionButton onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu-sharp" size={24} />
          </ActionButton>
          <HeaderTitle>Login</HeaderTitle>
          <ActionButton>
            <Ionicons name="menu-sharp" size={24} />
          </ActionButton>
        </HeaderContainer>
        <PageContainer>
          {children}
        </PageContainer>
      </MenuDrawer>
    </LayoutContainer>
  );
}
