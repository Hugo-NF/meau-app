import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

// Service imports.
import userAPI from '../../../services/user/api';
import animalAPI from '../../../services/animal/api';

const FeedPets = (): JSX.Element => {
  const navigation = useNavigation();

  const [fetchedPets, setFetchedPets] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  const fetchPets = (): void => {
    const user = userAPI.currentUserDocument();
    const query = user ? animalAPI.getNotOwnedByUser(user) : animalAPI.getAll();

    query.then((result) => {
      const data = result.docs.map((doc) => ({ id: doc.id, data: doc.data() })).sort((a, b) => a.data.name.localeCompare(b.data.name));
      setFetchedPets(data);
    });
  };

  useEffect(() => fetchPets(), []);

  return (
    <HeaderLayout
      headerShown
      title="Adotar"
      headerStyles={{
        backgroundColor: Theme.elements.headerSecondaryDark,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: false,
        actionType: 'search',
      }}
    >
      <Container>
        {
          fetchedPets.map((pet) => (
            <AnimalCard
              key={uuidv4()}
              imageUrlPromise={
                animalAPI.getPictureDownloadURL(`${pet.data.pictures.length > 0 ? `${pet.data.pictures[0]}` : 'pet.jpg'}`)
              }
              body={(
                <CardTextContainer>
                  <CardTextRow>
                    <CardText>MACHO</CardText>
                    <CardText>ADULTO</CardText>
                    <CardText>MÉDIO</CardText>
                  </CardTextRow>
                  <CardTextRow>
                    <CardText>
                      SAMAMBAIA SUL - DISTRITO FEDERAL
                    </CardText>
                  </CardTextRow>
                </CardTextContainer>
              )}
              title={pet.data.name}
              headerOptions={(
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={24}
                  color={Theme.elements.headerText}
                />
              )}
              headerBackground={Theme.elements.headerSecondary}
              pet={{ id: pet.id }}
              onPress={() => navigation.navigate('AnimalDetails', { animalUID: pet.id })}
            />
          ))
        }
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
