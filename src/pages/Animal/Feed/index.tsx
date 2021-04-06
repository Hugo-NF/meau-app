import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import storage from '@react-native-firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { AnimalCard } from '../../../components/AnimalCard';
import { Theme, Values } from '../../../constants';
import HeaderLayout from '../../../layouts/HeaderLayout';
import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

const FeedPets = (): JSX.Element => {
  const navigation = useNavigation();

  const [fetchedPets, setFetchedPets] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  const fetchPets = (): void => {
    firestore().collection('animals').orderBy('name')
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
              imageUrlPromise={storage().ref(`${Values.IMAGE_DIRECTORY}/${pet.pictures.length > 0 ? `${pet.pictures[0]}` : 'pet.jpg'}`).getDownloadURL()}
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
              title={pet.name}
              headerOptions={(
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={24}
                  color={Theme.elements.headerText}
                />
              )}
              headerBackground={Theme.elements.headerSecondary}
              pet={{ id: pet.id }}
            />
          ))
        }
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
