/* eslint-disable camelcase */
import React, { useState } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import { ActivityIndicator, List, Avatar } from 'react-native-paper';
import { ScrollView } from 'react-native';

import { styledComponents, styles } from './styles';

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
  // Hooks
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  // User state
  const [userDetails, setUserDetails] = useState<{displayName: string, photo: string | undefined} | null>(null);

  // Styles
  const {
    AvatarContainer,
    DrawerContainer,
    LogoutButton,
    LogoutText,
  } = styledComponents;

  const navigateTo = (route : string) : void => {
    setDrawerOpen(false);
    navigation.navigate(route);
  };

  const logout = async (): Promise<void> => {
    await auth().signOut().then(() => {
      setUserDetails(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  };

  if (currentUser === null) {
    return (
      <ScrollView nestedScrollEnabled>
        <DrawerContainer>
          <List.Section style={styles.SpacedListSection}>
            <List.Subheader>Opções</List.Subheader>
            <List.Item
              left={(props) => <List.Icon {...props} icon="login" color={Theme.elements.icon} />}
              title="Login"
              titleStyle={styles.ListItemText}
              onPress={() => navigateTo('Login')}
            />
            <List.Item
              left={(props) => <List.Icon {...props} icon="account-plus" color={Theme.elements.icon} />}
              title="Cadastro"
              titleStyle={styles.ListItemText}
              onPress={() => navigateTo('Registration')}
            />
          </List.Section>
        </DrawerContainer>
      </ScrollView>
    );
  }

  if (userDetails !== null) {
    return (
      <ScrollView nestedScrollEnabled>
        <DrawerContainer>
          <AvatarContainer>
            {userDetails?.photo === undefined
              ? (
                <Avatar.Icon
                  size={64}
                  icon="account"
                  style={{ backgroundColor: Theme.default.background, ...styles.Avatar }}
                />
              ) : (
                <Avatar.Image
                  size={64}
                  source={{ uri: userDetails?.photo }}
                  style={styles.Avatar}
                />
            )}
          </AvatarContainer>
          <List.Section style={styles.ListSection}>
            <List.Accordion
              title={userDetails?.displayName}
              left={() => <></>}
              style={{ backgroundColor: Theme.default.primary, ...styles.ListAccordion }}
              titleStyle={styles.SectionTitle}
            >
              <List.Item
                title="Meu perfil"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Meus pets"
                onPress={() => navigateTo('MyPets')}
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Favoritos"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Chat"
                titleStyle={styles.ListItemText}
              />
            </List.Accordion>
          </List.Section>
          <List.Section style={styles.ListSection}>
            <List.Accordion
              left={(props) => <List.Icon {...props} icon="paw" color={Theme.elements.icon} />}
              title="Atalhos"
              style={{ backgroundColor: Theme.elements.headerSecondary, ...styles.ListAccordion }}
              titleStyle={styles.SectionTitle}
            >
              <List.Item
                title="Cadastrar um pet"
                onPress={() => navigateTo('AnimalRegistration')}
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Adotar um pet"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Ajudar um pet"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Apadrinhar um pet"
                titleStyle={styles.ListItemText}
              />
            </List.Accordion>
          </List.Section>
          <List.Section style={styles.ListSection}>
            <List.Accordion
              left={(props) => <List.Icon {...props} icon="information" color={Theme.elements.icon} />}
              title="Informações"
              style={{ backgroundColor: Theme.elements.headerPrimary, ...styles.ListAccordion }}
              titleStyle={styles.SectionTitle}
            >
              <List.Item
                title="Dicas"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Eventos"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Legislação"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Termo de adoção"
                titleStyle={styles.ListItemText}
              />
              <List.Item
                title="Histórias de adoção"
                titleStyle={styles.ListItemText}
              />
            </List.Accordion>
          </List.Section>
          <List.Section style={styles.ListSection}>
            <List.Accordion
              left={(props) => <List.Icon {...props} icon="toolbox" color={Theme.elements.icon} />}
              title="Configurações"
              style={{ backgroundColor: Theme.elements.settingsDrawerBackground, ...styles.ListAccordion }}
              titleStyle={styles.SectionTitle}
            >
              <List.Item
                title="Privacidade"
                titleStyle={styles.ListItemText}
              />
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
  }

  if (currentUser !== null && userDetails === null) {
    console.log(currentUser);
    console.log(userDetails);
    firestore().collection('users').doc(currentUser?.uid).get()
      .then((userDocument) => {
        const userData = userDocument.data();
        if (userData?.profile_picture) {
          getImageUri(`images/${userData?.profile_picture}`)
            .then((imageRef) => {
              setUserDetails({
                displayName: userData?.username,
                photo: imageRef,
              });
            });
        } else {
          setUserDetails({
            displayName: userData?.username,
            photo: undefined,
          });
        }
      });

    return (
      <ScrollView nestedScrollEnabled>
        <DrawerContainer>
          <List.Section style={styles.SpacedListSection}>
            <List.Subheader>Carregando...</List.Subheader>
            <ActivityIndicator animating />
          </List.Section>
        </DrawerContainer>
      </ScrollView>
    );
  }

  return (
    <ScrollView nestedScrollEnabled>
      <DrawerContainer>
        <List.Section style={styles.SpacedListSection}>
          <List.Subheader>Ocorreu um erro ao carregar seu perfil de usuário</List.Subheader>
          <ActivityIndicator animating />
        </List.Section>
      </DrawerContainer>
    </ScrollView>
  );
};

export default DrawerContent;
