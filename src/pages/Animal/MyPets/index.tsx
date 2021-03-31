import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import storage from '@react-native-firebase/storage';
import { FlatList, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Container } from './styles';

export const MyPets = (): JSX.Element => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, false);
  }, [navigation]);

  return (
    <HeaderLayout
      headerShown
      requireAuth
      title="Meus Pets"
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimaryDark,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'back',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        <FlatList
          data={[1, 2, 3]}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', flex: 1 }}
          renderItem={() => (
            <AnimalCard
              imageUrlPromise={storage().ref('images/pet.jpg').getDownloadURL()}
              body={
                <Text style={{ textAlign: 'center', lineHeight: 20 }}>3 NOVOS INTERESSADOS{'\n'}APADRINHAMENTO | AJUDA</Text>
              }
              title="Pequi"
              headerOptions={(
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color={Theme.elements.headerText}
                />
              )}
            />
          )}
        />
      </Container>
    </HeaderLayout>
  );
};
