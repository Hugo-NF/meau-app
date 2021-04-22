import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import { Theme } from '../../../constants';

import {
  Age,
  AgeNames,
  Animal,
  Sex,
  SexNames,
  Size,
  SizeNames,
} from '../../../types/animal';

import { formatLocation } from '../../../utils/formatTexts';

import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

// Service imports.
import userAPI from '../../../services/user/api';
import animalAPI from '../../../services/animal/api';

const FeedPets = (): JSX.Element => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  const animalKey = (animalItem: Animal): string => animalItem.id;

  const formatAnimal = (pet: Animal): JSX.Element => (
    <AnimalCard
      key={pet?.id}
      imageUrl={pet?.pictures.length > 0 ? pet?.pictures[0] : null}
      body={(
        <CardTextContainer>
          <CardTextRow>
            <CardText>{SexNames[pet?.sex as Sex]}</CardText>
            <CardText>{SizeNames[pet?.size as Size]}</CardText>
            <CardText>{AgeNames[pet?.age as Age]}</CardText>
          </CardTextRow>
          <CardTextRow>
            <CardText>
              {formatLocation(pet?.ownerDocument)}
            </CardText>
          </CardTextRow>
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
      onPress={() => navigation.navigate('AnimalDetails', { animalUID: pet?.id })}
    />
  );

  // Fetch pets function declaration
  const fetchPets = (
    lastElement: Animal | null, pageNumber: number, pageSize: number,
  ): Promise<Array<Animal>> => {
    let query : FirebaseFirestoreTypes.Query;
    const orderBy = 'name';

    if (pageNumber === 1 || lastElement == null) {
      query = animalAPI.createQuery({
        limit: pageSize,
        orderBy,
      });
    } else {
      query = animalAPI.createQuery({
        limit: pageSize,
        orderBy,
        startAfter: lastElement.name,
      });
    }

    return new Promise((resolve, reject) => {
      query.get()
        .then((response) => {
          const promisesArray : Array<Promise<Animal>> = [];

          response.forEach((childSnapshot) => promisesArray.push(new Promise((resolveItem, rejectItem) => {
            const item = childSnapshot.data();
            item.id = childSnapshot.id;
            if (item?.owner !== undefined) {
              userAPI.getReference(item?.owner)
                .then((userDocument) => {
                  item.ownerDocument = userDocument.data();
                  resolveItem(item as Animal);
                })
                .catch((error) => rejectItem(error));
            } else {
              resolveItem(item as Animal);
            }
          })));

          Promise.all(promisesArray).then((animalArray) => resolve(animalArray)).catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  };

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
          keyExtractorFunction={animalKey}
          contentBatchSize={10}
          dataFetchQuery={fetchPets}
          formatContent={formatAnimal}
        />
      </Container>
    </HeaderLayout>
  );
};

export default FeedPets;
