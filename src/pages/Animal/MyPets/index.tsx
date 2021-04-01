import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import storage from '@react-native-firebase/storage';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme, Values } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Container } from './styles';

export const MyPets = (): JSX.Element => {
  const navigation = useNavigation();

  const [fetchedPets, setFetchedPets] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, false);
  }, [navigation]);

  const fetchPets = (): void => {
    const { currentUser } = auth();
    const user = firestore().collection('users').doc(currentUser?.uid);

    firestore().collection('animals').orderBy('name').where('owner', '==', user)
      .get()
      .then((result) => {
        const data = result.docs.map((doc) => ({ id: uuidv4(), ...(doc.data()) }));
        setFetchedPets(data);
      });
  };

  useEffect(() => fetchPets(), []);

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
        {
            fetchedPets.map((pet) => (
              <AnimalCard
                key={uuidv4()}
                imageUrlPromise={storage().ref(`${Values.IMAGE_DIRECTORY}/${pet.pictures.length > 0 ? `${pet.pictures[0]}` : 'pet.jpg'}`).getDownloadURL()}
                body={
                  <Text style={{ textAlign: 'center', lineHeight: 20 }}>0 NOVOS INTERESSADOS{'\n'}ADOÇÃO</Text>
              }
                title={pet.name}
                headerOptions={(
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={24}
                    color={Theme.elements.headerText}
                  />
              )}
              />
            ))
          }
      </Container>
    </HeaderLayout>
  );
};
