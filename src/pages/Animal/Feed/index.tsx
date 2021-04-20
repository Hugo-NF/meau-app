import { useNavigation } from '@react-navigation/native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import React, { useLayoutEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import {
  Age,
  AgeNames,
  Animal,
  Sex,
  SexNames,
  Size,
  SizeNames,
} from '../../../types/animal';

import { Theme } from '../../../constants';

import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

// Service imports.
import animalAPI from '../../../services/animal/api';

const formatAnimal = (pet: Animal): JSX.Element => (
  <AnimalCard
    key={uuidv4()}
    imageUrlPromise={
        animalAPI.getPictureDownloadURL(`${pet?.pictures.length > 0 ? `${pet?.pictures[0]}` : 'pet.jpg'}`)
    }
    body={(
      <CardTextContainer>
        <CardTextRow>
          <CardText>{SexNames[pet?.sex as Sex]}</CardText>
          <CardText>{SizeNames[pet?.size as Size]}</CardText>
          <CardText>{AgeNames[pet?.age as Age]}</CardText>
        </CardTextRow>
        {/* <CardTextRow>
            <CardText>
              SAMAMBAIA SUL - DISTRITO FEDERAL
            </CardText>
          </CardTextRow> */}
      </CardTextContainer>
      )}
    title={pet?.name}
    headerOptions={(
      <MaterialCommunityIcons
        name="heart-outline"
        size={24}
        color={Theme.elements.headerText}
      />
      )}
    headerBackground={Theme.elements.headerSecondary}
    pet={{ id: pet?.id }}
  />
);

// Fetch pets function declaration
const fetchPets = (
  lastElement: Animal | null, pageNumber: number, pageSize: number,
): Promise<Array<Animal>> => {
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
      const animalArray: Array<Animal> = [];

      response.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        item.id = childSnapshot.id;
        animalArray.push(item as Animal);
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
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
