import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CloseButton, DrawerContainer } from './styles';

export interface IDrawerProps {
  drawerOpen: boolean,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const DrawerContent = ({ drawerOpen, setDrawerOpen } : IDrawerProps): JSX.Element => (
  <DrawerContainer>
    <CloseButton
      onPress={() => setDrawerOpen(false)}
    >
      <Ionicons name="md-close" size={24} color="red" />
    </CloseButton>
  </DrawerContainer>

);

export default DrawerContent;
