import React, { useState } from 'react';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import { Divider, List, Avatar } from 'react-native-paper';
import { ScrollView } from 'react-native';
import {
  AvatarContainer,
  DrawerContainer,
  LogoutButton,
  LogoutText,
} from './styles';

import { useAuth } from '../../services/context';

import { Theme } from '../../constants';

export interface IDrawerProps {
  drawerOpen: boolean,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const getImageUri = async (ref: string) : Promise<string> => {
  const imageRef = storage().ref(ref);
  return imageRef.getDownloadURL();
};

const DrawerContent = ({ drawerOpen, setDrawerOpen } : IDrawerProps): JSX.Element => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState('');

  const { currentUser } = useAuth();

  const logout = async (): Promise<void> => {
    await auth().signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  getImageUri('images/69afa12e-0777-4b7f-b6e4-a12cedd0d0e9.jpg')
    .then((result) => {
      setImageUri(result);
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <ScrollView nestedScrollEnabled>
      <DrawerContainer>
        {currentUser !== null && (
          <AvatarContainer>
            <Avatar.Image size={64} source={{ uri: imageUri }} />
          </AvatarContainer>
        )}
        <List.Section style={{ width: '100%' }}>
          <List.Accordion title="Hugo Fonseca">
            <List.Item title="Meu perfil" />
            <List.Item title="Meus pets" />
            <List.Item title="Favoritos" />
            <List.Item title="Chat" />
          </List.Accordion>
        </List.Section>
        <Divider />
        <List.Section style={{ width: '100%' }}>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="dog" />}
            title="Atalhos"
          >
            <List.Item title="Cadastrar um pet" />
            <List.Item title="Adotar um pet" />
            <List.Item title="Ajudar um pet" />
            <List.Item title="Apadrinhar um pet" />
          </List.Accordion>
        </List.Section>
        <Divider />
        <List.Section style={{ width: '100%' }}>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="information" />}
            title="Informações"
          >
            <List.Item title="Dicas" />
            <List.Item title="Eventos" />
            <List.Item title="Legislação" />
            <List.Item title="Termo de adoção" />
            <List.Item title="Histórias de adoção" />
          </List.Accordion>
        </List.Section>
        <List.Section style={{ width: '100%' }}>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="toolbox" />}
            title="Configurações"
          >
            <List.Item title="Privacidade" />
          </List.Accordion>
        </List.Section>
        <LogoutButton
          onPress={() => logout()}
        >
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </DrawerContainer>
    </ScrollView>
  );
};

export default DrawerContent;
