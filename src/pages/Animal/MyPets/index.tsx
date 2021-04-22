import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import { Container } from './styles';

// Service imports.
import animalAPI from '../../../services/animal/api';
import userAPI from '../../../services/user/api';
import adoptionAPI from '../../../services/adoption/api';

const MyPets = (): JSX.Element => {
  const navigation = useNavigation();

  const [fetchedPets, setFetchedPets] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, false);
  }, [navigation]);

  const fetchPets = (): void => {
    const user = userAPI.currentUserDocument();

    animalAPI.getOwnedByUser(user)
      .then((result) => {
        const data = result.docs.map((doc) => ({ id: doc.id, ...(doc.data()) }));
        result.docs.forEach((doc) => {
          adoptionAPI.countNewInterestedIn(doc.ref).then((r) => console.log(doc.data().name, r));
        });
        setFetchedPets(data);
      });
  };

  useEffect(() => fetchPets(), []);

  return (
    <HeaderLayout
      headerShown
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
              imageUrlPromise={
                animalAPI.getPictureDownloadURL(`${pet.pictures.length > 0 ? `${pet.pictures[0]}` : 'pet.jpg'}`)
              }
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
              headerBackground={Theme.elements.headerPrimary}
              pet={{ id: pet.id }}
              onPress={() => navigation.navigate('AnimalDetails', { animalUID: pet.id })}
            />
          ))
        }
      </Container>
    </HeaderLayout>
  );
};

export default MyPets;
