/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

import { List, Avatar } from 'react-native-paper';
import { ScrollView } from 'react-native';

import { styledComponents, styles } from './styles';

import { Theme } from '../../constants';
import { getNameInitials } from '../../utils/getNameInitials';

import userAPI from '../../services/user/api';
import { useAuth } from '../../contexts/user/context';

export interface IDrawerProps {
  setParentDrawerOpen: (_: boolean) => void,
}

const fetchProfile = async (currentUser: FirebaseAuthTypes.User | null) : Promise<{displayName: string, photo: string | undefined} | undefined> => {
  if (currentUser != null) {
    const user = await userAPI.getUser(currentUser?.uid);
    const userData = user.data();

    if (userData?.profile_picture) {
      try {
        const imageRef = await userAPI.getPictureDownloadURL(userData?.profile_picture);
        return {
          displayName: userData?.username,
          photo: imageRef,
        };
      } catch (exc) {
        return {
          displayName: userData?.username,
          photo: undefined,
        };
      }
    } else {
      return {
        displayName: userData?.username,
        photo: undefined,
      };
    }
  }
  return undefined;
};

const DrawerContent = ({ setParentDrawerOpen } : IDrawerProps): JSX.Element => {
  // Hooks
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  // User state
  const [userDetails, setUserDetails] = useState<{displayName: string, photo: string | undefined} | null>(null);
  useEffect(() => {
    fetchProfile(currentUser).then((data) => {
      if (data !== undefined) {
        setUserDetails({
          displayName: data.displayName,
          photo: data?.photo,
        });
      }
    }).catch(() => null);
  }, [currentUser]);

  // Styles
  const {
    AvatarContainer,
    DrawerContainer,
    LogoutButton,
    LogoutText,
  } = styledComponents;

  const navigateTo = (route : string) : void => {
    setParentDrawerOpen(false);
    navigation.navigate(route);
  };

  const logout = async (): Promise<void> => {
    await userAPI.signOut();
    setUserDetails(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  // Drawer content when unauthorized
  if (userDetails == null) {
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

  return (
    <ScrollView nestedScrollEnabled>
      <DrawerContainer>
        <AvatarContainer>
          {userDetails?.photo === undefined
            ? (
              <Avatar.Text
                size={64}
                label={getNameInitials(userDetails.displayName)}
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
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Meus pets"
              onPress={() => navigateTo('MyPets')}
              titleStyle={styles.ListItemText}
            />
            <List.Item
              title="Favoritos"
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Chat"
              titleStyle={styles.ListItemTextDisabled}
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
              onPress={() => navigateTo('AnimalFeed')}
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
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Eventos"
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Legislação"
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Termo de adoção"
              titleStyle={styles.ListItemTextDisabled}
            />
            <List.Item
              title="Histórias de adoção"
              titleStyle={styles.ListItemTextDisabled}
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
              titleStyle={styles.ListItemTextDisabled}
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
};

export default DrawerContent;
