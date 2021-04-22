import React, { useLayoutEffect } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useNavigation } from '@react-navigation/native';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import HeaderLayout from '../../../layouts/HeaderLayout';

import AnimalCard from '../../../components/AnimalCard';
import InfiniteScroll from '../../../components/InfiniteScroll';

import { Theme } from '../../../constants';

import { Animal } from '../../../types/animal';

import {
  CardText, CardTextContainer, CardTextRow, Container,
} from './styles';

// Service imports.
import animalAPI from '../../../services/animal/api';
import userAPI from '../../../services/user/api';
import adoptionAPI from '../../../services/adoption/api';

const MyPets = (): JSX.Element => {
  const user = userAPI.currentUserDocument();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimaryDark, false);
  }, [navigation]);

  const animalKey = (animalItem: Animal): string => animalItem.id;

  const formatAnimal = (pet: Animal): JSX.Element => (
    <AnimalCard
      key={pet?.id}
      imageUrl={pet?.pictures.length > 0 ? pet?.pictures[0] : null}
      body={(
        <CardTextContainer>
          <CardTextRow>
            <CardText>{pet?.newInterests} novos interessados</CardText>
          </CardTextRow>
        </CardTextContainer>
      )}
      title={pet?.name}
      headerOptions={pet?.newInterests > 0 && (
        <MaterialIcons
          name="error"
          size={24}
          color={Theme.elements.cardText}
        />
      )}
      headerBackground={Theme.elements.headerPrimary}
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
      query = animalAPI.createQueryByUserUid(user, '==', {
        limit: pageSize,
        orderBy,
      });
    } else {
      query = animalAPI.createQueryByUserUid(user, '==', {
        limit: (pageNumber - 1) * pageSize,
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
              adoptionAPI.countNewInterestedIn(childSnapshot.ref)
                .then((newInterests) => {
                  item.newInterests = newInterests;
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

export default MyPets;
