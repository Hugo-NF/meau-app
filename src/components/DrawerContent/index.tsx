import React from 'react';
import { Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
      <Text>{drawerOpen ? 'Aberto' : 'Fechado'}</Text>
    </CloseButton>
  </DrawerContainer>

);

export default DrawerContent;
