import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import React, { useLayoutEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import { Theme } from '../../../constants';

import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

// Typings imports
import { Age, Sex, Size } from '../../../types/animal';

// Service imports.
import animalAPI from '../../../services/animal/api';

type AnimalCardData = {
  id: string;
  name: string;
  pictures: Array<string>;
  age: Age;
  sex: Sex;
  size: Size;
};

const formatAnimal = (pet: AnimalCardData): JSX.Element => (
  <AnimalCard
    key={uuidv4()}
    imageUrlPromise={
      animalAPI.getPictureDownloadURL(`${pet.pictures.length > 0 ? `${pet.pictures[0]}` : 'pet.jpg'}`)
    }
    body={(
      <CardTextContainer>
        <CardTextRow>
          <CardText>{pet.sex}</CardText>
          <CardText>{pet.size}</CardText>
          <CardText>{pet.age}</CardText>
        </CardTextRow>
        {/* <CardTextRow>
          <CardText>
            SAMAMBAIA SUL - DISTRITO FEDERAL
          </CardText>
        </CardTextRow> */}
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
);

// Fetch pets function declaration
const fetchPets = (
  lastElement: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | undefined, pageNumber: number, pageSize: number,
): Promise<Array<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>> => {
  let query;
  const orderBy = 'name';

  if (pageNumber === 1 || lastElement == null) {
    query = animalAPI.createQuery({
      limit: pageSize,
      orderBy,
    });
  } else {
    query = animalAPI.createQuery({
      limit: (pageNumber - 1) * pageSize,
      orderBy,
      startAfter: lastElement.name,
    });
  }

  return query.get()
    .then((response) => {
      const animalArray: Array<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> = [];

      response.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        item.id = childSnapshot.id;
        animalArray.push(item as FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>);
      });

      return animalArray;
    });
};

const FeedPets = (): JSX.Element => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  return (
    <HeaderLayout
      disableScrollView
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
        <InfiniteScroll
          contentBatchSize={10}
          dataFetchQuery={fetchPets}
          formatContent={formatAnimal}
        />
        {/* {
          fetchedPets.map((pet) => (

          ))
        } */}
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
